import { useState } from "react";

import {
  createSQLiteSession,
  createPostgreSQLSession,
} from "../api/session";

function ConnectionPage({ onConnect, onBack }) {
  const [databaseType, setDatabaseType] =
    useState("sqlite");

  const [form, setForm] = useState({
    host: "localhost",
    port: "5432",
    database: "",
    username: "",
    password: "",
  });

  const [sqliteFile, setSQLiteFile] =
    useState(null);

  const [isConnecting, setIsConnecting] =
    useState(false);

  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleSQLiteFileChange = (event) => {
    const file =
      event.target.files?.[0] || null;

    setSQLiteFile(file);
    setError("");
  };

  const handleDatabaseTypeChange = (type) => {
    setDatabaseType(type);
    setError("");
  };

  const validatePostgreSQL = () => {
    if (!form.host.trim()) {
      return "Host is required.";
    }

    if (!form.port) {
      return "Port is required.";
    }

    const port = Number(form.port);

    if (
      !Number.isInteger(port) ||
      port < 1 ||
      port > 65535
    ) {
      return "Port must be between 1 and 65535.";
    }

    if (!form.database.trim()) {
      return "Database name is required.";
    }

    if (!form.username.trim()) {
      return "Username is required.";
    }

    if (!form.password) {
      return "Password is required.";
    }

    return null;
  };

  const validateSQLite = () => {
    if (!sqliteFile) {
      return "Please select a SQLite database file.";
    }

    const validExtensions = [
      ".db",
      ".sqlite",
      ".sqlite3",
    ];

    const fileName =
      sqliteFile.name.toLowerCase();

    const validExtension =
      validExtensions.some((extension) =>
        fileName.endsWith(extension)
      );

    if (!validExtension) {
      return "Please select a valid SQLite database file.";
    }

    return null;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isConnecting) {
      return;
    }

    try {
      setError("");
      setIsConnecting(true);

      let sessionData;

      if (databaseType === "sqlite") {
        const validationError =
          validateSQLite();

        if (validationError) {
          throw new Error(validationError);
        }

        sessionData =
          await createSQLiteSession(
            sqliteFile
          );
      } else {
        const validationError =
          validatePostgreSQL();

        if (validationError) {
          throw new Error(validationError);
        }

        sessionData =
          await createPostgreSQLSession(
            form
          );
      }

      if (!sessionData?.session_id) {
        throw new Error(
          "Database connected, but the backend did not return a session_id."
        );
      }

      console.log(
        "Database session created:",
        sessionData
      );

      if (typeof onConnect !== "function") {
        throw new Error(
          "Connection handler is not available."
        );
      }

      onConnect(sessionData);
    } catch (err) {
      console.error(
        "Database connection failed:",
        err
      );

      setError(
        err?.message ||
          "Unable to establish database connection."
      );
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#080c11] text-[#d7e0e7]">

      {/* HEADER */}

      <header className="flex h-16 items-center justify-between border-b border-[#202a34] bg-[#0c1117] px-5 md:px-8">

        <div className="flex items-center gap-3">

          <div className="grid h-9 w-9 place-items-center rounded-md border border-[#344653] bg-[#111820] font-mono text-xs font-semibold text-[#72b5c4]">
            LQ
          </div>

          <div>
            <div className="font-mono text-sm font-semibold tracking-[0.25em] text-[#d7e0e7]">
              LAZYQL
            </div>

            <div className="hidden font-mono text-[8px] uppercase tracking-[0.2em] text-[#53616d] sm:block">
              Natural Language SQL
            </div>
          </div>

        </div>

        {onBack && (
          <button
            type="button"
            onClick={onBack}
            disabled={isConnecting}
            className="font-mono text-[9px] uppercase tracking-wider text-[#687783] transition hover:text-[#aebbc5] disabled:opacity-50"
          >
            ← Back
          </button>
        )}

      </header>

      {/* MAIN */}

      <section className="flex min-h-[calc(100vh-64px)] items-center justify-center px-5 py-12">

        <div className="w-full max-w-2xl">

          {/* TITLE */}

          <div className="mb-8">

            <div className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-[#5d96a3]">
              Database Connection
            </div>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#e6edf3] md:text-4xl">
              Connect your database
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-[#71808c]">
              Connect a local SQLite database or
              an existing PostgreSQL database.
              LazyQL will inspect the schema and
              use it to generate SQL.
            </p>

          </div>

          {/* CARD */}

          <div className="rounded-xl border border-[#202a34] bg-[#0e141b] shadow-2xl">

            {/* DATABASE TYPE */}

            <div className="grid grid-cols-2 border-b border-[#202a34]">

              <button
                type="button"
                onClick={() =>
                  handleDatabaseTypeChange(
                    "sqlite"
                  )
                }
                disabled={isConnecting}
                className={`px-5 py-4 font-mono text-[10px] font-semibold uppercase tracking-wider transition ${
                  databaseType === "sqlite"
                    ? "border-b-2 border-[#5aa9bb] bg-[#111820] text-[#8ed0df]"
                    : "text-[#667581] hover:text-[#aebbc5]"
                }`}
              >
                SQLite
              </button>

              <button
                type="button"
                onClick={() =>
                  handleDatabaseTypeChange(
                    "postgresql"
                  )
                }
                disabled={isConnecting}
                className={`px-5 py-4 font-mono text-[10px] font-semibold uppercase tracking-wider transition ${
                  databaseType ===
                  "postgresql"
                    ? "border-b-2 border-[#5aa9bb] bg-[#111820] text-[#8ed0df]"
                    : "text-[#667581] hover:text-[#aebbc5]"
                }`}
              >
                PostgreSQL
              </button>

            </div>

            {/* ERROR */}

            {error && (
              <div className="mx-6 mt-6 rounded-md border border-[#51333a] bg-[#1b1115] p-4">

                <div className="font-mono text-[9px] font-semibold uppercase tracking-wider text-[#df7c8a]">
                  Connection Error
                </div>

                <p className="mt-2 text-sm leading-6 text-[#c6a1a7]">
                  {error}
                </p>

              </div>
            )}

            {/* CONTENT */}

            <div className="p-6 md:p-8">

              {/* SQLITE */}

              {databaseType === "sqlite" && (
                <form
                  onSubmit={handleSubmit}
                >

                  <div className="rounded-lg border border-dashed border-[#344653] bg-[#0a0f15] p-8 text-center">

                    <div className="mx-auto grid h-12 w-12 place-items-center rounded-lg border border-[#293641] bg-[#111820] font-mono text-lg text-[#5d96a3]">
                      DB
                    </div>

                    <h2 className="mt-5 text-base font-semibold text-[#d7e0e7]">
                      Select SQLite database
                    </h2>

                    <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-[#687783]">
                      Choose a local `.db`,
                      `.sqlite`, or
                      `.sqlite3` file.
                    </p>

                    <input
                      id="sqlite-file"
                      type="file"
                      accept=".db,.sqlite,.sqlite3"
                      onChange={
                        handleSQLiteFileChange
                      }
                      disabled={
                        isConnecting
                      }
                      className="mt-6 block w-full text-xs text-[#87949f] file:mr-4 file:rounded-md file:border file:border-[#344653] file:bg-[#151d26] file:px-4 file:py-2 file:text-xs file:text-[#aebbc5] hover:file:bg-[#1b2530]"
                    />

                  </div>

                  {sqliteFile && (
                    <div className="mt-4 rounded-md border border-[#293641] bg-[#111820] px-4 py-3">

                      <div className="font-mono text-[9px] uppercase tracking-wider text-[#5d96a3]">
                        Selected database
                      </div>

                      <div className="mt-1 break-all text-sm text-[#cbd5dd]">
                        {sqliteFile.name}
                      </div>

                      <div className="mt-1 font-mono text-[9px] text-[#596875]">
                        {formatFileSize(
                          sqliteFile.size
                        )}
                      </div>

                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={
                      isConnecting ||
                      !sqliteFile
                    }
                    className="mt-6 w-full rounded-md bg-[#4c9aaa] px-5 py-3.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#071014] transition hover:bg-[#62b4c4] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {isConnecting
                      ? "Opening database..."
                      : "Connect SQLite →"}
                  </button>

                </form>
              )}

              {/* POSTGRESQL */}

              {databaseType ===
                "postgresql" && (
                <form
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >

                  <div>
                    <label
                      htmlFor="host"
                      className="mb-2 block font-mono text-[9px] uppercase tracking-wider text-[#687783]"
                    >
                      Host
                    </label>

                    <input
                      id="host"
                      name="host"
                      value={form.host}
                      onChange={handleChange}
                      placeholder="localhost"
                      disabled={isConnecting}
                      autoComplete="off"
                      className="w-full rounded-md border border-[#293641] bg-[#080c11] px-4 py-3 text-sm text-[#d7e0e7] outline-none placeholder:text-[#4f5d68] focus:border-[#4c8494] disabled:opacity-50"
                    />
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">

                    <div>
                      <label
                        htmlFor="port"
                        className="mb-2 block font-mono text-[9px] uppercase tracking-wider text-[#687783]"
                      >
                        Port
                      </label>

                      <input
                        id="port"
                        name="port"
                        type="number"
                        min="1"
                        max="65535"
                        value={form.port}
                        onChange={handleChange}
                        disabled={isConnecting}
                        className="w-full rounded-md border border-[#293641] bg-[#080c11] px-4 py-3 font-mono text-sm text-[#d7e0e7] outline-none focus:border-[#4c8494] disabled:opacity-50"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="database"
                        className="mb-2 block font-mono text-[9px] uppercase tracking-wider text-[#687783]"
                      >
                        Database
                      </label>

                      <input
                        id="database"
                        name="database"
                        value={form.database}
                        onChange={handleChange}
                        placeholder="company"
                        disabled={isConnecting}
                        autoComplete="off"
                        className="w-full rounded-md border border-[#293641] bg-[#080c11] px-4 py-3 text-sm text-[#d7e0e7] outline-none placeholder:text-[#4f5d68] focus:border-[#4c8494] disabled:opacity-50"
                      />
                    </div>

                  </div>

                  <div>
                    <label
                      htmlFor="username"
                      className="mb-2 block font-mono text-[9px] uppercase tracking-wider text-[#687783]"
                    >
                      Username
                    </label>

                    <input
                      id="username"
                      name="username"
                      value={form.username}
                      onChange={handleChange}
                      placeholder="postgres"
                      disabled={isConnecting}
                      autoComplete="username"
                      className="w-full rounded-md border border-[#293641] bg-[#080c11] px-4 py-3 text-sm text-[#d7e0e7] outline-none placeholder:text-[#4f5d68] focus:border-[#4c8494] disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="mb-2 block font-mono text-[9px] uppercase tracking-wider text-[#687783]"
                    >
                      Password
                    </label>

                    <input
                      id="password"
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      disabled={isConnecting}
                      autoComplete="current-password"
                      className="w-full rounded-md border border-[#293641] bg-[#080c11] px-4 py-3 text-sm text-[#d7e0e7] outline-none placeholder:text-[#4f5d68] focus:border-[#4c8494] disabled:opacity-50"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isConnecting}
                    className="w-full rounded-md bg-[#4c9aaa] px-5 py-3.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#071014] transition hover:bg-[#62b4c4] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {isConnecting
                      ? "Connecting..."
                      : "Connect PostgreSQL →"}
                  </button>

                </form>
              )}

            </div>

            <div className="border-t border-[#202a34] px-6 py-4 text-center font-mono text-[9px] uppercase tracking-wider text-[#4f5d68]">
              Database credentials are sent only to
              your configured backend.
            </div>

          </div>

        </div>

      </section>

    </main>
  );
}

function formatFileSize(bytes) {
  if (!bytes) {
    return "0 KB";
  }

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default ConnectionPage;