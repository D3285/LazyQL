function EmptyState({
  title = "Nothing here yet",
  description = "",
}) {
  return (
    <div className="border border-dashed border-[#b89a67] p-8 text-center">

      <div className="text-2xl text-[#b58a45]">
        ◇
      </div>

      <h3 className="mt-4 font-serif text-lg">
        {title}
      </h3>

      {description && (
        <p className="mx-auto mt-2 max-w-md font-serif text-sm leading-relaxed text-[#6c5434]">
          {description}
        </p>
      )}

    </div>
  );
}

export default EmptyState;