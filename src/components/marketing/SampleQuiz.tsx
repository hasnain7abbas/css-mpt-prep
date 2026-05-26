"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const SAMPLE = {
  subject: "English",
  text: "Choose the correct synonym for “ABANDON”.",
  options: ["Keep", "Forsake", "Retain", "Maintain"],
  correctIndex: 1,
  explanation:
    "“Abandon” means to leave or give up entirely. “Forsake” is its closest synonym — to desert or renounce.",
};

export function SampleQuiz() {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const isCorrect = submitted && selected === SAMPLE.correctIndex;

  function reset() {
    setSelected(null);
    setSubmitted(false);
  }

  return (
    <div className="rounded-2xl border border-ink/8 bg-surface p-6 shadow-sm sm:p-8">
      <div className="mb-4 flex items-center justify-between">
        <span className="inline-flex items-center rounded-full bg-primary-light px-2.5 py-0.5 text-xs font-semibold text-primary-dark">
          {SAMPLE.subject} · Sample
        </span>
        <span className="font-mono text-xs text-ink-soft">1 / 1</span>
      </div>

      <p className="text-lg font-medium leading-relaxed text-ink">{SAMPLE.text}</p>

      <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
        {SAMPLE.options.map((opt, i) => {
          const chosen = selected === i;
          const correct = i === SAMPLE.correctIndex;
          const showCorrect = submitted && correct;
          const showWrong = submitted && chosen && !correct;
          return (
            <button
              key={opt}
              type="button"
              disabled={submitted}
              onClick={() => setSelected(i)}
              className={cn(
                "flex min-h-[44px] items-center justify-between gap-2 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors",
                "disabled:cursor-default",
                !submitted &&
                  (chosen
                    ? "border-primary bg-primary-light/60 text-ink dark:bg-primary/20"
                    : "border-ink/12 bg-surface hover:border-primary/40 hover:bg-surface-muted"),
                showCorrect && "border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-200",
                showWrong && "border-rose-500 bg-rose-50 text-rose-800 dark:bg-rose-500/15 dark:text-rose-200",
                submitted && !showCorrect && !showWrong && "border-ink/10 opacity-70",
              )}
            >
              <span>{opt}</span>
              {showCorrect && <Check className="size-4 text-emerald-600" />}
              {showWrong && <X className="size-4 text-rose-600" />}
            </button>
          );
        })}
      </div>

      {submitted ? (
        <div className="mt-5">
          <p
            className={cn(
              "text-sm font-semibold",
              isCorrect ? "text-emerald-700 dark:text-emerald-300" : "text-rose-700 dark:text-rose-300",
            )}
          >
            {isCorrect ? "Correct! 🎉" : "Not quite."}
          </p>
          <p className="mt-1 text-sm text-ink-muted">{SAMPLE.explanation}</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={reset}>
            Try again
          </Button>
        </div>
      ) : (
        <Button
          className="mt-5 w-full sm:w-auto"
          disabled={selected === null}
          onClick={() => setSubmitted(true)}
        >
          Check answer
        </Button>
      )}
    </div>
  );
}
