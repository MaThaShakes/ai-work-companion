import { createFileRoute } from "@tanstack/react-router";
import { Mail, Send, Sparkles } from "lucide-react";
import { useState } from "react";

import { AiOutputPanel, EmptyState, GeneratingState } from "@/components/ai-output-panel";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usePreferences, type Tone } from "@/lib/preferences";
import { useAi } from "@/lib/use-ai";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — WorkMate AI" },
      {
        name: "description",
        content: "Generate professional workplace emails in seconds with tone control.",
      },
      { property: "og:title", content: "Smart Email Generator — WorkMate AI" },
      {
        property: "og:description",
        content: "Draft polished workplace emails with purpose, recipient context and tone.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EmailPage,
});

const TONES: Array<{ value: Tone; description: string }> = [
  { value: "Formal", description: "Professional and structured." },
  { value: "Friendly", description: "Warm and approachable." },
  { value: "Persuasive", description: "Confident and convincing." },
];

const DISCLAIMER =
  "Review AI-generated content for accuracy, confidentiality, tone and appropriateness before sending.";

function EmailPage() {
  const { prefs } = usePreferences();
  const { run, loading } = useAi("email");
  const [purpose, setPurpose] = useState("");
  const [recipient, setRecipient] = useState("");
  const [tone, setTone] = useState<Tone>(prefs.defaultTone);
  const [output, setOutput] = useState("");

  const generate = async () => {
    const text = await run({ input: { purpose, recipient, tone } });
    if (text) setOutput(text);
  };

  const subject = output.match(/^Subject:\s*(.+)$/m)?.[1] ?? "";
  const body = output.replace(/^Subject:\s*.+\n?/m, "").trim();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Smart Email Generator"
        subtitle="Generate professional workplace emails in seconds."
      />

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="surface space-y-5 p-5 sm:p-6">
          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose</Label>
            <Textarea
              id="purpose"
              rows={3}
              value={purpose}
              onChange={(event) => setPurpose(event.target.value)}
              placeholder="Ask a client to approve the proposal."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient Context</Label>
            <Input
              id="recipient"
              value={recipient}
              onChange={(event) => setRecipient(event.target.value)}
              placeholder="Existing client, senior stakeholder."
            />
          </div>

          <div className="space-y-2.5">
            <Label>Tone</Label>
            <div className="grid gap-2.5 sm:grid-cols-3">
              {TONES.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setTone(item.value)}
                  aria-pressed={tone === item.value}
                  className={cn(
                    "rounded-xl border p-3 text-left transition-all duration-200 hover:-translate-y-0.5",
                    tone === item.value
                      ? "border-primary bg-primary-subtle shadow-card"
                      : "border-border bg-card hover:border-primary/40",
                  )}
                >
                  <span
                    className={cn(
                      "block text-sm font-semibold",
                      tone === item.value ? "text-primary" : "text-foreground",
                    )}
                  >
                    {item.value}
                  </span>
                  <span className="mt-0.5 block text-[11px] leading-snug text-muted-foreground">
                    {item.description}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <Button
            className="h-11 w-full"
            onClick={generate}
            disabled={loading || purpose.trim().length === 0}
          >
            {loading ? (
              <>
                <Sparkles className="size-4 animate-pulse" />
                Generating...
              </>
            ) : (
              <>
                <Send className="size-4" />
                Generate Email
              </>
            )}
          </Button>
          <p className="text-[11px] leading-relaxed text-muted-foreground">{DISCLAIMER}</p>
        </section>

        <div>
          {loading ? (
            <div className="surface p-5 sm:p-6">
              <GeneratingState label="Drafting your email..." />
            </div>
          ) : output ? (
            <AiOutputPanel
              title="Generated Email"
              value={output}
              onChange={setOutput}
              onRegenerate={generate}
              loading={loading}
              disclaimer={DISCLAIMER}
              copyLabel="Copy email"
            >
              <div className="space-y-4">
                <div className="rounded-lg border border-border bg-muted/50 px-3.5 py-2.5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">
                    Subject
                  </p>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    {subject || "No subject line"}
                  </p>
                </div>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                  {body}
                </p>
              </div>
            </AiOutputPanel>
          ) : (
            <div className="surface p-5 sm:p-6">
              <EmptyState
                icon={<Mail className="size-5" />}
                title="Your draft appears here"
                description="Describe the purpose and pick a tone, then generate your email."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
