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

export function createNode(x: number, y: number): MindMapNode {
  return {
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `node-${Date.now()}-${Math.round(Math.random() * 1e6)}`,
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
