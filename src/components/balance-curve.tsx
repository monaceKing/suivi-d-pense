export function BalanceCurve({
  points,
  label,
}: {
  points: { day: number; value: number }[];
  label: string;
}) {
  const width = 320;
  const height = 120;
  const padding = 8;

  const values = points.map((p) => p.value);
  const min = Math.min(...values, 0);
  const max = Math.max(...values, 1);
  const range = max - min || 1;

  const toX = (day: number) =>
    padding + ((day - 1) / (points.length - 1 || 1)) * (width - padding * 2);
  const toY = (value: number) =>
    height - padding - ((value - min) / range) * (height - padding * 2);

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${toX(p.day)} ${toY(p.value)}`)
    .join(" ");
  const areaPath = `${linePath} L ${toX(points[points.length - 1]?.day ?? 1)} ${height - padding} L ${toX(1)} ${height - padding} Z`;

  return (
    <div>
      <p className="text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
        {label}
      </p>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        style={{ height: "auto" }}
      >
        <path d={areaPath} fill="var(--accent-gold)" opacity={0.12} />
        <path
          d={linePath}
          fill="none"
          stroke="var(--accent-gold)"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
