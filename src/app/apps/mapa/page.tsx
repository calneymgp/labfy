import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { GRAPH_PALETTE, type ForceGraphInput } from "@/app/components/force-graph";
import { ForceGraphLoader } from "@/app/components/force-graph-loader";

export const metadata: Metadata = {
  title: "Mapa de apps — Labfy",
};

export default async function AppsMapaPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("apps")
    .select("id, name, category")
    .order("created_at", { ascending: false });

  const apps = (data ?? []) as { id: string; name: string; category: string }[];

  const nodes: ForceGraphInput[] = [];
  const edges: [string, string][] = [];
  const seen = new Set<string>();
  const addNode = (id: string, label: string, color: string) => {
    if (seen.has(id)) return;
    seen.add(id);
    nodes.push({ id, label, color });
  };

  const cats = [...new Set(apps.map((a) => a.category).filter(Boolean))];
  const colorByCat = new Map(cats.map((c, i) => [c, GRAPH_PALETTE[i % GRAPH_PALETTE.length]]));

  for (const c of cats) addNode(`cat:${c}`, c, colorByCat.get(c) ?? "var(--foreground)");

  for (const a of apps) {
    addNode(`app:${a.id}`, a.name, "var(--muted-foreground)");
    if (a.category) edges.push([`app:${a.id}`, `cat:${a.category}`]);
  }

  return (
    <section className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl flex-col px-4 py-6">
      <Link
        href="/apps"
        className="mb-4 inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3" /> Apps
      </Link>
      <div className="mb-4 space-y-1">
        <h1 className="font-heading text-xl font-semibold tracking-tight">Mapa de apps</h1>
        <p className="text-xs text-muted-foreground">Helicopter view por categoria.</p>
      </div>
      {nodes.length === 0 ? (
        <p className="py-12 text-center text-xs text-muted-foreground">
          Ainda não há apps para mapear.
        </p>
      ) : (
        <div className="h-[560px] min-h-0 flex-1">
          <ForceGraphLoader nodes={nodes} edges={edges} />
        </div>
      )}
    </section>
  );
}
