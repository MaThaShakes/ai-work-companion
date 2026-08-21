import { createFileRoute } from "@tanstack/react-router";
import { Bot, Eraser, Loader2, SendHorizonal, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { CopyButton } from "@/components/ai-output-panel";
import { MarkdownView } from "@/components/markdown-view";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { ChatTurn } from "@/lib/ai-prompts";
import { useLocalStorage } from "@/lib/storage";
import { useAi } from "@/lib/use-ai";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Workplace Assistant — WorkMate AI" },
      {
        name: "description",
        content:
          "Chat with your workplace assistant about emails, tasks, meetings, scheduling and research.",
      },
      { property: "og:title", content: "AI Workplace Assistant — WorkMate AI" },
      {
        property: "og:description",
        content: "A focused workplace assistant for drafting, planning and prioritizing.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ChatPage,
});

const SUGGESTIONS = [
  "Draft an email",
  "Plan my day",
  "Summarize these notes",
  "Help me prioritize my tasks",
] as const;

function ChatPage() {
  const { run, loading } = useAi("chat");
  const { value: messages, setValue: setMessages } = useLocalStorage<ChatTurn[]>(
    "workmate.chat.v1",
    [],
  );
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  const send = async (text: string) => {
    const message = text.trim();
    if (!message || loading) return;
    const history = messages.slice(-12);
    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setDraft("");
    const reply = await run({ input: { message }, history });
    if (reply) setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Workplace Assistant"
        subtitle="Your always-on partner for writing, planning and prioritizing."
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setMessages([]);
              toast.success("Conversation cleared");
            }}
            disabled={messages.length === 0}
          >
            <Eraser className="size-3.5" />
            Clear conversation
          </Button>
        }
      />

      <section className="surface flex h-[calc(100vh-19rem)] min-h-[28rem] flex-col overflow-hidden">
        <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
          {messages.length === 0 ? (
            <div className="mx-auto flex max-w-md flex-col items-center py-10 text-center">
              <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-raised">
                <Bot className="size-5" />
              </div>
              <p className="text-sm font-semibold text-foreground">
                How can I help with your work today?
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Ask about email writing, task organization, meeting summaries, scheduling,
                brainstorming or research.
              </p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "animate-rise flex gap-3",
                  message.role === "user" ? "justify-end" : "justify-start",
                )}
              >
                {message.role === "assistant" ? (
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary-subtle text-primary">
                    <Bot className="size-4" />
                  </span>
                ) : null}
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed sm:max-w-[75%]",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-muted/40",
                  )}
                >
                  {message.role === "assistant" ? (
                    <>
                      <MarkdownView content={message.content} />
                      <div className="mt-3">
                        <CopyButton text={message.content} />
                      </div>
                    </>
                  ) : (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  )}
                </div>
                {message.role === "user" ? (
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                    <User className="size-4" />
                  </span>
                ) : null}
              </div>
            ))
          )}

          {loading ? (
            <div className="flex items-center gap-2 text-sm text-primary">
              <Loader2 className="size-4 animate-spin" />
              Thinking...
            </div>
          ) : null}
          <div ref={endRef} />
        </div>

        <div className="border-t border-border bg-card p-4 sm:p-5">
          <div className="mb-3 flex flex-wrap gap-2">
            {SUGGESTIONS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setDraft(item)}
                className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors duration-200 hover:border-primary/40 hover:text-foreground"
              >
                {item}
              </button>
            ))}
          </div>
          <div className="flex items-end gap-2">
            <Textarea
              value={draft}
              rows={1}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  void send(draft);
                }
              }}
              placeholder="Ask your workplace assistant..."
              className="max-h-32 min-h-11 flex-1 resize-none py-3"
            />
            <Button
              size="icon"
              className="size-11 shrink-0"
              aria-label="Send message"
              onClick={() => void send(draft)}
              disabled={loading || draft.trim().length === 0}
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <SendHorizonal className="size-4" />
              )}
            </Button>
          </div>
          <p className="mt-2.5 text-[11px] text-muted-foreground">
            Responses may contain errors. Avoid sharing confidential information.
          </p>
        </div>
      </section>
    </div>
  );
}
