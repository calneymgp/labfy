"use client";

// Cena da War Room: arte animada do usuário (vídeo leve ~116KB). object-contain
// mostra a sala inteira (zoom out), centralizada e em tamanho reduzido.
export function WarRoomScene() {
  return (
    <div className="mx-auto w-full max-w-sm overflow-hidden rounded-sm border border-border bg-black">
      <video
        src="/war-room/scene.mp4"
        poster="/war-room/scene-poster.png"
        autoPlay
        loop
        muted
        playsInline
        aria-label="Salão da War Room"
        className="h-full w-full object-contain"
      />
    </div>
  );
}
