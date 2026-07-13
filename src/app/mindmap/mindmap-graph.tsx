"use client";

import { useEffect, useMemo } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  useNodesState,
  useEdgesState,
  useReactFlow,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { FloatingEdge } from "@/app/design-system/graph/floating-edge";
import { useForceLayout } from "@/app/design-system/graph/use-force-layout";
import { MindMapNode } from "./mindmap-node";
import { HighlightContext, type Highlight } from "./highlight";
import { MACRO_TAGS, RAW_NODES, RAW_EDGES } from "./graph-data";

const nodeTypes = { mindmapNode: MindMapNode };
const edgeTypes = { floating: FloatingEdge };

const MIN_SIZE = 9;
const MAX_SIZE = 21;

/** Tamanho do nó = quão conectado ele é; cor vem da macro tag; posição inicial em círculo. */
function buildInitialGraph(): { nodes: Node[]; edges: Edge[] } {
  const colorByMacro = new Map(MACRO_TAGS.map((t) => [t.id, t.color]));
  const degree = new Map<string, number>(RAW_NODES.map((n) => [n.id, 0]));
  RAW_EDGES.forEach(([source, target]) => {
    degree.set(source, (degree.get(source) ?? 0) + 1);
    degree.set(target, (degree.get(target) ?? 0) + 1);
  });
  const maxDegree = Math.max(...degree.values(), 1);

  const nodes: Node[] = RAW_NODES.map((n, i) => {
    const nodeDegree = degree.get(n.id) ?? 0;
    const ratio = nodeDegree / maxDegree;
    const size = Math.round(MIN_SIZE + (MAX_SIZE - MIN_SIZE) * ratio);
    const angle = (i / RAW_NODES.length) * Math.PI * 2;
    return {
      id: n.id,
      type: "mindmapNode",
      position: { x: 260 + Math.cos(angle) * 180, y: 190 + Math.sin(angle) * 180 },
      data: {
        label: n.label,
        color: colorByMacro.get(n.macro) ?? "var(--foreground)",
        macro: n.macro,
        subtag: n.subtag,
        size,
        degree: nodeDegree,
      },
      draggable: true,
    };
  });

  const edges: Edge[] = RAW_EDGES.map(([source, target]) => ({
    id: `${source}-${target}`,
    source,
    target,
    type: "floating",
    style: { stroke: "var(--border)", strokeWidth: 1 },
  }));

  return { nodes, edges };
}

/** A física expande o grafo bem além do fitView inicial — re-enquadra enquanto a simulação acomoda. */
function RefitWhileSettling() {
  const { fitView } = useReactFlow();
  useEffect(() => {
    const timers = [1200, 3200].map((ms) =>
      setTimeout(() => fitView({ padding: 0.2, duration: 500 }), ms)
    );
    return () => timers.forEach(clearTimeout);
  }, [fitView]);
  return null;
}

function MindMapGraphInner() {
  const initial = useMemo(() => buildInitialGraph(), []);
  const [nodes, setNodes, onNodesChange] = useNodesState(initial.nodes);
  const [edges] = useEdgesState(initial.edges);

  const { onNodeDragStart, onNodeDrag, onNodeDragStop } = useForceLayout(nodes, edges, setNodes);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      onNodeDragStart={onNodeDragStart}
      onNodeDrag={onNodeDrag}
      onNodeDragStop={onNodeDragStop}
      fitView
      fitViewOptions={{ padding: 0.3 }}
      minZoom={0.5}
      maxZoom={1.5}
      proOptions={{ hideAttribution: true }}
      nodesConnectable={false}
    >
      <RefitWhileSettling />
      <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="rgba(56,56,56,0.08)" />
      <Controls showInteractive={false} />
    </ReactFlow>
  );
}

export function MindMapGraph({ highlight }: { highlight: Highlight }) {
  return (
    <HighlightContext.Provider value={highlight}>
      <div className="labfy-graph h-full w-full overflow-hidden rounded-sm border border-border bg-card">
        <MindMapGraphInner />
      </div>
    </HighlightContext.Provider>
  );
}
