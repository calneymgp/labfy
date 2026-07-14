import { task, logger } from "@trigger.dev/sdk";
import { generateText } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { createClient } from "@supabase/supabase-js";
import { WAR_ROOM_CHARACTERS } from "@/lib/war-room/characters";
import { withWebSearch } from "@/lib/war-room/web-search";

export type WarRoomDebatePayload = { sessionId: string; prompt: string };

const TURNS = 12;

export const warRoomDebate = task({
  id: "war-room-debate",
  maxDuration: 1800,
  retry: { maxAttempts: 1 },
  run: async (payload: WarRoomDebatePayload) => {
    const openrouter = createOpenRouter({ apiKey: process.env.OPENROUTER_API_KEY });
    const supabase = createClient(
      process.env.SUPABASE_URL as string,
      process.env.SUPABASE_SERVICE_ROLE_KEY as string,
      { auth: { persistSession: false } }
    );

    const setStatus = (status: string) =>
      supabase.from("war_room_sessions").update({ status }).eq("id", payload.sessionId);

    const addMessage = (character: string, phase: string, content: string, turn: number) =>
      supabase.from("war_room_messages").insert({
        session_id: payload.sessionId,
        character,
        phase,
        content,
        turn,
      });

    try {
      // Idempotência: se a task re-rodar (retry/reenvio), recomeça sem duplicar falas.
      await supabase.from("war_room_messages").delete().eq("session_id", payload.sessionId);

      // FASE 1 — RESEARCH: cada personagem pesquisa na web (:online), em paralelo.
      // allSettled: a falha de um modelo não derruba o debate.
      await setStatus("researching");
      const settled = await Promise.allSettled(
        WAR_ROOM_CHARACTERS.map(async (c) => {
          const { text } = await generateText({
            model: openrouter(withWebSearch(c.model)),
            system: c.systemPrompt,
            prompt:
              `Pesquise na web contexto relevante e diversificado sobre: "${payload.prompt}". ` +
              `Traga 3-4 fatos ou ângulos concretos que embasem sua posição no debate.`,
          });
          await addMessage(c.id, "research", text, 0);
          return { name: c.name, findings: text };
        })
      );
      const research = settled.map((r, i) =>
        r.status === "fulfilled"
          ? r.value
          : { name: WAR_ROOM_CHARACTERS[i].name, findings: "(não trouxe pesquisa desta vez)" }
      );

      // FASE 2 — DEBATE: turnos rotativos, todos veem tudo.
      await setStatus("debating");
      const transcript: { name: string; text: string }[] = [];
      for (let turn = 1; turn <= TURNS; turn++) {
        const c = WAR_ROOM_CHARACTERS[(turn - 1) % WAR_ROOM_CHARACTERS.length];
        const context = [
          `Pergunta em debate: ${payload.prompt}`,
          `Pesquisa de cada um:\n${research.map((r) => `- ${r.name}: ${r.findings}`).join("\n")}`,
          transcript.length
            ? `Debate até agora:\n${transcript.map((t) => `${t.name}: ${t.text}`).join("\n")}`
            : "Você abre o debate.",
          turn > TURNS - 3
            ? `Sua vez (${c.name}). Estamos perto do fim — busque CONVERGIR para uma conclusão acionável, reconhecendo os melhores pontos dos outros.`
            : `Sua vez (${c.name}). Traga um ponto novo e reaja aos outros.`,
        ].join("\n\n");
        try {
          const { text } = await generateText({
            model: openrouter(c.model),
            system: c.systemPrompt,
            prompt: context,
          });
          await addMessage(c.id, "debate", text, turn);
          transcript.push({ name: c.name, text });
          logger.info(`turno ${turn} — ${c.name}`);
        } catch (turnErr) {
          // um turno que falha não derruba o debate — segue para o próximo.
          logger.warn(`turno ${turn} — ${c.name} falhou, seguindo`, {
            error: String(turnErr),
          });
        }
      }

      // FASE 3 — CONCLUSION: síntese final GARANTIDA — tenta cada modelo até um dar certo,
      // com fallback textual. A mesa precisa concluir em ~100% das vezes.
      let conclusion = "";
      for (const c of WAR_ROOM_CHARACTERS) {
        try {
          const { text } = await generateText({
            model: openrouter(c.model),
            system:
              "Você é o moderador da mesa. Produza SEMPRE uma conclusão final clara e acionável em " +
              "português, mesmo diante de divergência — nesse caso, aponte o consenso possível e a " +
              "recomendação mais defensável. Nunca termine sem uma posição.",
            prompt:
              `Pergunta: ${payload.prompt}\n\nDebate:\n` +
              transcript.map((t) => `${t.name}: ${t.text}`).join("\n") +
              `\n\nEscreva a conclusão final da mesa (5-8 frases), terminando com uma recomendação objetiva.`,
          });
          conclusion = text;
          break;
        } catch (concErr) {
          logger.warn(`conclusão via ${c.name} falhou, tentando próximo modelo`, {
            error: String(concErr),
          });
        }
      }
      if (!conclusion) {
        conclusion =
          "A mesa debateu o tema mas não conseguiu gerar a síntese automática desta vez. " +
          "As posições de cada participante estão acima — a recomendação predominante deve ser extraída delas.";
      }
      await addMessage("system", "conclusion", conclusion, TURNS + 1);
      await setStatus("concluded");

      return { sessionId: payload.sessionId, turns: TURNS };
    } catch (err) {
      // persiste o estado de erro antes de relançar (rastreabilidade + retry Trigger)
      await setStatus("error");
      throw err;
    }
  },
});
