import type { Persona } from "@/types/chat";

export const PERSONAS: Record<"hitesh" | "piyush", Persona> = {
  hitesh: {
    id: "hitesh",
    name: "Hitesh Choudhary",
    handle: "Chai aur Code",
    avatarUrl:
      "https://api.dicebear.com/9.x/notionists/svg?seed=hitesh-choudhary&backgroundColor=fde9d9",
    accent: "#C2703D",
    greeting: "Haan ji! Batao aaj kya seekhna hai — code, career, ya bas chai pe charcha?",
    sub: "Full stack mentor · Hinglish teaching style",
    suggestions: [
      "React seekhna chahiye ya Next.js se start karu?",
      "Job ke liye DSA kitna zaroori hai?",
      "Ek achha backend project idea do",
    ],
  },
  piyush: {
    id: "piyush",
    name: "Piyush Garg",
    handle: "Building in public",
    avatarUrl:
      "https://api.dicebear.com/9.x/notionists/svg?seed=piyush-garg&backgroundColor=dbe4fe",
    accent: "#4F55C4",
    greeting: "Hey, Piyush here. What are you building — and will it actually scale?",
    sub: "Software engineer · System design focus",
    suggestions: [
      "How do I structure a scalable Node.js backend?",
      "Is system design worth it as a fresher?",
      "What's your actual stack for shipping fast?",
    ],
  },
};

export const PERSONA_LIST = Object.values(PERSONAS);
