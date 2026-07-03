import type { Message, ChatMessage } from "@/types/chat";

export const WINDOW_SIZE = 6;
export const SUMMARY_BATCH_SIZE = 6;

export function getWindowedMessages(messages: Message[]): ChatMessage[] {
  return messages.slice(-WINDOW_SIZE).map((m) => ({ role: m.role, text: m.text }));
}

export function getPendingSummaryMessages(messages: Message[], summarizedUpTo: number): Message[] {
  const windowStart = messages.length - WINDOW_SIZE;
  if (windowStart <= summarizedUpTo) return [];
  return messages.slice(summarizedUpTo, windowStart);
}

export function shouldSummarize(pending: Message[]): boolean {
  return pending.length >= SUMMARY_BATCH_SIZE;
}
