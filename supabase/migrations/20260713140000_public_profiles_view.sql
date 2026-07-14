-- View pública de perfis (task-04) — LGPD: expõe apenas campos não-sensíveis.
-- email e phone de public.profiles NUNCA entram aqui. É a fonte única de leitura
-- pública de membros/autores (RLS de profiles é só-dono; esta view roda como
-- definer para expor o subconjunto seguro a todos). Aplicada via Management API.

create or replace view public.public_profiles as
select
  id,
  full_name,
  headline,
  avatar_url,
  specialty,
  role,
  location,
  skills,
  preferred_models,
  preferred_harnesses,
  created_at
from public.profiles;

grant select on public.public_profiles to anon, authenticated;
