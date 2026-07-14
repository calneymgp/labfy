-- Habilita Supabase Realtime na tabela de mensagens da War Room (task-14) —
-- o frontend assina INSERTs em war_room_messages para streamar as falas.
-- Aplicada via Supabase Management API em 2026-07-14.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'war_room_messages'
  ) then
    alter publication supabase_realtime add table public.war_room_messages;
  end if;
end $$;
