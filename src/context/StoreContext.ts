import type { CountsByPeriod } from '@/types';
import { createContext } from 'react';

export interface StoreContextType {
  isReady: boolean;
  countsByPeriod: CountsByPeriod;
  saveEvent: (date: Date) => void;
}

export const StoreContext = createContext<StoreContextType | undefined>(
  undefined,
);
