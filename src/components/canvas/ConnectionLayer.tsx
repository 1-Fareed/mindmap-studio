import { getNodeCenter, getNodeSize, type MindMapConnection, type MindMapNode } from "@/lib/mindmap";

// Move a point from the node centre out to roughly the node's edge so the
// arrowhead is visible instead of hidden under the card.
function edgePoint(node: MindMapNode, dx: number, dy: number) {
  const { cx, cy } = getNodeCenter(node);
  const { width, height } = getNodeSize(node);
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const scale = Math.min(
    Math.abs(ux) < 1e-6 ? Infinity : width / 2 / Math.abs(ux),
    Math.abs(uy) < 1e-6 ? Infinity : height / 2 / Math.abs(uy),
  );
  return { x: cx + ux * scale, y: cy + uy * scale };
}

type Props = {
  nodes: MindMapNode[];
  connections: MindMapConnection[];
};

export function ConnectionLayer({ nodes, connections }: Props) {
  const byId = new Map(nodes.map((n) => [n.id, n]));

  return (
    <svg className="pointer-events-none absolute inset-0 size-full" aria-hidden="true">
      <defs>
        <marker
          id="mindmap-arrow"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
        </marker>
      </defs>
      {connections.map((conn) => {
        const source = byId.get(conn.sourceNodeId);
        const target = byId.get(conn.targetNodeId);
        if (!source || !target) return null;
        const sc = getNodeCenter(source);
        const tc = getNodeCenter(target);
        const dx = tc.cx - sc.cx;
        const dy = tc.cy - sc.cy;
        const a = edgePoint(source, dx, dy);
        const b = edgePoint(target, -dx, -dy);
        return (
          <line
            key={conn.id}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            className="text-primary"
            stroke="currentColor"
            strokeWidth={2}
            markerEnd="url(#mindmap-arrow)"
          />
        );
      })}
    </svg>
  );
}