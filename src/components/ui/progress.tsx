import { cn } from "@/lib/utils";

/** Lightweight determinate progress bar (no JS dependency). */
export function Progress({
  value,
  className,
  barClassName,
}: {
  value: number; // 0..100
  className?: string;
  barClassName?: string;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn(
        "h-2 w-full overflow-hidden rounded-full bg-ink/10",
        className,
      )}
    >
      <div
        className={cn(
          "h-full rounded-full bg-primary transition-all duration-500",
          barClassName,
        )}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
