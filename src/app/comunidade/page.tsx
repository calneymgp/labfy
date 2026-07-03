import { Users } from "lucide-react";

export default function ComunidadePage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-sm border border-border bg-card">
        <Users className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="space-y-1.5">
        <h1 className="font-heading text-lg font-semibold tracking-tight">Comunidade</h1>
        <p className="max-w-sm text-xs text-muted-foreground">
          Em breve: um espaço nativo do Labfy para discussão, networking e conteúdo entre membros.
        </p>
      </div>
    </div>
  );
}
