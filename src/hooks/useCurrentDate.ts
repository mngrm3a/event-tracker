import { useContext } from 'react';
import { CurrentDateContext } from '@/context/CurrentDateContext';

export const useCurrentDate = () => {
  const context = useContext(CurrentDateContext);
  if (!context)
    throw new Error('useDate must be used within DateContextProvider');
  return context;
};
