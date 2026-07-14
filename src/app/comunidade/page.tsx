import { redirect } from "next/navigation";

// A comunidade agora é o diretório de Membros.
export default function ComunidadePage() {
  redirect("/membros");
}
