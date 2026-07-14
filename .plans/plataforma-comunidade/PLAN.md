---
feature: plataforma-comunidade
status: ready
created: 2026-07-13
brief: (origem: pedido falado do usuário, sintetizado pelo Tech Lead)
---

# PLAN — Plataforma de Comunidade (Membros, Prompts, Apps) + fixes de Perfil

## Context (read this first)

- **Projeto:** labfydev — plataforma web da comunidade Labfy (Next.js 16 App Router + Supabase, design system "Terminal Paper": Geist Mono, tema claro fixo, Tailwind + tokens CSS, `rounded-sm`, borda 1px — ver `DESIGN_SYSTEM.md` e `CLAUDE.md`).
- **Área tocada:** página de Perfil (ajustes), nova área de Membros, nova área de Prompts, nova área de Apps, e o sidebar (`src/app/components/sidebar.tsx`, array `mainNav`).
- **Por que existe:** a "comunidade" hoje é só um placeholder "Em breve". O usuário quer transformá-la num banco vivo de pessoas, prompts e apps — pesquisável, com dashboards e visões de grafo ("helicopter view").
- **Stack/convenções:** Server Components async lêem via `@/lib/supabase/server` `createClient()` + `supabase.auth.getUser()`; mutações via Server Actions (`"use server"`); acesso a dados = supabase-js direto (sem Kysely); charts via recharts (`src/components/ui/chart.tsx`); grafo via `@xyflow/react` + d3-force (`src/app/design-system/graph/use-force-layout.ts`). Gate de integração: `pnpm typecheck && pnpm lint`.

## Problem (why)

Dev solo tocando uma comunidade que precisa se auto-organizar. Membros não se acham entre si; não há repositório compartilhado de prompts; ninguém vê o que a comunidade está construindo. Tudo hoje é mock hardcoded (`src/app/mindmap/graph-data.ts`) ou placeholder. Falta a camada de dados reais + as telas de descoberta.

## Solution (what)

Três áreas públicas novas alimentadas pelo Supabase — **Membros** (diretório filtrável + dashboard raio-X), **Prompts** (editor Markdown + banco público buscável + helicopter view), **Apps** (o que cada um constrói com IA + gráfico por categoria) — mais os ajustes visuais na página de Perfil. Tudo respeitando LGPD (email/telefone nunca expostos) e reusando o motor de grafo/charts já existente.

## Goals (verifiable)

- Página de Perfil: avatar maior, com fundo branco mesmo em PNG transparente, e botão "Trocar foto" com respiro da capa preta.
- Usuário edita especialidade, cargo, localização e skills no próprio perfil.
- Qualquer visitante filtra membros por especialidade, nome, cargo e localização em `/membros`, sem ver email/telefone.
- `/membros` mostra cards de totais (ex: usuários de Claude Code, de GPT) + 3-4 gráficos raio-X.
- Usuário cria prompt em Markdown (editor visual), sempre público, com seu nome como autor; qualquer um busca prompts em `/prompts`.
- Usuário cadastra seus apps (nome, descrição, categoria, URL) no perfil; `/apps` mostra a galeria da comunidade + gráfico por categoria.
- Helicopter view: grafo agrupando prompts (assunto→subtópico), apps (categoria) e membros (especialidade).

## Non-Goals

- Sem chat/DM/mensageria entre membros.
- Sem prompts privados — todo prompt é público para a comunidade.
- Sem edição/exclusão de prompts ou apps de terceiros (só o dono).
- Sem taxonomia normalizada (assuntos/subtópicos são campos no próprio prompt, não tabelas).
- Sem dark mode (tema claro fixo permanece).
- Não redesenhar o `profile-form` existente — apenas acrescentar campos.
- Grafo full de todos os membros não é meta (não escala); o grafo é por agrupamento (helicopter view).

## Constraints

- **Stack:** ver `CLAUDE.md` (perfil Tech Lead + git autônomo). Não repetir convenções aqui.
- **Compliance (LGPD):** `profiles` tem `email` e `phone`. RLS atual de SELECT é **só-dono**. Leitura pública de membros DEVE passar por uma **view `public_profiles`** que exclui email/phone — Postgres não filtra RLS por coluna.
- **Migrations:** schema real vive no banco remoto; aplicar SQL via Supabase Management API (ver memória `project_labfy_supabase_access` / `~/.env/labfy.env` + `SUPABASE_PAT`). Versionar o `.sql` em `supabase/migrations/`. Todas as migrations aqui são **aditivas** (add column / create table / create view) — não destrutivas.
- **Escrita:** todas as tabelas novas seguem o padrão de RLS: SELECT público, INSERT/UPDATE/DELETE com `with check (auth.uid() = owner_id)`.

## Decisions

