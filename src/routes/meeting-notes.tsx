import { createFileRoute } from "@tanstack/react-router";
import { NotebookPen, Sparkles, Wand2 } from "lucide-react";
import { useState } from "react";

import { AiOutputPanel, EmptyState, GeneratingState } from "@/components/ai-output-panel";
import { MarkdownView } from "@/components/markdown-view";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAi } from "@/lib/use-ai";

export const Route = createFileRoute("/meeting-notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — WorkMate AI" },
      {
        name: "description",
        content: "Turn lengthy meeting notes into summaries, decisions, action items and deadlines.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer — WorkMate AI" },
      {
        property: "og:description",
        content: "Extract decisions, owners, deadlines and follow-ups from raw meeting notes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MeetingNotesPage,
});

const DISCLAIMER =
  "AI summaries may miss nuance. Confirm decisions, owners and deadlines with attendees before acting.";

function MeetingNotesPage() {
  const { run, loading } = useAi("meeting");
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");

  const generate = async () => {
    const text = await run({ input: { notes } });
    if (text) setOutput(text);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Meeting Notes Summarizer"
        subtitle="Turn lengthy meeting notes into clear, actionable summaries."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="surface flex flex-col p-5 sm:p-6">
          <label htmlFor="notes" className="text-sm font-semibold text-foreground">
            Meeting notes
          </label>
          <Textarea
            id="notes"
            value={notes}
            rows={16}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Paste your meeting notes here..."
            className="mt-3 min-h-72 resize-y text-[13px] leading-relaxed"
          />
          <Button
            className="mt-4 h-11"
            onClick={generate}
            disabled={loading || notes.trim().length < 10}
          >
            {loading ? (
              <>
                <Sparkles className="size-4 animate-pulse" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="size-4" />
                Summarize Notes
              </>
            )}
          </Button>
          <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">{DISCLAIMER}</p>
        </section>

        <div>
          {loading ? (
            <div className="surface p-5 sm:p-6">
              <GeneratingState label="Summarizing your notes..." />
            </div>
          ) : output ? (
            <AiOutputPanel
              title="Structured Summary"
              value={output}
              onChange={setOutput}
              onRegenerate={generate}
              loading={loading}
              disclaimer={DISCLAIMER}
              copyLabel="Copy Summary"
            >
              <MarkdownView content={output} />
            </AiOutputPanel>
          ) : (
            <div className="surface p-5 sm:p-6">
              <EmptyState
                icon={<NotebookPen className="size-5" />}
                title="Summary, decisions and action items"
                description="Paste notes on the left and summarize to see structured results here."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
