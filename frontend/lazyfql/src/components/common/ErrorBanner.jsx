function ErrorBanner({
  message,
  onDismiss,
}) {
  if (!message) {
    return null;
  }

  return (
    <div className="border border-[#8b573e] bg-[#ead0b4] p-4">

      <div className="flex items-start justify-between gap-4">

        <div>
          <div className="font-serif text-[9px] tracking-[0.2em] text-[#8b573e]">
            ERROR
          </div>

          <p className="mt-2 font-serif text-sm leading-relaxed text-[#603b2b]">
            {message}
          </p>
        </div>

        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="font-serif text-xs text-[#8b573e]"
          >
            ×
          </button>
        )}

      </div>

    </div>
  );
}

export default ErrorBanner;