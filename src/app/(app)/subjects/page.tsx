import type { Metadata } from "next";
import { getSubjectsOverview } from "@/lib/queries";
import { SubjectCard } from "@/components/app/SubjectCard";
import { EXAM } from "@/lib/mpt";

export const metadata: Metadata = { title: "Sections" };

export default async function SubjectsPage() {
  const subjects = await getSubjectsOverview();
  const totalTests = subjects.reduce((n, s) => n + s.testCount, 0);
  const totalQs = subjects.reduce((n, s) => n + s.questionCount, 0);

  return (
    <div className="space-y-8">
      <header>
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-ink-muted">
          {EXAM.totalQuestions} marks · seven sections
        </p>
        <div className="rule-double mt-3" />
        <h1 className="pt-6 font-display text-3xl font-bold text-ink sm:text-4xl">Sections</h1>
        <p className="mt-2 text-ink-muted">
          {totalTests} practice tests · {totalQs.toLocaleString()} questions. Marks shown
          are the official FPSC weighting for the {EXAM.cycle} paper.
        </p>
      </header>

      <div className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
        {subjects.map((s) => (
          <SubjectCard key={s.slug} {...s} />
        ))}
      </div>
    </div>
  );
}
