import type { Persona } from "@/types/chat";

export const PERSONAS: Record<"hitesh" | "piyush", Persona> = {
  hitesh: {
    id: "hitesh",
    name: "Hitesh Choudhary",
    handle: "Chai aur Code",
    avatarUrl: "https://avatars.githubusercontent.com/u/11613311?v=4",
    accent: "#C2703D",
    greeting: "Haanji! Batao kya seekhna hai — code, career, ya bas chai pe charcha?",
    sub: "Chai aur Code · full stack mentor",
    suggestions: [
      "React seekhna chahiye ya Next.js se start karu?",
      "Job ke liye DSA kitna zaroori hai?",
      "Ek achha backend project idea do",
    ],
  },
  piyush: {
    id: "piyush",
    name: "Piyush Garg",
    handle: "Teachyst · Software Engineer",
    avatarUrl:
      "https://media.licdn.com/dms/image/v2/D5603AQF2sJ8jxYz7aQ/profile-displayphoto-scale_400_400/B56Z6xDO6rJ4Ag-/0/1781086879183?e=1784764800&v=beta&t=EKGw0oYON2YWsGTg7p6LWR9hG-BOpgBeoCMilO_kGRw",
    accent: "#4F6FDE",
    greeting: "Hey, Piyush here. What are you building — and will it scale?",
    sub: "Full stack + system design, no fluff",
    suggestions: [
      "How do I structure a scalable Node.js backend?",
      "Is system design worth it as a fresher?",
      "MongoDB or Postgres for my project?",
    ],
  },
};

export const PERSONA_LIST = Object.values(PERSONAS);
