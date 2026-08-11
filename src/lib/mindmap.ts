export type NodeShape = "rounded" | "circle";

export type NodeColor = "blue" | "teal" | "amber" | "rose" | "violet" | "slate";

export type MindMapNode = {
  id: string;
  text: string;
  x: number;
  y: number;
  color: NodeColor;
  shape: NodeShape;
};

export const NODE_COLORS: { value: NodeColor; label: string }[] = [
  { value: "blue", label: "Blue" },
  { value: "teal", label: "Teal" },
  { value: "amber", label: "Amber" },
  { value: "rose", label: "Rose" },
  { value: "violet", label: "Violet" },
  { value: "slate", label: "Slate" },
];

export const NODE_SHAPES: { value: NodeShape; label: string }[] = [
  { value: "rounded", label: "Rounded" },
  { value: "circle", label: "Circle" },
];

export const NODE_WIDTH = 160;
export const NODE_HEIGHT = 72;
export const CIRCLE_SIZE = 120;

export const STORAGE_KEY = "mindmap:nodes:default";
export const CONNECTIONS_STORAGE_KEY = "mindmap:connections:default";
export const MAPS_STORAGE_KEY = "mindmap:maps:v1";

export type MindMapDoc = {
  id: string;
  title: string;
  nodes: MindMapNode[];
  connections: MindMapConnection[];
  updatedAt: number;
};

export type MindMapConnection = {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
};

function makeId(prefix: string) {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${prefix}-${Date.now()}-${Math.round(Math.random() * 1e6)}`;
}

export function createConnection(sourceNodeId: string, targetNodeId: string): MindMapConnection {
  return { id: makeId("conn"), sourceNodeId, targetNodeId };
}

export function getNodeSize(node: MindMapNode) {
  const isCircle = node.shape === "circle";
  return {
    width: isCircle ? CIRCLE_SIZE : NODE_WIDTH,
    height: isCircle ? CIRCLE_SIZE : NODE_HEIGHT,
  };
}

export function getNodeCenter(node: MindMapNode) {
  const { width, height } = getNodeSize(node);
  return { cx: node.x + width / 2, cy: node.y + height / 2 };
}

export function loadConnections(): MindMapConnection[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CONNECTIONS_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (c): c is MindMapConnection =>
        !!c &&
        typeof c === "object" &&
        typeof (c as MindMapConnection).id === "string" &&
        typeof (c as MindMapConnection).sourceNodeId === "string" &&
        typeof (c as MindMapConnection).targetNodeId === "string",
    );
  } catch {
    return [];
  }
}

export function saveConnections(connections: MindMapConnection[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CONNECTIONS_STORAGE_KEY, JSON.stringify(connections));
  } catch {
    /* storage unavailable */
  }
}

export function createNode(x: number, y: number): MindMapNode {
  return {
    id: makeId("node"),
    text: "New Idea",
    x,
    y,
    color: "blue",
    shape: "rounded",
  };
}

export function loadNodes(): MindMapNode[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (n): n is MindMapNode =>
        !!n && typeof n === "object" && typeof (n as MindMapNode).id === "string",
    );
  } catch {
    return [];
  }
}

export function saveNodes(nodes: MindMapNode[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nodes));
  } catch {
    /* storage unavailable */
  }
}
