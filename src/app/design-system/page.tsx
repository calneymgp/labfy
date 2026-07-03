import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChartDemo } from "./chart-demo";

const colors = [
  { name: "Paper", token: "--background", value: "#F5F5F0", swatch: "bg-background border" },
  { name: "Ink", token: "--foreground", value: "#383838", swatch: "bg-foreground" },
  { name: "Card", token: "--card", value: "#FFFFFF", swatch: "bg-card border" },
  { name: "Border", token: "--border", value: "#C2C0B6", swatch: "bg-border" },
  { name: "Ink muted", token: "--muted-foreground", value: "#5A5A5A", swatch: "bg-muted-foreground" },
  { name: "Preto (painel)", token: "#000000", value: "#000000", swatch: "bg-black" },
];

const statusColors = [
  { name: "Pending", token: "--st-pending", className: "bg-pending" },
  { name: "Running", token: "--st-running", className: "bg-running" },
  { name: "Secure / Sucesso", token: "--st-secure", className: "bg-secure" },
  { name: "Vulnerable / Alerta", token: "--st-vulnerable", className: "bg-vulnerable" },
  { name: "Exposed / Erro", token: "--st-exposed", className: "bg-exposed" },
];

const invoices = [
  { id: "INV001", membro: "calney@labfy.dev", status: "secure" as const, valor: "R$ 250,00" },
  { id: "INV002", membro: "beta@labfy.dev", status: "pending" as const, valor: "R$ 150,00" },
  { id: "INV003", membro: "ativo@labfy.dev", status: "running" as const, valor: "R$ 350,00" },
  { id: "INV004", membro: "erro@labfy.dev", status: "exposed" as const, valor: "R$ 0,00" },
];

const statusMap = {
  pending: { label: "Em breve", className: "bg-pending/10 text-pending border-pending/20" },
  running: { label: "Ativo", className: "bg-running/10 text-running border-running/20" },
  secure: { label: "Pago", className: "bg-secure/10 text-secure border-secure/20" },
  exposed: { label: "Falhou", className: "bg-exposed/10 text-exposed border-exposed/20" },
};

function SectionHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="space-y-1">
      <p className="font-mono text-[10px] font-bold tracking-widest text-muted-foreground uppercase">{eyebrow}</p>
      <h2 className="font-heading text-lg font-semibold tracking-tight">{title}</h2>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

export default function DesignSystemPage() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-14 px-4 py-10">
      <div className="space-y-2">
        <p className="font-mono text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
          Referência viva
        </p>
        <h1 className="font-heading text-3xl font-bold tracking-tight">Design System</h1>
        <p className="max-w-lg text-sm text-muted-foreground leading-relaxed">
          Terminal Paper — os tokens e componentes reais em uso no Labfy. Documentação completa em{" "}
          <code className="rounded-sm border border-border bg-card px-1 py-0.5 text-xs">DESIGN_SYSTEM.md</code>.
        </p>
      </div>

      {/* Títulos */}
      <section className="space-y-4">
        <SectionHeader
          eyebrow="Tipografia"
          title="Títulos"
          description="Geist Mono em tudo — a escala real usada nas páginas do produto."
        />
        <div className="space-y-3 rounded-sm border border-border bg-card p-6">
          <h1 className="font-heading text-4xl font-bold tracking-tight">Heading 1 — hero</h1>
          <h2 className="font-heading text-lg font-semibold tracking-tight">Heading 2 — seção</h2>
          <h3 className="font-heading text-sm font-semibold tracking-tight">Heading 3 — subseção</h3>
          <p className="font-mono text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
            Label CLI — status / metadado
          </p>
        </div>
      </section>

      {/* Cores */}
      <section className="space-y-4">
        <SectionHeader
          eyebrow="Paleta"
          title="Cores"
          description="Base quase monocromática (preto + paper) com acentos semânticos de status."
        />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {colors.map((c) => (
            <div key={c.name} className="overflow-hidden rounded-sm border border-border bg-card">
              <div className={`h-14 ${c.swatch}`} />
              <div className="space-y-0.5 p-2.5">
                <p className="text-xs font-medium">{c.name}</p>
                <p className="font-mono text-[10px] text-muted-foreground">{c.value}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {statusColors.map((c) => (
            <div key={c.name} className="overflow-hidden rounded-sm border border-border bg-card">
              <div className={`h-10 ${c.className}`} />
              <div className="space-y-0.5 p-2.5">
                <p className="text-xs font-medium">{c.name}</p>
                <p className="font-mono text-[10px] text-muted-foreground">{c.token}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Botões */}
      <section className="space-y-4">
        <SectionHeader
          eyebrow="Ações"
          title="Botões"
          description="Padrão neutro é borda fina (outline). Cor sólida só para ações semânticas — sucesso, erro, alerta."
        />
        <div className="space-y-4 rounded-sm border border-border bg-card p-6">
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="default">Ok / Confirmar</Button>
            <Button variant="outline">Cancelar</Button>
            <Button variant="success">Sucesso</Button>
            <Button variant="destructive">Erro</Button>
            <Button variant="warning">Alerta</Button>
            <Button variant="secondary">Secundário</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>
          <p className="text-xs text-muted-foreground">
            <span className="text-foreground">Default</span> = ink sólido (ação principal). Sucesso/Erro/Alerta usam
            os tokens de status (<code className="text-[11px]">--st-secure</code>,{" "}
            <code className="text-[11px]">--st-exposed</code>, <code className="text-[11px]">--st-vulnerable</code>) —
            nunca cor decorativa aleatória.
          </p>
        </div>
      </section>

      {/* Tabela */}
      <section className="space-y-4">
        <SectionHeader
          eyebrow="Dados"
          title="Tabela"
          description="Bordas finas, header uppercase discreto, badges de status semânticas."
        />
        <div className="overflow-hidden rounded-sm border border-border bg-card">
          <Table>
            <TableCaption className="pb-4 font-mono text-[10px] tracking-widest uppercase">
              Últimas cobranças
            </TableCaption>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-mono text-[10px] tracking-widest uppercase">Fatura</TableHead>
                <TableHead className="font-mono text-[10px] tracking-widest uppercase">Membro</TableHead>
                <TableHead className="font-mono text-[10px] tracking-widest uppercase">Status</TableHead>
                <TableHead className="text-right font-mono text-[10px] tracking-widest uppercase">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell className="font-mono text-xs">{inv.id}</TableCell>
                  <TableCell className="text-xs">{inv.membro}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`${statusMap[inv.status].className} text-[0.6rem] px-1 py-0`}>
                      {statusMap[inv.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs">{inv.valor}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* Gráfico */}
      <section className="space-y-4">
        <SectionHeader
          eyebrow="Dados"
          title="Gráfico"
          description="Recharts via shadcn/ui chart, cores puxadas dos tokens de status."
        />
        <div className="rounded-sm border border-border bg-card p-6">
          <ChartDemo />
        </div>
      </section>
    </div>
  );
}
