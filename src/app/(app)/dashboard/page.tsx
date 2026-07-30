import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { getCurrentUser } from "@/lib/auth-helpers";
import { getUserStats, getInProgressAttempt } from "@/lib/stats";
import { getDrillsForSubject, getMocks, getSubjectsOverview } from "@/lib/queries";
import { buttonVariants } from "@/components/ui/button";
import { SubjectCard } from "@/components/app/SubjectCard";
import { EXAM, cutoffFor, daysUntilTest, formatExamDate } from "@/lib/mpt";
import { subjectMeta } from "@/lib/subjects";
import { cn, firstName } from "@/lib/utils";

export const metadata: Metadata = { title: "Dashboard" };

const titleCase = (s: string) =>
  s.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const [stats, inProgress, subjects, mocks] = await Promise.all([
    getUserStats(user.id),
    getInProgressAttempt(user.id),
    getSubjectsOverview(),
    getMocks(),
  ]);

  const days = Math.max(0, daysUntilTest());
  const drills = stats.weakest ? await getDrillsForSubject(stats.weakest.slug, 3) : [];
  const nextMock = mocks[0];
  const mockCutoff = cutoffFor(EXAM.totalQuestions);

  return (
    <div className="space-y-12">
      {/* Header line */}
      <div>
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-ink-muted">
          {EXAM.cycle} · MPT on {formatExamDate(EXAM.testDate)}
        </p>
        <div className="rule-double mt-3" />
        <div className="flex flex-wrap items-end justify-between gap-6 pt-6">
          <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">
            Assalam-o-Alaikum, {firstName(user.name)}
          </h1>
          <p className="font-mono text-sm text-ink-muted tabular-nums">
            <span className="text-2xl font-medium text-ink">{days}</span> days left
          </p>
        </div>
      </div>

      {/* Resume / start */}
      <section className="border-2 border-ink bg-ink px-6 py-7 text-surface sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-xl font-bold text-surface">
              {inProgress ? "You left a paper unfinished" : "Sit a full-length mock"}
            </h2>
            <p className="mt-1 max-w-lg text-sm text-surface/70">
              {inProgress
                ? `${inProgress.test.title} — the clock is still running on it.`
                : `${EXAM.totalQuestions} questions, ${EXAM.durationMin} minutes, exact FPSC weighting. ${mockCutoff} marks clears the line.`}
            </p>
          </div>
          <Link
            href={
              inProgress
                ? `/tests/${inProgress.testId}`
                : nextMock
                  ? `/tests/${nextMock.id}`
                  : "/subjects"
            }
            className="inline-flex h-12 shrink-0 items-center gap-2 rounded-sm bg-surface px-6 text-sm font-semibold text-ink transition-transform duration-200 ease-[var(--ease-out-expo)] active:translate-y-px"
          >
            <Play className="size-4" />
            {inProgress ? "Resume" : nextMock ? "Start mock" : "Browse subjects"}
          </Link>
        </div>
      </section>

      {/* Numbers */}
      <section>
        <dl className="grid grid-cols-2 gap-px border border-border bg-border lg:grid-cols-4">
          {[
            { v: stats.attemptedQuestions.toLocaleString(), l: "Questions attempted" },
            { v: stats.correct.toLocaleString(), l: "Correct" },
            { v: `${stats.accuracy}%`, l: "Accuracy" },
            { v: stats.streak, l: stats.streak === 1 ? "Day streak" : "Day streak" },
          ].map((s) => (
            <div key={s.l} className="bg-surface px-5 py-6">
              <dd className="font-mono text-3xl font-medium text-ink tabular-nums">{s.v}</dd>
              <dt className="mt-1 text-xs text-ink-muted">{s.l}</dt>
            </div>
          ))}
        </dl>

        {stats.bestMock && (
          <p className="mt-3 text-sm text-ink-muted">
            Best full mock:{" "}
            <strong className="font-mono text-ink">
              {stats.bestMock.score}/{stats.bestMock.total}
            </strong>{" "}
            —{" "}
            {stats.bestMock.score >= cutoffFor(stats.bestMock.total) ? (
              <span className="text-primary">above the {EXAM.passMarks}-mark line</span>
            ) : (
              <span className="text-accent">
                {cutoffFor(stats.bestMock.total) - stats.bestMock.score} short of the line
              </span>
            )}
          </p>
        )}
      </section>

      {/* Weak areas → drills */}
      {stats.weakTopics.length > 0 && (
        <section>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-xl font-bold text-ink">What to fix next</h2>
              <p className="mt-1 text-sm text-ink-muted">
                Ranked by your own accuracy, once a topic has at least five attempted questions.
              </p>
            </div>
            <Link
              href="/progress"
              className="hidden text-sm font-medium text-ink underline decoration-accent decoration-2 underline-offset-4 sm:inline"
            >
              Full breakdown
            </Link>
          </div>

          <ul className="mt-5 divide-y divide-border border-y border-border">
            {stats.weakTopics.slice(0, 4).map((t) => (
              <li key={`${t.subjectSlug}:${t.topic}`} className="flex items-center gap-4 py-3.5">
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-ink">
                    {titleCase(t.topic)}
                  </span>
                  <span className="text-xs text-ink-soft">
                    {subjectMeta(t.subjectSlug)?.title ?? t.subjectSlug} · {t.correct}/{t.attempted}
                  </span>
                </span>
                <span
                  className={cn(
                    "font-mono text-sm tabular-nums",
                    t.accuracy < EXAM.passPercent ? "text-accent" : "text-ink-muted",
                  )}
                >
                  {t.accuracy}%
                </span>
              </li>
            ))}
          </ul>

          {drills.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {drills.map((d) => (
                <Link
                  key={d.id}
                  href={`/tests/${d.id}`}
                  className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                >
                  {d.title} · {d.questionCount} Q
                </Link>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Subjects */}
      <section>
        <div className="mb-5 flex items-end justify-between gap-4">
          <h2 className="font-display text-xl font-bold text-ink">Sections</h2>
          <Link
            href="/subjects"
            className="text-sm font-medium text-ink underline decoration-accent decoration-2 underline-offset-4"
          >
            All sections
          </Link>
        </div>
        <div className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((s) => {
            const stat = stats.perSubject.find((p) => p.slug === s.slug);
            return <SubjectCard key={s.slug} {...s} accuracy={stat?.accuracy ?? null} />;
          })}
        </div>
      </section>

      {/* Mocks + past papers */}
      <section className="grid gap-px border border-border bg-border sm:grid-cols-2">
        <Link
          href="/mocks"
          className="group bg-surface px-6 py-7 transition-colors hover:bg-ink/[0.03]"
        >
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-soft">
            {mocks.length} available
          </p>
          <h3 className="mt-2 flex items-center gap-2 font-display text-lg font-bold text-ink">
            Full-length mocks{" "}
            <ArrowRight className="size-4 transition-transform duration-200 ease-[var(--ease-out-expo)] group-hover:translate-x-1" />
          </h3>
          <p className="mt-1 text-sm text-ink-muted">
            The whole paper, timed to {EXAM.durationMin} minutes.
          </p>
        </Link>
        <Link
          href="/past-papers"
          className="group bg-surface px-6 py-7 transition-colors hover:bg-ink/[0.03]"
        >
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-soft">
            Recalled papers
          </p>
          <h3 className="mt-2 flex items-center gap-2 font-display text-lg font-bold text-ink">
            Past papers{" "}
            <ArrowRight className="size-4 transition-transform duration-200 ease-[var(--ease-out-expo)] group-hover:translate-x-1" />
          </h3>
          <p className="mt-1 text-sm text-ink-muted">
            What candidates remembered from previous MPT sittings, answered and explained.
          </p>
        </Link>
      </section>
    </div>
  );
}
