export function exportCsv(header: string[], data: RangeData[]) {
  const rows = data.map((d) => [
    d.label,
    d.values.steamkey_positive,
    d.values.purchased_positive,
    d.values.steamkey_negative,
    d.values.purchased_negative,
  ]);
  return [header, ...rows].map((r) => r.join(",")).join("\n");
}