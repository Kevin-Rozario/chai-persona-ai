import Anthropic, { AnthropicError } from "@anthropic-ai/sdk";
import type { ChatMessage } from "@/types/chat.js";

const VALIDATION_MODEL = "";
const CHAT_MODEL = "";

export async function validateAnthropicKey(apiKey: string): Promise<boolean> {
  try {
    const client = new Anthropic({ apiKey });
    await client.messages.create({
      model: VALIDATION_MODEL,
      max_tokens: 1,
      messages: [{ role: "user", content: "hi" }],
    });

    return true;
  } catch (error) {
    if (error instanceof AnthropicError) {
      console.error("Anthropic API Error:", error.message);
    } else {
      console.error("Unexpected Error:", error);
    }
    return false;
  }
}

export async function createClaudeCompletion(
  apiKey: string,
  systemPrompt: string,
  messages: ChatMessage[]
): Promise<string> {
  const client = new Anthropic({ apiKey });

  const response = await client.messages.create({
    model: CHAT_MODEL,
    max_tokens: 1024,
    system: systemPrompt,
    messages: messages.map((m) => ({ role: m.role, content: m.text })),
  });

  const textBlock = response.content.find((block) => block.type === "text");
  return textBlock?.type === "text" ? textBlock.text : "";
}
