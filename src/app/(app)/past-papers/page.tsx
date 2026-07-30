import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Info } from "lucide-react";
import { getPastPapers } from "@/lib/queries";
import { cutoffFor } from "@/lib/mpt";

export const metadata: Metadata = {
  title: "Past papers",
  description: "Recalled FPSC MPT papers, answered and explained.",
};

export default async function PastPapersPage() {
  const papers = await getPastPapers();

  return (
    <div className="space-y-8">
      <header>
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-ink-muted">
          Recalled by candidates
        </p>
        <div className="rule-double mt-3" />
        <h1 className="pt-6 font-display text-3xl font-bold text-ink sm:text-4xl">Past papers</h1>
        <p className="mt-2 max-w-2xl text-ink-muted">
          Questions candidates remembered after sitting previous MPT papers, with the
          correct answer worked out and explained.
        </p>
      </header>

      <div className="flex gap-3 border-l-2 border-warning bg-warning/[0.07] px-4 py-3">
        <Info className="mt-0.5 size-4 shrink-0 text-warning" />
        <p className="text-sm leading-relaxed text-ink-muted">
          FPSC does not release official MPT papers. Everything here is reconstructed
          from candidate recollections published online, so treat it as representative
          of the paper&apos;s style and difficulty rather than a verbatim copy. Every
          answer has been independently re-checked.
        </p>
      </div>

      {papers.length === 0 ? (
        <p className="border border-dashed border-ink/25 p-10 text-center text-ink-muted">
          Past papers appear here once the bank is seeded.
        </p>
      ) : (
        <div className="border-t border-border">
          {papers.map((p) => (
            <Link
              key={p.id}
              href={`/tests/${p.id}`}
              className="group flex items-center gap-4 border-b border-border py-5 transition-colors duration-200 ease-[var(--ease-out-expo)] hover:bg-ink/[0.03]"
            >
              {p.year ? (
                <span className="font-mono text-2xl font-medium text-ink-soft tabular-nums">
                  {p.year}
                </span>
              ) : null}
              <div className="min-w-0 flex-1">
                <h2 className="font-display text-lg font-bold text-ink">{p.title}</h2>
                <p className="mt-0.5 font-mono text-xs text-ink-soft tabular-nums">
                  {p.questionCount} questions · {p.durationMin} min · pass line{" "}
                  {cutoffFor(p.questionCount)}
                </p>
              </div>
              <ArrowRight className="size-4 shrink-0 text-ink-soft transition-transform duration-200 ease-[var(--ease-out-expo)] group-hover:translate-x-1 group-hover:text-ink" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
