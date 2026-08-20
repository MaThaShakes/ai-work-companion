import { useCallback, useMemo } from "react";

import { useLocalStorage } from "./storage";

export const CATEGORIES = ["Work", "Personal", "Urgent", "Learning"] as const;
export type Category = (typeof CATEGORIES)[number];

export const PRIORITIES = ["high", "medium", "low"] as const;
export type Priority = (typeof PRIORITIES)[number];

export type Task = {
  id: string;
  title: string;
  category: Category;
  priority: Priority;
  completed: boolean;
  createdAt: number;
};

const STORAGE_KEY = "workmate.tasks.v1";

const SEED: Task[] = [
  {
    id: "seed-1",
    title: "Complete monthly report",
    category: "Work",
    priority: "high",
    completed: false,
    createdAt: 1,
  },
  {
    id: "seed-2",
    title: "Reply to client email",
    category: "Urgent",
    priority: "high",
    completed: false,
    createdAt: 2,
  },
  {
    id: "seed-3",
    title: "Review presentation",
    category: "Work",
    priority: "medium",
    completed: false,
    createdAt: 3,
  },
  {
    id: "seed-4",
    title: "Study financial analysis",
    category: "Learning",
    priority: "low",
    completed: true,
    createdAt: 4,
  },
];

export function useTasks() {
  const { value: tasks, setValue, loaded } = useLocalStorage<Task[]>(STORAGE_KEY, SEED);

  const addTask = useCallback(
    (title: string, category: Category, priority: Priority) => {
      const trimmed = title.trim();
      if (!trimmed) return false;
      setValue((prev) => [
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          title: trimmed,
          category,
          priority,
          completed: false,
          createdAt: Date.now(),
        },
        ...prev,
      ]);
      return true;
    },
    [setValue],
  );

  const toggleTask = useCallback(
    (id: string) =>
      setValue((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))),
    [setValue],
  );

  const updateTask = useCallback(
    (id: string, patch: Partial<Omit<Task, "id" | "createdAt">>) =>
      setValue((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t))),
    [setValue],
  );

  const removeTask = useCallback(
    (id: string) => setValue((prev) => prev.filter((t) => t.id !== id)),
    [setValue],
  );

  const stats = useMemo(() => {
    const open = tasks.filter((t) => !t.completed).length;
    const done = tasks.length - open;
    const score = tasks.length === 0 ? 0 : Math.round((done / tasks.length) * 100);
    return { open, done, total: tasks.length, score };
  }, [tasks]);

  return { tasks, loaded, addTask, toggleTask, updateTask, removeTask, stats } as const;
}

export const categoryStyles: Record<Category, string> = {
  Work: "bg-primary-subtle text-secondary-foreground border-transparent",
  Personal: "bg-muted text-muted-foreground border-transparent",
  Urgent: "bg-destructive/10 text-destructive border-transparent",
  Learning: "bg-success/10 text-success border-transparent",
};

export const priorityDot: Record<Priority, string> = {
  high: "bg-destructive",
  medium: "bg-warning",
  low: "bg-success",
};

export const priorityLabel: Record<Priority, string> = {
  high: "🔴 High",
  medium: "🟡 Medium",
  low: "🟢 Low",
};
