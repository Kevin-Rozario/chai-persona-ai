import { X } from "lucide-react";
import PersonaCard from "@/components/PersonaCard";
import { PERSONA_LIST } from "@/personas/personaMeta";
import type { PersonaId } from "@/types/chat";

interface SidebarProps {
  activeId: PersonaId;
  onSelect: (id: PersonaId) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export default function Sidebar({ activeId, onSelect, mobileOpen, onCloseMobile }: SidebarProps) {
  return (
    <aside
      className={`sidebar ${mobileOpen ? "flex" : "hidden"} absolute z-30 h-full md:relative md:flex`}
    >
      <div className="flex items-center justify-between px-5 pt-5 pb-4">
        <span className="text-xl font-semibold">
          {" "}
          <span className="text-orange-400">Chai</span>Persona AI
        </span>
        <button className="rounded-lg p-1.5 hover:bg-neutral-100 md:hidden" onClick={onCloseMobile}>
          <X size={16} />
        </button>
      </div>

      <div className="mb-2 px-5 text-sm font-medium text-neutral-400">Mentors</div>

      <div className="flex flex-col gap-1">
        {PERSONA_LIST.map((persona) => (
          <PersonaCard
            key={persona.id}
            persona={persona}
            active={persona.id === activeId}
            onSelect={onSelect}
          />
        ))}
      </div>

      <div className="mt-auto px-6 py-4 text-xs leading-relaxed text-neutral-400">
        Each mentor keeps a separate conversation.
      </div>
    </aside>
  );
}
