"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TestCard, type TestCardData } from "@/components/app/TestCard";

type BrowserTest = TestCardData & {
  number: number;
  attemptsCount: number;
};

type DifficultyFilter = "ALL" | "EASY" | "MEDIUM" | "HARD";
type Sort = "newest" | "attempted" | "hardest";

const DIFF_RANK: Record<string, number> = { EASY: 0, MEDIUM: 1, HARD: 2 };

/** Debounce a fast-changing value (used for the 250ms search delay). */
function useDebounced<T>(value: T, ms: number) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setV(value), ms);
    return () => clearTimeout(id);
  }, [value, ms]);
  return v;
}

const selectClass =
  "h-11 rounded-xl border border-ink/15 bg-surface px-3 text-sm font-medium text-ink shadow-sm focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30";

export function SubjectTestsBrowser({ tests }: { tests: BrowserTest[] }) {
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState<DifficultyFilter>("ALL");
  const [sort, setSort] = useState<Sort>("newest");
  const debouncedQuery = useDebounced(query, 250);

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    let out = tests.filter((t) => {
      const matchesQuery = q === "" || t.title.toLowerCase().includes(q);
      const matchesDiff = difficulty === "ALL" || t.difficulty === difficulty;
      return matchesQuery && matchesDiff;
    });

    out = [...out].sort((a, b) => {
      if (sort === "attempted") return b.attemptsCount - a.attemptsCount;
      if (sort === "hardest")
        return (DIFF_RANK[b.difficulty] ?? 1) - (DIFF_RANK[a.difficulty] ?? 1);
      return b.number - a.number; // newest = highest test number first
    });
    return out;
  }, [tests, debouncedQuery, difficulty, sort]);

  const hasFilters = query !== "" || difficulty !== "ALL" || sort !== "newest";

  function reset() {
    setQuery("");
    setDifficulty("ALL");
    setSort("newest");
  }

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-soft" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tests…"
            className="pl-10"
            aria-label="Search tests"
          />
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="size-4 shrink-0 text-ink-soft" />
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as DifficultyFilter)}
            className={selectClass}
            aria-label="Filter by difficulty"
          >
            <option value="ALL">All difficulty</option>
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className={selectClass}
            aria-label="Sort tests"
          >
            <option value="newest">Newest</option>
            <option value="attempted">Most attempted</option>
            <option value="hardest">Hardest</option>
          </select>
        </div>
      </div>

      {/* Results */}
      {filtered.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((t) => (
            <TestCard key={t.id} test={t} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink/15 bg-surface p-12 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-surface-muted text-ink-soft">
            <X className="size-6" />
          </div>
          <p className="mt-4 font-semibold text-ink">No tests match your filters.</p>
          <p className="mt-1 text-sm text-ink-muted">
            Try a different search or difficulty.
          </p>
          {hasFilters && (
            <Button variant="outline" size="sm" className="mt-4" onClick={reset}>
              Reset filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
