export default function LegendItem({
  color,
  label,
}: {
  color: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className={`${color} w-6 h-6 rounded-sm border`}></div>
      <div className="text-sm text-gray-700">{label}</div>
    </div>
  );
}
