import { Router } from "express";
import { createCompletion } from "@/services/llmClient.js";
import { summarizeConversation } from "@/services/summarizer.js";
import { matchContent } from "@/services/contentMatcher.js";
import { getPersonaPrompt, getPersonaCatalog } from "@/personas/index.js";
import { asyncHandler } from "@/utils/asyncHandler.util.js";
import ApiError from "@/utils/apiError.util.js";
import ApiResponse from "@/utils/apiResponse.util.js";
import type { ChatRequest, ChatResponse, ReferenceItem } from "@/types/chat.js";

const router = Router();

function formatReferencesBlock(references: ReferenceItem[]): string {
  const lines = references.map(
    (ref) => `- "${ref.title}" (${ref.platform}, ${ref.free ? "free" : "paid"})`
  );

  return `\n\nRelevant content for this turn - mention naturally if it fits, otherwise ignore:\n${lines.join("\n")}`;
}

router.post(
  "/chat",
  asyncHandler(async (req, res) => {
    const { personaId, provider, apiKey, messages, pending, summary } = req.body as ChatRequest;

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

    const reply = await createCompletion(provider, apiKey, systemPrompt, messages);

    let updatedSummary: string | undefined;
    if (pending && pending.length > 0) {
      updatedSummary = await summarizeConversation(provider, apiKey, summary, pending);
    }

    const response: ChatResponse & { references?: ReferenceItem[] } = {
      reply,
      ...(updatedSummary && { summary: updatedSummary }),
      ...(matched.length > 0 && { references: matched }),
    };

    res.status(200).json(new ApiResponse(200, "Chat completion completed successfully", response));
  })
);

export default router;
