import { Check, Copy, Loader2, Pencil, RefreshCw, Eye } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export function GeneratingState({ label = "Generating..." }: { label?: string }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-primary">
        <Loader2 className="size-4 animate-spin" />
        {label}
      </div>
      <div className="space-y-2.5">
        <Skeleton className="h-3.5 w-2/5" />
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-11/12" />
        <Skeleton className="h-3.5 w-3/4" />
        <Skeleton className="h-3.5 w-1/3" />
        <Skeleton className="h-3.5 w-4/5" />
      </div>
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border px-6 py-14 text-center">
      <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-primary-subtle text-primary">
        {icon}
      </div>
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="mt-1 max-w-xs text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(timer);
  }, [copied]);

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          toast.success("Copied to clipboard");
        } catch {
          toast.error("Could not copy", { description: "Clipboard access was blocked." });
        }
      }}
    >
      {copied ? <Check className="size-3.5 text-success" /> : <Copy className="size-3.5" />}
      {copied ? "Copied" : label}
    </Button>
  );
}

/** Editable AI result panel with preview/edit modes, copy and regenerate. */
export function AiOutputPanel({
  title,
  value,
  onChange,
  onRegenerate,
  loading,
  disclaimer,
  copyLabel = "Copy",
  children,
  rows = 16,
}: {
  title: string;
  value: string;
  onChange: (next: string) => void;
  onRegenerate?: () => void;
  loading?: boolean;
  disclaimer?: string;
  copyLabel?: string;
  /** Rendered preview of the output; falls back to plain text. */
  children?: ReactNode;
  rows?: number;
}) {
  const [editing, setEditing] = useState(false);

  return (
    <section className="surface animate-rise p-5 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
          <span className="rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success">
            Ready
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setEditing((prev) => !prev)}
          >
            {editing ? <Eye className="size-3.5" /> : <Pencil className="size-3.5" />}
            {editing ? "Preview" : "Edit"}
          </Button>
          <CopyButton text={value} label={copyLabel} />
          {onRegenerate ? (
            <Button type="button" variant="secondary" size="sm" onClick={onRegenerate}>
              <RefreshCw className={cn("size-3.5", loading && "animate-spin")} />
              Regenerate
            </Button>
          ) : null}
        </div>
      </div>

      {editing ? (
        <Textarea
          value={value}
          rows={rows}
          onChange={(event) => onChange(event.target.value)}
          className="min-h-64 resize-y font-mono text-[13px] leading-relaxed"
        />
      ) : (
        (children ?? <p className="whitespace-pre-wrap text-sm leading-relaxed">{value}</p>)
      )}

      {disclaimer ? (
        <p className="mt-5 rounded-lg border border-border bg-muted/60 px-3 py-2.5 text-[11px] leading-relaxed text-muted-foreground">
          {disclaimer}
        </p>
      ) : null}
    </section>
  );
}
