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
- **Botões**: sem preenchimento sólido colorido. Borda fina (`border border-border`) com hover trocando a borda para ink (`hover:border-foreground`). Dentro de painéis pretos (hero), o par se inverte: CTA primário vira `bg-white text-black`, secundário fica `border-white/30 text-white`.
- **Badges de status**: `variant="outline"`, cor semântica do token de status (§2), texto `text-[0.6rem]`.
- **Painel de alto contraste** (hero, modais): fundo `#000000`, texto `text-white`/`text-white/70`, usado com moderação — é o único lugar do produto onde a paleta clara é abandonada.
- **Animação**: Framer Motion disponível no projeto para fade/slide de entrada, mas uso pontual — não é uma dependência ativa do sistema hoje.

## 6. Como manter a consistência

Ao adicionar uma página ou componente novo:

1. Reaproveite os tokens de `globals.css` — não hardcode hex novo fora dos já documentados aqui.
2. `rounded-sm` por padrão; só suba para `rounded-md` em casos pontuais já existentes (ex.: avatar da sidebar).
3. Todo botão parte de borda fina + hover ink, não de preenchimento sólido, exceto dentro de um painel preto.
4. Labels de metadado/status seguem `text-[10px] font-bold tracking-widest uppercase`.
5. Geist Mono é a única fonte — não introduzir uma sans-serif.
