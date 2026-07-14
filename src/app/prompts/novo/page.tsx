import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PromptEditor } from "../prompt-editor";

export const metadata: Metadata = {
  title: "Novo prompt — Labfy",
};

export default async function NovoPromptPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/entrar");

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-6">
      <div className="mb-5 space-y-1">
        <h1 className="font-heading text-xl font-semibold tracking-tight">Novo prompt</h1>
        <p className="text-xs text-muted-foreground">
          Compartilhe um prompt com a comunidade — sempre público.
        </p>
      </div>
      <PromptEditor />
    </section>
  );
}
