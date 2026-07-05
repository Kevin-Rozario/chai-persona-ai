import { useState, useCallback, useRef } from "react";
import type { PersonaId, Message, Provider } from "@/types/chat";
import { PERSONAS } from "@/personas/personaMeta";
import {
  getWindowedMessages,
  getPendingSummaryMessages,
  shouldSummarize,
} from "@/utils/contextWindow";
import { streamChat } from "@/hooks/useSSEStream";

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

      const assistantId = crypto.randomUUID();
      let hasStartedReply = false;

      const appendPlaceholder = () => {
        const placeholder: Message = {
          id: assistantId,
          role: "assistant",
          text: "",
          timestamp: Date.now(),
          personaId: targetId,
          isStreaming: true,
        };
        setThreads((prev) => ({ ...prev, [targetId]: [...prev[targetId], placeholder] }));
      };

      const appendToken = (value: string) => {
        if (!hasStartedReply) {
          hasStartedReply = true;
          appendPlaceholder();
        }
        setThreads((prev) => ({
          ...prev,
          [targetId]: prev[targetId].map((m) =>
            m.id === assistantId ? { ...m, text: m.text + value } : m,
          ),
        }));
      };

      const attachReferences = (refs: Message["references"]) => {
        setThreads((prev) => ({
          ...prev,
          [targetId]: prev[targetId].map((m) =>
            m.id === assistantId ? { ...m, references: refs } : m,
          ),
        }));
      };

      const finalizeReply = () => {
        setThreads((prev) => ({
          ...prev,
          [targetId]: prev[targetId].map((m) =>
            m.id === assistantId ? { ...m, isStreaming: false } : m,
          ),
        }));
      };

      const showError = (message: string) => {
        if (hasStartedReply) {
          finalizeReply();
          return;
        }
        const fallback: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          text: message,
          timestamp: Date.now(),
          personaId: targetId,
        };
        setThreads((prev) => ({ ...prev, [targetId]: [...prev[targetId], fallback] }));
      };

      try {
        await streamChat(
          `${import.meta.env.VITE_BACKEND_API_URL}/chat`,
          {
            personaId: targetId,
            provider,
            apiKey,
            messages: windowed,
            ...(shouldSummarize(pendingRaw) && { pending }),
            ...(summary && { summary }),
          },
          {
            onToken: appendToken,
            onReferences: attachReferences,
            onSummary: (value) => {
              summariesRef.current[targetId] = value;
              summarizedUpToRef.current[targetId] = currentActiveThread.length - windowed.length;
            },
            onDone: finalizeReply,
            onError: showError,
          },
        );
      } catch {
        showError("Something went wrong. Please try again.");
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