- **View `public_profiles`** (sem email/phone) para toda leitura pública de membros/autores — resolve LGPD sem desnormalizar.
- **Nome do autor** (em prompts/apps) resolvido via 2 queries no server (buscar itens → buscar `public_profiles` dos owners → juntar), pois views não suportam embedding por FK no supabase-js. Sem snapshot stale de nome.
- **Especialidade canônica:** `SPECIALTY_OPTIONS` em `src/lib/profile.ts` (como `MODEL_OPTIONS` já faz) → filtro limpo por dropdown. `role`/`location` como texto livre (filtro por ilike). `skills` como `text[]`.
- **Busca de prompts:** `ilike` em título/corpo/tópico no começo (mínimo necessário). tsvector só se escalar — não agora.
- **Editor Markdown:** ver `## Discovery`. Render público via `react-markdown` + `remark-gfm`.
- **Grafo genérico:** extrair `<ForceGraph nodes edges tags/>` parametrizando o que hoje é hardcoded em `buildInitialGraph`; o motor `use-force-layout.ts` já é agnóstico de domínio.
- **Navegação:** item "Comunidade (soon)" vira **"Membros"** (`/membros`). Novos em "Principal": **Prompts** (`/prompts`), **Apps** (`/apps`). Novo grupo **"Pessoal"** com **Meu Perfil** (`/perfil`). Cadastro de apps mora dentro de `/perfil` (seção "Meus Apps"); `/apps` é a visão pública.
- **Editor de prompts (DRIFT task-07)** — descartado `@uiw/react-md-editor` (recomendação original da Discovery) em favor de um **split-view próprio** (textarea mono + preview `react-markdown`). Motivo: o `@uiw` traz toolbar/CSS estilo GitHub que destoa do design Terminal Paper (mono, minimalista); o split-view é mais leve, sem CSS externo e coerente com o projeto. `react-markdown` + `remark-gfm` cobrem escrita e leitura.

## Discovery

**Editor Markdown (client)** — Recomendação: `@uiw/react-md-editor` (toolbar + live preview, pronto, tematizável via CSS vars, carregar com `dynamic(..., { ssr:false })`). Alternativas descartadas: `@mdxeditor/editor` (WYSIWYG, mais pesado e opinativo), `milkdown`/`tiptap` (headless, exige montar toolbar — esforço maior que "biblioteca pronta"). Confiança: **medium** — validar peer deps com **React 19 / Next 16** no momento do `pnpm add`; se conflitar, **fallback**: `<textarea>` estilizado + preview ao vivo com `react-markdown` + `remark-gfm` (zero risco de peer dep). Render de leitura usa `react-markdown` em ambos os caminhos.

