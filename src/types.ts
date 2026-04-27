export type Mode = "work" | "short" | "long";

export interface Task {
  id: string;
  title: string;
  done: boolean;
  pomodoros: number;
}
