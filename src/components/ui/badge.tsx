import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-xs px-2 py-0.5 font-mono text-[11px] font-medium uppercase tracking-[0.08em]",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-surface",
        neutral: "text-ink-muted ring-1 ring-ink/20",
        easy: "text-primary ring-1 ring-primary/40",
        medium:
          "text-warning ring-1 ring-warning/40",
        hard: "text-accent ring-1 ring-accent/40",
        success:
          "bg-primary/10 text-primary ring-1 ring-primary/30",
        danger:
          "bg-accent/10 text-accent ring-1 ring-accent/30",
      },
    },
    defaultVariants: { variant: "neutral" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

/** Difficulty → badge variant helper. */
export function difficultyVariant(
  d: string,
): "easy" | "medium" | "hard" {
  return d === "EASY" ? "easy" : d === "HARD" ? "hard" : "medium";
}
