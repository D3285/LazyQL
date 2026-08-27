import { useState } from "react";

import {
  createSQLiteSession,
  createPostgreSQLSession,
} from "../api/session";

import { useConnection } from "./context/ConnectionContext";
import ThemeToggle from "./common/ThemeToggle";

function ConnectionPage({ onBack }) {
  const { connect } = useConnection();

  const [databaseType, setDatabaseType] = useState("postgresql");
  const [connectionUrl, setConnectionUrl] = useState("");
  const [sqliteFile, setSqliteFile] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState("");

  const handleConnect = async (event) => {
    event.preventDefault();

    try {
      setIsConnecting(true);
      setError("");

      let session;

      if (databaseType === "sqlite") {
        if (!sqliteFile) {
          setError("Please choose a SQLite database file.");
          return;
        }

        session = await createSQLiteSession(sqliteFile);
      } else {
        const cleanUrl = connectionUrl.trim();

        if (!cleanUrl) {
          setError("Please enter a database connection URL.");
          return;
        }

        session = await createPostgreSQLSession(cleanUrl);
      }

      connect(session);
    } catch (err) {
      setError(err?.message || "Unable to connect to the database.");
    } finally {
      setIsConnecting(false);
    }
  };

  const isConnectDisabled =
    isConnecting ||
    (databaseType === "sqlite"
      ? !sqliteFile
      : !connectionUrl.trim());

  const handleDatabaseTypeChange = (type) => {
    setDatabaseType(type);
    setConnectionUrl("");
    setSqliteFile(null);
    setError("");
  };

  const handleClear = () => {
    setConnectionUrl("");
    setSqliteFile(null);
    setError("");
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--lq-bg)] text-[var(--lq-text)] transition-colors duration-300">

      {/* =====================================================
          JAPANESE BACKGROUND
      ====================================================== */}

      <JapaneseBackground />

      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <header className="relative z-20 border-b border-[var(--lq-border)] bg-[var(--lq-surface)]/90 backdrop-blur-md">

        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

          {/* LOGO */}

          <div className="flex items-center gap-3">

            <div className="grid h-10 w-10 place-items-center rounded-lg border border-[var(--lq-primary)] bg-[var(--lq-primary-soft)] font-mono text-xs font-bold text-[var(--lq-primary)]">
              LQ
            </div>

            <div>
              <div className="font-mono text-sm font-bold tracking-[0.18em] text-[var(--lq-text)]">
                LAZYQL
              </div>

              <div className="text-[8px] uppercase tracking-[0.2em] text-[var(--lq-text-muted)]">
                Local AI Database Assistant
              </div>
            </div>

          </div>

          {/* CONTROLS */}

          <div className="flex items-center gap-3">

            <ThemeToggle />

            <button
              type="button"
              onClick={onBack}
              className="rounded-md border border-[var(--lq-border)] bg-[var(--lq-surface)] px-5 py-2.5 font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--lq-text-soft)] transition hover:border-[var(--lq-primary)] hover:text-[var(--lq-primary)]"
            >
              ← Back
            </button>

          </div>

        </div>

      </header>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-64px)] max-w-7xl items-center justify-center px-5 py-12 md:px-8">

        <section className="w-full max-w-5xl">

          {/* HEADING */}

          <div className="mb-8">

            <div className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.25em] text-[var(--lq-primary)]">

              <span className="h-px w-8 bg-[var(--lq-primary)]" />

              Database Connection

              <span className="h-px w-8 bg-[var(--lq-primary)]" />

            </div>

            <h1 className="mt-4 font-mono text-3xl font-bold tracking-tight text-[var(--lq-text)] md:text-5xl">
              Connect{" "}
              <span className="text-[var(--lq-primary)]">
                Database
              </span>
            </h1>

            <p className="mt-4 max-w-xl font-mono text-xs leading-6 text-[var(--lq-text-soft)]">
              Connect a PostgreSQL database or upload a SQLite
              database file.
            </p>

          </div>

          {/* =================================================
              MAIN CONNECTION CARD
          ================================================== */}

          <div className="overflow-hidden rounded-2xl border border-[var(--lq-border)] bg-[var(--lq-surface)]/95 shadow-2xl backdrop-blur-sm">

            {/* DATABASE TABS */}

            <div className="grid grid-cols-2 border-b border-[var(--lq-border)]">

              <button
                type="button"
                onClick={() =>
                  handleDatabaseTypeChange("postgresql")
                }
                className={`px-5 py-4 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] transition ${
                  databaseType === "postgresql"
                    ? "bg-[var(--lq-primary)] text-white"
                    : "bg-[var(--lq-surface-soft)] text-[var(--lq-text-muted)] hover:text-[var(--lq-text)]"
                }`}
              >
                <span className="mr-2">◉</span>
                PostgreSQL
              </button>

              <button
                type="button"
                onClick={() =>
                  handleDatabaseTypeChange("sqlite")
                }
                className={`px-5 py-4 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] transition ${
                  databaseType === "sqlite"
                    ? "bg-[var(--lq-primary)] text-white"
                    : "bg-[var(--lq-surface-soft)] text-[var(--lq-text-muted)] hover:text-[var(--lq-text)]"
                }`}
              >
                <span className="mr-2">□</span>
                SQLite
              </button>

            </div>

            <form
              onSubmit={handleConnect}
              className="grid lg:grid-cols-[1fr_330px]"
            >

              {/* =================================================
                  LEFT FORM
              ================================================== */}

              <div className="p-6 md:p-9">

                <label className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--lq-text-soft)]">
                  {databaseType === "postgresql"
                    ? "Connection URL"
                    : "Database File"}
                </label>

                <div className="mt-3">

                  {databaseType === "postgresql" ? (

                    <div className="relative">

                      <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--lq-primary)]">
                        <DatabaseIcon />
                      </div>

                      <input
                        type="text"
                        value={connectionUrl}
                        onChange={(event) =>
                          setConnectionUrl(event.target.value)
                        }
                        disabled={isConnecting}
                        spellCheck={false}
                        placeholder="postgresql://username:password@host:5432/database"
                        className="w-full rounded-lg border border-[var(--lq-border)] bg-[var(--lq-bg)] py-4 pl-12 pr-4 font-mono text-sm text-[var(--lq-text)] placeholder:text-[var(--lq-text-muted)] outline-none transition focus:border-[var(--lq-primary)] focus:ring-2 focus:ring-[var(--lq-primary)]/10 disabled:opacity-50"
                      />

                    </div>

                  ) : (

                    <input
                      type="file"
                      accept=".db,.sqlite,.sqlite3"
                      onChange={(event) => {
                        const file =
                          event.target.files?.[0] || null;

                        setSqliteFile(file);
                        setError("");
                      }}
                      disabled={isConnecting}
                      className="w-full rounded-lg border border-[var(--lq-border)] bg-[var(--lq-bg)] px-4 py-4 font-mono text-sm text-[var(--lq-text)] outline-none transition file:mr-4 file:rounded-md file:border-0 file:bg-[var(--lq-primary-soft)] file:px-3 file:py-2 file:font-mono file:text-[9px] file:font-semibold file:text-[var(--lq-primary)] hover:border-[var(--lq-primary)] disabled:opacity-50"
                    />

                  )}

                </div>

                <p className="mt-3 font-mono text-[9px] leading-5 text-[var(--lq-text-muted)]">
                  {databaseType === "postgresql"
                    ? "Provide the PostgreSQL connection URL accepted by the backend."
                    : "Choose a SQLite database file (.db, .sqlite, or .sqlite3)."}
                </p>

                {/* ERROR */}

                {error && (
                  <div className="mt-5 rounded-lg border border-[var(--lq-danger)]/30 bg-[var(--lq-danger)]/5 p-4">

                    <div className="font-mono text-[9px] font-semibold uppercase tracking-wider text-[var(--lq-danger)]">
                      Connection Error
                    </div>

                    <p className="mt-2 text-xs leading-5 text-[var(--lq-text-soft)]">
                      {error}
                    </p>

                  </div>
                )}

                {/* BUTTONS */}

                <div className="mt-8 flex flex-wrap gap-3">

                  <button
                    type="submit"
                    disabled={isConnectDisabled}
                    className="rounded-md bg-[var(--lq-primary)] px-7 py-3 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-white shadow-sm transition hover:bg-[var(--lq-primary-hover)] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {isConnecting
                      ? "Connecting..."
                      : "Connect →"}
                  </button>

                  <button
                    type="button"
                    onClick={handleClear}
                    disabled={isConnecting}
                    className="rounded-md border border-[var(--lq-border)] bg-[var(--lq-surface)] px-7 py-3 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--lq-text-soft)] transition hover:border-[var(--lq-primary)] hover:text-[var(--lq-primary)] disabled:opacity-40"
                  >
                    Clear
                  </button>

                </div>

              </div>

              {/* =================================================
                  RIGHT GUIDE
              ================================================== */}

              <div className="border-t border-[var(--lq-border)] bg-[var(--lq-surface-soft)] p-6 md:p-8 lg:border-l lg:border-t-0">

                <div className="flex items-center gap-3">

                  <span className="grid h-9 w-9 place-items-center rounded-lg border border-[var(--lq-primary)] bg-[var(--lq-primary-soft)] text-[var(--lq-primary)]">
                    ◇
                  </span>

                  <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--lq-text)]">
                    Connection Guide
                  </span>

                </div>

                <div className="mt-7 space-y-6">

                  <GuideItem
                    number="01"
                    title="Choose database"
                    text={
                      databaseType === "postgresql"
                        ? "PostgreSQL"
                        : "SQLite"
                    }
                  />

                  <GuideItem
                    number="02"
                    title={
                      databaseType === "postgresql"
                        ? "Provide URL"
                        : "Choose database file"
                    }
                    text={
                      databaseType === "postgresql"
                        ? "Use the PostgreSQL connection URL."
                        : "Select a local SQLite database file."
                    }
                  />

                  <GuideItem
                    number="03"
                    title="Connect"
                    text="LazyQL will create a database session."
                  />

                </div>

                {/* BACKEND CONTRACT */}

                <div className="mt-8 rounded-lg border border-[var(--lq-border)] bg-[var(--lq-bg)] p-4">

                  <div className="font-mono text-[8px] uppercase tracking-[0.18em] text-[var(--lq-text-muted)]">
                    Backend Contract
                  </div>

                  <pre className="mt-3 overflow-x-auto font-mono text-[10px] leading-6 text-[var(--lq-purple)]">
                    {databaseType === "postgresql"
                      ? `{
  database_type,
  connection_url
}`
                      : `{
  database_type,
  file
}`}
                  </pre>

                </div>

              </div>

            </form>

          </div>

          {/* SECURITY NOTE */}

          <div className="mt-5 flex items-center gap-2 font-mono text-[9px] text-[var(--lq-text-muted)]">

            <span className="h-2 w-2 rounded-full bg-[var(--lq-success)] shadow-sm" />

            Connection is handled securely by the backend.

          </div>

        </section>

      </div>

    </main>
  );
}

