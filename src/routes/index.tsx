import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  CircleDot,
  Gauge,
  Mail,
  NotebookPen,
  Search,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";

import { PageHeader } from "@/components/page-header";
import { TaskRow } from "@/components/task-row";
import { Skeleton } from "@/components/ui/skeleton";
import { usePreferences } from "@/lib/preferences";
import { useTasks } from "@/lib/tasks";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — WorkMate AI" },
      {
        name: "description",
        content:
          "Your AI-powered workplace productivity hub: track tasks, monitor progress and launch AI tools.",
      },
      { property: "og:title", content: "Dashboard — WorkMate AI" },
      {
        property: "og:description",
        content: "Track tasks, monitor productivity and launch AI workplace tools.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const QUICK_ACTIONS = [
  {
    to: "/email",
    icon: Mail,
    title: "Generate an Email",
    description: "Create a polished professional message.",
  },
  {
    to: "/meeting-notes",
    icon: NotebookPen,
    title: "Summarize Meeting Notes",
    description: "Extract decisions, action items and deadlines.",
  },
  {
    to: "/planner",
    icon: CalendarClock,
    title: "Plan My Day",
    description: "Turn priorities into a focused schedule.",
  },
  {
    to: "/research",
    icon: Search,
    title: "Research a Topic",
    description: "Generate a concise research brief.",
  },
] as const;

function greeting(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  trend,
}: {
  icon: typeof Gauge;
  label: string;
  value: string;
  hint: string;
  trend?: string;
}) {
  return (
    <div className="surface group p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-raised">
      <div className="flex items-start justify-between">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary-subtle text-primary transition-transform duration-200 group-hover:scale-105">
          <Icon className="size-5" />
        </div>
        {trend ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success">
            <TrendingUp className="size-3" />
            {trend}
          </span>
        ) : null}
      </div>
      <p className="mt-4 text-2xl font-semibold tracking-tight text-foreground">{value}</p>
      <p className="text-sm font-medium text-foreground">{label}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

function Dashboard() {
  const { tasks, loaded, stats, toggleTask, updateTask, removeTask } = useTasks();
  const { prefs } = usePreferences();
  const navigate = useNavigate();
  const [hour, setHour] = useState(9);

  useEffect(() => setHour(new Date().getHours()), []);

  const todays = tasks.slice(0, 6);

  return (
    <div className="space-y-8">
      <PageHeader
        title={`${greeting(hour)} 👋`}
        subtitle="Your AI-powered workplace productivity hub."
        actions={
          <div className="flex items-center gap-3 rounded-full border border-border bg-card px-3 py-2 shadow-card">
            <div className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
              NS
            </div>
            <div className="pr-1 leading-tight">
              <p className="text-xs font-semibold text-foreground">Noluthando S.</p>
              <p className="text-[11px] text-muted-foreground">Workspace member</p>
            </div>
          </div>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loaded ? (
          <>
            <StatCard
              icon={CircleDot}
              label="Open Tasks"
              value={String(stats.open)}
              hint="Incomplete items in your list"
            />
            <StatCard
              icon={CheckCircle2}
              label="Completed"
              value={String(stats.done)}
              hint="Finished tasks"
              {...(stats.done > 0 ? { trend: `+${stats.done}` } : {})}
            />
            <StatCard
              icon={Sparkles}
              label="AI Tools Used"
              value={String(prefs.toolsUsed)}
              hint="Generations this session"
            />
            <StatCard
              icon={Gauge}
              label="Productivity Score"
              value={`${Math.max(stats.score, 40)}%`}
              hint="Based on completion rate"
              trend="Steady"
            />
          </>
        ) : (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-xl" />
          ))
        )}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
        <div className="surface p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Today's Tasks</h2>
              <p className="text-xs text-muted-foreground">
                {stats.open} open · {stats.done} completed
              </p>
            </div>
            <Link
              to="/tasks"
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              Manage
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>

          {loaded ? (
            todays.length > 0 ? (
              <ul className="space-y-2.5">
                {todays.map((task) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    onToggle={toggleTask}
                    onUpdate={updateTask}
                    onRemove={removeTask}
                  />
                ))}
              </ul>
            ) : (
              <p className="rounded-xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
                No tasks yet — add your first one on the Tasks page.
              </p>
            )
          ) : (
            <div className="space-y-2.5">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-14 rounded-lg" />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-foreground">AI Quick Actions</h2>
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action.to}
              type="button"
              onClick={() => navigate({ to: action.to })}
              className="surface group flex w-full items-center gap-4 p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-raised"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-subtle text-primary transition-transform duration-200 group-hover:scale-105">
                <action.icon className="size-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-foreground">{action.title}</span>
                <span className="block truncate text-xs text-muted-foreground">
                  {action.description}
                </span>
              </span>
              <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-primary" />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
