---
name: shadcn
description: Adiciona, busca e customiza componentes shadcn/ui no labfydev usando os MCPs shadcn e Shoogle, sempre adaptando o resultado ao Design System "Terminal Paper" do projeto (DESIGN_SYSTEM.md). Use quando o usuário disser "/shadcn", "adiciona um componente shadcn", "busca um bloco/registry", "cria uma tela com shadcn", ou pedir qualquer UI nova/alterada.
---

# /shadcn — componentes shadcn/ui casados com o Design System do labfydev

Este projeto usa shadcn/ui (`components.json`: style `base-nova`, baseColor `neutral`, ícones `lucide`, aliases `@/components`, `@/lib`, `@/hooks`). Qualquer componente adicionado ou gerado **precisa ser adaptado** ao Design System Terminal Paper antes de ser considerado pronto — ver seção final, é a parte que mais importa.

## MCPs disponíveis (`.mcp.json`, escopo de projeto)

### `shadcn` (stdio — `npx shadcn@latest mcp`)
Fala com os registries **configurados no `components.json`** deste projeto (hoje só `@shadcn`). Ferramentas: `get_project_registries`, `list_items_in_registries`, `search_items_in_registries`, `view_items_in_registries`, `get_item_examples_from_registries`, `get_add_command_for_items`, `get_audit_checklist`. Use para instalar/inspecionar componentes oficiais do shadcn.

### `shoogle` (http — `https://mcp.shoogle.dev/mcp`)
Motor de busca sobre **10.400+ itens de 135+ registries comunitários** (`@shadcnblocks`, `@cult-ui`, `@magicui`, etc). Ferramentas: `search_registry_items` (busca ampla) e `search_registry_items_scoped` (limita a namespaces conhecidos). Devolve comandos `npx shadcn@latest add ...` prontos. Use quando o pedido for por um bloco/padrão que não existe no `@shadcn` puro (ex.: "pricing table com toggle mensal/anual", "hero com vídeo").

**Fluxo recomendado:** Shoogle para descobrir → `shadcn` MCP (ou CLI) para ver detalhes/instalar → adaptar ao Design System → revisar.

## Config do projeto

```json
// components.json
{ "style": "base-nova", "baseColor": "neutral", "iconLibrary": "lucide",
  "aliases": { "components": "@/components", "ui": "@/components/ui", "lib": "@/lib", "hooks": "@/hooks" } }
```

CSS global: `src/app/globals.css`. Sempre rodar `npx shadcn@latest add <componente>` (ou `pnpm dlx`, conforme `packageManager` do projeto) — nunca copiar código manualmente.

## Referência detalhada (skill oficial instalada em `.agents/skills/shadcn/`)

Regras completas de composição, forms, ícones, estilo e chat (com exemplos incorreto/correto) já estão instaladas neste repo — consulte antes de escrever UI nova:

- `.agents/skills/shadcn/rules/styling.md` — cores semânticas, `cn()`, `gap-*` vs `space-*`, `size-*`
- `.agents/skills/shadcn/rules/composition.md` — Groups, overlays, Card, Tabs, Empty, Toast
- `.agents/skills/shadcn/rules/forms.md` — `FieldGroup`/`Field`, `InputGroup`, validação
- `.agents/skills/shadcn/rules/icons.md` — `data-icon`, sem classes de tamanho manuais
- `.agents/skills/shadcn/cli.md` — todos os comandos e flags do CLI
- `.agents/skills/shadcn/registry.md` — como configurar/autorar registries

## Casar com o Design System — OBRIGATÓRIO

Todo componente shadcn adicionado chega com o tema "Nova" padrão. **Isso não bate com o Terminal Paper do labfydev** — sempre revisar contra `DESIGN_SYSTEM.md` (raiz do projeto) antes de dar por pronto:

1. **Fonte**: Geist Mono em tudo, sem sans-serif — nunca deixar um componente puxar fonte própria.
2. **Bordas**: sempre 1px `border-border`. Raio padrão `rounded-sm` (`--radius: 0.2rem`) — se o componente vier com `rounded-lg`/`rounded-xl`, ajustar para `rounded-sm`.
3. **Botões**: sem preenchimento sólido colorido — borda fina + `hover:border-foreground`. Exceção só dentro de painel preto (hero/modais de alto contraste), onde o par inverte (`bg-white text-black` / `border-white/30 text-white`).
4. **Cards**: fundo `bg-card` (branco puro), hover troca borda para `border-foreground`, nunca cor de destaque.
5. **Cores de status** são semânticas (`--st-pending/running/secure/vulnerable/exposed`) — mapear pelo significado, nunca cor decorativa aleatória.
6. **Labels/metadados**: `text-[10px] font-bold tracking-widest uppercase` é a assinatura do produto.
7. **Sem dark mode** — não introduzir `dark:` overrides; o produto é claro fixo (preto puro só nos painéis de alto contraste).
8. Não hardcodar hex novo — reaproveitar os tokens já definidos em `src/app/globals.css`.

Se um componente/bloco vindo de um registry comunitário (via Shoogle) trouxer estilo muito distante disso (sombras pesadas, cores vivas, `rounded-2xl`), ajustar o className na composição — nunca no arquivo gerado do componente base.
