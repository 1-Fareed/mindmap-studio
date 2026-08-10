import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CIRCLE_SIZE, NODE_HEIGHT, NODE_WIDTH, type MindMapNode } from "@/lib/mindmap";
import { cn } from "@/lib/utils";

type Props = {
  node: MindMapNode;
  selected: boolean;
  onSelect: (id: string) => void;
  onTextChange: (id: string, text: string) => void;
  onDelete: (id: string) => void;
  onDragMove: (id: string, x: number, y: number) => void;
  connectMode?: boolean;
  isConnectSource?: boolean;
};

export function MindMapNodeCard({
  node,
  selected,
  onSelect,
  onTextChange,
  onDelete,
  onDragMove,
  connectMode = false,
  isConnectSource = false,
}: Props) {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const dragOffset = useRef<{ dx: number; dy: number } | null>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const isCircle = node.shape === "circle";
  const width = isCircle ? CIRCLE_SIZE : NODE_WIDTH;
  const height = isCircle ? CIRCLE_SIZE : NODE_HEIGHT;

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    onSelect(node.id);
    if (editing || connectMode) return;
    const parent = event.currentTarget.parentElement;
    if (!parent) return;
    const bounds = parent.getBoundingClientRect();
    dragOffset.current = {
      dx: event.clientX - bounds.left - node.x,
      dy: event.clientY - bounds.top - node.y,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (connectMode) return;
    const offset = dragOffset.current;
    const parent = event.currentTarget.parentElement;
    if (!offset || !parent) return;
    const bounds = parent.getBoundingClientRect();
    const x = Math.min(
      Math.max(0, event.clientX - bounds.left - offset.dx),
      Math.max(0, bounds.width - width),
    );
    const y = Math.min(
      Math.max(0, event.clientY - bounds.top - offset.dy),
      Math.max(0, bounds.height - height),
    );
    onDragMove(node.id, x, y);
  }

  function endDrag(event: React.PointerEvent<HTMLDivElement>) {
    dragOffset.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Node: ${node.text}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onDoubleClick={() => setEditing(true)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !editing) {
          e.preventDefault();
          setEditing(true);
        }
      }}
      className={cn(
        "group absolute flex touch-none select-none items-center justify-center border-2 p-3 text-center shadow-soft transition-shadow",
        editing ? "cursor-text" : connectMode ? "cursor-crosshair" : "cursor-grab active:cursor-grabbing",
        isCircle ? "rounded-full" : "rounded-2xl",
        selected && "shadow-lift ring-2 ring-ring ring-offset-2 ring-offset-card",
        isConnectSource && "shadow-lift ring-2 ring-primary ring-offset-2 ring-offset-card",
      )}
      style={{
        left: node.x,
        top: node.y,
        width,
        height,
        backgroundColor: `var(--node-${node.color})`,
        borderColor: `var(--node-${node.color}-border)`,
      }}
    >
      {editing ? (
        <textarea
          ref={inputRef}
          value={node.text}
          onChange={(e) => onTextChange(node.id, e.target.value)}
          onBlur={() => setEditing(false)}
          onKeyDown={(e) => {
            if (e.key === "Escape" || (e.key === "Enter" && !e.shiftKey)) {
              e.preventDefault();
              setEditing(false);
            }
          }}
          className="size-full resize-none bg-transparent text-center text-sm font-medium text-foreground outline-none"
        />
      ) : (
        <span className="line-clamp-3 break-words text-sm font-medium text-foreground">
          {node.text}
        </span>
      )}

      <button
        type="button"
        aria-label={`Delete node ${node.text}`}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          onDelete(node.id);
        }}
        className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground opacity-0 shadow-soft transition-opacity hover:text-destructive focus:opacity-100 group-hover:opacity-100"
      >
        <X className="size-3.5" />
      </button>
    </div>
  );
}
