import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EntrarForm } from "./entrar-form";

export default async function EntrarPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/");

  return (
    <div className="mx-auto flex max-w-sm flex-1 flex-col justify-center px-4 py-12">
      <EntrarForm />
    </div>
  );
}
