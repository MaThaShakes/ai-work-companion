import { createFileRoute } from "@tanstack/react-router";
import { Search, Sparkles, Wand2 } from "lucide-react";
import { useState } from "react";

import { AiOutputPanel, EmptyState, GeneratingState } from "@/components/ai-output-panel";
import { MarkdownView } from "@/components/markdown-view";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usePreferences, type ResearchStyle } from "@/lib/preferences";
import { useAi } from "@/lib/use-ai";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — WorkMate AI" },
      {
        name: "description",
        content: "Research topics, summarize information and generate actionable insights.",
      },
      { property: "og:title", content: "AI Research Assistant — WorkMate AI" },
      {
        property: "og:description",
        content: "Generate executive briefs, findings, risks and recommendations on any topic.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResearchPage,
});

const STYLES: ResearchStyle[] = [
  "Executive Brief",
  "Detailed Overview",
  "Actionable Recommendations",
];

const DISCLAIMER =
  "AI-generated research may contain errors or incomplete information. Verify important facts using reliable sources.";

function ResearchPage() {
  const { prefs } = usePreferences();
  const { run, loading } = useAi("research");
  const [topic, setTopic] = useState("");
  const [style, setStyle] = useState<ResearchStyle>(prefs.defaultResearchStyle);
  const [output, setOutput] = useState("");

  const generate = async () => {
    const text = await run({ input: { topic, style } });
    if (text) setOutput(text);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Research Assistant"
        subtitle="Research topics, summarize information and generate actionable insights."
      />

      <section className="surface space-y-5 p-5 sm:p-6">
        <div className="space-y-2">
          <Label htmlFor="topic">Topic, question or article</Label>
          <Textarea
            id="topic"
            rows={6}
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            placeholder="Enter a topic, question or article..."
            className="min-h-32 resize-y text-[13px] leading-relaxed"
          />
        </div>

        <div className="space-y-2.5">
          <Label>Output style</Label>
          <div className="grid gap-2.5 sm:grid-cols-3">
            {STYLES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setStyle(item)}
                aria-pressed={style === item}
                className={cn(
                  "rounded-xl border px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5",
                  style === item
                    ? "border-primary bg-primary-subtle text-primary shadow-card"
                    : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
                )}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button
            className="h-11 sm:w-auto"
            onClick={generate}
            disabled={loading || topic.trim().length < 3}
          >
            {loading ? (
              <>
                <Sparkles className="size-4 animate-pulse" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="size-4" />
                Generate Research Brief
              </>
            )}
          </Button>
          <p className="text-[11px] leading-relaxed text-muted-foreground">{DISCLAIMER}</p>
        </div>
      </section>

      {loading ? (
        <div className="surface p-5 sm:p-6">
          <GeneratingState label="Researching your topic..." />
        </div>
      ) : output ? (
        <AiOutputPanel
          title={`Research Brief — ${style}`}
          value={output}
          onChange={setOutput}
          onRegenerate={generate}
          loading={loading}
          disclaimer={DISCLAIMER}
          copyLabel="Copy brief"
          rows={20}
        >
          <div className="grid gap-6 md:grid-cols-2">
            <MarkdownView content={output} />
          </div>
        </AiOutputPanel>
      ) : (
        <div className="surface p-5 sm:p-6">
          <EmptyState
            icon={<Search className="size-5" />}
            title="Your research brief appears here"
            description="Enter a topic or paste an article, choose an output style and generate."
          />
        </div>
      )}
    </div>
  );
}
