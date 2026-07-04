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

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isTyping || !apiKey) return;

      const targetId = activeId;
      setIsTyping(true);

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        text: trimmed,
        timestamp: Date.now(),
        personaId: targetId,
      };

      const currentActiveThread = [...threads[targetId], userMessage];
      setThreads((prev) => ({ ...prev, [targetId]: currentActiveThread }));

      const windowed = getWindowedMessages(currentActiveThread);
      const summarizedUpTo = summarizedUpToRef.current[targetId];
      const pendingRaw = getPendingSummaryMessages(currentActiveThread, summarizedUpTo);
      const pending = pendingRaw.map((m) => ({ role: m.role, text: m.text }));
      const summary = summariesRef.current[targetId];

      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/chat`, {
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

        const payload = await res.json();

        if (!res.ok || !payload.success) {
          throw new Error(payload?.error?.message || "Failed to reach server.");
        }

        const apiData = payload.data;

        if (apiData.summary) {
          summariesRef.current[targetId] = apiData.summary;
          summarizedUpToRef.current[targetId] = currentActiveThread.length - windowed.length;
        }

        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          text: apiData.reply,
          timestamp: Date.now(),
          personaId: targetId,
          ...(apiData.references?.length > 0 && { references: apiData.references }),
        };

        setThreads((prev) => ({ ...prev, [targetId]: [...prev[targetId], assistantMessage] }));
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Something went wrong. Please try again.";
        const fallback: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          text: message,
          timestamp: Date.now(),
          personaId: targetId,
        };
        setThreads((prev) => ({ ...prev, [targetId]: [...prev[targetId], fallback] }));
      } finally {
        setIsTyping(false);
      }
    },
    [activeId, isTyping, apiKey, provider, threads],
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
