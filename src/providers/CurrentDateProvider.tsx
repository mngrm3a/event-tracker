import { CurrentDateContext } from '@/context/CurrentDateContext';
import { useState, useEffect, useRef, type ReactNode } from 'react';

interface CurrentDateProps {
  resolution: number;
  children?: ReactNode;
}

export const CurrentDateProvider = ({
  resolution,
  children,
}: CurrentDateProps) => {
  const initialDate = todayAtMidnight();
  const [today, setToday] = useState(initialDate);
  const todayRef = useRef(initialDate);

  useEffect(() => {
    const checkDateChange = () => {
      const newToday = todayAtMidnight();

      if (
        newToday.getFullYear() !== todayRef.current.getFullYear() ||
        newToday.getMonth() !== todayRef.current.getMonth() ||
        newToday.getDate() !== todayRef.current.getDate()
      ) {
        todayRef.current = newToday;
        setToday(newToday);
      }
    };

    const interval = setInterval(checkDateChange, resolution);

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
  }, [resolution]);

  return (
    <CurrentDateContext.Provider value={today}>
      {children}
    </CurrentDateContext.Provider>
  );
};

function todayAtMidnight() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}
