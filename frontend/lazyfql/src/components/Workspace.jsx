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
    schema,
    isSchemaLoading,
    schemaError,
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

  const [results, setResults] = useState({
    columns: [],
    rows: [],
  });

  const [hasExecuted, setHasExecuted] =
    useState(false);

  const [error, setError] = useState("");

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
    <main className="min-h-screen bg-[#08070d] text-[#e8e7ef]">

      {/* HEADER */}

      <header className="flex h-16 items-center justify-between border-b border-[#241b35] bg-[#0b0912] px-5 md:px-8">

        <div className="flex items-center gap-3">

          <div className="grid h-9 w-9 place-items-center rounded-md border border-[#6d3fd3] bg-[#171027] font-mono text-xs font-bold text-[#a879ff]">
            LQ
          </div>

          <div>
            <div className="font-mono text-sm font-bold tracking-[0.2em] text-white">
              LAZYQL
            </div>

            <div className="hidden font-mono text-[8px] uppercase tracking-[0.2em] text-[#625b70] sm:block">
              Local AI Database Assistant
            </div>
          </div>

        </div>

        <div className="hidden items-center gap-2 font-mono text-[9px] uppercase tracking-wider text-[#777083] sm:flex">

          <span className="h-2 w-2 rounded-full bg-[#4fd17b]" />

          {databaseType || "DATABASE"} · CONNECTED

        </div>

        <button
          type="button"
          onClick={onDisconnect}
          disabled={isExecuting}
          className="rounded-md border border-[#302641] px-3 py-2 font-mono text-[9px] uppercase tracking-wider text-[#80798f] transition hover:border-[#7045d0] hover:text-white disabled:opacity-50"
        >
          Disconnect
        </button>

      </header>

      {/* MAIN WORKSPACE */}

      <div className="grid min-h-[calc(100vh-64px)] md:grid-cols-[250px_1fr]">

        {/* SIDEBAR */}

        <div className="border-r border-[#211a30] bg-[#0b0911]">

          <SchemaExplorer />
        </div>

        {/* CONTENT */}

        <section className="mx-auto w-full max-w-6xl p-5 md:p-8">

          {/* TITLE */}

          <div>

            <div className="font-mono text-[9px] font-semibold uppercase tracking-[0.22em] text-[#8a55ed]">
              SQL ASSISTANT
            </div>

            <h1 className="mt-2 font-mono text-2xl font-bold tracking-tight text-white md:text-3xl">
              Ask your database
            </h1>

            <p className="mt-2 max-w-2xl font-mono text-xs leading-6 text-[#6f697b]">
              Describe what you need in natural language
              and LazyQL will generate SQL for your database.
            </p>

          </div>

          {/* SCHEMA STATUS */}

          {isSchemaLoading && (
            <div className="mt-5 rounded-md border border-[#302445] bg-[#100d18] px-4 py-3 font-mono text-[9px] text-[#837b91]">
              Loading database schema...
            </div>
          )}

          {schemaError && (
            <div className="mt-5 rounded-md border border-[#572d3b] bg-[#1b0f17] px-4 py-3">

              <div className="font-mono text-[9px] font-semibold uppercase tracking-wider text-[#ef718c]">
                Schema Error
              </div>

              <p className="mt-2 font-mono text-xs text-[#c895a4]">
                {schemaError}
              </p>

            </div>
          )}

          {/* CHAT */}

          <div className="mt-6 overflow-hidden rounded-lg border border-[#282039] bg-[#0e0c15]">

            <div className="border-b border-[#282039] bg-[#11101a] px-4 py-3">

              <div className="font-mono text-[9px] font-semibold uppercase tracking-wider text-[#a879ff]">
                Natural Language Query
              </div>

            </div>

            <div className="p-4 md:p-5">

              <ChatInterface
                schema={schema}
                onQueryGenerated={
                  handleQueryGenerated
                }
              />

            </div>

          </div>

          {/* SQL */}

          {sql && (
            <div className="mt-6 overflow-hidden rounded-lg border border-[#282039] bg-[#0e0c15]">

              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#282039] bg-[#11101a] px-4 py-3">

                <div>

                  <div className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#a879ff]">
                    Generated SQL
                  </div>

                  {generatedQuery?.confidence != null && (
                    <div className="mt-1 font-mono text-[9px] text-[#625b70]">
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
                    className="rounded-md border border-[#33294a] px-3 py-2 font-mono text-[9px] uppercase tracking-wider text-[#8d849b] transition hover:border-[#7045d0] hover:text-white disabled:opacity-50"
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
                      setSql(event.target.value)
                    }
                    spellCheck={false}
                    className="min-h-56 w-full resize-y rounded-md border border-[#302744] bg-[#08070d] p-4 font-mono text-xs leading-6 text-[#d4cfdf] outline-none focus:border-[#7546dc] focus:ring-1 focus:ring-[#7546dc]/30"
                  />

                  <div className="mt-4 flex gap-2">

                    <button
                      type="button"
                      onClick={handleSaveSQL}
                      className="rounded-md border border-[#7546dc] bg-[#6938d4] px-4 py-2 font-mono text-[9px] font-semibold uppercase tracking-wider text-white transition hover:bg-[#7849e8]"
                    >
                      Save SQL
                    </button>

                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="rounded-md border border-[#302744] px-4 py-2 font-mono text-[9px] uppercase tracking-wider text-[#8d849b] transition hover:border-[#4a3d61] hover:text-white"
                    >
                      Cancel
                    </button>

                  </div>

                </div>
              ) : (
                <pre className="max-h-[420px] overflow-auto bg-[#08070d] p-5 font-mono text-xs leading-6 text-[#d4cfdf]">
{sql}
                </pre>
              )}

              {!isEditing && (
                <div className="flex flex-wrap items-center gap-3 border-t border-[#282039] bg-[#0e0c15] px-4 py-4">

                  <button
                    type="button"
                    onClick={handleExecute}
                    disabled={isExecuting}
                    className="rounded-md border border-[#7546dc] bg-[#6938d4] px-5 py-2.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-white transition hover:bg-[#7849e8] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {isExecuting
                      ? "Executing..."
                      : "Execute Query →"}
                  </button>

                  {!hasExecuted && (
                    <span className="font-mono text-[9px] text-[#625b70]">
                      Query has not been executed.
                    </span>
                  )}

                </div>
              )}

            </div>
          )}

          {/* ERROR */}

          {error && !errorModalOpen && (
            <div className="mt-5 rounded-md border border-[#572d3b] bg-[#1b0f17] p-4">

              <div className="font-mono text-[9px] font-semibold uppercase tracking-wider text-[#ef718c]">
                Error
              </div>

              <p className="mt-2 font-mono text-xs text-[#c895a4]">
                {error}
              </p>

            </div>
          )}

          {/* RESULTS */}

          {hasExecuted && (
            <div className="mt-6 overflow-hidden rounded-lg border border-[#282039] bg-[#0e0c15]">

              <div className="border-b border-[#282039] bg-[#11101a] px-4 py-3">

                <div className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#a879ff]">
                  Query Results
                </div>

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

      {/* CONFIRMATION MODAL */}

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