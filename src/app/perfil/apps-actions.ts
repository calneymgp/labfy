"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  APP_NAME_MAX,
  APP_DESC_MAX,
  APP_URL_MAX,
  APP_CATEGORY_OPTIONS,
} from "@/lib/apps";

type AppInput = { name: string; description: string; category: string; url: string };

function clean(input: AppInput) {
  const category = (APP_CATEGORY_OPTIONS as readonly string[]).includes(input.category)
    ? input.category
    : "";
  return {
    name: input.name.trim().slice(0, APP_NAME_MAX),
    description: input.description.trim().slice(0, APP_DESC_MAX),
    category,
    url: input.url.trim().slice(0, APP_URL_MAX),
  };
}

export async function createApp(input: AppInput): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Você precisa estar logado." };

  const app = clean(input);
  if (!app.name) return { error: "Dê um nome ao app." };

  const { error } = await supabase.from("apps").insert({ owner_id: user.id, ...app });
  if (error) return { error: "Não foi possível salvar o app." };

  revalidatePath("/perfil");
  revalidatePath("/apps");
  return {};
}

export async function updateApp(id: string, input: AppInput): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Você precisa estar logado." };

  const app = clean(input);
  if (!app.name) return { error: "Dê um nome ao app." };

  const { error } = await supabase
    .from("apps")
    .update(app)
    .eq("id", id)
    .eq("owner_id", user.id);
  if (error) return { error: "Não foi possível salvar o app." };

  revalidatePath("/perfil");
  revalidatePath("/apps");
  return {};
}

export async function deleteApp(id: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Você precisa estar logado." };

  const { error } = await supabase
    .from("apps")
    .delete()
    .eq("id", id)
    .eq("owner_id", user.id);
  if (error) return { error: "Não foi possível remover o app." };

  revalidatePath("/perfil");
  revalidatePath("/apps");
  return {};
}
