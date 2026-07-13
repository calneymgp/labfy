export type Profile = {
  id: string;
  full_name: string;
  headline: string;
  avatar_url: string | null;
  preferred_models: string[];
  preferred_harnesses: string[];
};

export const MODEL_OPTIONS = [
  "Claude",
  "GPT (OpenAI)",
  "Gemini",
  "Grok",
  "DeepSeek",
  "Qwen",
  "Llama",
  "Kimi",
] as const;

export const HARNESS_OPTIONS = [
  "Claude Code",
  "Codex",
  "Hermes",
  "OpenCode",
  "Grok CLI",
] as const;

export const FULL_NAME_MAX = 80;
export const HEADLINE_MAX = 120;

export function initialsOf(name: string, fallback: string): string {
  const source = name.trim() || fallback;
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
