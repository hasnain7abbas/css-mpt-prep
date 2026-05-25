import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, FileText, Layers } from "lucide-react";
import { getSubjectWithTests } from "@/lib/queries";
import { subjectMeta } from "@/lib/subjects";
import { SubjectTestsBrowser } from "@/components/app/SubjectTestsBrowser";
import { cn } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const meta = subjectMeta(slug);
  return { title: meta ? meta.title : "Subject" };
}

export default async function SubjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const subject = await getSubjectWithTests(slug);
  if (!subject) notFound();

  const meta = subjectMeta(slug);
  const Icon = meta?.icon ?? FileText;

  const tests = subject.tests.map((t) => ({
    id: t.id,
    title: t.title,
    difficulty: t.difficulty,
    durationMin: t.durationMin,
    questionCount: t.questionCount,
    number: t.number,
    attemptsCount: t.attemptsCount,
  }));

  return (
    <div className="space-y-6">
      <Link
        href="/subjects"
        className="inline-flex items-center gap-1 text-sm font-medium text-ink-muted hover:text-ink"
      >
        <ChevronLeft className="size-4" /> All subjects
      </Link>

      <div className="flex items-start gap-4">
        <div
          className={cn(
            "flex size-14 shrink-0 items-center justify-center rounded-2xl",
            meta?.accent ?? "bg-primary-light text-primary-dark",
          )}
        >
          <Icon className="size-7" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">
            {subject.title}
          </h1>
          <p className="mt-1 max-w-xl text-ink-muted">{subject.description}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-muted px-3 py-1 text-xs font-semibold text-ink-muted ring-1 ring-ink/10">
              <Layers className="size-3.5" /> {subject.tests.length} tests
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-muted px-3 py-1 text-xs font-semibold text-ink-muted ring-1 ring-ink/10">
              <FileText className="size-3.5" /> {subject.questionCount} MCQs
            </span>
          </div>
        </div>
      </div>

      <SubjectTestsBrowser tests={tests} />
    </div>
  );
}
