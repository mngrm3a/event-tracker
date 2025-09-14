import { StoreContext } from '@/context/StoreContext';
import { useCurrentDate } from '@/hooks/useCurrentDate';
import type { EventData } from '@/providers/StoreProvider.types';
import {
  computeCountsByPeriod,
  getEventsUpToDateInYear,
  updateCountsByPeriod,
} from '@/providers/StoreProvider.utils';
import { createCountsByPeriod } from '@/utils';
import type { CountsByPeriod } from '@/types';
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
  const [countsByPeriod, setCountsByPeriod] = useState<CountsByPeriod>(
    createCountsByPeriod(),
  );
  const [isReady, setIsReady] = useState(false);
  const currentDate = useCurrentDate();
  const jobQueue = useRef<Job[]>([]);
  const isProcessingQueue = useRef(false);

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
            updateCountsByPeriod(structuredClone(prev), currentDate, [
              job.payload,
            ]),
          );
        } else if (job.type === 'reload' && db) {
          const events = await getEventsUpToDateInYear(db, job.payload);
          setCountsByPeriod(computeCountsByPeriod(job.payload, events));
        }
      } catch (err) {
        throw new Error(`Failed to process job: ${err}`);
      }
    }

    isProcessingQueue.current = false;
  }, [currentDate, db]);

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
      setIsReady(true);
    };

    return () => {
      if (database) {
        database.close();
        setDb(null);
        setIsReady(false);
      }
    };
  }, []);

  // Reload counts on db or currentDate change
  useEffect(() => {
    if (!db) return;
    jobQueue.current.push({ type: 'reload', payload: currentDate });
    void processJobQueue();
  }, [db, currentDate, processJobQueue]);

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
        const isCurrentDate =
          date.getFullYear() === currentDate.getFullYear() &&
          date.getMonth() === currentDate.getMonth() &&
          date.getDate() === currentDate.getDate();

        if (isCurrentDate) {
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
    [db, currentDate, processJobQueue],
  );

  return (
    <StoreContext.Provider value={{ isReady, countsByPeriod, saveEvent }}>
      {children}
    </StoreContext.Provider>
  );
};

type Job =
  | { type: 'merge'; payload: EventData }
  | { type: 'reload'; payload: Date };
