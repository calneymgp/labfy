"use client";

import { OrbitingCircles } from "@/components/ui/orbiting-circles";
import { BentoGrid, BentoCard } from "@/components/ui/bento-grid";
import { BlurFade } from "@/components/ui/blur-fade";
import { Marquee } from "@/components/ui/marquee";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { NeonGradientCard } from "@/components/ui/neon-gradient-card";
import {
  Shield,
  Database,
  Briefcase,
  Calendar,
  Gamepad2,
  Heart,
  Globe,
  Code,
  Terminal,
} from "lucide-react";
import Link from "next/link";

const techIcons = [
  { icon: <Code className="h-8 w-8" />, name: "TypeScript" },
  { icon: <Terminal className="h-8 w-8" />, name: "Python" },
  { icon: <Globe className="h-8 w-8" />, name: "Next.js" },
  { icon: <Database className="h-8 w-8" />, name: "PostgreSQL" },
  { icon: <Shield className="h-8 w-8" />, name: "Docker" },
  { icon: <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>, name: "Git" },
];

const langs = [
  "TypeScript", "Python", "SQL", "Rust",
  "Next.js", "React", "Tailwind", "PostgreSQL",
  "Docker", "Coolify", "vLLM", "LangGraph",
  "Framer Motion", "shadcn/ui", "DaisyUI",
];

const features = [
  {
    Icon: Database,
    name: "TAMZ",
    description: "Plataforma de inteligência de mercado B2B",
    href: "#",
    cta: "Conhecer",
    className: "lg:row-start-1 lg:row-end-2 lg:col-start-1 lg:col-end-3",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10" />
    ),
  },
  {
    Icon: Shield,
    name: "Escudo Code",
    description: "Pentest automatizado sob demanda",
    href: "#",
    cta: "Conhecer",
    className: "lg:col-start-3 lg:col-end-4 lg:row-start-1 lg:row-end-2",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-orange-500/10" />
    ),
  },
  {
    Icon: Briefcase,
    name: "Portfolio",
    description: "Portfolio de projetos e soluções de engenharia",
    href: "#",
    cta: "Explorar",
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-2 lg:row-end-3",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-emerald-500/10" />
    ),
  },
  {
    Icon: Calendar,
    name: "Consultas",
    description: "App de gestão de consultas com agendamento",
    href: "#",
    cta: "Conhecer",
    className: "lg:col-start-2 lg:col-end-4 lg:row-start-2 lg:row-end-3",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-amber-500/10" />
    ),
  },
  {
    Icon: Gamepad2,
    name: "Loot Hunter",
    description: "Jogo de caça ao tesouro com elementos de RPG",
    href: "#",
    cta: "Jogar",
    className: "lg:col-start-1 lg:col-end-3 lg:row-start-3 lg:row-end-4",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-pink-500/10" />
    ),
  },
  {
    Icon: Heart,
    name: "Carol Moura",
    description: "Website pessoal de nutrição",
    href: "#",
    cta: "Visitar",
    className: "lg:col-start-3 lg:col-end-4 lg:row-start-3 lg:row-end-4",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 via-transparent to-pink-500/10" />
    ),
  },
];

