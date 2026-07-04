import { HITESH_SYSTEM_PROMPT } from "@/personas/hitesh.prompt.js";
import { PIYUSH_SYSTEM_PROMPT } from "@/personas/piyush.prompt.js";
import { HITESH_CATALOG } from "@/personas/hitesh.catalog.js";
import { PIYUSH_CATALOG } from "@/personas/piyush.catalog.js";
import type { PersonaId, ReferenceItem} from "@/types/chat.js";

export const PROMPTS: Record<PersonaId, string> = {
  hitesh: HITESH_SYSTEM_PROMPT,
  piyush: PIYUSH_SYSTEM_PROMPT,
};

export const CATALOGS: Record<PersonaId, ReferenceItem[]> = {
  hitesh: HITESH_CATALOG,
  piyush: PIYUSH_CATALOG,
};

export function getPersonaPrompt(personaId: PersonaId): string {
  return PROMPTS[personaId];
}

export function getPersonaCatalog(personaId: PersonaId): ReferenceItem[] {
  return CATALOGS[personaId];
}
