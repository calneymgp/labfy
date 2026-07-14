export type App = {
  id: string;
  owner_id: string;
  name: string;
  description: string;
  category: string;
  url: string;
  created_at: string;
};

// App + autor resolvido via public_profiles (galeria pública).
export type AppWithAuthor = App & {
  author_name: string;
  author_avatar: string | null;
};

export const APP_CATEGORY_OPTIONS = [
  "Produtividade",
  "Dev Tools",
  "IA/Agentes",
  "SaaS B2B",
  "Saúde",
  "Educação",
  "Segurança",
  "Fintech",
  "Marketing",
  "Outro",
] as const;

export const APP_NAME_MAX = 60;
export const APP_DESC_MAX = 200;
export const APP_URL_MAX = 300;
