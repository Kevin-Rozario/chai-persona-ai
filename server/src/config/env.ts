import { config } from "dotenv";

config();

export const env = {
  PORT: Number(process.env.PORT) || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  DEV_OPENAI_API_KEY: process.env.OPENAI_API_KEY || undefined,
  DEV_ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || undefined,
};
