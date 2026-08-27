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
      className="border-t border-[var(--lq-border)] pt-4"
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
          className="
            min-h-[56px]
            flex-1
            resize-none
            rounded-lg
            border
            border-[var(--lq-border)]
            bg-[var(--lq-surface-soft)]
            px-4
            py-3
            font-mono
            text-xs
            leading-6
            text-[var(--lq-text)]
            outline-none
            placeholder:text-[var(--lq-text-muted)]
            focus:border-[var(--lq-primary)]
            disabled:opacity-50
          "
        />

        <button
          type="submit"
          disabled={
            isGenerating ||
            !query.trim()
          }
          className="
            rounded-lg
            bg-[var(--lq-primary)]
            px-6
            py-3
            font-mono
            text-[10px]
            font-semibold
            uppercase
            tracking-wider
            text-white
            transition
            hover:bg-[var(--lq-primary-hover)]
            disabled:cursor-not-allowed
            disabled:opacity-40
            sm:self-stretch
          "
        >
          {isGenerating
            ? "Generating..."
            : "Ask →"}
        </button>
      </div>

      <div className="mt-2 font-mono text-[9px] text-[var(--lq-text-muted)]">
        ENTER to ask · SHIFT + ENTER for a new line
      </div>
    </form>
  );
}

export default MessageInput;