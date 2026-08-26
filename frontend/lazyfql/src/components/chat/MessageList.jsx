function MessageList({
  messages = [],
  isGenerating = false,
  error = "",
}) {
  if (!messages.length && !isGenerating) {
    return (
      <div className="flex min-h-[220px] items-center justify-center text-center">

        <div className="max-w-sm">

          <div className="mx-auto grid h-11 w-11 place-items-center rounded-lg border border-[#293641] bg-[#111820] font-mono text-sm text-[#5d96a3]">
            &gt;_
          </div>

          <h3 className="mt-4 text-sm font-semibold text-[#cbd5dd]">
            Ask your database
          </h3>

          <p className="mt-2 text-xs leading-5 text-[#667581]">
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
        const isUser =
          message.role === "user";

        const isError =
          message.role === "error";

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
                    ? "font-mono text-[9px] font-semibold uppercase tracking-wider text-[#6e8794]"
                    : isError
                    ? "font-mono text-[9px] font-semibold uppercase tracking-wider text-[#df7c8a]"
                    : "font-mono text-[9px] font-semibold uppercase tracking-wider text-[#71b6c4]"
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
                  ? "rounded-lg border border-[#293641] bg-[#151d26] px-4 py-3"
                  : isError
                  ? "rounded-lg border border-[#51333a] bg-[#1b1115] px-4 py-3"
                  : "rounded-lg border border-[#202a34] bg-[#111820] px-4 py-3"
              }
            >

              <p
                className={
                  isUser
                    ? "whitespace-pre-wrap text-sm leading-6 text-[#d0d9e0]"
                    : isError
                    ? "whitespace-pre-wrap text-sm leading-6 text-[#c6a1a7]"
                    : "whitespace-pre-wrap text-sm leading-6 text-[#aebbc5]"
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

          <div className="mb-1.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-[#71b6c4]">
            LAZYQL
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-[#202a34] bg-[#111820] px-4 py-3">

            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#5aa9bb]" />
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#5aa9bb] [animation-delay:150ms]" />
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#5aa9bb] [animation-delay:300ms]" />

            <span className="ml-2 text-xs text-[#687783]">
              Generating SQL...
            </span>

          </div>

        </div>
      )}

      {error && (
        <div className="rounded-md border border-[#51333a] bg-[#1b1115] px-4 py-3">

          <div className="font-mono text-[9px] font-semibold uppercase tracking-wider text-[#df7c8a]">
            Generation Error
          </div>

          <p className="mt-1 text-xs leading-5 text-[#c6a1a7]">
            {error}
          </p>

        </div>
      )}

    </div>
  );
}

export default MessageList;