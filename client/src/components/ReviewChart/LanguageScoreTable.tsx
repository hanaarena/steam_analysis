import { ReviewScoreRating } from "@/utils/const";
import { Table, Group, Text, Avatar, Badge } from "@mantine/core";
import { useMemo, useState } from "react";

export default function LanguageScoreTable({ data }: { data: LangReview }) {
  const samples = Object.values(data);
  const rows = useMemo(
    () => (samples && samples.length ? samples : []),
    [samples]
  );
  // sort state: 'desc' | 'asc' | null
  const [sortDir, setSortDir] = useState<"asc" | "desc" | null>("desc");

  const sorted = useMemo(() => {
    if (!sortDir) return rows;
    return [...rows].sort((a, b) => {
      const aScore = a.positiveCount / (a.positiveCount + a.negativeCount);
      const bScore = b.positiveCount / (b.positiveCount + b.negativeCount);
      if (aScore === bScore) return 0;
      return sortDir === "asc" ? aScore - bScore : bScore - aScore;
    });
  }, [rows, sortDir]);

  const toggleSort = () => {
    setSortDir((s) => (s === "desc" ? "asc" : s === "asc" ? null : "desc"));
  };

  // detect rating text from ReviewScoreRating (approximate Steam-like categories)
  const handleRating = (r: IReviewsLangItem) => {
    let rating = "";

    const total = r.positiveCount + r.negativeCount;
    if (!total) {
      rating = "No reviews";
    } else {
      const pct = Math.round((r.positiveCount / total) * 100);
      if (pct >= 95) rating = ReviewScoreRating.S;
      else if (pct >= 80) rating = ReviewScoreRating.A;
      else if (pct >= 70) rating = ReviewScoreRating.B;
      else if (pct >= 40) rating = ReviewScoreRating.C;
      else if (pct >= 20) rating = ReviewScoreRating.D;
      else if (pct >= 5 && total < 500) rating = ReviewScoreRating.E;
      else rating = ReviewScoreRating.F;
    }
    return rating;
  };

  return (
    <div className="max-w-4xl bg-white rounded shadow overflow-hidden">
      <div className="p-2">
        <h3 className="text-lg font-semibold">Language review breakdown</h3>
      </div>

      <div className="p-2">
        <Table verticalSpacing="sm" className="min-w-full">
          <thead>
            <tr className="bg-green-600 text-white">
              <th className="pl-3">Portion</th>
              <th>Language</th>
              <th className="text-right">Total Reviews</th>
              <th className="text-right">Total Positive</th>
              <th className="text-right">Total Negative</th>
              <th className="text-right">
                <button
                  onClick={toggleSort}
                  className="flex items-center gap-2 text-sm px-2 py-1 rounded shadow-sm cursor-pointer"
                >
                  <span>Score</span>
                  <span className="text-xs">
                    {sortDir === "desc" ? "▼" : sortDir === "asc" ? "▲" : ""}
                  </span>
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => (
              <tr key={r.language} className="odd:bg-gray-50">
                <td className="pl-3 align-middle text-sm text-gray-700">
                  {r.positiveCount / (r.positiveCount + r.negativeCount)}
                </td>
                <td>
                  <Group className="flex items-center gap-3">
                    <Avatar color="blue" radius="sm" size={32}>
                      <span className="text-lg">
                        `${r.language.slice(0, 1).toLocaleLowerCase()}$
                        {r.language.slice(1)}`
                      </span>
                    </Avatar>
                    <div>
                      <Text size="sm" className="font-medium">
                        {r.language}
                      </Text>
                      {/* <Text size="xs" c="dimmed">
                        {r.supportLang ? (
                          <span className="text-green-600">✓</span>
                        ) : (
                          <span className="text-red-600">✖</span>
                        )}
                      </Text> */}
                    </div>
                  </Group>
                </td>
                <td className="text-right align-middle font-medium">
                  {r.positiveCount + r.negativeCount}
                </td>
                <td className="text-right align-middle text-green-700">
                  {r.positiveCount}
                </td>
                <td className="text-right align-middle text-red-600">
                  {r.negativeCount}
                </td>
                <td className="text-right align-middle">
                  <div className="flex flex-col items-end">
                    <div className="text-sm font-semibold">
                      {r.positiveCount / (r.positiveCount + r.negativeCount)}%
                    </div>
                    <Badge size="xs" className="mt-1 bg-gray-100 text-gray-700">
                      {handleRating(r)}
                    </Badge>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
