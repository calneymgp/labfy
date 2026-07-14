"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  FULL_NAME_MAX,
  HEADLINE_MAX,
  HARNESS_OPTIONS,
  MODEL_OPTIONS,
  SPECIALTY_OPTIONS,
  ROLE_MAX,
  LOCATION_MAX,
  SKILL_MAX,
  SKILLS_MAX_COUNT,
} from "@/lib/profile";

export async function updateProfile(input: {
  fullName: string;
  headline: string;
  preferredModels: string[];
  preferredHarnesses: string[];
  specialty: string;
  role: string;
  location: string;
  skills: string[];
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

  const specialty = (SPECIALTY_OPTIONS as readonly string[]).includes(input.specialty)
    ? input.specialty
    : "";
  const role = input.role.trim().slice(0, ROLE_MAX);
  const location = input.location.trim().slice(0, LOCATION_MAX);
  const skills = Array.from(
    new Set(input.skills.map((s) => s.trim().slice(0, SKILL_MAX)).filter(Boolean))
  ).slice(0, SKILLS_MAX_COUNT);

  // a linha do perfil é criada pelo trigger on_auth_user_created no signup
  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      headline,
      preferred_models: preferredModels,
      preferred_harnesses: preferredHarnesses,
      specialty,
      role,
      location,
      skills,
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
