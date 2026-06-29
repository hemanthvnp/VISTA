/** @fileoverview Typing session hook - captures keypresses, calculates WPM/accuracy in real-time */
import { useState, useCallback, useRef, useEffect } from 'react';

const useTypingSession = ({ text = '', duration = 60, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [keypresses, setKeypresses] = useState([]);
  const [backspaces, setBackspaces] = useState([]);
  const [errors, setErrors] = useState(0);
  const [totalChars, setTotalChars] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [isActive, setIsActive] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration);

  const startTimeRef = useRef(null);
  const lastKeyTimeRef = useRef(null);
  const keyDownTimeRef = useRef({});
  const timerRef = useRef(null);
  const lastErrorKeyRef = useRef(null);
  const lastErrorTimeRef = useRef(null);

  const resetSession = useCallback(() => {
    setCurrentIndex(0);
    setKeypresses([]);
    setBackspaces([]);
    setErrors(0);
    setTotalChars(0);
    setWpm(0);
    setAccuracy(100);
    setIsActive(false);
    setIsComplete(false);
    setTimeLeft(duration);
    startTimeRef.current = null;
    lastKeyTimeRef.current = null;
    clearInterval(timerRef.current);
  }, [duration]);

  const startSession = useCallback(() => {
    resetSession();
    setIsActive(true);
    startTimeRef.current = performance.now();
    lastKeyTimeRef.current = performance.now();
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setIsComplete(true);
          setIsActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [resetSession]);

  const endSession = useCallback(() => {
    clearInterval(timerRef.current);
    setIsActive(false);
    setIsComplete(true);
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (!isActive || isComplete) return;

    const now = performance.now();
    keyDownTimeRef.current[e.key] = now;

    if (e.key === 'Backspace') {
      if (lastErrorKeyRef.current && lastErrorTimeRef.current) {
        setBackspaces((prev) => [...prev, {
          errorKey: lastErrorKeyRef.current,
          correctionMs: now - lastErrorTimeRef.current,
          timestampMs: now - startTimeRef.current,
        }]);
      }
      setCurrentIndex((prev) => Math.max(0, prev - 1));
      return;
    }

    if (e.key.length !== 1) return;

    const expected = text[currentIndex];
    const isCorrect = e.key === expected;
    const interKeyMs = lastKeyTimeRef.current ? now - lastKeyTimeRef.current : 0;

    setKeypresses((prev) => [...prev, {
      key: e.key,
      expectedKey: expected,
      isCorrect,
      timestampMs: now - startTimeRef.current,
      prevKey: currentIndex > 0 ? text[currentIndex - 1] : '',
      holdMs: 0,
      interKeyMs,
    }]);

    if (!isCorrect) {
      setErrors((prev) => prev + 1);
      lastErrorKeyRef.current = e.key;
      lastErrorTimeRef.current = now;
    } else {
      lastErrorKeyRef.current = null;
    }

    setTotalChars((prev) => prev + 1);
    setCurrentIndex((prev) => prev + 1);
    lastKeyTimeRef.current = now;

    // Update WPM every keystroke
    const elapsedMin = (now - startTimeRef.current) / 60000;
    if (elapsedMin > 0) {
      const charsTyped = currentIndex + 1;
      setWpm(Math.round((charsTyped / 5) / elapsedMin));
    }

    // Update accuracy
    const newTotal = totalChars + 1;
    const newErrors = isCorrect ? errors : errors + 1;
    setAccuracy(Math.round(((newTotal - newErrors) / newTotal) * 100));

    // Check if text complete
    if (currentIndex + 1 >= text.length) {
      endSession();
    }
  }, [isActive, isComplete, text, currentIndex, totalChars, errors, endSession]);

  const handleKeyUp = useCallback((e) => {
    const downTime = keyDownTimeRef.current[e.key];
    if (downTime) {
      const holdMs = performance.now() - downTime;
      setKeypresses((prev) => {
        const updated = [...prev];
        for (let i = updated.length - 1; i >= 0; i--) {
          if (updated[i].key === e.key && updated[i].holdMs === 0) {
            updated[i] = { ...updated[i], holdMs };
            break;
          }
        }
        return updated;
      });
      delete keyDownTimeRef.current[e.key];
    }
  }, []);

  useEffect(() => {
    if (isActive) {
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isActive, handleKeyDown, handleKeyUp]);

  useEffect(() => {
    if (isComplete && onComplete) {
      onComplete({
        wpm,
        accuracy,
        keypresses,
        backspaces,
        totalChars,
        errors,
        durationSecs: duration - timeLeft,
      });
    }
  }, [isComplete]);

  useEffect(() => () => clearInterval(timerRef.current), []);

  return {
    wpm,
    accuracy,
    currentIndex,
    keypresses,
    backspaces,
    errors,
    totalChars,
    isActive,
    isComplete,
    timeLeft,
    startSession,
    endSession,
    resetSession,
    progress: text.length > 0 ? currentIndex / text.length : 0,
  };
};

export default useTypingSession;
