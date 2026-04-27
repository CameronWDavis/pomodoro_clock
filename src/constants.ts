import type { Mode } from "./types";

export const DURATIONS: Record<Mode, number> = {
  work: 25 * 60,
  short: 5 * 60,
  long: 15 * 60,
};

export const LABELS: Record<Mode, string> = {
  work: "Focus",
  short: "Short Break",
  long: "Long Break",
};

export const MODES: Mode[] = ["work", "short", "long"];
