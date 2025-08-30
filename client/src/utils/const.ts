export const PlayHourLabels = {
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
}

// Sample data
export const Steam_Review_Data: RangeData[] = [
  {
    label: PlayHourLabels.Less10,
    values: {
      steamkey_positive: 4,
      purchased_positive: 0,
      steamkey_negative: 49,
      purchased_negative: 0,
    },
  },
  {
    label: PlayHourLabels.Minute10To30,
    values: {
      steamkey_positive: 26,
      purchased_positive: 84,
      steamkey_negative: 160,
      purchased_negative: 0,
    },
  },
  {
    label: PlayHourLabels.Minute30To60,
    values: {
      steamkey_positive: 227,
      purchased_positive: 126,
      steamkey_negative: 211,
      purchased_negative: 0,
    },
  },
  {
    label: PlayHourLabels.Hour1To2,
    values: {
      steamkey_positive: 457,
      purchased_positive: 140,
      steamkey_negative: 277,
      purchased_negative: 0,
    },
  },
  {
    label: PlayHourLabels.Hour2To5,
    values: {
      steamkey_positive: 80,
      purchased_positive: 185,
      steamkey_negative: 222,
      purchased_negative: 393,
    },
  },
  {
    label: PlayHourLabels.Hour5To10,
    values: {
      steamkey_positive: 138,
      purchased_positive: 149,
      steamkey_negative: 528,
      purchased_negative: 610,
    },
  },
  {
    label: PlayHourLabels.Hour10To20,
    values: {
      steamkey_positive: 177,
      purchased_positive: 130,
      steamkey_negative: 986,
      purchased_negative: 735,
    },
  },
  {
    label: PlayHourLabels.Hour20To50,
    values: {
      steamkey_positive: 356,
      purchased_positive: 185,
      steamkey_negative: 2109,
      purchased_negative: 1362,
    },
  },
  {
    label: PlayHourLabels.Hour50To100,
    values: {
      steamkey_positive: 245,
      purchased_positive: 154,
      steamkey_negative: 1732,
      purchased_negative: 1013,
    },
  },
  {
    label: PlayHourLabels.HourMore100,
    values: {
      steamkey_positive: 323,
      purchased_positive: 140,
      steamkey_negative: 2758,
      purchased_negative: 1388,
    },
  },
];
