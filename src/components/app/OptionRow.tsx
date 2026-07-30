"use client";

import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export const LETTERS = ["A", "B", "C", "D"] as const;

export type OptionState = "idle" | "chosen" | "correct" | "wrong" | "missed";

/**
 * The signature element: an OMR answer-sheet row. The bubble on the left fills
 * with ink when chosen (and the ink spreads, once, on the way in). After
 * marking, the correct bubble is inked green and a wrong choice inked red —
 * the same language a returned answer sheet uses.
 */
export function OptionRow({
  letter,
  text,
  state = "idle",
  onSelect,
  disabled,
  urdu,
}: {
  letter: string;
  text: string;
  state?: OptionState;
  onSelect?: () => void;
  disabled?: boolean;
  urdu?: boolean;
}) {
  const filled = state === "chosen" || state === "correct" || state === "wrong";

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      aria-pressed={state === "chosen"}
      className={cn(
        "group flex w-full items-start gap-3 border-b border-border px-1 py-3 text-left transition-colors duration-200 ease-[var(--ease-out-expo)] last:border-b-0",
        !disabled && "hover:bg-ink/[0.035]",
        state === "correct" && "bg-primary/[0.07]",
        state === "wrong" && "bg-accent/[0.07]",
        disabled && "cursor-default",
      )}
    >
      <span
        className={cn(
          "relative mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border-2 font-mono text-xs font-semibold transition-colors duration-200",
          state === "idle" && "border-ink/35 text-ink-muted group-hover:border-ink/70",
          state === "chosen" && "border-ink bg-ink text-surface",
          state === "correct" && "border-primary bg-primary text-surface",
          state === "wrong" && "border-accent bg-accent text-surface",
          state === "missed" && "border-primary border-dashed text-primary",
        )}
      >
        {filled ? (
          <span className="ink-fill flex size-full items-center justify-center rounded-full">
            {state === "correct" ? (
              <Check className="size-4" strokeWidth={3} />
            ) : state === "wrong" ? (
              <X className="size-4" strokeWidth={3} />
            ) : (
              letter
            )}
          </span>
        ) : (
          letter
        )}
      </span>

      <span
        className={cn(
          "min-w-0 flex-1 text-[15px] leading-relaxed text-ink",
          state === "correct" && "font-semibold",
          urdu && "urdu",
        )}
        {...(urdu ? { lang: "ur", dir: "rtl" } : {})}
      >
        {text}
      </span>
    </button>
  );
}

/** True when a string is predominantly Arabic-script (Urdu) text. */
export function isUrdu(text: string) {
  const arabic = (text.match(/[؀-ۿ]/g) || []).length;
  return arabic > 0 && arabic / text.replace(/\s/g, "").length > 0.4;
}
