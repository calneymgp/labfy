"use server";

import { tasks } from "@trigger.dev/sdk";
import { createClient } from "@/lib/supabase/server";
import { WAR_ROOM_ALLOWED_EMAILS } from "@/lib/war-room/characters";
import type { warRoomDebate } from "@/trigger/war-room-debate";

export async function startDebate(
  rawPrompt: string
): Promise<{ error?: string; sessionId?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Você precisa estar logado." };
  // Gate de custo: só emails liberados disparam a task (que consome tokens OpenRouter).
  // Não confiar apenas no redirect da página — server actions são invocáveis via HTTP.
  if (!WAR_ROOM_ALLOWED_EMAILS.includes(user.email ?? "")) {
    return { error: "A War Room está restrita no momento." };
  }

  const prompt = rawPrompt.trim().slice(0, 2000);
  if (!prompt) return { error: "Escreva um tema para o debate." };

  const { data: session, error } = await supabase
    .from("war_room_sessions")
    .insert({ owner_id: user.id, prompt, status: "pending" })
    .select("id")
    .single();
  if (error || !session) return { error: "Não foi possível iniciar o debate." };

  const sessionId = (session as { id: string }).id;

  const handle = await tasks.trigger<typeof warRoomDebate>("war-room-debate", {
    sessionId,
    prompt,
  });

  await supabase
    .from("war_room_sessions")
    .update({ external_id: handle.id })
    .eq("id", sessionId);

  return { sessionId };
}
