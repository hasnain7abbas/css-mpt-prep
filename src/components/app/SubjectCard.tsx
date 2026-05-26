import Link from "next/link";
import { ArrowRight, FileText, Layers } from "lucide-react";
import { subjectMeta } from "@/lib/subjects";
import { cn } from "@/lib/utils";

export function SubjectCard({
  slug,
  title,
  description,
  testCount,
  questionCount,
}: {
  slug: string;
  title: string;
  description: string;
  testCount: number;
  questionCount: number;
}) {
  const meta = subjectMeta(slug);
  const Icon = meta?.icon ?? FileText;

  return (
    <Link
      href={`/subjects/${slug}`}
      className="group flex flex-col rounded-2xl border border-ink/8 bg-surface p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className={cn("flex size-11 items-center justify-center rounded-xl", meta?.accent ?? "bg-primary-light text-primary-dark dark:bg-primary/15 dark:text-emerald-300")}>
        <Icon className="size-5" />
      </div>
      <h3 className="mt-4 font-display text-lg font-bold text-ink">{title}</h3>
      <p className="mt-1.5 line-clamp-2 flex-1 text-sm text-ink-muted">{description}</p>
      <div className="mt-4 flex items-center gap-4 text-xs font-medium text-ink-soft">
        <span className="inline-flex items-center gap-1.5">
          <Layers className="size-3.5" /> {testCount} {testCount === 1 ? "test" : "tests"}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <FileText className="size-3.5" /> {questionCount} MCQs
        </span>
      </div>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary-dark">
        Practice
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
