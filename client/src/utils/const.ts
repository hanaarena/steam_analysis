export const PlaytimeLabels = {
  Less10: "< 10 minutes",
  Minute10To30: "10-30 minutes",
  Minute30To60: "0.5-1 hour",
  Hour1To2: "1-2 hours",
  Hour2To5: "2-5 hours",
  Hour5To10: "5-10 hours",
  Hour10To20: "10-20 hours",
  Hour20To50: "20-50 hours",
  Hour50To100: "50-100 hours",
  HourMore100: "100+ hours",
} as const;

export const PlaytimeNumber = {
  [PlaytimeLabels.Less10]: 10,
  [PlaytimeLabels.Minute10To30]: 30,
  [PlaytimeLabels.Minute30To60]: 60,
  [PlaytimeLabels.Hour1To2]: 120,
  [PlaytimeLabels.Hour2To5]: 300,
  [PlaytimeLabels.Hour5To10]: 600,
  [PlaytimeLabels.Hour10To20]: 1200,
  [PlaytimeLabels.Hour20To50]: 3000,
  [PlaytimeLabels.Hour50To100]: 6000,
  [PlaytimeLabels.HourMore100]: 6000,
};

export const RangeKeyLabel = {
  STEAMKEY_POSITIVE: "steamkey_positive",
  PURCHASED_POSITIVE: "purchased_positive",
  STEAMKEY_NEGATIVE: "steamkey_negative",
  PURCHASED_NEGATIVE: "purchased_negative",
} as const;

export const Gradients = [
  "from-indigo-500 to-blue-400",
  "from-pink-500 to-orange-400",
  "from-green-400 to-teal-500",
  "from-purple-500 to-pink-400",
  "from-yellow-400 to-orange-300",
  "from-sky-500 to-indigo-400",
];

export const SupportLanguages = ["english", "japanese", "schinese"];

export const ReviewScoreRating = {
  S: "Overwhelmingly Positive", // ≥95% (and ≥500 reviews)
  A: "Very Positive", // 80%−94% (and ≥50 reviews)
  B: "Mostly Positive", // 70%−79%
  C: "Mixed", // 40%−69%
  D: "Mostly Negative", // 20%−39%
  E: "Very Negative", // ≤19% (and ≥50 reviews)
  F: "Overwhelmingly Negative" // ≤19% (and ≥500 reviews)
};
