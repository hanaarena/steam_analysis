/**
 * Group by years from item list
 * @param list {Array}
 * @param dateKey {string} - date time key of list's item
 * @returns Map({[year]: Array, [year2]: Array, ...})
 */
export function groupByYears<T extends Record<string, any>>(
  list: T[],
  dateKey: string
): Map<string, T[]> {
  if (!list.length) return new Map();
  const res = new Map<string, T[]>();
  let d: Date | null = null;

  for (const item of list) {
    const timestamp = item[dateKey];
    const tsStr = timestamp?.toString?.() ?? '';
    if (tsStr.length === 10) {
      // seconds
      d = new Date(Number(timestamp) * 1000);
    } else if (tsStr.length === 13) {
      // milliseconds
      d = new Date(Number(timestamp));
    } else {
      d = null;
    }

    if (d instanceof Date && !isNaN(d.getTime())) {
      const year = d.getFullYear().toString();
      const group = res.get(year);
      if (!group) {
        res.set(year, [item]);
      } else {
        group.push(item);
      }
    }
  }

  return res;
}
