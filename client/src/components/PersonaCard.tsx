import type { Persona, PersonaId } from "@/types/chat";

interface PersonaCardProps {
  persona: Persona;
  active: boolean;
  onSelect: (id: PersonaId) => void;
}

function PersonaCard({ persona, active, onSelect }: PersonaCardProps) {
  return (
    <button
      onClick={() => onSelect(persona.id)}
      className={`sidebar-item ${active ? "sidebar-item-active" : ""}`}
      style={{ borderLeft: `3px solid ${active ? `${persona.accent}` : "transparent"}` }}
    >
      <img
        src={persona.avatarUrl}
        alt={persona.name}
        className="avatar"
        style={active ? { boxShadow: `0 0 0 2px ${persona.accent}55` } : undefined}
      />
      <div className="min-w-0 text-left">
        <div className="truncate text-sm font-medium">{persona.name}</div>
        <div className="text-muted truncate text-xs">{persona.handle}</div>
      </div>
    </button>
  );
}

export default PersonaCard;
