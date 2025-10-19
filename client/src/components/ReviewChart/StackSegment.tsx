export default function StackSegment({
  value,
  total,
  color,
  showCount = false,
}: {
  value: number;
  total: number;
  color: string;
  showCount?: boolean;
}) {
  const width = total > 0 ? (value / total) * 100 : 0;
  if (value === 0) return <></>;
  return (
    <div
      className={`h-full ${color} flex items-center justify-center text-white text-xs font-semibold`}
      style={{ width: `${width}%` }}
    >
      {showCount && <span className="px-1">{value}</span>}
    </div>
  );
}
