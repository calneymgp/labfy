"use client";

import { BaseEdge, useInternalNode, getStraightPath, type EdgeProps } from "@xyflow/react";
import { getEdgeParams } from "./geometry";

/** Linha reta entre os centros dos nós, cruzando exatamente na borda — sem handles fixos, estilo grafo (não fluxograma). */
export function FloatingEdge({ id, source, target, style, markerEnd }: EdgeProps) {
  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);

  if (!sourceNode || !targetNode) return null;

  const { sx, sy, tx, ty } = getEdgeParams(sourceNode, targetNode);
  const [edgePath] = getStraightPath({ sourceX: sx, sourceY: sy, targetX: tx, targetY: ty });

  return <BaseEdge id={id} path={edgePath} style={style} markerEnd={markerEnd} />;
}
