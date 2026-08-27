import { apiRequest } from "./client";

export async function createDatabaseSession({
  databaseType,
  connectionUrl,
}) {
  if (!databaseType) {
    throw new Error("Database type is required.");
  }

  if (!connectionUrl?.trim()) {
    throw new Error("Connection URL is required.");
  }

  return apiRequest("/database/session", {
    method: "POST",
    body: JSON.stringify({
      database_type: databaseType,
      connection_url: connectionUrl.trim(),
    }),
  });
}