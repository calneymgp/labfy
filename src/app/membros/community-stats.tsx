"use client";

import type { ComponentType, ReactNode } from "react";
import { Bar, BarChart, Cell, Pie, PieChart, XAxis, YAxis } from "recharts";
import { Users, TerminalSquare, Sparkles, Compass } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

type Datum = { name: string; value: number };

const COLORS = [
  "var(--st-running)",
  "var(--st-secure)",
  "var(--st-vulnerable)",
  "var(--st-exposed)",
  "var(--st-pending)",
  "var(--foreground)",
];

const barConfig = {
  value: { label: "Membros", color: "var(--st-running)" },
} satisfies ChartConfig;

function StatCard({
  icon: Icon,
  value,
  label,
}: {
  icon: ComponentType<{ className?: string }>;
  value: number;
  label: string;
}) {
  return (
    <div className="rounded-sm border border-border bg-card p-4">
      <Icon className="size-4 text-muted-foreground" />
      <p className="mt-2 font-mono text-2xl font-semibold tabular-nums">{value}</p>
      <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
        {label}
      </p>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-sm border border-border bg-card p-4">
      <p className="mb-3 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
        {title}
      </p>
      {children}
    </div>
  );
}

function HorizontalBar({ data, fill }: { data: Datum[]; fill: string }) {
  return (
    <ChartContainer config={barConfig} className="aspect-auto h-[200px] w-full">
      <BarChart accessibilityLayer data={data} layout="vertical" margin={{ left: 8 }}>
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="name"
          width={90}
          tickLine={false}
          axisLine={false}
          className="font-mono text-[10px]"
        />
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <Bar dataKey="value" fill={fill} radius={2} />
      </BarChart>
    </ChartContainer>
  );
}

export function CommunityStats({
  total,
  claudeCodeCount,
  gptCount,
  specialtyData,
  harnessData,
  locationData,
}: {
  total: number;
  claudeCodeCount: number;
  gptCount: number;
  specialtyData: Datum[];
  harnessData: Datum[];
  locationData: Datum[];
}) {
  if (total === 0) return null;

  return (
    <div className="mb-6 space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={Users} value={total} label="Membros" />
        <StatCard icon={TerminalSquare} value={claudeCodeCount} label="Usam Claude Code" />
        <StatCard icon={Sparkles} value={gptCount} label="Usam GPT" />
        <StatCard icon={Compass} value={specialtyData.length} label="Especialidades" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {specialtyData.length > 0 && (
          <ChartCard title="Por especialidade">
            <ChartContainer config={{}} className="mx-auto aspect-square h-[200px]">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
                <Pie
                  data={specialtyData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={45}
                  outerRadius={75}
                >
                  {specialtyData.map((d, i) => (
                    <Cell key={d.name} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
              {specialtyData.map((d, i) => (
                <span
                  key={d.name}
                  className="inline-flex items-center gap-1 font-mono text-[10px] text-muted-foreground"
                >
                  <span
                    className="size-2 rounded-full"
                    style={{ background: COLORS[i % COLORS.length] }}
                  />
                  {d.name} · {d.value}
                </span>
              ))}
            </div>
          </ChartCard>
        )}

        {harnessData.length > 0 && (
          <ChartCard title="Por harness">
            <HorizontalBar data={harnessData} fill="var(--color-value)" />
          </ChartCard>
        )}

        {locationData.length > 0 && (
          <ChartCard title="Por localização">
            <HorizontalBar data={locationData} fill="var(--st-secure)" />
          </ChartCard>
        )}
      </div>
    </div>
  );
}
