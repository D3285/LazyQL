import ThemeToggle from "./common/ThemeToggle";

function HomePage({ onGetStarted }) {
  return (
    <main className="lq-pattern min-h-screen bg-[var(--lq-bg)] text-[var(--lq-text)] transition-colors duration-300">

      {/* Decorative background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-40 top-20 h-96 w-96 rounded-full bg-[var(--lq-primary)] opacity-[0.06] blur-3xl" />
        <div className="absolute -left-40 bottom-20 h-96 w-96 rounded-full bg-[var(--lq-purple)] opacity-[0.05] blur-3xl" />
      </div>

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-[var(--lq-border)] bg-[var(--lq-bg)]/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

          <div className="flex items-center gap-3">
            <div className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-lg border border-[var(--lq-primary)] bg-[var(--lq-primary-soft)] font-mono text-xs font-bold text-[var(--lq-primary)]">
              <span>LQ</span>
            </div>

            <div>
              <div className="font-mono text-sm font-bold tracking-[0.18em] text-[var(--lq-text)]">
                LAZYQL
              </div>

              <div className="hidden text-[8px] uppercase tracking-[0.2em] text-[var(--lq-text-muted)] sm:block">
                AI Database Assistant
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">

            <span className="hidden font-mono text-[9px] uppercase tracking-wider text-[var(--lq-text-muted)] md:block">
              PostgreSQL · SQLite
            </span>

            <ThemeToggle />

            <button
              type="button"
              onClick={onGetStarted}
              className="rounded-md border border-[var(--lq-primary)] bg-[var(--lq-primary)] px-4 py-2 font-mono text-[9px] font-semibold uppercase tracking-wider text-white shadow-sm transition hover:bg-[var(--lq-primary-hover)]"
            >
              Get Started
            </button>

          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">

        <div className="relative mx-auto grid min-h-[calc(100vh-64px)] max-w-7xl items-center gap-14 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-10">

          {/* LEFT */}
          <div className="relative z-10">

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--lq-border)] bg-[var(--lq-surface)] px-3 py-2 font-mono text-[9px] uppercase tracking-wider text-[var(--lq-text-soft)] shadow-sm">

              <span className="h-2 w-2 rounded-full bg-[var(--lq-success)] shadow-sm" />

              Local-first AI database assistant

            </div>

            <h1 className="max-w-3xl font-mono text-4xl font-bold leading-[1.1] tracking-tight text-[var(--lq-text)] sm:text-5xl lg:text-6xl">

              Talk to your

              <span className="block text-[var(--lq-primary)]">
                database.
              </span>

            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-[var(--lq-text-soft)]">
              Ask questions in natural language. Let AI generate
              SQL, review the query, and execute it against your
              database with confidence.
            </p>

            {/* CTA */}
            <div className="mt-8 flex flex-wrap gap-3">

              <button
                type="button"
                onClick={onGetStarted}
                className="rounded-md border border-[var(--lq-primary)] bg-[var(--lq-primary)] px-6 py-3 font-mono text-[10px] font-semibold uppercase tracking-wider text-white shadow-md transition hover:bg-[var(--lq-primary-hover)] hover:shadow-lg"
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
                className="rounded-md border border-[var(--lq-border)] bg-[var(--lq-surface)] px-6 py-3 font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--lq-text-soft)] transition hover:border-[var(--lq-primary)] hover:text-[var(--lq-primary)]"
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

          {/* RIGHT — THEMED TERMINAL */}
          <div className="relative">

            {/* Decorative ring */}
            <div className="pointer-events-none absolute -inset-8 rounded-full border border-[var(--lq-primary)] opacity-[0.07]" />
            <div className="pointer-events-none absolute -inset-16 rounded-full border border-[var(--lq-purple)] opacity-[0.05]" />

            <div className="relative overflow-hidden rounded-2xl border border-[var(--lq-border)] bg-[var(--lq-surface)] shadow-2xl">

              {/* Japanese-inspired top decoration */}
              <div className="flex items-center justify-between border-b border-[var(--lq-border)] bg-[var(--lq-surface-soft)] px-4 py-3">

                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#c94a55]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--lq-gold)]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--lq-success)]" />
                </div>

                <span className="font-mono text-[9px] text-[var(--lq-text-muted)]">
                  lazyql.workspace
                </span>

              </div>

              {/* Question */}
              <div className="border-b border-[var(--lq-border)] p-5">

                <div className="font-mono text-[9px] uppercase tracking-wider text-[var(--lq-text-muted)]">
                  Natural Language
                </div>

                <div className="mt-3 rounded-lg border border-[var(--lq-border)] bg-[var(--lq-bg)] p-4 font-mono text-sm text-[var(--lq-text)]">
                  Show the 5 highest paid employees
                </div>

              </div>

              {/* SQL */}
              <div className="p-5">

                <div className="mb-3 flex items-center justify-between">

                  <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--lq-text-muted)]">
                    Generated SQL
                  </span>

                  <span className="rounded border border-[var(--lq-success)] bg-[var(--lq-bg-soft)] px-2 py-1 font-mono text-[8px] text-[var(--lq-success)]">
                    VALID SQL
                  </span>

                </div>

                <pre className="overflow-x-auto rounded-lg border border-[var(--lq-border)] bg-[#171417] p-5 font-mono text-xs leading-6 text-[#eee6df]">
