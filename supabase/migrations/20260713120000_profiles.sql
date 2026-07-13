-- Perfis da comunidade Labfy
-- Aplicar no SQL Editor do Supabase (projeto mavrvyfrzojqfsvmafha)

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  headline text not null default '',
  avatar_url text,
  preferred_models text[] not null default '{}',
  preferred_harnesses text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "perfis são públicos para leitura"
  on public.profiles for select
  using (true);

create policy "dono insere o próprio perfil"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "dono atualiza o próprio perfil"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

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

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.profiles_set_updated_at();

-- cria o perfil automaticamente quando o usuário se cadastra
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- backfill dos usuários já existentes
insert into public.profiles (id)
select id from auth.users
on conflict (id) do nothing;

-- bucket público de avatares (máx 2MB, só imagem)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', true, 2097152, array['image/webp', 'image/jpeg', 'image/png'])
on conflict (id) do update
  set public = true,
      file_size_limit = 2097152,
      allowed_mime_types = array['image/webp', 'image/jpeg', 'image/png'];

-- cada usuário só escreve dentro da própria pasta ({uid}/...)
create policy "avatar: leitura pública"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "avatar: dono envia"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "avatar: dono atualiza"
  on storage.objects for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "avatar: dono remove"
  on storage.objects for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
