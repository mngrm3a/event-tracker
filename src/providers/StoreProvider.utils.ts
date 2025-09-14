import type { EventData } from '@/providers/StoreProvider.types';
import type { CountsByPeriod } from '@/types';
import { createCountsByPeriod } from '@/utils';

/**
 * Fetch all events from IndexedDB that belong to the same year
 * as the given date, up to and including that entire day.
 *
 * @param {IDBDatabase} db - The opened IndexedDB database instance.
 * @param {Date} date - A reference date used to determine the year and cutoff point.
 * @returns {Promise<EventData[]>} A promise that resolves to all matching events.
 *
 * @remarks
 * - The query uses an IndexedDB index on `timestamp` (which must be stored as a number).
 * - The lower bound is set to January 1st of the given year at midnight.
 * - The upper bound is set to the *end of the given day* (23:59:59.999).
 *
 * ### Why "end of day" is needed
 * If `date` comes from a normalized source (e.g. `useDate()` returning midnight),
 * then simply using `date.getTime()` as the upper bound would exclude events
 * that occur later on the same day (e.g. an event at 14:29).
 *
 * By explicitly extending the cutoff to the last millisecond of the day,
 * we ensure that **all events of that day are included** in the result set.
 */
export function getEventsUpToDateInYear(
  db: IDBDatabase,
  date: Date,
): Promise<EventData[]> {
  return new Promise((resolve) => {
    const yearStart = new Date(date.getFullYear(), 0, 1).getTime();
    const endOfDay = new Date(date).setHours(23, 59, 59, 999);

    const tx = db.transaction('events', 'readonly');
    const store = tx.objectStore('events');
    const index = store.index('timestamp');
    const range = IDBKeyRange.bound(yearStart, endOfDay);
    const request = index.openCursor(range);
    const results: EventData[] = [];

    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest).result;
      if (cursor) {
        results.push(cursor.value);
        cursor.continue();
      } else {
        resolve(results);
      }
    };

    request.onerror = (e) => {
      console.error('Cursor error', e);
      resolve([]);
    };
  });
}

export function computeCountsByPeriod(
  dateTime: Date,
  events: EventData[],
): CountsByPeriod {
  const countsByPeriod = createCountsByPeriod();
  updateCountsByPeriod(countsByPeriod, dateTime, events);
  return countsByPeriod;
}

export function updateCountsByPeriod(
  countsByPeriod: CountsByPeriod,
  dateTime: Date,
  events: EventData[],
):CountsByPeriod {
  const date = dateTime.getDate();
  const weekStart = getMonday(dateTime);
  const month = dateTime.getMonth();
  const year = dateTime.getFullYear();

  for (const event of events) {
    const eDate = new Date(event.timestamp);
    const eHour = eDate.getHours();

    // Today
    if (
      eDate.getDate() === date &&
      eDate.getMonth() === month &&
      eDate.getFullYear() === year
    ) {
      countsByPeriod.hourData[eHour]++;
    }

    // Week
    if (eDate >= weekStart && eDate <= dateTime) {
      const dayOffset = (eDate.getDay() + 6) % 7; // Monday=0
      countsByPeriod.weekData[dayOffset]++;
    }

    // Month
    if (eDate.getMonth() === month && eDate.getFullYear() === year) {
      countsByPeriod.monthData[eDate.getDate() - 1]++;
    }

    // Year
    if (eDate.getFullYear() === year) {
      countsByPeriod.yearData[eDate.getMonth()]++;
    }
  }

  countsByPeriod.todayData = countsByPeriod.hourData.reduce(
    (a: number, b: number) => a + b,
    0,
  );

  return countsByPeriod;
}

function getMonday(date: Date): Date {
  const d = new Date(date); // clone so we don’t mutate original
  const day = d.getDay(); // 0 = Sunday, 1 = Monday, … 6 = Saturday
  const diff = day === 0 ? -6 : 1 - day; // shift Sunday to previous Monday
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0); // normalize to midnight
  return d;
}
