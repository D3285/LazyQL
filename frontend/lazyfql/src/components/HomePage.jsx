function HomePage({ onGetStarted }) {
  return (
    <main className="min-h-screen bg-[#080c14] text-[#e8edf5]">

      {/* NAVBAR */}
      <header className="border-b border-[#1d2635] bg-[#0a0f18]/95">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

          <div className="flex items-center gap-3">

            <div className="grid h-9 w-9 place-items-center rounded-lg border border-[#6d45d8] bg-[#151027] font-mono text-xs font-bold text-[#a477ff]">
              LQ
            </div>

            <div>
              <div className="font-mono text-sm font-bold tracking-wide">
                LAZYQL
              </div>

              <div className="hidden text-[8px] uppercase tracking-[0.2em] text-[#667386] sm:block">
                Local AI Database Assistant
              </div>
            </div>

          </div>

          <div className="flex items-center gap-3">

            <span className="hidden text-xs text-[#667386] sm:block">
              PostgreSQL · SQLite
            </span>

            <button
              type="button"
              onClick={onGetStarted}
              className="rounded-md border border-[#7044d8] bg-[#6535d3] px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-wider text-white transition hover:bg-[#7547e8]"
            >
              Get Started
            </button>

          </div>

        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">

        {/* Background glow */}
        <div className="pointer-events-none absolute left-1/2 top-20 h-80 w-80 -translate-x-1/2 rounded-full bg-[#6337d6]/10 blur-3xl" />

        <div className="relative mx-auto grid min-h-[calc(100vh-64px)] max-w-7xl items-center gap-16 px-6 py-16 lg:grid-cols-2 lg:px-10">

          {/* LEFT */}
          <div>

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#273448] bg-[#101722] px-3 py-2 font-mono text-[9px] uppercase tracking-wider text-[#8b9aae]">

              <span className="h-2 w-2 rounded-full bg-[#50c878]" />

              Local-first AI database assistant

            </div>

            <h1 className="max-w-3xl font-mono text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">

              Talk to your

              <span className="block text-[#8b5cf6]">
                database.
              </span>

            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-[#8995a6]">
              Ask questions in natural language. Let AI generate
              SQL, review the query, and execute it against your
              database with confidence.
            </p>

            {/* CTA */}
            <div className="mt-8 flex flex-wrap gap-3">

              <button
                type="button"
                onClick={onGetStarted}
                className="rounded-md border border-[#7548df] bg-[#6838d8] px-6 py-3 font-mono text-[10px] font-semibold uppercase tracking-wider text-white transition hover:bg-[#7849e8]"
              >
                Connect Database →
              </button>

              <button
                type="button"
                onClick={() => {
                  document
                    .getElementById("how-it-works")
                    ?.scrollIntoView({
                      behavior: "smooth",
                    });
                }}
                className="rounded-md border border-[#2a3545] bg-[#101722] px-6 py-3 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#a7b2c2] transition hover:border-[#7045d0] hover:text-white"
              >
                Learn More ↓
              </button>

            </div>

            {/* FEATURES */}
            <div className="mt-12 grid max-w-xl grid-cols-3 gap-3">

              <Feature
                number="01"
                title="CONNECT"
                text="Your database"
              />

              <Feature
                number="02"
                title="ASK"
                text="Natural language"
              />

              <Feature
                number="03"
                title="EXECUTE"
                text="Real results"
              />

            </div>

          </div>

          {/* RIGHT — SQL TERMINAL */}
          <div className="relative">

            <div className="overflow-hidden rounded-xl border border-[#263244] bg-[#0d131d] shadow-2xl shadow-black/40">

              {/* Window header */}
              <div className="flex items-center justify-between border-b border-[#202b3b] bg-[#111925] px-4 py-3">

                <div className="flex items-center gap-2">

                  <span className="h-2.5 w-2.5 rounded-full bg-[#ef5350]" />

                  <span className="h-2.5 w-2.5 rounded-full bg-[#e6b84d]" />

                  <span className="h-2.5 w-2.5 rounded-full bg-[#4caf70]" />

                </div>

                <span className="font-mono text-[9px] text-[#5e6c7e]">
                  lazyql.workspace
                </span>

              </div>

              {/* Question */}
              <div className="border-b border-[#202b3b] p-5">

                <div className="font-mono text-[9px] uppercase tracking-wider text-[#65758a]">
                  Natural Language
                </div>

                <div className="mt-3 rounded-md border border-[#273449] bg-[#111925] p-4 font-mono text-sm text-[#dce4ee]">
                  Show the 5 highest paid employees
                </div>

              </div>

              {/* SQL */}
              <div className="p-5">

                <div className="mb-3 flex items-center justify-between">

                  <span className="font-mono text-[9px] uppercase tracking-wider text-[#65758a]">
                    Generated SQL
                  </span>

                  <span className="rounded border border-[#24563b] bg-[#10251a] px-2 py-1 font-mono text-[8px] text-[#62d98b]">
                    VALID SQL
                  </span>

                </div>

                <pre className="overflow-x-auto rounded-md border border-[#252f40] bg-[#080c13] p-5 font-mono text-xs leading-6 text-[#b8c4d4]">
<span className="text-[#b678ff]">SELECT</span>{" "}
<span className="text-[#72c7ff]">name</span>,{" "}
<span className="text-[#72c7ff]">salary</span>
{"\n"}
<span className="text-[#b678ff]">FROM</span>{" "}
<span className="text-[#72c7ff]">employees</span>
{"\n"}
<span className="text-[#b678ff]">ORDER BY</span>{" "}
<span className="text-[#72c7ff]">salary</span>{" "}
<span className="text-[#b678ff]">DESC</span>
{"\n"}
<span className="text-[#b678ff]">LIMIT</span>{" "}
<span className="text-[#f2c66d]">5</span>;
                </pre>

                <div className="mt-4 flex items-center justify-between">

                  <span className="font-mono text-[9px] text-[#65758a]">
                    AI generated · Ready to execute
                  </span>

                  <button
                    type="button"
                    onClick={onGetStarted}
                    className="rounded-md bg-[#6535d3] px-4 py-2 font-mono text-[9px] font-semibold text-white transition hover:bg-[#7547e8]"
                  >
                    Try LazyQL
                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        className="border-t border-[#1d2635] bg-[#0a0911] px-6 py-24"
      >
        <div className="mx-auto max-w-7xl">

          {/* SECTION HEADER */}
          <div className="text-center">

            <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#8556e8]">
              HOW LAZYQL WORKS
            </div>

            <h2 className="mt-3 font-mono text-3xl font-bold text-white md:text-4xl">
              From question to SQL
            </h2>

            <p className="mx-auto mt-4 max-w-2xl font-mono text-xs leading-6 text-[#707b8c]">
              Connect your database, ask questions in natural
              language, review the generated SQL, and execute it.
            </p>

          </div>

          {/* STEPS */}
          <div className="mt-12 grid gap-4 md:grid-cols-3">

            <HowItWorksCard
              number="01"
              title="Connect"
              text="Provide your database type and connection URL."
            />

            <HowItWorksCard
              number="02"
              title="Ask"
              text="Describe what you need in natural language."
            />

            <HowItWorksCard
              number="03"
              title="Review & Execute"
              text="Review the generated SQL and execute it against your database."
            />

          </div>

          {/* SAFETY */}
          <div className="mt-5 rounded-lg border border-[#282039] bg-[#0e0c15] p-6">

            <div className="flex items-start gap-4">

              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-[#3b2c59] bg-[#19132a] font-mono text-sm text-[#a879ff]">
                ✓
              </div>

              <div>

                <div className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#c9c4d5]">
                  Review before execution
                </div>

                <p className="mt-2 max-w-3xl font-mono text-[10px] leading-5 text-[#687386]">
                  Generated SQL is shown before execution.
                  Destructive operations can require confirmation
                  before changing database data.
                </p>

              </div>

            </div>

          </div>

        </div>
      </section>

    </main>
  );
}

function Feature({
  number,
  title,
  text,
}) {
  return (
    <div className="rounded-lg border border-[#202b3a] bg-[#0d131d] p-4 transition hover:border-[#3d2b67]">

      <div className="font-mono text-[8px] text-[#7955c9]">
        {number}
      </div>

      <div className="mt-2 font-mono text-[9px] font-semibold tracking-wider text-[#cbd5e1]">
        {title}
      </div>

      <div className="mt-1 text-[10px] text-[#68778a]">
        {text}
      </div>

    </div>
  );
}

function HowItWorksCard({
  number,
  title,
  text,
}) {
  return (
    <div className="rounded-lg border border-[#242d3d] bg-[#0d131d] p-6 transition hover:border-[#54369a]">

      <div className="font-mono text-[9px] font-semibold text-[#8556e8]">
        {number}
      </div>

      <h3 className="mt-4 font-mono text-sm font-semibold uppercase tracking-wider text-white">
        {title}
      </h3>

      <p className="mt-3 font-mono text-[10px] leading-5 text-[#697588]">
        {text}
      </p>

    </div>
  );
}

export default HomePage;