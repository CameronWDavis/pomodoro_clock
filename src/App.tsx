import { useEffect, useState } from "react";
import "./App.css";
import { LABELS } from "./constants";
import { useTimer } from "./hooks/useTimer";
import { useTasks } from "./hooks/useTasks";
import { ModeTabs } from "./components/ModeTabs";
import { TimerRing } from "./components/TimerRing";
import { Controls } from "./components/Controls";
import { TaskList } from "./components/TaskList";
import { formatTime } from "./utils/time";
import { playBeep } from "./utils/sound";
import type { Mode } from "./types";

export default function App() {
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const tasksApi = useTasks();

  const handleComplete = (mode: Mode) => {
    playBeep();
    if (mode === "work") {
      setCompletedPomodoros((c) => c + 1);
      tasksApi.incrementActivePomodoro();
    }
  };

  const timer = useTimer({ onComplete: handleComplete });

  useEffect(() => {
    document.title = timer.running
      ? `${formatTime(timer.secondsLeft)} — ${LABELS[timer.mode]}`
      : "Pomodoro";
  }, [timer.secondsLeft, timer.running, timer.mode]);

  const activeTask = tasksApi.tasks.find((t) => t.id === tasksApi.activeId);

  return (
    <div className={`app app--${timer.mode}`}>
      <h1 className="app__title">Pomodoro</h1>

      <ModeTabs mode={timer.mode} onChange={timer.switchMode} />

      <TimerRing secondsLeft={timer.secondsLeft} progress={timer.progress} />

      {activeTask && (
        <p className="active-task">
          Focusing on: <strong>{activeTask.title}</strong>
        </p>
      )}

      <Controls
        running={timer.running}
        atStart={timer.atStart}
        onToggle={timer.toggle}
        onReset={timer.reset}
      />

      <p className="pomodoro-count">
        {completedPomodoros > 0
          ? `${completedPomodoros} pomodoro${completedPomodoros !== 1 ? "s" : ""} completed`
          : "No pomodoros completed yet"}
      </p>

      <TaskList
        tasks={tasksApi.tasks}
        activeId={tasksApi.activeId}
        onAdd={tasksApi.addTask}
        onToggle={tasksApi.toggleTask}
        onDelete={tasksApi.deleteTask}
        onSetActive={tasksApi.setActive}
        onReorder={tasksApi.reorderTasks}
      />
    </div>
  );
}
