function QueryHistory({
  history = [],
  onSelect,
  onDelete,
  onClear,
}) {
  if (history.length === 0) {
    return (
      <div className="rounded-lg border border-[#202a34] bg-[#0e141b] p-5">

        <div className="font-mono text-[9px] uppercase tracking-wider text-[#53616d]">
          Query History
        </div>

        <p className="mt-3 text-xs text-[#667581]">
          Your previous queries will appear here.
        </p>

      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-[#202a34] bg-[#0e141b]">

      <div className="flex items-center justify-between border-b border-[#202a34] bg-[#111820] px-4 py-3">

        <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#8ed0df]">
          Query History
        </span>

        <button
          type="button"
          onClick={onClear}
          className="text-[9px] uppercase tracking-wider text-[#687783] hover:text-[#d7e0e7]"
        >
          Clear
        </button>

      </div>

      <div className="divide-y divide-[#19222b]">

        {history.map((item) => (
          <div
            key={item.id}
            className="group flex items-start gap-3 px-4 py-3 hover:bg-[#121a22]"
          >

            <button
              type="button"
              onClick={() => onSelect?.(item)}
              className="min-w-0 flex-1 text-left"
            >

              <div className="truncate text-xs text-[#b9c5ce]">
                {item.question}
              </div>

              <div className="mt-1 truncate font-mono text-[9px] text-[#596875]">
                {item.sql}
              </div>

            </button>

            <button
              type="button"
              onClick={() => onDelete?.(item.id)}
              className="opacity-0 text-[9px] uppercase text-[#7d5960] transition group-hover:opacity-100 hover:text-[#e47c8b]"
            >
              Delete
            </button>

          </div>
        ))}

      </div>

    </div>
  );
}

export default QueryHistory;