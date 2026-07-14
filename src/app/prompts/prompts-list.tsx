"use client";

import * as React from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { initialsOf } from "@/lib/profile";
import type { PromptWithAuthor } from "@/lib/prompts";

export function PromptsList({ prompts }: { prompts: PromptWithAuthor[] }) {
  const [q, setQ] = React.useState("");

  const filtered = prompts.filter((p) => {
    if (!q) return true;
    const hay =
      `${p.title} ${p.topic} ${p.subtopic} ${p.tags.join(" ")} ${p.body}`.toLowerCase();
    return hay.includes(q.toLowerCase());
  });

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por título, tópico, tag ou conteúdo"
          className="rounded-sm pl-8"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-xs text-muted-foreground">
          Nenhum prompt encontrado.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {filtered.map((p) => (
            <Link
              key={p.id}
              href={`/prompts/${p.id}`}
              className="group rounded-sm border border-border bg-card p-4 transition-colors hover:border-foreground"
            >
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-sm font-semibold tracking-tight group-hover:underline">
                  {p.title}
                </h2>
                {p.topic && (
                  <Badge variant="outline" className="shrink-0 rounded-sm">
                    {p.topic}
                  </Badge>
                )}
              </div>
              <p className="mt-2 line-clamp-3 font-mono text-[11px] text-muted-foreground">
                {p.body}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <Avatar size="sm" className="size-5">
                  {p.author_avatar && (
                    <AvatarImage src={p.author_avatar} alt={p.author_name} />
                  )}
                  <AvatarFallback className="text-[9px]">
                    {initialsOf(p.author_name, "?")}
                  </AvatarFallback>
                </Avatar>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {p.author_name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
