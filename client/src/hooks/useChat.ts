import { useState, useCallback, useRef } from "react";
import type { PersonaId, Message } from "@/types/chat";
import { PERSONAS } from "@/personas/personaMeta";

// Temporary mock reply generator — will be replaced by useSSEStream's
// real backend call. Kept isolated so that swap is a one-function change.
const MOCK_REPLIES: Record<PersonaId, string[]> = {
  hitesh: [
    "Dekho bhai, ye acha sawaal hai. Pehle basics pakka karo, speed apne aap aa jayegi.",
    "Haan ji, bilkul sahi soch rahe ho. Ek chhota project banao isi concept pe.",
    "Toh bhai, teen cheezein hain yahan samajhne wali — concept, code, consistency.",
  ],
  piyush: [
    "Okay so here's the thing — start simple, split things out once you feel real pain.",
    "Good question. Think in three layers: API contract, data layer, failure handling.",
    "Honestly? Ship the ugly version first. You'll learn more than any course teaches.",
  ],
};

function createEmptyThreads(): Record<PersonaId, Message[]> {
  return { hitesh: [], piyush: [] };
}

export function useChat() {
  const [activeId, setActiveId] = useState<PersonaId>("hitesh");
  const [threads, setThreads] = useState<Record<PersonaId, Message[]>>(createEmptyThreads());
  const [isTyping, setIsTyping] = useState(false);
  const replyIndexRef = useRef<Record<PersonaId, number>>({ hitesh: 0, piyush: 0 });

  const persona = PERSONAS[activeId];
  const messages = threads[activeId];

  const appendMessage = useCallback((id: PersonaId, message: Message) => {
    setThreads((prev) => ({ ...prev, [id]: [...prev[id], message] }));
  }, []);

  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isTyping) return;

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        text: trimmed,
        timestamp: Date.now(),
        personaId: activeId,
      };
      appendMessage(activeId, userMessage);
      setIsTyping(true);

      // Mock response block — replace this with a call into
      // useSSEStream(activeId, windowedMessages) once the backend exists.
      const targetId = activeId; // capture in case user switches personas mid-typing
      const delay = 800 + Math.random() * 600;
      setTimeout(() => {
        const pool = MOCK_REPLIES[targetId];
        const idx = replyIndexRef.current[targetId] % pool.length;
        replyIndexRef.current[targetId] += 1;

        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          text: pool[idx],
          timestamp: Date.now(),
          personaId: targetId,
        };
        appendMessage(targetId, assistantMessage);
        setIsTyping(false);
      }, delay);
    },
    [activeId, isTyping, appendMessage],
  );

  return {
    persona,
    activeId,
    setActiveId,
    messages,
    isTyping,
    sendMessage,
  };
}
