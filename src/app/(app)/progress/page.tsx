import type { Metadata } from "next";
import Link from "next/link";
import { Activity, BarChart3, CalendarDays, Target, TrendingUp } from "lucide-react";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth-helpers";
import { getUserStats } from "@/lib/stats";
import { subjectMeta } from "@/lib/subjects";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Sparkline } from "@/components/app/Sparkline";
import { StreakHeatmap } from "@/components/app/StreakHeatmap";
import { cn, formatClock } from "@/lib/utils";

export const metadata: Metadata = { title: "Progress" };

const dayKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const fmtDate = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });

export default async function ProgressPage() {
  const user = await getCurrentUser();
  const stats = await getUserStats(user.id);

  if (stats.totalAttempts === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-primary-light text-primary-dark">
          <BarChart3 className="size-7" />
        </div>
        <h1 className="mt-5 font-display text-2xl font-bold text-ink">No progress yet</h1>
        <p className="mt-2 max-w-sm text-ink-muted">
          Take your first test and your accuracy, streak, and weak areas will show up here.
        </p>
        <Link href="/subjects" className={cn(buttonVariants(), "mt-6")}>
          Browse subjects →
        </Link>
      </div>
    );
  }

  // Daily series + heatmap counts.
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

  // Last 30 days average accuracy, only days with data (for the sparkline).
  const series: number[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const k = dayKey(d);
    if (dailyAcc[k]) series.push(Math.round(dailyAcc[k].sum / dailyAcc[k].n));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">Your progress</h1>
        <p className="mt-1 text-ink-muted">
          {stats.totalAttempts} tests completed · {stats.attemptedQuestions} questions attempted.
        </p>
      </div>

      {/* Overall accuracy + trend */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm text-ink-muted">
              <Target className="size-4 text-primary" /> Overall accuracy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-5xl font-extrabold tabular-nums text-ink">
              {stats.accuracy}%
            </p>
            <p className="mt-2 text-sm text-ink-muted">
              {stats.correct} correct of {stats.attemptedQuestions} attempted
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
              <Activity className="size-3.5" /> {stats.streak}-day streak
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm text-ink-muted">
              <TrendingUp className="size-4 text-primary" /> Accuracy trend (last 30 days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Sparkline values={series} className="h-20 w-full" />
          </CardContent>
        </Card>
      </div>

      {/* Per-subject breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="size-4 text-primary" /> Accuracy by subject
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {stats.perSubject.map((s) => {
            const meta = subjectMeta(s.slug);
            const isWeakest = stats.weakest?.slug === s.slug && stats.perSubject.length > 1;
            return (
              <div key={s.slug}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 font-medium text-ink">
                    {meta && <meta.icon className="size-4 text-ink-soft" />}
                    {s.title}
                    {isWeakest && <Badge variant="hard">Weakest</Badge>}
                  </span>
                  <span className="font-mono font-semibold tabular-nums text-ink-muted">
                    {s.accuracy}%
                  </span>
                </div>
                <Progress
                  value={s.accuracy}
                  barClassName={isWeakest ? "bg-amber-500" : undefined}
                />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Streak heatmap */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="size-4 text-primary" /> Activity (last 12 weeks)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <StreakHeatmap counts={counts} />
        </CardContent>
      </Card>

      {/* Recent attempts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent attempts</CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-2">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink/8 text-left text-xs uppercase tracking-wide text-ink-soft">
                  <th className="px-6 py-2 font-semibold">Test</th>
                  <th className="px-3 py-2 font-semibold">Date</th>
                  <th className="px-3 py-2 font-semibold">Score</th>
                  <th className="px-3 py-2 font-semibold">Accuracy</th>
                  <th className="px-3 py-2 font-semibold">Time</th>
                  <th className="px-6 py-2 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent.map((a) => (
                  <tr key={a.id} className="border-b border-ink/5 last:border-0">
                    <td className="px-6 py-3 font-medium text-ink">{a.testTitle}</td>
                    <td className="px-3 py-3 text-ink-muted">{fmtDate(a.date)}</td>
                    <td className="px-3 py-3 font-mono tabular-nums text-ink">
                      {a.score}/{a.total}
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={cn(
                          "font-mono font-semibold tabular-nums",
                          a.accuracy >= 70
                            ? "text-emerald-600"
                            : a.accuracy >= 50
                              ? "text-amber-600"
                              : "text-rose-600",
                        )}
                      >
                        {a.accuracy}%
                      </span>
                    </td>
                    <td className="px-3 py-3 font-mono tabular-nums text-ink-muted">
                      {a.timeSec != null ? formatClock(a.timeSec) : "—"}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <Link
                        href={`/tests/${a.testId}/result?attempt=${a.id}`}
                        className="font-semibold text-primary-dark hover:underline"
                      >
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
