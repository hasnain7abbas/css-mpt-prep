import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, FileText } from "lucide-react";
import { getSubjectWithTests } from "@/lib/queries";
import { subjectMeta } from "@/lib/subjects";
import { SubjectTestsBrowser } from "@/components/app/SubjectTestsBrowser";
import { EXAM } from "@/lib/mpt";
import { cn } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const meta = subjectMeta(slug);
  return { title: meta ? meta.title : "Section" };
}

const titleCase = (s: string) =>
  s.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

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
  const isUrduSection = slug === "urdu";

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
    <div className="space-y-8">
      <Link
        href="/subjects"
        className="inline-flex items-center gap-1 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
      >
        <ChevronLeft className="size-4" /> All sections
      </Link>

      <header>
        <div className="flex items-start gap-4">
          <span
            className={cn(
              "flex size-12 shrink-0 items-center justify-center rounded-sm",
              meta?.accent ?? "bg-primary/10 text-primary",
            )}
          >
            <Icon className="size-6" />
          </span>
          <div className="min-w-0">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-soft">
              {subject.mptMarks} of {EXAM.totalQuestions} marks in the paper
            </p>
            <h1 className="mt-1 font-display text-3xl font-bold text-ink">{subject.title}</h1>
            <p
              className={cn("mt-2 max-w-2xl text-ink-muted", isUrduSection && "urdu")}
              {...(isUrduSection ? { lang: "ur", dir: "rtl" } : {})}
            >
              {subject.description}
            </p>
          </div>
        </div>

        <dl className="mt-6 grid grid-cols-3 divide-x divide-border border-y border-border">
          <div className="py-4 pr-4">
            <dd className="font-mono text-2xl font-medium text-ink tabular-nums">
              {subject.questionCount.toLocaleString()}
            </dd>
            <dt className="mt-1 text-xs text-ink-muted">Questions</dt>
          </div>
          <div className="px-4 py-4">
            <dd className="font-mono text-2xl font-medium text-ink tabular-nums">
              {subject.tests.length}
            </dd>
            <dt className="mt-1 text-xs text-ink-muted">Tests</dt>
          </div>
          <div className="px-4 py-4">
            <dd className="font-mono text-2xl font-medium text-ink tabular-nums">
              {subject.drills.length}
            </dd>
            <dt className="mt-1 text-xs text-ink-muted">Topic drills</dt>
          </div>
        </dl>
      </header>

      {subject.drills.length > 0 && (
        <section>
          <h2 className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-soft">
            Topic drills · 15 questions each
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {subject.drills.map((d) => (
              <Link
                key={d.id}
                href={`/tests/${d.id}`}
                className="rounded-sm border border-ink/25 px-3 py-1.5 text-sm font-medium text-ink transition-colors hover:bg-ink/5"
              >
                {titleCase(d.topic ?? "general")}
                <span className="ml-2 font-mono text-xs text-ink-soft">{d.questionCount}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-4 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-soft">
          Practice tests
        </h2>
        <SubjectTestsBrowser tests={tests} />
      </section>
    </div>
  );
}
