# Design System — Calney / Labfy

> Extraído do portfolio (`portfolio_calney`, calney.com) em 2026-07-03, para servir de base visual ao `labfydev` (novo projeto de comunidade). Documenta o que está **realmente em produção** no site público — não o boilerplate shadcn que sobrou em `globals.css` e não é usado nas páginas visíveis.

## 1. Conceito

**"Terminal Paper"** — estética de terminal/documento técnico sobre papel. Fundo cream (não branco puro, não dark mode), tipografia monoespaçada em todo lugar, bordas finas de 1px, labels em uppercase tracking-widest estilo CLI (`/root`, `system/profile_details.sh`, `syncing_projects...`), cards tipo kanban/ficha técnica. Referência de tom: um terminal Unix desenhado por um estúdio editorial — não um dashboard SaaS escuro genérico.

## 2. Paleta de cores

Extraída por frequência real de uso no código (`grep -c` em `src/`):

| Token | Hex | Uso | Ocorrências |
|---|---|---|---|
| `paper` | `#F5F5F0` | Fundo base (body, header, cards vazios) | 58 |
| `border` | `#C2C0B6` | Bordas, separadores, texto terciário/placeholder | 223 |
| `ink` | `#383838` | Texto principal, seleção (`selection:bg`), ícones | 158 |
| `ink-muted` | `#5A5A5A` | Texto secundário (descrições, labels de metadado) | 75 |
| `ink-strong` | `#2D2D2D` | Títulos, headings de maior peso | 37 |

Sem paleta de "brand color" saturada — é deliberadamente quase monocromático. As únicas cores fora dessa escala são acentos pontuais (badges de status, gráfico de contribuições GitHub) e nunca substituem a base.

**Cores de status** (usadas em badges/kanban — mapear semanticamente, não fixar hex):
- Sucesso/produção → verde (ex.: `#22c55e` / `#216e39`)
- Alerta/beta → amarelo/laranja
- Neutro/ideia → cinza (`border`/`ink-muted`)

Modo: **claro fixo**, sem dark mode no site público (o `.dark` class do Tailwind existe no CSS mas não é ativado nas páginas reais).

## 3. Tipografia

- **Fonte única**: Geist Mono (`--font-geist-mono`) aplicada globalmente via `font-mono` na raiz — não há uso de sans-serif nas páginas públicas, mesmo em headings.
- **Escala real de tamanhos** (por frequência de uso, do menor ao maior):
  - `text-[8px]` / `text-[9px]` / `text-[10px]` / `text-[11px]` — metadados, labels, timestamps, contadores (uso intensivo — é a assinatura visual do site)
  - `text-xs` (12px) — corpo secundário, nav, botões
  - `text-sm` (14px) — corpo padrão
  - `text-base` a `text-2xl` — subtítulos
  - `text-3xl` a `text-6xl` — headings de hero (usados com moderação, só H1)
- **Tracking**: `tracking-widest` é o mais usado (65x) em labels uppercase curtos (ex.: `IDEIAS`, `SYSTEM_READY`) — assinatura tipográfica do sistema. `tracking-tight`/`tracking-tighter` em headings grandes.
- **Padrão de label CLI**: `text-[10px] font-bold tracking-widest uppercase` — usar para todo texto de status/metadado.

## 4. Espaçamento & bordas

- **Bordas**: sempre 1px, sempre `border-[#C2C0B6]` (ou `border-b`/`border-r` para separar seções/colunas). Nunca sombra pesada — no máximo `shadow-sm`.
- **Raio de borda**: quase reto. `rounded-sm` domina (20 ocorrências) sobre `rounded-md`/`rounded-xl`. `rounded-full` só em avatares/dots/pills de status. Evitar `rounded-xl`/`rounded-2xl` — não é a linguagem do sistema.
- **Grade de fundo sutil**: dot-grid `radial-gradient(#383838 1px, transparent 1px)` em `opacity-[0.03]`, `background-size: 24px 24px` — textura de papel milimetrado, presente atrás do conteúdo.
- **Cursor customizado**: ícone de cursor pixelado (`/icons8-cursor-24.png`) via CSS `cursor: url(...)` em todos os elementos interativos — detalhe de marca, opcional para reaproveitar.

