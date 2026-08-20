import { Fragment } from "react";

function inline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|_[^_]+_)/g).filter(Boolean);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("_") && part.endsWith("_")) {
      return (
        <em key={i} className="text-muted-foreground">
          {part.slice(1, -1)}
        </em>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

/** Minimal markdown renderer for AI section output (headings, bullets, paragraphs). */
export function MarkdownView({ content }: { content: string }) {
  const lines = content.split("\n");
  const blocks: Array<{ type: "h" | "p" | "ul"; items: string[] }> = [];

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) continue;
    if (/^#{1,6}\s/.test(line)) {
      blocks.push({ type: "h", items: [line.replace(/^#{1,6}\s/, "")] });
      continue;
    }
    if (/^([-*]|\d+\.)\s/.test(line.trim())) {
      const item = line.trim().replace(/^([-*]|\d+\.)\s/, "");
      const last = blocks[blocks.length - 1];
      if (last?.type === "ul") last.items.push(item);
      else blocks.push({ type: "ul", items: [item] });
      continue;
    }
    blocks.push({ type: "p", items: [line] });
  }

  return (
    <div className="space-y-4 text-sm leading-relaxed text-foreground">
      {blocks.map((block, i) => {
        if (block.type === "h") {
          return (
            <h3
              key={i}
              className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary"
            >
              {block.items[0]}
            </h3>
          );
        }
        if (block.type === "ul") {
          return (
            <ul key={i} className="space-y-2">
              {block.items.map((item, j) => (
                <li key={j} className="flex gap-2.5">
                  <span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-primary/60" />
                  <span>{inline(item)}</span>
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="text-muted-foreground">
            {inline(block.items[0] ?? "")}
          </p>
        );
      })}
    </div>
  );
}
