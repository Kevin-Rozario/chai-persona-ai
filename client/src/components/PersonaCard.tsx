import type { Persona, PersonaId } from "@/types/chat";

interface PersonaCardProps {
  persona: Persona;
  active: boolean;
  onSelect: (id: PersonaId) => void;
}

export default function PersonaCard({ persona, active, onSelect }: PersonaCardProps) {
  return (
    <button
      onClick={() => onSelect(persona.id)}
      className={`sidebar-item ${active ? "sidebar-item-active" : ""}`}
      style={{ borderLeft: `4px solid ${active ? persona.accent : "transparent"}` }}
    >
      <img src={persona.avatarUrl} alt={persona.name} className="avatar" />
      <div className="min-w-0 text-left">
        <div className="truncate text-sm font-medium">{persona.name}</div>
        <div className="truncate text-xs text-neutral-400">{persona.handle}</div>
      </div>
    </button>
  );
}
