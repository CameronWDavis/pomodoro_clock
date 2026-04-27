import { useState, useEffect, useRef, useCallback } from "react";
import type { Mode } from "../types";
import { DURATIONS } from "../constants";

interface UseTimerOptions {
  onComplete: (mode: Mode) => void;
}

export function useTimer({ onComplete }: UseTimerOptions) {
  const [mode, setMode] = useState<Mode>("work");
  const [secondsLeft, setSecondsLeft] = useState(DURATIONS.work);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const switchMode = useCallback((next: Mode) => {
    setMode(next);
    setSecondsLeft(DURATIONS[next]);
    setRunning(false);
  }, []);

  const reset = useCallback(() => {
    setSecondsLeft(DURATIONS[mode]);
    setRunning(false);
  }, [mode]);

  const toggle = useCallback(() => setRunning((r) => !r), []);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          setRunning(false);
          onCompleteRef.current(mode);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, mode]);

  const total = DURATIONS[mode];
  const progress = 1 - secondsLeft / total;
  const atStart = secondsLeft === total;

  return { mode, secondsLeft, running, progress, atStart, switchMode, toggle, reset };
}
