export type PersonaId = "hitesh" | "piyush";
export type MessageRole = "user" | "assistant";

export interface ReferenceItem {
  title: string;
  platform: "youtube" | "cohort" | "udemy" | "website" | "social" | "github";
  type: "series" | "playlist" | "course" | "post" | "handle" | "video" | "repo";
  url: string;
  free: boolean;
}

export interface Message {
  id: string;
  role: MessageRole;
  text: string;
  timestamp: number;
  personaId: PersonaId;
  references?: ReferenceItem[];
  isStreaming?: boolean;
}

export interface Persona {
  id: PersonaId;
  name: string;
  handle: string;
  avatarUrl: string;
  accent: string;
  greeting: string;
  sub: string;
  suggestions: string[];
}

export interface ChatRequest {
  personaId: PersonaId;
  messages: Pick<Message, "role" | "text">[];
  summary?: string;
}

export type StreamEvent =
  | { type: "token"; value: string }
  | { type: "references"; value: ReferenceItem[] }
  | { type: "summary"; value: string }
  | { type: "done" }
  | { type: "error"; message: string };
