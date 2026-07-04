import { useState, useCallback, useRef } from "react";
import type { PersonaId, Message, Provider } from "@/types/chat";
import { PERSONAS } from "@/personas/personaMeta";
import {
  getWindowedMessages,
  getPendingSummaryMessages,
  shouldSummarize,
} from "@/utils/contextWindow";

function createEmptyThreads(): Record<PersonaId, Message[]> {
  return { hitesh: [], piyush: [] };
}

function createEmptySummaries(): Record<PersonaId, string | undefined> {
  return { hitesh: undefined, piyush: undefined };
}

function createEmptyIndex(): Record<PersonaId, number> {
  return { hitesh: 0, piyush: 0 };
}

interface UseChatOptions {
  provider: Provider;
  apiKey: string;
}

export function useChat({ provider, apiKey }: UseChatOptions) {
  const [activeId, setActiveId] = useState<PersonaId>("hitesh");
  const [threads, setThreads] = useState<Record<PersonaId, Message[]>>(createEmptyThreads());
  const [isTyping, setIsTyping] = useState(false);

  const summariesRef = useRef<Record<PersonaId, string | undefined>>(createEmptySummaries());
  const summarizedUpToRef = useRef<Record<PersonaId, number>>(createEmptyIndex());

  const persona = PERSONAS[activeId];
  const messages = threads[activeId];

  const appendMessage = useCallback((id: PersonaId, message: Message) => {
    setThreads((prev) => ({ ...prev, [id]: [...prev[id], message] }));
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isTyping || !apiKey) return;

      const targetId = activeId;

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        text: trimmed,
        timestamp: Date.now(),
        personaId: targetId,
      };
      appendMessage(targetId, userMessage);
      setIsTyping(true);

      const updatedThread = [...threads[targetId], userMessage];
      const windowed = getWindowedMessages(updatedThread);
      const summarizedUpTo = summarizedUpToRef.current[targetId];
      const pendingRaw = getPendingSummaryMessages(updatedThread, summarizedUpTo);
      const pending = pendingRaw.map((m) => ({ role: m.role, text: m.text }));
      const summary = summariesRef.current[targetId];

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            personaId: targetId,
            provider,
            apiKey,
            messages: windowed,
            ...(shouldSummarize(pendingRaw) && { pending }),
            ...(summary && { summary }),
          }),
        });

        if (!res.ok) throw new Error("Request failed");
        const data = await res.json();

        if (data.summary) {
          summariesRef.current[targetId] = data.summary;
          summarizedUpToRef.current[targetId] = updatedThread.length - windowed.length;
        }

        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          text: data.reply,
          timestamp: Date.now(),
          personaId: targetId,
        };
        appendMessage(targetId, assistantMessage);
      } catch {
        const fallback: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          text: "Something went wrong reaching the model. Please try again.",
          timestamp: Date.now(),
          personaId: targetId,
        };
        appendMessage(targetId, fallback);
      } finally {
        setIsTyping(false);
      }
    },
    [activeId, isTyping, apiKey, provider, threads, appendMessage],
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