/* ============================================================
   JAPANESE BACKGROUND
============================================================ */

function JapaneseBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">

      {/* Soft atmosphere */}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(143,38,56,0.08),transparent_35%)]" />

      {/* ======================================================
          SUN
      ======================================================= */}

      <div className="absolute right-[7%] top-[13%] opacity-[0.14]">

        <div className="h-32 w-32 rounded-full bg-[var(--lq-primary)] blur-[1px]" />

        <div className="absolute inset-0 rounded-full border border-[var(--lq-primary)] opacity-60" />

      </div>

      {/* ======================================================
          SAKURA TREE — LEFT
      ======================================================= */}

      <svg
        className="absolute -left-10 top-20 h-[390px] w-[430px] opacity-70"
        viewBox="0 0 430 390"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >

        {/* Main branch */}

        <path
          d="M-20 80 C80 95 100 150 160 160 C220 170 245 120 315 95"
          stroke="var(--lq-primary)"
          strokeWidth="13"
          strokeLinecap="round"
          opacity="0.55"
        />

        <path
          d="M45 103 C90 140 105 205 90 270"
          stroke="var(--lq-primary)"
          strokeWidth="8"
          strokeLinecap="round"
          opacity="0.45"
        />

        <path
          d="M140 157 C180 205 210 240 255 280"
          stroke="var(--lq-primary)"
          strokeWidth="7"
          strokeLinecap="round"
          opacity="0.45"
        />

        <path
          d="M200 150 C230 125 260 110 305 112"
          stroke="var(--lq-primary)"
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.4"
        />

        {/* Blossoms */}

        <SakuraFlower cx="38" cy="83" />
        <SakuraFlower cx="91" cy="118" />
        <SakuraFlower cx="132" cy="157" />
        <SakuraFlower cx="178" cy="158" />
        <SakuraFlower cx="224" cy="137" />
        <SakuraFlower cx="268" cy="112" />
        <SakuraFlower cx="91" cy="214" />
        <SakuraFlower cx="207" cy="230" />

      </svg>

      {/* ======================================================
          MOUNT FUJI + PAGODA — RIGHT
      ======================================================= */}

      <svg
        className="absolute -right-20 bottom-[-15px] hidden h-[470px] w-[600px] opacity-[0.13] lg:block"
        viewBox="0 0 600 470"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >

        {/* Fuji */}

        <path
          d="M60 410 L270 100 L480 410 Z"
          fill="var(--lq-purple)"
        />

        {/* Snow cap */}

        <path
          d="M205 195 L270 100 L335 195 L300 177 L270 195 L242 175 Z"
          fill="var(--lq-bg)"
        />

        {/* Mountain shadow */}

        <path
          d="M270 100 L480 410 H340 L270 250 Z"
          fill="var(--lq-primary)"
          opacity="0.35"
        />

        {/* Pagoda */}

        <g transform="translate(385 230)">

          {/* roof 1 */}

          <path
            d="M0 65 L80 65 L65 78 L15 78 Z"
            fill="var(--lq-primary)"
          />

          <path
            d="M10 52 L70 52 L58 65 L22 65 Z"
            fill="var(--lq-primary)"
          />

          {/* body */}

          <rect
            x="25"
            y="78"
            width="30"
            height="85"
            fill="var(--lq-purple)"
          />

          {/* roof 2 */}

          <path
            d="M5 105 L75 105 L62 118 L18 118 Z"
            fill="var(--lq-primary)"
          />

          {/* roof 3 */}

          <path
            d="M14 143 L66 143 L56 154 L24 154 Z"
            fill="var(--lq-primary)"
          />

          {/* top */}

          <path
            d="M39 20 L41 52"
            stroke="var(--lq-primary)"
            strokeWidth="4"
          />

          <circle
            cx="40"
            cy="16"
            r="5"
            fill="var(--lq-primary)"
          />

        </g>

        {/* Ground */}

        <path
          d="M0 410 C120 380 220 425 320 400 C420 375 520 395 600 375"
          stroke="var(--lq-primary)"
          strokeWidth="4"
          opacity="0.7"
        />

      </svg>

      {/* ======================================================
          JAPANESE WAVES — BOTTOM LEFT
      ======================================================= */}

      <svg
        className="absolute bottom-0 left-0 h-48 w-80 opacity-[0.10]"
        viewBox="0 0 320 190"
        xmlns="http://www.w3.org/2000/svg"
      >

        {Array.from({ length: 7 }).map((_, row) =>
          Array.from({ length: 5 }).map((_, col) => (
            <path
              key={`${row}-${col}`}
              d={`M${col * 70 - 10} ${row * 28 + 10}
                  Q${col * 70 + 20} ${row * 28 - 15}
                  ${col * 70 + 50} ${row * 28 + 10}`}
              stroke="var(--lq-primary)"
              strokeWidth="2"
              fill="none"
            />
          ))
        )}

      </svg>

      {/* ======================================================
          FALLING PETALS
      ======================================================= */}

      <Petal className="left-[18%] top-[28%] rotate-12" />
      <Petal className="left-[27%] top-[48%] -rotate-12" />
      <Petal className="right-[28%] top-[35%] rotate-45" />
      <Petal className="right-[18%] top-[58%] -rotate-12" />
      <Petal className="left-[42%] top-[20%] rotate-45" />
      <Petal className="right-[42%] bottom-[18%] rotate-12" />

    </div>
  );
}

