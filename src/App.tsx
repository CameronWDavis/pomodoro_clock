import { useState, useEffect, useRef, useCallback } from "react";
import "./App.css";

type Mode = "work" | "short" | "long";

const DURATIONS: Record<Mode, number> = {
  work: 25 * 60,
  short: 5 * 60,
  long: 15 * 60,
};

const LABELS: Record<Mode, string> = {
  work: "Focus",
  short: "Short Break",
  long: "Long Break",
};

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function App() {
  const [mode, setMode] = useState<Mode>("work");
  const [secondsLeft, setSecondsLeft] = useState(DURATIONS.work);
  const [running, setRunning] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playBeep = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.8);
  }, []);

  const switchMode = useCallback((next: Mode) => {
    setMode(next);
    setSecondsLeft(DURATIONS[next]);
    setRunning(false);
  }, []);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setRunning(false);
            playBeep();
            setCompletedPomodoros((c) => (mode === "work" ? c + 1 : c));
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, mode, playBeep]);

  useEffect(() => {
    document.title = running
      ? `${formatTime(secondsLeft)} — ${LABELS[mode]}`
      : "Pomodoro";
  }, [secondsLeft, running, mode]);

  const progress = 1 - secondsLeft / DURATIONS[mode];
  const circumference = 2 * Math.PI * 110;
  const dashOffset = circumference * (1 - progress);

  return (
    <div className={`app app--${mode}`}>
      <h1 className="app__title">Pomodoro</h1>

      <div className="mode-tabs">
        {(["work", "short", "long"] as Mode[]).map((m) => (
          <button
            key={m}
            className={`mode-tab${mode === m ? " mode-tab--active" : ""}`}
            onClick={() => switchMode(m)}
          >
            {LABELS[m]}
          </button>
        ))}
      </div>

      <div className="timer-ring">
        <svg viewBox="0 0 240 240" width="240" height="240">
          <circle cx="120" cy="120" r="110" className="ring-bg" />
          <circle
            cx="120"
            cy="120"
            r="110"
            className="ring-progress"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            transform="rotate(-90 120 120)"
          />
        </svg>
        <span className="timer-display">{formatTime(secondsLeft)}</span>
      </div>

      <div className="controls">
        <button className="btn btn--primary" onClick={() => setRunning((r) => !r)}>
          {running ? "Pause" : secondsLeft === DURATIONS[mode] ? "Start" : "Resume"}
        </button>
        <button className="btn btn--ghost" onClick={() => switchMode(mode)}>
          Reset
        </button>
      </div>

      <p className="pomodoro-count">
        {completedPomodoros > 0
          ? `${completedPomodoros} pomodoro${completedPomodoros !== 1 ? "s" : ""} completed`
          : "No pomodoros completed yet"}
      </p>

      <div className="dots">
        {Array.from({ length: 4 }).map((_, i) => (
          <span key={i} className={`dot${i < completedPomodoros % 4 || (completedPomodoros > 0 && completedPomodoros % 4 === 0) ? " dot--filled" : ""}`} />
        ))}
      </div>
    </div>
  );
}
