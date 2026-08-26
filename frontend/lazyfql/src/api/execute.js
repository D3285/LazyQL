import { apiRequest } from "./client";

export async function executeSQL({
  sessionId,
  sql,
}) {
  if (!sessionId) {
    throw new Error(
      "A database session is required."
    );
  }

  if (!sql?.trim()) {
    throw new Error(
      "SQL query is required."
    );
  }

  return apiRequest(
    "/database/execute",
    {
      method: "POST",
      body: JSON.stringify({
        session_id: sessionId,
        sql: sql.trim(),
      }),
    }
  );
}