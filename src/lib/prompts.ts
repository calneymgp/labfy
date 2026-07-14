export type Prompt = {
  id: string;
  owner_id: string;
  title: string;
  body: string;
  topic: string;
  subtopic: string;
  tags: string[];
  created_at: string;
};

// Prompt + autor resolvido via public_profiles (nunca inclui email/phone).
export type PromptWithAuthor = Prompt & {
  author_name: string;
  author_avatar: string | null;
};

export const PROMPT_TITLE_MAX = 120;
export const PROMPT_TOPIC_MAX = 40;
export const PROMPT_BODY_MAX = 20000;
export const PROMPT_TAGS_MAX = 8;
