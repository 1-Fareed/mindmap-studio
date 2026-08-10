import { getNodeCenter, type MindMapConnection, type MindMapNode } from "@/lib/mindmap";

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
        const a = getNodeCenter(source);
        const b = getNodeCenter(target);
        return (
          <line
            key={conn.id}
            x1={a.cx}
            y1={a.cy}
            x2={b.cx}
            y2={b.cy}
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