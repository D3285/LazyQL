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
    <aside className="hidden border-r border-[#211a30] bg-[#0b0911] p-5 md:block">

      {/* HEADER */}

      <div className="flex items-center justify-between">

        <div className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-[#8a55ed]">
          Database
        </div>

        <span className="h-2 w-2 rounded-full bg-[#4fd17b]" />

      </div>

      <h2 className="mt-3 font-mono text-sm font-semibold text-white">
        Company DB
      </h2>

      {databaseType && (
        <div className="mt-2 font-mono text-[9px] uppercase tracking-wider text-[#686174]">
          {databaseType}
        </div>
      )}

      {/* SCHEMA */}

      <div className="mt-7">

        {!isConnected && (
          <div className="rounded-md border border-[#282039] bg-[#0e0c15] p-3 font-mono text-[10px] leading-5 text-[#686174]">
            No database connected.
          </div>
        )}

        {isConnected && isSchemaLoading && (
          <div className="rounded-md border border-[#282039] bg-[#0e0c15] p-3">

            <div className="flex items-center gap-2 font-mono text-[10px] text-[#81788e]">

              <span className="h-2 w-2 animate-pulse rounded-full bg-[#8a55ed]" />

              Loading schema...

            </div>

          </div>
        )}

        {isConnected &&
          !isSchemaLoading &&
          schemaError && (
            <div className="rounded-md border border-[#572d3b] bg-[#1b0f17] p-3">

              <div className="font-mono text-[9px] font-semibold uppercase tracking-wider text-[#ef718c]">
                Schema Error
              </div>

              <p className="mt-2 font-mono text-[10px] leading-5 text-[#c895a4]">
                {schemaError}
              </p>

            </div>
          )}

        {isConnected &&
          !isSchemaLoading &&
          !schemaError &&
          schema && (
            <div className="rounded-md border border-[#211a30] bg-[#0e0c15] p-3">

              <div className="mb-3 flex items-center justify-between border-b border-[#211a30] pb-3">

                <span className="font-mono text-[8px] uppercase tracking-wider text-[#625b70]">
                  Tables
                </span>

                <span className="font-mono text-[8px] text-[#8a55ed]">
                  {schema.tables?.length || 0}
                </span>

              </div>

              <SchemaTree
                tables={schema.tables || []}
              />

            </div>
          )}

      </div>

    </aside>
  );
}

export default SchemaExplorer;