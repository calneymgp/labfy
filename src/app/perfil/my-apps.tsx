"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Pencil, Trash2, Plus, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  APP_CATEGORY_OPTIONS,
  APP_NAME_MAX,
  APP_DESC_MAX,
  APP_URL_MAX,
  type App,
} from "@/lib/apps";
import { createApp, updateApp, deleteApp } from "./apps-actions";

const EMPTY = { name: "", description: "", category: "", url: "" };

export function MyApps({ apps }: { apps: App[] }) {
  const router = useRouter();
  const [form, setForm] = React.useState(EMPTY);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  function resetForm() {
    setForm(EMPTY);
    setEditingId(null);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.name.trim()) return setError("Dê um nome ao app.");
    setBusy(true);
    try {
      const res = editingId ? await updateApp(editingId, form) : await createApp(form);
      if (res.error) return setError(res.error);
      resetForm();
      router.refresh();
    } catch {
      setError("Algo deu errado. Tente novamente.");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id: string) {
    setBusy(true);
    try {
      await deleteApp(id);
      if (editingId === id) resetForm();
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  function startEdit(app: App) {
    setEditingId(app.id);
    setForm({
      name: app.name,
      description: app.description,
      category: app.category,
      url: app.url,
    });
    setError(null);
  }

  return (
    <div className="space-y-4">
      {apps.length > 0 && (
        <div className="space-y-2">
          {apps.map((app) => (
            <div
              key={app.id}
              className="flex items-start justify-between gap-3 rounded-sm border border-border bg-card p-3"
            >
              <div className="min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-semibold tracking-tight">{app.name}</p>
                  {app.category && (
                    <Badge variant="outline" className="shrink-0 rounded-sm">
                      {app.category}
                    </Badge>
                  )}
                </div>
                {app.description && (
                  <p className="text-xs text-muted-foreground">{app.description}</p>
                )}
                {app.url && (
                  <a
                    href={app.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-[10px] text-muted-foreground hover:text-foreground"
                  >
                    <ExternalLink className="size-3" /> {app.url}
                  </a>
                )}
              </div>
              <div className="flex shrink-0 gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => startEdit(app)}
                  aria-label="Editar app"
                >
                  <Pencil className="size-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => handleDelete(app.id)}
                  disabled={busy}
                  aria-label="Remover app"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-sm border border-dashed border-border p-4"
      >
        <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
          {editingId ? "Editar app" : "Adicionar app"}
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="app-name" className="text-xs">
              Nome
            </Label>
            <Input
              id="app-name"
              value={form.name}
              maxLength={APP_NAME_MAX}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ex.: Vibeodonto"
              className="rounded-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="app-category" className="text-xs">
              Categoria
            </Label>
            <select
              id="app-category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="h-9 w-full rounded-sm border border-input bg-card px-2 font-mono text-xs text-foreground"
            >
              <option value="">Selecione</option>
              {APP_CATEGORY_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="app-desc" className="text-xs">
            O que faz
          </Label>
          <Input
            id="app-desc"
            value={form.description}
            maxLength={APP_DESC_MAX}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Descrição curta"
            className="rounded-sm"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="app-url" className="text-xs">
            URL
          </Label>
          <Input
            id="app-url"
            value={form.url}
            maxLength={APP_URL_MAX}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            placeholder="https://…"
            className="rounded-sm"
          />
        </div>

        {error && <p className="text-xs text-exposed">{error}</p>}

        <div className="flex items-center gap-2">
          <Button type="submit" variant="outline" size="sm" disabled={busy} className="rounded-sm">
            {busy ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : editingId ? (
              "Salvar"
            ) : (
              <>
                <Plus className="size-3.5" /> Adicionar
              </>
            )}
          </Button>
          {editingId && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={resetForm}
              className="rounded-sm"
            >
              Cancelar
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
