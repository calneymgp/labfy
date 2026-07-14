"use client";

import dynamic from "next/dynamic";
import type { ForceGraphInput } from "./force-graph";

// React Flow + d3-force medem o DOM — ssr:false (mesmo padrão do MindMap).
const ForceGraph = dynamic(() => import("./force-graph").then((m) => m.ForceGraph), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full animate-pulse rounded-sm border border-border bg-card" />
  ),
});

export function ForceGraphLoader(props: {
  nodes: ForceGraphInput[];
  edges: [string, string][];
}) {
  return <ForceGraph {...props} />;
}
