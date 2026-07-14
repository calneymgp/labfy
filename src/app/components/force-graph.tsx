"use client";

import { useEffect, useMemo } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  Handle,
  Position,
  useNodesState,
  useEdgesState,
  useReactFlow,
  type Node,
  type Edge,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { FloatingEdge } from "@/app/design-system/graph/floating-edge";
import { useForceLayout } from "@/app/design-system/graph/use-force-layout";

// Nó de entrada genérico — qualquer domínio (prompts, apps, membros) monta isto.
export type ForceGraphInput = { id: string; label: string; color: string };

// Paleta compartilhada para colorir grupos (assuntos/categorias).
export const GRAPH_PALETTE = [
  "var(--st-running)",
  "var(--st-secure)",
  "var(--st-vulnerable)",
  "var(--st-exposed)",
  "var(--st-pending)",
  "var(--foreground)",
];

const MIN_SIZE = 9;
const MAX_SIZE = 24;
const HANDLE_STYLE = { opacity: 0, pointerEvents: "none" as const };

function ForceGraphDot({ data, selected }: NodeProps) {
  const { label, color, size } = data as { label: string; color: string; size: number };
  return (
    <div
      className="relative rounded-full border transition-[box-shadow] duration-150"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        borderColor: color,
        boxShadow: selected
          ? `0 0 0 4px color-mix(in srgb, ${color} 22%, transparent)`
          : undefined,
      }}
    >
      <span className="absolute top-full left-1/2 mt-1.5 max-w-[7rem] -translate-x-1/2 truncate text-center font-mono text-[9px] tracking-wide text-muted-foreground uppercase">
        {label}
      </span>
      <Handle type="source" position={Position.Top} style={HANDLE_STYLE} />
      <Handle type="target" position={Position.Top} style={HANDLE_STYLE} />
      <Handle type="source" position={Position.Right} style={HANDLE_STYLE} id="right" />
      <Handle type="target" position={Position.Right} style={HANDLE_STYLE} id="right" />
      <Handle type="source" position={Position.Bottom} style={HANDLE_STYLE} id="bottom" />
      <Handle type="target" position={Position.Bottom} style={HANDLE_STYLE} id="bottom" />
      <Handle type="source" position={Position.Left} style={HANDLE_STYLE} id="left" />
      <Handle type="target" position={Position.Left} style={HANDLE_STYLE} id="left" />
    </div>
  );
}

const nodeTypes = { forceDot: ForceGraphDot };
const edgeTypes = { floating: FloatingEdge };

/** Tamanho do nó = quão conectado ele é; posição inicial em círculo; arestas floating. */
function buildForceGraph(
  input: ForceGraphInput[],
  rawEdges: [string, string][]
): { nodes: Node[]; edges: Edge[] } {
  const degree = new Map<string, number>(input.map((n) => [n.id, 0]));
  rawEdges.forEach(([s, t]) => {
    degree.set(s, (degree.get(s) ?? 0) + 1);
    degree.set(t, (degree.get(t) ?? 0) + 1);
  });
  const maxDegree = Math.max(...degree.values(), 1);

  const nodes: Node[] = input.map((n, i) => {
    const d = degree.get(n.id) ?? 0;
    const size = Math.round(MIN_SIZE + (MAX_SIZE - MIN_SIZE) * (d / maxDegree));
    const angle = (i / Math.max(input.length, 1)) * Math.PI * 2;
    return {
      id: n.id,
      type: "forceDot",
      position: { x: 260 + Math.cos(angle) * 180, y: 190 + Math.sin(angle) * 180 },
      data: { label: n.label, color: n.color, size, degree: d },
      draggable: true,
    };
  });

  const edges: Edge[] = rawEdges.map(([source, target]) => ({
    id: `${source}-${target}`,
    source,
    target,
    type: "floating",
    style: { stroke: "var(--border)", strokeWidth: 1 },
  }));

  return { nodes, edges };
}

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

function ForceGraphInner({
  nodes: input,
  edges: rawEdges,
}: {
  nodes: ForceGraphInput[];
  edges: [string, string][];
}) {
  const initial = useMemo(() => buildForceGraph(input, rawEdges), [input, rawEdges]);
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
      minZoom={0.4}
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

/** Grafo de força genérico — recebe nodes e edges por prop e reusa o motor d3-force. */
export function ForceGraph({
  nodes,
  edges,
}: {
  nodes: ForceGraphInput[];
  edges: [string, string][];
}) {
  return (
    <div className="labfy-graph h-full w-full overflow-hidden rounded-sm border border-border bg-card">
      <ForceGraphInner nodes={nodes} edges={edges} />
    </div>
  );
}
