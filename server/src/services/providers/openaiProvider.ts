import OpenAI from "openai";
import type { ChatMessage } from "@/types/chat.js";
import ApiError from "@/utils/apiError.util.js";

const CHAT_MODEL = "gpt-4o";

export async function validateOpenAIKey(apiKey: string): Promise<boolean> {
  if (!apiKey || !apiKey.startsWith("sk-")) {
    throw new ApiError(400, "Invalid OpenAI API Key");
  }

  try {
    const client = new OpenAI({ apiKey });
    await client.models.list();
    return true;
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      throw new ApiError(error.status, error.message);
    }

    throw new ApiError(500, "An unexpected error occurred during OpenAI API key validation");
  }
}

export async function createOpenAICompletion(
  apiKey: string,
  systemPrompt: string,
  messages: ChatMessage[]
): Promise<string> {
  const client = new OpenAI({ apiKey });

  try {
    const response = await client.chat.completions.create({
      model: CHAT_MODEL,
      max_tokens: 1024,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map((m) => ({ role: m.role, content: m.text }) as const),
      ],
    });

    return response.choices[0]?.message?.content ?? "";
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      throw new ApiError(error.status, error.message);
    }

    throw new ApiError(500, "An unexpected error occurred during OpenAI API request");
  }
}

export async function* streamOpenAICompletion(
  apiKey: string,
  systemPrompt: string,
  messages: ChatMessage[]
): AsyncGenerator<string> {
  const client = new OpenAI({ apiKey });

  try {
    const stream = await client.chat.completions.create({
      model: CHAT_MODEL,
      max_tokens: 1024,
      stream: true,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map((m) => ({ role: m.role, content: m.text }) as const),
      ],
    });

    for await (const chunk of stream) {
      const token = chunk.choices[0]?.delta?.content;
      if (token) yield token;
    }
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      throw new ApiError(error.status, error.message);
    }

    throw new ApiError(500, "An unexpected error occurred during OpenAI streaming request");
  }
}
