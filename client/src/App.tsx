import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import ChatWindow from "@/components/ChatWindow";
import { useChat } from "@/hooks/useChat";

export default function App() {
  const { persona, activeId, setActiveId, messages, isTyping, sendMessage } = useChat();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

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
      />
      <ChatWindow
        persona={persona}
        messages={messages}
        isTyping={isTyping}
        onSend={sendMessage}
        onOpenMobileNav={() => setMobileNavOpen(true)}
      />
    </div>
  );
}
