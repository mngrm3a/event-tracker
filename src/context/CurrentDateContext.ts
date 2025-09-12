import { createContext } from 'react';

export type CurrentDateContextType = Date;

export const CurrentDateContext = createContext<
  CurrentDateContextType | undefined
>(undefined);
