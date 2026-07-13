"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  FULL_NAME_MAX,
  HEADLINE_MAX,
  HARNESS_OPTIONS,
  MODEL_OPTIONS,
  type Profile,
} from "@/lib/profile";
import { updateProfile } from "./actions";

function ToggleChips({
  options,
  selected,
  onToggle,
}: {
  options: readonly string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((option) => {
        const active = selected.includes(option);
        return (
          <button
            key={option}
            type="button"
            aria-pressed={active}
            onClick={() => onToggle(option)}
            className={
              active
                ? "inline-flex items-center gap-1 rounded-sm border border-foreground bg-foreground px-2 py-1 font-mono text-[11px] text-background transition-colors"
                : "inline-flex items-center gap-1 rounded-sm border border-border bg-card px-2 py-1 font-mono text-[11px] text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
            }
          >
            {active && <Check className="size-3" />}
            {option}
          </button>
        );
      })}
    </div>
  );
}

export function ProfileForm({ profile }: { profile: Profile }) {
  const router = useRouter();
  const [fullName, setFullName] = React.useState(profile.full_name);
  const [headline, setHeadline] = React.useState(profile.headline);
  const [models, setModels] = React.useState<string[]>(profile.preferred_models);
  const [harnesses, setHarnesses] = React.useState<string[]>(profile.preferred_harnesses);
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  function toggle(list: string[], setList: (v: string[]) => void, value: string) {
    setSaved(false);
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);
    setSaving(true);

    try {
      const { error: saveError } = await updateProfile({
        fullName,
        headline,
        preferredModels: models,
        preferredHarnesses: harnesses,
      });
      if (saveError) return setError(saveError);

      setSaved(true);
      router.refresh();
    } catch {
      setError("Algo deu errado. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="full-name" className="text-xs">
          Nome completo
        </Label>
        <Input
          id="full-name"
          value={fullName}
          maxLength={FULL_NAME_MAX}
          onChange={(e) => {
            setSaved(false);
            setFullName(e.target.value);
          }}
          placeholder="Seu nome"
          className="rounded-sm"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="headline" className="text-xs">
          Headline
        </Label>
        <Input
          id="headline"
          value={headline}
          maxLength={HEADLINE_MAX}
          onChange={(e) => {
            setSaved(false);
            setHeadline(e.target.value);
          }}
          placeholder="Ex.: Engenheiro de software · IA aplicada"
          className="rounded-sm"
        />
        <p className="text-[10px] text-muted-foreground">
          {headline.length}/{HEADLINE_MAX}
        </p>
      </div>

      <div className="space-y-1.5">
        <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
          Modelos de IA de preferência
        </p>
        <ToggleChips
          options={MODEL_OPTIONS}
          selected={models}
          onToggle={(v) => toggle(models, setModels, v)}
        />
      </div>

      <div className="space-y-1.5">
        <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
          Harness de preferência
        </p>
        <ToggleChips
          options={HARNESS_OPTIONS}
          selected={harnesses}
          onToggle={(v) => toggle(harnesses, setHarnesses, v)}
        />
      </div>

      {error && <p className="text-xs text-exposed">{error}</p>}

      <div className="flex items-center gap-3">
        <Button type="submit" variant="outline" disabled={saving} className="rounded-sm">
          {saving ? <Loader2 className="size-3.5 animate-spin" /> : "Salvar perfil"}
        </Button>
        {saved && (
          <span className="flex items-center gap-1 font-mono text-[10px] font-bold tracking-widest text-secure uppercase">
            <Check className="size-3" /> Salvo
          </span>
        )}
      </div>
    </form>
  );
}
