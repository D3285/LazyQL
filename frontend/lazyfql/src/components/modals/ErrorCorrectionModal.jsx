function ErrorCorrectionModal({
  open,
  sql = "",
  error = "",
  onChange,
  onRetry,
  onClose,
  isLoading = false,
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#080910]/75 p-4 backdrop-blur-md">

      <div className="w-full max-w-2xl overflow-hidden rounded-xl border border-[#603440] bg-[#181a24] shadow-2xl">

        <div className="border-b border-[#34364a] bg-[#1d2030] px-5 py-4">

          <div className="flex items-center gap-2">

            <span className="text-[#e98291]">
              ⚠
            </span>

            <div className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#e98291]">
              Query Error
            </div>

          </div>

          <h2 className="mt-2 text-lg font-semibold text-[#f4f1f6]">
            Correct the SQL and retry
          </h2>

        </div>

        <div className="p-5">

          <div className="rounded-lg border border-[#603440] bg-[#21151b] p-4">

            <div className="font-mono text-[9px] uppercase tracking-wider text-[#e98291]">
              Database response
            </div>

            <p className="mt-2 text-sm leading-6 text-[#d09ca7]">
              {error || "The query could not be executed."}
            </p>

          </div>

          <label className="mt-5 block font-mono text-[9px] uppercase tracking-wider text-[#9693a5]">
            SQL
          </label>

          <textarea
            value={sql}
            onChange={(event) =>
              onChange?.(event.target.value)
            }
            spellCheck={false}
            className="mt-2 min-h-52 w-full resize-y rounded-lg border border-[#3b3d51] bg-[#10121a] p-4 font-mono text-xs leading-6 text-[#d5d1dc] outline-none transition focus:border-[#b28cff] focus:ring-1 focus:ring-[#b28cff]/20"
          />

        </div>

        <div className="flex justify-end gap-2 border-t border-[#34364a] bg-[#151722] px-5 py-4">

          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-md border border-[#414356] px-4 py-2 font-mono text-[10px] font-medium uppercase tracking-wider text-[#aaa7b7] transition hover:border-[#66687d] hover:bg-[#202333] hover:text-white"
          >
            Close
          </button>

          <button
            type="button"
            onClick={onRetry}
            disabled={isLoading}
            className="rounded-md bg-[#7652d4] px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-wider text-white transition hover:bg-[#8965e5] disabled:opacity-50"
          >
            {isLoading
              ? "Retrying..."
              : "Retry Query"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default ErrorCorrectionModal;