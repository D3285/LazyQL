function LoadingSpinner({
  label = "Loading...",
}) {
  return (
    <div className="flex items-center gap-3 font-serif text-sm text-[#6c5434]">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#9b743b] border-t-transparent" />
      {label}
    </div>
  );
}

export default LoadingSpinner;