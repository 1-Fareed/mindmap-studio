import { useCallback, useEffect, useState } from "react";
import {
  createNode,
  loadNodes,
  saveNodes,
  type MindMapNode,
  type NodeColor,
  type NodeShape,
} from "@/lib/mindmap";

export function useMindMapNodes() {
  const [nodes, setNodes] = useState<MindMapNode[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Load once on the client so SSR markup stays stable.
  useEffect(() => {
    setNodes(loadNodes());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) saveNodes(nodes);
  }, [nodes, loaded]);

  const addNode = useCallback((x: number, y: number) => {
    const node = createNode(x, y);
    setNodes((prev) => [...prev, node]);
    setSelectedId(node.id);
  }, []);

  const updateNode = useCallback((id: string, patch: Partial<MindMapNode>) => {
    setNodes((prev) => prev.map((n) => (n.id === id ? { ...n, ...patch } : n)));
  }, []);

  const moveNode = useCallback((id: string, x: number, y: number) => {
    setNodes((prev) => prev.map((n) => (n.id === id ? { ...n, x, y } : n)));
  }, []);

  const removeNode = useCallback((id: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== id));
    setSelectedId((cur) => (cur === id ? null : cur));
  }, []);

  const setColor = useCallback(
    (id: string, color: NodeColor) => updateNode(id, { color }),
    [updateNode],
  );
  const setShape = useCallback(
    (id: string, shape: NodeShape) => updateNode(id, { shape }),
    [updateNode],
  );

  return {
    nodes,
    selectedId,
    setSelectedId,
    addNode,
    updateNode,
    moveNode,
    removeNode,
    setColor,
    setShape,
  };
}
