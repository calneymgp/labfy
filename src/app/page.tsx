import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-8 px-6 text-center">
      <Image
        src="/labfy-logo-transparent.png"
        alt="Labfy"
        width={200}
        height={200}
        priority
        className="h-40 w-40 sm:h-52 sm:w-52"
      />
      <div className="max-w-lg space-y-3">
        <p className="font-mono text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
          Bem-vindo(a)
        </p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">A comunidade Labfy</h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Laboratório de produtos, código aberto e conteúdo técnico. Entre para acompanhar de
          perto.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <Link
          href="/entrar"
          className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-sm border border-primary bg-primary px-4 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/80"
        >
          Entrar / Criar conta
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        <Link
          href="https://github.com/calneymgp"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-sm border border-border bg-background px-4 text-xs font-medium text-foreground transition-colors hover:border-foreground"
        >
          GitHub
        </Link>
        <Link
          href="https://chat.whatsapp.com/JgCZk7RSq2MCH810o1Gc83"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-sm border border-border bg-background px-4 text-xs font-medium text-foreground transition-colors hover:border-foreground"
        >
          <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zm5.8 14.02c-.24.68-1.4 1.32-1.93 1.4-.5.08-1.12.11-1.8-.11-.42-.13-.95-.31-1.63-.6-2.87-1.24-4.74-4.13-4.88-4.32-.14-.19-1.17-1.55-1.17-2.96s.73-2.1.99-2.38c.26-.29.57-.36.76-.36h.55c.18 0 .42-.07.65.5.24.58.82 2 .89 2.15.07.14.12.31.02.5-.09.19-.14.31-.28.48-.14.17-.29.37-.42.5-.14.14-.28.29-.12.57.16.29.72 1.19 1.55 1.93 1.06.95 1.96 1.24 2.24 1.38.28.14.44.12.61-.07.16-.19.7-.82.89-1.1.19-.29.38-.24.63-.14.26.1 1.63.77 1.91.91.28.14.47.21.54.33.07.12.07.71-.17 1.39z" />
          </svg>
          WhatsApp
        </Link>
        <Link
          href="https://www.youtube.com/@labfydev"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-sm border border-border bg-background px-4 text-xs font-medium text-foreground transition-colors hover:border-foreground"
        >
          <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.51 3.5 12 3.5 12 3.5s-7.51 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14c1.87.55 9.38.55 9.38.55s7.51 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z" />
          </svg>
          YouTube
        </Link>
      </div>
    </section>
  );
}
