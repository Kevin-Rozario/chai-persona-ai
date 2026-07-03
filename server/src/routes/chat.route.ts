import { Router } from "express";
import { createCompletion } from "@/services/llmClient.js";
import type { ChatRequest } from "@/types/chat.js";

const router = Router();

router.post("/chat", async (req, res) => {
  const { provider, apiKey, messages } = req.body as ChatRequest;

  if (!provider || !apiKey || !messages?.length) {
    return res.status(400).json({ error: "Missing provider, apiKey, or messages" });
  }

  try {
    const systemPrompt = "You are a helpful assistant. Keep responses concise.";
    const reply = await createCompletion(provider, apiKey, systemPrompt, messages);
    res.json({ reply });
  } catch (err) {
    console.error("Chat completion failed:", err);
    res.status(500).json({ error: "Failed to get a response from the model." });
  }
});

export default router;
