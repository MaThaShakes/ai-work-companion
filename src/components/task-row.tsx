import { Check, Pencil, Trash2, X } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  categoryStyles,
  priorityDot,
  type Category,
  type Priority,
  type Task,
} from "@/lib/tasks";
import { cn } from "@/lib/utils";

export function TaskRow({
  task,
  onToggle,
  onUpdate,
  onRemove,
}: {
  task: Task;
  onToggle: (id: string) => void;
  onUpdate: (id: string, patch: Partial<Omit<Task, "id" | "createdAt">>) => void;
  onRemove: (id: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(task.title);

  const save = () => {
    const trimmed = draft.trim();
    if (trimmed) onUpdate(task.id, { title: trimmed });
    else setDraft(task.title);
    setEditing(false);
  };

  return (
    <li
      className={cn(
        "group flex items-center gap-3 rounded-xl border border-border bg-card px-3.5 py-3 transition-all duration-200 hover:border-primary/35 hover:shadow-card",
        task.completed && "bg-muted/50",
      )}
    >
      <Checkbox
        checked={task.completed}
        onCheckedChange={() => onToggle(task.id)}
        aria-label={task.completed ? `Mark ${task.title} incomplete` : `Complete ${task.title}`}
      />

      {editing ? (
        <>
          <Input
            autoFocus
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") save();
              if (event.key === "Escape") {
                setDraft(task.title);
                setEditing(false);
              }
            }}
            className="h-9 flex-1"
          />
          <Button size="icon" variant="ghost" aria-label="Save task" onClick={save}>
            <Check className="size-4 text-success" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            aria-label="Cancel edit"
            onClick={() => {
              setDraft(task.title);
              setEditing(false);
            }}
          >
            <X className="size-4" />
          </Button>
        </>
      ) : (
        <>
          <span
            className={cn("size-2 shrink-0 rounded-full", priorityDot[task.priority as Priority])}
            title={`${task.priority} priority`}
          />
          <span className="min-w-0 flex-1">
            <span
              className={cn(
                "block truncate text-sm font-medium text-foreground",
                task.completed && "text-muted-foreground line-through",
              )}
            >
              {task.title}
            </span>
            <span className="text-[11px] capitalize text-muted-foreground">
              {task.priority} priority
            </span>
          </span>
          <Badge
            variant="outline"
            className={cn("shrink-0 font-medium", categoryStyles[task.category as Category])}
          >
            {task.category}
          </Badge>
          <div className="flex shrink-0 items-center gap-0.5 opacity-60 transition-opacity duration-200 group-hover:opacity-100">
            <Button
              size="icon"
              variant="ghost"
              aria-label={`Edit ${task.title}`}
              onClick={() => setEditing(true)}
            >
              <Pencil className="size-3.5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              aria-label={`Delete ${task.title}`}
              onClick={() => onRemove(task.id)}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        </>
      )}
    </li>
  );
}
