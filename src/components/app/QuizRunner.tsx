"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { ChevronLeft, ChevronRight, Grid3x3, Loader2, Send, Star, Timer } from "lucide-react";
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
import { LETTERS, OptionRow, isUrdu } from "@/components/app/OptionRow";

type QuizQuestion = { id: string; order: number; text: string; options: string[] };
type AnswerState = { selectedIndex: number | null; marked: boolean };

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
              "flex aspect-square items-center justify-center rounded-full border-2 font-mono text-xs font-semibold transition-colors duration-200",
              i === current && "ring-2 ring-accent ring-offset-2 ring-offset-surface",
              marked && answered && "border-warning bg-primary text-surface",
              marked && !answered && "border-warning bg-warning/15 text-warning",
              !marked && answered && "border-primary bg-primary text-surface",
              !marked && !answered && seen && "border-ink/60 text-ink",
              !marked && !answered && !seen && "border-ink/20 text-ink-soft",
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
      <span className="inline-flex items-center gap-1.5"><i className="size-3 rounded-full bg-primary" /> Answered</span>
      <span className="inline-flex items-center gap-1.5"><i className="size-3 rounded-full ring-2 ring-ink/60" /> Visited</span>
      <span className="inline-flex items-center gap-1.5"><i className="size-3 rounded-full bg-warning/30 ring-2 ring-warning" /> Marked</span>
      <span className="inline-flex items-center gap-1.5"><i className="size-3 rounded-full ring-2 ring-ink/20" /> Not visited</span>
    </div>
  );

  return (
    <div className="min-h-dvh bg-surface">
      {/* Quiz top bar */}
      <div className="sticky top-0 z-30 border-b border-ink/15 bg-surface/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-4 sm:px-6">
          <p className="truncate text-sm font-semibold text-ink">{testTitle}</p>
          <div
            className={cn(
              "flex items-center gap-1.5 rounded-xs px-2.5 py-1 font-mono text-sm font-semibold tabular-nums",
              lowTime ? "bg-accent text-surface" : "bg-ink/[0.06] text-ink",
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
          <div className="border border-border bg-surface p-5 sm:p-7">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-soft">
              {subjectTitle} · Question {current + 1} of {questions.length}
            </p>
            <p
              className={cn(
                "mt-3 text-lg leading-relaxed text-ink",
                isUrdu(q.text) && "urdu",
              )}
              {...(isUrdu(q.text) ? { lang: "ur", dir: "rtl" } : {})}
            >
              {q.text}
            </p>

            <div className="mt-5 border-t border-border">
              {q.options.map((opt, i) => (
                <OptionRow
                  key={i}
                  letter={LETTERS[i]}
                  text={opt}
                  state={state.selectedIndex === i ? "chosen" : "idle"}
                  onSelect={() => select(i)}
                  urdu={isUrdu(opt)}
                />
              ))}
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
              className="ml-auto inline-flex items-center gap-1.5 rounded-sm border border-ink/25 px-3 py-2 text-sm font-medium text-ink-muted hover:bg-ink/5 lg:hidden"
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
          <div className="sticky top-20 border border-border bg-surface p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-soft">Answer sheet</h2>
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
