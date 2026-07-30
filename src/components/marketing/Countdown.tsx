"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Days remaining until the MPT. Rendered from a server-computed value first so
 * there is no layout shift, then corrected on the client every minute.
 */
export function Countdown({
  testDateIso,
  initialDays,
  className,
}: {
  testDateIso: string;
  initialDays: number;
  className?: string;
}) {
  const [parts, setParts] = useState<{ days: number; hours: number; minutes: number } | null>(
    null,
  );

  useEffect(() => {
    const target = new Date(`${testDateIso}T09:00:00+05:00`).getTime();
    const tick = () => {
      const ms = Math.max(0, target - Date.now());
      setParts({
        days: Math.floor(ms / 86_400_000),
        hours: Math.floor((ms % 86_400_000) / 3_600_000),
        minutes: Math.floor((ms % 3_600_000) / 60_000),
      });
    };
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, [testDateIso]);

  const days = parts?.days ?? Math.max(0, initialDays);

  return (
    <div className={cn("flex items-end gap-4", className)}>
      <span
        className="font-mono text-[clamp(4.5rem,17vw,10rem)] font-medium leading-[0.8] tracking-[-0.05em] text-ink tabular-nums"
        aria-label={`${days} days remaining`}
      >
        {days}
      </span>
      <span className="mb-2 max-w-[9rem] text-sm leading-snug text-ink-muted">
        days until the paper
        {parts && (
          <span className="mt-1 block font-mono text-xs text-ink-soft tabular-nums">
            {parts.hours}h {parts.minutes}m
          </span>
        )}
      </span>
    </div>
  );
}
