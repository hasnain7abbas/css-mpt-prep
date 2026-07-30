import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Info, Play, RotateCcw } from "lucide-react";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth-helpers";
import { getTestWithQuestions, parseOptions } from "@/lib/queries";
import { startAttempt, type AnswerInput } from "@/lib/attempt-actions";
import { Logo } from "@/components/brand/Logo";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge, difficultyVariant } from "@/components/ui/badge";
import { QuizRunner } from "@/components/app/QuizRunner";
import { cutoffFor, EXAM } from "@/lib/mpt";
import { cn, pct } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ testId: string }>;
}): Promise<Metadata> {
  const { testId } = await params;
  const test = await prisma.test.findUnique({ where: { id: testId }, select: { title: true } });
  return { title: test?.title ?? "Test" };
}

const KIND_LABEL: Record<string, string> = {
  MOCK: "Full-length mock",
  PAST_PAPER: "Recalled past paper",
  DRILL: "Topic drill",
  PRACTICE: "Practice test",
};

export default async function TestPage({
  params,
}: {
  params: Promise<{ testId: string }>;
}) {
  const { testId } = await params;
  const user = await getCurrentUser();

  const test = await getTestWithQuestions(testId);
  if (!test || !test.isPublished || test.questions.length === 0) notFound();

  const backHref = test.subject ? `/subjects/${test.subject.slug}` : test.kind === "PAST_PAPER" ? "/past-papers" : "/mocks";
  const backLabel = test.subject ? test.subject.title : test.kind === "PAST_PAPER" ? "Past papers" : "Mocks";
  const sectionLabel = test.subject?.title ?? KIND_LABEL[test.kind] ?? "MPT";

  // Resume an in-progress attempt → straight into the runner.
  const inProgress = await prisma.attempt.findFirst({
    where: { userId: user.id, testId, submittedAt: null },
    orderBy: { createdAt: "desc" },
  });

  if (inProgress) {
    const runnerQuestions = test.questions.map((q) => ({
      id: q.id,
      order: q.order,
      text: q.text,
      options: parseOptions(q.options),
    }));
    const initialAnswers = (inProgress.answers as unknown as AnswerInput[]) ?? [];
    return (
      <QuizRunner
        attemptId={inProgress.id}
        testTitle={test.title}
        subjectTitle={sectionLabel}
        durationMin={test.durationMin}
        startedAtMs={inProgress.startedAt.getTime()}
        questions={runnerQuestions}
        initialAnswers={initialAnswers}
      />
    );
  }

  // Otherwise: the pre-quiz briefing.
  const last = await prisma.attempt.findFirst({
    where: { userId: user.id, testId, submittedAt: { not: null } },
    orderBy: { submittedAt: "desc" },
  });

  const start = startAttempt.bind(null, testId);
  const cutoff = cutoffFor(test.questions.length);

  return (
    <div>
      <header className="border-b border-ink/15 bg-surface/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4 sm:px-6">
          <Link href="/dashboard" aria-label="Dashboard">
            <Logo />
          </Link>
          <Link
            href={backHref}
            className="inline-flex items-center gap-1 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
          >
            <ChevronLeft className="size-4" /> {backLabel}
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="border border-border bg-surface p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-soft">
                {KIND_LABEL[test.kind] ?? "Test"}
                {test.subject ? ` · ${test.subject.title}` : ""}
                {test.paperYear ? ` · ${test.paperYear}` : ""}
              </p>
              <h1 className="mt-2 font-display text-2xl font-bold text-ink sm:text-3xl">
                {test.title}
              </h1>
            </div>
            <Badge variant={difficultyVariant(test.difficulty)}>
              {test.difficulty.charAt(0) + test.difficulty.slice(1).toLowerCase()}
            </Badge>
          </div>

          <dl className="mt-7 grid grid-cols-3 divide-x divide-border border-y border-border">
            <div className="px-4 py-4 first:pl-0">
              <dd className="font-mono text-2xl font-medium text-ink tabular-nums">
                {test.questions.length}
              </dd>
              <dt className="mt-1 text-xs text-ink-muted">Questions</dt>
            </div>
            <div className="px-4 py-4">
              <dd className="font-mono text-2xl font-medium text-ink tabular-nums">
                {test.durationMin}
                <span className="ml-1 text-sm text-ink-muted">min</span>
              </dd>
              <dt className="mt-1 text-xs text-ink-muted">Time limit</dt>
            </div>
            <div className="px-4 py-4">
              <dd className="font-mono text-2xl font-medium text-primary tabular-nums">{cutoff}</dd>
              <dt className="mt-1 text-xs text-ink-muted">
                Pass line ({EXAM.passPercent}%)
              </dt>
            </div>
          </dl>

          {last && (
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-l-2 border-primary bg-primary/[0.06] px-4 py-3">
              <p className="text-sm text-ink">
                Last attempt:{" "}
                <strong className="font-mono">
                  {last.score}/{last.total}
                </strong>{" "}
                ({pct(last.score, last.total)}%)
              </p>
              <Link
                href={`/tests/${testId}/result?attempt=${last.id}`}
                className="text-sm font-semibold text-ink underline decoration-accent decoration-2 underline-offset-4"
              >
                Review it
              </Link>
            </div>
          )}

          <div className="mt-6 border border-border p-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-ink">
              <Info className="size-4 text-primary" /> Before you start
            </p>
            <ul className="mt-2 space-y-1.5 text-sm text-ink-muted">
              <li>+1 for each correct answer, nothing deducted for a wrong one — never leave a bubble empty.</li>
              <li>The timer starts now, runs on the server, and cannot be paused.</li>
              <li>Answers autosave; refreshing or losing signal will not lose your work.</li>
              <li>The paper submits itself when the clock reaches zero.</li>
            </ul>
          </div>

          <form action={start} className="mt-6">
            <Button type="submit" size="lg" className="w-full">
              {last ? <RotateCcw /> : <Play />}
              {last ? "Sit it again" : "Start"}
            </Button>
          </form>
        </div>

        <p className="mt-4 text-center">
          <Link href={backHref} className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
            Back to {backLabel}
          </Link>
        </p>
      </div>
    </div>
  );
}
