import type { ChartData } from '@/types';
import { createContext } from 'react';

export interface StoreContextType {
  isReady: boolean;
  chartData: ChartData;
  saveEvent: (date: Date, typ: string) => void;
}

export const StoreContext = createContext<StoreContextType | undefined>(
  undefined,
);
