# AI Work Companion

Build: AI Workplace Productivity Assistant

Create a modern, responsive SaaS web application called “AI Workplace Productivity Assistant”.

The application is an all-in-one AI productivity workspace for professionals. It should help users manage tasks, generate professional emails, summarize meetings, plan their schedules, research topics, and interact with an AI workplace assistant.

The design should feel like a polished commercial SaaS product — clean, minimal, professional, calming, and modern. Do NOT make it look like a generic AI chatbot.

1. Overall Design Direction

Use a calming blue and white color palette.

Colors

Primary: #2563EB

Secondary blue: #3B82F6

Light blue: #EFF6FF

Background: #F8FAFC

White: #FFFFFF

Main text: #172033

Secondary text: #64748B

Borders: #E2E8F0

Success: #16A34A

Include a fully functional Dark Mode using a dark navy/blue color palette.

Use:

Rounded cards

Subtle shadows

Thin borders

Plenty of whitespace

Modern typography

Clean icons

Smooth hover states

Subtle animations

Professional SaaS styling

Avoid:

Excessive gradients

Overly colorful UI

Cartoon-style illustrations

Cluttered layouts

Huge text

Excessive glassmorphism

The interface should feel similar in quality to modern products such as Notion, Linear, ClickUp, or Slack, while maintaining its own visual identity.

2. Application Layout

Create a persistent left sidebar navigation.

Sidebar

At the top:

AI
WorkMate AI

Use a small blue rounded-square AI logo.

Navigation items:

Dashboard

Tasks

Smart Email Generator

Meeting Notes

AI Task Planner

AI Research Assistant

AI Chatbot

At the bottom:

Dark Mode toggle

The sidebar should collapse responsively on smaller screens.

On mobile, convert the sidebar into a mobile navigation/menu.

3. Dashboard

Create a professional productivity dashboard.

Header:

Good morning/afternoon/evening 👋

Subtitle:

“Your AI-powered workplace productivity hub.”

Include a user avatar/profile area on the right.

Statistics cards

Display four cards:

Open Tasks
Number of incomplete tasks.

Completed
Number of completed tasks.

AI Tools Used
Number of AI tools used during the session.

Productivity Score
Example: 86%

Each card should contain:

Icon

Number

Small descriptive text

Optional trend indicator

Dashboard Main Content

Create a two-column layout.

Left: Today's Tasks

Display the user's tasks.

Each task should have:

Checkbox

Task name

Category badge

Completion status

Delete/edit action

Example:

Complete monthly report — Work

Reply to client email — Urgent

Review presentation — Work

Study financial analysis — Learning

Allow users to mark tasks as completed.

Completed tasks should visually change using a strikethrough and muted styling.

Right: AI Quick Actions

Create attractive action cards:

Generate an Email
“Create a polished professional message.”

Summarize Meeting Notes
“Extract decisions, action items and deadlines.”

Plan My Day
“Turn priorities into a focused schedule.”

Research a Topic
“Generate a concise research brief.”

Clicking each card should navigate to the appropriate feature.

4. Task Management

Create a dedicated Tasks page.

At the top:

Task Management

Subtitle:

“Organize your work and stay focused.”

Provide an input:

Add a new task...

Include a category selector:

Work

Personal

Urgent

Learning

Add an Add Task button.

Tasks should appear in a clean list.

Each task should support:

Mark complete

Edit

Delete

Category

Priority

Add filtering:

All | Work | Personal | Urgent | Learning

Add sorting options such as:

Priority

Newest

Completed

Category

Persist tasks using local storage or Supabase so tasks remain available after refreshing.

5. Smart Email Generator

Create a dedicated page called:

Smart Email Generator

Subtitle:

“Generate professional workplace emails in seconds.”

Create a form containing:

Purpose

Input example:

“Ask a client to approve the proposal.”

Recipient Context

Input example:

“Existing client, senior stakeholder.”

Tone

Use selectable buttons/cards:

Formal
Professional and structured.

Friendly
Warm and approachable.

Persuasive
Confident and convincing.

Allow only one tone to be selected at a time.

Add:

Generate Email

button.

Email Output

After generation, display an editable output panel.

Include:

Subject

Email body

Copy button

Regenerate button

Edit functionality

The generated content must be editable directly by the user.

Add a small responsible AI disclaimer:

“Review AI-generated content for accuracy, confidentiality, tone and appropriateness before sending.”

6. Meeting Notes Summarizer

Create a page:

Meeting Notes Summarizer

Subtitle:

“Turn lengthy meeting notes into clear, actionable summaries.”

Left side:

Large textarea:

Paste your meeting notes here...

Button:

Summarize Notes

Right side:

Display structured results:

Summary

Short overview of the meeting.

Key Decisions

List important decisions.

Action Items

Each action item should contain:

Task

Owner

Status

Deadlines

Display extracted deadlines.

Follow-up

Display recommended follow-up actions.

Allow the generated output to be edited.

Include:

Copy Summary

and

Regenerate

buttons.

7. AI Task Planner

Create a page:

AI Task Planner

Subtitle:

“Turn your priorities into an organized schedule.”

Input:

What do you need to accomplish?

Allow users to enter multiple tasks.

Example:

