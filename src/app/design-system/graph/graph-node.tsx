"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";

export type GraphNodeKind = "member" | "skill" | "article" | "topic";

const KIND_COLOR: Record<GraphNodeKind, string> = {
  member: "var(--foreground)",
  skill: "var(--st-running)",
  article: "var(--st-secure)",
  topic: "var(--st-pending)",
};

const HANDLE_STYLE = { opacity: 0, pointerEvents: "none" as const };

/**
 * O wrapper mede exatamente `size x size` (só o círculo) — o label fica em
 * position:absolute fora do box medido, senão a matemática de interseção em
 * geometry.ts (baseada em node.measured) erraria o ponto onde a linha toca a borda.
 */
export function GraphNode({ data, selected }: NodeProps) {
  const { label, kind, size } = data as { label: string; kind: GraphNodeKind; size: number };
  const color = KIND_COLOR[kind];

  return (
    <div
      className="relative rounded-full border bg-card transition-[box-shadow]"
      style={{
        width: size,
        height: size,
        borderColor: color,
        borderWidth: selected ? 2 : 1,
        boxShadow: selected ? `0 0 0 3px color-mix(in srgb, ${color} 18%, transparent)` : undefined,
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
