"use client";

import Image from "next/image";
import { WAR_ROOM_CHARACTERS, type CharacterId } from "@/lib/war-room/characters";

// Assentos ao redor da mesa redonda (posição em % dentro da cena quadrada).
const SEATS: Record<CharacterId, { top: string; left: string }> = {
  deepseek: { top: "12%", left: "50%" }, // topo
  gemma: { top: "50%", left: "86%" }, // direita
  hermes: { top: "86%", left: "50%" }, // base
  minimax: { top: "50%", left: "14%" }, // esquerda
};

export function WarRoomScene({ activeId }: { activeId: CharacterId | null }) {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-lg overflow-hidden rounded-sm border border-border bg-card">
      <Image
        src="/war-room/salao.png"
        alt="Salão da War Room"
        fill
        unoptimized
        priority
        className="object-cover [image-rendering:pixelated]"
      />

      {WAR_ROOM_CHARACTERS.map((c) => {
        const seat = SEATS[c.id];
        const active = activeId === c.id;
        const dimmed = activeId !== null && !active;
        return (
          <div
            key={c.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-200"
            style={{ top: seat.top, left: seat.left, zIndex: active ? 10 : 1 }}
          >
            <Image
              src={`/war-room/${c.id}.png`}
              alt={c.name}
              width={64}
              height={64}
              unoptimized
              className="[image-rendering:pixelated]"
              style={{
                transform: active ? "scale(1.15)" : "scale(1)",
                filter: active
                  ? `drop-shadow(0 0 6px ${c.color})`
                  : dimmed
                    ? "grayscale(0.6) brightness(0.7)"
                    : undefined,
                transition: "transform 150ms, filter 150ms",
              }}
            />
            <span
              className="absolute top-full left-1/2 mt-0.5 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] font-bold tracking-widest uppercase"
              style={{ color: active ? c.color : "var(--muted-foreground)" }}
            >
              {c.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}
