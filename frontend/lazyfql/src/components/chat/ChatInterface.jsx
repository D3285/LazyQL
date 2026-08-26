import { useState } from "react";

import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

import { useGenerateSQL } from "../hooks/useGenerateSQL";

function ChatInterface({
  schema,
  onQueryGenerated,
}) {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");

  const {
    generate,
    isLoading: isGenerating,
  } = useGenerateSQL();

  const handleAsk = async (question = query) => {
    const cleanQuestion = question.trim();

    if (!cleanQuestion || isGenerating) {
      return;
    }

    if (!schema) {
      setError(
        "Database schema is not available yet."
      );
      return;
    }

    setError("");

    setMessages((previous) => [
      ...previous,
      {
        id: `${Date.now()}-user`,
        role: "user",
        text: cleanQuestion,
      },
    ]);

    setQuery("");

    try {
      const result = await generate({
        question: cleanQuestion,
        schema,
      });

      if (!result?.sql) {
        throw new Error(
          "The AI did not return a SQL query."
        );
      }

      setMessages((previous) => [
        ...previous,
        {
          id: `${Date.now()}-assistant`,
          role: "assistant",
          text:
            result.explanation ||
            "SQL generated successfully.",
        },
      ]);

      onQueryGenerated?.({
        question: cleanQuestion,
        sql: result.sql,
        explanation:
          result.explanation || "",
        confidence:
          typeof result.confidence === "number"
            ? result.confidence
            : null,
      });
    } catch (err) {
      const message =
        err?.message ||
        "Unable to generate SQL.";

      setError(message);

      setMessages((previous) => [
        ...previous,
        {
          id: `${Date.now()}-error`,
          role: "assistant",
          text:
            "I could not generate a query for that request.",
        },
      ]);
    }
  };

  return (
    <div className="flex min-h-0 flex-col gap-4">

      <MessageList
        messages={messages}
        isGenerating={isGenerating}
        error={error}
      />

      <MessageInput
        query={query}
        onQueryChange={setQuery}
        onAsk={handleAsk}
        isGenerating={isGenerating}
      />

    </div>
  );
}

export default ChatInterface;