export default function V5MagicUI() {
  return (
    <div className="flex flex-col overflow-hidden">
      {/* Hero */}
      <section className="relative flex min-h-[95vh] flex-col items-center justify-center px-4 text-center">
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <OrbitingCircles radius={200} duration={30} speed={0.5} iconSize={40}>
            {techIcons.map((tech, i) => (
              <div
                key={tech.name}
                className="flex items-center justify-center text-muted-foreground/20"
                style={{
                  animationDelay: `${i * 3}s`,
                }}
              >
                {tech.icon}
              </div>
            ))}
          </OrbitingCircles>
        </div>

        <div className="relative z-10 max-w-3xl space-y-8">
          <BlurFade delay={0.1}>
            <p className="font-mono text-xs tracking-[0.25em] text-muted-foreground/50 uppercase">
              Meu Laboratório de Soluções
            </p>
          </BlurFade>

          <BlurFade delay={0.3}>
            <h1 className="font-heading text-7xl font-bold tracking-tight sm:text-8xl">
              Labfy
            </h1>
          </BlurFade>

          <BlurFade delay={0.5}>
            <p className="mx-auto max-w-lg text-lg text-muted-foreground/60 leading-relaxed">
              Portfolio, produtos, comunidade e conteúdo.
              O hub de tecnologia do Calney.
            </p>
          </BlurFade>

          <BlurFade delay={0.7}>
            <ShimmerButton className="mx-auto inline-flex items-center gap-2 rounded-full bg-foreground px-8 py-4 text-sm font-medium text-background">
              <Link href="#projetos" className="flex items-center gap-2">
                Explorar projetos
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7-7-7" />
                </svg>
              </Link>
            </ShimmerButton>
          </BlurFade>
        </div>
      </section>

      {/* Bento Grid de projetos */}
      <section id="projetos" className="px-4 py-24">
        <div className="mx-auto max-w-6xl space-y-16">
          <BlurFade delay={0.2}>
            <div className="space-y-3 text-center">
              <h2 className="font-heading text-4xl font-semibold tracking-tight">Projetos</h2>
              <p className="text-muted-foreground/60">Cada solução construída com propósito</p>
            </div>
          </BlurFade>

          <BentoGrid className="lg:grid-rows-3">
            {features.map((feature) => (
              <BentoCard key={feature.name} {...feature} />
            ))}
          </BentoGrid>
        </div>
      </section>

      {/* Tech Marquee */}
      <section className="py-24">
        <BlurFade delay={0.2}>
          <div className="mb-12 space-y-3 text-center">
            <h2 className="font-heading text-4xl font-semibold tracking-tight">Tecnologias</h2>
            <p className="text-muted-foreground/60">O que uso no dia a dia</p>
          </div>
        </BlurFade>

        <Marquee className="[--duration:30s]">
          {langs.map((lang) => (
            <span
              key={lang}
              className="mx-4 rounded-full border border-white/[0.06] px-4 py-2 text-sm text-muted-foreground"
            >
              {lang}
            </span>
          ))}
        </Marquee>
      </section>

      {/* Roadmap Neon Cards */}
      <section className="px-4 py-24">
        <div className="mx-auto max-w-4xl space-y-16">
          <BlurFade delay={0.2}>
            <div className="space-y-3 text-center">
              <h2 className="font-heading text-4xl font-semibold tracking-tight">O que vem por aí</h2>
              <p className="text-muted-foreground/60">O roadmap do laboratório</p>
            </div>
          </BlurFade>

          <div className="grid gap-6 sm:grid-cols-2">
            {[
              { title: "Mentorias", desc: "Programa de mentoria em tecnologia", colors: { firstColor: "#3b82f6", secondColor: "#8b5cf6" } },
              { title: "Benchmarks", desc: "Benchmarks de performance e stacks", colors: { firstColor: "#f59e0b", secondColor: "#ef4444" } },
              { title: "Blog", desc: "Artigos técnicos e reflexões", colors: { firstColor: "#10b981", secondColor: "#06b6d4" } },
              { title: "Comunidade", desc: "Grupo de discussão e networking", colors: { firstColor: "#ec4899", secondColor: "#f43f5e" } },
            ].map((item) => (
              <BlurFade key={item.title} delay={0.3}>
                <NeonGradientCard neonColors={item.colors} className="max-w-full">
                  <div className="p-6 space-y-2">
                    <h3 className="font-heading text-xl font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </NeonGradientCard>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] px-4 py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-muted-foreground/40">
            Labfy · Meu Laboratório de Soluções
          </p>
          <div className="flex items-center gap-4">
            <Link href="https://github.com/calneymgp" target="_blank" className="text-muted-foreground/40 hover:text-foreground transition-colors">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}