"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Light/dark toggle. The initial theme is applied before hydration by the
 * inline script in the root layout (dark by default), so here we just read the
 * current state off <html> on mount, then flip the class + persist the choice.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const [isDark, setIsDark] = React.useState(true);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    setMounted(true);
  }, []);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      /* storage unavailable — keep in-memory only */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-xl text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        className,
      )}
    >
      {/* Avoid an icon mismatch before mount: render nothing until we know. */}
      {mounted ? (
        isDark ? <Sun className="size-5" /> : <Moon className="size-5" />
      ) : (
        <span className="size-5" />
      )}
    </button>
  );
}
