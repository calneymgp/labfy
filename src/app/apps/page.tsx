import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type { App, AppWithAuthor } from "@/lib/apps";
import { AppsGallery } from "./apps-gallery";

export const metadata: Metadata = {
  title: "Apps — Labfy",
};

export default async function AppsPage() {
  const supabase = await createClient();

  const { data: appsData } = await supabase
    .from("apps")
    .select("id, owner_id, name, description, category, url, created_at")
    .order("created_at", { ascending: false });

  const apps = (appsData ?? []) as App[];

  // autor via public_profiles (sem dados sensíveis) — 2ª query
  const ownerIds = [...new Set(apps.map((a) => a.owner_id))];
  const authorMap = new Map<string, { name: string; avatar: string | null }>();
  if (ownerIds.length > 0) {
    const { data: authors } = await supabase
      .from("public_profiles")
      .select("id, full_name, avatar_url")
      .in("id", ownerIds);
    for (const a of (authors ?? []) as { id: string; full_name: string; avatar_url: string | null }[]) {
      authorMap.set(a.id, { name: a.full_name, avatar: a.avatar_url });
    }
  }

  const withAuthor: AppWithAuthor[] = apps.map((a) => ({
    ...a,
    author_name: authorMap.get(a.owner_id)?.name || "Anônimo",
    author_avatar: authorMap.get(a.owner_id)?.avatar ?? null,
  }));

  const catCount = new Map<string, number>();
  for (const a of apps) if (a.category) catCount.set(a.category, (catCount.get(a.category) ?? 0) + 1);
  const categoryData = [...catCount.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-6">
      <div className="mb-5 space-y-1">
        <h1 className="font-heading text-xl font-semibold tracking-tight">Apps</h1>
        <p className="text-xs text-muted-foreground">
          O que a comunidade está construindo com IA.
        </p>
      </div>
      <AppsGallery apps={withAuthor} categoryData={categoryData} />
    </section>
  );
}
