import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

const roadmaps = [
  { name: "Mentorias", description: "Programa de mentoria em tecnologia", status: "pending" as const },
  { name: "Benchmarks", description: "Benchmarks de performance e stacks", status: "pending" as const },
  { name: "Blog", description: "Artigos técnicos e reflexões", status: "running" as const },
  { name: "Comunidade", description: "Grupo de discussão e networking", status: "pending" as const },
];

const statusMap = {
  pending: { label: "Em breve", className: "bg-pending/10 text-pending border-pending/20" },
  running: { label: "Ativo", className: "bg-running/10 text-running border-running/20" },
  secure: { label: "Produção", className: "bg-secure/10 text-secure border-secure/20" },
};

export default function RoadmapPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-4 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-lg font-semibold tracking-tight">Roadmap</h1>
          <p className="text-xs text-muted-foreground">O que vem por aí no laboratório</p>
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground" />
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {roadmaps.map((r, i) => (
          <Card key={r.name} className="hover:border-foreground transition-colors">
            <CardHeader className="p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-sm bg-muted font-mono text-[0.65rem] text-muted-foreground">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1 space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <CardTitle className="font-heading text-sm">{r.name}</CardTitle>
                    <Badge variant="outline" className={`${statusMap[r.status].className} text-[0.6rem] px-1 py-0 leading-normal`}>
                      {statusMap[r.status].label}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">{r.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
