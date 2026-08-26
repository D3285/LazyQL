import { apiRequest } from "./client";

export async function generateSQL({
  question,
  schema,
}) {
  if (!question?.trim()) {
    throw new Error(
      "A question is required."
    );
  }

  if (!schema) {
    throw new Error(
      "Database schema is required."
    );
  }

  return apiRequest("/generate", {
    method: "POST",
    body: JSON.stringify({
      question: question.trim(),
      schema,
    }),
  });
}