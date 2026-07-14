"use client";

import * as React from "react";
import { Loader2, Send } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  CHARACTER_BY_ID,
  type CharacterId,
  type WarRoomMessage,
} from "@/lib/war-room/characters";
import { WarRoomScene } from "./scene";
import { startDebate } from "./actions";

const CHARACTER_IDS: CharacterId[] = ["deepseek", "gemma", "hermes", "minimax"];

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
  const [error, setError] = React.useState<string | null>(null);

  // Streaming + resumibilidade: assina novas falas e re-sincroniza a cada (re)conexão
  // (cobre inserts perdidos durante desconexão / ao reabrir o navegador).
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

  async function handleStart() {
    setError(null);
    if (!prompt.trim()) return setError("Escreva um tema para o debate.");
    setStarting(true);
    try {
      const { error: e, sessionId: sid } = await startDebate(prompt);
      if (e) return setError(e);
      if (sid) {
        setMessages([]);
        setSessionId(sid);
      }
    } catch {
      setError("Algo deu errado. Tente novamente.");
    } finally {
      setStarting(false);
    }
  }

  const spoken = messages.filter((m) => m.phase === "debate" || m.phase === "research");
  const conclusion = messages.find((m) => m.phase === "conclusion");
  const lastSpeaker = [...messages].reverse().find((m) => m.character !== "system");
  const activeId =
    lastSpeaker && CHARACTER_IDS.includes(lastSpeaker.character as CharacterId)
      ? (lastSpeaker.character as CharacterId)
      : null;

  const running = !conclusion && (spoken.length > 0 || Boolean(sessionId));
  const phaseLabel = conclusion
    ? "Concluído"
    : initialStatus === "error" && spoken.length === 0
      ? "Falhou — tente de novo"
      : spoken.length > 0
        ? "Debatendo…"
        : sessionId
          ? "Pesquisando…"
          : null;

  return (
    <div className="space-y-5">
      <div className="flex gap-2">
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleStart();
          }}
          placeholder="Sobre o que a mesa deve debater?"
          className="h-9 flex-1 rounded-sm border border-input bg-card px-3 font-mono text-sm outline-none focus-visible:border-ring"
        />
        <Button onClick={handleStart} disabled={starting} className="rounded-sm">
          {starting ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <>
              <Send className="size-3.5" /> Iniciar
            </>
          )}
        </Button>
      </div>
      {error && <p className="text-xs text-exposed">{error}</p>}

      {phaseLabel && (
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
            {phaseLabel}
          </span>
          {running && <Loader2 className="size-3 animate-spin text-muted-foreground" />}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div>
          <WarRoomScene activeId={activeId} />
        </div>

        <div className="max-h-[520px] space-y-2 overflow-y-auto">
          {sessionId && spoken.length === 0 && (
            <p className="text-xs text-muted-foreground">A mesa está se preparando…</p>
          )}
          {spoken.map((m) => {
            const c = CHARACTER_BY_ID.get(m.character as CharacterId);
            return (
              <div key={m.id} className="rounded-sm border border-border bg-card p-3">
                <div className="mb-1 flex items-center gap-1.5">
                  <span
                    className="size-2 rounded-full"
                    style={{ background: c?.color ?? "var(--muted-foreground)" }}
                  />
                  <span
                    className="font-mono text-[10px] font-bold tracking-widest uppercase"
                    style={{ color: c?.color ?? "var(--muted-foreground)" }}
                  >
                    {c?.name ?? m.character}
                  </span>
                  {m.phase === "research" && (
                    <span className="font-mono text-[9px] text-muted-foreground">· pesquisa</span>
                  )}
                </div>
                <p className="text-xs whitespace-pre-wrap text-foreground">{m.content}</p>
              </div>
            );
          })}
        </div>
      </div>

      {conclusion && (
        <div className="rounded-sm border border-foreground bg-foreground/[0.03] p-4">
          <p className="mb-2 font-mono text-[10px] font-bold tracking-widest text-foreground uppercase">
            Conclusão da mesa
          </p>
          <p className="text-sm whitespace-pre-wrap text-foreground">{conclusion.content}</p>
        </div>
      )}
    </div>
  );
}
