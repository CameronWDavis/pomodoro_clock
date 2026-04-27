import { formatTime } from "../utils/time";

interface Props {
  secondsLeft: number;
  progress: number;
}

const RADIUS = 110;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function TimerRing({ secondsLeft, progress }: Props) {
  const dashOffset = CIRCUMFERENCE * (1 - progress);
  return (
    <div className="timer-ring">
      <svg viewBox="0 0 240 240" width="240" height="240">
        <circle cx="120" cy="120" r={RADIUS} className="ring-bg" />
        <circle
          cx="120"
          cy="120"
          r={RADIUS}
          className="ring-progress"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
          transform="rotate(-90 120 120)"
        />
      </svg>
      <span className="timer-display">{formatTime(secondsLeft)}</span>
    </div>
  );
}
