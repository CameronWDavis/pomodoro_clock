import type { Mode } from "../types";
import { LABELS, MODES } from "../constants";

interface Props {
  mode: Mode;
  onChange: (m: Mode) => void;
}

export function ModeTabs({ mode, onChange }: Props) {
  return (
    <div className="mode-tabs">
      {MODES.map((m) => (
        <button
          key={m}
          className={`mode-tab${mode === m ? " mode-tab--active" : ""}`}
          onClick={() => onChange(m)}
        >
          {LABELS[m]}
        </button>
      ))}
    </div>
  );
}
