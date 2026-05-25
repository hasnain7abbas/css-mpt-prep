"use client";

import { useState } from "react";
import { ArrowRight, Check, ChevronRight, MessageCircle, RotateCcw, X } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { buildRegistrationLink } from "@/lib/whatsapp";

export type DemoQuestion = {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  subjectTitle: string;
};

const LETTERS = ["A", "B", "C", "D"];

export function DemoQuiz({ questions }: { questions: DemoQuestion[] }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    () => questions.map(() => null),
  );
  const [done, setDone] = useState(false);

  const q = questions[current];
  const isLast = current === questions.length - 1;
  const score = answers.filter((a, i) => a === questions[i].correctIndex).length;

  function choose(i: number) {
    setAnswers((prev) => {
      const next = [...prev];
      next[current] = i;
      return next;
    });
  }

  function restart() {
    setAnswers(questions.map(() => null));
    setCurrent(0);
    setDone(false);
  }

  if (done) {
    const pctScore = Math.round((score / questions.length) * 100);
    return (
      <div className="space-y-5">
        <div className="rounded-2xl bg-gradient-to-br from-primary to-primary-dark p-8 text-center text-white shadow-lg">
          <p className="text-sm text-white/80">Demo complete</p>
          <p className="mt-2 font-mono text-5xl font-extrabold tabular-nums">
            {score}
            <span className="text-2xl text-white/70">/{questions.length}</span>
          </p>
          <p className="mt-1 font-semibold">{pctScore}% accuracy</p>
          <p className="mx-auto mt-3 max-w-sm text-sm text-emerald-50">
            Want timed mocks, 250+ MCQs, and progress tracking? Register to unlock the full platform.
          </p>
          <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
            <a
              href={buildRegistrationLink()}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants(), "bg-white text-primary-dark hover:bg-emerald-50")}
            >
              <MessageCircle /> Register on WhatsApp
            </a>
            <Button variant="secondary" onClick={restart} className="bg-white/15 hover:bg-white/25">
              <RotateCcw /> Try again
            </Button>
          </div>
        </div>

        {/* Review */}
        <div className="space-y-3">
          {questions.map((qq, idx) => {
            const sel = answers[idx];
            const correct = sel === qq.correctIndex;
            return (
              <div key={qq.id} className="rounded-2xl border border-ink/8 bg-surface p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      "flex size-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold",
                      correct ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700",
                    )}
                  >
                    {correct ? <Check className="size-4" /> : <X className="size-4" />}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-ink">
                      <span className="text-ink-soft">Q{idx + 1}. </span>
                      {qq.text}
                    </p>
                    <p className="mt-1 text-sm text-emerald-700">
                      Correct: {LETTERS[qq.correctIndex]}. {qq.options[qq.correctIndex]}
                    </p>
                    <p className="mt-1 text-sm text-ink-muted">{qq.explanation}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-ink/8 bg-surface p-6 shadow-sm sm:p-8">
      <div className="flex items-center justify-between text-sm">
        <span className="inline-flex items-center rounded-full bg-primary-light px-2.5 py-0.5 text-xs font-semibold text-primary-dark">
          {q.subjectTitle}
        </span>
        <span className="font-mono text-ink-soft">
          {current + 1} / {questions.length}
        </span>
      </div>
      <Progress value={((current + 1) / questions.length) * 100} className="mt-3" />

      <p className="mt-5 text-lg leading-relaxed text-ink">{q.text}</p>

      <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
        {q.options.map((opt, i) => {
          const chosen = answers[current] === i;
          return (
            <button
              key={i}
              onClick={() => choose(i)}
              className={cn(
                "flex min-h-[48px] items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors",
                chosen
                  ? "border-primary bg-primary-light/60 text-ink"
                  : "border-ink/12 bg-surface hover:border-primary/40 hover:bg-surface-muted",
              )}
            >
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-md text-xs font-bold",
                  chosen ? "bg-primary text-white" : "bg-surface-muted text-ink-muted",
                )}
              >
                {LETTERS[i]}
              </span>
              {opt}
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex justify-end">
        {isLast ? (
          <Button onClick={() => setDone(true)} disabled={answers[current] === null}>
            See my score <ArrowRight />
          </Button>
        ) : (
          <Button onClick={() => setCurrent((c) => c + 1)} disabled={answers[current] === null}>
            Next <ChevronRight />
          </Button>
        )}
      </div>
    </div>
  );
}
