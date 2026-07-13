-- Perfil da comunidade Labfy — aditivo sobre a tabela public.profiles já existente
-- (criada no fluxo de cadastro com id, email, phone, created_at + trigger
-- on_auth_user_created/handle_new_user e RLS select/update do próprio dono).
-- Aplicada via Supabase Management API em 2026-07-13.

alter table public.profiles
  add column if not exists full_name text not null default '',
  add column if not exists headline text not null default '',
  add column if not exists avatar_url text,
  add column if not exists preferred_models text[] not null default '{}',
  add column if not exists preferred_harnesses text[] not null default '{}',
  add column if not exists updated_at timestamptz not null default now();

-- updated_at automático
create or replace function public.profiles_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.profiles_set_updated_at();

-- upsert defensivo do próprio perfil (linha normalmente já criada pelo trigger de signup)
drop policy if exists profiles_insert_own on public.profiles;
create policy profiles_insert_own
  on public.profiles for insert to authenticated
  with check (auth.uid() = id);

-- backfill: usuários criados antes do trigger existir
insert into public.profiles (id, email)
select id, lower(email) from auth.users
on conflict (id) do nothing;

-- bucket público de avatares (máx 2MB, só imagem)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', true, 2097152, array['image/webp', 'image/jpeg', 'image/png'])
on conflict (id) do update
  set public = true,
      file_size_limit = 2097152,
      allowed_mime_types = array['image/webp', 'image/jpeg', 'image/png'];

-- cada usuário só escreve dentro da própria pasta ({uid}/...)
drop policy if exists "avatar: leitura pública" on storage.objects;
create policy "avatar: leitura pública"
  on storage.objects for select
  using (bucket_id = 'avatars');

drop policy if exists "avatar: dono envia" on storage.objects;
create policy "avatar: dono envia"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "avatar: dono atualiza" on storage.objects;
create policy "avatar: dono atualiza"
  on storage.objects for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "avatar: dono remove" on storage.objects;
create policy "avatar: dono remove"
  on storage.objects for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
