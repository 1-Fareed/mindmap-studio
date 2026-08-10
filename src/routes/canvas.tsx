import { createFileRoute } from "@tanstack/react-router";
import { Circle, Hand, Link2, Plus, Redo2, Save, Square, Undo2, ZoomIn, ZoomOut } from "lucide-react";
import { useRef, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { MindMapNodeCard } from "@/components/canvas/MindMapNodeCard";
import { ConnectionLayer } from "@/components/canvas/ConnectionLayer";
import { useMindMapNodes } from "@/hooks/useMindMapNodes";
import { NODE_COLORS, NODE_HEIGHT, NODE_WIDTH, type NodeShape } from "@/lib/mindmap";
import { cn } from "@/lib/utils";

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

const shapeOptions: { value: NodeShape; label: string; icon: typeof Square }[] = [
  { value: "rounded", label: "Rounded", icon: Square },
  { value: "circle", label: "Circle", icon: Circle },
];

function CanvasPage() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [connectMode, setConnectMode] = useState(false);
  const [connectSourceId, setConnectSourceId] = useState<string | null>(null);
  const {
    nodes,
    connections,
    selectedId,
    setSelectedId,
    addNode,
    updateNode,
    moveNode,
    removeNode,
    addConnection,
    setColor,
    setShape,
  } = useMindMapNodes();

  const selectedNode = nodes.find((n) => n.id === selectedId) ?? null;

  function handleAddNode() {
    const bounds = canvasRef.current?.getBoundingClientRect();
    const width = bounds?.width ?? 800;
    const height = bounds?.height ?? 500;
    // Stagger new nodes around the centre so they never stack exactly.
    const step = (nodes.length % 8) * 28;
    const x = Math.max(8, Math.min(width - NODE_WIDTH - 8, width / 2 - NODE_WIDTH / 2 + step));
    const y = Math.max(8, Math.min(height - NODE_HEIGHT - 8, height / 2 - NODE_HEIGHT / 2 + step));
    addNode(x, y);
  }

  function toggleConnectMode() {
    setConnectMode((on) => !on);
    setConnectSourceId(null);
  }

  function handleNodeSelect(id: string) {
    if (!connectMode) {
      setSelectedId(id);
      return;
    }
    if (connectSourceId === null) {
      setConnectSourceId(id);
      setSelectedId(id);
      return;
    }
    if (connectSourceId !== id) addConnection(connectSourceId, id);
    setConnectSourceId(null);
  }

  const tools = [
    { label: "Add Node", icon: Plus, onClick: handleAddNode, disabled: false },
    { label: "Connect", icon: Link2, onClick: toggleConnectMode, disabled: false, active: connectMode },
    { label: "Undo", icon: Undo2, disabled: true },
    { label: "Redo", icon: Redo2, disabled: true },
    { label: "Zoom In", icon: ZoomIn, disabled: true },
    { label: "Zoom Out", icon: ZoomOut, disabled: true },
    { label: "Save", icon: Save, disabled: true },
  ] as const;

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Canvas Editor</h1>
            <p className="text-sm text-muted-foreground">
              Untitled map · {nodes.length} {nodes.length === 1 ? "node" : "nodes"} ·{" "}
              {connections.length} {connections.length === 1 ? "connection" : "connections"} ·{" "}
              {connectMode
                ? connectSourceId
                  ? "Now click the target node."
                  : "Connect mode: click the source node."
                : "double-click a node to edit its text."}
            </p>
          </div>
          <span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-soft">
            Zoom 100%
          </span>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-soft">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {selectedNode ? "Selected node" : "Select a node to style it"}
          </span>
          <div className="flex items-center gap-1.5">
            {NODE_COLORS.map((color) => (
              <button
                key={color.value}
                type="button"
                title={color.label}
                aria-label={`Set colour ${color.label}`}
                disabled={!selectedNode}
                onClick={() => selectedNode && setColor(selectedNode.id, color.value)}
                className={cn(
                  "size-7 rounded-full border-2 transition-transform disabled:cursor-not-allowed disabled:opacity-40",
                  !selectedNode ? "" : "hover:scale-110",
                  selectedNode?.color === color.value && "ring-2 ring-ring ring-offset-2 ring-offset-card",
                )}
                style={{
                  backgroundColor: `var(--node-${color.value})`,
                  borderColor: `var(--node-${color.value}-border)`,
                }}
              />
            ))}
          </div>
          <div className="flex items-center gap-1 rounded-xl border border-border p-1">
            {shapeOptions.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                title={label}
                aria-label={`Set shape ${label}`}
                disabled={!selectedNode}
                onClick={() => selectedNode && setShape(selectedNode.id, value)}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40",
                  selectedNode?.shape === value && "bg-secondary text-foreground",
                )}
              >
                <Icon className="size-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div
          ref={canvasRef}
          onPointerDown={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedId(null);
              setConnectSourceId(null);
            }
          }}
          className="relative h-[65vh] min-h-[420px] overflow-hidden rounded-3xl border border-border canvas-grid shadow-soft"
        >
          {nodes.length === 0 && (
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
                <Hand className="size-6" />
              </span>
              <p className="text-sm font-medium">Your workspace is empty</p>
              <p className="max-w-xs text-xs text-muted-foreground">
                Use the toolbar below to add your first node, then drag it anywhere on the canvas.
              </p>
            </div>
          )}

          <ConnectionLayer nodes={nodes} connections={connections} />

          {nodes.map((node) => (
            <MindMapNodeCard
              key={node.id}
              node={node}
              selected={node.id === selectedId}
              onSelect={handleNodeSelect}
              connectMode={connectMode}
              isConnectSource={node.id === connectSourceId}
              onTextChange={(id, text) => updateNode(id, { text })}
              onDelete={removeNode}
              onDragMove={moveNode}
            />
          ))}

          <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 flex-wrap justify-center gap-1 rounded-2xl border border-border bg-card/95 p-1.5 shadow-lift backdrop-blur">
            {tools.map(({ label, icon: Icon, ...rest }) => (
              <button
                key={label}
                type="button"
                title={label}
                aria-label={label}
                aria-pressed={"active" in rest ? rest.active : undefined}
                onClick={"onClick" in rest ? rest.onClick : undefined}
                disabled={rest.disabled}
                className={cn(
                  "flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:bg-transparent disabled:hover:text-muted-foreground",
                  "active" in rest && rest.active && "bg-secondary text-foreground",
                )}
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
