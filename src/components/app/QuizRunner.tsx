"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { Check, ChevronLeft, ChevronRight, Grid3x3, Loader2, Send, Star, Timer } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn, formatClock } from "@/lib/utils";
import { saveProgress, submitAttempt, type AnswerInput } from "@/lib/attempt-actions";

type QuizQuestion = { id: string; order: number; text: string; options: string[] };
type AnswerState = { selectedIndex: number | null; marked: boolean };

const LETTERS = ["A", "B", "C", "D"];

export function QuizRunner({
  attemptId,
  testTitle,
  subjectTitle,
  durationMin,
  startedAtMs,
  questions,
  initialAnswers,
}: {
  attemptId: string;
  testTitle: string;
  subjectTitle: string;
  durationMin: number;
  startedAtMs: number;
  questions: QuizQuestion[];
  initialAnswers: AnswerInput[];
}) {
  const endMs = startedAtMs + durationMin * 60_000;

  const [answers, setAnswers] = useState<Record<string, AnswerState>>(() => {
    const init: Record<string, AnswerState> = {};
    for (const q of questions) init[q.id] = { selectedIndex: null, marked: false };
    for (const a of initialAnswers) {
      if (init[a.questionId]) {
        init[a.questionId] = {
          selectedIndex: a.selectedIndex,
          marked: a.markedForReview,
        };
      }
    }
    return init;
  });
  const [current, setCurrent] = useState(0);
  const [visited, setVisited] = useState<Set<number>>(() => new Set([0]));
  const [remaining, setRemaining] = useState(() =>
    Math.max(0, Math.round((endMs - Date.now()) / 1000)),
  );
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [submitting, startSubmit] = useTransition();
  const submittedRef = useRef(false);

  const toAnswerArray = useCallback(
    (): AnswerInput[] =>
      questions.map((q) => ({
        questionId: q.id,
        selectedIndex: answers[q.id]?.selectedIndex ?? null,
        markedForReview: answers[q.id]?.marked ?? false,
      })),
    [answers, questions],
  );

  const answeredCount = useMemo(
    () => Object.values(answers).filter((a) => a.selectedIndex !== null).length,
    [answers],
  );

  const doSubmit = useCallback(() => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    startSubmit(async () => {
      await submitAttempt(attemptId, toAnswerArray());
    });
  }, [attemptId, toAnswerArray]);

  // Countdown timer with auto-submit at zero.
  useEffect(() => {
    const id = setInterval(() => {
      const left = Math.max(0, Math.round((endMs - Date.now()) / 1000));
      setRemaining(left);
      if (left <= 0) {
        clearInterval(id);
        toast.warning("Time's up — submitting your test.");
        doSubmit();
      }
    }, 1000);
    return () => clearInterval(id);
  }, [endMs, doSubmit]);

  // Debounced autosave so a refresh never loses progress.
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const id = setTimeout(() => {
      if (!submittedRef.current) void saveProgress(attemptId, toAnswerArray());
    }, 700);
    return () => clearTimeout(id);
  }, [answers, attemptId, toAnswerArray]);

  function select(optionIndex: number) {
    const qid = questions[current].id;
    setAnswers((prev) => ({
      ...prev,
      [qid]: { ...prev[qid], selectedIndex: optionIndex },
    }));
  }

  function toggleMark() {
    const qid = questions[current].id;
    setAnswers((prev) => ({
      ...prev,
      [qid]: { ...prev[qid], marked: !prev[qid].marked },
    }));
  }

  function goTo(index: number) {
    setCurrent(index);
    setVisited((prev) => new Set(prev).add(index));
    setPaletteOpen(false);
  }

  const q = questions[current];
  const state = answers[q.id];
  const isLast = current === questions.length - 1;
  const lowTime = remaining <= 60;

  const palette = (
    <div className="grid grid-cols-6 gap-2 sm:grid-cols-8 lg:grid-cols-5">
      {questions.map((qq, i) => {
        const a = answers[qq.id];
        const answered = a.selectedIndex !== null;
        const marked = a.marked;
        const seen = visited.has(i);
        return (
          <button
            key={qq.id}
            onClick={() => goTo(i)}
            className={cn(
              "flex aspect-square items-center justify-center rounded-lg border text-sm font-semibold transition-colors",
              i === current && "ring-2 ring-primary ring-offset-1",
              marked && answered && "border-amber-400 bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200",
              marked && !answered && "border-amber-400 bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-200",
              !marked && answered && "border-emerald-400 bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200",
              !marked && !answered && seen && "border-sky-300 bg-sky-50 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
              !marked && !answered && !seen && "border-ink/15 bg-surface text-ink-muted",
            )}
            aria-label={`Question ${i + 1}${answered ? ", answered" : ""}${marked ? ", marked for review" : ""}`}
          >
            {i + 1}
          </button>
        );
      })}
    </div>
  );

  const legend = (
    <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-ink-muted">
      <span className="inline-flex items-center gap-1.5"><i className="size-3 rounded bg-emerald-100 ring-1 ring-emerald-400 dark:bg-emerald-500/30" /> Answered</span>
      <span className="inline-flex items-center gap-1.5"><i className="size-3 rounded bg-sky-50 ring-1 ring-sky-300 dark:bg-sky-500/20" /> Visited</span>
      <span className="inline-flex items-center gap-1.5"><i className="size-3 rounded bg-amber-100 ring-1 ring-amber-400 dark:bg-amber-500/30" /> Marked</span>
      <span className="inline-flex items-center gap-1.5"><i className="size-3 rounded bg-surface ring-1 ring-ink/15" /> Not visited</span>
    </div>
  );

  return (
    <div className="min-h-dvh bg-surface-muted">
      {/* Quiz top bar */}
      <div className="sticky top-0 z-30 border-b border-ink/8 bg-surface/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-4 sm:px-6">
          <p className="truncate text-sm font-semibold text-ink">{testTitle}</p>
          <div
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-mono text-sm font-bold tabular-nums",
              lowTime ? "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-200" : "bg-surface-muted text-ink",
            )}
            role="timer"
            aria-live="off"
          >
            <Timer className="size-4" />
            {formatClock(remaining)}
          </div>
          <p className="shrink-0 font-mono text-sm text-ink-muted tabular-nums">
            {current + 1} / {questions.length}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:grid lg:grid-cols-[1fr_260px] lg:gap-6">
        {/* Main column */}
        <div>
          <div className="rounded-2xl border border-ink/8 bg-surface p-6 shadow-sm sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
              {subjectTitle} · Question {current + 1}
            </p>
            <p className="mt-2 text-lg leading-relaxed text-ink">{q.text}</p>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {q.options.map((opt, i) => {
                const chosen = state.selectedIndex === i;
                return (
                  <button
                    key={i}
                    onClick={() => select(i)}
                    className={cn(
                      "flex min-h-[52px] items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors",
                      chosen
                        ? "border-primary bg-primary-light/60 text-ink dark:bg-primary/20"
                        : "border-ink/12 bg-surface hover:border-primary/40 hover:bg-surface-muted",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold",
                        chosen ? "bg-primary text-white" : "bg-surface-muted text-ink-muted",
                      )}
                    >
                      {chosen ? <Check className="size-4" /> : LETTERS[i]}
                    </span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer controls */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              onClick={() => goTo(Math.max(0, current - 1))}
              disabled={current === 0}
            >
              <ChevronLeft /> Previous
            </Button>
            <Button
              variant={state.marked ? "secondary" : "outline"}
              onClick={toggleMark}
            >
              <Star className={cn(state.marked && "fill-current")} />
              {state.marked ? "Marked" : "Mark for Review"}
            </Button>
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              className="ml-auto inline-flex items-center gap-1.5 rounded-xl border border-ink/15 px-3 py-2 text-sm font-medium text-ink-muted hover:bg-surface-muted lg:hidden"
            >
              <Grid3x3 className="size-4" /> Palette
            </button>
            {isLast ? (
              <Button onClick={() => setConfirmOpen(true)} className="w-full sm:w-auto lg:ml-auto">
                <Send /> Save &amp; Submit
              </Button>
            ) : (
              <Button onClick={() => goTo(current + 1)} className="w-full sm:w-auto lg:ml-auto">
                Save &amp; Next <ChevronRight />
              </Button>
            )}
          </div>
        </div>

        {/* Desktop palette */}
        <aside className="hidden lg:block">
          <div className="sticky top-20 rounded-2xl border border-ink/8 bg-surface p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-sm font-bold text-ink">Questions</h2>
              <span className="text-xs text-ink-soft">
                {answeredCount}/{questions.length}
              </span>
            </div>
            <div className="mt-4">{palette}</div>
            {legend}
            <Button
              className="mt-5 w-full"
              variant="primary"
              onClick={() => setConfirmOpen(true)}
            >
              <Send /> Submit Test
            </Button>
          </div>
        </aside>
      </div>

      {/* Mobile palette dialog */}
      <Dialog open={paletteOpen} onOpenChange={setPaletteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Question palette</DialogTitle>
            <DialogDescription>
              {answeredCount} of {questions.length} answered. Tap a number to jump.
            </DialogDescription>
          </DialogHeader>
          {palette}
          {legend}
        </DialogContent>
      </Dialog>

      {/* Submit confirmation */}
      <Dialog open={confirmOpen} onOpenChange={(o) => !submitting && setConfirmOpen(o)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit test?</DialogTitle>
            <DialogDescription>
              You&apos;ve answered <strong>{answeredCount}</strong> of{" "}
              <strong>{questions.length}</strong> questions. You can&apos;t change
              answers after submitting.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              disabled={submitting}
            >
              Keep practicing
            </Button>
            <Button onClick={doSubmit} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="animate-spin" /> Submitting…
                </>
              ) : (
                <>
                  <Send /> Submit now
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
