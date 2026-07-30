import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth-helpers";
import { getUserStats } from "@/lib/stats";
import { subjectMeta } from "@/lib/subjects";
import { buttonVariants } from "@/components/ui/button";
import { Sparkline } from "@/components/app/Sparkline";
import { StreakHeatmap } from "@/components/app/StreakHeatmap";
import { EXAM, cutoffFor, marksFor } from "@/lib/mpt";
import { cn, formatClock } from "@/lib/utils";

export const metadata: Metadata = { title: "Progress" };

const dayKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const fmtDate = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
const titleCase = (s: string) =>
  s.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

export default async function ProgressPage() {
  const user = await getCurrentUser();
  const stats = await getUserStats(user.id);

  if (stats.totalAttempts === 0) {
    return (
      <div className="flex flex-col items-center justify-center border border-dashed border-ink/25 py-20 text-center">
        <h1 className="font-display text-2xl font-bold text-ink">Nothing to report yet</h1>
        <p className="mt-2 max-w-sm text-ink-muted">
          Sit one paper and this page fills up: accuracy by section, your weak topics,
          and how close you are to the {EXAM.passMarks}-mark line.
        </p>
        <Link href="/mocks" className={cn(buttonVariants(), "mt-6")}>
          Start a mock
        </Link>
      </div>
    );
  }

  const attempts = await prisma.attempt.findMany({
    where: { userId: user.id, submittedAt: { not: null } },
    select: { accuracy: true, submittedAt: true },
    orderBy: { submittedAt: "asc" },
  });

  const counts: Record<string, number> = {};
  const dailyAcc: Record<string, { sum: number; n: number }> = {};
  for (const a of attempts) {
    const k = dayKey(a.submittedAt!);
    counts[k] = (counts[k] ?? 0) + 1;
    const cur = dailyAcc[k] ?? { sum: 0, n: 0 };
    cur.sum += a.accuracy;
    cur.n += 1;
    dailyAcc[k] = cur;
  }

  const series: number[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const k = dayKey(d);
    if (dailyAcc[k]) series.push(Math.round(dailyAcc[k].sum / dailyAcc[k].n));
  }

  // Projected MPT score: apply per-section accuracy to the official weighting.
  const projected = stats.perSubject.length
    ? Math.round(
        stats.perSubject.reduce((n, s) => n + (s.accuracy / 100) * marksFor(s.slug), 0),
      )
    : null;
  const projectedClears = projected != null && projected >= EXAM.passMarks;

  return (
    <div className="space-y-12">
      <header>
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-ink-muted">
          {stats.totalAttempts} papers · {stats.attemptedQuestions.toLocaleString()} questions
        </p>
        <div className="rule-double mt-3" />
        <h1 className="pt-6 font-display text-3xl font-bold text-ink sm:text-4xl">Progress</h1>
      </header>

      {/* Headline + projection */}
      <section className="grid gap-px border border-border bg-border lg:grid-cols-[1fr_1.4fr]">
        <div className="bg-surface px-6 py-7">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-soft">
            Overall accuracy
          </p>
          <p className="mt-3 font-mono text-6xl font-medium text-ink tabular-nums">
            {stats.accuracy}%
          </p>
          <p className="mt-2 text-sm text-ink-muted">
            {stats.correct.toLocaleString()} correct of {stats.attemptedQuestions.toLocaleString()}
          </p>
          <p className="mt-4 font-mono text-xs text-ink-soft">
            {stats.streak}-day streak
          </p>
        </div>

        <div className="bg-surface px-6 py-7">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-soft">
            Projected MPT score
          </p>
          {projected != null ? (
            <>
              <p className="mt-3 flex items-baseline gap-2">
                <span
                  className={cn(
                    "font-mono text-6xl font-medium tabular-nums",
                    projectedClears ? "text-primary" : "text-accent",
                  )}
                >
                  {projected}
                </span>
                <span className="font-mono text-2xl text-ink-soft">/ {EXAM.totalQuestions}</span>
              </p>
              <div className="relative mt-4 h-2 w-full bg-ink/10">
                <div
                  className={cn("h-full", projectedClears ? "bg-primary" : "bg-accent")}
                  style={{ width: `${Math.min(100, (projected / EXAM.totalQuestions) * 100)}%` }}
                />
                <div
                  className="absolute -top-1 h-4 w-px bg-ink"
                  style={{ left: `${(EXAM.passMarks / EXAM.totalQuestions) * 100}%` }}
                  aria-hidden
                />
              </div>
              <p className="mt-2 text-sm text-ink-muted">
                Your section accuracy applied to the official weighting. The line is at{" "}
                {EXAM.passMarks}.
              </p>
            </>
          ) : (
            <p className="mt-3 text-ink-muted">Sit a few section tests to see a projection.</p>
          )}
        </div>
      </section>

      {/* Trend */}
      {series.length > 1 && (
        <section>
          <h2 className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-soft">
            Accuracy, last 30 days
          </h2>
          <div className="mt-4 border border-border p-5">
            <Sparkline values={series} className="h-24 w-full" />
          </div>
        </section>
      )}

      {/* By section */}
      <section>
        <h2 className="font-display text-xl font-bold text-ink">By section</h2>
        <table className="mt-4 w-full border-collapse text-left">
          <thead>
            <tr className="border-y border-ink/25">
              <th className="py-2.5 pr-4 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-soft">
                Section
              </th>
              <th className="py-2.5 pr-4 text-right font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-soft">
                Marks
              </th>
              <th className="py-2.5 pr-4 text-right font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-soft">
                Correct
              </th>
              <th className="py-2.5 text-right font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-soft">
                Accuracy
              </th>
            </tr>
          </thead>
          <tbody>
            {[...stats.perSubject]
              .sort((a, b) => marksFor(b.slug) - marksFor(a.slug))
              .map((s) => {
                const meta = subjectMeta(s.slug);
                const weakest = stats.weakest?.slug === s.slug && stats.perSubject.length > 1;
                return (
                  <tr key={s.slug} className="border-b border-border">
                    <td className="py-3 pr-4">
                      <span className="flex items-center gap-2 font-medium text-ink">
                        {meta && <meta.icon className="size-4 text-ink-soft" />}
                        {s.title}
                        {weakest && (
                          <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-accent">
                            weakest
                          </span>
                        )}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-right font-mono text-sm text-ink-soft tabular-nums">
                      {marksFor(s.slug)}
                    </td>
                    <td className="py-3 pr-4 text-right font-mono text-sm text-ink-muted tabular-nums">
                      {s.correct}/{s.attempted}
                    </td>
                    <td
                      className={cn(
                        "py-3 text-right font-mono text-sm font-medium tabular-nums",
                        s.accuracy >= 60
                          ? "text-primary"
                          : s.accuracy >= EXAM.passPercent
                            ? "text-ink"
                            : "text-accent",
                      )}
                    >
                      {s.accuracy}%
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </section>

      {/* Weak topics */}
      {stats.weakTopics.length > 0 && (
        <section>
          <h2 className="font-display text-xl font-bold text-ink">Weakest topics</h2>
          <ul className="mt-4 divide-y divide-border border-y border-border">
            {stats.weakTopics.map((t) => (
              <li key={`${t.subjectSlug}:${t.topic}`} className="flex items-center gap-4 py-3">
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-ink">{titleCase(t.topic)}</span>
                  <span className="font-mono text-xs text-ink-soft">
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
                <Link
                  href={`/subjects/${t.subjectSlug}`}
                  className="shrink-0 text-sm font-medium text-ink underline decoration-accent decoration-2 underline-offset-4"
                >
                  Drill
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Activity */}
      <section>
        <h2 className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-soft">
          Activity, last 12 weeks
        </h2>
        <div className="mt-4 border border-border p-5">
          <StreakHeatmap counts={counts} />
        </div>
      </section>

      {/* Recent */}
      <section>
        <h2 className="font-display text-xl font-bold text-ink">Recent papers</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-y border-ink/25 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft">
                <th className="py-2.5 pr-4 font-medium">Paper</th>
                <th className="py-2.5 pr-4 font-medium">Date</th>
                <th className="py-2.5 pr-4 text-right font-medium">Score</th>
                <th className="py-2.5 pr-4 text-right font-medium">Line</th>
                <th className="py-2.5 pr-4 text-right font-medium">Time</th>
                <th className="py-2.5 text-right font-medium">Review</th>
              </tr>
            </thead>
            <tbody>
              {stats.recent.map((a) => {
                const cleared = a.score >= cutoffFor(a.total);
                return (
                  <tr key={a.id} className="border-b border-border">
                    <td className="py-3 pr-4 font-medium text-ink">{a.testTitle}</td>
                    <td className="py-3 pr-4 text-ink-muted">{fmtDate(a.date)}</td>
                    <td className="py-3 pr-4 text-right font-mono text-ink tabular-nums">
                      {a.score}/{a.total}
                    </td>
                    <td
                      className={cn(
                        "py-3 pr-4 text-right font-mono tabular-nums",
                        cleared ? "text-primary" : "text-accent",
                      )}
                    >
                      {cleared ? "clear" : `−${cutoffFor(a.total) - a.score}`}
                    </td>
                    <td className="py-3 pr-4 text-right font-mono text-ink-muted tabular-nums">
                      {a.timeSec != null ? formatClock(a.timeSec) : "—"}
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        href={`/tests/${a.testId}/result?attempt=${a.id}`}
                        className="font-medium text-ink underline decoration-accent decoration-2 underline-offset-4"
                      >
                        Open
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
