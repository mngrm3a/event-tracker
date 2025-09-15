import type { CountsByPeriod } from '@/types/CountsByPeriodTypes';
import type { FixedLengthArray } from '@/types/FixedLengthArray';

export function createCountsByPeriod(): CountsByPeriod {
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

export function areDatesEqual(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}
