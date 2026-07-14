import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { initialsOf, type Profile } from "@/lib/profile";
import { AvatarUpload } from "./avatar-upload";
import { ProfileForm } from "./profile-form";

export const metadata: Metadata = {
  title: "Perfil — Labfy",
};

export default async function PerfilPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/entrar");

  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, headline, avatar_url, preferred_models, preferred_harnesses")
    .eq("id", user.id)
    .maybeSingle();

  const profile: Profile = data ?? {
    id: user.id,
    full_name: "",
    headline: "",
    avatar_url: null,
    preferred_models: [],
    preferred_harnesses: [],
  };

  return (
    <section className="mx-auto w-full max-w-2xl px-4 pb-12">
      <div className="mt-6 overflow-hidden rounded-sm border border-border bg-card">
        {/* faixa de alto contraste do header de perfil (Design System §5) */}
        <div className="flex h-24 items-end bg-black px-6 pb-3">
          <p className="font-mono text-[10px] font-bold tracking-widest text-white/70 uppercase">
            Perfil · Comunidade Labfy
          </p>
        </div>

        <div className="px-6 pb-6 pt-5">
          <AvatarUpload
            userId={user.id}
            avatarUrl={profile.avatar_url}
            initials={initialsOf(profile.full_name, user.email ?? "")}
          />

          <div className="mt-4 space-y-0.5">
            <h1 className="font-heading text-xl font-semibold tracking-tight">
              {profile.full_name || "Complete seu perfil"}
            </h1>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>

          <div className="mt-6 border-t border-border pt-6">
            <ProfileForm profile={profile} />
          </div>
        </div>
      </div>
    </section>
  );
}
