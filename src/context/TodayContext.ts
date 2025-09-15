import { createContext } from 'react';

export type TodayContextType = Date;

export const TodayContext = createContext<TodayContextType | undefined>(
  undefined,
);
