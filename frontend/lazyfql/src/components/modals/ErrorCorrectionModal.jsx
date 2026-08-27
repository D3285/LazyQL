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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">

      <div className="w-full max-w-2xl rounded-xl border border-[#51333a] bg-[#11161d] shadow-2xl">

        <div className="border-b border-[#252e37] px-5 py-4">

          <div className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#e47c8b]">
            Query Error
          </div>

          <h2 className="mt-2 text-lg font-semibold text-[#e6edf3]">
            Correct the SQL and retry
          </h2>

        </div>

        <div className="p-5">

          <div className="rounded-md border border-[#51333a] bg-[#1b1115] p-4">

            <div className="font-mono text-[9px] uppercase tracking-wider text-[#df7c8a]">
              Database response
            </div>

            <p className="mt-2 text-sm leading-6 text-[#c6a1a7]">
              {error || "The query could not be executed."}
            </p>

          </div>

          <label className="mt-5 block font-mono text-[9px] uppercase tracking-wider text-[#637581]">
            SQL
          </label>

          <textarea
            value={sql}
            onChange={(event) =>
              onChange?.(event.target.value)
            }
            spellCheck={false}
            className="mt-2 min-h-52 w-full resize-y rounded-md border border-[#2b3945] bg-[#080c11] p-4 font-mono text-xs leading-6 text-[#cbd7df] outline-none focus:border-[#4c8494]"
          />

        </div>

        <div className="flex justify-end gap-2 border-t border-[#252e37] px-5 py-4">

          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-md border border-[#303c48] px-4 py-2 text-[10px] font-medium uppercase tracking-wider text-[#9ca8b4] hover:bg-[#171e26]"
          >
            Close
          </button>

          <button
            type="button"
            onClick={onRetry}
            disabled={isLoading}
            className="rounded-md bg-[#4c9aaa] px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-[#071014] hover:bg-[#62b4c4] disabled:opacity-50"
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