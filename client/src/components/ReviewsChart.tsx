import { PlaytimeLabels, PlaytimeNumber, RangeKeyLabel } from "@/utils/const";
import { exportCsv } from "@/utils/fs";
import { get } from "@lanz/utils";
import { useCallback, useEffect, useState } from "react";

type RangeLabelValuesKey = (typeof RangeKeyLabel)[keyof typeof RangeKeyLabel];
// union of strings like "< 10 minutes" | "10-30 minutes" | ...
type PlaytimeLabel = (typeof PlaytimeLabels)[keyof typeof PlaytimeLabels];
// "steamkey_positive" | "purchased_positive" | ...
type RangeKey = (typeof RangeKeyLabel)[keyof typeof RangeKeyLabel];
// inner row: all RangeKey entries -> number
type RangeRow = { [K in RangeKey]: number };
// top-level data: for every PlaytimeLabel, store a RangeRow
type RangeData = { [P in PlaytimeLabel]: RangeRow };

// range data type's segment colors
const COLORS: Record<RangeLabelValuesKey, string> = {
  [RangeKeyLabel.STEAMKEY_POSITIVE]: "bg-green-800",
  [RangeKeyLabel.PURCHASED_POSITIVE]: "bg-green-500",
  [RangeKeyLabel.STEAMKEY_NEGATIVE]: "bg-red-800",
  [RangeKeyLabel.PURCHASED_NEGATIVE]: "bg-red-400",
};
// review fetch loop times for each languages
const LoopCount = 2;

// initialize range data with all playtime labels and segments
const initRangeData: RangeData = Object.fromEntries(
  Object.values(PlaytimeLabels).map((label) => [
    label,
    Object.fromEntries(
      Object.values(RangeKeyLabel).map((k) => [k, 0])
    ) as Record<RangeLabelValuesKey, number>,
  ])
) as unknown as RangeData;
// build ordered buckets: { label, limit } where limit may be undefined => Infinity
const buckets = Object.values(PlaytimeLabels).map((label) => ({
  label,
  limit: PlaytimeNumber[label as PlaytimeLabel] ?? Infinity,
}));

export default function ReviewsChart({ id }: { id: number | string }) {
  const [summary, setSummary] = useState<IReviewSummary>(
    {} as unknown as IReviewSummary
  );
  const [list, setList] = useState<IReviewsListItem[]>([]);
  const [rangeData, setRangeData] = useState<RangeData>(initRangeData);
  // TODO: language mapping for reviews data
  const [cursor, setCursor] = useState("*");

  // loop reviews list to count range data
  const splitPurchasedTypeByPlaytime = (
    list: IReviewsListItem[],
    rawData: RangeData
  ) => {
    // deep-clone rangeData
    const localRangeData = Object.fromEntries(
      Object.entries(rawData || initRangeData).map(([k, v]) => [k, { ...v }])
    ) as RangeData;

    // find bucket label for a given playtime
    function bucketForPlaytime(playtime: number | undefined) {
      if (playtime == null || Number.isNaN(playtime)) {
        return buckets[0].label;
      }
      for (const b of buckets) {
        if (playtime < b.limit) return b.label;
      }
      // if none matched, return the last label
      return buckets[buckets.length - 1].label;
    }

    // compute the range key to increment based on steam_purchase and voted_up
    function rangeKeyFor(steamPurchase?: boolean, votedUp?: boolean) {
      if (steamPurchase) {
        return votedUp
          ? RangeKeyLabel.PURCHASED_POSITIVE
          : RangeKeyLabel.PURCHASED_NEGATIVE;
      }
      return votedUp
        ? RangeKeyLabel.STEAMKEY_POSITIVE
        : RangeKeyLabel.STEAMKEY_NEGATIVE;
    }

    for (const item of list) {
      const { author, steam_purchase, voted_up } = item || {};
      const playtime = author?.playtime_forever;
      const label = bucketForPlaytime(playtime);
      const key = rangeKeyFor(steam_purchase, voted_up) as RangeLabelValuesKey;

      if (!localRangeData[label] || !(key in localRangeData[label])) {
        continue;
      }

      localRangeData[label][key] = (localRangeData[label][key] ?? 0) + 1;
    }

    return localRangeData;
  };

  const getReviews = useCallback(async () => {
    let localCursor = cursor;
    let resultRangeData = null as unknown as RangeData;
    const localReviews: IReviewsListItem[] = [];

    for (let i = 0; i < LoopCount; i++) {
      try {
        const res = await get<IReviewsList>(
          `/api/game/reviews/${id}?cursor=${encodeURIComponent(localCursor)}`
        );

        if (res && Array.isArray(res.reviews) && res.reviews.length > 0) {
          localReviews.push(...res.reviews);
        }

        // if server returned a new cursor, use it for the next iteration
        if (res && res.cursor && res.reviews.length) {
          // update range data
          resultRangeData = splitPurchasedTypeByPlaytime(
            res.reviews,
            resultRangeData
          );
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

    console.warn("kekek localReviews", localReviews);
    setList(localReviews);
    setRangeData(resultRangeData);
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
    const dataArray = Object.entries(rangeData).map(([label, values]) => ({
      label,
      values,
    }));
    const csv = exportCsv(["hours", ...Object.keys(COLORS)], dataArray);
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
                color={COLORS[c as RangeLabelValuesKey]}
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
              {Object.entries(rangeData).map(([label, data]) => (
                <div key={label} className="flex items-center gap-4">
                  <div className="w-36 text-sm text-right pr-4 text-gray-700">
                    {label}
                  </div>

                  <div className="flex-1 bg-gray-300 rounded h-10 relative overflow-hidden">
                    <div className="absolute inset-y-0 left-0 flex w-full">
                      {Object.entries(COLORS).map(([key, color]) => (
                        <StackSegment
                          key={`segment_${key}_${label}`}
                          value={data[key as RangeLabelValuesKey] ?? 0}
                          total={list.length}
                          color={color}
                          showCount
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
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
