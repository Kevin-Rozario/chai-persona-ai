import { useState } from "react";
import { Send, KeyRound } from "lucide-react";
import type { Persona } from "@/types/chat";

interface ComposerProps {
  persona: Persona;
  onSend: (text: string) => void;
  disabled: boolean;
  connected: boolean;
  onBlockedClick: () => void;
}

function Composer({ persona, onSend, disabled, connected, onBlockedClick }: ComposerProps) {
  const [value, setValue] = useState("");

  const handleSend = () => {
    if (!connected) return onBlockedClick();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  };

  if (!connected) {
    return (
      <div className="px-6 pt-3 pb-5">
        <button
          onClick={onBlockedClick}
          className="composer-box text-muted hover:text-ink mx-auto w-full max-w-2xl justify-center"
        >
          <KeyRound size={14} />
          <span className="text-sm">Connect an API key to start chatting</span>
        </button>
      </div>
    );
  }

  return (
    <div className="px-6 pt-3 pb-5">
      <div className="composer-box mx-auto max-w-2xl">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder={`Message ${persona.name.split(" ")[0]}…`}
          rows={1}
          className="max-h-32 flex-1 resize-none bg-transparent px-2 py-1.5 text-sm outline-none"
        />
        <button
          onClick={handleSend}
          disabled={!value.trim() || disabled}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white transition-opacity disabled:opacity-30"
          style={{ background: persona.accent }}
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}

export default Composer;
