function MessageInput({
  query = "",
  onQueryChange,
  onAsk,
  isGenerating = false,
}) {
  const handleSubmit = (event) => {
    event.preventDefault();

    const question = query.trim();

    if (!question || isGenerating) {
      return;
    }

    onAsk(question);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-[#202a34] pt-4"
    >
      <div className="flex flex-col gap-3 sm:flex-row">

        <textarea
          value={query}
          onChange={(event) =>
            onQueryChange(event.target.value)
          }
          onKeyDown={(event) => {
            if (
              event.key === "Enter" &&
              !event.shiftKey
            ) {
              event.preventDefault();
              handleSubmit(event);
            }
          }}
          disabled={isGenerating}
          rows={2}
          placeholder="Ask your database anything..."
          className="min-h-[56px] flex-1 resize-none rounded-md border border-[#293641] bg-[#080c11] px-4 py-3 font-mono text-xs leading-6 text-[#d5dee5] outline-none placeholder:text-[#4f5d68] focus:border-[#4c8494] disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={
            isGenerating ||
            !query.trim()
          }
          className="rounded-md bg-[#4c9aaa] px-6 py-3 text-[10px] font-semibold uppercase tracking-wider text-[#071014] transition hover:bg-[#62b4c4] disabled:cursor-not-allowed disabled:opacity-40 sm:self-stretch"
        >
          {isGenerating
            ? "Generating..."
            : "Ask →"}
        </button>

      </div>

      <div className="mt-2 font-mono text-[9px] text-[#596875]">
        ENTER to ask · SHIFT + ENTER for a new line
      </div>
    </form>
  );
}

export default MessageInput;