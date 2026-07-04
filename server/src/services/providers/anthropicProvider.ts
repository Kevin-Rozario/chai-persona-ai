import Anthropic from "@anthropic-ai/sdk";
import type { ChatMessage } from "@/types/chat.js";
import ApiError from "@/utils/apiError.util.js";

const CHAT_MODEL = "claude-sonnet-5";

export async function validateAnthropicKey(apiKey: string): Promise<boolean> {
  if (!apiKey || !apiKey.startsWith("sk-ant-")) {
    throw new ApiError(400, "Invalid Anthropic API Key");
  }

  try {
    const client = new Anthropic({ apiKey });
    await client.models.list();
    return true;
  } catch (error) {
    if (error instanceof Anthropic.APIError) {
      throw new ApiError(error.status, error.message);
    }
    throw new ApiError(500, "An unexpected error occurred during Anthropic API key validation")
  }
}

export async function createClaudeCompletion(
  apiKey: string,
  systemPrompt: string,
  messages: ChatMessage[]
): Promise<string> {
  const client = new Anthropic({ apiKey });

  try {
    const response = await client.messages.create({
      model: CHAT_MODEL,
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map((m) => ({ role: m.role as "user" | "assistant", content: m.text })),
    });

    if (response.content && response.content.length > 0) {
      const textBlock = response.content.find((block) => block.type === "text");
      if (textBlock && "text" in textBlock) {
        return textBlock.text;
      }
    }

    return "";
  } catch (error) {
    if (error instanceof Anthropic.APIError) {
      throw new ApiError(error.status, error.message);
    }

    throw new ApiError(500, "An unexpected error occurred during Anthropic API request")
  }
}
