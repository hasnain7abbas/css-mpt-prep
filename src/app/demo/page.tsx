import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { parseOptions } from "@/lib/queries";
import { Logo } from "@/components/brand/Logo";
import { buttonVariants } from "@/components/ui/button";
import { DemoQuiz, type DemoQuestion } from "@/components/marketing/DemoQuiz";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Free Demo Test",
  description: "Try 10 sample FIA-style MCQs — no login required.",
};

export default async function DemoPage() {
  // 2 questions from each subject's first test → a 10-question public sampler.
  const tests = await prisma.test.findMany({
    where: { number: 1, isPublished: true },
    orderBy: { subject: { order: "asc" } },
    include: {
      subject: true,
      questions: { orderBy: { order: "asc" }, take: 2 },
    },
  });

  const questions: DemoQuestion[] = tests
    .flatMap((t) =>
      t.questions.map((q) => ({
        id: q.id,
        text: q.text,
        options: parseOptions(q.options),
        correctIndex: q.correctIndex,
        explanation: q.explanation,
        subjectTitle: t.subject.title,
      })),
    )
    .slice(0, 10);

  return (
    <div className="min-h-dvh bg-surface-muted">
      <header className="border-b border-ink/8 bg-surface/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4 sm:px-6">
          <Link href="/" aria-label="Home">
            <Logo />
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/login" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
              Sign In
            </Link>
            <Link href="/register" className={cn(buttonVariants({ size: "sm" }))}>
              Register
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="mb-6 text-center">
          <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">
            Free Demo Test
          </h1>
          <p className="mt-1 text-ink-muted">
            {questions.length} sample MCQs across all subjects. No login needed — see how it feels.
          </p>
        </div>

        {questions.length > 0 ? (
          <DemoQuiz questions={questions} />
        ) : (
          <p className="text-center text-ink-muted">Demo questions are being prepared.</p>
        )}
      </div>
    </div>
  );
}
