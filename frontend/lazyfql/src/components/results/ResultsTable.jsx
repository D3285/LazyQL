function ResultsTable({
  columns = [],
  rows = [],
  isLoading = false,
}) {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-[var(--lq-border)] bg-[var(--lq-surface)] p-8 text-center">
        <div className="mx-auto h-5 w-5 animate-spin rounded-full border-2 border-[var(--lq-border)] border-t-[var(--lq-primary)]" />

        <p className="mt-3 text-xs text-[var(--lq-text-muted)]">
          Loading results...
        </p>
      </div>
    );
  }

  if (!columns.length) {
    return (
      <div className="rounded-lg border border-[var(--lq-border)] bg-[var(--lq-surface)] p-8 text-center">
        <p className="text-sm text-[var(--lq-text-soft)]">
          Query executed successfully.
        </p>

        <p className="mt-1 text-xs text-[var(--lq-text-muted)]">
          No columns were returned.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-[var(--lq-border)] bg-[var(--lq-surface)]">

      {/* HEADER */}

      <div className="flex items-center justify-between border-b border-[var(--lq-border)] bg-[var(--lq-surface-soft)] px-4 py-3">

        <span className="flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--lq-primary)]">
          <span className="text-xs">◈</span>
          Query Results
        </span>

        <span className="rounded-full bg-[var(--lq-primary-soft)] px-2 py-1 font-mono text-[9px] text-[var(--lq-primary)]">
          {rows.length} ROWS
        </span>

      </div>

      {/* EMPTY RESULT */}

      {rows.length === 0 ? (
        <div className="p-8 text-center text-sm text-[var(--lq-text-soft)]">
          Query executed successfully. No rows returned.
        </div>
      ) : (

        /* TABLE */

        <div className="max-h-[500px] overflow-auto">

          <table className="w-full border-collapse text-left">

            <thead className="sticky top-0 z-10 bg-[var(--lq-bg-soft)]">

              <tr className="border-b border-[var(--lq-border)]">

                {columns.map((column) => (
                  <th
                    key={column}
                    className="whitespace-nowrap px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--lq-text-soft)]"
                  >
                    {column}
                  </th>
                ))}

              </tr>

            </thead>

            <tbody>

              {rows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="border-b border-[var(--lq-border)] last:border-0 hover:bg-[var(--lq-surface-soft)]"
                >

                  {row.map((value, columnIndex) => (
                    <td
                      key={columnIndex}
                      className="whitespace-nowrap px-4 py-3 font-mono text-xs text-[var(--lq-text)]"
                    >
                      {value == null
                        ? "NULL"
                        : String(value)}
                    </td>
                  ))}

                </tr>
              ))}

            </tbody>

          </table>

        </div>
      )}

    </div>
  );
}

export default ResultsTable;