import { useEffect, useState } from "react";

const STORAGE_KEY =
  "lazyql_query_history";

const MAX_HISTORY = 30;

function readHistory() {
  try {
    const stored =
      localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);

    return Array.isArray(parsed)
      ? parsed
      : [];
  } catch {
    return [];
  }
}

export function useQueryHistory() {
  const [history, setHistory] =
    useState(readHistory);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(history)
    );
  }, [history]);

  const addQuery = ({
    question,
    sql,
    explanation = "",
  }) => {
    if (!question?.trim() || !sql?.trim()) {
      return;
    }

    const item = {
      id: crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`,

      question: question.trim(),

      sql: sql.trim(),

      explanation,

      createdAt:
        new Date().toISOString(),
    };

    setHistory((previous) => [
      item,
      ...previous.filter(
        (entry) =>
          entry.question !==
          item.question
      ),
    ].slice(0, MAX_HISTORY));
  };

  const removeQuery = (id) => {
    setHistory((previous) =>
      previous.filter(
        (item) => item.id !== id
      )
    );
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return {
    history,
    addQuery,
    removeQuery,
    clearHistory,
  };
}