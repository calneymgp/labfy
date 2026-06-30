"use client";

import { motion, useAnimationFrame, useMotionValue, useSpring, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const projects = [
  { name: "TAMZ", description: "Plataforma de inteligência de mercado B2B", status: "secure" },
  { name: "Escudo Code", description: "Pentest automatizado sob demanda", status: "running" },
  { name: "Portfolio", description: "Portfolio de projetos e soluções", status: "running" },
  { name: "Consultas", description: "App de gestão de consultas", status: "pending" },
  { name: "Loot Hunter", description: "Jogo de caça ao tesouro", status: "pending" },
  { name: "Carol Moura", description: "Website pessoal de nutrição", status: "secure" },
];

const roadmap = [
  "Mentorias em tecnologia",
  "Benchmarks de performance",
  "Blog técnico",
  "Comunidade de devs",
];

const statusColors: Record<string, string> = {
  pending: "bg-pending/10 text-pending border-pending/20",
  running: "bg-running/10 text-running border-running/20",
  secure: "bg-secure/10 text-secure border-secure/20",
};

// React Bits style: SplitText component (CSS animation based, no Framer Motion dependency)
function SplitText({ text, className }: { text: string; className?: string }) {
  return (
    <span className={className}>
      {text.split("").map((char, i) => (
        <span
          key={i}
          className="inline-block"
          style={{
            animation: `split-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.03}s both`,
            whiteSpace: char === " " ? "pre" : undefined,
          }}
        >
          {char}
        </span>
      ))}
    </span>
  );
}

// React Bits style: Aurora background (pure CSS)
function AuroraBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute -left-1/2 -top-1/2 h-[200%] w-[200%]"
        style={{
          background:
            "radial-gradient(circle at 30% 50%, rgba(56, 189, 248, 0.06), transparent 50%), radial-gradient(circle at 70% 20%, rgba(99, 102, 241, 0.05), transparent 50%), radial-gradient(circle at 50% 80%, rgba(168, 85, 247, 0.04), transparent 50%)",
          animation: "aurora-drift 20s ease-in-out infinite alternate",
        }}
      />
    </div>
  );
}

// React Bits style: Magnetic button
function MagneticButton({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = e.clientX - rect.left - rect.width / 2;
    const py = e.clientY - rect.top - rect.height / 2;
    x.set(px * 0.3);
    y.set(py * 0.3);
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ x: springX, y: springY }}
      className={className}
    >
      {children}
    </motion.button>
  );
}

// React Bits style: Spotlight card
function SpotlightCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      className={`group relative overflow-hidden ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(400px circle at ${pos.x}px ${pos.y}px, rgba(255,255,255,0.06), transparent 40%)`,
        }}
      />
      {children}
    </div>
  );
}

export default function V4ReactBits() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <AuroraBackground />

      <section className="relative z-10 flex min-h-[90vh] flex-col items-center justify-center px-4 text-center">
        <div className="max-w-3xl space-y-10">
          <p className="font-mono text-xs tracking-[0.25em] text-muted-foreground/40 uppercase">
            Meu Laboratório de Soluções
          </p>

          <h1 className="font-heading text-6xl font-bold tracking-tight sm:text-8xl">
            <SplitText text="Labfy" />
          </h1>

          <p className="mx-auto max-w-lg text-lg text-muted-foreground/60 leading-relaxed">
            Portfolio, produtos, comunidade e conteúdo.
            O hub de tecnologia do Calney.
          </p>

          <MagneticButton className="inline-flex items-center gap-2 rounded-full bg-foreground px-8 py-4 text-sm font-medium text-background hover:bg-foreground/90 transition-colors">
            Explorar projetos
            <ArrowRight className="h-4 w-4" />
          </MagneticButton>
        </div>
      </section>

      <section className="relative z-10 px-4 py-24">
        <div className="mx-auto max-w-6xl space-y-16">
          <div className="space-y-3 text-center">
            <h2 className="font-heading text-4xl font-semibold tracking-tight">Projetos</h2>
            <p className="text-muted-foreground/60">Soluções que construí e mantenho</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <SpotlightCard
                key={p.name}
                className="rounded-xl border border-white/[0.06] bg-card/50 backdrop-blur-sm"
              >
                <Card className="border-0 bg-transparent shadow-none">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="font-heading text-lg">{p.name}</CardTitle>
                      <Badge variant="outline" className={statusColors[p.status]}>
                        {p.status === "secure" ? "Produção" : p.status === "running" ? "Ativo" : "Em breve"}
                      </Badge>
                    </div>
                    <CardDescription>{p.description}</CardDescription>
                  </CardHeader>
                </Card>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 px-4 py-24">
        <div className="mx-auto max-w-4xl space-y-16">
          <div className="space-y-3 text-center">
            <h2 className="font-heading text-4xl font-semibold tracking-tight">O que vem por aí</h2>
            <p className="text-muted-foreground/60">O roadmap do laboratório</p>
          </div>

          <div className="space-y-3">
            {roadmap.map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 rounded-lg border border-white/[0.06] bg-card/30 p-5 backdrop-blur-sm"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted font-mono text-xs text-muted-foreground">
                  {i + 1}
                </span>
                <span className="font-medium">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/[0.06] px-4 py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-muted-foreground/40">
            Labfy · Meu Laboratório de Soluções
          </p>
          <div className="flex items-center gap-4">
            <Link href="https://github.com/calneymgp" target="_blank" className="text-muted-foreground/40 hover:text-foreground transition-colors">
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