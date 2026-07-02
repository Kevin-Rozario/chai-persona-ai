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
}

export default function ChatWindow({
  persona,
  messages,
  isTyping,
  onSend,
  onOpenMobileNav,
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
    <main className="flex min-w-0 flex-1 flex-col bg-white">
      <header className="chat-header">
        <button
          className="rounded-lg p-1.5 hover:bg-neutral-100 md:hidden"
          onClick={onOpenMobileNav}
        >
          <Menu size={16} />
        </button>
        <img src={persona.avatarUrl} alt={persona.name} className="avatar-sm" />
        <div className="min-w-0">
          <div className="text-sm leading-tight font-medium">{persona.name}</div>
          <div className="text-xs text-neutral-400">{isTyping ? "typing…" : "online"}</div>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <EmptyState persona={persona} onSuggestionClick={onSend} />
        ) : (
          <div className="mx-auto flex w-full max-w-2xl flex-col gap-1 px-6 py-6">
            {grouped.map((m) => (
              <MessageBubble key={m.id} message={m} persona={persona} />
            ))}
            {isTyping && <TypingIndicator persona={persona} />}
          </div>
        )}
      </div>

      <Composer persona={persona} onSend={onSend} disabled={isTyping} />
    </main>
  );
}

function EmptyState({
  persona,
  onSuggestionClick,
}: {
  persona: Persona;
  onSuggestionClick: (text: string) => void;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-5 px-6 text-center">
      <img src={persona.avatarUrl} alt={persona.name} className="h-16 w-16 rounded-full" />
      <div className="max-w-sm">
        <p className="text-lg leading-snug font-medium">{persona.greeting}</p>
        <p className="mt-2 text-xs text-neutral-400">{persona.sub}</p>
      </div>
      <div className="flex w-full max-w-sm flex-col gap-2">
        {persona.suggestions.map((s) => (
          <button key={s} onClick={() => onSuggestionClick(s)} className="suggestion-chip">
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
