# Design System — Labfy

> Documenta o sistema visual **em uso hoje** no `labfydev` (labfy.dev). Não é um espelho do portfolio do Calney — foi usado como ponto de partida, mas o Labfy evoluiu para sua própria identidade e este arquivo descreve só o que está de fato implementado no código.

## 1. Conceito

**"Terminal Paper"** — estética de terminal/documento técnico sobre papel, aplicada a um produto com cara de **web app** (sidebar, rotas, login). Fundo cream claro (não branco puro, não dark mode), tipografia monoespaçada em todo lugar, bordas finas de 1px, labels em uppercase tracking-widest estilo CLI, cards com borda fina que "acende" no hover. Modo claro fixo — não há dark mode ativado no produto.

Exceção deliberada: painéis de alto contraste (hero da Home, modais) usam preto puro (`#000000`) como respiro cinematográfico dentro do sistema claro — não é um "modo escuro" alternável, é um acento pontual do próprio sistema.

## 2. Paleta de cores

Tokens definidos em `src/app/globals.css` (`:root`, único tema):

| Token CSS var | Hex | Uso |
|---|---|---|
| `--background` | `#F5F5F0` | Fundo base (paper) |
| `--foreground` | `#383838` | Texto principal (ink) |
| `--card` / `--popover` | `#FFFFFF` | Fundo de cards/popovers — branco puro, contrasta com o paper do body |
| `--border` / `--input` | `#C2C0B6` | Bordas, separadores |
| `--muted-foreground` | `#5A5A5A` | Texto secundário (descrições, metadados) |
| `--secondary` / `--muted` / `--accent` | `#ECEBE3` | Fundos sutis (chips, ícones em caixa) |
| `--ring` | `#5A5A5A` | Focus ring |
| `--primary` | `#383838` | Reservado — botões preferem borda fina, não preenchimento (ver §5) |

Preto puro (`#000000`, `bg-black`) é usado à parte dos tokens acima, só nos painéis de alto contraste (hero, modais).

**Cores de status** (semânticas, não decorativas — mapear pelo significado):

| Token | Hex | Uso |
|---|---|---|
| `--st-pending` | `#6b7280` | Em breve / neutro |
| `--st-running` | `#3b82f6` | Ativo |
| `--st-secure` | `#16a34a` | Produção |
| `--st-vulnerable` | `#eab308` | Beta / alerta |
| `--st-exposed` | `#dc2626` | Crítico |

Modo: **claro fixo**. Não há toggle de dark mode no produto.

## 3. Tipografia

- **Fonte única**: Geist Mono, aplicada globalmente (`--font-sans` aponta para `--font-geist-mono` em `@theme inline`) — não há sans-serif em nenhum lugar do produto, headings incluídos (`--font-heading` herda de `--font-sans`).
- **Escala de tamanhos**:
  - `text-[9px]`–`text-[11px]` — metadados, labels, badges de status (uso intensivo, é a assinatura visual)
  - `text-xs` (12px) — corpo secundário, nav, botões
  - `text-sm` (14px) — corpo padrão
  - `text-base`–`text-2xl` — subtítulos
  - `text-3xl`–`text-4xl` — heading da hero (único H1 grande do produto)
- **Tracking**: `tracking-widest` em labels uppercase curtos (ex.: `BEM-VINDO(A)`, `EM BREVE`) é a assinatura tipográfica. `tracking-tight` em headings.
- **Padrão de label CLI**: `text-[10px] font-bold tracking-widest uppercase` — usar para todo texto de status/metadado.

## 4. Espaçamento & bordas

