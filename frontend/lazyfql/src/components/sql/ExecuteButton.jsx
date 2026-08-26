function ExecuteButton({
  onExecute,
  isExecuting,
}) {
  return (
    <button
      type="button"
      onClick={onExecute}
      disabled={isExecuting}
      className="border border-[#b58a45] bg-[#a47736] px-5 py-3 font-serif text-[9px] tracking-widest text-[#21170d] transition hover:bg-[#c59a50] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isExecuting
        ? "EXECUTING..."
        : "EXECUTE QUERY →"}
    </button>
  );
}

export default ExecuteButton;