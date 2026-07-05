import { Router } from "express";
import { validateKey } from "../services/keyValidator.js";
import { ValidateKeyRequest, ValidateKeyResponse } from "../types/chat.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import ApiError from "../utils/apiError.util.js";
import ApiResponse from "../utils/apiResponse.util.js";

const router = Router();

router.post(
  "/validate-key",
  asyncHandler(async (req, res) => {
    const { provider, apiKey } = req.body as ValidateKeyRequest;

    if (!provider || !apiKey) {
      throw new ApiError(400, "All fields are required");
    }

    const valid = await validateKey(provider, apiKey);

    if (!valid) {
      throw new ApiError(401, "The provided API key is invalid or has expired");
    }

    const response: ValidateKeyResponse = { valid };
    res.status(200).json(new ApiResponse(200, "API key is validated successfully", response));
  })
);

export default router;
