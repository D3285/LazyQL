function SQLEditor({
  sql,
  onChange,
  onSave,
  onCancel,
}) {
  return (
    <div className="p-5">

      <textarea
        value={sql}
        onChange={(event) => onChange(event.target.value)}
        spellCheck={false}
        className="min-h-52 w-full resize-y border border-[#705329] bg-[#171009] p-5 font-mono text-sm leading-7 text-[#ddc58e] outline-none focus:border-[#b58a45]"
      />

      <div className="mt-4 flex flex-wrap gap-3">

        <button
          type="button"
          onClick={onSave}
          className="border border-[#b58a45] bg-[#a47736] px-5 py-3 font-serif text-[9px] tracking-widest text-[#21170d] transition hover:bg-[#c59a50]"
        >
          SAVE SQL
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="border border-[#705329] px-5 py-3 font-serif text-[9px] tracking-widest text-[#b99b68] transition hover:border-[#b58a45]"
        >
          CANCEL
        </button>

      </div>

    </div>
  );
}

export default SQLEditor;