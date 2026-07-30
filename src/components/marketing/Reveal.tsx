"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * One reveal, used everywhere: a short rise on first intersection, on the
 * ease-out-expo token. Respects prefers-reduced-motion by showing immediately.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "tr";
}) {
  // The class is toggled directly on the node rather than through state: the
  // observer fires during scroll, and a setState there would re-render the
  // whole section for a purely visual change.
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const show = () => el.classList.add("reveal-in");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      show();
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          show();
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn("reveal-init", className)}
    >
      {children}
    </Tag>
  );
}
