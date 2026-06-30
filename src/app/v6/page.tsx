import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, FlaskConical, Database, Shield, Calendar, Gamepad2, Heart, Briefcase } from "lucide-react";
import Link from "next/link";

const projects = [
  { name: "TAMZ", description: "Plataforma de inteligência de mercado B2B", icon: Database, status: "secure" as const, href: "#" },
  { name: "Escudo Code", description: "Pentest automatizado sob demanda", icon: Shield, status: "running" as const, href: "#" },
  { name: "Portfolio", description: "Portfolio de projetos e soluções", icon: Briefcase, status: "running" as const, href: "#" },
  { name: "Consultas", description: "App de gestão de consultas", icon: Calendar, status: "pending" as const, href: "#" },
  { name: "Loot Hunter", description: "Jogo de caça ao tesouro", icon: Gamepad2, status: "pending" as const, href: "#" },
  { name: "Carol Moura", description: "Website pessoal de nutrição", icon: Heart, status: "secure" as const, href: "#" },
];

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

const variations = [
  { label: "V1 Minimalista", href: "/", desc: "Shadcn only" },
  { label: "V2 Aceternity", href: "/v2-aceternity", desc: "Spotlight, beams, 3D" },
  { label: "V3 DaisyUI", href: "/v3-daisyui", desc: "Semântico, Bootstrap-like" },
  { label: "V4 React Bits", href: "/v4-reactbits", desc: "Magnetic, split text" },
  { label: "V5 MagicUI", href: "/v5-magicui", desc: "Bento, orbiting, neon" },
];

export default function V6Page() {
  return (
    <div className="mx-auto max-w-4xl space-y-24 py-8">
      {/* Hero */}
      <section className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <FlaskConical className="h-4 w-4 text-running" />
            <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
              Meu Laboratório de Soluções
            </span>
          </div>
          <h1 className="font-heading text-5xl font-bold tracking-tight sm:text-6xl">
            Labfy
          </h1>
          <p className="max-w-lg text-lg text-muted-foreground leading-relaxed">
            Portfolio, produtos, comunidade e conteúdo.
            O hub de tecnologia do Calney.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="#projetos"
            className="group/button inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/80"
          >
            Explorar projetos
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
          <Link
            href="https://github.com/calneymgp"
            target="_blank"
            className="group/button inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-full border border-border bg-background px-4 text-sm font-medium transition-all hover:bg-muted hover:text-foreground"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            GitHub
          </Link>
        </div>
      </section>

      {/* Projetos */}
      <section id="projetos" className="space-y-8">
        <div className="space-y-2">
          <h2 className="font-heading text-2xl font-semibold tracking-tight">Projetos</h2>
          <p className="text-sm text-muted-foreground">Soluções que construí e mantenho</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <Card key={p.name} className="group hover:border-border/40 transition-colors">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/50">
                    <p.icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="font-heading text-base">{p.name}</CardTitle>
                      <Badge variant="outline" className={statusMap[p.status].className + " text-[0.65rem] px-1.5 py-0"}>
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
      </section>

      <Separator />

      {/* Roadmap */}
      <section id="roadmap" className="space-y-8">
        <div className="space-y-2">
          <h2 className="font-heading text-2xl font-semibold tracking-tight">O que vem por aí</h2>
          <p className="text-sm text-muted-foreground">O roadmap do laboratório</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {roadmaps.map((r) => (
            <Card key={r.name} className="hover:border-border/40 transition-colors">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="font-heading text-base">{r.name}</CardTitle>
                  <Badge variant="outline" className={statusMap[r.status].className + " text-[0.65rem] px-1.5 py-0"}>
                    {statusMap[r.status].label}
                  </Badge>
                </div>
                <CardDescription className="text-xs">{r.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      {/* Variações */}
      <section id="blog" className="space-y-8">
        <div className="space-y-2">
          <h2 className="font-heading text-2xl font-semibold tracking-tight">Variações de LP</h2>
          <p className="text-sm text-muted-foreground">5 experimentos de landing page com libs diferentes</p>
        </div>

        <div className="grid gap-2">
          {variations.map((v) => (
            <Link
              key={v.href}
              href={v.href}
              className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-muted-foreground">{v.label}</span>
                <span className="text-sm">{v.desc}</span>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
