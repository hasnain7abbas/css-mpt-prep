import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Clock, FileQuestion, Info, Play, RotateCcw, Sparkles } from "lucide-react";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth-helpers";
import { getTestWithQuestions, parseOptions } from "@/lib/queries";
import { startAttempt, type AnswerInput } from "@/lib/attempt-actions";
import { Logo } from "@/components/brand/Logo";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge, difficultyVariant } from "@/components/ui/badge";
import { QuizRunner } from "@/components/app/QuizRunner";
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

export default async function TestPage({
  params,
}: {
  params: Promise<{ testId: string }>;
}) {
  const { testId } = await params;
  const user = await getCurrentUser();

  const test = await getTestWithQuestions(testId);
  if (!test || !test.isPublished || test.questions.length === 0) notFound();

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
        subjectTitle={test.subject.title}
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

  return (
    <div>
      <header className="border-b border-ink/8 bg-surface/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4 sm:px-6">
          <Link href="/dashboard" aria-label="Dashboard">
            <Logo />
          </Link>
          <Link
            href={`/subjects/${test.subject.slug}`}
            className="inline-flex items-center gap-1 text-sm font-medium text-ink-muted hover:text-ink"
          >
            <ChevronLeft className="size-4" /> {test.subject.title}
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="rounded-2xl border border-ink/8 bg-surface p-6 shadow-sm sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-ink-soft">{test.subject.title}</p>
              <h1 className="mt-1 font-display text-2xl font-bold text-ink sm:text-3xl">
                {test.title}
              </h1>
            </div>
            <Badge variant={difficultyVariant(test.difficulty)}>
              {test.difficulty.charAt(0) + test.difficulty.slice(1).toLowerCase()}
            </Badge>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-surface-muted p-4">
              <FileQuestion className="size-5 text-primary" />
              <p className="mt-2 font-mono text-xl font-bold text-ink">{test.questions.length}</p>
              <p className="text-xs text-ink-muted">Questions</p>
            </div>
            <div className="rounded-xl bg-surface-muted p-4">
              <Clock className="size-5 text-primary" />
              <p className="mt-2 font-mono text-xl font-bold text-ink">{test.durationMin} min</p>
              <p className="text-xs text-ink-muted">Time limit</p>
            </div>
            <div className="rounded-xl bg-surface-muted p-4">
              <Sparkles className="size-5 text-primary" />
              <p className="mt-2 font-mono text-xl font-bold text-ink">+1 / 0</p>
              <p className="text-xs text-ink-muted">Right / wrong</p>
            </div>
          </div>

          {last && (
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/20 bg-primary-light/40 p-4">
              <p className="text-sm text-ink">
                Last attempt: <strong>{last.score}/{last.total}</strong> ({pct(last.score, last.total)}%)
              </p>
              <Link
                href={`/tests/${testId}/result?attempt=${last.id}`}
                className="text-sm font-semibold text-primary-dark hover:underline"
              >
                View last result →
              </Link>
            </div>
          )}

          <div className="mt-6 rounded-xl border border-ink/8 p-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-ink">
              <Info className="size-4 text-primary" /> Before you start
            </p>
            <ul className="mt-2 space-y-1.5 text-sm text-ink-muted">
              <li>• +1 mark for each correct answer. No negative marking.</li>
              <li>• The timer starts now and cannot be paused.</li>
              <li>• Answers autosave — you can safely refresh without losing progress.</li>
              <li>• The test auto-submits when the timer reaches zero.</li>
            </ul>
          </div>

          <form action={start} className="mt-6">
            <Button type="submit" size="lg" className="w-full">
              {last ? <RotateCcw /> : <Play />}
              {last ? "Retake Test" : "Start Test"}
            </Button>
          </form>
        </div>

        <p className="mt-4 text-center">
          <Link
            href={`/subjects/${test.subject.slug}`}
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            Back to {test.subject.title}
          </Link>
        </p>
      </div>
    </div>
  );
}
