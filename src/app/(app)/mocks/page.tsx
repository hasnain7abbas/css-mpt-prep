import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getMocks } from "@/lib/queries";
import { getCurrentUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db";
import { EXAM, cutoffFor, formatExamDate } from "@/lib/mpt";
import { MPT_WEIGHTING } from "@/lib/mpt";
import { SUBJECTS } from "@/lib/subjects";
import { cn, pct } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Full-length mocks",
  description: "200-question, 200-minute MPT simulations on the official FPSC weighting.",
};

export default async function MocksPage() {
  const user = await getCurrentUser();
  const mocks = await getMocks();

  const attempts = await prisma.attempt.findMany({
    where: { userId: user.id, submittedAt: { not: null }, test: { kind: "MOCK" } },
    orderBy: { submittedAt: "desc" },
    select: { testId: true, score: true, total: true, id: true },
  });
  const bestByTest = new Map<string, { score: number; total: number; id: string }>();
  for (const a of attempts) {
    const cur = bestByTest.get(a.testId);
    if (!cur || a.score > cur.score) bestByTest.set(a.testId, a);
  }

  const cutoff = cutoffFor(EXAM.totalQuestions);

  return (
    <div className="space-y-8">
      <header>
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-ink-muted">
          {EXAM.cycle} · {formatExamDate(EXAM.testDate)}
        </p>
        <div className="rule-double mt-3" />
        <h1 className="pt-6 font-display text-3xl font-bold text-ink sm:text-4xl">
          Full-length mocks
        </h1>
        <p className="mt-2 max-w-2xl text-ink-muted">
          {EXAM.totalQuestions} questions in {EXAM.durationMin} minutes, weighted exactly
          like the real paper. {cutoff} marks clears the line. The timer runs on the
          server, so closing the tab does not stop it.
        </p>
      </header>

      {/* Blueprint */}
      <section className="border border-border">
        <p className="border-b border-border px-5 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-soft">
          Every mock is built to this blueprint
        </p>
        <ul className="grid grid-cols-2 divide-x divide-y divide-border sm:grid-cols-4">
          {MPT_WEIGHTING.map((w) => (
            <li key={w.slug} className="px-5 py-4">
              <p className="font-mono text-xl font-medium text-ink tabular-nums">{w.marks}</p>
              <p className="mt-0.5 text-xs text-ink-muted">
                {SUBJECTS.find((s) => s.slug === w.slug)?.short ?? w.slug}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* Mock list */}
      {mocks.length === 0 ? (
        <p className="border border-dashed border-ink/25 p-10 text-center text-ink-muted">
          Mocks appear here once the question bank is seeded.
        </p>
      ) : (
        <div className="border-t border-border">
          {mocks.map((m) => {
            const best = bestByTest.get(m.id);
            const cleared = best ? best.score >= cutoffFor(best.total) : false;
            return (
              <Link
                key={m.id}
                href={`/tests/${m.id}`}
                className="group flex items-center gap-4 border-b border-border py-5 transition-colors duration-200 ease-[var(--ease-out-expo)] hover:bg-ink/[0.03]"
              >
                <span className="font-mono text-2xl font-medium text-ink-soft tabular-nums">
                  {String(m.number).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="font-display text-lg font-bold text-ink">{m.title}</h2>
                  <p className="mt-0.5 font-mono text-xs text-ink-soft tabular-nums">
                    {m.questionCount} questions · {m.durationMin} min
                    {m.attemptsCount > 0 ? ` · ${m.attemptsCount} attempts` : ""}
                  </p>
                </div>
                {best && (
                  <span
                    className={cn(
                      "shrink-0 text-right font-mono text-sm tabular-nums",
                      cleared ? "text-primary" : "text-accent",
                    )}
                  >
                    {best.score}/{best.total}
                    <span className="block text-xs text-ink-soft">
                      {pct(best.score, best.total)}%
                    </span>
                  </span>
                )}
                <ArrowRight className="size-4 shrink-0 text-ink-soft transition-transform duration-200 ease-[var(--ease-out-expo)] group-hover:translate-x-1 group-hover:text-ink" />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
