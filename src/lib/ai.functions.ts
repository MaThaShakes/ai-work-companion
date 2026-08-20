import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { mockResponse, systemPrompt, userPrompt, type AiRequest } from "./ai-prompts";

const requestSchema = z.object({
  kind: z.enum(["email", "meeting", "planner", "research", "chat"]),
  input: z.record(z.string(), z.string()).default({}),
  history: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() }))
    .max(30)
    .optional(),
});

export const generateAi = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => requestSchema.parse(input))
  .handler(async ({ data }) => {
    const req = data as AiRequest;
    const apiKey = process.env["LOVABLE_API_KEY"];

    if (!apiKey) {
      return { text: mockResponse(req), mode: "demo" as const };
    }

    const messages = [
      { role: "system", content: systemPrompt(req.kind) },
      ...(req.history ?? []).map((turn) => ({ role: turn.role, content: turn.content })),
      { role: "user", content: userPrompt(req) },
    ];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "X-Lovable-AIG-SDK": "fetch",
      },
      body: JSON.stringify({ model: "google/gemini-2.5-flash", messages }),
    });

    if (!response.ok) {
      const body = await response.text();
      if (response.status === 429) {
        throw new Error("The assistant is busy right now. Please try again in a moment.");
      }
      if (response.status === 402 || response.status === 403) {
        throw new Error(
          "AI generation is unavailable for this workspace. Showing demo content instead is possible from Settings.",
        );
      }
      console.error("AI gateway error", response.status, body);
      throw new Error("The assistant could not complete that request. Please try again.");
    }

    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const text = payload.choices?.[0]?.message?.content?.trim();
    if (!text) {
      throw new Error("The assistant returned an empty response. Please try again.");
    }

    return { text, mode: "live" as const };
  });
