export function exportCsv(data: RangeData[]) {
  const header = [
    "range",
    "steamkey_positive",
    "purchased_positive",
    "steamkey_negative",
    "purchased_negative",
  ];
  const rows = data.map((d) => [
    d.label,
    d.values.steamkey_positive,
    d.values.purchased_positive,
    d.values.steamkey_negative,
    d.values.purchased_negative,
  ]);
  return [header, ...rows].map((r) => r.join(",")).join("\n");
}