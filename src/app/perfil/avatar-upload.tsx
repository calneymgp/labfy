"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Cropper, { type Area } from "react-easy-crop";
import { Camera, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { commitAvatar } from "./actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const OUTPUT_SIZE = 512;
const MAX_INPUT_BYTES = 8 * 1024 * 1024;

async function getCroppedBlob(src: string, area: Area): Promise<Blob> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Não foi possível ler a imagem."));
    img.src = src;
  });

  const canvas = document.createElement("canvas");
  canvas.width = OUTPUT_SIZE;
  canvas.height = OUTPUT_SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas indisponível neste navegador.");

  ctx.drawImage(
    image,
    area.x,
    area.y,
    area.width,
    area.height,
    0,
    0,
    OUTPUT_SIZE,
    OUTPUT_SIZE
  );

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Falha ao gerar a imagem."))),
      "image/webp",
      0.9
    );
  });
}

export function AvatarUpload({
  userId,
  avatarUrl,
  initials,
}: {
  userId: string;
  avatarUrl: string | null;
  initials: string;
}) {
  const router = useRouter();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [src, setSrc] = React.useState<string | null>(null);
  const [crop, setCrop] = React.useState({ x: 0, y: 0 });
  const [zoom, setZoom] = React.useState(1);
  const [croppedArea, setCroppedArea] = React.useState<Area | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  function closeDialog() {
    if (src) URL.revokeObjectURL(src);
    setSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedArea(null);
    setError(null);
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Escolha um arquivo de imagem.");
      return;
    }
    if (file.size > MAX_INPUT_BYTES) {
      setError("Imagem muito grande — máximo de 8MB.");
      return;
    }

    setError(null);
    setSrc(URL.createObjectURL(file));
  }

  async function handleSave() {
    if (!src || !croppedArea) return;
    setSaving(true);
    setError(null);

    try {
      const blob = await getCroppedBlob(src, croppedArea);
      const supabase = createClient();
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(`${userId}/avatar.webp`, blob, {
          upsert: true,
          contentType: "image/webp",
          cacheControl: "3600",
        });
      if (uploadError) throw new Error("Falha no upload. Tente novamente.");

      const { error: commitError } = await commitAvatar();
      if (commitError) throw new Error(commitError);

      closeDialog();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Algo deu errado. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex items-end gap-4">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="group/upload relative -mt-8 shrink-0 rounded-full ring-4 ring-card"
        aria-label="Trocar foto de perfil"
      >
        <Avatar size="lg" className="size-20">
          {avatarUrl && <AvatarImage src={avatarUrl} alt="Foto de perfil" />}
          <AvatarFallback className="text-lg">{initials}</AvatarFallback>
        </Avatar>
        <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover/upload:opacity-100">
          <Camera className="size-5 text-white" />
        </span>
      </button>

      <div className="space-y-1 pb-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-sm"
          onClick={() => inputRef.current?.click()}
        >
          <Camera className="size-3.5" />
          Trocar foto
        </Button>
        {error && !src && <p className="text-xs text-exposed">{error}</p>}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />

      <Dialog open={Boolean(src)} onOpenChange={(open) => !open && !saving && closeDialog()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ajustar foto</DialogTitle>
            <DialogDescription>
              Arraste para posicionar e use o controle para dar zoom.
            </DialogDescription>
          </DialogHeader>

          <div className="relative h-64 w-full overflow-hidden rounded-sm border border-border bg-black">
            {src && (
              <Cropper
                image={src}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_area, areaPixels) => setCroppedArea(areaPixels)}
              />
            )}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="avatar-zoom"
              className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase"
            >
              Zoom
            </label>
            <input
              id="avatar-zoom"
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-foreground"
            />
          </div>

          {error && <p className="text-xs text-exposed">{error}</p>}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="rounded-sm"
              disabled={saving}
              onClick={closeDialog}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              className="rounded-sm"
              disabled={saving || !croppedArea}
              onClick={handleSave}
            >
              {saving ? <Loader2 className="size-3.5 animate-spin" /> : "Salvar foto"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
