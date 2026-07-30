import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge, difficultyVariant } from "@/components/ui/badge";
import { cutoffFor } from "@/lib/mpt";

export type TestCardData = {
  id: string;
  title: string;
  difficulty: string;
  durationMin: number;
  questionCount: number;
  subjectTitle?: string;
};

/** A row on the answer-booklet index: rule, title, figures, arrow. */
export function TestCard({ test }: { test: TestCardData }) {
  return (
    <Link
      href={`/tests/${test.id}`}
      className="group flex items-center gap-4 border-b border-border py-4 transition-colors duration-200 ease-[var(--ease-out-expo)] hover:bg-ink/[0.03]"
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h3 className="font-display text-base font-bold text-ink">{test.title}</h3>
          <Badge variant={difficultyVariant(test.difficulty)}>
            {test.difficulty.charAt(0) + test.difficulty.slice(1).toLowerCase()}
          </Badge>
        </div>
        <p className="mt-1 font-mono text-xs text-ink-soft tabular-nums">
          {test.questionCount} questions · {test.durationMin} min · pass line{" "}
          {cutoffFor(test.questionCount)}
          {test.subjectTitle ? ` · ${test.subjectTitle}` : ""}
        </p>
      </div>
      <ArrowRight className="size-4 shrink-0 text-ink-soft transition-transform duration-200 ease-[var(--ease-out-expo)] group-hover:translate-x-1 group-hover:text-ink" />
    </Link>
  );
}
