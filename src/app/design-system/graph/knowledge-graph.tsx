"use client";

import { useMemo } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  Controls,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { GraphNode, type GraphNodeKind } from "./graph-node";
import { FloatingEdge } from "./floating-edge";

const nodeTypes = { graphNode: GraphNode };
const edgeTypes = { floating: FloatingEdge };

type RawNode = { id: string; label: string; kind: GraphNodeKind; size: number; x: number; y: number };

const rawNodes: RawNode[] = [
  { id: "calney", label: "calney", kind: "member", size: 56, x: 40, y: 140 },
  { id: "beta", label: "beta.tester", kind: "member", size: 34, x: 60, y: 300 },

  { id: "skill-pr", label: "Revisor de PR", kind: "skill", size: 40, x: 260, y: 40 },
  { id: "skill-copy", label: "Gerador de copy", kind: "skill", size: 32, x: 340, y: 260 },
  { id: "skill-resumo", label: "Resumo de reunião", kind: "skill", size: 28, x: 200, y: 340 },

  { id: "art-otp", label: "Por que OTP", kind: "article", size: 36, x: 460, y: 100 },
  { id: "art-ds", label: "Terminal Paper", kind: "article", size: 36, x: 480, y: 220 },

  { id: "topic-ds", label: "Design System", kind: "topic", size: 24, x: 340, y: 130 },
  { id: "topic-auth", label: "Autenticação", kind: "topic", size: 24, x: 380, y: 380 },
  { id: "topic-ia", label: "IA", kind: "topic", size: 24, x: 140, y: 60 },
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

export function KnowledgeGraph() {
  const nodes = useMemo<Node[]>(
    () =>
      rawNodes.map((n) => ({
        id: n.id,
        type: "graphNode",
        position: { x: n.x, y: n.y },
        data: { label: n.label, kind: n.kind, size: n.size },
        draggable: true,
      })),
    []
  );

  const edges = useMemo<Edge[]>(
    () =>
      rawEdges.map(([source, target]) => ({
        id: `${source}-${target}`,
        source,
        target,
        type: "floating",
        style: { stroke: "var(--border)", strokeWidth: 1 },
      })),
    []
  );

  return (
    <div
      className="labfy-graph w-full overflow-hidden rounded-sm border border-border bg-card"
      style={{ height: 420 }}
    >
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
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
      </ReactFlowProvider>
    </div>
  );
}
