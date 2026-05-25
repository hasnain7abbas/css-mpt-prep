import { cn } from "@/lib/utils";

/** The emerald shield + checkmark mark, rendered inline so it scales crisply. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 140"
      role="img"
      aria-label="FIA Job Prep logo"
      className={cn("h-9 w-auto", className)}
    >
      <defs>
        <linearGradient id="fiaShield" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
        <linearGradient id="fiaInner" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#34d399" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M60 6 L108 22 L108 66 C108 96 88 122 60 134 C32 122 12 96 12 66 L12 22 Z"
        fill="url(#fiaShield)"
        stroke="#065f46"
        strokeWidth="2"
      />
      <path
        d="M60 14 L100 27 L100 64 C100 90 84 112 60 123 C36 112 20 90 20 64 L20 27 Z"
        fill="url(#fiaInner)"
      />
      <path
        d="M36 70 L54 88 L86 52"
        fill="none"
        stroke="#ffffff"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="60" cy="22" r="3" fill="#ffffff" opacity="0.85" />
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
        <span className="font-display text-lg font-extrabold leading-none tracking-tight text-ink">
          FIA <span className="text-primary-dark">Job Prep</span>
        </span>
      )}
    </span>
  );
}
