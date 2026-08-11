import { getNodeCenter, getNodeSize, type MindMapConnection, type MindMapNode } from "@/lib/mindmap";

type Side = "left" | "right" | "top" | "bottom";

// Pick the side of the node the connection should leave from / arrive at,
// based on the dominant axis between the two centres.
function pickSide(dx: number, dy: number): Side {
  if (Math.abs(dx) >= Math.abs(dy)) return dx >= 0 ? "right" : "left";
  return dy >= 0 ? "bottom" : "top";
}

function anchor(node: MindMapNode, side: Side) {
  const { cx, cy } = getNodeCenter(node);
  const { width, height } = getNodeSize(node);
  switch (side) {
    case "left":
      return { x: cx - width / 2, y: cy, nx: -1, ny: 0 };
    case "right":
      return { x: cx + width / 2, y: cy, nx: 1, ny: 0 };
    case "top":
      return { x: cx, y: cy - height / 2, nx: 0, ny: -1 };
    default:
      return { x: cx, y: cy + height / 2, nx: 0, ny: 1 };
  }
}

// Cubic Bézier whose control points extend outwards along each anchor's
// normal, giving the smooth n8n-style edge in every direction.
function buildPath(source: MindMapNode, target: MindMapNode) {
  const sc = getNodeCenter(source);
  const tc = getNodeCenter(target);
  const dx = tc.cx - sc.cx;
  const dy = tc.cy - sc.cy;
  const sSide = pickSide(dx, dy);
  const tSide = pickSide(-dx, -dy);
  const a = anchor(source, sSide);
  const b = anchor(target, tSide);
  const dist = Math.hypot(b.x - a.x, b.y - a.y);
  const offset = Math.min(160, Math.max(40, dist * 0.4));
  const c1x = a.x + a.nx * offset;
  const c1y = a.y + a.ny * offset;
  const c2x = b.x + b.nx * offset;
  const c2y = b.y + b.ny * offset;
  return `M ${a.x} ${a.y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${b.x} ${b.y}`;
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
        return (
          <path
            key={conn.id}
            d={buildPath(source, target)}
            className="text-primary"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            markerEnd="url(#mindmap-arrow)"
          />
        );
      })}
    </svg>
  );
}