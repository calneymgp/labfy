"use server";

import { createClient } from "@/lib/supabase/server";
import {
  PROMPT_TITLE_MAX,
  PROMPT_TOPIC_MAX,
  PROMPT_BODY_MAX,
  PROMPT_TAGS_MAX,
} from "@/lib/prompts";

// Todo prompt é PÚBLICO para a comunidade — não existe opção de privado.
export async function createPrompt(input: {
  title: string;
  body: string;
  topic: string;
  subtopic: string;
  tags: string[];
}): Promise<{ error?: string; id?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Você precisa estar logado." };

  const title = input.title.trim().slice(0, PROMPT_TITLE_MAX);
  const body = input.body.trim().slice(0, PROMPT_BODY_MAX);
  if (!title) return { error: "Dê um título ao prompt." };
  if (!body) return { error: "O prompt não pode estar vazio." };

  const topic = input.topic.trim().slice(0, PROMPT_TOPIC_MAX);
  const subtopic = input.subtopic.trim().slice(0, PROMPT_TOPIC_MAX);
  const tags = Array.from(
    new Set(input.tags.map((t) => t.trim()).filter(Boolean))
  ).slice(0, PROMPT_TAGS_MAX);

  const { data, error } = await supabase
    .from("prompts")
    .insert({ owner_id: user.id, title, body, topic, subtopic, tags })
    .select("id")
    .single();

  if (error || !data) return { error: "Não foi possível publicar o prompt. Tente novamente." };

  return { id: (data as { id: string }).id };
}
