import { validateAnthropicKey } from "@/services/providers/anthropicProvider.js";
import { validateOpenAIKey } from "@/services/providers/openaiProvider.js";
import { Provider } from "@/types/chat.js";

export async function validateKey(provider: Provider, apiKey: string): Promise<boolean> {
  apiKey = apiKey.trim();
  if (!apiKey) return false;

  if (provider.toLowerCase() === "claude") {
    return validateAnthropicKey(apiKey.trim());
  }

  if (provider.toLowerCase() === "openai") {
    return validateOpenAIKey(apiKey.trim());
  }

  return false;
}
