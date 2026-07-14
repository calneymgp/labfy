import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type { PublicMember } from "@/lib/profile";
import { MembersDirectory } from "./members-directory";
import { CommunityStats } from "./community-stats";

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

  const scalarCount = (vals: string[]) => {
    const acc = new Map<string, number>();
    for (const v of vals) if (v) acc.set(v, (acc.get(v) ?? 0) + 1);
    return acc;
  };
  const arrayCount = (arrays: string[][]) => {
    const acc = new Map<string, number>();
    for (const arr of arrays) for (const v of arr) if (v) acc.set(v, (acc.get(v) ?? 0) + 1);
    return acc;
  };
  const toData = (acc: Map<string, number>, limit = Infinity) =>
    [...acc.entries()]
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, limit);

  const harnessCounts = arrayCount(members.map((p) => p.preferred_harnesses));
  const modelCounts = arrayCount(members.map((p) => p.preferred_models));
  const specialtyData = toData(scalarCount(members.map((p) => p.specialty)));
  const harnessData = toData(harnessCounts);
  const locationData = toData(scalarCount(members.map((p) => p.location)), 6);
  const claudeCodeCount = harnessCounts.get("Claude Code") ?? 0;
  const gptCount = modelCounts.get("GPT (OpenAI)") ?? 0;

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-6">
      <div className="mb-5 space-y-1">
        <h1 className="font-heading text-xl font-semibold tracking-tight">Membros</h1>
        <p className="text-xs text-muted-foreground">
          Encontre pessoas da comunidade por especialidade, nome, cargo ou localização.
        </p>
      </div>
      <CommunityStats
        total={members.length}
        claudeCodeCount={claudeCodeCount}
        gptCount={gptCount}
        specialtyData={specialtyData}
        harnessData={harnessData}
        locationData={locationData}
      />
      <MembersDirectory members={members} />
    </section>
  );
}
