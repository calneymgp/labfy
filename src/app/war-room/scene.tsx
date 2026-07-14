"use client";

// Cena da War Room: a arte animada do usuário sobre um halo de vela (âmbar), com
// as bordas mascaradas por um gradiente radial para fundir com o fundo escuro do
// painel — em vez de um quadrado seco jogado na tela.
export function WarRoomScene() {
  return (
    <div className="relative flex items-center justify-center px-4 pt-5 pb-2">
      {/* halo quente atrás (candlelight) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div
          className="h-56 w-56 rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(233,163,74,0.30), transparent 70%)" }}
        />
      </div>

      <video
        src="/war-room/scene.mp4"
        poster="/war-room/scene-poster.png"
        autoPlay
        loop
        muted
        playsInline
        aria-label="Salão da War Room"
        className="relative w-full max-w-[280px]"
        style={{
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 80% at 50% 48%, black 56%, transparent 92%)",
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 48%, black 56%, transparent 92%)",
          filter: "drop-shadow(0 14px 34px rgba(0,0,0,0.55))",
        }}
      />
    </div>
  );
}
