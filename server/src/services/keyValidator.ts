import { validateAnthropicKey } from "@/services/providers/anthropicProvider.js";
import { validateOpenAIKey } from "@/services/providers/openaiProvider.js";
import { Provider } from "@/types/chat.js";
import ApiError from "@/utils/apiError.util.js";

export async function validateKey(provider: Provider, apiKey: string): Promise<boolean> {
  const sanitizedKey = apiKey.trim();

  if (!sanitizedKey) {
    throw new ApiError(400, "API key is required");
  }

  const normalProvider = provider.toLowerCase();

  if (normalProvider === "claude" || normalProvider === "anthropic") {
    return validateAnthropicKey(sanitizedKey);
  }

  if (normalProvider === "openai") {
    return validateOpenAIKey(sanitizedKey);
  }

  throw new ApiError(400, "Unsupported provider");
}
