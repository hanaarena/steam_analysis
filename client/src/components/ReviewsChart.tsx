import { Steam_Review_Data } from "@/utils/const";
import { exportCsv } from "@/utils/fs";

const COLORS: Record<RangeKey, string> = {
  steamkey_positive: "bg-green-600",
  purchased_positive: "bg-green-400",
  steamkey_negative: "bg-red-900",
  purchased_negative: "bg-red-600",
};

function sumValues(values: Record<RangeKey, number>) {
  return Object.values(values).reduce((s, v) => s + v, 0);
}

export default function ReviewsChart({
  data = Steam_Review_Data,
}: {
  data?: RangeData[];
}) {
  const maxTotal = Math.max(...data.map((d) => sumValues(d.values)));

  const downloadCsv = () => {
    const csv = exportCsv(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    // TODO: combine with game ID
    a.download = "steam_{game_id}reviews_by_hours.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mb-6">
      <header className="mb-4">
        <h1 className="text-2xl font-extrabold">
          Steam Reviews by Hours Played
        </h1>
      </header>

      <div className="flex items-start gap-6">
        <div className="flex-1">
          <div className="flex gap-4 items-center mb-6">
            {Object.keys(COLORS).map((c) => (
              <LegendItem
                key={`legend_${c}`}
                color={COLORS[c as RangeKey]}
                label={
                  c.replace("_", " ").charAt(0).toUpperCase() +
                  c.replace("_", " ").slice(1)
                }
              />
            ))}
          </div>

          <div className="bg-gray-200 p-4 rounded">
            <h2 className="font-semibold mb-3">All Reviewers</h2>
            <div className="space-y-3">
              {data.map((row) => {
                return (
                  <div key={row.label} className="flex items-center gap-4">
                    <div className="w-36 text-sm text-right pr-4 text-gray-700">
                      {row.label}
                    </div>

                    <div className="flex-1 bg-gray-300 rounded h-10 relative overflow-hidden">
                      <div className="absolute inset-y-0 left-0 flex">
                        {Object.keys(COLORS).map((c) => (
                          <StackSegment
                            key={`segment_${c}`}
                            value={row.values[c as RangeKey]}
                            total={maxTotal}
                            color={c}
                            showCount
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 text-xs text-gray-700">
              Load Progress: 17,363/307,029
            </div>

            <div className="mt-4 flex items-center gap-4">
              <button
                onClick={downloadCsv}
                className="px-4 py-2 border rounded bg-white text-sm shadow-sm hover:bg-gray-50"
              >
                Download CSV
                <div className="text-xs text-gray-500">All Language</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`${color} w-6 h-6 rounded-sm border`}></div>
      <div className="text-sm text-gray-700">{label}</div>
    </div>
  );
}

function StackSegment({
  value,
  total,
  color,
  showCount,
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
