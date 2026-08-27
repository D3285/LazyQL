import { apiRequest } from "./client";

export async function createSQLiteSession(file) {
  if (!file) {
    throw new Error("SQLite database file is required.");
  }

  const formData = new FormData();

  formData.append("database_type", "sqlite");
  formData.append("file", file);

  return apiRequest("/database/session", {
    method: "POST",
    body: formData,
  });
}

export async function createPostgreSQLSession(connectionUrl) {
  if (!connectionUrl?.trim()) {
    throw new Error("Connection URL is required.");
  }

  const formData = new FormData();

  formData.append("database_type", "postgresql");
  formData.append("connection_url", connectionUrl.trim());

  return apiRequest("/database/session", {
    method: "POST",
    body: formData,
  });
}
