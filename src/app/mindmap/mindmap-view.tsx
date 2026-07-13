"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { MACRO_TAGS, RAW_NODES } from "./graph-data";
import type { Highlight } from "./highlight";

/** Mesmo motivo do loader do design system: React Flow + d3-force medem o DOM, ssr: false. */
const MindMapGraph = dynamic(() => import("./mindmap-graph").then((mod) => mod.MindMapGraph), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse rounded-sm border border-border bg-card" />,
});

export function MindMapView() {
  const [highlight, setHighlight] = useState<Highlight>(null);

  const counts = useMemo(() => {
    const byMacro = new Map<string, number>();
    const bySubtag = new Map<string, number>();
    RAW_NODES.forEach((n) => {
      byMacro.set(n.macro, (byMacro.get(n.macro) ?? 0) + 1);
      bySubtag.set(n.subtag, (bySubtag.get(n.subtag) ?? 0) + 1);
    });
    return { byMacro, bySubtag };
  }, []);

  return (
    <div className="flex flex-1 flex-col gap-4 lg:flex-row">
      <div className="h-[520px] min-w-0 flex-1">
        <MindMapGraph highlight={highlight} />
      </div>

      <aside className="w-full shrink-0 rounded-sm border border-border bg-card p-4 lg:w-60">
        <p className="font-mono text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
          Tags
        </p>
        <div className="mt-3 space-y-3">
          {MACRO_TAGS.map((tag) => (
            <div key={tag.id}>
              <button
                type="button"
                onMouseEnter={() => setHighlight({ macro: tag.id })}
                onMouseLeave={() => setHighlight(null)}
                className="flex w-full items-center gap-2 rounded-sm px-1.5 py-1 text-left text-xs font-medium hover:bg-muted"
              >
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: tag.color }}
                />
                <span>{tag.label}</span>
                <span className="ml-auto font-mono text-[10px] text-muted-foreground">
                  {counts.byMacro.get(tag.id) ?? 0}
                </span>
              </button>
              <div className="mt-0.5 ml-2.5 space-y-0.5 border-l border-border pl-3">
                {tag.subtags.map((sub) => (
                  <button
                    key={sub.id}
                    type="button"
                    onMouseEnter={() => setHighlight({ macro: tag.id, subtag: sub.id })}
                    onMouseLeave={() => setHighlight(null)}
                    className="flex w-full items-center gap-2 rounded-sm px-1.5 py-0.5 text-left text-[11px] text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full opacity-60"
                      style={{ backgroundColor: tag.color }}
                    />
                    <span>{sub.label}</span>
                    <span className="ml-auto font-mono text-[10px]">
                      {counts.bySubtag.get(sub.id) ?? 0}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
