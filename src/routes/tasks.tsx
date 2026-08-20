import { createFileRoute } from "@tanstack/react-router";
import { ListChecks, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { EmptyState } from "@/components/ai-output-panel";
import { PageHeader } from "@/components/page-header";
import { TaskRow } from "@/components/task-row";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { CATEGORIES, PRIORITIES, useTasks, type Category, type Priority } from "@/lib/tasks";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "Task Management — WorkMate AI" },
      {
        name: "description",
        content: "Organize your work with categories, priorities, filtering and sorting.",
      },
      { property: "og:title", content: "Task Management — WorkMate AI" },
      {
        property: "og:description",
        content: "Add, edit, filter and complete tasks in your AI productivity workspace.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TasksPage,
});

const FILTERS = ["All", ...CATEGORIES] as const;
const SORTS = ["Priority", "Newest", "Completed", "Category"] as const;
const PRIORITY_RANK: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

function TasksPage() {
  const { tasks, loaded, addTask, toggleTask, updateTask, removeTask, stats } = useTasks();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category>("Work");
  const [priority, setPriority] = useState<Priority>("medium");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [sort, setSort] = useState<(typeof SORTS)[number]>("Priority");

  const visible = useMemo(() => {
    const list = tasks.filter((task) => filter === "All" || task.category === filter);
    const sorted = [...list];
    sorted.sort((a, b) => {
      switch (sort) {
        case "Priority":
          return PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
        case "Newest":
          return b.createdAt - a.createdAt;
        case "Completed":
          return Number(b.completed) - Number(a.completed);
        case "Category":
          return a.category.localeCompare(b.category);
      }
    });
    return sorted;
  }, [tasks, filter, sort]);

  const submit = () => {
    if (!addTask(title, category, priority)) {
      toast.error("Task needs a title");
      return;
    }
    setTitle("");
    toast.success("Task added", { description: `${category} · ${priority} priority` });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Task Management" subtitle="Organize your work and stay focused." />

      <section className="surface p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            value={title}
            placeholder="Add a new task..."
            onChange={(event) => setTitle(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && submit()}
            className="h-11 flex-1"
          />
          <div className="flex gap-3">
            <Select value={category} onValueChange={(value) => setCategory(value as Category)}>
              <SelectTrigger className="h-11 w-full min-w-32 sm:w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={priority} onValueChange={(value) => setPriority(value as Priority)}>
              <SelectTrigger className="h-11 w-full min-w-28 sm:w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRIORITIES.map((item) => (
                  <SelectItem key={item} value={item} className="capitalize">
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button className="h-11" onClick={submit}>
            <Plus className="size-4" />
            Add Task
          </Button>
        </div>

        <div className="mt-5 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-1.5">
            {FILTERS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors duration-200",
                  filter === item
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
                )}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Sort by</span>
            <Select value={sort} onValueChange={(value) => setSort(value as typeof sort)}>
              <SelectTrigger className="h-9 w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORTS.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <section className="surface p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">
            {filter === "All" ? "All tasks" : `${filter} tasks`}
          </h2>
          <p className="text-xs text-muted-foreground">
            {stats.open} open · {stats.done} completed
          </p>
        </div>

        {!loaded ? (
          <div className="space-y-2.5">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-14 rounded-xl" />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <EmptyState
            icon={<ListChecks className="size-5" />}
            title="No tasks here yet"
            description="Add a task above, or switch filters to see other categories."
          />
        ) : (
          <ul className="space-y-2.5">
            {visible.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onUpdate={updateTask}
                onRemove={removeTask}
              />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
