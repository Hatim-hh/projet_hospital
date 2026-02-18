import { useEffect, useState, useCallback } from 'react';

export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

export const useDebouncedCallback = (callback, delay = 500) => {
  const [timeoutId, setTimeoutId] = useState(null);

  const debouncedCallback = useCallback((...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    const newTimeoutId = setTimeout(() => {
      callback(...args);
    }, delay);
    
    setTimeoutId(newTimeoutId);
  }, [callback, delay, timeoutId]);

  return debouncedCallback;
};

export const useThrottle = (value, delay = 500) => {
  const [throttledValue, setThrottledValue] = useState(value);
  const [lastRan, setLastRan] = useState(() => Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if ((Date.now() - lastRan) >= delay) {
        setThrottledValue(value);
        setLastRan(Date.now());
      }
    }, delay - (Date.now() - lastRan));

    return () => clearTimeout(handler);
  }, [value, delay, lastRan]);

  return throttledValue;
};
