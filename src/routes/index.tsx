import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Network, Plus, Sparkles, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { createMap, deleteMap, loadMaps, type MindMapDoc } from "@/lib/mindmap";

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

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function Dashboard() {
  const navigate = useNavigate();
  const [maps, setMaps] = useState<MindMapDoc[]>([]);

  useEffect(() => {
    setMaps(loadMaps().sort((a, b) => b.updatedAt - a.updatedAt));
  }, []);

  function handleNewMap() {
    const doc = createMap("Untitled map");
    void navigate({ to: "/canvas", search: { map: doc.id } });
  }

  function handleDelete(id: string) {
    deleteMap(id);
    setMaps((prev) => prev.filter((m) => m.id !== id));
  }

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
          <button
            type="button"
            onClick={handleNewMap}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
          >
            <Plus className="size-4" />
            New Map
          </button>
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
              <button
                type="button"
                onClick={handleNewMap}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Plus className="size-4" />
                New Map
              </button>
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
              <article
                key={map.id}
                className="group relative rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift"
              >
                <button
                  type="button"
                  onClick={() => void navigate({ to: "/canvas", search: { map: map.id } })}
                  className="block w-full text-left"
                >
                  <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                    <Network className="size-5" />
                  </span>
                  <h3 className="mt-4 text-base font-semibold">{map.title || "Untitled map"}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {map.nodes.length} {map.nodes.length === 1 ? "node" : "nodes"} ·{" "}
                    {map.connections.length}{" "}
                    {map.connections.length === 1 ? "connection" : "connections"} · updated{" "}
                    {formatDate(map.updatedAt)}
                  </p>
                </button>
                <button
                  type="button"
                  aria-label={`Delete ${map.title}`}
                  onClick={() => handleDelete(map.id)}
                  className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground opacity-0 transition-all hover:border-destructive hover:text-destructive focus:opacity-100 group-hover:opacity-100"
                >
                  <Trash2 className="size-4" />
                </button>
              </article>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
