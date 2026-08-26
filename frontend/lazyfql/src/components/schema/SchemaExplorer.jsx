import { useConnection } from "../context/ConnectionContext";
import SchemaTree from "./SchemaTree";

function SchemaExplorer() {
  const {
    databaseType,
    isConnected,
    schema,
    isSchemaLoading,
    schemaError,
  } = useConnection();

  return (
    <aside className="hidden min-h-[calc(100vh-56px)] border-r border-[#202832] bg-[#0c1117] md:block">

      <div className="sticky top-0">

        {/* HEADER */}

        <div className="border-b border-[#202832] px-4 py-4">

          <div className="flex items-center justify-between">

            <div className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-[#778693]">
              Database
            </div>

            {isConnected && (
              <div className="h-2 w-2 rounded-full bg-[#55c48a]" />
            )}

          </div>

          <div className="mt-2 truncate text-sm font-medium text-[#d7e0e7]">
            Connected Database
          </div>

          <div className="mt-1 font-mono text-[9px] uppercase text-[#596875]">
            {schema?.database_type ||
              databaseType ||
              "UNKNOWN"}
          </div>

        </div>

        {/* SCHEMA */}

        <div className="px-3 py-4">

          <div className="px-2 pb-2 font-mono text-[9px] uppercase tracking-[0.18em] text-[#53616d]">
            Schema
          </div>

          {!isConnected && (
            <div className="rounded-md border border-[#222c35] bg-[#10161c] p-3 text-xs text-[#667581]">
              No database connected.
            </div>
          )}

          {isConnected &&
            isSchemaLoading && (
              <div className="flex items-center gap-2 rounded-md border border-[#222c35] bg-[#10161c] p-3 text-xs text-[#73818d]">

                <span className="h-3 w-3 animate-spin rounded-full border-2 border-[#45636d] border-t-transparent" />

                Reading schema...

              </div>
            )}

          {isConnected &&
            !isSchemaLoading &&
            schemaError && (
              <div className="rounded-md border border-[#51333a] bg-[#1b1115] p-3">

                <div className="font-mono text-[9px] uppercase tracking-wider text-[#df7c8a]">
                  Schema error
                </div>

                <p className="mt-2 text-xs leading-5 text-[#b99ca2]">
                  {schemaError}
                </p>

              </div>
            )}

          {isConnected &&
            !isSchemaLoading &&
            !schemaError &&
            schema && (
              <SchemaTree
                tables={schema.tables || []}
              />
            )}

        </div>

      </div>

    </aside>
  );
}

export default SchemaExplorer;