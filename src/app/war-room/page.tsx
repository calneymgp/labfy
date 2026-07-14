import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "War Room — Labfy",
};

export default function WarRoomPage() {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-6">
      <div className="mb-5 space-y-1">
        <h1 className="font-heading text-xl font-semibold tracking-tight">War Room</h1>
        <p className="text-xs text-muted-foreground">
          Quatro modelos de IA debatem o seu prompt até uma conclusão.
        </p>
      </div>
      <div className="flex h-[400px] items-center justify-center rounded-sm border border-dashed border-border bg-card">
        <p className="font-mono text-[11px] text-muted-foreground">
          Em construção — a mesa está sendo montada.
        </p>
      </div>
    </section>
  );
}
