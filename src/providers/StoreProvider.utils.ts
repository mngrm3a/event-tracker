import type { EventData } from '@/providers/StoreProvider.types';
import type { CountsByPeriod } from '@/types';
import type { FixedLengthArray } from '@/types/FixedLengthArray';
import { areDatesEqual } from '@/utils';

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

export function updateCountsByPeriod(
  countsByPeriod: CountsByPeriod,
  until: Date,
  events: EventData[],
): CountsByPeriod {
  const untilAtEndOfDay = getEndOfDay(until);
  const untilYear = until.getFullYear();

  for (const event of events) {
    const eventDate = new Date(event.timestamp);
    const eventMonth = eventDate.getMonth();
    const eventYear = eventDate.getFullYear();

    if (areDatesEqual(until, eventDate)) {
      countsByPeriod.hourData[eventDate.getHours()]++;
    }

    if (eventDate >= getStartOfWeek(until) && eventDate <= untilAtEndOfDay) {
      const dayOffset = (eventDate.getDay() + 6) % 7;
      countsByPeriod.weekData[dayOffset]++;
    }

    if (eventMonth === until.getMonth() && eventYear === untilYear) {
      countsByPeriod.monthData[eventDate.getDate() - 1]++;
    }

    if (eventYear === untilYear) {
      countsByPeriod.yearData[eventMonth]++;
    }
  }

  countsByPeriod.todayData = countsByPeriod.hourData.reduce(
    (a: number, b: number) => a + b,
    0,
  );

  return countsByPeriod;
}

export function getEndOfDay(date: Date): Date {
  const newDate = new Date(date);
  newDate.setHours(23, 59, 59, 999);
  return newDate;
}

export function getStartOfWeek(date: Date): Date {
  const newDate = new Date(date); // clone so we don’t mutate original
  const day = newDate.getDay(); // 0 = Sunday, 1 = Monday, … 6 = Saturday
  const diff = day === 0 ? -6 : 1 - day; // shift Sunday to previous Monday
  newDate.setDate(newDate.getDate() + diff);
  newDate.setHours(0, 0, 0, 0); // normalize to midnight
  return newDate;
}

export function getStartOfYear(date: Date): Date {
  const newDate = new Date(date);
  newDate.setFullYear(newDate.getFullYear(), 0, 1);
  return newDate;
}
