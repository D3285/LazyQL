import { apiRequest } from "./client";

export async function getDatabaseSchema(sessionId) {
  if (!sessionId) {
    throw new Error("A database session is required.");
  }

  return apiRequest(
    `/database/schema?session_id=${encodeURIComponent(sessionId)}`,
    {
      method: "POST",
    },
  );
}