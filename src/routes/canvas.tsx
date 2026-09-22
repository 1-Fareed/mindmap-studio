import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Check,
  Circle,
  Hand,
  Link2,
  Maximize,
  Plus,
  Redo2,
  Save,
  Square,
  Undo2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { MindMapNodeCard } from "@/components/canvas/MindMapNodeCard";
import { ConnectionLayer } from "@/components/canvas/ConnectionLayer";
import { useMindMapNodes } from "@/hooks/useMindMapNodes";
import { createMap, NODE_COLORS, NODE_HEIGHT, NODE_WIDTH, type NodeShape } from "@/lib/mindmap";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/canvas")({
  validateSearch: (search: Record<string, unknown>) => ({
    map: typeof search["map"] === "string" ? (search["map"] as string) : undefined,
  }),
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

const MIN_ZOOM = 0.3;
const MAX_ZOOM = 2.5;

function CanvasPage() {
  const { map: mapId } = Route.useSearch();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [connectMode, setConnectMode] = useState(false);
  const [connectSourceId, setConnectSourceId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const panStart = useRef<{ px: number; py: number; x: number; y: number } | null>(null);
  const [savedAt, setSavedAt] = useState(false);

  // No map in the URL yet: create a blank one and open it.
  useEffect(() => {
    if (mapId) return;
    const doc = createMap("Untitled map");
    void navigate({ to: "/canvas", search: { map: doc.id }, replace: true });
  }, [mapId, navigate]);

  const {
    nodes,
    connections,
    title,
    setTitle,
    selectedId,
    setSelectedId,
    addNode,
    updateNode,
    moveNode,
    removeNode,
    addConnection,
    setColor,
    setShape,
    snapshot,
    undo,
    redo,
    canUndo,
    canRedo,
    saveNow,
  } = useMindMapNodes(mapId ?? null);

  const selectedNode = nodes.find((n) => n.id === selectedId) ?? null;

  function zoomAtCenter(factor: number) {
    const bounds = canvasRef.current?.getBoundingClientRect();
    const cx = (bounds?.width ?? 800) / 2;
    const cy = (bounds?.height ?? 500) / 2;
    setZoom((z) => {
      const next = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z * factor));
      const k = next / z;
      setPan((p) => ({ x: cx - (cx - p.x) * k, y: cy - (cy - p.y) * k }));
      return next;
    });
  }

  function resetView() {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }

  function handleAddNode() {
    const bounds = canvasRef.current?.getBoundingClientRect();
    const width = bounds?.width ?? 800;
    const height = bounds?.height ?? 500;
    // Stagger new nodes around the visible centre so they never stack exactly.
    const step = (nodes.length % 8) * 28;
    const x = (width / 2 - pan.x) / zoom - NODE_WIDTH / 2 + step;
    const y = (height / 2 - pan.y) / zoom - NODE_HEIGHT / 2 + step;
    addNode(Math.round(x), Math.round(y));
  }

  function toggleConnectMode() {
    setConnectMode((on) => !on);
    setConnectSourceId(null);
  }

  function handleSave() {
    saveNow();
    setSavedAt(true);
    window.setTimeout(() => setSavedAt(false), 1600);
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

  function startPan(event: React.PointerEvent<HTMLDivElement>) {
    setSelectedId(null);
    setConnectSourceId(null);
    panStart.current = { px: event.clientX, py: event.clientY, x: pan.x, y: pan.y };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function movePan(event: React.PointerEvent<HTMLDivElement>) {
    const start = panStart.current;
    if (!start) return;
    setPan({ x: start.x + (event.clientX - start.px), y: start.y + (event.clientY - start.py) });
  }

  function endPan(event: React.PointerEvent<HTMLDivElement>) {
    panStart.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  const tools = [
    { label: "Add Node", icon: Plus, onClick: handleAddNode, disabled: false },
    { label: "Connect", icon: Link2, onClick: toggleConnectMode, disabled: false, active: connectMode },
    { label: "Undo", icon: Undo2, onClick: undo, disabled: !canUndo },
    { label: "Redo", icon: Redo2, onClick: redo, disabled: !canRedo },
    { label: "Zoom In", icon: ZoomIn, onClick: () => zoomAtCenter(1.2), disabled: zoom >= MAX_ZOOM },
    { label: "Zoom Out", icon: ZoomOut, onClick: () => zoomAtCenter(1 / 1.2), disabled: zoom <= MIN_ZOOM },
    { label: "Reset View", icon: Maximize, onClick: resetView, disabled: false },
    { label: "Save", icon: savedAt ? Check : Save, onClick: handleSave, disabled: false },
  ] as const;

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <input
              value={title}
              aria-label="Map title"
              onChange={(e) => setTitle(e.target.value)}
              className="w-full max-w-xs rounded-lg border border-transparent bg-transparent text-2xl font-semibold tracking-tight outline-none transition-colors hover:border-border focus:border-border"
            />
            <p className="text-sm text-muted-foreground">
              {nodes.length} {nodes.length === 1 ? "node" : "nodes"} ·{" "}
              {connections.length} {connections.length === 1 ? "connection" : "connections"} ·{" "}
              double-click a node to edit · drag the background to pan.
            </p>
            {connectMode && (
              <p className="mt-2 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <Link2 className="size-3.5" />
                {connectSourceId
                  ? "Connect mode — select target node"
                  : "Connect mode — select source node"}
              </p>
            )}
          </div>
          <span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-soft">
            Zoom {Math.round(zoom * 100)}%
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
          onPointerDown={startPan}
          onPointerMove={movePan}
          onPointerUp={endPan}
          onPointerCancel={endPan}
          className="relative h-[65vh] min-h-[420px] touch-none overflow-hidden rounded-3xl border border-border canvas-grid shadow-soft"
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

          <div
            className="absolute left-0 top-0 size-full origin-top-left"
            style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
          >
            <ConnectionLayer nodes={nodes} connections={connections} />

            {nodes.map((node) => (
              <MindMapNodeCard
                key={node.id}
                node={node}
                selected={node.id === selectedId}
                onSelect={handleNodeSelect}
                connectMode={connectMode}
                isConnectSource={node.id === connectSourceId}
                scale={zoom}
                onDragStart={snapshot}
                onTextChange={(id, text) => updateNode(id, { text })}
                onDelete={removeNode}
                onDragMove={moveNode}
              />
            ))}
          </div>

          <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 flex-wrap justify-center gap-1 rounded-2xl border border-border bg-card/95 p-1.5 shadow-lift backdrop-blur">
            {tools.map(({ label, icon: Icon, ...rest }) => (
              <button
                key={label}
                type="button"
                title={label}
                aria-label={label}
                aria-pressed={"active" in rest ? rest.active : undefined}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={"onClick" in rest ? rest.onClick : undefined}
                disabled={rest.disabled}
                className={cn(
                  "flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:bg-transparent disabled:hover:text-muted-foreground",
                  "active" in rest && rest.active && "bg-secondary text-foreground",
                )}
              >
                <Icon className="size-4" />
                <span className="hidden lg:inline">{label === "Save" && savedAt ? "Saved" : label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
