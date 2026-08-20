import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bot,
  CalendarClock,
  LayoutDashboard,
  ListChecks,
  Mail,
  Menu,
  Moon,
  NotebookPen,
  Search,
  Settings,
  Sparkles,
  Sun,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { usePreferences } from "@/lib/preferences";
import { cn } from "@/lib/utils";

export const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/tasks", label: "Tasks", icon: ListChecks },
  { to: "/email", label: "Smart Email Generator", icon: Mail },
  { to: "/meeting-notes", label: "Meeting Notes", icon: NotebookPen },
  { to: "/planner", label: "AI Task Planner", icon: CalendarClock },
  { to: "/research", label: "AI Research Assistant", icon: Search },
  { to: "/chat", label: "AI Chatbot", icon: Bot },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

function Brand() {
  return (
    <div className="flex items-center gap-3 px-2">
      <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-raised">
        <span className="text-sm font-bold tracking-tight">AI</span>
      </div>
      <div className="leading-tight">
        <p className="text-sm font-semibold text-sidebar-foreground">WorkMate AI</p>
        <p className="text-xs text-muted-foreground">Productivity workspace</p>
      </div>
    </div>
  );
}

function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { prefs, setPref, resolvedTheme } = usePreferences();
  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size={compact ? "icon" : "default"}
      aria-label="Toggle dark mode"
      onClick={() => setPref("theme", isDark ? "light" : "dark")}
      className={cn(
        "text-muted-foreground hover:text-foreground",
        !compact && "w-full justify-start gap-3 rounded-lg px-3",
      )}
    >
      {isDark ? <Moon className="size-4" /> : <Sun className="size-4" />}
      {!compact && <span className="text-sm">{isDark ? "Dark mode" : "Light mode"}</span>}
      {!compact && (
        <span className="ml-auto text-[11px] uppercase tracking-wide text-muted-foreground">
          {prefs.theme}
        </span>
      )}
    </Button>
  );
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-1 flex-col gap-1">
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          activeOptions={{ exact: item.to === "/" }}
          className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[status=active]:bg-sidebar-accent data-[status=active]:text-sidebar-accent-foreground"
        >
          <item.icon className="size-4 shrink-0 transition-transform duration-200 group-hover:scale-110" />
          <span className="truncate">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}

function SidebarInner({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col gap-6 p-4">
      <div className="pt-2">
        <Brand />
      </div>
      <NavList onNavigate={onNavigate} />
      <div className="space-y-3 border-t border-sidebar-border pt-3">
        <ThemeToggle />
        <p className="px-3 pb-1 text-[11px] leading-relaxed text-muted-foreground">
          AI outputs may contain errors. Review before sharing externally.
        </p>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => setOpen(false), [pathname]);

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-sidebar-border bg-sidebar lg:block">
        <SidebarInner />
      </aside>

      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-background/85 px-4 py-3 backdrop-blur lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" aria-label="Open navigation">
              <Menu className="size-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 bg-sidebar p-0">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <SidebarInner onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-[11px] font-bold text-primary-foreground">
            AI
          </div>
          <span className="text-sm font-semibold">WorkMate AI</span>
        </div>
        <div className="ml-auto">
          <ThemeToggle compact />
        </div>
      </header>

      <main className="lg:pl-64">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
          {children}
        </div>
        <footer className="mx-auto w-full max-w-6xl px-4 pb-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-2 border-t border-border pt-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-2">
              <Sparkles className="size-3.5 text-primary" />
              WorkMate AI — Responsible AI: verify important information and avoid entering
              confidential data.
            </p>
            <Link to="/settings" className="font-medium text-primary hover:underline">
              Responsible AI guidelines
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
