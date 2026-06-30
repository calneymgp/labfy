import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const projects = [
  { name: "TAMZ", description: "Plataforma de inteligência de mercado B2B", href: "#", status: "secure" as const },
  { name: "Escudo Code", description: "Pentest automatizado sob demanda", href: "#", status: "running" as const },
  { name: "Portfolio", description: "Portfolio de projetos e soluções", href: "#", status: "running" as const },
  { name: "Consultas", description: "App de gestão de consultas", href: "#", status: "pending" as const },
  { name: "Loot Hunter", description: "Jogo de caça ao tesouro", href: "#", status: "pending" as const },
  { name: "Carol Moura", description: "Website pessoal de nutrição", href: "#", status: "secure" as const },
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
  vulnerable: { label: "Beta", className: "bg-vulnerable/10 text-vulnerable border-vulnerable/20" },
  exposed: { label: "Crítico", className: "bg-exposed/10 text-exposed border-exposed/20" },
};

export default function V1Minimalist() {
  return (
    <div className="flex flex-col">
      <section className="flex min-h-[90vh] flex-col items-center justify-center px-4 text-center">
        <div className="max-w-3xl space-y-8">
          <div className="space-y-4">
            <p className="font-mono text-sm tracking-widest text-muted-foreground uppercase">
              Meu Laboratório de Soluções
            </p>
            <h1 className="font-heading text-5xl leading-tight font-semibold tracking-tight sm:text-7xl">
              Labfy
            </h1>
            <p className="mx-auto max-w-xl text-lg text-muted-foreground leading-relaxed">
              Portfolio, produtos, comunidade e conteúdo.
              O hub de tecnologia do Calney.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3">
            <Link
              href="#projetos"
              className="group/button inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-full bg-primary px-2.5 text-sm font-medium text-primary-foreground whitespace-nowrap transition-all hover:bg-primary/80"
            >
              Explorar projetos
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
            <Link
              href="https://github.com/calneymgp"
              target="_blank"
              className="group/button inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-full border border-border bg-background px-2.5 text-sm font-medium whitespace-nowrap transition-all hover:bg-muted hover:text-foreground"
            >
              <svg className="mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              GitHub
            </Link>
          </div>
        </div>
      </section>

      <section id="projetos" className="px-4 py-24">
        <div className="mx-auto max-w-5xl space-y-12">
          <div className="space-y-2 text-center">
            <h2 className="font-heading text-3xl font-semibold tracking-tight">Projetos</h2>
            <p className="text-muted-foreground">Soluções que construí e mantenho</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <Card key={p.name} className="group hover:border-border transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-heading text-lg">{p.name}</CardTitle>
                    <Badge
                      variant="outline"
                      className={statusMap[p.status].className}
                    >
                      {statusMap[p.status].label}
                    </Badge>
                  </div>
                  <CardDescription>{p.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Separator className="mx-auto max-w-5xl" />

      <section className="px-4 py-24">
        <div className="mx-auto max-w-5xl space-y-12">
          <div className="space-y-2 text-center">
            <h2 className="font-heading text-3xl font-semibold tracking-tight">O que vem por aí</h2>
            <p className="text-muted-foreground">Expansão do hub para comunidade e conteúdo</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {roadmaps.map((r) => (
              <Card key={r.name} className="hover:border-border transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-heading text-lg">{r.name}</CardTitle>
                    <Badge
                      variant="outline"
                      className={statusMap[r.status].className}
                    >
                      {statusMap[r.status].label}
                    </Badge>
                  </div>
                  <CardDescription>{r.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border px-4 py-12">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            Labfy · Meu Laboratório de Soluções
          </p>
          <div className="flex items-center gap-4">
            <Link href="https://github.com/calneymgp" target="_blank" className="text-muted-foreground hover:text-foreground transition-colors">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}