- **Bordas**: sempre 1px, sempre `border-border`. Sem sombra pesada (no máximo `shadow-sm`, raramente usado).
- **Raio de borda**: `--radius: 0.2rem`. `rounded-sm` é o padrão em quase todo elemento (cards, botões, badges, ícones em caixa). Evitar `rounded-lg`/`rounded-xl`/`rounded-2xl` — não é a linguagem do sistema. `rounded-full` só em avatares/dots/pills.
- **Grade de fundo sutil**: dot-grid (`radial-gradient(rgba(56,56,56,0.03) 1px, transparent 1px)`, `background-size: 24px 24px`) aplicada no `body` — textura de papel milimetrado atrás de todo o conteúdo.
- **Seleção de texto**: `::selection` inverte as cores (`bg-foreground text-background`) — reforça o tema em qualquer página.

## 5. Componentes e padrões de interação

- **Sidebar**: navegação principal do web app (`variant="inset" collapsible="icon"`), tokens próprios (`--sidebar*`) espelhando a paleta paper/ink. Itens com feature futura levam badge `Em breve` (estilo `pending`) à direita do label.
- **Header**: sticky, `border-b`, fundo `bg-background/95 backdrop-blur`.
- **Cards**: fundo branco puro (`bg-card`), `border border-border`, hover troca a borda para `border-foreground` (ink) — nunca cor de destaque.
- **Botões**: o padrão neutro (`default`/`outline`/`secondary`/`ghost`/`link`) segue sem preenchimento sólido colorido — borda fina (`border border-border`) com hover trocando a borda para ink (`hover:border-foreground`). Dentro de painéis pretos (hero), o par se inverte: CTA primário vira `bg-white text-black`, secundário fica `border-white/30 text-white`. **Exceção deliberada**: ações semânticas que exigem cor usam preenchimento sólido nos tokens de status — `success` (`bg-secure text-white`), `destructive`/erro (`bg-exposed text-white`), `warning`/alerta (`bg-vulnerable text-black`). `default` (ink sólido) cobre "Ok/Confirmar"; `outline` cobre "Cancelar" — nenhum dos dois precisa de cor, são ações neutras por natureza. Variantes definidas em `src/components/ui/button.tsx` (cva).
- **Badges de status**: `variant="outline"`, cor semântica do token de status (§2), texto `text-[0.6rem]`.
- **Tabelas**: `src/components/ui/table.tsx` (shadcn padrão) — já herda `border-border`/`bg-muted` dos tokens sem alteração. Header em `text-[10px] font-bold tracking-widest uppercase`, mesma assinatura dos labels CLI. Envolver em `rounded-sm border border-border bg-card` para bater com o padrão de card.
- **Gráficos**: `src/components/ui/chart.tsx` (shadcn + Recharts). Cores da série sempre referenciando os tokens de status (`var(--color-running)`, `var(--color-secure)`, etc.) via `ChartConfig`, nunca hex novo. Grid/eixos usam `var(--border)`.
- **Painel de alto contraste** (hero, modais): fundo `#000000`, texto `text-white`/`text-white/70`, usado com moderação — é o único lugar do produto onde a paleta clara é abandonada.
- **Animação**: Framer Motion disponível no projeto para fade/slide de entrada, mas uso pontual — não é uma dependência ativa do sistema hoje.
- **Avatar** (`src/components/ui/avatar.tsx`): `size="sm"|"default"|"lg"`, `rounded-full` (exceção permitida por §4). `AvatarFallback` usa iniciais em mono uppercase. `AvatarBadge` é o indicador de status — sempre com cor semântica (ex.: `bg-secure` para online), nunca decorativa. `AvatarGroup`/`AvatarGroupCount` para empilhar vários membros (comunidade, autoria coletiva).
- **Comunidade**: card de membro = `Card` com avatar + nome + `Badge` de role + bio curta + ação (`Button variant="outline"`). Thread de comentários é recursiva (`comment-thread.tsx`), réplicas indentadas com `border-l border-border pl-4`, sem bolha de chat — segue a lógica de "documento", não de app de mensagens.
- **Blog**: card de artigo = `Card` com `Badge` de categoria, título, resumo, rodapé com avatar+autor+data+tempo de leitura. `Breadcrumb` e `Pagination` (`src/components/ui/breadcrumb.tsx`, `pagination.tsx`) para navegação de listagem — mesma borda fina e `rounded-sm` dos outros controles.
- **Skills de IA**: card de skill = mesmo padrão do card de projeto (ícone em caixa + título + `Badge` de categoria + contador), filtro por categoria via `Tabs`, formulário de criação em `Dialog` (`skill-form-dialog.tsx`) com `Input`/`Select`/`Textarea` — todos com `rounded-sm` explícito (os componentes shadcn vêm com `rounded-xl` na classe, mas resolve para o nosso `--radius` reduzido via `@theme inline`, então já sai correto sem hack).
- **Perfil**: header = faixa `bg-black` (mesma exceção de alto contraste) + avatar `size="lg"` sobreposto (`-mt-8`, `ring-4 ring-card`) + `Tabs` para separar posts/skills/atividade.
- **Componentes base novos** (instalados via CLI shadcn, sem alteração — os tokens já cobrem): `tabs`, `pagination`, `breadcrumb`, `textarea`, `select`, `dialog`, `popover`, `hover-card`, `progress`.
- **Visão em grafo (nós conectados)**: implementada com `@xyflow/react` (React Flow) + `d3-force` em `src/app/design-system/graph/` — não existe no catálogo shadcn nem nos registries comunitários pesquisados via Shoogle, então foi construída direto sobre essas libs (a combinação oficialmente documentada pelo próprio React Flow para force layout). Tema "Obsidian": nós circulares (`rounded-full`, cor por tipo — membro=ink, skill=`--st-running`, artigo=`--st-secure`, tópico=`--st-pending`), **tamanho proporcional ao grau real do nó** (nº de arestas, calculado em `knowledge-graph.tsx`, não hardcoded), label mono abaixo do círculo.
  - **Física** (`use-force-layout.ts`): `forceManyBody` (repulsão), `forceLink` (atração pelas arestas), `forceCollide` com raio = `size/2 + padding` (impede sobreposição mesmo com nós de tamanhos diferentes), `forceX`/`forceY` fracos puxando pro centro. Os nós entram espalhados em círculo e se organizam sozinhos ao montar — isso é o "movimento" pedido, não é decorativo. Arrastar um nó reaquece a simulação (`alphaTarget`) e os vizinhos reagem em tempo real; ao soltar, ele volta a obedecer a física em vez de ficar fixo.
  - **Edges flutuantes** (`floating-edge.tsx` + `geometry.ts`): linha reta calculada pela interseção real com a borda do círculo (não handles fixos de fluxograma), liga em qualquer ângulo e se realinha a cada tick da simulação.
  - **Sem SSR** (`knowledge-graph-loader.tsx`, `next/dynamic` com `ssr: false`): o grafo depende de medição real do DOM (tamanho dos nós, posição), que o servidor não consegue calcular — tentar renderizar no servidor gera erro de hidratação. Esse é o padrão a seguir pra qualquer componente futuro que dependa de `ResizeObserver`/medição de layout.
  - Tema do canvas via variáveis `--xy-*` do React Flow, sobrescritas em `globals.css` sob `.labfy-graph` (mesmo padrão usado para o `.labfy-phone-input`) — fundo transparente, dot-grid no tom do sistema, controles de zoom com borda fina.

Referência viva de todos os componentes acima (com exemplos renderizados): rota `/design-system` (`src/app/design-system/`).

## 6. Como manter a consistência

Ao adicionar uma página ou componente novo:

1. Reaproveite os tokens de `globals.css` — não hardcode hex novo fora dos já documentados aqui.
2. `rounded-sm` por padrão; só suba para `rounded-md` em casos pontuais já existentes (ex.: avatar da sidebar).
3. Todo botão parte de borda fina + hover ink, não de preenchimento sólido — exceto dentro de um painel preto, ou quando a ação é semântica (`success`/`destructive`/`warning`, ver §5).
4. Labels de metadado/status seguem `text-[10px] font-bold tracking-widest uppercase`.
5. Geist Mono é a única fonte — não introduzir uma sans-serif.
