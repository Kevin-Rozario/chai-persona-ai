import { Circle } from "lucide-react";
import type { ConnectionStatus as Status, Provider } from "../types/chat";

const LABEL: Record<Status, string> = {
  idle: "Connect API key",
  validating: "Validating…",
  connected: "Connected",
  invalid: "Invalid key",
  error: "Connection error",
};

const DOT_COLOR: Record<Status, string> = {
  idle: "text-muted",
  validating: "text-accent",
  connected: "text-accent",
  invalid: "text-red-500",
  error: "text-red-500",
};

function ConnectionStatus({
  status,
  provider,
  onClick,
}: {
  status: Status;
  provider: Provider;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`status-pill ${status === "connected" ? "status-pill-connected" : ""}`}
    >
      <Circle size={7} className={`${DOT_COLOR[status]} fill-current`} />
      <span>
        {status === "connected"
          ? provider === "claude"
            ? "Claude connected"
            : "OpenAI connected"
          : LABEL[status]}
      </span>
    </button>
  );
}

export default ConnectionStatus;
