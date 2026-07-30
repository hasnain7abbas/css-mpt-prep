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
import { LETTERS, isUrdu } from "@/components/app/OptionRow";
import { clearsCutoff, cutoffFor, EXAM } from "@/lib/mpt";
import { cn, formatClock, pct } from "@/lib/utils";

export const metadata: Metadata = { title: "Result" };

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

  const peers = await prisma.attempt.findMany({
    where: { testId, submittedAt: { not: null } },
    select: { accuracy: true },
  });
  let percentile: number | null = null;
  if (peers.length >= 5) {
    const atOrBelow = peers.filter((p) => p.accuracy <= accuracy).length;
    percentile = Math.round((atOrBelow / peers.length) * 100);
  }

  const skipped = answers.filter((a) => a.selectedIndex === null).length;
  const wrong = attempt.total - attempt.score - skipped;
  const cutoff = cutoffFor(attempt.total);
  const cleared = clearsCutoff(attempt.score, attempt.total);
  const margin = attempt.score - cutoff;

  // Where the marks went, by section — the useful part of a mixed mock.
  const bySubject = new Map<string, { title: string; correct: number; total: number }>();
  for (const q of attempt.test.questions) {
    const slug = q.subjectSlug ?? attempt.test.subject?.slug;
    if (!slug) continue;
    const row = bySubject.get(slug) ?? { title: slug, correct: 0, total: 0 };
    row.total += 1;
    if (answerFor(q.id)?.selectedIndex === q.correctIndex) row.correct += 1;
    bySubject.set(slug, row);
  }
  if (bySubject.size > 1) {
    const titles = new Map(
      (await prisma.subject.findMany({ select: { slug: true, title: true } })).map((s) => [
        s.slug,
        s.title,
      ]),
    );
    for (const [slug, row] of bySubject) row.title = titles.get(slug) ?? slug;
  }
  const sections = bySubject.size > 1 ? [...bySubject.values()] : [];

  const backHref = attempt.test.subject
    ? `/subjects/${attempt.test.subject.slug}`
    : attempt.test.kind === "PAST_PAPER"
      ? "/past-papers"
      : "/mocks";
  const backLabel = attempt.test.subject?.title ?? (attempt.test.kind === "PAST_PAPER" ? "Past papers" : "Mocks");

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

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        {/* Score sheet */}
        <div className="border-2 border-ink bg-surface">
          <div className="flex items-center justify-between border-b border-border px-6 py-3">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-soft">
              {attempt.test.title}
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

          <div className="grid gap-6 px-6 py-7 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-10">
            <p className="font-mono text-[4.5rem] font-medium leading-none text-ink tabular-nums">
              {attempt.score}
              <span className="text-3xl text-ink-soft">/{attempt.total}</span>
            </p>
            <div>
              {/* Pass-line gauge */}
              <div className="relative h-2 w-full bg-ink/10">
                <div
                  className={cn("h-full", cleared ? "bg-primary" : "bg-accent")}
                  style={{ width: `${Math.min(100, accuracy)}%` }}
                />
                <div
                  className="absolute -top-1 h-4 w-px bg-ink"
                  style={{ left: `${(cutoff / attempt.total) * 100}%` }}
                  aria-hidden
                />
              </div>
              <p className="mt-2 text-sm text-ink-muted">
                {accuracy}% · pass line for this paper is{" "}
                <strong className="font-mono text-ink">{cutoff}</strong> ({EXAM.passPercent}%) —{" "}
                {margin >= 0 ? (
                  <span className="text-primary">{margin} mark{margin === 1 ? "" : "s"} clear</span>
                ) : (
                  <span className="text-accent">
                    {Math.abs(margin)} mark{Math.abs(margin) === 1 ? "" : "s"} short
                  </span>
                )}
              </p>
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs text-ink-muted tabular-nums">
                <span>{attempt.score} correct</span>
                <span>{wrong} wrong</span>
                <span>{skipped} left blank</span>
                {timeSec != null && <span>{formatClock(timeSec)} used</span>}
                {percentile != null && <span>top {Math.max(1, 100 - percentile)}%</span>}
              </div>
              {skipped > 0 && (
                <p className="mt-3 border-l-2 border-warning bg-warning/[0.08] px-3 py-2 text-xs text-ink-muted">
                  You left {skipped} question{skipped === 1 ? "" : "s"} blank. There is no
                  negative marking in the MPT — a blind guess is free marks.
                </p>
              )}
            </div>
          </div>

          {sections.length > 0 && (
            <div className="border-t border-border">
              <table className="w-full text-left text-sm">
                <tbody>
                  {sections
                    .sort((a, b) => b.total - a.total)
                    .map((s) => (
                      <tr key={s.title} className="border-b border-border last:border-b-0">
                        <td className="px-6 py-2.5 text-ink">{s.title}</td>
                        <td className="px-6 py-2.5 text-right font-mono text-ink-muted tabular-nums">
                          {s.correct}/{s.total}
                        </td>
                        <td className="w-24 px-6 py-2.5 text-right font-mono tabular-nums">
                          <span className={pct(s.correct, s.total) >= EXAM.passPercent ? "text-primary" : "text-accent"}>
                            {pct(s.correct, s.total)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-5 flex flex-wrap gap-2">
          <Link href={`/tests/${testId}`} className={cn(buttonVariants())}>
            <RotateCcw /> Sit it again
          </Link>
          <Link href={backHref} className={cn(buttonVariants({ variant: "outline" }))}>
            Back to {backLabel}
          </Link>
          <ShareButton />
        </div>

        {/* Per-question review */}
        <h2 className="mt-12 font-display text-xl font-bold text-ink">
          Every question, answered
        </h2>
        <div className="mt-4 divide-y divide-border border-y border-border">
          {attempt.test.questions.map((q, idx) => {
            const opts = parseOptions(q.options);
            const a = answerFor(q.id);
            const sel = a?.selectedIndex ?? null;
            const isCorrect = sel === q.correctIndex;
            const isSkipped = sel === null;
            const urduQ = isUrdu(q.text);

            return (
              <div key={q.id} className="py-5">
                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border-2",
                      isCorrect
                        ? "border-primary bg-primary text-surface"
                        : isSkipped
                          ? "border-ink/25 text-ink-soft"
                          : "border-accent bg-accent text-surface",
                    )}
                  >
                    {isCorrect ? (
                      <Check className="size-3.5" strokeWidth={3} />
                    ) : isSkipped ? (
                      <MinusCircle className="size-3.5" />
                    ) : (
                      <X className="size-3.5" strokeWidth={3} />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-[11px] text-ink-soft">Q{idx + 1}</p>
                    <p
                      className={cn("mt-1 leading-relaxed text-ink", urduQ && "urdu")}
                      {...(urduQ ? { lang: "ur", dir: "rtl" } : {})}
                    >
                      {q.text}
                    </p>

                    <ul className="mt-3 space-y-1.5">
                      {opts.map((opt, i) => {
                        const correct = i === q.correctIndex;
                        const chosenWrong = i === sel && !correct;
                        const urduO = isUrdu(opt);
                        return (
                          <li
                            key={i}
                            className={cn(
                              "flex items-baseline gap-2.5 text-sm",
                              correct && "font-semibold text-primary",
                              chosenWrong && "text-accent line-through decoration-accent/50",
                              !correct && !chosenWrong && "text-ink-muted",
                            )}
                          >
                            <span className="font-mono text-xs">{LETTERS[i]}</span>
                            <span
                              className={cn(urduO && "urdu")}
                              {...(urduO ? { lang: "ur", dir: "rtl" } : {})}
                            >
                              {opt}
                            </span>
                          </li>
                        );
                      })}
                    </ul>

                    <p
                      className={cn(
                        "mt-3 border-l-2 border-border py-1 pl-3 text-sm text-ink-muted",
                        isUrdu(q.explanation) && "urdu",
                      )}
                      {...(isUrdu(q.explanation) ? { lang: "ur", dir: "rtl" } : {})}
                    >
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
