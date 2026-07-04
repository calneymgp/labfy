"use client";

import { useCallback, useEffect, useRef } from "react";
import { forceSimulation, forceManyBody, forceLink, forceCollide, forceX, forceY, type Simulation } from "d3-force";
import type { Node, Edge, OnNodeDrag } from "@xyflow/react";

type SimNode = {
  id: string;
  size: number;
  x: number;
  y: number;
  fx?: number | null;
  fy?: number | null;
};

type SimLink = {
  source: string;
  target: string;
};

/**
 * Simulação de forças (d3-force) por trás do grafo: os nós entram espalhados e se
 * organizam sozinhos (repulsão + link + colisão por tamanho), como no grafo do
 * Obsidian. Arrastar um nó reaquece a simulação e os vizinhos reagem; ao soltar,
 * ele volta a ser regido pela física em vez de ficar fixo.
 */
export function useForceLayout(
  nodes: Node[],
  edges: Edge[],
  setNodes: (updater: (nodes: Node[]) => Node[]) => void
) {
  const simulationRef = useRef<Simulation<SimNode, SimLink> | null>(null);
  const simNodesRef = useRef<Map<string, SimNode>>(new Map());

  useEffect(() => {
    const simNodes: SimNode[] = nodes.map((n) => ({
      id: n.id,
      size: (n.data as { size?: number }).size ?? 32,
      x: n.position.x,
      y: n.position.y,
    }));
    const nodeById = new Map(simNodes.map((n) => [n.id, n]));
    simNodesRef.current = nodeById;

    const simLinks: SimLink[] = edges.map((e) => ({ source: e.source, target: e.target }));

    const simulation = forceSimulation<SimNode>(simNodes)
      .force("charge", forceManyBody().strength(-260))
      .force(
        "link",
        forceLink<SimNode, SimLink>(simLinks)
          .id((d) => d.id)
          .distance(95)
          .strength(0.5)
      )
      .force(
        "collide",
        forceCollide<SimNode>((d) => d.size / 2 + 20).iterations(2)
      )
      .force("x", forceX(0).strength(0.02))
      .force("y", forceY(0).strength(0.02))
      .alpha(1)
      .alphaDecay(0.025);

    simulation.on("tick", () => {
      setNodes((nds) =>
        nds.map((n) => {
          const sn = nodeById.get(n.id);
          return sn ? { ...n, position: { x: sn.x, y: sn.y } } : n;
        })
      );
    });

    simulationRef.current = simulation;
    return () => {
      simulation.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onNodeDragStart: OnNodeDrag = useCallback((_event, node) => {
    simulationRef.current?.alphaTarget(0.2).restart();
    const sn = simNodesRef.current.get(node.id);
    if (sn) {
      sn.fx = node.position.x;
      sn.fy = node.position.y;
    }
  }, []);

  const onNodeDrag: OnNodeDrag = useCallback((_event, node) => {
    const sn = simNodesRef.current.get(node.id);
    if (sn) {
      sn.fx = node.position.x;
      sn.fy = node.position.y;
    }
  }, []);

  const onNodeDragStop: OnNodeDrag = useCallback((_event, node) => {
    simulationRef.current?.alphaTarget(0);
    const sn = simNodesRef.current.get(node.id);
    if (sn) {
      sn.fx = null;
      sn.fy = null;
    }
  }, []);

  return { onNodeDragStart, onNodeDrag, onNodeDragStop };
}
