-- Banco de prompts públicos da comunidade (task-06).
-- Todo prompt é público (SELECT liberado); escrita restrita ao dono.
-- Aplicada via Supabase Management API em 2026-07-13.

create table if not exists public.prompts (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  body text not null,
  topic text not null default '',
  subtopic text not null default '',
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.prompts enable row level security;

drop policy if exists prompts_select_public on public.prompts;
create policy prompts_select_public on public.prompts
  for select using (true);

drop policy if exists prompts_insert_own on public.prompts;
create policy prompts_insert_own on public.prompts
  for insert to authenticated with check (auth.uid() = owner_id);

drop policy if exists prompts_update_own on public.prompts;
create policy prompts_update_own on public.prompts
  for update to authenticated using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

drop policy if exists prompts_delete_own on public.prompts;
create policy prompts_delete_own on public.prompts
  for delete to authenticated using (auth.uid() = owner_id);

-- updated_at automático (reusa a function criada na migration de profiles)
drop trigger if exists prompts_updated_at on public.prompts;
create trigger prompts_updated_at
  before update on public.prompts
  for each row execute function public.profiles_set_updated_at();

create index if not exists prompts_created_idx on public.prompts (created_at desc);
