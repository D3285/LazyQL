function SQLiteFileSelector({
  connectionUrl,
  onConnectionUrlChange,
  disabled = false,
}) {
  return (
    <div className="space-y-3">
      <label className="block font-serif text-[10px] tracking-[0.18em] text-[#80602f]">
        SQLITE CONNECTION URL
      </label>

      <input
        type="text"
        value={connectionUrl}
        onChange={(event) =>
          onConnectionUrlChange(event.target.value)
        }
        disabled={disabled}
        placeholder="sqlite:///path/to/company.db"
        className="w-full border border-[#b89a67] bg-[#fff8e8] px-4 py-3 font-mono text-sm text-[#24170c] outline-none transition focus:border-[#8c652d] disabled:opacity-50"
      />

      <p className="font-serif text-[11px] leading-5 text-[#80602f]">
        Enter the SQLite connection URL expected by the
        backend.
      </p>
    </div>
  );
}

export default SQLiteFileSelector;