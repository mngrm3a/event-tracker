import { StoreContext } from '@/context/StoreContext';
import { useToday } from '@/hooks/useToday';
import type { EventData, Job } from '@/providers/StoreProvider.types';
import {
  createCountsByPeriod,
  updateCountsByPeriod,
  getEndOfDay,
  getStartOfYear,
} from '@/providers/StoreProvider.utils';

import type { CountsByPeriod } from '@/types';
import { areDatesEqual } from '@/utils';
import {
  type ReactNode,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';

export const StoreProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [db, setDb] = useState<IDBDatabase | null>(null);
  const today = useToday();
  const [countsByPeriod, setCountsByPeriod] = useState<CountsByPeriod>(
    createCountsByPeriod(),
  );
  const jobQueue = useRef<Job[]>([]);
  const isProcessingQueue = useRef(false);

  // Open IndexedDB and create store/index
  useEffect(() => {
    let database: IDBDatabase | null = null;
    const request = indexedDB.open('EventsDB', 1);

    request.onerror = (e) => {
      const error = (e.target as IDBOpenDBRequest).error;
      throw new Error(
        `Failed to open database: ${error?.message || 'Unknown error'}`,
      );
    };

    request.onblocked = () => {
      throw new Error(
        'Database blocked - please close other tabs using this app',
      );
    };

    request.onupgradeneeded = (e) => {
      try {
        database = (e.target as IDBOpenDBRequest).result;
        const store = database.createObjectStore('events', {
          keyPath: 'id',
          autoIncrement: true,
        });
        store.createIndex('timestamp', 'timestamp');
      } catch (err) {
        throw new Error(`Database upgrade failed: ${(err as Error).message}`);
      }
    };

    request.onsuccess = (e) => {
      database = (e.target as IDBOpenDBRequest).result;
      database.onerror = (event) => {
        const errorEvent = event as Event & { target: { error: DOMException } };
        throw new Error(`Database error: ${errorEvent.target.error.message}`);
      };
      setDb(database);
    };

    return () => {
      if (database) {
        database.close();
        setDb(null);
      }
    };
  }, []);

  // Load all events within the given year up until the given date
  const loadEvents = useCallback(
    async (until: Date): Promise<EventData[]> => {
      if (!db) return [];

      return new Promise((resolve, reject) => {
        const untilAtStartOfYear = getStartOfYear(until).getTime();
        const untilAtEndOfDay = getEndOfDay(until).getTime();

        const tx = db.transaction('events', 'readonly');
        const store = tx.objectStore('events');
        const index = store.index('timestamp');
        const range = IDBKeyRange.bound(untilAtStartOfYear, untilAtEndOfDay);
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
          reject(e);
        };
      });
    },
    [db],
  );

  // Sequentially process jobQueue; each job updates countsByPeriod safely
  const processJobQueue = useCallback(async () => {
    if (isProcessingQueue.current) return;
    isProcessingQueue.current = true;

    while (jobQueue.current.length > 0) {
      const job = jobQueue.current.shift();
      if (!job) continue;

      try {
        if (job.type === 'merge') {
          setCountsByPeriod((prev) =>
            updateCountsByPeriod(structuredClone(prev), today, [job.payload]),
          );
        } else if (job.type === 'reload' && db) {
          const events = await loadEvents(job.payload);
          const newCountsByPeriod = updateCountsByPeriod(
            createCountsByPeriod(),
            job.payload,
            events,
          );
          setCountsByPeriod(newCountsByPeriod);
        }
      } catch (err) {
        throw new Error(`Failed to process job: ${err}`);
      }
    }

    isProcessingQueue.current = false;
  }, [db, today, loadEvents]);

  // Reload counts on db or today change
  useEffect(() => {
    if (!db) return;
    jobQueue.current.push({ type: 'reload', payload: today });
    void processJobQueue();
  }, [db, today, processJobQueue]);

  // Save a new event and enqueue the appropriate job
  const saveEvent = useCallback(
    async (date: Date, typ: string) => {
      if (!db) throw new Error('Database not initialized');

      const newEvent: Omit<EventData, 'id'> = {
        timestamp: date.getTime(),
        type: typ,
      };

      try {
        const tx = db.transaction('events', 'readwrite');
        const store = tx.objectStore('events');

        await new Promise<void>((resolve, reject) => {
          const request = store.add(newEvent);
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        });

        await new Promise<void>((resolve, reject) => {
          tx.oncomplete = () => resolve();
          tx.onerror = () => reject(tx.error);
        });

        // Decide job type based on date
        if (areDatesEqual(today, date)) {
          jobQueue.current.push({
            type: 'merge',
            payload: { ...newEvent, id: 0 },
          });
        } else {
          jobQueue.current.push({ type: 'reload', payload: date });
        }

        void processJobQueue();
      } catch (err) {
        throw new Error(`Failed to save event: ${(err as Error).message}`);
      }
    },
    [db, today, processJobQueue],
  );

  return (
    <StoreContext.Provider value={{ isReady: !!db, countsByPeriod, saveEvent }}>
      {children}
    </StoreContext.Provider>
  );
};
