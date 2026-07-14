-- Apps da comunidade (task-08) — cada membro cadastra o que constrói com IA.
-- Leitura pública (galeria /apps); escrita restrita ao dono.
-- Aplicada via Supabase Management API em 2026-07-13.

create table if not exists public.apps (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text not null default '',
  category text not null default '',
  url text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.apps enable row level security;

drop policy if exists apps_select_public on public.apps;
create policy apps_select_public on public.apps
  for select using (true);

drop policy if exists apps_insert_own on public.apps;
create policy apps_insert_own on public.apps
  for insert to authenticated with check (auth.uid() = owner_id);

drop policy if exists apps_update_own on public.apps;
create policy apps_update_own on public.apps
  for update to authenticated using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

drop policy if exists apps_delete_own on public.apps;
create policy apps_delete_own on public.apps
  for delete to authenticated using (auth.uid() = owner_id);

drop trigger if exists apps_updated_at on public.apps;
create trigger apps_updated_at
  before update on public.apps
  for each row execute function public.profiles_set_updated_at();

create index if not exists apps_owner_idx on public.apps (owner_id);
