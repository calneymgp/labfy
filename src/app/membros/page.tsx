import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type { PublicMember } from "@/lib/profile";
import { MembersDirectory } from "./members-directory";

export const metadata: Metadata = {
  title: "Membros — Labfy",
};

export default async function MembrosPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("public_profiles")
    .select(
      "id, full_name, headline, avatar_url, specialty, role, location, skills, preferred_models, preferred_harnesses"
    )
    .order("created_at", { ascending: false });

  const members = (data ?? []) as PublicMember[];

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-6">
      <div className="mb-5 space-y-1">
        <h1 className="font-heading text-xl font-semibold tracking-tight">Membros</h1>
        <p className="text-xs text-muted-foreground">
          Encontre pessoas da comunidade por especialidade, nome, cargo ou localização.
        </p>
      </div>
      <MembersDirectory members={members} />
    </section>
  );
}
