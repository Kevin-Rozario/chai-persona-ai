import OpenAI, { OpenAIError } from "openai";
import type { ChatMessage } from "@/types/chat.js";

const VALIDATION_MODEL = "gpt-4o-mini";
const CHAT_MODEL = "gpt-4o-mini";

export async function validateOpenAIKey(apiKey: string): Promise<boolean> {
  try {
    const client = new OpenAI({ apiKey });
    await client.chat.completions.create({
      model: VALIDATION_MODEL,
      max_tokens: 1,
      messages: [{ role: "user", content: "hi" }],
    });
    return true;
  } catch (error) {
    if (error instanceof OpenAIError) {
      console.error("OpenAI API Error:", error.message);
    } else {
      console.error("Unexpected Error:", error);
    }
    return false;
  }
}

export async function createOpenAICompletion(
  apiKey: string,
  systemPrompt: string,
  messages: ChatMessage[]
): Promise<string> {
  const client = new OpenAI({ apiKey });

  const response = await client.chat.completions.create({
    model: CHAT_MODEL,
    max_tokens: 1024,
    messages: [
      { role: "system", content: systemPrompt },
      ...messages.map((m) => ({ role: m.role, content: m.text }) as const),
    ],
  });

  return response.choices[0]?.message?.content ?? "";
}
