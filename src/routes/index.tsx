import { createFileRoute, Link } from "@tanstack/react-router";
import { Network, Plus, Sparkles } from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "My Maps — Mind Mapping Studio" },
      {
        name: "description",
        content:
          "Create, organise and revisit your mind maps from one clean dashboard built for students.",
      },
      { property: "og:title", content: "My Maps — Mind Mapping Studio" },
      {
        property: "og:description",
        content: "Create, organise and revisit your mind maps from one clean dashboard.",
      },
    ],
  }),
  component: Dashboard,
});

type MindMap = { id: string; title: string; nodeCount: number; updatedAt: string };

const maps: MindMap[] = [];

function Dashboard() {
  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">My Maps</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              All your mind maps stay right here in this browser.
            </p>
          </div>
          <Link
            to="/canvas"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
          >
            <Plus className="size-4" />
            New Map
          </Link>
        </div>

        {maps.length === 0 ? (
          <div className="mt-10 flex flex-col items-center rounded-3xl border border-dashed border-border bg-card px-6 py-16 text-center shadow-soft">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
              <Network className="size-7" />
            </span>
            <h2 className="mt-5 text-lg font-semibold">No mind maps yet — create your first one!</h2>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Start from a blank canvas or pick a ready-made template to get moving faster.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <Link
                to="/canvas"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Plus className="size-4" />
                New Map
              </Link>
              <Link
                to="/templates"
                className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
              >
                <Sparkles className="size-4" />
                Browse templates
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {maps.map((map) => (
              <Link
                key={map.id}
                to="/canvas"
                className="rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift"
              >
                <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                  <Network className="size-5" />
                </span>
                <h3 className="mt-4 text-base font-semibold">{map.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {map.nodeCount} nodes · updated {map.updatedAt}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
