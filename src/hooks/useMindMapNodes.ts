import { useCallback, useEffect, useState } from "react";
import {
  createNode,
  createConnection,
  loadNodes,
  loadConnections,
  saveNodes,
  saveConnections,
  type MindMapConnection,
  type MindMapNode,
  type NodeColor,
  type NodeShape,
} from "@/lib/mindmap";

export function useMindMapNodes() {
  const [nodes, setNodes] = useState<MindMapNode[]>([]);
  const [connections, setConnections] = useState<MindMapConnection[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Load once on the client so SSR markup stays stable.
  useEffect(() => {
    setNodes(loadNodes());
    setConnections(loadConnections());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) saveNodes(nodes);
  }, [nodes, loaded]);

  useEffect(() => {
    if (loaded) saveConnections(connections);
  }, [connections, loaded]);

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
    setConnections((prev) =>
      prev.filter((c) => c.sourceNodeId !== id && c.targetNodeId !== id),
    );
    setSelectedId((cur) => (cur === id ? null : cur));
  }, []);

  const addConnection = useCallback((sourceNodeId: string, targetNodeId: string) => {
    if (sourceNodeId === targetNodeId) return;
    setConnections((prev) => {
      const exists = prev.some(
        (c) => c.sourceNodeId === sourceNodeId && c.targetNodeId === targetNodeId,
      );
      if (exists) return prev;
      return [...prev, createConnection(sourceNodeId, targetNodeId)];
    });
  }, []);

  const removeConnection = useCallback((id: string) => {
    setConnections((prev) => prev.filter((c) => c.id !== id));
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
    connections,
    selectedId,
    setSelectedId,
    addNode,
    updateNode,
    moveNode,
    removeNode,
    addConnection,
    removeConnection,
    setColor,
    setShape,
  };
}
