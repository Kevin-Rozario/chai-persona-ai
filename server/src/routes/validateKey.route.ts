import { Router } from "express";
import { validateKey } from "@/services/keyValidator.js";
import { ValidateKeyRequest, ValidateKeyResponse } from "@/types/chat.js";

const router = Router();

router.post("/validate-key", async (req, res) => {
  const { provider, apiKey } = req.body as ValidateKeyRequest;
  const valid = await validateKey(provider, apiKey);
  const response: ValidateKeyResponse = { valid };
  res.json(response);
});

export default router;
