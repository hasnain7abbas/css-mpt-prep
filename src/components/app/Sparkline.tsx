// Tiny dependency-free SVG sparkline. Values are 0..100 (accuracy %).
export function Sparkline({
  values,
  className,
}: {
  values: number[];
  className?: string;
}) {
  const w = 320;
  const h = 64;
  const pad = 4;

  if (values.length === 0) {
    return (
      <div className="flex h-16 items-center text-sm text-ink-soft">
        Not enough data yet.
      </div>
    );
  }

  const max = 100;
  const min = 0;
  const n = values.length;
  const x = (i: number) => (n === 1 ? w / 2 : pad + (i * (w - 2 * pad)) / (n - 1));
  const y = (v: number) => pad + (1 - (v - min) / (max - min)) * (h - 2 * pad);

  const points = values.map((v, i) => `${x(i)},${y(v)}`).join(" ");
  const area = `${pad},${h - pad} ${points} ${w - pad},${h - pad}`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className} preserveAspectRatio="none" role="img" aria-label="Accuracy trend">
      <polygon points={area} fill="var(--color-primary)" opacity="0.12" />
      <polyline
        points={points}
        fill="none"
        stroke="var(--color-primary)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      {n === 1 && <circle cx={x(0)} cy={y(values[0])} r="3" fill="var(--color-primary)" />}
    </svg>
  );
}
