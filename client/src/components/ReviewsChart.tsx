import { Steam_Review_Data } from "@/utils/const";
import { exportCsv } from "@/utils/fs";
import { get } from "@lanz/utils";
import { useCallback, useEffect, useState } from "react";

const COLORS: Record<RangeKey, string> = {
  steamkey_positive: "bg-green-800",
  purchased_positive: "bg-green-500",
  steamkey_negative: "bg-red-800",
  purchased_negative: "bg-red-400",
};

// review fetch loop times for each languages
const LoopCount = 2;

function sumValues(values: Record<RangeKey, number>) {
  return Object.values(values).reduce((s, v) => s + v, 0);
}

export default function ReviewsChart({
  id,
  data = Steam_Review_Data,
}: {
  id: number | string;
  data?: RangeData[];
}) {
  const maxTotal = Math.max(...data.map((d) => sumValues(d.values)));
  const [summary, setSummary] = useState<IReviewSummary>(
    {} as unknown as IReviewSummary
  );
  const [list, setList] = useState<IReviewsList["reviews"]>([]);
  // TODO: language mapping for reviews data
  const [cursor, setCursor] = useState("*");

  const getReviews = useCallback(async () => {
    let localCursor = cursor;

    for (let i = 0; i < LoopCount; i++) {
      console.warn("kekek localCursor", localCursor);
      try {
        const res = await get<IReviewsList>(
          `/api/game/reviews/${id}?cursor=${encodeURIComponent(localCursor)}`
        );

        if (res && Array.isArray(res.reviews) && res.reviews.length > 0) {
          setList((prev) => [...prev, ...res.reviews]);
        }

        // if server returned a new cursor, use it for the next iteration
        if (res && res.cursor && res.reviews.length) {
          localCursor = res.cursor;
          setCursor(res.cursor);
        } else {
          break;
        }
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
        break;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    function getReviewSummary() {
      get<IReviewSummary>(`/api/game/reviews/summary/${id}`).then((res) => {
        setSummary(res);
      });
    }

    getReviewSummary();
    setCursor("*");
    setList([]);
    getReviews();
  }, [id, getReviews]);

  const downloadCsv = () => {
    const csv = exportCsv(["hours", ...Object.keys(COLORS)], data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `steam_${id}_reviews_by_hours.csv`;
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

          <div className="bg-gray-50 p-4 rounded shadow">
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
                        {Object.entries(COLORS).map(([key, color]) => (
                          <StackSegment
                            key={`segment_${key}`}
                            value={row.values[key as RangeKey]}
                            total={maxTotal}
                            color={color}
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
              Load Progress: {list.length}/{summary.total_reviews}
            </div>

            <div className="mt-4 flex items-center gap-4">
              <button
                onClick={downloadCsv}
                className="px-4 py-2 border rounded bg-white text-sm shadow-sm hover:bg-gray-50 cursor-pointer"
              >
                Download CSV
                <div className="text-xs text-gray-500">All Language</div>
              </button>
              <button
                onClick={getReviews}
                className="px-4 py-2 border rounded bg-white text-sm shadow-sm hover:bg-gray-50 cursor-pointer"
              >
                Load Reviews
                <div className="text-xs text-gray-500">
                  Fetch next {LoopCount} pages
                </div>
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
