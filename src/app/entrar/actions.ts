"use server";

import { createClient } from "@/lib/supabase/server";
import { isValidPhoneNumber } from "libphonenumber-js";

export async function checkEmailExists(email: string): Promise<{ exists: boolean; error?: string }> {
  const trimmed = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return { exists: false, error: "E-mail inválido." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("email_exists", { check_email: trimmed });

  if (error) return { exists: false, error: "Não foi possível verificar o e-mail." };
  return { exists: Boolean(data) };
}

export async function requestOtp(
  email: string,
  phone?: string
): Promise<{ error?: string }> {
  const trimmed = email.trim().toLowerCase();

  if (phone && !isValidPhoneNumber(phone)) {
    return { error: "Número de WhatsApp inválido." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email: trimmed,
    options: {
      shouldCreateUser: true,
      data: phone ? { phone } : undefined,
    },
  });

  if (error) return { error: "Não foi possível enviar o código. Tente novamente." };
  return {};
}

export async function verifyOtp(email: string, token: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    email: email.trim().toLowerCase(),
    token: token.trim(),
    type: "email",
  });

  if (error) return { error: "Código inválido ou expirado." };
  return {};
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
}
