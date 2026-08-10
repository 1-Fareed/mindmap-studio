import { Link } from "@tanstack/react-router";
import { Brain, LayoutGrid, PenLine, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutGrid },
  { to: "/canvas", label: "Canvas Editor", icon: PenLine },
  { to: "/templates", label: "Templates", icon: Sparkles },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-soft">
              <Brain className="size-5" />
            </span>
            <span className="text-base font-semibold tracking-tight">Mind Mapping Studio</span>
          </Link>
          <nav className="ml-auto flex items-center gap-1 rounded-full border border-border bg-card p-1 shadow-soft">
            {navItems.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                activeOptions={{ exact: to === "/" }}
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                activeProps={{
                  className: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                }}
              >
                <Icon className="size-4" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}