<span className="text-[#d16b7a]">SELECT</span>{" "}
<span className="text-[#e5c27b]">name</span>,{" "}
<span className="text-[#e5c27b]">salary</span>
{"\n"}
<span className="text-[#d16b7a]">FROM</span>{" "}
<span className="text-[#e5c27b]">employees</span>
{"\n"}
<span className="text-[#d16b7a]">ORDER BY</span>{" "}
<span className="text-[#e5c27b]">salary</span>{" "}
<span className="text-[#d16b7a]">DESC</span>
{"\n"}
<span className="text-[#d16b7a]">LIMIT</span>{" "}
<span className="text-[#e5c27b]">5</span>;
                </pre>

                <div className="mt-4 flex items-center justify-between">

                  <span className="font-mono text-[9px] text-[var(--lq-text-muted)]">
                    AI generated · Ready to execute
                  </span>

                  <button
                    type="button"
                    onClick={onGetStarted}
                    className="rounded-md bg-[var(--lq-primary)] px-4 py-2 font-mono text-[9px] font-semibold text-white transition hover:bg-[var(--lq-primary-hover)]"
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
        className="border-t border-[var(--lq-border)] bg-[var(--lq-bg-soft)] px-6 py-24"
      >
        <div className="mx-auto max-w-7xl">

          <div className="text-center">

            <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-[var(--lq-primary)]">
              HOW LAZYQL WORKS
            </div>

            <h2 className="mt-3 font-mono text-3xl font-bold text-[var(--lq-text)] md:text-4xl">
              From question to SQL
            </h2>

            <p className="mx-auto mt-4 max-w-2xl font-mono text-xs leading-6 text-[var(--lq-text-soft)]">
              Connect your database, ask questions in natural
              language, review the generated SQL, and execute it.
            </p>

          </div>

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
          <div className="mt-5 rounded-xl border border-[var(--lq-border)] bg-[var(--lq-surface)] p-6 shadow-sm">

            <div className="flex items-start gap-4">

              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-[var(--lq-primary)] bg-[var(--lq-primary-soft)] font-mono text-sm text-[var(--lq-primary)]">
                ✓
              </div>

              <div>

                <div className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--lq-text)]">
                  Review before execution
                </div>

                <p className="mt-2 max-w-3xl font-mono text-[10px] leading-5 text-[var(--lq-text-soft)]">
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

function Feature({ number, title, text }) {
  return (
    <div className="rounded-xl border border-[var(--lq-border)] bg-[var(--lq-surface)] p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--lq-primary)]">

      <div className="font-mono text-[8px] text-[var(--lq-primary)]">
        {number}
      </div>

      <div className="mt-2 font-mono text-[9px] font-semibold tracking-wider text-[var(--lq-text)]">
        {title}
      </div>

      <div className="mt-1 text-[10px] text-[var(--lq-text-muted)]">
        {text}
      </div>

    </div>
  );
}

function HowItWorksCard({ number, title, text }) {
  return (
    <div className="rounded-xl border border-[var(--lq-border)] bg-[var(--lq-surface)] p-6 shadow-sm transition hover:-translate-y-1 hover:border-[var(--lq-primary)]">

      <div className="font-mono text-[9px] font-semibold text-[var(--lq-primary)]">
        {number}
      </div>

      <h3 className="mt-4 font-mono text-sm font-semibold uppercase tracking-wider text-[var(--lq-text)]">
        {title}
      </h3>

      <p className="mt-3 font-mono text-[10px] leading-5 text-[var(--lq-text-soft)]">
        {text}
      </p>

    </div>
  );
}

export default HomePage;