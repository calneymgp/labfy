"use client";

import { useMemo } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { GraphNode, type GraphNodeKind } from "./graph-node";
import { FloatingEdge } from "./floating-edge";
import { useForceLayout } from "./use-force-layout";

const nodeTypes = { graphNode: GraphNode };
const edgeTypes = { floating: FloatingEdge };

const MIN_SIZE = 9;
const MAX_SIZE = 21;

type RawNode = { id: string; label: string; kind: GraphNodeKind };

const rawNodes: RawNode[] = [
  { id: "calney", label: "calney", kind: "member" },
  { id: "beta", label: "beta.tester", kind: "member" },
  { id: "skill-pr", label: "Revisor de PR", kind: "skill" },
  { id: "skill-copy", label: "Gerador de copy", kind: "skill" },
  { id: "skill-resumo", label: "Resumo de reunião", kind: "skill" },
  { id: "art-otp", label: "Por que OTP", kind: "article" },
  { id: "art-ds", label: "Terminal Paper", kind: "article" },
  { id: "topic-ds", label: "Design System", kind: "topic" },
  { id: "topic-auth", label: "Autenticação", kind: "topic" },
  { id: "topic-ia", label: "IA", kind: "topic" },
];

const rawEdges: [string, string][] = [
  ["calney", "skill-pr"],
  ["calney", "skill-copy"],
  ["calney", "art-otp"],
  ["calney", "art-ds"],
  ["calney", "topic-ia"],
  ["beta", "skill-resumo"],
  ["beta", "skill-copy"],
  ["skill-pr", "topic-ia"],
  ["skill-copy", "topic-ia"],
  ["skill-resumo", "topic-ia"],
  ["art-ds", "topic-ds"],
  ["skill-pr", "topic-ds"],
  ["art-otp", "topic-auth"],
  ["skill-resumo", "topic-auth"],
];

/** Tamanho do nó = quão conectado ele é; posição inicial em círculo, a física acomoda o resto. */
function buildInitialGraph(): { nodes: Node[]; edges: Edge[] } {
  const degree = new Map<string, number>(rawNodes.map((n) => [n.id, 0]));
  rawEdges.forEach(([source, target]) => {
    degree.set(source, (degree.get(source) ?? 0) + 1);
    degree.set(target, (degree.get(target) ?? 0) + 1);
  });
  const maxDegree = Math.max(...degree.values(), 1);

  const nodes: Node[] = rawNodes.map((n, i) => {
    const nodeDegree = degree.get(n.id) ?? 0;
    const ratio = nodeDegree / maxDegree;
    const size = Math.round(MIN_SIZE + (MAX_SIZE - MIN_SIZE) * ratio);
    const angle = (i / rawNodes.length) * Math.PI * 2;
    return {
      id: n.id,
      type: "graphNode",
      position: { x: 260 + Math.cos(angle) * 180, y: 190 + Math.sin(angle) * 180 },
      data: { label: n.label, kind: n.kind, size, degree: nodeDegree },
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

function KnowledgeGraphInner() {
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
      <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="rgba(56,56,56,0.08)" />
      <Controls showInteractive={false} />
    </ReactFlow>
  );
}

export function KnowledgeGraph() {
  return (
    <div
      className="labfy-graph w-full overflow-hidden rounded-sm border border-border bg-card"
      style={{ height: 420 }}
    >
      <KnowledgeGraphInner />
    </div>
  );
}
