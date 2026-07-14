import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { WAR_ROOM_ALLOWED_EMAILS, type WarRoomMessage } from "@/lib/war-room/characters";
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
  if (!WAR_ROOM_ALLOWED_EMAILS.includes(user.email ?? "")) redirect("/");

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
    <section className="flex h-[calc(100dvh-2rem)] w-full flex-col px-4 py-3">
      <WarRoomClient
        initialSessionId={sessionId}
        initialMessages={messages}
        initialStatus={status}
      />
    </section>
  );
}
