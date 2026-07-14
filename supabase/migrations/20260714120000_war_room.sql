-- War Room (task-11) — sessões de debate multi-agente + mensagens em streaming.
-- sessions: só o dono. messages: legíveis pelo dono da sessão; são inseridas pela task
-- Trigger.dev via conexão pg direta (bypassa RLS). Aplicada via Management API.

create table if not exists public.war_room_sessions (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  prompt text not null,
  status text not null default 'pending',
  external_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.war_room_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.war_room_sessions(id) on delete cascade,
  character text not null,
  phase text not null default 'debate',
  content text not null,
  turn int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.war_room_sessions enable row level security;
alter table public.war_room_messages enable row level security;

drop policy if exists war_sessions_own on public.war_room_sessions;
create policy war_sessions_own on public.war_room_sessions
  for all to authenticated using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

drop policy if exists war_messages_read_own on public.war_room_messages;
create policy war_messages_read_own on public.war_room_messages
  for select to authenticated using (
    exists (
      select 1 from public.war_room_sessions s
      where s.id = session_id and s.owner_id = auth.uid()
    )
  );

drop trigger if exists war_room_sessions_updated_at on public.war_room_sessions;
create trigger war_room_sessions_updated_at
  before update on public.war_room_sessions
  for each row execute function public.profiles_set_updated_at();

create index if not exists war_room_messages_session_idx
  on public.war_room_messages (session_id, created_at);
