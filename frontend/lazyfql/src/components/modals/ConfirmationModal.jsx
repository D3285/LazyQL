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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">

      <div className="w-full max-w-lg rounded-xl border border-[#3b3430] bg-[#11161d] shadow-2xl">

        {/* HEADER */}

        <div className="border-b border-[#252e37] px-5 py-4">

          <div className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#d7b66d]">
            Confirmation Required
          </div>

          <h2 className="mt-2 text-lg font-semibold text-[#e6edf3]">
            This query will modify your database
          </h2>

        </div>

        {/* BODY */}

        <div className="space-y-4 p-5">

          <p className="text-sm leading-6 text-[#9aa7b3]">
            This operation may change or remove database
            records. Review the SQL before continuing.
          </p>

          {affectedRows != null && (
            <div className="rounded-md border border-[#4b3d22] bg-[#19150d] px-4 py-3">

              <div className="text-[9px] uppercase tracking-wider text-[#8c7850]">
                Potentially affected rows
              </div>

              <div className="mt-1 font-mono text-lg text-[#d7b66d]">
                {affectedRows}
              </div>

            </div>
          )}

          <pre className="max-h-48 overflow-auto rounded-md border border-[#252e37] bg-[#080c11] p-4 font-mono text-xs leading-6 text-[#cbd7df]">
            {sql}
          </pre>

        </div>

        {/* ACTIONS */}

        <div className="flex justify-end gap-2 border-t border-[#252e37] px-5 py-4">

          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="rounded-md border border-[#303c48] px-4 py-2 text-[10px] font-medium uppercase tracking-wider text-[#9ca8b4] hover:bg-[#171e26]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="rounded-md bg-[#a66b52] px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-white hover:bg-[#b9785c] disabled:opacity-50"
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