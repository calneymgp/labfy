// Web search da War Room via OpenRouter ":online" — sem tool/infra própria.
// O sufixo :online liga a busca web nativa da OpenRouter (Exa por baixo) em
// qualquer modelo. Usado na fase de research para cada personagem pesquisar
// contexto diversificado antes do debate.
export function withWebSearch(model: string): string {
  return model.endsWith(":online") ? model : `${model}:online`;
}
