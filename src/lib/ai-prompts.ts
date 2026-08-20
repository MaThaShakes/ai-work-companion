export type AiKind = "email" | "meeting" | "planner" | "research" | "chat";

export type ChatTurn = { role: "user" | "assistant"; content: string };

export type AiRequest = {
  kind: AiKind;
  input: Record<string, string>;
  history?: ChatTurn[];
};

const BASE = `You are WorkMate AI, a concise workplace productivity assistant for professionals.
Write in clear, neutral business English. Never invent facts, names or figures that were not provided.
Use markdown headings (##) and bullet lists. Avoid filler and avoid emoji unless asked.`;

export function systemPrompt(kind: AiKind): string {
  switch (kind) {
    case "email":
      return `${BASE}
You draft professional workplace emails. Respond with exactly this shape:
Subject: <one concise subject line>

<email body with greeting, 1-3 short paragraphs, clear ask, and sign-off "Best regards,">
Do not add commentary or markdown headings.`;
    case "meeting":
      return `${BASE}
You summarize meeting notes. Respond in markdown with exactly these sections in this order:
## Summary
## Key Decisions
## Action Items
(one bullet per item formatted "Task — Owner — Status")
## Deadlines
## Follow-up
If information is missing, write "Not specified".`;
    case "planner":
      return `${BASE}
You build realistic schedules. Respond with ONLY time-block lines, one per line, in this exact pipe format:
HH:MM | Block title | high|medium|low | short rationale
Order blocks chronologically, respect stated fixed times and deadlines, include short breaks and a lunch block,
and start the day at 09:00 unless the user implies otherwise. No headings, no extra prose.`;
    case "research":
      return `${BASE}
You produce research briefs. Respond in markdown with exactly these sections in this order:
## Executive Summary
## Key Insights
## Important Findings
## Opportunities
## Risks & Limitations
## Recommendations
## Suggested Next Steps
Flag uncertainty explicitly rather than guessing.`;
    case "chat":
      return `${BASE}
You are the in-app workplace assistant. Help with email writing, task organization, meeting summaries,
scheduling, prioritization, brainstorming and research. Keep answers tight and actionable.
Ask at most one clarifying question when the request is truly ambiguous.`;
  }
}

export function userPrompt(req: AiRequest): string {
  const i = req.input;
  switch (req.kind) {
    case "email":
      return `Purpose: ${i.purpose}
Recipient context: ${i.recipient || "Not specified"}
Tone: ${i.tone || "professional"}
${i.notes ? `Additional notes: ${i.notes}` : ""}`;
    case "meeting":
      return `Meeting notes:\n\n${i.notes}`;
    case "planner":
      return `Planning horizon: ${i.horizon || "Today"}
Tasks and priorities:\n${i.tasks}`;
    case "research":
      return `Output style: ${i.style || "Executive Brief"}
Topic, question or source text:\n\n${i.topic}`;
    case "chat":
      return i.message ?? "";
  }
}

/** Polished offline output used when no AI provider is configured or a call fails. */
export function mockResponse(req: AiRequest): string {
  const i = req.input;
  switch (req.kind) {
    case "email":
      return `Subject: ${(i.purpose || "Quick follow-up").replace(/\.$/, "")}

Hi there,

I hope you're doing well. ${i.purpose || "I wanted to follow up on our recent conversation."} ${
        i.recipient ? `Given your role as ${i.recipient.toLowerCase()}, I've kept this brief.` : ""
      }

Could you let me know if this works on your side? I'm happy to adjust the details or jump on a short call if that's easier.

Best regards,
Your Name

(Demo mode: connect an AI provider for live generation.)`;
    case "meeting":
      return `## Summary
The team reviewed current progress, aligned on priorities and agreed on the next delivery checkpoint.

## Key Decisions
- Proceed with the current scope for this cycle
- Consolidate reporting into a single weekly update

## Action Items
- Share the revised timeline — Project lead — In progress
- Circulate the updated report — Analyst — Not started
- Confirm stakeholder availability — Operations — Blocked

## Deadlines
- Revised timeline: end of this week
- Updated report: next Monday

## Follow-up
- Schedule a 20-minute checkpoint mid-week
- Confirm owners for any unassigned item

_Demo mode: connect an AI provider for live generation._`;
    case "planner":
      return `09:00 | Deep work — highest priority task | high | Protected focus block before meetings
10:30 | Communication — emails and replies | medium | Batch responses in one pass
11:30 | Short break | low | Reset before midday
12:00 | Lunch / break | low | Step away from the screen
13:00 | Focused task work | high | Second energy peak of the day
14:00 | Team meeting | medium | Fixed commitment
15:00 | Presentation preparation | medium | Build on the morning's output
16:30 | Review and plan tomorrow | low | Close loops and set priorities`;
    case "research":
      return `## Executive Summary
${i.topic ? `A concise brief on: ${i.topic.slice(0, 160)}` : "A concise brief on the requested topic."}

## Key Insights
- The topic has clear near-term relevance for planning decisions
- Evidence quality varies, so treat directional claims carefully

## Important Findings
- Adoption is growing fastest where workflows are already digitized
- Cost and change management remain the leading blockers

## Opportunities
- Start with a narrow, measurable pilot
- Document outcomes to build an internal case

## Risks & Limitations
- Limited verified data in this demo response
- External conditions may change assumptions quickly

## Recommendations
- Define one success metric before investing further
- Review findings with a subject-matter expert

## Suggested Next Steps
- Collect two or three primary sources
- Draft a one-page proposal for review

_Demo mode: connect an AI provider for live generation._`;
    case "chat":
      return `Here's how I'd approach that:

- Clarify the outcome you need first
- Break it into two or three concrete steps
- Block time for the highest-impact step today

Tell me more and I'll draft it for you. _(Demo mode: connect an AI provider for live responses.)_`;
  }
}
