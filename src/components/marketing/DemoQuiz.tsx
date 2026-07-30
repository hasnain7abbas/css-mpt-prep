"use client";

import { useState } from "react";
import { ArrowRight, Check, ChevronRight, MessageCircle, RotateCcw, X } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LETTERS, OptionRow, isUrdu } from "@/components/app/OptionRow";
import { EXAM, cutoffFor } from "@/lib/mpt";
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

export function DemoQuiz({ questions }: { questions: DemoQuestion[] }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() => questions.map(() => null));
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
    const cutoff = cutoffFor(questions.length);
    const cleared = score >= cutoff;
    return (
      <div className="space-y-8">
        <div className="border-2 border-ink">
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-soft">
              Demo complete
            </p>
            <p
              className={cn(
                "font-mono text-[11px] font-medium uppercase tracking-[0.14em]",
                cleared ? "text-primary" : "text-accent",
              )}
            >
              {cleared ? "Above the line" : "Below the line"}
            </p>
          </div>
          <div className="px-6 py-7">
            <p className="font-mono text-6xl font-medium leading-none text-ink tabular-nums">
              {score}
              <span className="text-2xl text-ink-soft">/{questions.length}</span>
            </p>
            <p className="mt-3 text-sm text-ink-muted">
              At the MPT&apos;s {EXAM.passPercent}% bar, {cutoff} of {questions.length} would
              clear this sample. The real paper is {EXAM.totalQuestions} questions in{" "}
              {EXAM.durationMin} minutes.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <a
                href={buildRegistrationLink()}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants())}
              >
                <MessageCircle /> Get full access
              </a>
              <Button variant="outline" onClick={restart}>
                <RotateCcw /> Try again
              </Button>
            </div>
          </div>
        </div>

        {/* Review */}
        <div className="divide-y divide-border border-y border-border">
          {questions.map((qq, idx) => {
            const sel = answers[idx];
            const correct = sel === qq.correctIndex;
            const urduQ = isUrdu(qq.text);
            return (
              <div key={qq.id} className="flex items-start gap-3 py-5">
                <span
                  className={cn(
                    "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border-2",
                    correct
                      ? "border-primary bg-primary text-surface"
                      : "border-accent bg-accent text-surface",
                  )}
                >
                  {correct ? (
                    <Check className="size-3.5" strokeWidth={3} />
                  ) : (
                    <X className="size-3.5" strokeWidth={3} />
                  )}
                </span>
                <div className="min-w-0">
                  <p className="font-mono text-[11px] text-ink-soft">
                    Q{idx + 1} · {qq.subjectTitle}
                  </p>
                  <p
                    className={cn("mt-1 text-ink", urduQ && "urdu")}
                    {...(urduQ ? { lang: "ur", dir: "rtl" } : {})}
                  >
                    {qq.text}
                  </p>
                  <p className="mt-1.5 text-sm font-semibold text-primary">
                    {LETTERS[qq.correctIndex]}. {qq.options[qq.correctIndex]}
                  </p>
                  <p className="mt-1 text-sm text-ink-muted">{qq.explanation}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="border border-ink/20 bg-surface">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <span className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-soft">
          {q.subjectTitle}
        </span>
        <span className="font-mono text-[11px] text-ink-soft tabular-nums">
          {current + 1} / {questions.length}
        </span>
      </div>
      <Progress value={((current + 1) / questions.length) * 100} className="h-1 rounded-none" />

      <div className="px-5 py-5">
        <p
          className={cn("text-[17px] leading-relaxed text-ink", isUrdu(q.text) && "urdu")}
          {...(isUrdu(q.text) ? { lang: "ur", dir: "rtl" } : {})}
        >
          {q.text}
        </p>

        <div className="mt-4 border-t border-border">
          {q.options.map((opt, i) => (
            <OptionRow
              key={i}
              letter={LETTERS[i]}
              text={opt}
              state={answers[current] === i ? "chosen" : "idle"}
              urdu={isUrdu(opt)}
              onSelect={() => choose(i)}
            />
          ))}
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
    </div>
  );
}
