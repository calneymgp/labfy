"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

const chartData = [
  { month: "Jan", ativos: 12, novos: 4 },
  { month: "Fev", ativos: 18, novos: 6 },
  { month: "Mar", ativos: 24, novos: 5 },
  { month: "Abr", ativos: 31, novos: 9 },
  { month: "Mai", ativos: 40, novos: 8 },
  { month: "Jun", ativos: 52, novos: 11 },
];

const chartConfig = {
  ativos: { label: "Membros ativos", color: "var(--color-running)" },
  novos: { label: "Novos cadastros", color: "var(--color-secure)" },
} satisfies ChartConfig;

export function ChartDemo() {
  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-[220px] w-full">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} stroke="var(--border)" />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          className="font-mono text-[10px] uppercase"
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="ativos" fill="var(--color-ativos)" radius={2} />
        <Bar dataKey="novos" fill="var(--color-novos)" radius={2} />
      </BarChart>
    </ChartContainer>
  );
}
