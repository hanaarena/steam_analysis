type RangeKey =
  | "steamkey_positive"
  | "purchased_positive"
  | "steamkey_negative"
  | "purchased_negative";

type RangeData = {
  label: string;
  values: Record<RangeKey, number>;
};