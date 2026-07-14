import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Waypoints } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Prompt, PromptWithAuthor } from "@/lib/prompts";
import { buttonVariants } from "@/components/ui/button";
import { PromptsList } from "./prompts-list";

export const metadata: Metadata = {
  title: "Prompts — Labfy",
};

export default async function PromptsPage() {
  const supabase = await createClient();

  const { data: promptsData } = await supabase
    .from("prompts")
    .select("id, owner_id, title, body, topic, subtopic, tags, created_at")
    .order("created_at", { ascending: false });

  const prompts = (promptsData ?? []) as Prompt[];

  // nome do autor via public_profiles (nunca profiles direto) — 2ª query, sem dados sensíveis
  const ownerIds = [...new Set(prompts.map((p) => p.owner_id))];
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

  const withAuthor: PromptWithAuthor[] = prompts.map((p) => ({
    ...p,
    author_name: authorMap.get(p.owner_id)?.name || "Anônimo",
    author_avatar: authorMap.get(p.owner_id)?.avatar ?? null,
  }));

  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-6">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-heading text-xl font-semibold tracking-tight">Prompts</h1>
          <p className="text-xs text-muted-foreground">
            Biblioteca pública de prompts da comunidade.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/prompts/mapa"
            className={buttonVariants({ variant: "ghost", size: "sm", className: "rounded-sm" })}
          >
            <Waypoints className="size-3.5" />
            Mapa
          </Link>
          <Link
            href="/prompts/novo"
            className={buttonVariants({ variant: "outline", size: "sm", className: "rounded-sm" })}
          >
            <Plus className="size-3.5" />
            Criar prompt
          </Link>
        </div>
      </div>
      <PromptsList prompts={withAuthor} />
    </section>
  );
}
