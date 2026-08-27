function SchemaTree({ tables = [] }) {
  if (tables.length === 0) {
    return (
      <div className="font-serif text-sm text-[#6c5434]">
        No tables discovered.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {tables.map((table) => (
        <div
          key={table.name}
          className="border-b border-[#98733e]/30 pb-4"
        >
          <div className="font-serif text-[10px] tracking-widest text-[#35230f]">
            ▾ {table.name}
          </div>

          <div className="mt-2 space-y-2">
            {table.columns?.map((column) => (
              <div
                key={column.name}
                className="flex items-center justify-between gap-3 pl-4"
              >
                <span className="font-serif text-sm text-[#6c5434]">
                  {column.name}
                </span>

                <span className="font-mono text-[9px] text-[#96703a]">
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