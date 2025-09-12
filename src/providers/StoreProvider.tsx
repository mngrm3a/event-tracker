import { StoreContext } from '@/context/StoreContext';
import { useCurrentDate } from '@/hooks/useCurrentDate';
import type { EventData } from '@/providers/StoreProvider.types';
import {
  computeChartData,
  getEventsUpToDateInYear,
} from '@/providers/StoreProvider.utils';
import { createChartData } from '@/utils';
import type { ChartData } from '@/types';
import { type ReactNode, useState, useEffect, useCallback } from 'react';

export const StoreProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [db, setDb] = useState<IDBDatabase | null>(null);
  const [chartData, setChartData] = useState<ChartData>(createChartData());
  const [isReady, setIsReady] = useState(false);
  const currentDate = useCurrentDate();

  // Open IndexedDB and create index if needed
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

    // Cleanup function that runs when component unmounts
    return () => {
      if (database) {
        database.close();
        setDb(null);
        setIsReady(false);
      }
    };
  }, []);

  // Reload chart data whenever db or date changes
  useEffect(() => {
    if (!db) return;

    getEventsUpToDateInYear(db, currentDate)
      .then((events) => {
        setChartData(computeChartData(events, currentDate));
      })
      .catch((err) => {
        throw new Error(`Failed to load events: ${err.message}`);
      });
  }, [db, currentDate]);

  // Save a new event and recompute chart data
  const saveEvent = useCallback(
    async (date: Date, typ: string) => {
      if (!db) {
        throw new Error('Database not initialized');
      }

      try {
        const tx = db.transaction('events', 'readwrite');
        const store = tx.objectStore('events');

        const newEvent: Omit<EventData, 'id'> = {
          timestamp: date.getTime(),
          type: typ,
        };

        await new Promise<void>((resolve, reject) => {
          const request = store.add(newEvent);
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        });

        /* TODO: optimise by just adding the new event to chartData if `date`
         * equals `lastUpdated` in `chartData`
         */
        const events = await getEventsUpToDateInYear(db, date);
        setChartData(computeChartData(events, date));
      } catch (err) {
        throw new Error(`Failed to save event: ${(err as Error).message}`);
      }
    },
    [db],
  );

  return (
    <StoreContext.Provider value={{ isReady, chartData, saveEvent }}>
      {children}
    </StoreContext.Provider>
  );
};
