"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  PROMPT_TITLE_MAX,
  PROMPT_TOPIC_MAX,
  PROMPT_BODY_MAX,
  PROMPT_TAGS_MAX,
} from "@/lib/prompts";
import { createPrompt } from "./actions";

export function PromptEditor() {
  const router = useRouter();
  const [title, setTitle] = React.useState("");
  const [topic, setTopic] = React.useState("");
  const [subtopic, setSubtopic] = React.useState("");
  const [tagsRaw, setTagsRaw] = React.useState("");
  const [body, setBody] = React.useState("");
  const [tab, setTab] = React.useState<"write" | "preview">("write");
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const tabButton = (active: boolean) =>
    active
      ? "rounded-sm border border-foreground bg-foreground px-2 py-0.5 font-mono text-[10px] text-background"
      : "rounded-sm border border-border px-2 py-0.5 font-mono text-[10px] text-muted-foreground hover:text-foreground";

  async function handleSave() {
    setError(null);
    if (!title.trim()) return setError("Dê um título ao prompt.");
    if (!body.trim()) return setError("O prompt não pode estar vazio.");
    setSaving(true);
    try {
      const tags = tagsRaw
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .slice(0, PROMPT_TAGS_MAX);
      const { error: saveError, id } = await createPrompt({
        title,
        body,
        topic,
        subtopic,
        tags,
      });
      if (saveError) return setError(saveError);
      if (id) router.push(`/prompts/${id}`);
    } catch {
      setError("Algo deu errado. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="title" className="text-xs">
          Título
        </Label>
        <Input
          id="title"
          value={title}
          maxLength={PROMPT_TITLE_MAX}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex.: Revisor de código sênior"
          className="rounded-sm"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="topic" className="text-xs">
            Assunto
          </Label>
          <Input
            id="topic"
            value={topic}
            maxLength={PROMPT_TOPIC_MAX}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Ex.: Código"
            className="rounded-sm"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="subtopic" className="text-xs">
            Subtópico
          </Label>
          <Input
            id="subtopic"
            value={subtopic}
            maxLength={PROMPT_TOPIC_MAX}
            onChange={(e) => setSubtopic(e.target.value)}
            placeholder="Ex.: Code review"
            className="rounded-sm"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="tags" className="text-xs">
            Tags
          </Label>
          <Input
            id="tags"
            value={tagsRaw}
            onChange={(e) => setTagsRaw(e.target.value)}
            placeholder="separadas por vírgula"
            className="rounded-sm"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label className="text-xs">Prompt (Markdown)</Label>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setTab("write")}
              aria-pressed={tab === "write"}
              className={tabButton(tab === "write")}
            >
              Escrever
            </button>
            <button
              type="button"
              onClick={() => setTab("preview")}
              aria-pressed={tab === "preview"}
              className={tabButton(tab === "preview")}
            >
              Preview
            </button>
          </div>
        </div>
        {tab === "write" ? (
          <textarea
            value={body}
            maxLength={PROMPT_BODY_MAX}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Escreva seu prompt em Markdown…"
            className="min-h-[320px] w-full rounded-sm border border-input bg-card p-3 font-mono text-sm outline-none focus-visible:border-ring"
          />
        ) : (
          <div className="markdown-body min-h-[320px] space-y-2 rounded-sm border border-border bg-card p-3 text-sm">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {body || "_Nada para pré-visualizar._"}
            </ReactMarkdown>
          </div>
        )}
      </div>

      {error && <p className="text-xs text-exposed">{error}</p>}

      <div className="flex items-center gap-3">
        <Button type="button" onClick={handleSave} disabled={saving} className="rounded-sm">
          {saving ? <Loader2 className="size-3.5 animate-spin" /> : "Publicar prompt"}
        </Button>
        <span className="font-mono text-[10px] text-muted-foreground">
          Todo prompt é público para a comunidade.
        </span>
      </div>
    </div>
  );
}
