import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import { subjectMeta } from "@/lib/subjects";
import { cn } from "@/lib/utils";
import { EXAM } from "@/lib/mpt";

export function SubjectCard({
  slug,
  title,
  description,
  testCount,
  questionCount,
  mptMarks,
  accuracy,
}: {
  slug: string;
  title: string;
  description: string;
  testCount: number;
  questionCount: number;
  mptMarks?: number;
  accuracy?: number | null;
}) {
  const meta = subjectMeta(slug);
  const Icon = meta?.icon ?? FileText;

  return (
    <Link
      href={`/subjects/${slug}`}
      className="group flex flex-col bg-surface p-6 transition-colors duration-200 ease-[var(--ease-out-expo)] hover:bg-ink/[0.03]"
    >
      <div className="flex items-start justify-between gap-3">
        <span className={cn("flex size-10 items-center justify-center rounded-sm", meta?.accent ?? "bg-primary/10 text-primary")}>
          <Icon className="size-5" />
        </span>
        {typeof mptMarks === "number" && mptMarks > 0 && (
          <span className="font-mono text-xs text-ink-soft tabular-nums">
            {mptMarks} marks
          </span>
        )}
      </div>

      <h3 className="mt-4 font-display text-lg font-bold text-ink">{title}</h3>
      <p
        className={cn("mt-1.5 line-clamp-2 flex-1 text-sm text-ink-muted", slug === "urdu" && "urdu")}
        {...(slug === "urdu" ? { lang: "ur", dir: "rtl" } : {})}
      >
        {meta?.blurb ?? description}
      </p>

      <div className="mt-4 flex items-center gap-4 font-mono text-xs text-ink-soft tabular-nums">
        <span>{testCount} tests</span>
        <span>{questionCount.toLocaleString()} MCQs</span>
        {typeof accuracy === "number" && (
          <span className={accuracy >= EXAM.passPercent ? "text-primary" : "text-accent"}>
            {accuracy}% you
          </span>
        )}
      </div>

      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-ink">
        Practise
        <ArrowRight className="size-4 transition-transform duration-200 ease-[var(--ease-out-expo)] group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
