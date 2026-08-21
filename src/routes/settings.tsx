import { createFileRoute } from "@tanstack/react-router";
import { Monitor, Moon, ShieldCheck, Sun } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePreferences, type ResearchStyle, type ThemeMode, type Tone } from "@/lib/preferences";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — WorkMate AI" },
      {
        name: "description",
        content: "Manage appearance, AI defaults and review the responsible AI guidelines.",
      },
      { property: "og:title", content: "Settings — WorkMate AI" },
      {
        property: "og:description",
        content: "Appearance, AI preferences and responsible AI guidelines for WorkMate AI.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SettingsPage,
});

const THEMES: Array<{ value: ThemeMode; label: string; icon: typeof Sun }> = [
  { value: "light", label: "Light Mode", icon: Sun },
  { value: "dark", label: "Dark Mode", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

const GUIDELINES = [
  "AI outputs may contain errors or omissions — treat them as drafts, not final answers.",
  "Verify important facts, figures and commitments using reliable internal sources.",
  "Always review AI-generated emails for accuracy and tone before sending.",
  "Avoid entering confidential, personal or sensitive information unless your organization's policy permits it.",
  "Keep a human in the loop for decisions that affect people, budgets or contracts.",
];

function SettingsPage() {
  const { prefs, setPref } = usePreferences();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        subtitle="Tune appearance, AI defaults and responsible AI guidance."
      />

      <section className="surface p-5 sm:p-6">
        <h2 className="text-sm font-semibold text-foreground">Appearance</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Choose how WorkMate AI looks on this device.
        </p>
        <div className="mt-4 grid gap-2.5 sm:grid-cols-3">
          {THEMES.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setPref("theme", item.value)}
              aria-pressed={prefs.theme === item.value}
              className={cn(
                "flex items-center gap-3 rounded-xl border p-3.5 text-left transition-all duration-200 hover:-translate-y-0.5",
                prefs.theme === item.value
                  ? "border-primary bg-primary-subtle text-primary shadow-card"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40",
              )}
            >
              <item.icon className="size-4" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="surface p-5 sm:p-6">
        <h2 className="text-sm font-semibold text-foreground">AI Preferences</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Defaults applied when you open the AI tools.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Default email tone</Label>
            <Select
              value={prefs.defaultTone}
              onValueChange={(value) => setPref("defaultTone", value as Tone)}
            >
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(["Formal", "Friendly", "Persuasive"] as Tone[]).map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Default research output style</Label>
            <Select
              value={prefs.defaultResearchStyle}
              onValueChange={(value) => setPref("defaultResearchStyle", value as ResearchStyle)}
            >
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(
                  [
                    "Executive Brief",
                    "Detailed Overview",
                    "Actionable Recommendations",
                  ] as ResearchStyle[]
                ).map((item) => (
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
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary-subtle text-primary">
            <ShieldCheck className="size-4" />
          </span>
          <h2 className="text-sm font-semibold text-foreground">Responsible AI</h2>
        </div>
        <ul className="mt-4 space-y-2.5">
          {GUIDELINES.map((item) => (
            <li key={item} className="flex gap-2.5 text-sm text-muted-foreground">
              <span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-primary/60" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
