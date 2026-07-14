"use client";

import * as React from "react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { ExternalLink } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { initialsOf } from "@/lib/profile";
import type { AppWithAuthor } from "@/lib/apps";

type Datum = { name: string; value: number };

const chartConfig = {
  value: { label: "Apps", color: "var(--st-running)" },
} satisfies ChartConfig;

const activeChip =
  "rounded-sm border border-foreground bg-foreground px-2 py-1 font-mono text-[11px] text-background";
const idleChip =
  "rounded-sm border border-border bg-card px-2 py-1 font-mono text-[11px] text-muted-foreground transition-colors hover:border-foreground hover:text-foreground";

export function AppsGallery({
  apps,
  categoryData,
}: {
  apps: AppWithAuthor[];
  categoryData: Datum[];
}) {
  const [category, setCategory] = React.useState("");

  const filtered = category ? apps.filter((a) => a.category === category) : apps;
  const categories = categoryData.map((d) => d.name);

  return (
    <div className="space-y-5">
      {categoryData.length > 0 && (
        <div className="rounded-sm border border-border bg-card p-4">
          <p className="mb-3 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
            Apps por categoria
          </p>
          <ChartContainer config={chartConfig} className="aspect-auto h-[200px] w-full">
            <BarChart accessibilityLayer data={categoryData} layout="vertical" margin={{ left: 8 }}>
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="name"
                width={100}
                tickLine={false}
                axisLine={false}
                className="font-mono text-[10px]"
              />
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Bar dataKey="value" fill="var(--color-value)" radius={2} />
            </BarChart>
          </ChartContainer>
        </div>
      )}

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setCategory("")}
            className={category === "" ? activeChip : idleChip}
          >
            Todas
          </button>
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={category === c ? activeChip : idleChip}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-xs text-muted-foreground">
          Nenhum app por aqui ainda.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((app) => (
            <div key={app.id} className="flex flex-col rounded-sm border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold tracking-tight">{app.name}</p>
                {app.category && (
                  <Badge variant="outline" className="shrink-0 rounded-sm">
                    {app.category}
                  </Badge>
                )}
              </div>
              {app.description && (
                <p className="mt-1 text-xs text-muted-foreground">{app.description}</p>
              )}
              <div className="mt-3 flex items-center justify-between gap-2 pt-2">
                <div className="flex items-center gap-2">
                  <Avatar size="sm" className="size-5">
                    {app.author_avatar && (
                      <AvatarImage src={app.author_avatar} alt={app.author_name} />
                    )}
                    <AvatarFallback className="text-[9px]">
                      {initialsOf(app.author_name, "?")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {app.author_name}
                  </span>
                </div>
                {app.url && (
                  <a
                    href={app.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-[10px] text-muted-foreground hover:text-foreground"
                  >
                    <ExternalLink className="size-3" /> abrir
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
