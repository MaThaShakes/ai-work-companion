import { createFileRoute } from "@tanstack/react-router";
import { CalendarClock, Sparkles, Wand2 } from "lucide-react";
import { useMemo, useState } from "react";

import { AiOutputPanel, EmptyState, GeneratingState } from "@/components/ai-output-panel";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAi } from "@/lib/use-ai";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — WorkMate AI" },
      {
        name: "description",
        content: "Turn your priorities into an organized, prioritized schedule with time blocks.",
      },
      { property: "og:title", content: "AI Task Planner — WorkMate AI" },
      {
        property: "og:description",
        content: "Generate a focused daily or weekly schedule from your task list.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PlannerPage,
});

const HORIZONS = ["Today", "This Week"] as const;

const DISCLAIMER =
  "Suggested schedules are estimates. Adjust time blocks to match real commitments and energy levels.";

type Block = { time: string; title: string; priority: "high" | "medium" | "low"; note: string };

const priorityMeta: Record<Block["priority"], { label: string; dot: string; chip: string }> = {
  high: { label: "🔴 High", dot: "bg-destructive", chip: "bg-destructive/10 text-destructive" },
  medium: { label: "🟡 Medium", dot: "bg-warning", chip: "bg-warning/15 text-warning-foreground" },
  low: { label: "🟢 Low", dot: "bg-success", chip: "bg-success/10 text-success" },
};

function parseBlocks(text: string): Block[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.includes("|"))
    .map((line) => {
      const [time = "", title = "", priority = "medium", note = ""] = line
        .split("|")
        .map((part) => part.trim());
      const normalized = priority.toLowerCase();
      return {
        time,
        title,
        priority: (normalized === "high" || normalized === "low" ? normalized : "medium") as Block["priority"],
        note,
      };
    });
}

function PlannerPage() {
  const { run, loading } = useAi("planner");
  const [tasks, setTasks] = useState("");
  const [horizon, setHorizon] = useState<(typeof HORIZONS)[number]>("Today");
  const [output, setOutput] = useState("");

  const blocks = useMemo(() => parseBlocks(output), [output]);

  const generate = async () => {
    const text = await run({ input: { tasks, horizon } });
    if (text) setOutput(text);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Task Planner"
        subtitle="Turn your priorities into an organized schedule."
      />

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="surface space-y-5 p-5 sm:p-6">
          <div className="space-y-2">
            <Label htmlFor="tasks">What do you need to accomplish?</Label>
            <Textarea
              id="tasks"
              rows={10}
              value={tasks}
              onChange={(event) => setTasks(event.target.value)}
              placeholder={`Finish monthly report by 3 PM\nReply to client\nPrepare presentation\nStudy for one hour\nAttend team meeting at 2 PM`}
              className="min-h-52 resize-y text-[13px] leading-relaxed"
            />
            <p className="text-[11px] text-muted-foreground">One task per line, with any fixed times or deadlines.</p>
          </div>

          <div className="space-y-2.5">
            <Label>Planning Horizon</Label>
            <div className="flex gap-2.5">
              {HORIZONS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setHorizon(item)}
                  aria-pressed={horizon === item}
                  className={cn(
                    "flex-1 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    horizon === item
                      ? "border-primary bg-primary-subtle text-primary shadow-card"
                      : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <Button
            className="h-11 w-full"
            onClick={generate}
            disabled={loading || tasks.trim().length < 3}
          >
            {loading ? (
              <>
                <Sparkles className="size-4 animate-pulse" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="size-4" />
                Generate Schedule
              </>
            )}
          </Button>
          <p className="text-[11px] leading-relaxed text-muted-foreground">{DISCLAIMER}</p>
        </section>

        <div>
          {loading ? (
            <div className="surface p-5 sm:p-6">
              <GeneratingState label="Building your schedule..." />
            </div>
          ) : output ? (
            <AiOutputPanel
              title={`Schedule — ${horizon}`}
              value={output}
              onChange={setOutput}
              onRegenerate={generate}
              loading={loading}
              disclaimer={DISCLAIMER}
              copyLabel="Copy schedule"
              rows={12}
            >
              <ol className="relative space-y-3 border-l border-border pl-5">
                {blocks.map((block, index) => (
                  <li key={index} className="relative">
                    <span
                      className={cn(
                        "absolute -left-[27px] top-3 size-2.5 rounded-full ring-4 ring-card",
                        priorityMeta[block.priority].dot,
                      )}
                    />
                    <div className="rounded-xl border border-border bg-card p-3.5 transition-all duration-200 hover:border-primary/35 hover:shadow-card">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-mono text-xs font-semibold text-primary">{block.time}</p>
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[11px] font-medium",
                            priorityMeta[block.priority].chip,
                          )}
                        >
                          {priorityMeta[block.priority].label}
                        </span>
                      </div>
                      <p className="mt-1 text-sm font-medium text-foreground">{block.title}</p>
                      {block.note ? (
                        <p className="mt-0.5 text-xs text-muted-foreground">{block.note}</p>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ol>
            </AiOutputPanel>
          ) : (
            <div className="surface p-5 sm:p-6">
              <EmptyState
                icon={<CalendarClock className="size-5" />}
                title="Your timeline appears here"
                description="List your tasks, choose a horizon and generate a prioritized schedule."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
