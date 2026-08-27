import { useEffect, useState } from "react";

function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("lazyql-theme") === "dark";
  });

  useEffect(() => {
    const root = document.documentElement;

    root.setAttribute(
      "data-theme",
      dark ? "dark" : "light"
    );

    localStorage.setItem(
      "lazyql-theme",
      dark ? "dark" : "light"
    );
  }, [dark]);

  return (
    <button
      type="button"
      onClick={() => setDark((value) => !value)}
      aria-label={
        dark
          ? "Switch to light mode"
          : "Switch to dark mode"
      }
      className="
        relative
        flex h-9 w-[68px]
        items-center
        rounded-full
        border border-[var(--lq-border)]
        bg-[var(--lq-surface-soft)]
        p-1
        shadow-sm
        transition-all duration-300
        hover:border-[var(--lq-primary)]
      "
    >

      {/* MOVING ACTIVE PILL */}

      <span
        className={`
          absolute
          h-7 w-7
          rounded-full
          bg-[var(--lq-primary)]
          shadow-[0_2px_8px_rgba(0,0,0,0.15)]
          transition-transform duration-300 ease-out

          ${
            dark
              ? "translate-x-[30px]"
              : "translate-x-0"
          }
        `}
      />

      {/* SUN */}

      <span
        className={`
          relative z-10
          grid h-7 w-7
          place-items-center
          text-sm
          transition-colors duration-300

          ${
            dark
              ? "text-[var(--lq-text-muted)]"
              : "text-white"
          }
        `}
      >
        ☀
      </span>

      {/* MOON */}

      <span
        className={`
          relative z-10
          grid h-7 w-7
          place-items-center
          text-sm
          transition-colors duration-300

          ${
            dark
              ? "text-white"
              : "text-[var(--lq-text-muted)]"
          }
        `}
      >
        ☾
      </span>

    </button>
  );
}

export default ThemeToggle;