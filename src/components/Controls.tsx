interface Props {
  running: boolean;
  atStart: boolean;
  onToggle: () => void;
  onReset: () => void;
}

export function Controls({ running, atStart, onToggle, onReset }: Props) {
  const primaryLabel = running ? "Pause" : atStart ? "Start" : "Resume";
  return (
    <div className="controls">
      <button className="btn btn--primary" onClick={onToggle}>
        {primaryLabel}
      </button>
      <button className="btn btn--ghost" onClick={onReset}>
        Reset
      </button>
    </div>
  );
}
