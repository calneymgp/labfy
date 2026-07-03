import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Box, Database, Shield, Calendar, Gamepad2, Heart, Briefcase } from "lucide-react";

const projects = [
  { name: "TAMZ", description: "Plataforma de inteligência de mercado B2B", icon: Database, status: "secure" as const },
  { name: "Escudo Code", description: "Pentest automatizado sob demanda", icon: Shield, status: "running" as const },
  { name: "Portfolio", description: "Portfolio de projetos e soluções", icon: Briefcase, status: "running" as const },
  { name: "Consultas", description: "App de gestão de consultas", icon: Calendar, status: "pending" as const },
  { name: "Loot Hunter", description: "Jogo de caça ao tesouro", icon: Gamepad2, status: "pending" as const },
  { name: "Carol Moura", description: "Website pessoal de nutrição", icon: Heart, status: "secure" as const },
];

const statusMap = {
  pending: { label: "Em breve", className: "bg-pending/10 text-pending border-pending/20" },
  running: { label: "Ativo", className: "bg-running/10 text-running border-running/20" },
  secure: { label: "Produção", className: "bg-secure/10 text-secure border-secure/20" },
};

export default function ProjetosPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-4 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-lg font-semibold tracking-tight">Projetos</h1>
          <p className="text-xs text-muted-foreground">Soluções que construí e mantenho</p>
        </div>
        <Box className="h-4 w-4 text-muted-foreground" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <Card key={p.name} className="group hover:border-foreground transition-colors">
            <CardHeader className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border border-border bg-muted/50">
                  <p.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <CardTitle className="font-heading text-sm">{p.name}</CardTitle>
                    <Badge variant="outline" className={`${statusMap[p.status].className} text-[0.6rem] px-1 py-0 leading-normal`}>
                      {statusMap[p.status].label}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">{p.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
