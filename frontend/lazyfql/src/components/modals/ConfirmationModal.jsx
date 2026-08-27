function ConfirmationModal({
  open,
  sql = "",
  affectedRows = null,
  onConfirm,
  onCancel,
  isLoading = false,
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#080910]/75 p-4 backdrop-blur-md">

      <div className="w-full max-w-lg overflow-hidden rounded-xl border border-[#51463b] bg-[#181a24] shadow-2xl">

        {/* HEADER */}

        <div className="border-b border-[#34364a] bg-[#1d2030] px-5 py-4">

          <div className="flex items-center gap-2">

            <span className="text-[#d6b36a]">
              ◇
            </span>

            <div className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#d6b36a]">
              Confirmation Required
            </div>

          </div>

          <h2 className="mt-2 text-lg font-semibold text-[#f4f1f6]">
            This query will modify your database
          </h2>

        </div>

        {/* BODY */}

        <div className="space-y-4 p-5">

          <p className="text-sm leading-6 text-[#aaa7b7]">
            This operation may change or remove database
            records. Review the SQL before continuing.
          </p>

          {affectedRows != null && (
            <div className="rounded-lg border border-[#594a2c] bg-[#211c12] px-4 py-3">

              <div className="font-mono text-[9px] uppercase tracking-wider text-[#a48c58]">
                Potentially affected rows
              </div>

              <div className="mt-1 font-mono text-lg text-[#d6b36a]">
                {affectedRows}
              </div>

            </div>
          )}

          <pre className="max-h-48 overflow-auto rounded-lg border border-[#34364a] bg-[#10121a] p-4 font-mono text-xs leading-6 text-[#d5d1dc]">
            {sql}
          </pre>

        </div>

        {/* ACTIONS */}

        <div className="flex justify-end gap-2 border-t border-[#34364a] bg-[#151722] px-5 py-4">

          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="rounded-md border border-[#414356] px-4 py-2 font-mono text-[10px] font-medium uppercase tracking-wider text-[#aaa7b7] transition hover:border-[#66687d] hover:bg-[#202333] hover:text-white"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="rounded-md bg-[#b06b61] px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-wider text-white transition hover:bg-[#c17a6f] disabled:opacity-50"
          >
            {isLoading
              ? "Executing..."
              : "Confirm & Execute"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default ConfirmationModal;