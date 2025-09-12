import type { ChartData } from '@/types/ChartDataTypes';
import type { FixedLengthArray } from '@/types/FixedLengthArray';

export function createChartData(): ChartData {
  return {
    todayData: 0,
    hourData: createFixedArray(24, 0),
    weekData: createFixedArray(7, 0),
    monthData: createFixedArray(31, 0),
    yearData: createFixedArray(12, 0),
  };
}

function createFixedArray<T, N extends number>(
  length: N,
  value: T,
): FixedLengthArray<T, N> {
  return Array(length).fill(value) as FixedLengthArray<T, N>;
}
