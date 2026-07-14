"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  FULL_NAME_MAX,
  HEADLINE_MAX,
  HARNESS_OPTIONS,
  MODEL_OPTIONS,
  SPECIALTY_OPTIONS,
  ROLE_MAX,
  LOCATION_MAX,
  SKILL_MAX,
  SKILLS_MAX_COUNT,
  type Profile,
} from "@/lib/profile";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
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
  const [specialty, setSpecialty] = React.useState(profile.specialty);
  const [role, setRole] = React.useState(profile.role);
  const [location, setLocation] = React.useState(profile.location);
  const [whatsapp, setWhatsapp] = React.useState(profile.whatsapp);
  const [skills, setSkills] = React.useState<string[]>(profile.skills);
  const [skillDraft, setSkillDraft] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  function toggle(list: string[], setList: (v: string[]) => void, value: string) {
    setSaved(false);
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  function addSkill(raw: string) {
    const value = raw.trim().slice(0, SKILL_MAX);
    if (!value || skills.includes(value) || skills.length >= SKILLS_MAX_COUNT) return;
    setSaved(false);
    setSkills([...skills, value]);
    setSkillDraft("");
  }

  function removeSkill(value: string) {
    setSaved(false);
    setSkills(skills.filter((s) => s !== value));
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
        specialty,
        role,
        location,
        skills,
        whatsapp,
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
          Especialidade
        </p>
        <ToggleChips
          options={SPECIALTY_OPTIONS}
          selected={specialty ? [specialty] : []}
          onToggle={(v) => {
            setSaved(false);
            setSpecialty((cur) => (cur === v ? "" : v));
          }}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="role" className="text-xs">
            Cargo
          </Label>
          <Input
            id="role"
            value={role}
            maxLength={ROLE_MAX}
            onChange={(e) => {
              setSaved(false);
              setRole(e.target.value);
            }}
            placeholder="Ex.: Engenheiro de software"
            className="rounded-sm"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="location" className="text-xs">
            Localização
          </Label>
          <Input
            id="location"
            value={location}
            maxLength={LOCATION_MAX}
            onChange={(e) => {
              setSaved(false);
              setLocation(e.target.value);
            }}
            placeholder="Ex.: Curitiba, BR"
            className="rounded-sm"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="whatsapp-field" className="text-xs">
          WhatsApp
        </Label>
        <PhoneInput
          international
          defaultCountry="BR"
          value={whatsapp || undefined}
          onChange={(v) => {
            setSaved(false);
            setWhatsapp(v ?? "");
          }}
          className="labfy-phone flex items-center gap-2 rounded-sm border border-input bg-card px-2"
          numberInputProps={{
            id: "whatsapp-field",
            className: "h-9 w-full bg-transparent font-mono text-sm outline-none",
          }}
        />
        <p className="text-[10px] text-muted-foreground">
          Visível só para você — não aparece no diretório público.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="skills" className="text-xs">
          Skills
        </Label>
        <Input
          id="skills"
          value={skillDraft}
          onChange={(e) => setSkillDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              addSkill(skillDraft);
            }
          }}
          placeholder="Digite uma skill e tecle Enter"
          className="rounded-sm"
        />
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {skills.map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => removeSkill(skill)}
                className="inline-flex items-center gap-1 rounded-sm border border-border bg-card px-2 py-1 font-mono text-[11px] text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
              >
                {skill}
                <X className="size-3" />
              </button>
            ))}
          </div>
        )}
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
