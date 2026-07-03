import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-8 bg-black px-6 text-center">
      <Image
        src="/labfy-logo.png"
        alt="Labfy"
        width={200}
        height={200}
        priority
        className="h-40 w-40 sm:h-52 sm:w-52"
      />
      <div className="max-w-lg space-y-3">
        <p className="font-mono text-[10px] font-bold tracking-widest text-white/50 uppercase">
          Bem-vindo(a)
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          A comunidade Labfy
        </h1>
        <p className="text-sm leading-relaxed text-white/70">
          Laboratório de produtos, código aberto e conteúdo técnico do Calney. Entre para
          acompanhar de perto.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href="/entrar"
          className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-sm border border-white bg-white px-4 text-xs font-medium text-black transition-colors hover:bg-white/90"
        >
          Entrar / Criar conta
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        <Link
          href="https://github.com/calneymgp"
          target="_blank"
          className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-sm border border-white/30 px-4 text-xs font-medium text-white transition-colors hover:border-white"
        >
          GitHub
        </Link>
      </div>
    </section>
  );
}
