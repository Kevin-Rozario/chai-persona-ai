import { useEffect, useRef } from "react";
import { Menu } from "lucide-react";
import MessageBubble from "@/components/MessageBubble";
import TypingIndicator from "@/components/TypingIndicator";
import Composer from "@/components/Composer";
import type { Persona, Message } from "@/types/chat";

interface ChatWindowProps {
  persona: Persona;
  messages: Message[];
  isTyping: boolean;
  onSend: (text: string) => void;
  onOpenMobileNav: () => void;
  connected: boolean;
  onBlockedComposerClick: () => void;
}

function ChatWindow({
  persona,
  messages,
  isTyping,
  onSend,
  onOpenMobileNav,
  connected,
  onBlockedComposerClick,
}: ChatWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, isTyping]);

  const grouped = messages.map((m, i) => ({
    ...m,
    showAvatar: i === 0 || messages[i - 1].role !== m.role,
  }));

  return (
    <main className="flex min-w-0 flex-1 flex-col">
      <header className="chat-header">
        <button className="icon-btn md:hidden" onClick={onOpenMobileNav}>
          <Menu size={16} />
        </button>
        <img src={persona.avatarUrl} alt={persona.name} className="avatar-sm" />
        <div className="min-w-0">
          <div className="text-sm leading-tight font-medium">{persona.name}</div>
          <div className="text-muted text-xs">{isTyping ? "typing…" : "online"}</div>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <EmptyState
            persona={persona}
            connected={connected}
            onSuggestionClick={onSend}
            onBlockedClick={onBlockedComposerClick}
          />
        ) : (
          <div className="mx-auto flex w-full max-w-2xl flex-col gap-1 px-6 py-6">
            {grouped.map((m) => (
              <MessageBubble key={m.id} message={m} persona={persona} />
            ))}
            {isTyping && <TypingIndicator persona={persona} />}
          </div>
        )}
      </div>

      <Composer
        persona={persona}
        onSend={onSend}
        disabled={isTyping}
        connected={connected}
        onBlockedClick={onBlockedComposerClick}
      />
    </main>
  );
}

function EmptyState({
  persona,
  connected,
  onSuggestionClick,
  onBlockedClick,
}: {
  persona: Persona;
  connected: boolean;
  onSuggestionClick: (text: string) => void;
  onBlockedClick: () => void;
}) {
  const handleClick = (s: string) => (connected ? onSuggestionClick(s) : onBlockedClick());

  return (
    <div className="flex h-full flex-col items-center justify-center gap-5 px-6 text-center">
      <img src={persona.avatarUrl} alt={persona.name} className="h-16 w-16 rounded-full" />
      <div className="max-w-sm">
        <p className="text-lg leading-snug font-medium">{persona.greeting}</p>
        <p className="text-muted mt-2 text-xs">{persona.sub}</p>
      </div>
      <div className="flex w-full max-w-sm flex-col gap-2">
        {persona.suggestions.map((s) => (
          <button key={s} onClick={() => handleClick(s)} className="suggestion-chip">
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ChatWindow;
