import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Prompt } from "@/lib/prompts";
import { initialsOf } from "@/lib/profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Prompt — Labfy",
};

export default async function PromptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("prompts")
    .select("id, owner_id, title, body, topic, subtopic, tags, created_at")
    .eq("id", id)
    .maybeSingle();

  if (!data) notFound();
  const prompt = data as Prompt;

  const { data: author } = await supabase
    .from("public_profiles")
    .select("full_name, avatar_url")
    .eq("id", prompt.owner_id)
    .maybeSingle();

  const authorName = (author?.full_name as string) || "Anônimo";
  const authorAvatar = (author?.avatar_url as string | null) ?? null;

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-6">
      <Link
        href="/prompts"
        className="mb-4 inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3" /> Prompts
      </Link>

      <div className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <h1 className="font-heading text-2xl font-semibold tracking-tight">{prompt.title}</h1>
          {prompt.topic && (
            <Badge variant="outline" className="shrink-0 rounded-sm">
              {prompt.topic}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Avatar size="sm" className="size-5">
            {authorAvatar && <AvatarImage src={authorAvatar} alt={authorName} />}
            <AvatarFallback className="text-[9px]">
              {initialsOf(authorName, "?")}
            </AvatarFallback>
          </Avatar>
          <span className="font-mono text-[10px] text-muted-foreground">{authorName}</span>
        </div>
      </div>

      <div className="markdown-body mt-6 space-y-3 rounded-sm border border-border bg-card p-5 text-sm">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{prompt.body}</ReactMarkdown>
      </div>
    </section>
  );
}
