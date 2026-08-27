import { useConnection } from "../context/ConnectionContext";
import SchemaTree from "./SchemaTree";

function SchemaExplorer({
  collapsed = false,
  onToggle,
}) {
  const {
    databaseType,
    isConnected,
    schema,
    isSchemaLoading,
    schemaError,
  } = useConnection();

  return (
    <aside
      className={`
        h-full
        min-h-[calc(100vh-64px)]
        overflow-hidden
        bg-[var(--lq-sidebar)]
        text-[var(--lq-sidebar-text)]
        transition-colors duration-300
        ${collapsed ? "p-3" : "p-5"}
      `}
    >

      {/* =====================================================
          TOP
      ====================================================== */}

      <div
        className={`
          flex items-center
          ${collapsed
            ? "justify-center"
            : "justify-between"
          }
        `}
      >

        {!collapsed && (
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
                tracking-[0.2em]
                text-[var(--lq-primary)]
              "
            >
              Database
            </div>

          </div>
        )}

        {collapsed && (
          <span
            className="
              text-lg
              text-[var(--lq-primary)]
            "
          >
            ✿
          </span>
        )}

        {!collapsed && (
          <span
            className="
              h-2 w-2 rounded-full
              bg-[var(--lq-success)]
              shadow-[0_0_8px_rgba(94,203,139,0.5)]
            "
          />
        )}

      </div>

      {/* =====================================================
          DATABASE INFO
      ====================================================== */}

      {!collapsed && (
        <>
          <h2
            className="
              mt-4
              font-mono text-sm
              font-semibold
              text-[var(--lq-sidebar-text)]
            "
          >
            Company DB
          </h2>

          {databaseType && (
            <div
              className="
                mt-2
                font-mono text-[10px]
                uppercase tracking-wider
                text-[var(--lq-text-muted)]
              "
            >
              {databaseType}
            </div>
          )}
        </>
      )}

      {/* =====================================================
          SCHEMA
      ====================================================== */}

      {!collapsed && (
        <div className="mt-7">

          {!isConnected && (
            <div
              className="
                rounded-lg
                border border-[var(--lq-border)]
                bg-[var(--lq-surface-soft)]
                p-3
                font-mono text-xs
                leading-5
                text-[var(--lq-text-soft)]
              "
            >
              No database connected.
            </div>
          )}

          {isConnected && isSchemaLoading && (
            <div
              className="
                rounded-lg
                border border-[var(--lq-border)]
                bg-[var(--lq-surface-soft)]
                p-3
              "
            >

              <div
                className="
                  flex items-center gap-2
                  font-mono text-xs
                  text-[var(--lq-text-soft)]
                "
              >

                <span
                  className="
                    h-2 w-2
                    animate-pulse
                    rounded-full
                    bg-[var(--lq-primary)]
                  "
                />

                Loading schema...

              </div>

            </div>
          )}

          {isConnected &&
            !isSchemaLoading &&
            schemaError && (
              <div
                className="
                  rounded-lg
                  border border-[var(--lq-danger-border)]
                  bg-[var(--lq-danger-soft)]
                  p-3
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
                    mt-2
                    font-mono text-xs
                    leading-5
                    text-[var(--lq-danger-text)]
                  "
                >
                  {schemaError}
                </p>

              </div>
            )}

          {isConnected &&
            !isSchemaLoading &&
            !schemaError &&
            schema && (
              <div
                className="
                  rounded-lg
                  border border-[var(--lq-border)]
                  bg-[var(--lq-surface-soft)]
                  p-3
                  shadow-sm
                "
              >

                <div
                  className="
                    mb-3
                    flex items-center
                    justify-between
                    border-b
                    border-[var(--lq-border)]
                    pb-3
                  "
                >

                  <span
                    className="
                      font-mono text-[10px]
                      uppercase tracking-wider
                      text-[var(--lq-text-muted)]
                    "
                  >
                    Tables
                  </span>

                  <span
                    className="
                      rounded-full
                      bg-[var(--lq-primary-soft)]
                      px-2 py-0.5
                      font-mono text-[10px]
                      text-[var(--lq-primary)]
                    "
                  >
                    {schema.tables?.length || 0}
                  </span>

                </div>

                <SchemaTree
                  tables={schema.tables || []}
                />

              </div>
            )}

        </div>
      )}

      {/* =====================================================
          COLLAPSE BUTTON
      ====================================================== */}

      <div
        className={`
          mt-4
          flex
          ${collapsed
            ? "justify-center"
            : "justify-end"
          }
        `}
      >

        <button
          type="button"
          onClick={onToggle}
          title={
            collapsed
              ? "Expand sidebar"
              : "Collapse sidebar"
          }
          aria-label={
            collapsed
              ? "Expand sidebar"
              : "Collapse sidebar"
          }
          className="
            grid
            h-9 w-9
            place-items-center
            rounded-md
            border border-[var(--lq-border)]
            bg-[var(--lq-surface)]
            text-[var(--lq-text-soft)]
            transition-all duration-200
            hover:border-[var(--lq-primary)]
            hover:bg-[var(--lq-primary-soft)]
            hover:text-[var(--lq-primary)]
          "
        >

          <span className="font-mono text-base leading-none">
            {collapsed ? "→" : "←"}
          </span>

        </button>

      </div>

    </aside>
  );
}

export default SchemaExplorer;