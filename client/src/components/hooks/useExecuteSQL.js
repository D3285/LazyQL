import { useState } from "react";
import { executeSQL } from "../../api/execute";

export function useExecuteSQL() {
  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [result, setResult] =
    useState(null);

  const execute = async ({
    sessionId,
    sql,
  }) => {
    try {
      setIsLoading(true);
      setError("");

      const data = await executeSQL({
        sessionId,
        sql,
      });

      setResult(data);

      return data;
    } catch (err) {
      const message =
        err?.message ||
        "Unable to execute SQL.";

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
    execute,
    result,
    isLoading,
    error,
    reset,
  };
}