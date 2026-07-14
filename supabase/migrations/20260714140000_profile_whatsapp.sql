-- WhatsApp no perfil (task-16) — aditivo. Contato sensível: NÃO entra na
-- view public_profiles (mesma regra de email/phone). Aplicada via Management API.
alter table public.profiles
  add column if not exists whatsapp text not null default '';
