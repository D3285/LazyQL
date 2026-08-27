function SchemaTree({ tables = [] }) {
  if (tables.length === 0) {
    return (
      <div className="font-mono text-xs text-[var(--lq-text-muted)]">
        No tables discovered.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {tables.map((table) => (
        <div
          key={table.name}
          className="border-b border-[var(--lq-border)] pb-4 last:border-b-0"
        >
          {/* TABLE NAME */}

          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--lq-primary)]">
              ◈
            </span>

            <span className="font-mono text-xs font-semibold text-[var(--lq-text)]">
              {table.name}
            </span>
          </div>

          {/* COLUMNS */}

          <div className="mt-3 space-y-2">
            {table.columns?.map((column) => (
              <div
                key={column.name}
                className="flex items-center justify-between gap-3 pl-3"
              >
                <span className="font-mono text-xs text-[var(--lq-text-soft)]">
                  {column.name}
                </span>

                <span className="shrink-0 rounded-md bg-[var(--lq-primary-soft)] px-2 py-1 font-mono text-[8px] font-semibold uppercase tracking-wide text-[var(--lq-primary)]">
                  {column.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default SchemaTree;