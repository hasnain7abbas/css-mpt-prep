import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { parseOptions } from "@/lib/queries";
import { Logo } from "@/components/brand/Logo";
import { buttonVariants } from "@/components/ui/button";
import { DemoQuiz, type DemoQuestion } from "@/components/marketing/DemoQuiz";
import { EXAM } from "@/lib/mpt";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Free demo",
  description:
    "Fifteen MPT-style MCQs across all seven sections — no login required.",
};

// Rendered at request time (it reads the DB), so the production build never
// needs a live database connection.
export const dynamic = "force-dynamic";

const PER_SUBJECT = 3;

export default async function DemoPage() {
  // A few questions from each section's first practice test → a public sampler.
  const tests = await prisma.test.findMany({
    where: { number: 1, kind: "PRACTICE", isPublished: true },
    orderBy: { subject: { order: "asc" } },
    include: {
      subject: true,
      questions: { orderBy: { order: "asc" }, take: PER_SUBJECT },
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
        subjectTitle: t.subject?.title ?? "MPT",
      })),
    )
    .slice(0, 15);

  return (
    <div className="min-h-dvh bg-surface">
      <header className="border-b border-ink/15 bg-surface/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4 sm:px-6">
          <Link href="/" aria-label="Home">
            <Logo />
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/login" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
              Sign in
            </Link>
            <Link href="/register" className={cn(buttonVariants({ size: "sm" }))}>
              Get access
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-ink-muted">
          Open demo · no account needed
        </p>
        <div className="rule-double mt-3" />
        <h1 className="pt-6 font-display text-3xl font-bold text-ink sm:text-4xl">
          {questions.length} questions from the real bank
        </h1>
        <p className="mt-2 max-w-xl text-ink-muted">
          Drawn from every section of the {EXAM.cycle} paper. Nothing is deducted for a
          wrong answer here either — answer everything.
        </p>

        <div className="mt-8">
          {questions.length > 0 ? (
            <DemoQuiz questions={questions} />
          ) : (
            <p className="border border-dashed border-ink/25 p-10 text-center text-ink-muted">
              Demo questions appear once the bank is seeded.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
