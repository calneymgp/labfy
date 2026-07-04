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
import { Avatar, AvatarBadge, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from "@/components/ui/avatar";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Star, UserPlus, Link2, Globe, Sparkles, Bot, Wand2 } from "lucide-react";
import { ChartDemo } from "./chart-demo";
import { CommentThread } from "./comment-thread";
import { SkillFormDialog } from "./skill-form-dialog";
import { KnowledgeGraph } from "./graph/knowledge-graph";

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

const members = [
  { name: "calney", role: "Fundador", bio: "Construindo o laboratório." },
  { name: "beta.tester", role: "Membro", bio: "Testando tudo antes de todo mundo." },
  { name: "labfy.dev", role: "Bot", bio: "Automação da casa." },
];

const articles = [
  {
    tag: "Engenharia",
    title: "Por que trocamos magic link por código OTP",
    excerpt: "Um código de 6 dígitos é mais rápido de digitar do que abrir o app de e-mail e clicar num link.",
    author: "calney",
    date: "03 jul",
    readTime: "4 min",
  },
  {
    tag: "Design System",
    title: "Terminal Paper: por que quase monocromático",
    excerpt: "Preto, papel e bordas finas — como decidimos a paleta do Labfy e quando abrir exceção.",
    author: "calney",
    date: "01 jul",
    readTime: "6 min",
  },
];

