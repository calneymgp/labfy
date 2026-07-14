"use client";

// A cena da War Room é a arte fornecida pelo usuário: vídeo animado leve (~116KB,
// H.264) com poster estático de fallback. Peça única — a mesa e os 4 personagens
// já estão na arte.
export function WarRoomScene() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-2xl overflow-hidden rounded-sm border border-border bg-black">
      <video
        src="/war-room/scene.mp4"
        poster="/war-room/scene-poster.png"
        autoPlay
        loop
        muted
        playsInline
        aria-label="Salão da War Room"
        className="h-full w-full object-cover"
      />
    </div>
  );
}
