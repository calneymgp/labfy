import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { WarRoomMessage } from "@/lib/war-room/characters";
import { WarRoomClient } from "./war-room-client";

export const metadata: Metadata = {
  title: "War Room — Labfy",
};

export default async function WarRoomPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/entrar");

  // Resumibilidade: retoma a sessão mais recente do usuário (se houver).
  const { data: session } = await supabase
    .from("war_room_sessions")
    .select("id, status")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const typedSession = session as { id: string; status: string } | null;
  const sessionId = typedSession ? typedSession.id : null;
  const status = typedSession ? typedSession.status : null;

  let messages: WarRoomMessage[] = [];
  if (sessionId) {
    const { data } = await supabase
      .from("war_room_messages")
      .select("id, character, phase, content, turn")
      .eq("session_id", sessionId)
      .order("turn")
      .order("created_at");
    messages = (data ?? []) as WarRoomMessage[];
  }

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-6">
      <div className="mb-5 space-y-1">
        <h1 className="font-heading text-xl font-semibold tracking-tight">War Room</h1>
        <p className="text-xs text-muted-foreground">
          Quatro modelos de IA debatem o seu prompt até uma conclusão.
        </p>
      </div>
      <WarRoomClient
        initialSessionId={sessionId}
        initialMessages={messages}
        initialStatus={status}
      />
    </section>
  );
}
