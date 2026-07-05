import { Router } from "express";
import { env } from "@/config/env.js";
import { streamCompletion } from "@/services/llmClient.js";
import { summarizeConversation } from "@/services/summarizer.js";
import { matchContent } from "@/services/contentMatcher.js";
import { getPersonaPrompt, getPersonaCatalog } from "@/personas/index.js";
import { asyncHandler } from "@/utils/asyncHandler.util.js";
import { initSSE, writeSSEEvent, endSSE } from "@/services/streamHandler.js";
import ApiError from "@/utils/apiError.util.js";
import type { ChatRequest, ReferenceItem } from "@/types/chat.js";

const router = Router();

function formatReferencesBlock(references: ReferenceItem[]): string {
  const lines = references.map(
    (ref) => `- "${ref.title}" (${ref.platform}, ${ref.free ? "free" : "paid"})`
  );

  return `\n\nRelevant content for this turn — mention naturally if it fits, otherwise ignore:\n${lines.join("\n")}`;
}

router.post(
  "/chat",
  asyncHandler(async (req, res) => {
    const {
      personaId,
      provider,
      apiKey: clientKey,
      messages,
      pending,
      summary,
    } = req.body as ChatRequest;
    const apiKey =
      clientKey || (provider === "openai" ? env.DEV_OPENAI_API_KEY : env.DEV_ANTHROPIC_API_KEY);

    if (!personaId || !provider || !apiKey || !messages?.length) {
      throw new ApiError(400, "Missing personaId, provider, key or messages");
    }

    const basePrompt = getPersonaPrompt(personaId);
    const catalog = getPersonaCatalog(personaId);
    const lastUserMessage = messages[messages.length - 1]?.text ?? "";
    const matched = matchContent(lastUserMessage, catalog);

    let systemPrompt = basePrompt;
    if (summary) {
      systemPrompt += `\n\nConversation summary so far:\n${summary}`;
    }

    if (matched.length > 0) {
      systemPrompt += formatReferencesBlock(matched);
    }

    initSSE(res);

    try {
      for await (const token of streamCompletion(provider, apiKey, systemPrompt, messages)) {
        writeSSEEvent(res, "token", { value: token });
      }

      if (matched.length > 0) {
        writeSSEEvent(res, "references", { value: matched });
      }

      if (pending && pending.length > 0) {
        try {
          const updatedSummary = await summarizeConversation(provider, apiKey, summary, pending);
          writeSSEEvent(res, "summary", { value: updatedSummary });
        } catch (summaryErr) {
          console.error("Summarization failed, continuing without it:", summaryErr);
        }
      }

      writeSSEEvent(res, "done", {});
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : "Streaming failed. Please try again.";
      writeSSEEvent(res, "error", { message });
    } finally {
      endSSE(res);
    }
  })
);

export default router;
