export type PersonaId = "hitesh" | "piyush";
export type Provider = "claude" | "openai";
export type MessageRole = "user" | "assistant";

export interface ReferenceItem {
  title: string;
  platform: "youtube" | "cohort" | "udemy" | "website" | "social" | "github";
  type: "series" | "playlist" | "course" | "post" | "handle" | "video" | "repo";
  url: string;
  free: boolean;
}

export interface ChatMessage {
  role: MessageRole;
  text: string;
}

export interface ChatRequest {
  personaId: PersonaId;
  provider: Provider;
  apiKey: string;
  messages: ChatMessage[];
  summary?: string;
}

export interface ValidateKeyRequest {
  provider: Provider;
  apiKey: string;
}

export interface ValidateKeyResponse {
  valid: boolean;
}
