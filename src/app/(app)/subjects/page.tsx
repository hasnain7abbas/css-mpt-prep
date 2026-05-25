import type { Metadata } from "next";
import { getSubjectsOverview } from "@/lib/queries";
import { SubjectCard } from "@/components/app/SubjectCard";

export const metadata: Metadata = { title: "Subjects" };

export default async function SubjectsPage() {
  const subjects = await getSubjectsOverview();
  const totalTests = subjects.reduce((n, s) => n + s.testCount, 0);
  const totalQs = subjects.reduce((n, s) => n + s.questionCount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">Subjects</h1>
        <p className="mt-1 text-ink-muted">
          {subjects.length} subjects · {totalTests} tests · {totalQs} MCQs. Pick a
          subject to see its tests.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {subjects.map((s) => (
          <SubjectCard key={s.slug} {...s} />
        ))}
      </div>
    </div>
  );
}
