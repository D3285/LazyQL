import { useState } from "react";

import SchemaExplorer from "./schema/SchemaExplorer";
import ChatInterface from "./chat/ChatInterface";

import { useConnection } from "./context/ConnectionContext";
import { useExecuteSQL } from "./hooks/useExecuteSQL";

import ResultsTable from "./results/ResultsTable";
import ConfirmationModal from "./modals/ConfirmationModal";
import ErrorCorrectionModal from "./modals/ErrorCorrectionModal";

function Workspace({ onDisconnect }) {
  const {
    sessionId,
    databaseType,
  } = useConnection();

  const {
    execute,
    isLoading: isExecuting,
  } = useExecuteSQL();

  const [generatedQuery, setGeneratedQuery] =
    useState(null);

  const [sql, setSql] = useState("");

  const [isEditing, setIsEditing] =
    useState(false);

  const [results, setResults] =
    useState({
      columns: [],
      rows: [],
    });

  const [hasExecuted, setHasExecuted] =
    useState(false);

  const [error, setError] =
    useState("");

  const [confirmationOpen, setConfirmationOpen] =
    useState(false);

  const [errorModalOpen, setErrorModalOpen] =
    useState(false);

  const [affectedRows, setAffectedRows] =
    useState(null);

  const [pendingSQL, setPendingSQL] =
    useState("");

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
    setSql(
      generatedQuery?.sql || ""
    );

    setIsEditing(false);
    setError("");
  };

  const isDestructiveQuery = (query) => {
    const normalized = query
      .trim()
      .toLowerCase();

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
      setError(
        "No database session is active."
      );
      return;
    }

    if (!cleanSQL) {
      setError(
        "SQL query cannot be empty."
      );
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
      setError(
        "No database session is active."
      );
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
        columns:
          response.columns || [],
        rows:
          response.rows || [],
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
    if (!pendingSQL) {
      return;
    }

    await executeQuery(pendingSQL);
  };

  const handleRetry = async () => {
    if (!pendingSQL) {
      return;
    }

    await executeQuery(pendingSQL);
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
            <div className="font-mono text-sm font-semibold tracking-[0.25em]">
              LAZYQL
            </div>

            <div className="hidden font-mono text-[8px] uppercase tracking-[0.2em] text-[#53616d] sm:block">
              Natural Language SQL
            </div>
          </div>

        </div>

        <div className="hidden items-center gap-2 font-mono text-[9px] uppercase tracking-wider text-[#71808c] sm:flex">

          <span className="h-2 w-2 rounded-full bg-[#55c48a]" />

          {databaseType || "DATABASE"} · CONNECTED

        </div>

        <button
          type="button"
          onClick={onDisconnect}
          disabled={isExecuting}
          className="rounded-md border border-[#293641] px-3 py-2 font-mono text-[9px] uppercase tracking-wider text-[#71808c] transition hover:border-[#4c8494] hover:text-[#b9c7d0] disabled:opacity-50"
        >
          Disconnect
        </button>

      </header>

      {/* WORKSPACE */}

      <div className="grid min-h-[calc(100vh-64px)] md:grid-cols-[260px_1fr]">

        <SchemaExplorer />

        <section className="mx-auto w-full max-w-5xl p-5 md:p-8">

          {/* TITLE */}

          <div>

            <div className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-[#5d96a3]">
              SQL Assistant
            </div>

            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#e6edf3] md:text-3xl">
              Ask your database
            </h1>

            <p className="mt-2 text-sm text-[#687783]">
              Describe what you need in natural
              language and LazyQL will generate SQL.
            </p>

          </div>

          {/* CHAT */}

          <div className="mt-6 rounded-lg border border-[#202a34] bg-[#0e141b] p-4 md:p-5">

            <ChatInterface
              schema={null}
              onQueryGenerated={
                handleQueryGenerated
              }
            />

          </div>

          {/* SQL */}

          {sql && (
            <div className="mt-6 overflow-hidden rounded-lg border border-[#202a34] bg-[#0e141b]">

              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#202a34] bg-[#111820] px-4 py-3">

                <div>
                  <div className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#8ed0df]">
                    Generated SQL
                  </div>

                  {generatedQuery?.confidence != null && (
                    <div className="mt-1 font-mono text-[9px] text-[#596875]">
                      Confidence:{" "}
                      {Math.round(
                        generatedQuery.confidence *
                          100
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
                    className="rounded-md border border-[#293641] px-3 py-2 font-mono text-[9px] uppercase tracking-wider text-[#7d919d] hover:border-[#4c8494] hover:text-[#aebbc5] disabled:opacity-50"
                  >
                    Edit SQL
                  </button>
                )}

              </div>

              {isEditing ? (
                <div className="p-4">

                  <textarea
                    value={sql}
                    onChange={(event) =>
                      setSql(
                        event.target.value
                      )
                    }
                    spellCheck={false}
                    className="min-h-56 w-full resize-y rounded-md border border-[#293641] bg-[#080c11] p-4 font-mono text-xs leading-6 text-[#cbd7df] outline-none focus:border-[#4c8494]"
                  />

                  <div className="mt-4 flex gap-2">

                    <button
                      type="button"
                      onClick={
                        handleSaveSQL
                      }
                      className="rounded-md bg-[#4c9aaa] px-4 py-2 font-mono text-[9px] font-semibold uppercase tracking-wider text-[#071014] hover:bg-[#62b4c4]"
                    >
                      Save SQL
                    </button>

                    <button
                      type="button"
                      onClick={
                        handleCancelEdit
                      }
                      className="rounded-md border border-[#293641] px-4 py-2 font-mono text-[9px] uppercase tracking-wider text-[#7d919d] hover:text-[#b9c7d0]"
                    >
                      Cancel
                    </button>

                  </div>

                </div>
              ) : (
                <pre className="max-h-[420px] overflow-auto bg-[#080c11] p-5 font-mono text-xs leading-6 text-[#cbd7df]">
                  {sql}
                </pre>
              )}

              {!isEditing && (
                <div className="flex flex-wrap items-center gap-3 border-t border-[#202a34] px-4 py-4">

                  <button
                    type="button"
                    onClick={
                      handleExecute
                    }
                    disabled={isExecuting}
                    className="rounded-md bg-[#4c9aaa] px-5 py-2.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-[#071014] hover:bg-[#62b4c4] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {isExecuting
                      ? "Executing..."
                      : "Execute Query →"}
                  </button>

                  {!hasExecuted && (
                    <span className="font-mono text-[9px] text-[#596875]">
                      Query has not been executed.
                    </span>
                  )}

                </div>
              )}

            </div>
          )}

          {/* GENERATION / EXECUTION ERROR */}

          {error && !errorModalOpen && (
            <div className="mt-5 rounded-md border border-[#51333a] bg-[#1b1115] p-4">

              <div className="font-mono text-[9px] font-semibold uppercase tracking-wider text-[#df7c8a]">
                Error
              </div>

              <p className="mt-2 text-sm text-[#c6a1a7]">
                {error}
              </p>

            </div>
          )}

          {/* RESULTS */}

          {hasExecuted && (
            <div className="mt-6">

              <ResultsTable
                columns={
                  results.columns
                }
                rows={results.rows}
                isLoading={
                  isExecuting
                }
              />

            </div>
          )}

        </section>

      </div>

      {/* CONFIRMATION MODAL */}

      <ConfirmationModal
        open={confirmationOpen}
        sql={pendingSQL}
        affectedRows={affectedRows}
        onConfirm={
          handleConfirmExecute
        }
        onCancel={() => {
          setConfirmationOpen(false);
          setPendingSQL("");
        }}
        isLoading={isExecuting}
      />

      {/* ERROR CORRECTION MODAL */}

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