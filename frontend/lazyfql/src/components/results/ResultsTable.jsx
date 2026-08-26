function ResultsTable({
  columns = [],
  rows = [],
  isLoading = false,
}) {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-[#202a34] bg-[#0e141b] p-8 text-center">
        <div className="mx-auto h-5 w-5 animate-spin rounded-full border-2 border-[#45636d] border-t-[#62b4c4]" />

        <p className="mt-3 text-xs text-[#71808c]">
          Loading results...
        </p>
      </div>
    );
  }

  if (!columns.length) {
    return (
      <div className="rounded-lg border border-[#202a34] bg-[#0e141b] p-8 text-center">
        <p className="text-sm text-[#87949f]">
          Query executed successfully.
        </p>

        <p className="mt-1 text-xs text-[#596875]">
          No columns were returned.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-[#202a34] bg-[#0e141b]">

      <div className="flex items-center justify-between border-b border-[#202a34] bg-[#111820] px-4 py-3">

        <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#8ed0df]">
          Query Results
        </span>

        <span className="font-mono text-[9px] text-[#687783]">
          {rows.length} ROWS
        </span>

      </div>

      {rows.length === 0 ? (
        <div className="p-8 text-center text-sm text-[#687783]">
          Query executed successfully. No rows returned.
        </div>
      ) : (
        <div className="max-h-[500px] overflow-auto">

          <table className="w-full border-collapse text-left">

            <thead className="sticky top-0 bg-[#0b1016]">

              <tr className="border-b border-[#202a34]">

                {columns.map((column) => (
                  <th
                    key={column}
                    className="whitespace-nowrap px-4 py-3 font-mono text-[10px] font-medium uppercase tracking-wider text-[#788895]"
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
                  className="border-b border-[#19222b] last:border-0 hover:bg-[#121a22]"
                >

                  {row.map((value, columnIndex) => (
                    <td
                      key={columnIndex}
                      className="whitespace-nowrap px-4 py-3 font-mono text-xs text-[#b9c5ce]"
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