import { createClaudeCompletion } from "@/services/providers/anthropicProvider.js";
import { createOpenAICompletion } from "@/services/providers/openaiProvider.js";
import { Provider, ChatMessage } from "@/types/chat.js";

export async function createCompletion(
  provider: Provider,
  apiKey: string,
  systemPrompt: string,
  messages: ChatMessage[]
) {
  if (provider.toLowerCase() === "claude") {
    return createClaudeCompletion(apiKey, systemPrompt, messages);
  }

  if (provider.toLowerCase() === "openai") {
    return createOpenAICompletion(apiKey, systemPrompt, messages);
  }

  throw new Error(`Unsupported provider: ${provider}`);
}
