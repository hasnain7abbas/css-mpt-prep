import { cn } from "@/lib/utils";

/**
 * The mark is an answer-sheet fragment: four OMR bubbles inside a stamped
 * rule, with option B filled in ink. It is the same object the quiz engine
 * draws, at logo size.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      role="img"
      aria-label="CSS MPT Prep"
      className={cn("h-8 w-8", className)}
    >
      <rect
        x="1.5"
        y="1.5"
        width="45"
        height="45"
        rx="3"
        className="fill-surface stroke-ink"
        strokeWidth="3"
      />
      {/* A — empty */}
      <circle cx="16" cy="16" r="5.5" className="fill-none stroke-ink" strokeWidth="2" />
      {/* B — inked */}
      <circle cx="32" cy="16" r="6.5" className="fill-primary" />
      <path
        d="M28.8 16.2 L31.2 18.6 L35.4 13.8"
        className="stroke-surface"
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* C, D — empty */}
      <circle cx="16" cy="32" r="5.5" className="fill-none stroke-ink" strokeWidth="2" />
      <circle cx="32" cy="32" r="5.5" className="fill-none stroke-ink" strokeWidth="2" />
    </svg>
  );
}

export function Logo({
  className,
  showWordmark = true,
  markClassName,
}: {
  className?: string;
  showWordmark?: boolean;
  markClassName?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className={markClassName} />
      {showWordmark && (
        <span className="font-display text-lg font-bold leading-none tracking-tight text-ink">
          CSS MPT<span className="ml-1 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-ink-muted">
            Prep
          </span>
        </span>
      )}
    </span>
  );
}