## 5. Componentes e padrões de interação

- **Header sticky**: `border-b`, fundo `bg-paper/80 backdrop-blur-sm`, logo + nav central + ações à direita (idioma, login).
- **Cards**: fundo branco puro (`bg-white`, contraste com o `paper` cream do body), `border border-[#C2C0B6]`, hover troca a borda para `#383838` (nunca cor de destaque, é o próprio ink que "acende" a borda no hover).
- **Kanban/board**: colunas separadas por `border-r`, header de coluna com contador em badge `bg-[#C2C0B6]/20`.
- **Botões**: sem preenchimento sólido colorido — texto sublinhado (`underline decoration-1 underline-offset-4`) ou borda fina com hover de fundo `bg-[#C2C0B6]/20`.
- **Modais**: overlay `bg-ink/40 backdrop-blur-sm`, painel com header em `bg-white border-b border-ink` imitando barra de título de app desktop (bolinha quadrada + nome de "arquivo": `system/profile_details.sh`).
- **Seleção de texto**: `selection:bg-[#383838] selection:text-[#F5F5F0]` — inverte as cores base, reforça o tema.
- **Animação**: Framer Motion para fade/slide de entrada (`opacity: 0, y: 10` → `1, 0`), sem exageros — nada de partículas ou glow no fluxo atual (esses componentes existem em `components/ui/` mas não estão em uso nas páginas reais; considerar dívida/legado, não parte do sistema ativo).

## 6. Aviso de inconsistência no código-fonte

O `portfolio_calney` tem **dois sistemas coexistindo**:
1. **Terminal Paper** (documentado acima) — home, blog, header, language-switcher. É o sistema atual e deliberado.
2. **Dark/neutral legado** (`bg-black text-white`, `text-neutral-300`, paleta shadcn oklch em `globals.css`) — usado em `/about` e no scaffold shadcn não removido. Não migrado para o novo visual.

Para o `labfydev`, use a **Terminal Paper** como referência — é o sistema validado e mais recente do Calney.

## 7. Como aplicar no `labfydev`

O `labfydev` já está scaffoldado com Tailwind 4 + shadcn (tema dark oklch em `src/app/globals.css`, ver variação `v6` como direção mais madura hoje). Para alinhar com o Terminal Paper:

1. Substituir os tokens de cor em `:root` (não em `.dark`) por:
   ```css
   --background: #F5F5F0; /* paper */
   --foreground: #383838; /* ink */
   --border: #C2C0B6;
   --muted-foreground: #5A5A5A;
   ```
2. Trocar `--font-sans` para apontar para `--font-geist-mono` como fonte primária (ou usar `font-mono` explicitamente nos containers raiz, como faz o portfolio).
3. Reduzir `--radius` para algo entre `0.125rem`–`0.25rem` (hoje é `0.5rem` em `labfydev`) para bater com o `rounded-sm` dominante.
4. Reaproveitar os padrões de label (`text-[10px] font-bold tracking-widest uppercase`) para status/metadados — já existe uma paleta de status (`--st-pending`, `--st-running`, `--st-secure`, `--st-vulnerable`, `--st-exposed`) em `labfydev/src/app/globals.css` que é compatível com esse padrão, só precisa de badges no estilo "borda fina + hover ink" em vez de preenchido.
5. Manter dark mode **desligado por padrão** se a comunidade for pública/institucional (`labfydev` hoje força `.dark` — decidir explicitamente se quer manter o tema escuro do zero ou herdar o claro do portfolio; são identidades visuais diferentes e a escolha afeta o restante do sistema).
