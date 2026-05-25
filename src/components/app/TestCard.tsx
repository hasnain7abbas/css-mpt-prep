import Link from "next/link";
import { Clock, FileQuestion, Sparkles } from "lucide-react";
import { Badge, difficultyVariant } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type TestCardData = {
  id: string;
  title: string;
  difficulty: string;
  durationMin: number;
  questionCount: number;
  subjectTitle?: string;
};

export function TestCard({ test }: { test: TestCardData }) {
  return (
    <div className="flex flex-col rounded-2xl border border-ink/8 bg-surface p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          {test.subjectTitle && (
            <p className="text-xs font-medium text-ink-soft">{test.subjectTitle}</p>
          )}
          <h3 className="mt-0.5 font-display text-base font-bold text-ink">{test.title}</h3>
        </div>
        <Badge variant={difficultyVariant(test.difficulty)}>
          {test.difficulty.charAt(0) + test.difficulty.slice(1).toLowerCase()}
        </Badge>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-muted">
        <span className="inline-flex items-center gap-1.5">
          <FileQuestion className="size-3.5" /> {test.questionCount} Questions
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock className="size-3.5" /> {test.durationMin} min
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Sparkles className="size-3.5" /> Instant result + explanations
        </span>
      </div>

      <Link
        href={`/tests/${test.id}`}
        className={cn(buttonVariants({ size: "sm" }), "mt-4 w-full sm:w-auto sm:self-start")}
      >
        Start Test →
      </Link>
    </div>
  );
}
