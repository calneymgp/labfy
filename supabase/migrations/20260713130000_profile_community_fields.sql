-- Campos de comunidade no perfil (task-03) — aditivo sobre public.profiles.
-- Habilita filtro do banco de membros por especialidade, cargo e localização.
-- Aplicado via Supabase Management API em 2026-07-13.

alter table public.profiles
  add column if not exists specialty text not null default '',
  add column if not exists role text not null default '',
  add column if not exists location text not null default '',
  add column if not exists skills text[] not null default '{}';
