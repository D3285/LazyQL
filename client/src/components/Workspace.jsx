import { useState } from "react";

import SchemaExplorer from "./schema/SchemaExplorer";
import ChatInterface from "./chat/ChatInterface";

import { useConnection } from "./context/ConnectionContext";
import { useExecuteSQL } from "./hooks/useExecuteSQL";

import ResultsTable from "./results/ResultsTable";
import ConfirmationModal from "./modals/ConfirmationModal";
import ErrorCorrectionModal from "./modals/ErrorCorrectionModal";
import ThemeToggle from "./common/ThemeToggle";

function Workspace({ onDisconnect }) {
  const {
    sessionId,
    databaseType,
    schema,
    isSchemaLoading,
    schemaError,
  } = useConnection();

  const {
    execute,
    isLoading: isExecuting,
  } = useExecuteSQL();

  const [generatedQuery, setGeneratedQuery] = useState(null);
  const [sql, setSql] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const [results, setResults] = useState({
    columns: [],
    rows: [],
  });

  const [hasExecuted, setHasExecuted] = useState(false);
  const [error, setError] = useState("");

  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);

  const [affectedRows, setAffectedRows] = useState(null);
  const [pendingSQL, setPendingSQL] = useState("");

  // Sidebar state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleQueryGenerated = (result) => {
    setGeneratedQuery(result);
    setSql(result.sql || "");

    setResults({
      columns: [],
      rows: [],
    });

    setHasExecuted(false);
    setError("");
    setIsEditing(false);
  };

  const handleSaveSQL = () => {
    if (!sql.trim()) {
      setError("SQL query cannot be empty.");
      return;
    }

    setGeneratedQuery((previous) => ({
      ...(previous || {}),
      sql,
    }));

    setIsEditing(false);
    setHasExecuted(false);

    setResults({
      columns: [],
      rows: [],
    });

    setError("");
  };

  const handleCancelEdit = () => {
    setSql(generatedQuery?.sql || "");
    setIsEditing(false);
    setError("");
  };

  const isDestructiveQuery = (query) => {
    const normalized = query.trim().toLowerCase();

    return (
      normalized.startsWith("update ") ||
      normalized.startsWith("delete ") ||
      normalized.startsWith("insert ") ||
      normalized.startsWith("alter ") ||
      normalized.startsWith("drop ") ||
      normalized.startsWith("truncate ")
    );
  };

  const handleExecute = () => {
    const cleanSQL = sql.trim();

    if (!sessionId) {
      setError("No database session is active.");
      return;
    }

    if (!cleanSQL) {
      setError("SQL query cannot be empty.");
      return;
    }

    setError("");

    if (isDestructiveQuery(cleanSQL)) {
      setPendingSQL(cleanSQL);
      setConfirmationOpen(true);
      return;
    }

    executeQuery(cleanSQL);
  };

  const executeQuery = async (query) => {
    if (!sessionId) {
      setError("No database session is active.");
      return;
    }

    try {
      setError("");
      setErrorModalOpen(false);

      const response = await execute({
        sessionId,
        sql: query,
      });

      if (!response) {
        throw new Error(
          "The backend returned an empty response."
        );
      }

      setResults({
        columns: response.columns || [],
        rows: response.rows || [],
      });

      setHasExecuted(true);

      setGeneratedQuery((previous) => ({
        ...(previous || {}),
        sql: query,
      }));

      setSql(query);

      setConfirmationOpen(false);

      setAffectedRows(
        response.affected_rows ?? null
      );
    } catch (err) {
      const message =
        err?.message ||
        "Unable to execute SQL.";

      setError(message);

      setPendingSQL(query);
      setErrorModalOpen(true);
      setHasExecuted(false);
    }
  };

  const handleConfirmExecute = async () => {
    if (!pendingSQL) return;

    await executeQuery(pendingSQL);
  };

  const handleRetry = async () => {
    if (!pendingSQL) return;

    await executeQuery(pendingSQL);
  };

  return (
    <main
      className="
        relative min-h-screen overflow-hidden
        bg-[var(--lq-bg)]
        text-[var(--lq-text)]
        transition-colors duration-300
      "
    >

      {/* =====================================================
          JAPANESE ATMOSPHERE
      ====================================================== */}

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">

        {/* Sun */}

        <div
          className="
            absolute right-[7%] top-24
            hidden h-24 w-24
            rounded-full
            bg-[var(--lq-primary)]
            opacity-[0.055]
            lg:block
          "
        />

        {/* Sakura glow */}

        <div
          className="
            absolute -left-32 top-40
            h-72 w-72
            rounded-full
            bg-[var(--lq-primary)]
            opacity-[0.035]
            blur-3xl
          "
        />

        {/* Purple glow */}

        <div
          className="
            absolute bottom-0 right-0
            h-96 w-96
            rounded-full
            bg-[var(--lq-purple)]
            opacity-[0.035]
            blur-3xl
          "
        />

        {/* Petals */}

        <span
          className="
            absolute left-[30%] top-24
            h-3 w-5 rotate-12
            rounded-[100%_0_100%_0]
            bg-[var(--lq-primary)]
            opacity-20
          "
        />

        <span
          className="
            absolute right-[25%] top-36
            h-3 w-5 -rotate-12
            rounded-[100%_0_100%_0]
            bg-[var(--lq-primary)]
            opacity-15
          "
        />

        <span
          className="
            absolute bottom-[20%] right-[12%]
            h-3 w-5 rotate-45
            rounded-[100%_0_100%_0]
            bg-[var(--lq-primary)]
            opacity-15
          "
        />

      </div>

      {/* =====================================================
          HEADER
      ====================================================== */}

      <header
        className="
          relative z-30
          flex h-16 items-center
          justify-between
          border-b border-[var(--lq-border)]
          bg-[var(--lq-surface)]/90
          px-5
          backdrop-blur-md
          transition-colors duration-300
          md:px-8
        "
      >

        {/* BRAND */}

       <button
  type="button"
  onClick={onBack}
  className="flex cursor-pointer items-center gap-3"
>
  <div
    className="
      grid h-9 w-9 place-items-center
      rounded-md
      border border-[var(--lq-primary)]
      bg-[var(--lq-primary-soft)]
      font-mono text-xs font-bold
      text-[var(--lq-primary)]
    "
  >
    LQ
  </div>

  <div className="text-left">

    <div
      className="
        font-mono text-sm font-bold
        tracking-[0.2em]
        text-[var(--lq-text)]
      "
    >
      LAZYQL
    </div>

    <div
      className="
        hidden font-mono text-[8px]
        uppercase tracking-[0.2em]
        text-[var(--lq-text-muted)]
        sm:block
      "
    >
      Local AI Database Assistant
    </div>

  </div>

</button>
        {/* STATUS */}

        <div
          className="
            hidden items-center gap-2
            font-mono text-[9px]
            uppercase tracking-wider
            text-[var(--lq-text-muted)]
            sm:flex
          "
        >

          <span
            className="
              h-2 w-2 rounded-full
              bg-[var(--lq-success)]
              shadow-[0_0_7px_rgba(94,203,139,0.5)]
            "
          />

          {databaseType || "DATABASE"} · CONNECTED

        </div>

        {/* ACTIONS */}

        <div className="flex items-center gap-3">

          <ThemeToggle />

          <button
            type="button"
            onClick={onDisconnect}
            disabled={isExecuting}
            className="
              rounded-md
              border border-[var(--lq-border)]
              px-3 py-2
              font-mono text-[9px]
              uppercase tracking-wider
              text-[var(--lq-text-soft)]
              transition
              hover:border-[var(--lq-primary)]
              hover:text-[var(--lq-primary)]
              disabled:opacity-50
            "
          >
            Disconnect
          </button>

        </div>

      </header>

      {/* =====================================================
          WORKSPACE
      ====================================================== */}

      <div
        className="
          relative z-10 grid
          min-h-[calc(100vh-64px)]
          transition-[grid-template-columns]
          duration-300
        "
        style={{
          gridTemplateColumns:
            sidebarCollapsed
              ? "68px minmax(0, 1fr)"
              : "250px minmax(0, 1fr)",
        }}
      >

        {/* =================================================
            SIDEBAR
        ================================================== */}

        <div
          className="
            min-w-0
            border-r border-[var(--lq-border)]
            bg-[var(--lq-sidebar)]
            transition-colors duration-300
          "
        >

          <SchemaExplorer
            collapsed={sidebarCollapsed}
            onToggle={() =>
              setSidebarCollapsed(
                (previous) => !previous
              )
            }
          />

        </div>

        {/* =================================================
            CONTENT
        ================================================== */}

        <section
          className="
            mx-auto w-full max-w-6xl
            min-w-0
            p-5 md:p-8
          "
        >

          {/* TITLE */}

          <div>

            <div
              className="
                flex items-center gap-2
                font-mono text-[9px]
                font-semibold uppercase
                tracking-[0.22em]
                text-[var(--lq-primary)]
              "
            >

              <span className="text-sm">
                ✿
              </span>

              SQL ASSISTANT

            </div>

            <h1
              className="
                mt-2
                font-mono text-2xl
                font-bold tracking-tight
                text-[var(--lq-text)]
                md:text-3xl
              "
            >
              Ask your database
            </h1>

            <p
              className="
                mt-2 max-w-2xl
                font-mono text-xs
                leading-6
                text-[var(--lq-text-soft)]
              "
            >
              Describe what you need in natural language
              and LazyQL will generate SQL for your database.
            </p>

          </div>

          {/* SCHEMA STATUS */}

          {isSchemaLoading && (
            <div
              className="
                mt-5 rounded-lg
                border border-[var(--lq-border)]
                bg-[var(--lq-surface)]
                px-4 py-3
                font-mono text-[10px]
                text-[var(--lq-text-soft)]
              "
            >

              <span
                className="
                  mr-2 inline-block
                  h-2 w-2 animate-pulse
                  rounded-full
                  bg-[var(--lq-purple)]
                "
              />

              Loading database schema...

            </div>
          )}

          {schemaError && (
            <div
              className="
                mt-5 rounded-lg
                border
                border-[var(--lq-danger-border)]
                bg-[var(--lq-danger-soft)]
                px-4 py-3
              "
            >

              <div
                className="
                  font-mono text-[10px]
                  font-semibold uppercase
                  tracking-wider
                  text-[var(--lq-danger)]
                "
              >
                Schema Error
              </div>

              <p
                className="
                  mt-2 font-mono text-xs
                  text-[var(--lq-danger-text)]
                "
              >
                {schemaError}
              </p>

            </div>
          )}

          {/* =================================================
              CHAT
          ================================================== */}

          <div
            className="
              mt-6 overflow-hidden
              rounded-xl
              border border-[var(--lq-border)]
              bg-[var(--lq-surface)]
              shadow-sm
              transition-colors duration-300
            "
          >

            <div
              className="
                flex items-center justify-between
                border-b border-[var(--lq-border)]
                bg-[var(--lq-surface-soft)]
                px-4 py-3
              "
            >

              <div className="flex items-center gap-2">

                <span
                  className="
                    text-sm
                    text-[var(--lq-primary)]
                  "
                >
                  ◈
                </span>

                <div
                  className="
                    font-mono text-[9px]
                    font-semibold uppercase
                    tracking-wider
                    text-[var(--lq-primary)]
                  "
                >
                  Natural Language Query
                </div>

              </div>

              <span
                className="
                  hidden font-mono text-[8px]
                  uppercase tracking-wider
                  text-[var(--lq-text-muted)]
                  sm:block
                "
              >
                AI → SQL
              </span>

            </div>

            <div className="p-4 md:p-5">

              <ChatInterface
                schema={schema}
                onQueryGenerated={handleQueryGenerated}
              />

            </div>

          </div>

          {/* =================================================
              GENERATED SQL
          ================================================== */}

          {sql && (
            <div
              className="
                mt-6 overflow-hidden
                rounded-xl
                border border-[var(--lq-border)]
                bg-[var(--lq-surface)]
                shadow-sm
                transition-colors duration-300
              "
            >

              {/* SQL HEADER */}

              <div
                className="
                  flex flex-wrap
                  items-center
                  justify-between
                  gap-3
                  border-b border-[var(--lq-border)]
                  bg-[var(--lq-surface-soft)]
                  px-4 py-3
                "
              >

                <div>

                  <div
                    className="
                      flex items-center gap-2
                      font-mono text-[10px]
                      font-semibold uppercase
                      tracking-wider
                      text-[var(--lq-primary)]
                    "
                  >

                    <span className="text-[var(--lq-gold)]">
                      ◆
                    </span>

                    Generated SQL

                  </div>

                  {generatedQuery?.confidence != null && (
                    <div
                      className="
                        mt-1
                        font-mono text-[9px]
                        text-[var(--lq-text-muted)]
                      "
                    >
                      Confidence:{" "}
                      {Math.round(
                        generatedQuery.confidence * 100
                      )}
                      %
                    </div>
                  )}

                </div>

                {!isEditing && (
                  <button
                    type="button"
                    onClick={() =>
                      setIsEditing(true)
                    }
                    disabled={isExecuting}
                    className="
                      rounded-md
                      border border-[var(--lq-border)]
                      px-3 py-2
                      font-mono text-[9px]
                      uppercase tracking-wider
                      text-[var(--lq-text-soft)]
                      transition
                      hover:border-[var(--lq-primary)]
                      hover:text-[var(--lq-primary)]
                      disabled:opacity-50
                    "
                  >
                    Edit SQL
                  </button>
                )}

              </div>

              {/* SQL EDITOR */}

              {isEditing ? (

                <div className="p-4">

                  <textarea
                    value={sql}
                    onChange={(event) =>
                      setSql(event.target.value)
                    }
                    spellCheck={false}
                    className="
                      min-h-56 w-full
                      resize-y
                      rounded-lg
                      border border-[var(--lq-border)]
                      bg-[var(--lq-code-bg)]
                      p-4
                      font-mono text-xs
                      leading-6
                      text-[var(--lq-code-text)]
                      outline-none
                      transition-colors
                      placeholder:text-[var(--lq-text-muted)]
                      focus:border-[var(--lq-purple)]
                      focus:ring-1
                      focus:ring-[var(--lq-purple)]/30
                    "
                  />

                  <div className="mt-4 flex gap-2">

                    <button
                      type="button"
                      onClick={handleSaveSQL}
                      className="
                        rounded-md
                        bg-[var(--lq-primary)]
                        px-4 py-2
                        font-mono text-[9px]
                        font-semibold uppercase
                        tracking-wider
                        text-white
                        transition
                        hover:bg-[var(--lq-primary-hover)]
                      "
                    >
                      Save SQL
                    </button>

                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="
                        rounded-md
                        border border-[var(--lq-border)]
                        px-4 py-2
                        font-mono text-[9px]
                        uppercase tracking-wider
                        text-[var(--lq-text-soft)]
                        transition
                        hover:border-[var(--lq-primary)]
                        hover:text-[var(--lq-primary)]
                      "
                    >
                      Cancel
                    </button>

                  </div>

                </div>

              ) : (

                <pre
                  className="
                    max-h-[420px]
                    overflow-auto
                    bg-[var(--lq-code-bg)]
                    p-5
                    font-mono text-xs
                    leading-6
                    text-[var(--lq-code-text)]
                    transition-colors duration-300
                  "
                >
{sql}
                </pre>

              )}

              {/* EXECUTE */}

              {!isEditing && (
                <div
                  className="
                    flex flex-wrap
                    items-center gap-3
                    border-t
                    border-[var(--lq-border)]
                    bg-[var(--lq-surface-soft)]
                    px-4 py-4
                  "
                >

                  <button
                    type="button"
                    onClick={handleExecute}
                    disabled={isExecuting}
                    className="
                      rounded-md
                      bg-[var(--lq-primary)]
                      px-5 py-2.5
                      font-mono text-[9px]
                      font-semibold uppercase
                      tracking-wider
                      text-white
                      shadow-sm
                      transition
                      hover:bg-[var(--lq-primary-hover)]
                      hover:shadow-md
                      disabled:cursor-not-allowed
                      disabled:opacity-40
                    "
                  >
                    {isExecuting
                      ? "Executing..."
                      : "Execute Query →"}
                  </button>

                  {!hasExecuted && (
                    <span
                      className="
                        font-mono text-[9px]
                        text-[var(--lq-text-muted)]
                      "
                    >
                      Query has not been executed.
                    </span>
                  )}

                </div>
              )}

            </div>
          )}

          {/* =================================================
              ERROR
          ================================================== */}

          {error && !errorModalOpen && (
            <div
              className="
                mt-5 rounded-lg
                border border-[var(--lq-danger-border)]
                bg-[var(--lq-danger-soft)]
                p-4
              "
            >

              <div
                className="
                  font-mono text-[9px]
                  font-semibold uppercase
                  tracking-wider
                  text-[var(--lq-danger)]
                "
              >
                Error
              </div>

              <p
                className="
                  mt-2 font-mono text-xs
                  text-[var(--lq-danger-text)]
                "
              >
                {error}
              </p>

            </div>
          )}

          {/* =================================================
              RESULTS
          ================================================== */}

          {hasExecuted && (
            <div
              className="
                mt-6 overflow-hidden
                rounded-xl
                border border-[var(--lq-border)]
                bg-[var(--lq-surface)]
                shadow-sm
                transition-colors duration-300
              "
            >

              <div
                className="
                  flex items-center
                  justify-between
                  border-b border-[var(--lq-border)]
                  bg-[var(--lq-surface-soft)]
                  px-4 py-3
                "
              >

                <div className="flex items-center gap-2">

                  <span
                    className="
                      text-sm
                      text-[var(--lq-primary)]
                    "
                  >
                    ✿
                  </span>

                  <div
                    className="
                      font-mono text-[10px]
                      font-semibold uppercase
                      tracking-wider
                      text-[var(--lq-primary)]
                    "
                  >
                    Query Results
                  </div>

                </div>

                <span
                  className="
                    font-mono text-[8px]
                    uppercase tracking-wider
                    text-[var(--lq-text-muted)]
                  "
                >
                  DATABASE OUTPUT
                </span>

              </div>

              <ResultsTable
                columns={results.columns}
                rows={results.rows}
                isLoading={isExecuting}
              />

            </div>
          )}

        </section>

      </div>

      {/* =====================================================
          MODALS
      ====================================================== */}

      <ConfirmationModal
        open={confirmationOpen}
        sql={pendingSQL}
        affectedRows={affectedRows}
        onConfirm={handleConfirmExecute}
        onCancel={() => {
          setConfirmationOpen(false);
          setPendingSQL("");
        }}
        isLoading={isExecuting}
      />

      <ErrorCorrectionModal
        open={errorModalOpen}
        sql={pendingSQL}
        error={error}
        onChange={(value) => {
          setPendingSQL(value);
          setSql(value);
        }}
        onRetry={handleRetry}
        onClose={() => {
          setErrorModalOpen(false);
        }}
        isLoading={isExecuting}
      />

    </main>
  );
}

export default Workspace;
