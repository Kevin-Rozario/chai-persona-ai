import { createCompletion } from "@/services/llmClient.js";
import type { Provider, ChatMessage } from "@/types/chat.js";

const SUMMARY_SYSTEM_PROMPT = `
  You compress history into a short, factual summary.
  Capture: topics discussed, questions asked, key advice and decisions given.
  Do not add commentary or opinions. Keep it under 150 words. Write a plain prose, not bullet points.
`;

export async function summarizeConversation(
  provider: Provider,
  apiKey: string,
  previousSummary: string | undefined,
  newMessages: ChatMessage[]
): Promise<string> {
  const transcript = newMessages.map((m) => `${m.role}: ${m.text}`).join("\n");

  const userPrompt = previousSummary
    ? `Existing summary:\n${previousSummary}\n\nNew messages to fold in:\n${transcript}\n\nProduce one updated summary that captures both.`
    : `Summarize this conversation so far:\n${transcript}`;

  const summary = await createCompletion(provider, apiKey, SUMMARY_SYSTEM_PROMPT, [
    { role: "user", text: userPrompt },
  ]);

  return summary.trim();
}
