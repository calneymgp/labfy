"use client";

import { useContext } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { HighlightContext } from "./highlight";

const HANDLE_STYLE = { opacity: 0, pointerEvents: "none" as const };

/**
 * Dot preenchido com a cor do assunto (macro tag). Mesma regra do GraphNode do
 * design system: o wrapper mede exatamente `size x size` e o label fica em
 * position:absolute, senão a interseção das arestas em geometry.ts erraria.
 */
export function MindMapNode({ data, selected }: NodeProps) {
  const { label, color, macro, subtag, size } = data as {
    label: string;
    color: string;
    macro: string;
    subtag: string;
    size: number;
  };
  const highlight = useContext(HighlightContext);
  const match = highlight
    ? highlight.subtag
      ? subtag === highlight.subtag
      : macro === highlight.macro
    : false;
  const dimmed = highlight !== null && !match;

  return (
    <div
      className="relative rounded-full border transition-[box-shadow,opacity] duration-150"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        borderColor: color,
        opacity: dimmed ? 0.15 : 1,
        boxShadow:
          match || selected
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
