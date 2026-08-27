import { useState } from "react";

import { createSQLiteSession, createPostgreSQLSession } from "../api/session";

import { useConnection } from "./context/ConnectionContext";

function ConnectionPage({ onBack }) {
  const { connect } = useConnection();

  const [databaseType, setDatabaseType] = useState("postgresql");

  const [connectionUrl, setConnectionUrl] = useState("");

  const [sqliteFile, setSqliteFile] = useState(null);

  const [isConnecting, setIsConnecting] = useState(false);

  const [error, setError] = useState("");

  const handleConnect = async (event) => {
    event.preventDefault();

    try {
      setIsConnecting(true);
      setError("");

      let session;

      if (databaseType === "sqlite") {
        if (!sqliteFile) {
          setError("Please choose a SQLite database file.");
          return;
        }

        session = await createSQLiteSession(sqliteFile);
      } else {
        const cleanUrl = connectionUrl.trim();

        if (!cleanUrl) {
          setError("Please enter a database connection URL.");
          return;
        }

        session = await createPostgreSQLSession(cleanUrl);
      }

      connect(session);
    } catch (err) {
      setError(err?.message || "Unable to connect to the database.");
    } finally {
      setIsConnecting(false);
    }
  };

  const isConnectDisabled =
    isConnecting ||
    (databaseType === "sqlite" ? !sqliteFile : !connectionUrl.trim());

  const handleDatabaseTypeChange = (type) => {
    setDatabaseType(type);
    setConnectionUrl("");
    setSqliteFile(null);
    setError("");
  };

  const handleClear = () => {
    setConnectionUrl("");
    setSqliteFile(null);
    setError("");
  };

  return (
    <main className="min-h-screen bg-[#08070d] text-[#e8e7ef]">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-200px] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[#6d35d8]/10 blur-[120px]" />
      </div>

      {/* NAVBAR */}
      <header className="relative border-b border-[#211b32] bg-[#0a0911]">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-md border border-[#6938d4] bg-[#171126] font-mono text-xs font-bold text-[#a879ff]">
              LQ
            </div>

            <div>
              <div className="font-mono text-sm font-bold tracking-wide text-white">
                LazyQL
              </div>

              <div className="text-[8px] uppercase tracking-[0.18em] text-[#667080]">
                Local AI Database Assistant
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onBack}
            className="rounded-md border border-[#292337] px-4 py-2 font-mono text-[9px] uppercase tracking-wider text-[#8d879d] transition hover:border-[#554374] hover:text-white"
          >
            ← Back
          </button>
        </div>
      </header>

      {/* CONTENT */}
      <div className="relative mx-auto flex min-h-[calc(100vh-64px)] max-w-7xl items-center justify-center px-6 py-12">
        <section className="w-full max-w-4xl">
          {/* Heading */}
          <div className="mb-8">
            <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#8556e8]">
              DATABASE CONNECTION
            </div>

            <h1 className="mt-3 font-mono text-3xl font-bold tracking-tight text-white md:text-4xl">
              Connect Database
            </h1>

            <p className="mt-3 font-mono text-xs text-[#737d8d]">
              Connect a PostgreSQL database or upload a SQLite database file.
            </p>
          </div>

          {/* MAIN CARD */}
          <div className="overflow-hidden rounded-xl border border-[#272238] bg-[#0d0c15] shadow-2xl shadow-black/40">
            {/* DATABASE TABS */}
            <div className="grid grid-cols-2 border-b border-[#272238]">
              <button
                type="button"
                onClick={() => handleDatabaseTypeChange("postgresql")}
                className={`px-5 py-4 font-mono text-[10px] font-semibold uppercase tracking-wider transition ${
                  databaseType === "postgresql"
                    ? "bg-[#6938d4] text-white"
                    : "bg-[#11101a] text-[#737d8d] hover:bg-[#171422] hover:text-white"
                }`}
              >
                PostgreSQL
              </button>

              <button
                type="button"
                onClick={() => handleDatabaseTypeChange("sqlite")}
                className={`px-5 py-4 font-mono text-[10px] font-semibold uppercase tracking-wider transition ${
                  databaseType === "sqlite"
                    ? "bg-[#6938d4] text-white"
                    : "bg-[#11101a] text-[#737d8d] hover:bg-[#171422] hover:text-white"
                }`}
              >
                SQLite
              </button>
            </div>

            <form
              onSubmit={handleConnect}
              className="grid gap-0 lg:grid-cols-[1fr_320px]"
            >
              {/* FORM */}
              <div className="p-6 md:p-8">
                <label className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-[#858da0]">
                  {databaseType === "postgresql"
                    ? "Connection URL"
                    : "Database File"}
                </label>

                <div className="mt-3">
                  {databaseType === "postgresql" ? (
                    <input
                      type="text"
                      value={connectionUrl}
                      onChange={(event) => setConnectionUrl(event.target.value)}
                      disabled={isConnecting}
                      spellCheck={false}
                      placeholder="postgresql://username:password@host:5432/database"
                      className="w-full rounded-md border border-[#302942] bg-[#090811] px-4 py-4 font-mono text-sm text-[#e2dff0] placeholder:text-[#4f5665] outline-none transition focus:border-[#7949e5] focus:ring-1 focus:ring-[#7949e5]/30 disabled:opacity-50"
                    />
                  ) : (
                    <input
                      type="file"
                      accept=".db,.sqlite,.sqlite3"
                      onChange={(event) => {
                        const file = event.target.files?.[0] || null;

                        setSqliteFile(file);
                        setError("");
                      }}
                      disabled={isConnecting}
                      className="w-full rounded-md border border-[#302942] bg-[#090811] px-4 py-4 font-mono text-sm text-[#e2dff0] outline-none transition focus:border-[#7949e5] disabled:opacity-50"
                    />
                  )}
                </div>

                <p className="mt-3 font-mono text-[9px] leading-5 text-[#626b7b]">
                  {databaseType === "postgresql"
                    ? "Provide the PostgreSQL connection URL accepted by the backend."
                    : "Choose a SQLite database file (.db, .sqlite, or .sqlite3)."}
                </p>

                {/* ERROR */}
                {error && (
                  <div className="mt-5 rounded-md border border-[#572d3b] bg-[#1b0f17] p-4">
                    <div className="font-mono text-[9px] font-semibold uppercase tracking-wider text-[#ef718c]">
                      Connection Error
                    </div>

                    <p className="mt-2 text-xs leading-5 text-[#c895a4]">
                      {error}
                    </p>
                  </div>
                )}

                {/* BUTTONS */}
                <div className="mt-7 flex gap-3">
                  <button
                    type="submit"
                    disabled={isConnectDisabled}
                    className="rounded-md border border-[#7545dc] bg-[#6938d4] px-6 py-3 font-mono text-[9px] font-semibold uppercase tracking-wider text-white transition hover:bg-[#7849e8] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {isConnecting ? "Connecting..." : "Connect →"}
                  </button>

                  <button
                    type="button"
                    onClick={handleClear}
                    disabled={isConnecting}
                    className="rounded-md border border-[#302942] bg-[#11101a] px-6 py-3 font-mono text-[9px] font-semibold uppercase tracking-wider text-[#858da0] transition hover:border-[#4b4160] hover:text-white disabled:opacity-40"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* GUIDE */}
              <div className="border-t border-[#272238] bg-[#11101a] p-6 lg:border-l lg:border-t-0">
                <div className="flex items-center gap-2">
                  <span className="grid h-7 w-7 place-items-center rounded-md border border-[#3b2c59] bg-[#19132a] text-[#a879ff]">
                    ◈
                  </span>

                  <span className="font-mono text-[9px] font-semibold uppercase tracking-wider text-[#a7a1b8]">
                    Connection Guide
                  </span>
                </div>

                <div className="mt-6 space-y-5">
                  <GuideItem
                    number="01"
                    title="Choose database"
                    text={
                      databaseType === "postgresql" ? "PostgreSQL" : "SQLite"
                    }
                  />

                  <GuideItem
                    number="02"
                    title={
                      databaseType === "postgresql"
                        ? "Provide URL"
                        : "Choose database file"
                    }
                    text={
                      databaseType === "postgresql"
                        ? "Use the PostgreSQL connection URL."
                        : "Select a local SQLite database file."
                    }
                  />

                  <GuideItem
                    number="03"
                    title="Connect"
                    text="LazyQL will create a database session."
                  />
                </div>

                {/* BACKEND CONTRACT */}
                <div className="mt-7 rounded-md border border-[#2b2540] bg-[#0b0a12] p-4">
                  <div className="font-mono text-[8px] uppercase tracking-wider text-[#625c70]">
                    Backend Contract
                  </div>

                  <pre className="mt-3 overflow-x-auto font-mono text-[10px] leading-5 text-[#8e83a7]">
                    {databaseType === "postgresql"
                      ? `{
  database_type,
  connection_url
}`
                      : `{
  database_type,
  file
}`}
                  </pre>
                </div>
              </div>
            </form>
          </div>

          {/* STATUS */}
          <div className="mt-5 flex items-center gap-2 font-mono text-[9px] text-[#5f6877]">
            <span className="h-2 w-2 rounded-full bg-[#48c878]" />
            Connection is handled securely by the backend.
          </div>
        </section>
      </div>
    </main>
  );
}

function GuideItem({ number, title, text }) {
  return (
    <div className="flex gap-3">
      <span className="font-mono text-[8px] text-[#7545dc]">{number}</span>

      <div>
        <div className="font-mono text-[10px] font-semibold text-[#c9c4d5]">
          {title}
        </div>

        <div className="mt-1 text-[10px] leading-5 text-[#666f80]">{text}</div>
      </div>
    </div>
  );
}

export default ConnectionPage;
