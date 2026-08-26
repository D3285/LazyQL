import { useState } from "react";
import { generateSQL } from "../../api/generate";

export function useGenerateSQL() {
  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [result, setResult] =
    useState(null);

  const generate = async ({
    question,
    schema,
  }) => {
    try {
      setIsLoading(true);
      setError("");

      const data = await generateSQL({
        question,
        schema,
      });

      setResult(data);

      return data;
    } catch (err) {
      const message =
        err?.message ||
        "Unable to generate SQL.";

      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError("");
  };

  return {
    generate,
    result,
    isLoading,
    error,
    reset,
  };
}