import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Check, ChevronLeft, MinusCircle, RotateCcw, X } from "lucide-react";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth-helpers";
import { parseOptions } from "@/lib/queries";
import type { AnswerInput } from "@/lib/attempt-actions";
import { Logo } from "@/components/brand/Logo";
import { buttonVariants } from "@/components/ui/button";
import { ShareButton } from "@/components/app/ShareButton";
import { cn, formatClock, pct } from "@/lib/utils";

export const metadata: Metadata = { title: "Result" };

const LETTERS = ["A", "B", "C", "D"];

export default async function ResultPage({
  params,
  searchParams,
}: {
  params: Promise<{ testId: string }>;
  searchParams: Promise<{ attempt?: string }>;
}) {
  const { testId } = await params;
  const { attempt: attemptId } = await searchParams;
  const user = await getCurrentUser();

  const attempt = await prisma.attempt.findFirst({
    where: {
      id: attemptId || undefined,
      testId,
      userId: user.id,
      submittedAt: { not: null },
    },
    orderBy: { submittedAt: "desc" },
    include: { test: { include: { subject: true, questions: { orderBy: { order: "asc" } } } } },
  });

  // No finished attempt yet → send them to take the test.
  if (!attempt) redirect(`/tests/${testId}`);
  if (!attempt.test) notFound();

  const answers = (attempt.answers as unknown as AnswerInput[]) ?? [];
  const answerFor = (qid: string) => answers.find((a) => a.questionId === qid);

  const timeSec = attempt.submittedAt
    ? Math.round((attempt.submittedAt.getTime() - attempt.startedAt.getTime()) / 1000)
    : null;
  const accuracy = pct(attempt.score, attempt.total);

  // Percentile among all submitted attempts of this test (only if enough data).
  const peers = await prisma.attempt.findMany({
    where: { testId, submittedAt: { not: null } },
    select: { accuracy: true },
  });
  let percentile: number | null = null;
  if (peers.length >= 5) {
    const atOrBelow = peers.filter((p) => p.accuracy <= accuracy).length;
    percentile = Math.round((atOrBelow / peers.length) * 100);
  }

  const wrong = attempt.total - attempt.score - answers.filter((a) => a.selectedIndex === null).length;
  const skipped = answers.filter((a) => a.selectedIndex === null).length;
  const passed = accuracy >= 50;

  return (
    <div>
      <header className="border-b border-ink/8 bg-surface/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4 sm:px-6">
          <Link href="/dashboard" aria-label="Dashboard">
            <Logo />
          </Link>
          <Link
            href={`/subjects/${attempt.test.subject.slug}`}
            className="inline-flex items-center gap-1 text-sm font-medium text-ink-muted hover:text-ink"
          >
            <ChevronLeft className="size-4" /> {attempt.test.subject.title}
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        {/* Score hero */}
        <div
          className={cn(
            "rounded-2xl p-8 text-center text-white shadow-lg",
            passed
              ? "bg-gradient-to-br from-primary to-primary-dark"
              : "bg-gradient-to-br from-amber-500 to-amber-700",
          )}
        >
          <p className="text-sm font-medium text-white/80">{attempt.test.title}</p>
          <p className="mt-3 font-mono text-6xl font-extrabold tabular-nums">
            {attempt.score}
            <span className="text-3xl text-white/70">/{attempt.total}</span>
          </p>
          <p className="mt-2 text-lg font-semibold">{accuracy}% accuracy</p>
          <div className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-white/90">
            <span>✅ {attempt.score} correct</span>
            <span>❌ {wrong} wrong</span>
            <span>➖ {skipped} skipped</span>
            {timeSec != null && <span>⏱ {formatClock(timeSec)} used</span>}
            {percentile != null && <span>📊 Top {Math.max(1, 100 - percentile)}%</span>}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-5 flex flex-wrap gap-2">
          <Link href={`/tests/${testId}`} className={cn(buttonVariants())}>
            <RotateCcw /> Retake Test
          </Link>
          <Link
            href={`/subjects/${attempt.test.subject.slug}`}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Back to Subject
          </Link>
          <ShareButton />
        </div>

        {/* Per-question review */}
        <h2 className="mt-10 font-display text-xl font-bold text-ink">
          Review &amp; explanations
        </h2>
        <div className="mt-4 space-y-4">
          {attempt.test.questions.map((q, idx) => {
            const opts = parseOptions(q.options);
            const a = answerFor(q.id);
            const sel = a?.selectedIndex ?? null;
            const isCorrect = sel === q.correctIndex;
            const isSkipped = sel === null;

            return (
              <div key={q.id} className="rounded-2xl border border-ink/8 bg-surface p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      "flex size-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold",
                      isCorrect
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                        : isSkipped
                          ? "bg-surface-muted text-ink-soft"
                          : "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300",
                    )}
                  >
                    {isCorrect ? <Check className="size-4" /> : isSkipped ? <MinusCircle className="size-4" /> : <X className="size-4" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium leading-relaxed text-ink">
                      <span className="text-ink-soft">Q{idx + 1}. </span>
                      {q.text}
                    </p>

                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {opts.map((opt, i) => {
                        const correct = i === q.correctIndex;
                        const chosenWrong = i === sel && !correct;
                        return (
                          <div
                            key={i}
                            className={cn(
                              "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm",
                              correct && "border-emerald-400 bg-emerald-50 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-200",
                              chosenWrong && "border-rose-400 bg-rose-50 text-rose-800 dark:bg-rose-500/15 dark:text-rose-200",
                              !correct && !chosenWrong && "border-ink/10 text-ink-muted",
                            )}
                          >
                            <span className="font-mono text-xs font-bold">{LETTERS[i]}</span>
                            <span>{opt}</span>
                            {correct && <Check className="ml-auto size-4 text-emerald-600" />}
                            {chosenWrong && <X className="ml-auto size-4 text-rose-600" />}
                          </div>
                        );
                      })}
                    </div>

                    <p className="mt-3 rounded-lg bg-surface-muted px-3 py-2 text-sm text-ink-muted">
                      <span className="font-semibold text-ink">Explanation: </span>
                      {q.explanation}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="my-8 flex justify-center">
          <Link href="/dashboard" className={cn(buttonVariants({ variant: "ghost" }))}>
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
