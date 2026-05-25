import { cn } from "@/lib/utils";

// GitHub-style attempt heatmap for the last 12 weeks (84 days).
export function StreakHeatmap({ counts }: { counts: Record<string, number> }) {
  const DAYS = 84;
  const today = new Date();
  const cells: { key: string; count: number }[] = [];

  for (let i = DAYS - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    cells.push({ key, count: counts[key] ?? 0 });
  }

  // chunk into weeks (columns of 7)
  const weeks: { key: string; count: number }[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  const level = (c: number) =>
    c === 0
      ? "bg-ink/8"
      : c === 1
        ? "bg-emerald-200"
        : c === 2
          ? "bg-emerald-400"
          : "bg-emerald-600";

  return (
    <div>
      <div className="flex gap-1 overflow-x-auto pb-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((cell) => (
              <div
                key={cell.key}
                title={`${cell.key}: ${cell.count} ${cell.count === 1 ? "test" : "tests"}`}
                className={cn("size-3.5 rounded-sm", level(cell.count))}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-1.5 text-xs text-ink-soft">
        <span>Less</span>
        <i className="size-3 rounded-sm bg-ink/8" />
        <i className="size-3 rounded-sm bg-emerald-200" />
        <i className="size-3 rounded-sm bg-emerald-400" />
        <i className="size-3 rounded-sm bg-emerald-600" />
        <span>More</span>
      </div>
    </div>
  );
}