/* ============================================================
   SAKURA FLOWER
============================================================ */

function SakuraFlower({ cx, cy }) {
  return (
    <g transform={`translate(${cx} ${cy})`}>

      <circle
        cx="-7"
        cy="0"
        r="8"
        fill="#d85b68"
        opacity="0.75"
      />

      <circle
        cx="7"
        cy="0"
        r="8"
        fill="#d85b68"
        opacity="0.75"
      />

      <circle
        cx="0"
        cy="-7"
        r="8"
        fill="#d85b68"
        opacity="0.75"
      />

      <circle
        cx="0"
        cy="7"
        r="8"
        fill="#d85b68"
        opacity="0.75"
      />

      <circle
        cx="0"
        cy="0"
        r="4"
        fill="var(--lq-gold)"
      />

    </g>
  );
}

/* ============================================================
   PETAL
============================================================ */

function Petal({ className = "" }) {
  return (
    <div
      className={`absolute h-3 w-5 rounded-[100%_0_100%_0] bg-[var(--lq-primary)] opacity-30 ${className}`}
    />
  );
}

/* ============================================================
   DATABASE ICON
============================================================ */

function DatabaseIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <ellipse cx="12" cy="5" rx="7" ry="3" />
      <path d="M5 5v7c0 1.7 3.1 3 7 3s7-1.3 7-3V5" />
      <path d="M5 12v7c0 1.7 3.1 3 7 3s7-1.3 7-3v-7" />
    </svg>
  );
}

/* ============================================================
   GUIDE ITEM
============================================================ */

function GuideItem({ number, title, text }) {
  return (
    <div className="flex gap-4">

      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--lq-primary-soft)] font-mono text-[8px] font-semibold text-[var(--lq-primary)]">
        {number}
      </span>

      <div>

        <div className="font-mono text-[10px] font-semibold text-[var(--lq-text)]">
          {title}
        </div>

        <div className="mt-1 text-[10px] leading-5 text-[var(--lq-text-soft)]">
          {text}
        </div>

      </div>

    </div>
  );
}

export default ConnectionPage;