import { useContext } from 'react';
import { TodayContext as TodayContext } from '@/context/TodayContext';

export const useToday = () => {
  const context = useContext(TodayContext);
  if (!context)
    throw new Error('useDate must be used within DateContextProvider');
  return context;
};
