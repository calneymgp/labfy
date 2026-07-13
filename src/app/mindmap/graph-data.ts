export type Subtag = { id: string; label: string };

export type MacroTag = {
  id: string;
  label: string;
  /** Cor do assunto — os dots do grafo herdam essa cor. */
  color: string;
  subtags: Subtag[];
};

export const MACRO_TAGS: MacroTag[] = [
  {
    id: "ia",
    label: "IA",
    color: "var(--st-running)",
    subtags: [
      { id: "agentes", label: "Agentes" },
      { id: "llms", label: "LLMs" },
    ],
  },
  {
    id: "dev",
    label: "Dev",
    color: "var(--st-secure)",
    subtags: [
      { id: "frontend", label: "Frontend" },
      { id: "infra", label: "Infra" },
    ],
  },
  {
    id: "design",
    label: "Design",
    color: "var(--st-vulnerable)",
    subtags: [
      { id: "design-system", label: "Design System" },
      { id: "tipografia", label: "Tipografia" },
    ],
  },
  {
    id: "comunidade",
    label: "Comunidade",
    color: "var(--st-exposed)",
    subtags: [
      { id: "membros", label: "Membros" },
      { id: "conteudo", label: "Conteúdo" },
    ],
  },
];

export type RawNode = { id: string; label: string; macro: string; subtag: string };

export const RAW_NODES: RawNode[] = [
  // IA / Agentes
  { id: "revisor-pr", label: "Revisor de PR", macro: "ia", subtag: "agentes" },
  { id: "zordon", label: "Zordon", macro: "ia", subtag: "agentes" },
  { id: "agente-scraping", label: "Agente de scraping", macro: "ia", subtag: "agentes" },
  { id: "tool-calling", label: "Tool calling", macro: "ia", subtag: "agentes" },
  { id: "subagents", label: "Subagents", macro: "ia", subtag: "agentes" },
  // IA / LLMs
  { id: "vllm", label: "vLLM", macro: "ia", subtag: "llms" },
  { id: "prompt-caching", label: "Prompt caching", macro: "ia", subtag: "llms" },
  { id: "awq", label: "Quantização AWQ", macro: "ia", subtag: "llms" },
  { id: "fine-tuning", label: "Fine-tuning", macro: "ia", subtag: "llms" },
  { id: "rag", label: "RAG", macro: "ia", subtag: "llms" },
  { id: "embeddings", label: "Embeddings", macro: "ia", subtag: "llms" },
  // Dev / Frontend
  { id: "next16", label: "Next.js 16", macro: "dev", subtag: "frontend" },
  { id: "react-flow", label: "React Flow", macro: "dev", subtag: "frontend" },
  { id: "tailwind", label: "Tailwind", macro: "dev", subtag: "frontend" },
  { id: "shadcn", label: "shadcn/ui", macro: "dev", subtag: "frontend" },
  { id: "rsc", label: "Server Components", macro: "dev", subtag: "frontend" },
  // Dev / Infra
  { id: "coolify", label: "Coolify", macro: "dev", subtag: "infra" },
  { id: "supabase", label: "Supabase", macro: "dev", subtag: "infra" },
  { id: "docker", label: "Docker", macro: "dev", subtag: "infra" },
  { id: "cloudflare", label: "Cloudflare Tunnel", macro: "dev", subtag: "infra" },
  { id: "postgres", label: "Postgres", macro: "dev", subtag: "infra" },
  // Design / Design System
  { id: "terminal-paper", label: "Terminal Paper", macro: "design", subtag: "design-system" },
  { id: "tokens", label: "Tokens", macro: "design", subtag: "design-system" },
  { id: "dark-mode", label: "Dark mode", macro: "design", subtag: "design-system" },
  { id: "componentes", label: "Componentes", macro: "design", subtag: "design-system" },
  // Design / Tipografia
  { id: "geist-mono", label: "Geist Mono", macro: "design", subtag: "tipografia" },
  { id: "escala-tipo", label: "Escala tipográfica", macro: "design", subtag: "tipografia" },
  { id: "hierarquia", label: "Hierarquia", macro: "design", subtag: "tipografia" },
  // Comunidade / Membros
  { id: "calney", label: "calney", macro: "comunidade", subtag: "membros" },
  { id: "beta", label: "beta.tester", macro: "comunidade", subtag: "membros" },
  { id: "dev-ana", label: "dev.ana", macro: "comunidade", subtag: "membros" },
  { id: "joao-ml", label: "joao.ml", macro: "comunidade", subtag: "membros" },
  { id: "mari-ux", label: "mari.ux", macro: "comunidade", subtag: "membros" },
  // Comunidade / Conteúdo
  { id: "art-otp", label: "Por que OTP", macro: "comunidade", subtag: "conteudo" },
  { id: "guia-skills", label: "Guia de skills", macro: "comunidade", subtag: "conteudo" },
  { id: "newsletter-12", label: "Newsletter #12", macro: "comunidade", subtag: "conteudo" },
  { id: "live-ia", label: "Live de IA", macro: "comunidade", subtag: "conteudo" },
  { id: "template-saas", label: "Template SaaS", macro: "comunidade", subtag: "conteudo" },
];

