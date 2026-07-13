@AGENTS.md

# Git autônomo — o agente se auto-gerencia (NÃO peça OK)

Dev solo com vários agentes em paralelo. A complexidade de git é SUA, não do usuário.
O usuário nunca gerencia branch, worktree, rebase ou merge — e você **não pede OK** para
integrar no `main`, desde que o gate esteja verde. Autorização durável: aja, não pergunte.

## Gate de integração — obrigatório antes de qualquer merge no `main`

```
pnpm typecheck && pnpm lint      # ambos verdes = green light
```

`pnpm typecheck` (tsc --noEmit) e `pnpm lint` (eslint). Rápido de propósito — roda a cada
integração. Não precisa de `pnpm build` no gate (o typecheck já cobre os erros de tipo).
Quando existir suíte de testes, ela entra aqui automaticamente.
**Gate vermelho = não integra.** Conserte na sua branch primeiro.

## Fluxo autônomo

1. **Isolamento.** Trabalho em paralelo → cada agente no seu próprio worktree + branch
   (`git worktree add`). Nunca dois agentes no mesmo working dir. Particione por área
   (ex.: frontend / backend / infra) pra minimizar sobreposição de arquivos.
2. **Commits atômicos** na sua branch conforme avança (co-author + session link do CLAUDE global).
3. **Integra você mesmo, sem pedir OK**, quando a fatia estiver pronta:
   - `git fetch` + rebase na `main` atual
   - roda o gate → verde
   - merge na `main` (nunca `--force`, nunca force-push)
   - `git push` imediato
4. **Fatias pequenas, integra cedo.** Branch não vive dias; trunk-based de verdade.
5. **Um merge por vez** na `main` (fila) — não fundir duas branches simultâneas sem re-rodar o gate.

## Únicas exceções em que você PARA e avisa o usuário

- Conflito de merge que exige julgamento de produto (não meramente mecânico).
- Gate vermelho que você não consegue deixar verde.
- Migration de banco / mudança destrutiva de schema (`supabase/migrations/`).