const skills = [
  { icon: Bot, name: "Revisor de PR", category: "Agente", author: "calney", uses: 128 },
  { icon: Wand2, name: "Gerador de copy", category: "Prompt", author: "beta.tester", uses: 64 },
  { icon: Sparkles, name: "Resumo de reunião", category: "Automação", author: "calney", uses: 41 },
];

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

      {/* Avatar */}
      <section className="space-y-4">
        <SectionHeader
          eyebrow="Identidade"
          title="Avatar"
          description="Tamanhos, indicador de status e agrupamento — base para perfil, comunidade e comentários."
        />
        <div className="flex flex-wrap items-center gap-6 rounded-sm border border-border bg-card p-6">
          <Avatar size="sm">
            <AvatarImage src="" alt="calney" />
            <AvatarFallback className="font-mono text-[10px] uppercase">CL</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage src="" alt="calney" />
            <AvatarFallback className="font-mono uppercase">CL</AvatarFallback>
          </Avatar>
          <Avatar size="lg">
            <AvatarImage src="" alt="calney" />
            <AvatarFallback className="font-mono uppercase">CL</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback className="font-mono uppercase">CL</AvatarFallback>
            <AvatarBadge className="bg-secure" />
          </Avatar>
          <AvatarGroup>
            <Avatar>
              <AvatarFallback className="font-mono uppercase">CL</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback className="font-mono uppercase">BT</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback className="font-mono uppercase">LB</AvatarFallback>
            </Avatar>
            <AvatarGroupCount>+2</AvatarGroupCount>
          </AvatarGroup>
        </div>
      </section>

      {/* Comunidade */}
      <section className="space-y-4">
        <SectionHeader
          eyebrow="Comunidade"
          title="Membros & comentários"
          description="Card de membro (diretório) e thread de comentários aninhada."
        />
        <div className="grid gap-3 sm:grid-cols-3">
          {members.map((m) => (
            <Card key={m.name} className="hover:border-foreground transition-colors">
              <CardHeader className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarFallback className="font-mono uppercase">{m.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <CardTitle className="font-heading text-sm">{m.name}</CardTitle>
                      <Badge variant="outline" className="text-[0.6rem] px-1 py-0">
                        {m.role}
                      </Badge>
                    </div>
                    <CardDescription className="text-xs">{m.bio}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardFooter className="px-4 pb-4">
                <Button variant="outline" size="sm" className="w-full rounded-sm">
                  <UserPlus className="h-3.5 w-3.5" />
                  Seguir
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="rounded-sm border border-border bg-card p-6">
          <CommentThread />
        </div>
      </section>

      {/* Blog */}
      <section className="space-y-4">
        <SectionHeader eyebrow="Conteúdo" title="Blog" description="Card de artigo, breadcrumb e paginação." />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Blog</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Artigo</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="grid gap-3 sm:grid-cols-2">
          {articles.map((a) => (
            <Card key={a.title} className="hover:border-foreground transition-colors">
              <CardHeader className="space-y-2 p-4">
                <Badge variant="outline" className="w-fit text-[0.6rem] px-1 py-0">
                  {a.tag}
                </Badge>
                <CardTitle className="font-heading text-sm leading-snug">{a.title}</CardTitle>
                <CardDescription className="text-xs">{a.excerpt}</CardDescription>
              </CardHeader>
              <CardFooter className="flex items-center justify-between px-4 pb-4">
                <div className="flex items-center gap-2">
                  <Avatar size="sm">
                    <AvatarFallback className="font-mono text-[10px] uppercase">
                      {a.author.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-[11px] text-muted-foreground">{a.author}</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground">
                  <span>{a.date}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {a.readTime}
                  </span>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" className="rounded-sm" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive className="rounded-sm">
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" className="rounded-sm">
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" className="rounded-sm" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </section>

      {/* Skills de IA */}
      <section className="space-y-4">
        <SectionHeader
          eyebrow="Marketplace"
          title="Skills de IA"
          description="Card de skill publicada pela comunidade, filtro por categoria e formulário de criação."
        />
        <Tabs defaultValue="todas">
          <div className="flex items-center justify-between gap-3">
            <TabsList>
              <TabsTrigger value="todas">Todas</TabsTrigger>
              <TabsTrigger value="agente">Agentes</TabsTrigger>
              <TabsTrigger value="prompt">Prompts</TabsTrigger>
              <TabsTrigger value="automacao">Automação</TabsTrigger>
            </TabsList>
            <SkillFormDialog />
          </div>
          <TabsContent value="todas" className="mt-4">
            <div className="grid gap-3 sm:grid-cols-3">
              {skills.map((s) => (
                <Card key={s.name} className="hover:border-foreground transition-colors">
                  <CardHeader className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border border-border bg-muted/50">
                        <s.icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-1.5">
                          <CardTitle className="font-heading text-sm">{s.name}</CardTitle>
                          <Badge variant="outline" className="text-[0.6rem] px-1 py-0">
                            {s.category}
                          </Badge>
                        </div>
                        <CardDescription className="flex items-center gap-2 text-xs">
                          <span>por {s.author}</span>
                          <span className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
                            <Star className="h-3 w-3" />
                            {s.uses}
                          </span>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Perfil */}
      <section className="space-y-4">
        <SectionHeader
          eyebrow="Conta"
          title="Perfil"
          description="Header com banner, avatar grande e abas para organizar posts/skills/atividade."
        />
        <div className="overflow-hidden rounded-sm border border-border bg-card">
          <div className="h-20 bg-black" />
          <div className="space-y-4 px-6 pb-6">
            <div className="-mt-8 flex items-end justify-between">
              <Avatar size="lg" className="ring-4 ring-card">
                <AvatarFallback className="font-mono text-base uppercase">CL</AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm" className="rounded-sm">
                Editar perfil
              </Button>
            </div>
            <div className="space-y-1">
              <h3 className="font-heading text-base font-semibold">calney</h3>
              <p className="text-xs text-muted-foreground">Fundador do Labfy — laboratório de produtos e conteúdo técnico.</p>
              <div className="flex items-center gap-3 pt-1 text-muted-foreground">
                <Link2 className="h-3.5 w-3.5" />
                <Globe className="h-3.5 w-3.5" />
              </div>
            </div>
            <Tabs defaultValue="posts">
              <TabsList>
                <TabsTrigger value="posts">Posts</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="atividade">Atividade</TabsTrigger>
              </TabsList>
              <TabsContent value="posts" className="mt-4 text-xs text-muted-foreground">
                2 artigos publicados.
              </TabsContent>
              <TabsContent value="skills" className="mt-4 text-xs text-muted-foreground">
                1 skill publicada.
              </TabsContent>
              <TabsContent value="atividade" className="mt-4 text-xs text-muted-foreground">
                Entrou no Labfy em jun/2026.
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Visão em grafo */}
      <section className="space-y-4">
        <SectionHeader
          eyebrow="Conhecimento"
          title="Visão em grafo"
          description="React Flow (@xyflow/react), nós flutuantes ligados por linha reta — estilo Obsidian, sem fluxograma."
        />
        <KnowledgeGraph />
        <div className="flex flex-wrap items-center gap-4">
          {[
            { label: "Membro", color: "bg-foreground" },
            { label: "Skill", color: "bg-running" },
            { label: "Artigo", color: "bg-secure" },
            { label: "Tópico", color: "bg-pending" },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${l.color}`} />
              <span className="font-mono text-[10px] tracking-wide text-muted-foreground uppercase">{l.label}</span>
            </div>
          ))}
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Arraste os nós, dê zoom — a linha recalcula a interseção com a borda do círculo em tempo real
          (<code className="text-[11px] text-foreground">src/app/design-system/graph/geometry.ts</code>), sem handles
          fixos de fluxograma. Tamanho do nó = quão conectado ele é na rede.
        </p>
      </section>
    </div>
  );
}
