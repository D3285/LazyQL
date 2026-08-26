function SQLiteFileSelector({
  onSubmit,
  onFileChange,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="text-center"
    >

      <div className="border border-dashed border-[#9b7943] px-6 py-12">

        <div className="text-4xl text-[#b58a45]">
          ◇
        </div>

        <h2 className="mt-5 font-serif text-xl">
          Bring forth your archive
        </h2>

        <p className="mt-2 font-serif text-[#72572f]">
          Select a local SQLite database.
        </p>

        <input
          type="file"
          accept=".db,.sqlite,.sqlite3"
          onChange={onFileChange}
          className="mt-6 font-serif text-sm"
        />

      </div>

      <button
        type="submit"
        className="mt-6 w-full border border-[#9b702f] bg-gradient-to-br from-[#9b6e2d] to-[#c59a50] px-6 py-4 font-serif text-[10px] tracking-[0.2em] text-[#24170c] shadow-lg transition hover:-translate-y-1"
      >
        OPEN ARCHIVE
        <span className="ml-5">→</span>
      </button>

    </form>
  );
}

export default SQLiteFileSelector;