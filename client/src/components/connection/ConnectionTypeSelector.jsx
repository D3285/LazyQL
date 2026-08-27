function ConnectionTypeSelector({
  databaseType,
  onDatabaseTypeChange,
}) {
  return (
    <div className="mb-8 grid grid-cols-2 border-b border-[#b89a67]">

      <button
        type="button"
        onClick={() => onDatabaseTypeChange("postgresql")}
        className={`px-4 py-4 font-serif text-xs tracking-[0.2em] transition ${
          databaseType === "postgresql"
            ? "border-b-2 border-[#a77b38] text-[#38230f]"
            : "text-[#806744] hover:text-[#38230f]"
        }`}
      >
        POSTGRESQL
      </button>

      <button
        type="button"
        onClick={() => onDatabaseTypeChange("sqlite")}
        className={`px-4 py-4 font-serif text-xs tracking-[0.2em] transition ${
          databaseType === "sqlite"
            ? "border-b-2 border-[#a77b38] text-[#38230f]"
            : "text-[#806744] hover:text-[#38230f]"
        }`}
      >
        SQLITE
      </button>

    </div>
  );
}

export default ConnectionTypeSelector;