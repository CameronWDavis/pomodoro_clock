import { useCallback, useEffect, useState } from "react";
import type { Task } from "../types";

const STORAGE_KEY = "pomodoro.tasks.v1";
const ACTIVE_KEY = "pomodoro.activeTask.v1";

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => load<Task[]>(STORAGE_KEY, []));
  const [activeId, setActiveId] = useState<string | null>(() =>
    load<string | null>(ACTIVE_KEY, null),
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(ACTIVE_KEY, JSON.stringify(activeId));
  }, [activeId]);

  const addTask = useCallback((title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    setTasks((prev) => [
      ...prev,
      { id: crypto.randomUUID(), title: trimmed, done: false, pomodoros: 0 },
    ]);
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );
  }, []);

  const deleteTask = useCallback(
    (id: string) => {
      setTasks((prev) => prev.filter((t) => t.id !== id));
      setActiveId((curr) => (curr === id ? null : curr));
    },
    [],
  );

  const setActive = useCallback((id: string | null) => {
    setActiveId(id);
  }, []);

  const reorderTasks = useCallback((fromId: string, toId: string) => {
    if (fromId === toId) return;
    setTasks((prev) => {
      const fromIndex = prev.findIndex((t) => t.id === fromId);
      const toIndex = prev.findIndex((t) => t.id === toId);
      if (fromIndex === -1 || toIndex === -1) return prev;
      const next = prev.slice();
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  }, []);

  const incrementActivePomodoro = useCallback(() => {
    if (!activeId) return;
    setTasks((prev) =>
      prev.map((t) =>
        t.id === activeId ? { ...t, pomodoros: t.pomodoros + 1 } : t,
      ),
    );
  }, [activeId]);

  return {
    tasks,
    activeId,
    addTask,
    toggleTask,
    deleteTask,
    setActive,
    reorderTasks,
    incrementActivePomodoro,
  };
}
