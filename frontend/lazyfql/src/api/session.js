import { apiRequest } from "./client";

export async function createSQLiteSession(file) {
  if (!file) {
    throw new Error("Please select a SQLite database file.");
  }

  const formData = new FormData();

  formData.append("database_type", "sqlite");
  formData.append("file", file);

  return apiRequest("/database/session", {
    method: "POST",
    body: formData,
  });
}

export async function createPostgreSQLSession(connection) {
  return apiRequest("/database/session", {
    method: "POST",
    body: JSON.stringify({
      database_type: "postgresql",
      host: connection.host,
      port: Number(connection.port),
      database: connection.database,
      username: connection.username,
      password: connection.password,
    }),
  });
}