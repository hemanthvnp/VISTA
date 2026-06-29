/** @fileoverview Auto-running study timer hook. Pauses when tab/window is hidden. */
import { useEffect, useRef } from 'react';
import useTimerStore from '../store/useTimerStore';

const useAutoTimer = () => {
  const { elapsed, isRunning, start, pause, tick } = useTimerStore();
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => tick(), 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, tick]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        pause();
      } else {
        start();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [start, pause]);

  return { elapsed, isRunning, start, pause };
};

export default useAutoTimer;