Finish monthly report by 3 PM

Reply to client

Prepare presentation

Study for one hour

Attend team meeting at 2 PM

Add:

Planning Horizon

Options:

Today

This Week

Add:

Generate Schedule

button.

Schedule Output

Create a visually appealing timeline.

Example:

09:00
Deep work — Monthly report

10:30
Client communication

12:00
Lunch / break

14:00
Team meeting

15:00
Presentation preparation

Use priority indicators:

🔴 High
🟡 Medium
🟢 Low

The AI should prioritize tasks based on:

Urgency

Importance

Deadline

Estimated effort

Allow users to edit the generated schedule.

8. AI Research Assistant

Create a page:

AI Research Assistant

Subtitle:

“Research topics, summarize information and generate actionable insights.”

Input:

Enter a topic, question or article...

Allow users to paste text or enter a research question.

Add output style options:

Executive Brief

Detailed Overview

Actionable Recommendations

Button:

Generate Research Brief

Research Output

Display:

Executive Summary

Key Insights

Important Findings

Opportunities

Risks & Limitations

Recommendations

Suggested Next Steps

Make the output editable.

Include Copy and Regenerate buttons.

Add a responsible AI notice:

“AI-generated research may contain errors or incomplete information. Verify important facts using reliable sources.”

9. AI Chatbot

Create a dedicated:

AI Workplace Assistant

The interface should look like a polished workplace AI assistant rather than a generic chatbot.

Include:

Chat history

User messages

AI responses

Message input

Send button

Clear conversation button

Placeholder:

“Ask your workplace assistant...”

The assistant should be designed to help with:

Email writing

Task organization

Meeting summaries

Scheduling

Brainstorming

Research

Workplace productivity

Include suggested prompts above the input:

Draft an email
Plan my day
Summarize these notes
Help me prioritize my tasks

10. AI Interaction Design

Structure all AI features around clear prompts.

Use a reusable AI service/component so the application does not duplicate AI logic unnecessarily.

Create structured prompts for:

Email Generation

Inputs:

Purpose

Recipient context

Tone

Output:

Subject

Email body

Meeting Summarization

Output:

Summary

Decisions

Action items

Deadlines

Follow-up

Task Planning

Input:

Tasks

Deadlines

Priorities

Planning horizon

Output:

Prioritized schedule

Time blocks

Priority levels

Research

Input:

Topic/article

Output style

Output:

Summary

Insights

Recommendations

Risks

11. AI Provider

Build the application so it can connect to an AI API.

Use environment variables for API keys.

Do NOT expose API keys in frontend code.

Structure the AI integration so that it can later connect to OpenAI or another compatible AI provider.

If an AI API is not configured, provide a polished demo/mock mode so the application remains functional during development.

12. Responsible AI

Include responsible AI messaging throughout the application.

The application should remind users:

AI outputs may contain errors.

Users should verify important information.

Users should review AI-generated emails before sending.

Users should avoid entering confidential or sensitive information unless their organization's policy permits it.

Create a small Responsible AI section in the settings/footer.

13. Responsive Design

The entire application must be responsive.

Desktop:

Fixed sidebar

Multi-column dashboard

Spacious cards

Tablet:

Collapsible sidebar

Responsive grids

Mobile:

Mobile navigation

Single-column cards

Full-width forms

Touch-friendly buttons

Chat interface optimized for mobile

Make sure there is no horizontal scrolling.

14. UX Details

Add polished micro-interactions:

Button hover states

Card hover states

Loading states when AI is generating

Skeleton loaders where appropriate

Success notifications

Error notifications

Empty states

Smooth page transitions

When AI generation is running, show:

Generating...

with an animated loading indicator.

After generation, show a subtle success state.

15. Settings

Create a simple settings area containing:

Appearance

Light Mode

Dark Mode

System

AI Preferences

Default email tone

Default research output style

Responsible AI

Display the responsible AI guidelines.

16. Technical Requirements

Use a modern frontend architecture.

Preferred stack:

React

TypeScript

Tailwind CSS

shadcn/ui

Lucide icons

Use reusable components.

Create reusable components for:

Sidebar

Header

Cards

Buttons

Forms

Task items

AI output panels

Loading states

Toast notifications

Modal dialogs

Use clean component organization.

Avoid putting the entire application into one component.

17. Important Implementation Requirement

The application must be functional, not just a static UI mockup.

Users must be able to:

Add tasks

Delete tasks

Edit tasks

Mark tasks complete

Filter tasks

Toggle dark mode

Navigate between pages

Enter AI prompts

Generate outputs

Edit generated outputs

Copy generated outputs

Use the chatbot

View loading states

Receive error/success feedback

Persist user tasks and preferences.

18. Visual Quality Requirement

Make the final application look like a real premium SaaS productivity product, not a student project or basic dashboard template.

Prioritize:

Clean → Professional → Minimal → Intelligent → Calm → Easy to use

Use consistent spacing, typography, border radius, iconography and component styling throughout the entire application.

The dashboard should immediately communicate:

“This is an AI-powered professional productivity workspace.”

Before finishing, test every navigation item, form, button, task interaction, dark mode toggle and responsive layout.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/3eefb924-3b19-49b2-9874-2af8522256d7).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
