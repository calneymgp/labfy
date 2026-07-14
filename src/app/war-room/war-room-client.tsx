"use client";

import * as React from "react";
import { Loader2, ArrowUp } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  CHARACTER_BY_ID,
  type CharacterId,
  type WarRoomMessage,
} from "@/lib/war-room/characters";
import { WarRoomScene } from "./scene";
import { startDebate } from "./actions";

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
  const bottomRef = React.useRef<HTMLDivElement>(null);

  // Streaming + resumibilidade: assina novas falas e re-sincroniza a cada (re)conexão.
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

  // Auto-scroll para a última fala (comportamento de chat).
  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  async function handleStart() {
    setError(null);
    if (!prompt.trim()) return setError("Escreva um tema para o debate.");
    setStarting(true);
    try {
      const { error: e, sessionId: sid } = await startDebate(prompt);
      if (e) return setError(e);
      if (sid) {
        setPrompt("");
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
    <div className="mx-auto flex h-full w-full max-w-2xl flex-col">
      {/* Área rolável: cena + falas */}
      <div className="flex-1 space-y-4 overflow-y-auto px-1 pb-4">
        <WarRoomScene />

        {phaseLabel && (
          <div className="flex items-center justify-center gap-2">
            <span className="font-mono text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
              {phaseLabel}
            </span>
            {running && <Loader2 className="size-3 animate-spin text-muted-foreground" />}
          </div>
        )}

        {sessionId && spoken.length === 0 && (
          <p className="text-center text-xs text-muted-foreground">A mesa está se preparando…</p>
        )}

        <div className="space-y-3">
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
                <p className="text-sm whitespace-pre-wrap text-foreground">{m.content}</p>
              </div>
            );
          })}

          {conclusion && (
            <div className="rounded-sm border border-foreground bg-foreground/[0.03] p-4">
              <p className="mb-2 font-mono text-[10px] font-bold tracking-widest text-foreground uppercase">
                Conclusão da mesa
              </p>
              <p className="text-sm whitespace-pre-wrap text-foreground">{conclusion.content}</p>
            </div>
          )}
        </div>

        <div ref={bottomRef} />
      </div>

      {/* Prompt input fixo embaixo (estilo ChatGPT/Claude) */}
      <div className="shrink-0 pt-2">
        {error && <p className="mb-2 text-xs text-exposed">{error}</p>}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleStart();
          }}
          className="relative rounded-lg border border-input bg-card shadow-sm transition-colors focus-within:border-ring"
        >
          <Textarea
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
            className="max-h-40 min-h-[52px] resize-none border-0 bg-transparent py-3.5 pr-12 text-sm shadow-none focus-visible:ring-0"
          />
          <Button
            type="submit"
            size="icon-sm"
            disabled={starting || !prompt.trim()}
            aria-label="Enviar"
            className="absolute right-2 bottom-2 rounded-sm"
          >
            {starting ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <ArrowUp className="size-4" />
            )}
          </Button>
        </form>
        <p className="mt-1.5 text-center font-mono text-[10px] text-muted-foreground">
          A mesa pesquisa, debate em 12 turnos e conclui · Enter envia, Shift+Enter quebra linha
        </p>
      </div>
    </div>
  );
}
