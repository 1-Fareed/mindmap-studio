import { useCallback, useEffect, useState } from "react";
import {
  createNode,
  createConnection,
  getMap,
  upsertMap,
  type MindMapConnection,
  type MindMapNode,
  type NodeColor,
  type NodeShape,
} from "@/lib/mindmap";

type Snapshot = { nodes: MindMapNode[]; connections: MindMapConnection[] };

export function useMindMapNodes(mapId: string | null) {
  const [nodes, setNodes] = useState<MindMapNode[]>([]);
  const [connections, setConnections] = useState<MindMapConnection[]>([]);
  const [title, setTitle] = useState("Untitled map");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [past, setPast] = useState<Snapshot[]>([]);
  const [future, setFuture] = useState<Snapshot[]>([]);

  // Load the requested map once on the client so SSR markup stays stable.
  useEffect(() => {
    if (!mapId) return;
    const doc = getMap(mapId);
    setNodes(doc?.nodes ?? []);
    setConnections(doc?.connections ?? []);
    setTitle(doc?.title ?? "Untitled map");
    setSelectedId(null);
    setPast([]);
    setFuture([]);
    setLoaded(true);
  }, [mapId]);

  // Autosave the whole map document.
  useEffect(() => {
    if (!loaded || !mapId) return;
    upsertMap({ id: mapId, title, nodes, connections, updatedAt: Date.now() });
  }, [loaded, mapId, title, nodes, connections]);

  const snapshot = useCallback(() => {
    setPast((p) => [...p.slice(-49), { nodes, connections }]);
    setFuture([]);
  }, [nodes, connections]);

  const undo = useCallback(() => {
    setPast((p) => {
      if (p.length === 0) return p;
      const prev = p[p.length - 1]!;
      setFuture((f) => [{ nodes, connections }, ...f].slice(0, 50));
      setNodes(prev.nodes);
      setConnections(prev.connections);
      return p.slice(0, -1);
    });
  }, [nodes, connections]);

  const redo = useCallback(() => {
    setFuture((f) => {
      if (f.length === 0) return f;
      const next = f[0]!;
      setPast((p) => [...p, { nodes, connections }]);
      setNodes(next.nodes);
      setConnections(next.connections);
      return f.slice(1);
    });
  }, [nodes, connections]);

  const addNode = useCallback(
    (x: number, y: number) => {
      snapshot();
      const node = createNode(x, y);
      setNodes((prev) => [...prev, node]);
      setSelectedId(node.id);
    },
    [snapshot],
  );

  const updateNode = useCallback((id: string, patch: Partial<MindMapNode>) => {
    setNodes((prev) => prev.map((n) => (n.id === id ? { ...n, ...patch } : n)));
  }, []);

  const moveNode = useCallback((id: string, x: number, y: number) => {
    setNodes((prev) => prev.map((n) => (n.id === id ? { ...n, x, y } : n)));
  }, []);

  const removeNode = useCallback(
    (id: string) => {
      snapshot();
      setNodes((prev) => prev.filter((n) => n.id !== id));
      setConnections((prev) =>
        prev.filter((c) => c.sourceNodeId !== id && c.targetNodeId !== id),
      );
      setSelectedId((cur) => (cur === id ? null : cur));
    },
    [snapshot],
  );

  const addConnection = useCallback(
    (sourceNodeId: string, targetNodeId: string) => {
      if (sourceNodeId === targetNodeId) return;
      // Only record history when the connection is genuinely new, otherwise a
      // blocked duplicate would leave a no-op step in the undo stack.
      const exists = connections.some(
        (c) => c.sourceNodeId === sourceNodeId && c.targetNodeId === targetNodeId,
      );
      if (exists) return;
      snapshot();
      setConnections((prev) => [...prev, createConnection(sourceNodeId, targetNodeId)]);
    },
    [connections, snapshot],
  );

  const removeConnection = useCallback(
    (id: string) => {
      snapshot();
      setConnections((prev) => prev.filter((c) => c.id !== id));
    },
    [snapshot],
  );

  const setColor = useCallback(
    (id: string, color: NodeColor) => {
      snapshot();
      updateNode(id, { color });
    },
    [snapshot, updateNode],
  );
  const setShape = useCallback(
    (id: string, shape: NodeShape) => {
      snapshot();
      updateNode(id, { shape });
    },
    [snapshot, updateNode],
  );

  const saveNow = useCallback(() => {
    if (!mapId) return;
    upsertMap({ id: mapId, title, nodes, connections, updatedAt: Date.now() });
  }, [mapId, title, nodes, connections]);

  return {
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
    removeConnection,
    setColor,
    setShape,
    snapshot,
    undo,
    redo,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
    saveNow,
    loaded,
  };
}
