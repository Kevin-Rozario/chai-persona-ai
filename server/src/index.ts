import express from "express";
import cors from "cors";
import { env } from "@/config/env.js";
import chatRoute from "@/routes/chat.route.js";
import validateKeyRoute from "@/routes/validateKey.route.js";

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", chatRoute);
app.use("/api", validateKeyRoute);

app.listen(env.port, () => {
  console.log(`Server running on http://localhost:${env.port}`);
});
