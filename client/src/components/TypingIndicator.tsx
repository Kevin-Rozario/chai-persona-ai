import type { Persona } from "@/types/chat";

function TypingIndicator({ persona }: { persona: Persona }) {
  return (
    <div className="mt-3 flex gap-2.5">
      <img src={persona.avatarUrl} alt="" className="avatar-sm" />
      <div className="bubble bubble-assistant flex items-center gap-1.5 py-3">
        {[0, 1, 2].map((d) => (
          <span
            key={d}
            className="bg-muted h-1.5 w-1.5 animate-bounce rounded-full"
            style={{ animationDelay: `${d * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}

export default TypingIndicator;
