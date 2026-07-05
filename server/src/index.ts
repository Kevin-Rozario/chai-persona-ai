import express from "express";
import cors from "cors";
import { env } from "@/config/env.js";
import { globalErrorHandler } from "@/middlewares/error.middleware.js";
import chatRoute from "@/routes/chat.route.js";
import validateKeyRoute from "@/routes/validateKey.route.js";
import ApiResponse from "@/utils/apiResponse.util.js";

const app = express();

app.use(cors({ origin: env.CLIENT_ORIGIN }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json(new ApiResponse(200, "Server is running", {}));
});

app.use("/api/v1", chatRoute);
app.use("/api/v1", validateKeyRoute);
app.use(globalErrorHandler);

app.listen(env.PORT, () => {
  console.log(`Server running on http://localhost:${env.PORT}`);
});
