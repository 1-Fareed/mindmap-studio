import { createFileRoute } from "@tanstack/react-router";
import {
  Hand,
  Link2,
  Plus,
  Redo2,
  Save,
  Undo2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/canvas")({
  head: () => ({
    meta: [
      { title: "Canvas Editor — Mind Mapping Studio" },
      {
        name: "description",
        content: "Sketch ideas on an infinite canvas with nodes, connections and zoom controls.",
      },
      { property: "og:title", content: "Canvas Editor — Mind Mapping Studio" },
      {
        property: "og:description",
        content: "Sketch ideas on an infinite canvas with nodes, connections and zoom controls.",
      },
    ],
  }),
  component: CanvasPage,
});

const tools = [
  { label: "Add Node", icon: Plus },
  { label: "Connect", icon: Link2 },
  { label: "Undo", icon: Undo2 },
  { label: "Redo", icon: Redo2 },
  { label: "Zoom In", icon: ZoomIn },
  { label: "Zoom Out", icon: ZoomOut },
  { label: "Save", icon: Save },
];

function CanvasPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Canvas Editor</h1>
            <p className="text-sm text-muted-foreground">
              Untitled map · workspace is ready for nodes and connections.
            </p>
          </div>
          <span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-soft">
            Zoom 100%
          </span>
        </div>

        <div className="relative h-[65vh] min-h-[420px] overflow-hidden rounded-3xl border border-border canvas-grid shadow-soft">
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
              <Hand className="size-6" />
            </span>
            <p className="text-sm font-medium">Your workspace is empty</p>
            <p className="max-w-xs text-xs text-muted-foreground">
              Use the toolbar below to add your first node. Dragging, connecting and zooming come next.
            </p>
          </div>

          <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 flex-wrap justify-center gap-1 rounded-2xl border border-border bg-card/95 p-1.5 shadow-lift backdrop-blur">
            {tools.map(({ label, icon: Icon }) => (
              <button
                key={label}
                type="button"
                title={label}
                aria-label={label}
                className="flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <Icon className="size-4" />
                <span className="hidden lg:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}