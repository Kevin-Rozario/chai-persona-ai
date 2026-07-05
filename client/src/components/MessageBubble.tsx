import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ReferenceCard from "@/components/ReferenceCard";
import type { Message, Persona } from "@/types/chat";

interface MessageBubbleProps {
  message: Message & { showAvatar?: boolean };
  persona: Persona;
}

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function MessageBubble({ message, persona }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={`msg-row flex gap-2.5 ${isUser ? "flex-row-reverse" : ""} ${message.showAvatar ? "mt-3" : "mt-0.5"}`}
    >
      <div className="w-7 shrink-0">
        {!isUser && message.showAvatar && (
          <img src={persona.avatarUrl} alt="" className="avatar-sm" />
        )}
      </div>
      <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`bubble ${isUser ? "bubble-user" : "bubble-assistant"} prose prose-sm dark:prose-invert max-w-none`}
          style={!isUser ? { borderLeft: `3px solid ${persona.accent}` } : undefined}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.text}</ReactMarkdown>
          {message.isStreaming && (
            <span className="ml-0.5 inline-block h-4 w-[2px] animate-pulse bg-current align-middle" />
          )}
        </div>
        <div className="flex w-full flex-wrap items-center justify-evenly">
          {message.references?.map((ref) => (
            <ReferenceCard key={ref.url} reference={ref} persona={persona} />
          ))}
        </div>
        <span className="ts-reveal text-muted mt-1 px-1 text-[10px]">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}

export default MessageBubble;
