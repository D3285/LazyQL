function MessageList({
  messages = [],
  isGenerating = false,
  error = "",
}) {
  if (!messages.length && !isGenerating) {
    return (
      <div className="flex min-h-[220px] items-center justify-center text-center">
        <div className="max-w-sm">
          <div
            className="
              mx-auto
              grid
              h-11
              w-11
              place-items-center
              rounded-lg
              border
              border-[var(--lq-border)]
              bg-[var(--lq-surface-soft)]
              font-mono
              text-sm
              text-[var(--lq-primary)]
            "
          >
            &gt;_
          </div>

          <h3 className="mt-4 text-sm font-semibold text-[var(--lq-text)]">
            Ask your database
          </h3>

          <p className="mt-2 text-xs leading-5 text-[var(--lq-text-soft)]">
            Describe what you want to know in plain language.
            LazyQL will use your database schema to generate SQL.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-h-[420px] space-y-4 overflow-y-auto pr-1">
      {messages.map((message) => {
        const isUser = message.role === "user";
        const isError = message.role === "error";

        return (
          <div
            key={message.id}
            className={
              isUser
                ? "ml-auto max-w-[90%] md:max-w-[75%]"
                : "mr-auto max-w-[90%] md:max-w-[80%]"
            }
          >
            <div className="mb-1.5 flex items-center gap-2">
              <span
                className={
                  isUser
                    ? "font-mono text-[9px] font-semibold uppercase tracking-wider text-[var(--lq-purple)]"
                    : isError
                    ? "font-mono text-[9px] font-semibold uppercase tracking-wider text-[var(--lq-danger)]"
                    : "font-mono text-[9px] font-semibold uppercase tracking-wider text-[var(--lq-primary)]"
                }
              >
                {isUser
                  ? "YOU"
                  : isError
                  ? "ERROR"
                  : "LAZYQL"}
              </span>
            </div>

            <div
              className={
                isUser
                  ? `
                    rounded-lg
                    border
                    border-[var(--lq-border)]
                    bg-[var(--lq-surface-soft)]
                    px-4
                    py-3
                  `
                  : isError
                  ? `
                    rounded-lg
                    border
                    border-[var(--lq-danger)]
                    bg-[var(--lq-danger-soft)]
                    px-4
                    py-3
                  `
                  : `
                    rounded-lg
                    border
                    border-[var(--lq-border)]
                    bg-[var(--lq-surface)]
                    px-4
                    py-3
                  `
              }
            >
              <p
                className={
                  isUser
                    ? "whitespace-pre-wrap text-sm leading-6 text-[var(--lq-text)]"
                    : isError
                    ? "whitespace-pre-wrap text-sm leading-6 text-[var(--lq-danger-text)]"
                    : "whitespace-pre-wrap text-sm leading-6 text-[var(--lq-text-soft)]"
                }
              >
                {message.text || message.content}
              </p>
            </div>
          </div>
        );
      })}

      {isGenerating && (
        <div className="mr-auto max-w-[80%]">
          <div className="mb-1.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-[var(--lq-primary)]">
            LAZYQL
          </div>

          <div
            className="
              flex
              items-center
              gap-2
              rounded-lg
              border
              border-[var(--lq-border)]
              bg-[var(--lq-surface)]
              px-4
              py-3
            "
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--lq-primary)]" />
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--lq-primary)] [animation-delay:150ms]" />
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--lq-primary)] [animation-delay:300ms]" />

            <span className="ml-2 text-xs text-[var(--lq-text-muted)]">
              Generating SQL...
            </span>
          </div>
        </div>
      )}

      {error && (
        <div
          className="
            rounded-lg
            border
            border-[var(--lq-danger)]
            bg-[var(--lq-danger-soft)]
            px-4
            py-3
          "
        >
          <div className="font-mono text-[9px] font-semibold uppercase tracking-wider text-[var(--lq-danger)]">
            Generation Error
          </div>

          <p className="mt-1 text-xs leading-5 text-[var(--lq-danger-text)]">
            {error}
          </p>
        </div>
      )}
    </div>
  );
}

export default MessageList;