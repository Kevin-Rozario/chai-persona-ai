import { Router } from "express";
import { createCompletion } from "@/services/llmClient.js";
import { summarizeConversation } from "@/services/summarizer.js";
import type { ChatRequest, ChatResponse } from "@/types/chat.js";
import { asyncHandler } from "@/utils/asyncHandler.util.js";
import ApiError from "@/utils/apiError.util.js";
import ApiResponse from "@/utils/apiResponse.util.js";

const router = Router();

router.post(
  "/chat",
  asyncHandler(async (req, res) => {
    const { provider, apiKey, messages, pending, summary } = req.body as ChatRequest;

    if (!provider || !apiKey || !messages?.length) {
      throw new ApiError(400, "Missing provider, key or messages");
    }

    const systemPrompt = summary
      ? `You are a helpful assistant. Keep responses concise.\n\nConversation summary so far:\n${summary}`
      : "You are a helpful assistant. Keep responses concise.";

    const reply = await createCompletion(provider, apiKey, systemPrompt, messages);

    let updatedSummary: string | undefined;
    if (pending && pending.length > 0) {
      updatedSummary = await summarizeConversation(provider, apiKey, summary, pending);
    }

    const response: ChatResponse = { reply, ...(updatedSummary && { summary: updatedSummary }) };

    res.status(200).json(new ApiResponse(200, "Chat completion completed successfully", response));
  })
);

export default router;
