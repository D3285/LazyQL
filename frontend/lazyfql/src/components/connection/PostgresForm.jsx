function PostgresForm({
  form,
  onChange,
  onSubmit,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-5"
    >

      {/* HOST */}

      <div>
        <label className="mb-2 block font-serif text-[10px] tracking-[0.2em] text-[#72572f]">
          HOST
        </label>

        <input
          name="host"
          value={form.host}
          onChange={onChange}
          placeholder="localhost"
          className="w-full border border-[#b89a67] bg-[#fff8e8]/70 px-4 py-3 font-serif outline-none transition focus:border-[#8c652d]"
        />
      </div>

      {/* PORT + DATABASE */}

      <div className="grid gap-5 md:grid-cols-2">

        <div>
          <label className="mb-2 block font-serif text-[10px] tracking-[0.2em] text-[#72572f]">
            PORT
          </label>

          <input
            name="port"
            value={form.port}
            onChange={onChange}
            placeholder="5432"
            className="w-full border border-[#b89a67] bg-[#fff8e8]/70 px-4 py-3 font-serif outline-none transition focus:border-[#8c652d]"
          />
        </div>

        <div>
          <label className="mb-2 block font-serif text-[10px] tracking-[0.2em] text-[#72572f]">
            DATABASE
          </label>

          <input
            name="database"
            value={form.database}
            onChange={onChange}
            placeholder="company_db"
            className="w-full border border-[#b89a67] bg-[#fff8e8]/70 px-4 py-3 font-serif outline-none transition focus:border-[#8c652d]"
          />
        </div>

      </div>

      {/* USERNAME */}

      <div>
        <label className="mb-2 block font-serif text-[10px] tracking-[0.2em] text-[#72572f]">
          USERNAME
        </label>

        <input
          name="username"
          value={form.username}
          onChange={onChange}
          placeholder="ai_user"
          className="w-full border border-[#b89a67] bg-[#fff8e8]/70 px-4 py-3 font-serif outline-none transition focus:border-[#8c652d]"
        />
      </div>

      {/* PASSWORD */}

      <div>
        <label className="mb-2 block font-serif text-[10px] tracking-[0.2em] text-[#72572f]">
          PASSWORD
        </label>

        <input
          type="password"
          name="password"
          value={form.password}
          onChange={onChange}
          placeholder="••••••••"
          className="w-full border border-[#b89a67] bg-[#fff8e8]/70 px-4 py-3 font-serif outline-none transition focus:border-[#8c652d]"
        />
      </div>

      {/* SUBMIT */}

      <button
        type="submit"
        className="mt-3 w-full border border-[#9b702f] bg-gradient-to-br from-[#9b6e2d] to-[#c59a50] px-6 py-4 font-serif text-[10px] tracking-[0.2em] text-[#24170c] shadow-lg transition hover:-translate-y-1"
      >
        ESTABLISH CONNECTION
        <span className="ml-5">→</span>
      </button>

    </form>
  );
}

export default PostgresForm;