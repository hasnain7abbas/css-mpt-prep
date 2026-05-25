import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
  {
    variants: {
      variant: {
        primary: "bg-primary-light text-primary-dark",
        neutral: "bg-surface-muted text-ink-muted ring-1 ring-ink/10",
        easy: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
        medium: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
        hard: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
        success: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
        danger: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
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
