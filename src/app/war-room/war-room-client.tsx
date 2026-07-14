"use client";

import * as React from "react";
import { Loader2, ArrowUp, Swords, Gavel } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  WAR_ROOM_CHARACTERS,
  CHARACTER_BY_ID,
  type CharacterId,
  type WarRoomMessage,
} from "@/lib/war-room/characters";
import { WarRoomScene } from "./scene";
import { startDebate } from "./actions";

const PHASES = [
  { key: "research", label: "Pesquisa" },
  { key: "debate", label: "Debate" },
  { key: "conclusion", label: "Veredito" },
] as const;

export function WarRoomClient({
  initialSessionId,
  initialMessages,
  initialStatus,
}: {
  initialSessionId: string | null;
  initialMessages: WarRoomMessage[];
  initialStatus: string | null;
}) {
  const [prompt, setPrompt] = React.useState("");
  const [sessionId, setSessionId] = React.useState<string | null>(initialSessionId);
  const [messages, setMessages] = React.useState<WarRoomMessage[]>(initialMessages);
  const [starting, setStarting] = React.useState(false);
  const [started, setStarted] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const bottomRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!sessionId) return;
    const supabase = createClient();

    const sync = () => {
      supabase
        .from("war_room_messages")
        .select("id, character, phase, content, turn")
        .eq("session_id", sessionId)
        .order("turn")
        .order("created_at")
        .then(({ data }) => {
          if (data) setMessages(data as WarRoomMessage[]);
        });
    };

    const channel = supabase
      .channel(`war-room-${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "war_room_messages",
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          const msg = payload.new as WarRoomMessage;
          setMessages((prev) => (prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]));
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") sync();
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  async function handleStart() {
    setError(null);
    if (!prompt.trim()) return setError("Escreva um tema para a mesa debater.");
    setStarting(true);
    try {
      const { error: e, sessionId: sid } = await startDebate(prompt);
      if (e) return setError(e);
      if (sid) {
        setPrompt("");
        setMessages([]);
        setSessionId(sid);
        setStarted(true);
      }
    } catch {
      setError("Algo deu errado. Tente novamente.");
    } finally {
      setStarting(false);
    }
  }

  const spoken = messages.filter((m) => m.phase === "debate" || m.phase === "research");
  const conclusion = messages.find((m) => m.phase === "conclusion");
  const hasDebate = spoken.some((m) => m.phase === "debate");
  const activeStatus = initialStatus === "researching" || initialStatus === "debating";
  const inProgress = !conclusion && (spoken.length > 0 || started || activeStatus);

  // Índice da fase atual para o stepper (-1 = ociosa).
  const phaseIndex = conclusion ? 2 : hasDebate ? 1 : spoken.length > 0 || inProgress ? 0 : -1;

  // Quem está falando agora (última fala não-sistema), para destacar na party.
  const lastVoice = [...spoken].reverse()[0];
  const speaking =
    inProgress && lastVoice && CHARACTER_BY_ID.has(lastVoice.character as CharacterId)
      ? (lastVoice.character as CharacterId)
      : null;

  const phaseLabel = conclusion
    ? "Veredito proferido"
    : hasDebate
      ? "Debatendo"
      : phaseIndex === 0
        ? "Pesquisando"
        : initialStatus === "error"
          ? "A mesa se dispersou — proponha de novo"
          : null;

  return (
    <div
      className="relative mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col overflow-hidden rounded-xl border border-white/10"
      style={{ background: "radial-gradient(ellipse at 50% -10%, #17130d 0%, #0a0a0c 55%)" }}
    >
      {/* Header temático */}
      <header className="shrink-0 border-b border-white/10 px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <Swords className="size-5 text-amber-400" />
          <h1 className="font-mono text-lg leading-none font-bold tracking-[0.25em] text-white uppercase">
            War Room
          </h1>
          {phaseLabel && (
            <span className="ml-auto flex items-center gap-1.5 font-mono text-[10px] font-bold tracking-widest text-amber-300/80 uppercase">
              {inProgress && <Loader2 className="size-3 animate-spin" />}
              {phaseLabel}
            </span>
          )}
        </div>
        <p className="mt-1 font-mono text-[11px] text-white/45">
          O conselho dos quatro pesquisa, debate e crava um veredito.
        </p>
      </header>

      {/* Área rolável */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <WarRoomScene />

        {/* Party — os 4 conselheiros */}
        <div className="grid grid-cols-4 gap-2 px-4">
          {WAR_ROOM_CHARACTERS.map((c) => {
            const active = speaking === c.id;
            return (
              <div
                key={c.id}
                className="flex flex-col items-center gap-1 rounded-lg border px-2 py-2.5 text-center transition-all duration-300"
                style={{
                  borderColor: active ? c.color : "rgba(255,255,255,0.08)",
                  background: active
                    ? `color-mix(in srgb, ${c.color} 14%, transparent)`
                    : "rgba(255,255,255,0.02)",
                  boxShadow: active ? `0 0 20px -4px ${c.color}` : undefined,
                }}
              >
                <span
                  className="size-2.5 rounded-full transition-all"
                  style={{
                    background: c.color,
                    boxShadow: active ? `0 0 10px ${c.color}` : undefined,
                  }}
                />
                <span className="font-mono text-[11px] font-bold text-white/90">{c.name}</span>
                <span className="font-mono text-[8px] leading-tight text-white/40">{c.persona}</span>
                {active && (
                  <span
                    className="font-mono text-[8px] font-bold tracking-widest uppercase"
                    style={{ color: c.color }}
                  >
                    fala
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Stepper de fases */}
        <div className="flex items-center justify-center gap-2 px-4 pt-4">
          {PHASES.map((p, i) => {
            const reached = phaseIndex >= i;
            const current = phaseIndex === i;
            return (
              <React.Fragment key={p.key}>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`size-1.5 rounded-full ${reached ? "bg-amber-400" : "bg-white/20"} ${current && inProgress ? "animate-pulse" : ""}`}
                  />
                  <span
                    className={`font-mono text-[9px] font-bold tracking-widest uppercase ${reached ? "text-white/80" : "text-white/25"}`}
                  >
                    {p.label}
                  </span>
                </div>
                {i < PHASES.length - 1 && <span className="h-px w-5 bg-white/12" />}
              </React.Fragment>
            );
          })}
        </div>

        {/* Log do debate */}
        <div className="space-y-2.5 px-4 pt-4 pb-4">
          {!sessionId && spoken.length === 0 && (
            <p className="py-6 text-center font-mono text-[11px] text-white/35">
              Proponha um tema abaixo e observe os quatro deliberarem.
            </p>
          )}
          {sessionId && spoken.length === 0 && (
            <p className="py-4 text-center font-mono text-[11px] text-white/40">
              A mesa está reunindo suas fontes…
            </p>
          )}

          {spoken.map((m) => {
            const c = CHARACTER_BY_ID.get(m.character as CharacterId);
            return (
              <div
                key={m.id}
                className="rounded-lg border border-white/10 bg-white/[0.03] p-3"
                style={{ borderLeftColor: c?.color, borderLeftWidth: 2 }}
              >
                <div className="mb-1.5 flex items-center gap-2">
                  <span className="size-2 rounded-full" style={{ background: c?.color }} />
                  <span
                    className="font-mono text-[10px] font-bold tracking-widest uppercase"
                    style={{ color: c?.color }}
                  >
                    {c?.name ?? m.character}
                  </span>
                  {m.phase === "research" && (
                    <span className="rounded-sm bg-white/5 px-1.5 py-px font-mono text-[8px] tracking-wider text-white/40 uppercase">
                      pesquisa
                    </span>
                  )}
                </div>
                <p className="text-[13px] leading-relaxed whitespace-pre-wrap text-white/80">
                  {m.content}
                </p>
              </div>
            );
          })}

          {conclusion && (
            <div
              className="rounded-lg border p-4"
              style={{
                borderColor: "rgba(233,163,74,0.4)",
                background: "rgba(233,163,74,0.06)",
              }}
            >
              <div className="mb-2 flex items-center gap-2">
                <Gavel className="size-3.5 text-amber-400" />
                <span className="font-mono text-[10px] font-bold tracking-widest text-amber-400 uppercase">
                  Veredito da mesa
                </span>
              </div>
              <p className="text-sm leading-relaxed whitespace-pre-wrap text-white/90">
                {conclusion.content}
              </p>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Prompt input */}
      <div className="shrink-0 border-t border-white/10 px-4 py-3.5">
        {error && <p className="mb-2 font-mono text-[11px] text-red-400">{error}</p>}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleStart();
          }}
          className="relative rounded-xl border border-white/15 bg-white/[0.04] transition-colors focus-within:border-amber-400/50"
        >
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleStart();
              }
            }}
            placeholder="Proponha um tema para a mesa debater…"
            rows={1}
            className="max-h-40 min-h-[52px] w-full resize-none bg-transparent py-3.5 pr-12 pl-4 text-sm text-white outline-none placeholder:text-white/30"
          />
          <button
            type="submit"
            disabled={starting || !prompt.trim()}
            aria-label="Enviar"
            className="absolute right-2 bottom-2 flex size-8 items-center justify-center rounded-lg bg-amber-400 text-black transition-opacity hover:bg-amber-300 disabled:opacity-40"
          >
            {starting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <ArrowUp className="size-4" />
            )}
          </button>
        </form>
        <p className="mt-2 text-center font-mono text-[10px] text-white/30">
          Pesquisa diversificada · 12 turnos de debate · veredito garantido — Enter envia
        </p>
      </div>
    </div>
  );
}
