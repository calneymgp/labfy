import type { CookieOptionsWithName } from "@supabase/ssr";

/** Mantém a sessão de login por 7 dias sem precisar re-autenticar. */
export const SESSION_COOKIE_OPTIONS: CookieOptionsWithName = {
  maxAge: 60 * 60 * 24 * 7,
};
