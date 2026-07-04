"use client";

import dynamic from "next/dynamic";

/**
 * O grafo depende de medição real do DOM (React Flow + d3-force) — não dá pra
 * renderizar no servidor sem gerar mismatch de hidratação. `ssr: false` só é
 * permitido a partir de um Client Component, por isso esse wrapper existe.
 */
export const KnowledgeGraph = dynamic(
  () => import("./knowledge-graph").then((mod) => mod.KnowledgeGraph),
  {
    ssr: false,
    loading: () => (
      <div className="h-[420px] w-full animate-pulse rounded-sm border border-border bg-card" />
    ),
  }
);
