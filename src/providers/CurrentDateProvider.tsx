import { CurrentDateContext } from '@/context/CurrentDateContext';
import React, { useState, useEffect, useRef, type ReactNode } from 'react';

export const CurrentDateProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const initialDate = new Date().toISOString().slice(0, 10);
  const [currentDate, setCurrentDate] = useState(initialDate);
  const prevDateRef = useRef(initialDate);

  useEffect(() => {
    const checkDateChange = () => {
      const newDate = new Date().toISOString().slice(0, 10);
      if (newDate !== prevDateRef.current) {
        prevDateRef.current = newDate;
        setCurrentDate(newDate);
      }
    };

    // Poll every 60 seconds
    const interval = setInterval(checkDateChange, 60000);

    // Handle visibility changes for reliability in browsers/PWAs
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkDateChange();
      }
    };

    // Handle app foreground events for PWAs
    const handleAppStateChange = () => {
      if (document.hasFocus()) {
        checkDateChange();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleAppStateChange);

    // Initial check
    checkDateChange();

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleAppStateChange);
    };
  }, []);

  return (
    <CurrentDateContext.Provider value={new Date(currentDate)}>
      {children}
    </CurrentDateContext.Provider>
  );
};
