import { apiRequest } from "./client";

export async function generateSQL({ sessionId, question }) {
  if (!sessionId) {
    throw new Error("A database session is required.");
  }

  if (!question?.trim()) {
    throw new Error("A question is required.");
  }

  return apiRequest("/generate", {
    method: "POST",
    body: JSON.stringify({
      session_id: sessionId,
      question: question.trim(),
    }),
  });
}
