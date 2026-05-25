import { type LucideIcon, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  icon: Icon,
  value,
  label,
  trend,
  accent = "bg-primary-light text-primary-dark",
}: {
  icon: LucideIcon;
  value: string | number;
  label: string;
  trend?: string;
  accent?: string;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div className={cn("flex size-10 items-center justify-center rounded-xl", accent)}>
          <Icon className="size-5" />
        </div>
        {trend && (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
            <TrendingUp className="size-3" />
            {trend}
          </span>
        )}
      </div>
      <p className="mt-4 font-mono text-3xl font-bold tabular-nums text-ink">{value}</p>
      <p className="mt-0.5 text-sm text-ink-muted">{label}</p>
    </Card>
  );
}
