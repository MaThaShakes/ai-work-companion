import { useServerFn } from "@tanstack/react-start";
import { useCallback, useState } from "react";
import { toast } from "sonner";

import { generateAi } from "./ai.functions";
import type { AiKind, ChatTurn } from "./ai-prompts";
import { usePreferences } from "./preferences";

type RunArgs = {
  input: Record<string, string>;
  history?: ChatTurn[];
};

export function useAi(kind: AiKind) {
  const call = useServerFn(generateAi);
  const { countToolUse } = usePreferences();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"live" | "demo" | null>(null);

  const run = useCallback(
    async ({ input, history }: RunArgs): Promise<string | null> => {
      setLoading(true);
      try {
        const result = await call({ data: { kind, input, ...(history ? { history } : {}) } });
        setMode(result.mode);
        countToolUse();
        if (result.mode === "demo") {
          toast.info("Demo mode", {
            description: "No AI provider configured — showing sample output.",
          });
        }
        return result.text;
      } catch (error) {
        const message =
          error instanceof Error && error.message
            ? error.message
            : "Something went wrong. Please try again.";
        toast.error("Generation failed", { description: message });
        return null;
      } finally {
        setLoading(false);
      }
    },
    [call, kind, countToolUse],
  );

  return { run, loading, mode } as const;
}
