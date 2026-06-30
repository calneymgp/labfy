import Link from "next/link";

const projects = [
  { name: "TAMZ", desc: "Plataforma de inteligência de mercado B2B", badge: "badge-success", badgeText: "Produção" },
  { name: "Escudo Code", desc: "Pentest automatizado sob demanda", badge: "badge-info", badgeText: "Ativo" },
  { name: "Portfolio", desc: "Portfolio de projetos e soluções", badge: "badge-info", badgeText: "Ativo" },
  { name: "Consultas", desc: "App de gestão de consultas", badge: "badge-warning", badgeText: "Em breve" },
  { name: "Loot Hunter", desc: "Jogo de caça ao tesouro", badge: "badge-warning", badgeText: "Em breve" },
  { name: "Carol Moura", desc: "Website pessoal de nutrição", badge: "badge-success", badgeText: "Produção" },
];

const techs = ["Next.js", "TypeScript", "Tailwind", "PostgreSQL", "Docker", "Coolify", "Python", "React", "vLLM"];

export default function V3DaisyUI() {
  return (
    <>
      {/* Navbar */}
      <div className="navbar bg-base-100 border-b border-base-300">
        <div className="flex-1">
          <Link href="/v3-daisyui" className="btn btn-ghost text-xl font-bold tracking-tight">
            Labfy
          </Link>
        </div>
        <div className="flex-none gap-2">
          <Link href="#projetos" className="btn btn-ghost btn-sm">
            Projetos
          </Link>
          <Link href="#futuro" className="btn btn-ghost btn-sm">
            Roadmap
          </Link>
          <Link href="https://github.com/calneymgp" target="_blank" className="btn btn-ghost btn-sm">
            GitHub
          </Link>
        </div>
      </div>

      {/* Hero */}
      <div className="hero min-h-[85vh]">
        <div className="hero-content text-center">
          <div className="max-w-2xl space-y-8">
            <span className="badge badge-outline badge-lg px-4 py-3 text-xs tracking-widest uppercase">
              Meu Laboratório de Soluções
            </span>
            <h1 className="text-7xl font-bold tracking-tight lg:text-8xl">Labfy</h1>
            <p className="text-lg text-base-content/60 leading-relaxed">
              Portfolio, produtos, comunidade e conteúdo. O hub de tecnologia do Calney.
            </p>
            <div className="flex justify-center gap-3">
              <Link href="#projetos" className="btn btn-primary btn-lg">
                Explorar projetos
              </Link>
              <Link href="https://github.com/calneymgp" target="_blank" className="btn btn-outline btn-lg">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                GitHub
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mx-auto max-w-4xl px-4 pb-24">
        <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
          <div className="stat">
            <div className="stat-title">Projetos</div>
            <div className="stat-value text-primary">6+</div>
            <div className="stat-desc">Apps e soluções ativas</div>
          </div>
          <div className="stat">
            <div className="stat-title">Anos</div>
            <div className="stat-value text-secondary">5+</div>
            <div className="stat-desc">De experiência em tech</div>
          </div>
          <div className="stat">
            <div className="stat-title">Stacks</div>
            <div className="stat-value text-accent">9+</div>
            <div className="stat-desc">Tecnologias no arsenal</div>
          </div>
        </div>
      </div>

      {/* Projetos */}
      <div id="projetos" className="mx-auto max-w-6xl px-4 pb-24">
        <div className="mb-12 text-center space-y-3">
          <h2 className="text-4xl font-bold">Projetos</h2>
          <p className="text-base-content/60">Soluções que construí e mantenho</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <div key={p.name} className="card bg-base-200 hover:bg-base-300 transition-colors">
              <div className="card-body">
                <div className="flex items-start justify-between">
                  <h3 className="card-title">{p.name}</h3>
                  <span className={`badge ${p.badge} badge-sm`}>{p.badgeText}</span>
                </div>
                <p className="text-base-content/60 text-sm">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tech stack */}
      <div className="mx-auto max-w-6xl px-4 pb-24">
        <div className="mb-12 text-center space-y-3">
          <h2 className="text-4xl font-bold">Tecnologias</h2>
          <p className="text-base-content/60">O que uso no dia a dia</p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {techs.map((tech) => (
            <span key={tech} className="badge badge-outline badge-lg px-4 py-2 text-sm">
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Roadmap Timeline */}
      <div id="futuro" className="mx-auto max-w-4xl px-4 pb-24">
        <div className="mb-12 text-center space-y-3">
          <h2 className="text-4xl font-bold">O que vem por aí</h2>
          <p className="text-base-content/60">O roadmap do laboratório</p>
        </div>
        <ul className="timeline timeline-vertical lg:timeline-horizontal">
          <li>
            <div className="timeline-start timeline-box">
              <h4 className="font-bold">Mentorias</h4>
              <p className="text-sm text-base-content/60">Programa de mentoria em tecnologia</p>
            </div>
            <hr />
          </li>
          <li>
            <hr />
            <div className="timeline-end timeline-box">
              <h4 className="font-bold">Benchmarks</h4>
              <p className="text-sm text-base-content/60">Performance e stacks</p>
            </div>
            <hr />
          </li>
          <li>
            <div className="timeline-start timeline-box">
              <h4 className="font-bold">Blog</h4>
              <p className="text-sm text-base-content/60">Artigos técnicos e reflexões</p>
            </div>
            <hr />
          </li>
          <li>
            <hr />
            <div className="timeline-end timeline-box">
              <h4 className="font-bold">Comunidade</h4>
              <p className="text-sm text-base-content/60">Grupo de discussão e networking</p>
            </div>
            <hr />
          </li>
        </ul>
      </div>

      {/* Footer */}
      <footer className="footer sm:footer-horizontal footer-center bg-base-200 text-base-content rounded p-10">
        <aside>
          <p className="font-bold text-lg">Labfy</p>
          <p className="text-sm text-base-content/60">Meu Laboratório de Soluções</p>
        </aside>
      </footer>
    </>
  );
}