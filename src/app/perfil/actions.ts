"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  FULL_NAME_MAX,
  HEADLINE_MAX,
  HARNESS_OPTIONS,
  MODEL_OPTIONS,
} from "@/lib/profile";

export async function updateProfile(input: {
  fullName: string;
  headline: string;
  preferredModels: string[];
  preferredHarnesses: string[];
}): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Você precisa estar logado." };

  const fullName = input.fullName.trim();
  const headline = input.headline.trim();

  if (fullName.length > FULL_NAME_MAX) {
    return { error: `Nome pode ter no máximo ${FULL_NAME_MAX} caracteres.` };
  }
  if (headline.length > HEADLINE_MAX) {
    return { error: `Headline pode ter no máximo ${HEADLINE_MAX} caracteres.` };
  }

  const preferredModels = input.preferredModels.filter((m) =>
    (MODEL_OPTIONS as readonly string[]).includes(m)
  );
  const preferredHarnesses = input.preferredHarnesses.filter((h) =>
    (HARNESS_OPTIONS as readonly string[]).includes(h)
  );

  // a linha do perfil é criada pelo trigger on_auth_user_created no signup
  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      headline,
      preferred_models: preferredModels,
      preferred_harnesses: preferredHarnesses,
    })
    .eq("id", user.id);

  if (error) return { error: "Não foi possível salvar o perfil. Tente novamente." };

  revalidatePath("/", "layout");
  return {};
}

// Chamada após o upload do avatar (feito no browser, direto no Storage) para
// gravar a URL pública no perfil. A URL é derivada do uid no servidor — nunca
// confiamos em URL vinda do cliente.
export async function commitAvatar(): Promise<{ error?: string; avatarUrl?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Você precisa estar logado." };

  const { data } = supabase.storage.from("avatars").getPublicUrl(`${user.id}/avatar.webp`);
  const avatarUrl = `${data.publicUrl}?v=${Date.now()}`;

  const { error } = await supabase
    .from("profiles")
    .update({ avatar_url: avatarUrl })
    .eq("id", user.id);

  if (error) return { error: "Não foi possível salvar a foto. Tente novamente." };

  revalidatePath("/", "layout");
  return { avatarUrl };
}
