import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { GRAPH_PALETTE, type ForceGraphInput } from "@/app/components/force-graph";
import { ForceGraphLoader } from "@/app/components/force-graph-loader";

export const metadata: Metadata = {
  title: "Mapa de prompts — Labfy",
};

export default async function PromptsMapaPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("prompts")
    .select("id, title, topic, subtopic")
    .order("created_at", { ascending: false });

  const prompts = (data ?? []) as {
    id: string;
    title: string;
    topic: string;
    subtopic: string;
  }[];

  const nodes: ForceGraphInput[] = [];
  const edges: [string, string][] = [];
  const seen = new Set<string>();
  const addNode = (id: string, label: string, color: string) => {
    if (seen.has(id)) return;
    seen.add(id);
    nodes.push({ id, label, color });
  };

  const topics = [...new Set(prompts.map((p) => p.topic).filter(Boolean))];
  const colorByTopic = new Map(topics.map((t, i) => [t, GRAPH_PALETTE[i % GRAPH_PALETTE.length]]));

  for (const t of topics) addNode(`topic:${t}`, t, colorByTopic.get(t) ?? "var(--foreground)");

  for (const p of prompts) {
    addNode(`prompt:${p.id}`, p.title, "var(--muted-foreground)");
    const color = p.topic ? colorByTopic.get(p.topic) ?? "var(--foreground)" : "var(--foreground)";
    if (p.topic && p.subtopic) {
      const subId = `sub:${p.topic}:${p.subtopic}`;
      addNode(subId, p.subtopic, color);
      edges.push([`prompt:${p.id}`, subId]);
      edges.push([subId, `topic:${p.topic}`]);
    } else if (p.topic) {
      edges.push([`prompt:${p.id}`, `topic:${p.topic}`]);
    }
  }

  return (
    <section className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl flex-col px-4 py-6">
      <Link
        href="/prompts"
        className="mb-4 inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3" /> Prompts
      </Link>
      <div className="mb-4 space-y-1">
        <h1 className="font-heading text-xl font-semibold tracking-tight">Mapa de prompts</h1>
        <p className="text-xs text-muted-foreground">
          Helicopter view por assunto e subtópico.
        </p>
      </div>
      {nodes.length === 0 ? (
        <p className="py-12 text-center text-xs text-muted-foreground">
          Ainda não há prompts para mapear.
        </p>
      ) : (
        <div className="h-[560px] min-h-0 flex-1">
          <ForceGraphLoader nodes={nodes} edges={edges} />
        </div>
      )}
    </section>
  );
}
