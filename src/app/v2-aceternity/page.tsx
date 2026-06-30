"use client";

import { BackgroundBeams } from "@/components/ui/background-beams";
import { Spotlight } from "@/components/ui/spotlight";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { FloatingDock } from "@/components/ui/floating-dock";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { Button } from "@/components/ui/moving-border";
import { motion } from "motion/react";
import Link from "next/link";
import {
  Shield,
  Database,
  Briefcase,
  Calendar,
  Gamepad2,
  Heart,
} from "lucide-react";

const projectItems = [
  {
    title: "TAMZ",
    description: "Plataforma de inteligência de mercado B2B. Dados, insights e prospecção.",
    link: "#",
  },
  {
    title: "Escudo Code",
    description: "Pentest automatizado sob demanda. Você assiste ao vivo e recebe o relatório.",
    link: "#",
  },
  {
    title: "Portfolio",
    description: "Portfolio de projetos e soluções de engenharia de software.",
    link: "#",
  },
  {
    title: "Consultas",
    description: "App de gestão de consultas com agendamento e histórico.",
    link: "#",
  },
  {
    title: "Loot Hunter",
    description: "Jogo de caça ao tesouro com elementos de RPG e exploração.",
    link: "#",
  },
  {
    title: "Carol Moura",
    description: "Website pessoal de nutrição — conteúdo, serviços e blog.",
    link: "#",
  },
];

const dockItems = [
  { title: "GitHub", icon: (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  ), href: "https://github.com/calneymgp" },
  { title: "Escudo Code", icon: <Shield className="h-5 w-5" />, href: "#" },
  { title: "TAMZ", icon: <Database className="h-5 w-5" />, href: "#" },
  { title: "Portfolio", icon: <Briefcase className="h-5 w-5" />, href: "#" },
  { title: "Consultas", icon: <Calendar className="h-5 w-5" />, href: "#" },
  { title: "Loot Hunter", icon: <Gamepad2 className="h-5 w-5" />, href: "#" },
  { title: "Carol", icon: <Heart className="h-5 w-5" />, href: "#" },
];

export default function V2Aceternity() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background">
      <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" fill="white" />

      <section className="relative flex min-h-[95vh] flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 max-w-4xl space-y-10"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="font-mono text-sm tracking-[0.2em] text-muted-foreground/60 uppercase"
          >
            Meu Laboratório de Soluções
          </motion.p>

          <h1 className="font-heading text-7xl leading-none font-bold tracking-tight sm:text-8xl">
            Labfy
          </h1>

          <p className="mx-auto max-w-lg text-lg text-muted-foreground/80 leading-relaxed">
            Portfolio, produtos, comunidade e conteúdo.
            O hub de tecnologia do Calney.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link href="#projetos">
              <Button
                borderRadius="0.75rem"
                className="bg-background text-foreground border border-border"
              >
                <span className="flex items-center gap-2 px-6 py-3">
                  Explorar projetos
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </Button>
            </Link>
          </div>
        </motion.div>

        <BackgroundBeams className="pointer-events-none" />
      </section>

      <section id="projetos" className="relative z-10 px-4 py-24">
        <div className="mx-auto max-w-6xl space-y-16">
          <div className="space-y-4 text-center">
            <h2 className="font-heading text-4xl font-semibold tracking-tight">Projetos</h2>
            <p className="mx-auto max-w-md text-muted-foreground">
              Cada solução construída com propósito
            </p>
          </div>

          <HoverEffect items={projectItems} />
        </div>
      </section>

      <section className="relative z-10 px-4 py-24">
        <div className="mx-auto max-w-6xl space-y-16">
          <div className="space-y-4 text-center">
            <h2 className="font-heading text-4xl font-semibold tracking-tight">O que vem por aí</h2>
            <p className="mx-auto max-w-md text-muted-foreground">
              O roadmap do laboratório
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Mentorias", desc: "Programa de mentoria em tecnologia", rotate: 2 },
              { title: "Benchmarks", desc: "Benchmarks de performance e stacks", rotate: -1 },
              { title: "Blog", desc: "Artigos técnicos e reflexões", rotate: 3 },
              { title: "Comunidade", desc: "Grupo de discussão e networking", rotate: -2 },
            ].map((item) => (
              <CardContainer key={item.title} className="w-full">
                <CardBody className="relative w-full rounded-xl border border-white/[0.08] bg-card p-6">
                  <CardItem translateZ={50} className="font-heading text-xl font-semibold">
                    {item.title}
                  </CardItem>
                  <CardItem translateZ={30} className="mt-3 text-sm text-muted-foreground">
                    {item.desc}
                  </CardItem>
                </CardBody>
              </CardContainer>
            ))}
          </div>
        </div>
      </section>

      <footer className="relative z-10 pb-24">
        <div className="flex justify-center">
          <FloatingDock
            items={dockItems}
            desktopClassName="hidden md:flex"
            mobileClassName="flex md:hidden"
          />
        </div>
        <p className="mt-8 text-center text-xs text-muted-foreground/50">
          Labfy · Meu Laboratório de Soluções
        </p>
      </footer>
    </div>
  );
}