**War Room — orquestração (Mastra vs Trigger.dev)** — Recomendação: **Trigger.dev v4.5.0**. Confiança: **high**. A v4.5.0 traz `chat.agent`/**Session** (canal de stream durável keyed por `externalId` estável, cujos `.in`/`.out` sobrevivem a suspend/crash/idle-timeout/redeploy — o run resume e o stream reconecta do último chunk), `useTriggerChatTransport` (ChatTransport para o `useChat` do Vercel AI SDK, realtime **sem API routes**) e AI SDK 7 com tool calls nativos (web search). Isso satisfaz os requisitos duros "resumível ao reabrir o navegador", "não frágil" e "realtime" **nativamente**. Mastra descartado: exigiria construir durabilidade + resume + realtime à mão. Fontes: changelog v4.5.0, docs Realtime Streams.

**War Room — pixel art (PixelLab)** — API `https://api.pixellab.ai/v2/create-image-pixflux` (Bearer). Credencial: `PIXELLAB_KEYS` (formato `nome:key;nome:key`) em `loot-hunter/.env.local`; usar o roteador `loot-hunter/scripts/pixellab-route.py --key` para pegar a conta com mais saldo. Scripts de referência de geração de personagem/animação já existem em `loot-hunter/scripts/`. Geração é **one-time** — assets salvos e versionados; a cena em runtime é composição estática dos sprites.

## Glossary

- **public_profiles:** view Postgres derivada de `profiles` sem `email`/`phone`; fonte única de leitura pública de pessoas.
- **Helicopter view:** grafo de força que agrupa itens por assunto/categoria (não um item por nó solto), para "olhar de cima" o mapa da comunidade.
- **Harness:** ferramenta de agente (Claude Code, Codex…) — coluna `preferred_harnesses` em profiles.

## Affected Areas

- `src/app/perfil/avatar-upload.tsx` — tamanho do avatar, fundo branco no canvas do crop, espaçamento do botão.
- `src/app/perfil/page.tsx` — padding do bloco sob a capa; nova seção "Meus Apps".
- `src/app/perfil/profile-form.tsx` + `src/app/perfil/actions.ts` — novos campos de perfil.
- `src/components/ui/avatar.tsx` — fundo branco de fallback no `AvatarImage`.
- `src/lib/profile.ts` — `SPECIALTY_OPTIONS` e tipos novos.
- `src/app/components/sidebar.tsx` — itens Membros/Prompts/Apps + grupo "Pessoal".
- `supabase/migrations/` — novos `.sql` (campos de profile, view public_profiles, tabelas prompts e apps).
- `src/app/membros/`, `src/app/prompts/`, `src/app/apps/` — páginas novas (dir).
- `src/app/design-system/graph/use-force-layout.ts` + `src/app/mindmap/*` — extração do `<ForceGraph>` genérico.
- **War Room:** `src/app/war-room/` (rota + cena), `src/trigger/` (tasks Trigger.dev), `trigger.config.ts`, `public/war-room/` (sprites), `supabase/migrations/` (war_room_sessions/messages), `src/app/components/sidebar.tsx` (item War Room).

---

## Tasks

### task-01: Corrigir avatar, fundo branco e espaçamento na página de Perfil

- **type:** `auto`
- **effort:** `S`
- **slice:** vertical (toca: UI + canvas de upload)
- **depends_on:** []
- **read_first:**
  - `src/app/perfil/avatar-upload.tsx` — avatar em `size-20` (L140), canvas WebP em `getCroppedBlob` (achata transparência), wrapper do botão (L149) e container `items-end` (L133).
  - `src/app/perfil/page.tsx` — capa `bg-black h-24` (L39) e bloco `px-6 pb-6` sem `pt` (L45).
  - `src/components/ui/avatar.tsx` — `AvatarImage` só com `object-cover` (L33), sem background.
- **files_modified:**
  - `src/app/perfil/avatar-upload.tsx` (modify)
  - `src/app/perfil/page.tsx` (modify)
  - `src/components/ui/avatar.tsx` (modify)
- **action:**
  1. Aumentar o avatar (ex: `size-20` → `size-28`/`size-32`); ajustar o `-mt-8` do wrapper e/ou `h-24` da capa para manter a sobreposição proporcional.
  2. No `getCroppedBlob`, pintar o canvas com branco (`fillStyle=#fff; fillRect` do tamanho total) **antes** do `drawImage` — assim PNG transparente exporta com fundo branco no WebP (correção de raiz).
  3. Adicionar `bg-white` no `AvatarImage` (ou no root do `Avatar`) como fallback de exibição para imagens já transparentes.
  4. Dar respiro ao botão: `pt-*` no bloco `px-6 pb-6` de `page.tsx:45` e/ou `mt-*` no wrapper do botão — o botão não pode encostar na capa preta.
- **acceptance:**
  - [x] `avatar-upload.tsx` não contém mais `size-20` para o avatar (grep `size-20` retorna vazio nesse arquivo)
  - [x] `getCroppedBlob` contém `fillRect` (grep `fillRect` em `avatar-upload.tsx`)
  - [x] `avatar.tsx` `AvatarImage` contém `bg-white` (grep)
  - [x] `page.tsx` bloco pós-capa tem classe `pt-` (grep `pt-` no bloco de conteúdo)
- **must_pass:** `pnpm typecheck && pnpm lint`

### task-02: visual smoke do Perfil (Playwright)

- **type:** `checkpoint:human-verify`
- **what_built:** `pnpm dev` em `http://localhost:3000/perfil` (logado).
- **how_to_verify:** via Playwright MCP: navegar, screenshot em 3 viewports (mobile 390, tablet 768, desktop 1280). Conferir: avatar maior e redondo; upload de PNG transparente aparece com fundo branco (não preto); botão "Trocar foto" com respiro da capa preta.
- **resume_signal:** usuário/Tech Lead responde "approved" ou descreve o ajuste.

### task-03: Campos de comunidade no perfil (especialidade, cargo, localização, skills)

- **type:** `auto`
- **effort:** `M`
- **slice:** vertical (toca: schema → action → form UI)
- **depends_on:** []
- **rollback:** `alter table profiles drop column specialty, drop column role, drop column location, drop column skills;`
- **read_first:**
  - `supabase/migrations/20260713120000_profiles.sql` — padrão aditivo `add column if not exists`.
  - `src/lib/profile.ts` — `MODEL_OPTIONS`/`HARNESS_OPTIONS` (padrão para `SPECIALTY_OPTIONS`) e tipo `Profile`.
  - `src/app/perfil/profile-form.tsx` + `actions.ts` — como campos são renderizados e salvos (server action, validação server-side).
- **files_modified:**
  - `supabase/migrations/<ts>_profile_community_fields.sql` (new)
  - `src/lib/profile.ts` (modify)
  - `src/app/perfil/profile-form.tsx` (modify)
  - `src/app/perfil/actions.ts` (modify)
  - `src/app/perfil/page.tsx` (modify — incluir novos campos no `select`)
- **action:**
  1. Migration aditiva: `specialty text`, `role text`, `location text`, `skills text[] not null default '{}'` em `profiles`. Aplicar via Management API + versionar `.sql`.
  2. `SPECIALTY_OPTIONS` canônico em `profile.ts` (ex: Frontend, Backend, Fullstack, Data/ML, DevOps, Security, Design, Produto, Mobile, Outro) e estender o tipo `Profile`.
  3. Estender `profile-form.tsx`: select de especialidade, inputs de cargo/localização, editor de skills (multi, no padrão dos models/harnesses existentes).
  4. Estender a server action para persistir os novos campos (validação server-side, sem confiar no cliente).
- **acceptance:**
  - [x] Migration `.sql` existe e contém `specialty`, `role`, `location`, `skills`
  - [x] `profile.ts` exporta `SPECIALTY_OPTIONS` (grep)
  - [x] `profile-form.tsx` referencia `specialty`, `role`, `location`, `skills` (grep)
  - [x] server action grava os 4 campos (grep em `actions.ts`)
- **must_pass:** `pnpm typecheck && pnpm lint`

> 🔄 bom ponto de /clear — o plano carrega o resto

### task-04: View pública + Membros (sidebar + diretório filtrável)

- **type:** `auto`
- **effort:** `L`
- **slice:** vertical (toca: DB view/RLS → sidebar → page → filtros UI)
- **depends_on:** [`task-03`]
- **rollback:** `drop view public_profiles;` e reverter o item do sidebar.
- **read_first:**
  - Relato de RLS: SELECT de `profiles` é só-dono → **precisa** da view sem email/phone.
  - `src/app/components/sidebar.tsx` — array `mainNav` (L40-45), tipo `NavItem`, ícones lucide.
  - `src/app/comunidade/page.tsx` — placeholder atual (será substituído por `/membros`).
  - `src/components/ui/{table,card,input,select,badge}.tsx` — componentes prontos.
- **files_modified:**
  - `supabase/migrations/<ts>_public_profiles_view.sql` (new)
  - `src/app/components/sidebar.tsx` (modify — "Comunidade" vira "Membros" → `/membros`)
  - `src/app/membros/page.tsx` (new)
  - `src/app/membros/members-directory.tsx` (new — client, filtros)
- **action:**
  1. Migration: `create view public_profiles as select id, full_name, headline, avatar_url, specialty, role, location, skills, preferred_models, preferred_harnesses, created_at from profiles;` + grant select para `anon, authenticated`. Garantir que email/phone NÃO estão na view.
  2. Sidebar: trocar item "Comunidade" (`soon`) por "Membros" → `/membros` (ícone `Users`).
  3. `/membros` (Server Component): ler `public_profiles`, passar para o client `members-directory`.
  4. `members-directory`: grid de cards responsivo (1 col mobile → N desktop) + filtros por especialidade (select), nome (input), cargo (input), localização (input). Nenhum campo de email/phone em lugar nenhum.
- **acceptance:**
  - [x] Migration cria `public_profiles` e o `.sql` NÃO contém `email`/`phone` na lista de colunas (grep)
  - [x] `sidebar.tsx` contém item com href `/membros` (grep)
  - [x] `src/app/membros/page.tsx` lê de `public_profiles` e NÃO referencia `email`/`phone` (grep)
  - [x] `members-directory.tsx` tem os 4 filtros (grep `specialty`, `location`, e inputs de nome/cargo)
- **must_pass:** `pnpm typecheck && pnpm lint`

### task-05: Dashboard raio-X da comunidade (cards + gráficos)

- **type:** `auto`
- **effort:** `M`
- **slice:** vertical (toca: query agregada → charts)
- **depends_on:** [`task-04`]
- **read_first:**
  - `src/components/ui/chart.tsx` — wrapper recharts (`ChartContainer`, `ChartConfig`).
  - `src/app/design-system/chart-demo.tsx` — exemplo real de BarChart com tokens.
- **files_modified:**
  - `src/app/membros/page.tsx` (modify — agregações no topo)
  - `src/app/membros/community-stats.tsx` (new — cards + charts)
- **action:**
  1. No Server Component, computar agregados a partir de `public_profiles`: totais por harness (ex: quantos "Claude Code"), por model (ex: "GPT"), por especialidade, por localização.
  2. Cards macro no topo (total de membros; total por harness/model destacados).
  3. 3-4 gráficos raio-X com recharts (ex: Pie de especialidade, Pie/Bar de harnesses, Bar de localização) usando cores de token.
  4. Layout responsivo: cards empilham no mobile; charts em grid que colapsa.
- **acceptance:**
  - [x] `community-stats.tsx` importa de `@/components/ui/chart` (grep)
  - [x] há ao menos 1 `PieChart` e 1 `BarChart` (grep no arquivo)
  - [x] `membros/page.tsx` computa contagem por `preferred_harnesses` (grep `preferred_harnesses`)
- **must_pass:** `pnpm typecheck && pnpm lint`

> 🔄 bom ponto de /clear — o plano carrega o resto

### task-06: Prompts — schema + lista + busca

- **type:** `auto`
- **effort:** `M`
- **slice:** vertical (toca: schema/RLS → sidebar → page lista/busca)
- **depends_on:** []
- **rollback:** `drop table prompts;` e reverter item do sidebar.
- **read_first:**
  - Padrão RLS-público (SELECT público, escrita do dono via `auth.uid() = owner_id`).
  - `src/app/components/sidebar.tsx` — como adicionar item.
  - Decisão "nome do autor via 2 queries + `public_profiles`".
- **files_modified:**
  - `supabase/migrations/<ts>_prompts.sql` (new)
  - `src/app/components/sidebar.tsx` (modify — item "Prompts" → `/prompts`)
  - `src/app/prompts/page.tsx` (new — lista + busca)
  - `src/app/prompts/prompts-list.tsx` (new — client, busca ilike client-side ou via query param)
- **action:**
  1. Migration `prompts`: `id uuid pk default gen_random_uuid()`, `owner_id uuid references auth.users`, `title text not null`, `body text not null` (markdown), `topic text`, `subtopic text`, `tags text[] default '{}'`, `created_at`, `updated_at`. RLS: SELECT público; INSERT/UPDATE/DELETE `with check (auth.uid() = owner_id)`.
  2. Sidebar: item "Prompts" → `/prompts` (ícone sugerido `ScrollText`).
  3. `/prompts`: listar prompts (mais recentes), resolver nome do autor via `public_profiles`, card com título/autor/tópico/trecho.
  4. Busca por título/corpo/tópico (`ilike`).
- **acceptance:**
  - [x] Migration cria tabela `prompts` com `owner_id`, `body`, `topic` (grep)
  - [x] `.sql` contém policy de SELECT pública e `with check (auth.uid() = owner_id)` (grep)
  - [x] `sidebar.tsx` contém href `/prompts` (grep)
  - [x] `prompts/page.tsx` resolve autor via `public_profiles` (grep) e NÃO expõe email
- **must_pass:** `pnpm typecheck && pnpm lint`

### task-07: Prompts — editor Markdown (criar) + render (ler)

- **type:** `auto`
- **effort:** `M`
- **slice:** vertical (toca: lib → criar UI → server action → view render)
- **depends_on:** [`task-06`]
- **read_first:**
  - `## Discovery` (escolha de editor + fallback).
  - `src/app/perfil/actions.ts` — padrão de server action com validação.
- **files_modified:**
  - `package.json` (modify — add editor + `react-markdown` + `remark-gfm`)
  - `src/app/prompts/novo/page.tsx` (new — criar)
  - `src/app/prompts/prompt-editor.tsx` (new — client, editor markdown, `dynamic ssr:false`)
  - `src/app/prompts/actions.ts` (new — `createPrompt`, sempre público)
  - `src/app/prompts/[id]/page.tsx` (new — render com react-markdown)
- **action:**
  1. Instalar o editor escolhido na Discovery (validar peer deps React 19; se falhar, usar fallback textarea+preview). Instalar `react-markdown` + `remark-gfm` para render.
  2. `/prompts/novo`: editor Markdown + campos título/tópico/subtópico/tags. Botão salvar → `createPrompt` (sempre `owner_id = user`, sem opção de privado).
  3. `/prompts/[id]`: renderizar `body` com react-markdown + nome do autor (via `public_profiles`).
  4. Bloquear criação para deslogado (redirect `/entrar`).
- **acceptance:**
  - [x] `package.json` inclui `react-markdown` e `remark-gfm` (grep)
  - [x] `prompt-editor.tsx` é client component com preview via `react-markdown` (split Escrever/Preview) — DRIFT: fallback em vez de `@uiw` (ver Decisions)
  - [x] `actions.ts` grava `owner_id` do user autenticado e NÃO tem flag de privacidade (grep — sem `is_private`)
  - [x] `[id]/page.tsx` importa `react-markdown` (grep)
- **must_pass:** `pnpm typecheck && pnpm lint`

> 🔄 bom ponto de /clear — o plano carrega o resto

### task-08: Apps — schema + cadastro pessoal no Perfil + grupo "Pessoal"

- **type:** `auto`
- **effort:** `M`
- **slice:** vertical (toca: schema/RLS → sidebar grupo → seção no perfil → server actions CRUD)
- **depends_on:** []
- **rollback:** `drop table apps;` e reverter sidebar.
- **read_first:**
  - Padrão RLS-público + escrita do dono.
  - `src/app/perfil/page.tsx` — onde encaixar a seção "Meus Apps".
  - `src/app/components/sidebar.tsx` — criar 2º `SidebarGroup` "Pessoal".
- **files_modified:**
  - `supabase/migrations/<ts>_apps.sql` (new)
  - `src/app/components/sidebar.tsx` (modify — grupo "Pessoal" com "Meu Perfil")
  - `src/app/perfil/page.tsx` (modify — seção "Meus Apps")
  - `src/app/perfil/my-apps.tsx` (new — client CRUD)
  - `src/app/perfil/apps-actions.ts` (new — create/update/delete apps do dono)
- **action:**
  1. Migration `apps`: `id uuid pk`, `owner_id uuid`, `name text not null`, `description text`, `category text`, `url text`, `created_at`, `updated_at`. RLS: SELECT público; escrita `with check (auth.uid() = owner_id)`.
  2. Sidebar: novo `SidebarGroup` "Pessoal" com "Meu Perfil" → `/perfil`.
  3. Seção "Meus Apps" em `/perfil`: listar apps do usuário + form de add/editar/remover (nome, descrição, categoria, URL).
  4. Server actions CRUD restritas ao dono.
- **acceptance:**
  - [ ] Migration cria tabela `apps` com `owner_id`, `category`, `url` (grep)
  - [ ] `.sql` tem SELECT público + `with check (auth.uid() = owner_id)` (grep)
  - [ ] `sidebar.tsx` tem 2 `SidebarGroupLabel` (grep — "Principal" e "Pessoal")
  - [ ] `my-apps.tsx` faz create e delete via action (grep)
- **must_pass:** `pnpm typecheck && pnpm lint`

### task-09: Apps — galeria pública `/apps` + gráfico por categoria

- **type:** `auto`
- **effort:** `M`
- **slice:** vertical (toca: sidebar → page → chart)
- **depends_on:** [`task-08`]
- **read_first:**
  - `src/components/ui/chart.tsx` e `community-stats.tsx` (task-05) como referência de chart.
- **files_modified:**
  - `src/app/components/sidebar.tsx` (modify — item "Apps" → `/apps`)
  - `src/app/apps/page.tsx` (new — galeria + chart)
  - `src/app/apps/apps-gallery.tsx` (new — client, filtro por categoria)
- **action:**
  1. Sidebar: item "Apps" → `/apps` (ícone sugerido `Boxes`) no grupo "Principal".
  2. `/apps`: galeria de todos os apps (nome, descrição, categoria, link externo, autor via `public_profiles`), responsiva.
  3. Gráfico por categoria (recharts, Pie/Bar) no topo.
  4. Filtro por categoria.
- **acceptance:**
  - [ ] `sidebar.tsx` contém href `/apps` (grep)
  - [ ] `apps/page.tsx` lê tabela `apps` + autor via `public_profiles` (grep)
  - [ ] `apps-gallery.tsx` agrupa por `category` para o chart (grep)
- **must_pass:** `pnpm typecheck && pnpm lint`

> 🔄 bom ponto de /clear — o plano carrega o resto

### task-10: Helicopter view — grafo genérico parametrizado (prompts, apps, membros)

- **type:** `auto`
- **effort:** `L`
- **slice:** vertical (toca: refactor grafo → 3 fontes de dados → páginas)
- **depends_on:** [`task-06`, `task-08`]
- **read_first:**
  - `src/app/design-system/graph/use-force-layout.ts` — motor d3-force já genérico.
  - `src/app/mindmap/mindmap-graph.tsx` + `graph-data.ts` — `buildInitialGraph` hardcoded (grau→tamanho, layout circular, floating edges); modelo macro→subtag→item já é exatamente assunto→subtópico→item.
  - `src/app/design-system/graph/{floating-edge,geometry,graph-node}.tsx`.
- **files_modified:**
  - `src/app/components/force-graph.tsx` (new — `<ForceGraph nodes edges tags/>` genérico extraído do mindmap)
  - `src/app/mindmap/mindmap-graph.tsx` (modify — passar a consumir o componente genérico, sem regressão)
  - `src/app/prompts/mapa/page.tsx` (new — grafo de prompts por topic→subtopic)
  - `src/app/apps/page.tsx` (modify — aba/visão de grafo por categoria) ou `src/app/apps/mapa/page.tsx` (new)
- **action:**
  1. Extrair `buildInitialGraph` + `MindMapGraph` para um `<ForceGraph>` que recebe `nodes`/`edges`/`tags` por prop (nó custom por `kind`). Manter `/mindmap` funcionando idêntico (consumindo o novo componente).
  2. Grafo de **prompts**: nós = prompts, agrupados por `topic`→`subtopic`; arestas item→subtópico→assunto. Alimentar de dados reais.
  3. Grafo de **apps**: nós = apps agrupados por `category`.
  4. (Se sobrar escopo) grafo de **membros** por `specialty` — opcional, é o menos escalável.
- **acceptance:**
  - [ ] `force-graph.tsx` exporta um componente que aceita `nodes` e `edges` por prop (grep — assinatura com props)
  - [ ] `/mindmap` continua renderizando (must_pass typecheck + smoke visual)
  - [ ] existe uma rota de mapa de prompts que constrói nós a partir de `topic`/`subtopic` (grep)
- **must_pass:** `pnpm typecheck && pnpm lint`

> 🔄 bom ponto de /clear — a War Room (task-11+) é um épico próprio; contexto fresco ajuda

---

## War Room — contexto e decisões (épico final, task-11 a task-15)

Feature: uma "sala de guerra" pixelada onde 4 personagens-LLM debatem um prompt do usuário
em tempo real até uma conclusão. É a maior feature do backlog — ao chegar na task-11, vale
um `/dev-brainstorm` curto para travar **endpoints/modelos reais disponíveis** antes de codar.

**Personagens** (persona visual → modelo; o modelo exato é resolvido na execução conforme
disponibilidade via Vercel AI SDK providers / vLLM do calneyserver — se um modelo específico
não estiver acessível, mapear para o mais próximo e registrar no drift log):
- **DeepSeek** — sábio chinês · modelo família DeepSeek (ex: "DeepSeek V4 Pro")
- **Gemma** — moderno/americano · modelo família Gemma (ex: "Gemma 4 31B")
- **Hermes** — Hermes, filho de Zeus (deus grego) · modelo família Hermes/Nous (ex: "Hermes 405B")
- **MiniMax** — europeu · modelo família MiniMax (ex: "MiniMax M3")

**Decisões-chave** (ver `## Discovery`):
- **Orquestração:** Trigger.dev v4.5.0 (`chat.agent`/Session durável + realtime). Resume ao
  reabrir o navegador e realtime saem de graça da plataforma — requisito duro atendido nativamente.
- **Fluxo:** (1) usuário envia prompt → (2) fase RESEARCH: 4 agentes fazem web search em
  paralelo com ângulos/fontes **diversificados** → (3) fase DEBATE: 10-12 turnos rotativos,
  contexto compartilhado (todos veem tudo), streaming → (4) fase CONCLUSION: síntese final.
- **Web search (tool):** opencrawl self-hosted (custo zero) como provider primário, exposto
  como tool do AI SDK; cada agente é instruído a variar queries/fontes.
- **Persistência:** Supabase (`war_room_sessions`, `war_room_messages`) como registro durável +
  reidratação da UI e histórico; a resumibilidade em tempo real vem da Session do Trigger.dev.
- **Pixel art:** PixelLab (one-time), sprites em `public/war-room/`, cena = composição estática
  com highlight de quem fala.

---

## Tasks — War Room

### task-11: War Room — fundação (Trigger.dev + schema + sidebar + rota)

- **type:** `auto`
- **effort:** `L`
- **slice:** vertical (toca: infra Trigger.dev → schema/RLS → sidebar → rota esqueleto)
- **depends_on:** []
- **rollback:** `drop table war_room_messages; drop table war_room_sessions;` + remover `trigger.config.ts` e item do sidebar.
- **read_first:**
  - `## Discovery` (War Room — orquestração) e `## War Room — contexto e decisões`.
  - `src/app/components/sidebar.tsx` — padrão de item.
  - skill `triggerdev` (padrões de task/config Trigger.dev) + docs v4.5.0.
- **files_modified:**
  - `package.json` (modify — `@trigger.dev/sdk` v4.5.0 + AI SDK)
  - `trigger.config.ts` (new)
  - `supabase/migrations/<ts>_war_room.sql` (new)
  - `src/app/components/sidebar.tsx` (modify — item "War Room" → `/war-room`, ícone sugerido `Swords`)
  - `src/app/war-room/page.tsx` (new — esqueleto)
- **action:**
  1. Instalar/configurar Trigger.dev v4.5.0 (projeto, `trigger.config.ts`, `TRIGGER_SECRET_KEY` no ambiente/Coolify). Validar peer deps com React 19/Next 16.
  2. Migration: `war_room_sessions` (id, owner_id, prompt, status, external_id, created_at) e `war_room_messages` (id, session_id, character, phase, content, turn, created_at). RLS: dono cria/lê/gerencia suas sessões; mensagens visíveis a quem lê a sessão.
  3. Sidebar: item "War Room" → `/war-room`.
  4. `/war-room`: página esqueleto (cena virá na task-12).
- **acceptance:**
  - [ ] `package.json` inclui `@trigger.dev/sdk` (grep)
  - [ ] `trigger.config.ts` existe
  - [ ] Migration cria `war_room_sessions` e `war_room_messages` com `owner_id` + RLS (grep)
  - [ ] `sidebar.tsx` contém href `/war-room` (grep)
- **must_pass:** `pnpm typecheck && pnpm lint`

### task-12: War Room — assets pixel art + cena estática

- **type:** `auto`
- **effort:** `M`
- **slice:** vertical (toca: geração PixelLab → assets → componente de cena)
- **depends_on:** [`task-11`]
- **read_first:**
  - `## Discovery` (War Room — pixel art) + `loot-hunter/scripts/pixellab-route.py` e um script de geração de referência (`hero-concepts.py`).
- **files_modified:**
  - `scripts/gen-war-room-pixels.mjs` (new — chama PixelLab, one-time)
  - `public/war-room/*` (new — salão + 4 personagens 64x64)
  - `src/app/war-room/scene.tsx` (new — composição estática dos sprites sobre o fundo)
- **action:**
  1. Script de geração via `create-image-pixflux` (Bearer da key roteada por `PIXELLAB_KEYS`): salão com mesa redonda + 4 personagens 64x64 fiéis às personas (sábio chinês, americano moderno, Hermes grego, europeu). Salvar em `public/war-room/`.
  2. `scene.tsx`: compõe os 4 sprites ao redor da mesa sobre o fundo (posição absoluta), com estado de "quem está falando" (highlight/glow).
- **acceptance:**
  - [ ] `public/war-room/` contém ≥5 imagens (salão + 4 personagens)
  - [ ] `scene.tsx` posiciona 4 personagens e aceita prop de "personagem ativo" (grep)
- **must_pass:** `pnpm typecheck && pnpm lint`

### task-13: War Room — orquestração do debate (Trigger.dev task)

- **type:** `auto`
- **effort:** `L`
- **slice:** vertical (toca: config personagens → tool web search → task durável → persistência)
- **depends_on:** [`task-11`]
- **read_first:**
  - `## War Room — contexto e decisões` (fluxo research→debate→conclusion, personagens).
  - skill `webscrapping-anything`/opencrawl para a tool de web search.
- **files_modified:**
  - `src/trigger/war-room-debate.ts` (new — task durável)
  - `src/lib/war-room/characters.ts` (new — `WAR_ROOM_CHARACTERS`: id, name, persona, systemPrompt, provider/model)
  - `src/lib/war-room/web-search.ts` (new — tool AI SDK sobre opencrawl)
- **action:**
  1. `WAR_ROOM_CHARACTERS` com os 4 (persona + systemPrompt + provider/model resolvível).
  2. Tool `webSearch` (opencrawl) exposta ao AI SDK; agentes diversificam fontes.
  3. Task Trigger.dev: fase RESEARCH (4 agentes em paralelo, cada um pesquisa) → DEBATE (10-12 turnos rotativos, contexto compartilhado) → CONCLUSION. Cada fala é persistida em `war_room_messages` e emitida no stream da Session.
- **acceptance:**
  - [ ] `characters.ts` define os 4 personagens (grep `deepseek|gemma|hermes|minimax`, case-insensitive)
  - [ ] `war-room-debate.ts` grava em `war_room_messages` e cobre as 3 fases (grep `research|debate|conclusion`)
  - [ ] `web-search.ts` exporta uma tool de busca (grep)
- **must_pass:** `pnpm typecheck && pnpm lint`

### task-14: War Room — frontend realtime + input

- **type:** `auto`
- **effort:** `L`
- **slice:** vertical (toca: input → disparo do run → streaming na cena)
- **depends_on:** [`task-12`, `task-13`]
- **read_first:**
  - `## Discovery` (`useTriggerChatTransport`/`useChat`).
  - `src/app/war-room/scene.tsx` (task-12) para plugar as falas.
- **files_modified:**
  - `src/app/war-room/war-room-client.tsx` (new — input + streaming + cena)
  - `src/app/war-room/actions.ts` (new — cria sessão e dispara a task)
- **action:**
  1. Input de prompt; ao enviar, cria `war_room_sessions` e dispara a task Trigger.dev (externalId = session id).
  2. `useChat` + `useTriggerChatTransport` streamando as falas; renderizar cada intervenção no personagem correspondente (balão/painel) + highlight na cena; conclusão final destacada.
- **acceptance:**
  - [ ] `war-room-client.tsx` usa `useChat`/`useTriggerChatTransport` (grep)
  - [ ] `actions.ts` cria sessão e dispara a task com `externalId` (grep)
  - [ ] falas são renderizadas por personagem (grep)
- **must_pass:** `pnpm typecheck && pnpm lint`

### task-15: War Room — resumibilidade + robustez

- **type:** `auto`
- **effort:** `M`
- **slice:** vertical (toca: resume → erro/retry → reidratação)
- **depends_on:** [`task-14`]
- **read_first:**
  - `## Discovery` (Session sobrevive a refresh/crash; resume do último chunk).
- **files_modified:**
  - `src/app/war-room/page.tsx` (modify — reidratar sessão em aberto do usuário)
  - `src/app/war-room/war-room-client.tsx` (modify — reconectar stream por externalId)
  - `src/trigger/war-room-debate.ts` (modify — retries/idempotência)
- **action:**
  1. Ao abrir `/war-room` com sessão em andamento, reidratar de `war_room_messages` e **reconectar** o stream da Session (externalId) — retomar de onde parou.
  2. Retries/idempotência na task; tratamento de falha de um agente sem derrubar o debate.
- **acceptance:**
  - [ ] reabrir a rota reconecta o stream por `externalId` (grep) e reidrata mensagens do Supabase (grep)
  - [ ] a task define política de retry (grep `retry`)
- **must_pass:** `pnpm typecheck && pnpm lint`

---

## Must-Haves (goal-backward verification)

### Truths (observable behaviors)
- [ ] Em `/perfil`, upload de PNG transparente aparece com fundo branco (não preto); avatar visivelmente maior; botão "Trocar foto" não encosta na capa preta.
- [ ] Usuário salva especialidade/cargo/localização/skills e eles persistem após reload.
- [ ] Visitante filtra membros por especialidade/nome/cargo/localização em `/membros`; email/telefone nunca aparecem no DOM nem na rede.
- [ ] `/membros` mostra cards de totais + ≥3 gráficos.
- [ ] Usuário logado cria um prompt Markdown público e ele aparece em `/prompts` com o nome do autor; deslogado não cria.
- [ ] Usuário cadastra um app no perfil e ele aparece em `/apps` com gráfico por categoria.
- [ ] Existe ao menos um grafo helicopter view (prompts) renderizando dados reais.
- [ ] War Room: usuário envia um prompt e vê os 4 personagens debaterem em tempo real (research → debate → conclusão); ao fechar e reabrir o navegador, a sessão retoma de onde parou.

### Artifacts (arquivos com substância real)
- `supabase/migrations/*_public_profiles_view.sql` — cria view sem email/phone.
- `src/app/membros/members-directory.tsx` — >40 linhas, 4 filtros.
- `src/app/prompts/prompt-editor.tsx` — editor Markdown client, `dynamic ssr:false`.
- `src/app/perfil/my-apps.tsx` — CRUD de apps do dono.
- `src/app/components/force-graph.tsx` — grafo genérico com props `nodes`/`edges`.

### Key Links (conexões críticas)
- `membros/page.tsx` → `public_profiles` via supabase-js — regex: `from\(['"]public_profiles`
- `prompts/actions.ts` → `auth.uid()` do dono — regex: `owner_id`
- `prompt-editor.tsx` → render — regex: `react-markdown`
- nenhuma leitura pública toca colunas sensíveis — regex NEGATIVO: grep `email|phone` em `src/app/{membros,prompts,apps}/**` deve retornar vazio.

### Demo Script (a feature em 60 segundos)
1. `pnpm dev` → abrir `/perfil` — avatar grande, fundo branco no PNG, botão com respiro; preencher especialidade/cargo/localização e salvar.
2. Abrir `/membros` — filtrar por especialidade e por nome; ver cards de totais e gráficos; confirmar (DevTools > Network) que nenhuma resposta traz email/phone.
3. `/prompts/novo` — escrever um prompt em Markdown, salvar; vê-lo em `/prompts` com seu nome; abrir o prompt e ver o Markdown renderizado.
4. `/perfil` → adicionar um app (nome/categoria/URL); abrir `/apps` e ver o card + o gráfico por categoria.
5. Abrir o mapa de prompts — ver o grafo agrupado por assunto/subtópico.

---

## Reset Protocol

Para retomar do zero em uma nova sessão:

1. **Read** este arquivo (`.plans/plataforma-comunidade/PLAN.md`) integralmente.
2. **Read** `CLAUDE.md` do projeto (perfil Tech Lead + git autônomo + gate) e `DESIGN_SYSTEM.md`.
3. **Read** os `read_first` da próxima task com status `[ ]`.
4. Executar via `/dev-coding` a partir da primeira task pendente.
5. Marcar `[x]` em `acceptance`; atualizar `## Status Log`. Migrations aplicadas via Supabase Management API (memória `project_labfy_supabase_access`).

---

## Status Log

Atualizado por `/dev-coding` durante execução. Não preencher antes.

- 2026-07-13 — task-01 ✅ avatar `size-28`, fundo branco no canvas do crop + `bg-white` no AvatarImage, `pt-5` de respiro do botão. Gate verde.
- 2026-07-13 — task-02 ⏸️ aguardando smoke visual humano (Playwright/perfil exige login). NÃO bloqueia demais tasks — seguindo para task-03.
- 2026-07-13 — task-03 ✅ colunas specialty/role/location/skills aplicadas no banco (Management API, status 201, verificadas) + form estendido (especialidade ToggleChips, cargo/local inputs, skills chips) + validação server-side. Gate verde.
- 2026-07-13 — task-04 ✅ view public_profiles criada (201, colunas verificadas SEM email/phone, vazamento=0) + sidebar Comunidade→Membros + /membros com diretório filtrável (nome/especialidade/cargo/localização) + /comunidade redireciona. Gate verde.
- 2026-07-13 — backlog: adicionado épico War Room (task-11 a task-15) ao fim do plano. Decisões travadas: Trigger.dev v4.5.0 (durável/realtime/resume nativo), PixelLab para sprites (creds em loot-hunter/.env.local), fluxo research→debate→conclusion, persistência Supabase. Execução continua na ordem — War Room só após task-10.
- 2026-07-13 — task-05 ✅ dashboard raio-X em /membros: 4 cards macro (total, Claude Code, GPT, especialidades) + Pie por especialidade + Bars por harness e localização (recharts). Agregados computados no server component. Gate verde.
- 2026-07-13 — task-06 ✅ tabela prompts (201, RLS: select público + insert/update/delete do dono) + sidebar item Prompts + /prompts (lista + busca client-side por título/tópico/tag/corpo; autor via public_profiles em 2ª query). Gate verde.
- 2026-07-13 — task-07 ✅ editor de prompts split-view (Escrever/Preview) + /prompts/novo (bloqueia deslogado) + createPrompt (sempre público, owner_id do user) + /prompts/[id] render react-markdown. DRIFT: @uiw descartado por consistência de design (ver Decisions), fallback react-markdown. Gate verde.
