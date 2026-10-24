#!/usr/bin/env bash
# Gates do labfy para o comando `ship` (~/.local/bin/ship). Contrato: exit 0 verde · outro = falhou.
# Env: SHIP_CHANGED (lista de alterados), SHIP_LOG (dir de logs). Docs sem código: nenhum gate.
set -euo pipefail

changed="$(cat "${SHIP_CHANGED:?SHIP_CHANGED aponta para a lista de alterados}")"
LOG="${SHIP_LOG:-$(mktemp -d)}"
die(){ printf '\033[31m✗ %s\033[0m\n' "$*" >&2; exit 1; }
ok(){ printf '\033[32m  ✓ %s\033[0m\n' "$*"; }

if ! grep -qE '\.(ts|tsx|js|mjs|cjs|json|css|yaml|toml)$' <<<"$changed"; then
  echo "  diff sem código — gates dispensados"
  exit 0
fi

pnpm install --frozen-lockfile >"$LOG/install.log" 2>&1 || { tail -20 "$LOG/install.log"; die "pnpm install --frozen-lockfile falhou"; }
ok "install (lockfile)"
pnpm typecheck >"$LOG/tsc.log" 2>&1 || { tail -30 "$LOG/tsc.log"; die "typecheck falhou"; }
ok "typecheck"
pnpm lint >"$LOG/lint.log" 2>&1 || { tail -30 "$LOG/lint.log"; die "eslint falhou"; }
ok "eslint"
pnpm build >"$LOG/build.log" 2>&1 || { tail -40 "$LOG/build.log"; die "build falhou"; }
ok "build"
