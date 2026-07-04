import { createClaudeCompletion } from "@/services/providers/anthropicProvider.js";
import { createOpenAICompletion } from "@/services/providers/openaiProvider.js";
import { Provider, ChatMessage } from "@/types/chat.js";
import ApiError from "@/utils/apiError.util.js";

export async function createCompletion(
  provider: Provider,
  apiKey: string,
  systemPrompt: string,
  messages: ChatMessage[]
) {
  const normalProvider = provider.toLowerCase();

  if (normalProvider === "claude" || normalProvider === "anthropic") {
    return await createClaudeCompletion(apiKey, systemPrompt, messages);
  }

  if (normalProvider === "openai") {
    return await createOpenAICompletion(apiKey, systemPrompt, messages);
  }

  throw new ApiError(400, "Unsupported provider");
}