export const RAW_EDGES: [string, string][] = [
  // Membros → assuntos
  ["calney", "revisor-pr"],
  ["calney", "zordon"],
  ["calney", "terminal-paper"],
  ["calney", "next16"],
  ["calney", "art-otp"],
  ["calney", "vllm"],
  ["calney", "coolify"],
  ["beta", "guia-skills"],
  ["beta", "prompt-caching"],
  ["beta", "tailwind"],
  ["dev-ana", "shadcn"],
  ["dev-ana", "componentes"],
  ["dev-ana", "template-saas"],
  ["joao-ml", "fine-tuning"],
  ["joao-ml", "rag"],
  ["joao-ml", "live-ia"],
  ["mari-ux", "hierarquia"],
  ["mari-ux", "dark-mode"],
  ["mari-ux", "escala-tipo"],
  // Cluster IA
  ["zordon", "vllm"],
  ["zordon", "subagents"],
  ["revisor-pr", "prompt-caching"],
  ["revisor-pr", "tool-calling"],
  ["tool-calling", "subagents"],
  ["agente-scraping", "tool-calling"],
  ["agente-scraping", "rag"],
  ["vllm", "awq"],
  ["vllm", "prompt-caching"],
  ["rag", "embeddings"],
  ["embeddings", "postgres"],
  ["fine-tuning", "awq"],
  // Cluster Dev
  ["next16", "react-flow"],
  ["next16", "rsc"],
  ["next16", "tailwind"],
  ["next16", "supabase"],
  ["tailwind", "shadcn"],
  ["shadcn", "componentes"],
  ["react-flow", "terminal-paper"],
  ["rsc", "supabase"],
  ["supabase", "postgres"],
  ["coolify", "docker"],
  ["coolify", "supabase"],
  ["docker", "cloudflare"],
  ["cloudflare", "coolify"],
  // Cluster Design
  ["terminal-paper", "tokens"],
  ["terminal-paper", "geist-mono"],
  ["tokens", "dark-mode"],
  ["tokens", "geist-mono"],
  ["tokens", "componentes"],
  ["geist-mono", "escala-tipo"],
  ["escala-tipo", "hierarquia"],
  ["dark-mode", "componentes"],
  // Conteúdo → assuntos
  ["art-otp", "supabase"],
  ["guia-skills", "revisor-pr"],
  ["guia-skills", "subagents"],
  ["newsletter-12", "calney"],
  ["newsletter-12", "live-ia"],
  ["live-ia", "vllm"],
  ["template-saas", "next16"],
  ["template-saas", "coolify"],
];
