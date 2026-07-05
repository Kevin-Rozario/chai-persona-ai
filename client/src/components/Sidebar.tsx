import { X } from "lucide-react";
import PersonaCard from "@/components/PersonaCard";
import ThemeToggle from "@/components/ThemeToggle";
import ConnectionStatus from "@/components/ConnectionStatus";
import { PERSONA_LIST } from "@/personas/personaMeta";
import type { PersonaId, Provider, ConnectionStatus as Status } from "@/types/chat";

interface SidebarProps {
  activeId: PersonaId;
  onSelect: (id: PersonaId) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  connectionStatus: Status;
  provider: Provider;
  onOpenApiKeyModal: () => void;
}

function Sidebar({
  activeId,
  onSelect,
  mobileOpen,
  onCloseMobile,
  theme,
  onToggleTheme,
  connectionStatus,
  provider,
  onOpenApiKeyModal,
}: SidebarProps) {
  return (
    <aside
      className={`sidebar ${mobileOpen ? "flex" : "hidden"} absolute z-30 h-full md:relative md:flex`}
    >
      <div className="flex items-center justify-between px-5 pt-5 pb-4">
        <span className="text-lg font-semibold">
          <span className="font-semibold text-orange-500">Chai</span>Persona AI
        </span>
        <div className="flex items-center gap-1">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <button className="icon-btn md:hidden" onClick={onCloseMobile}>
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="text-muted mb-1 px-6 text-xs font-medium">Mentors</div>

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

      <div className="border-border mt-auto border-t px-4 py-4">
        <ConnectionStatus
          status={connectionStatus}
          provider={provider}
          onClick={onOpenApiKeyModal}
        />
      </div>
    </aside>
  );
}

export default Sidebar;
