import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import ChatWindow from "@/components/ChatWindow";
import ApiKeyModal from "@/components/ApiKeyModal";
import { useChat } from "@/hooks/useChat";
import { useTheme } from "@/hooks/useTheme";
import { useApiKey } from "@/hooks/useApiKey";

export default function App() {
  const { persona, activeId, setActiveId, messages, isTyping, sendMessage } = useChat();
  const { theme, toggle: toggleTheme } = useTheme();
  const { provider, status, connect, disconnect } = useApiKey();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);

  const handleSelectPersona = (id: typeof activeId) => {
    setActiveId(id);
    setMobileNavOpen(false);
  };

  return (
    <div className="app-shell">
      <Sidebar
        activeId={activeId}
        onSelect={handleSelectPersona}
        mobileOpen={mobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
        theme={theme}
        onToggleTheme={toggleTheme}
        connectionStatus={status}
        provider={provider}
        onOpenApiKeyModal={() => setApiKeyModalOpen(true)}
      />
      <ChatWindow
        persona={persona}
        messages={messages}
        isTyping={isTyping}
        onSend={sendMessage}
        onOpenMobileNav={() => setMobileNavOpen(true)}
        connected={status === "connected"}
        onBlockedComposerClick={() => setApiKeyModalOpen(true)}
      />
      <ApiKeyModal
        open={apiKeyModalOpen}
        onClose={() => setApiKeyModalOpen(false)}
        status={status}
        provider={provider}
        onConnect={connect}
        onDisconnect={disconnect}
      />
    </div>
  );
}
