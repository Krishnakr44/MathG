/**
 * MathG — Statistics Utilities
 * Mean, median, mode, class intervals, frequency
 */

export interface ClassInterval {
  min: number;
  max: number;
  frequency: number;
  label: string;
}

export interface StatisticsSummary {
  mean: number;
  median: number;
  mode: number[];
  min: number;
  max: number;
  count: number;
}

/** Compute mean */
export function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

/** Compute median */
export function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  return sorted[mid];
}

/** Compute mode(s) */
export function mode(values: number[]): number[] {
  if (values.length === 0) return [];
  const freq = new Map<number, number>();
  for (const v of values) {
    freq.set(v, (freq.get(v) ?? 0) + 1);
  }
  const maxFreq = Math.max(...freq.values());
  return [...freq.entries()]
    .filter(([, f]) => f === maxFreq)
    .map(([v]) => v)
    .sort((a, b) => a - b);
}

/** Full statistics summary */
export function statisticsSummary(values: number[]): StatisticsSummary {
  return {
    mean: mean(values),
    median: median(values),
    mode: mode(values),
    min: values.length ? Math.min(...values) : 0,
    max: values.length ? Math.max(...values) : 0,
    count: values.length,
  };
}

/** Create class intervals from raw data */
export function createClassIntervals(
  values: number[],
  classWidth: number
): ClassInterval[] {
  if (values.length === 0 || classWidth <= 0) return [];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const intervals: ClassInterval[] = [];
  let low = Math.floor(min / classWidth) * classWidth;

  while (low < max || intervals.length === 0) {
    const high = low + classWidth;
    const freq = values.filter((v) => v >= low && v < high).length;
    intervals.push({
      min: low,
      max: high,
      frequency: freq,
      label: `${low}-${high}`,
    });
    low = high;
  }
  return intervals;
}

/** Frequency polygon points (midpoint, frequency) */
export function frequencyPolygonPoints(intervals: ClassInterval[]): [number, number][] {
  return intervals.map((i) => [(i.min + i.max) / 2, i.frequency]);
}
