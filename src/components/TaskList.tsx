import { useState, type DragEvent, type FormEvent } from "react";
import type { Task } from "../types";

interface Props {
  tasks: Task[];
  activeId: string | null;
  onAdd: (title: string) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onSetActive: (id: string | null) => void;
  onReorder: (fromId: string, toId: string) => void;
}

export function TaskList({
  tasks,
  activeId,
  onAdd,
  onToggle,
  onDelete,
  onSetActive,
  onReorder,
}: Props) {
  const [draft, setDraft] = useState("");
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onAdd(draft);
    setDraft("");
  }

  function handleDragStart(e: DragEvent<HTMLLIElement>, id: string) {
    setDraggingId(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
  }

  function handleDragOver(e: DragEvent<HTMLLIElement>, id: string) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (id !== dragOverId) setDragOverId(id);
  }

  function handleDrop(e: DragEvent<HTMLLIElement>, id: string) {
    e.preventDefault();
    const fromId = draggingId ?? e.dataTransfer.getData("text/plain");
    if (fromId) onReorder(fromId, id);
    setDraggingId(null);
    setDragOverId(null);
  }

  function handleDragEnd() {
    setDraggingId(null);
    setDragOverId(null);
  }

  return (
    <section className="tasks">
      <h2 className="tasks__title">Tasks</h2>

      <form className="task-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="task-input"
          placeholder="What are you working on?"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
        <button type="submit" className="btn btn--primary task-add">
          Add
        </button>
      </form>

      {tasks.length === 0 ? (
        <p className="tasks__empty">No tasks yet — add one above.</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => {
            const isActive = task.id === activeId;
            const isDragging = task.id === draggingId;
            const isDragOver = task.id === dragOverId && !isDragging;
            return (
              <li
                key={task.id}
                className={[
                  "task",
                  task.done && "task--done",
                  isActive && "task--active",
                  isDragging && "task--dragging",
                  isDragOver && "task--dragover",
                ]
                  .filter(Boolean)
                  .join(" ")}
                draggable
                onDragStart={(e) => handleDragStart(e, task.id)}
                onDragOver={(e) => handleDragOver(e, task.id)}
                onDrop={(e) => handleDrop(e, task.id)}
                onDragEnd={handleDragEnd}
                onDragLeave={() => setDragOverId(null)}
              >
                <span className="task__handle" aria-hidden="true">⋮⋮</span>
                <input
                  type="checkbox"
                  className="task__check"
                  checked={task.done}
                  onChange={() => onToggle(task.id)}
                  aria-label={`Mark ${task.title} as ${task.done ? "incomplete" : "complete"}`}
                />
                <button
                  type="button"
                  className="task__title"
                  onClick={() => onSetActive(isActive ? null : task.id)}
                  title={isActive ? "Click to deselect" : "Click to focus this task"}
                >
                  {task.title}
                </button>
                <span className="task__count" title="Pomodoros completed">
                  {task.pomodoros > 0 ? `${task.pomodoros}🍅` : ""}
                </span>
                <button
                  type="button"
                  className="task__delete"
                  onClick={() => onDelete(task.id)}
                  aria-label={`Delete ${task.title}`}
                >
                  ×
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
