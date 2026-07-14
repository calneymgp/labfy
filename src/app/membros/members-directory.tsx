"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SPECIALTY_OPTIONS, initialsOf, type PublicMember } from "@/lib/profile";

export function MembersDirectory({ members }: { members: PublicMember[] }) {
  const [query, setQuery] = React.useState("");
  const [specialty, setSpecialty] = React.useState("");
  const [role, setRole] = React.useState("");
  const [location, setLocation] = React.useState("");

  const filtered = members.filter((m) => {
    if (query && !m.full_name.toLowerCase().includes(query.toLowerCase())) return false;
    if (specialty && m.specialty !== specialty) return false;
    if (role && !m.role.toLowerCase().includes(role.toLowerCase())) return false;
    if (location && !m.location.toLowerCase().includes(location.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nome"
            className="rounded-sm pl-8"
          />
        </div>
        <select
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
          aria-label="Filtrar por especialidade"
          className="h-9 rounded-sm border border-input bg-card px-2 font-mono text-xs text-foreground"
        >
          <option value="">Todas especialidades</option>
          {SPECIALTY_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <Input
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="Cargo"
          className="rounded-sm"
        />
        <Input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Localização"
          className="rounded-sm"
        />
      </div>

      <p className="font-mono text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
        {filtered.length} {filtered.length === 1 ? "membro" : "membros"}
      </p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((m) => (
          <div key={m.id} className="rounded-sm border border-border bg-card p-4">
            <div className="flex items-center gap-3">
              <Avatar size="lg" className="size-11">
                {m.avatar_url && <AvatarImage src={m.avatar_url} alt={m.full_name} />}
                <AvatarFallback>{initialsOf(m.full_name, "?")}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold tracking-tight">
                  {m.full_name || "Sem nome"}
                </p>
                {m.headline && (
                  <p className="truncate text-xs text-muted-foreground">{m.headline}</p>
                )}
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              {m.specialty && (
                <Badge variant="outline" className="rounded-sm">
                  {m.specialty}
                </Badge>
              )}
              {m.role && (
                <span className="font-mono text-[11px] text-muted-foreground">{m.role}</span>
              )}
            </div>

            {m.location && (
              <p className="mt-2 font-mono text-[11px] text-muted-foreground">{m.location}</p>
            )}

            {m.skills.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {m.skills.slice(0, 6).map((s) => (
                  <span
                    key={s}
                    className="rounded-sm border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-12 text-center text-xs text-muted-foreground">
          Nenhum membro encontrado com esses filtros.
        </p>
      )}
    </div>
  );
}
