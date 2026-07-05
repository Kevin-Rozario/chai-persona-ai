import { useState } from "react";
import { X, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle, KeyRound } from "lucide-react";
import type { Provider, ConnectionStatus } from "../types/chat";

interface ApiKeyModalProps {
  open: boolean;
  onClose: () => void;
  status: ConnectionStatus;
  provider: Provider;
  onConnect: (provider: Provider, key: string) => void;
  onDisconnect: () => void;
}

function ApiKeyModal({
  open,
  onClose,
  status,
  provider,
  onConnect,
  onDisconnect,
}: ApiKeyModalProps) {
  const [selectedProvider, setSelectedProvider] = useState<Provider>(provider);
  const [key, setKey] = useState("");
  const [showKey, setShowKey] = useState(false);

  if (!open) return null;

  const handleConnect = () => {
    if (!key.trim()) return;
    onConnect(selectedProvider, key);
  };

  const isConnected = status === "connected";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-accent/10 text-accent flex h-8 w-8 items-center justify-center rounded-lg">
              <KeyRound size={15} />
            </div>
            <h2 className="text-base font-semibold">
              {isConnected ? "API key connected" : "Connect your API key"}
            </h2>
          </div>
          <button onClick={onClose} className="icon-btn">
            <X size={16} />
          </button>
        </div>

        {isConnected ? (
          <>
            <p className="text-accent mb-4 flex items-center gap-1.5 text-xs">
              <CheckCircle2 size={13} />
              Connected to {provider === "claude" ? "Claude" : "OpenAI"} - key stored for this
              session only.
            </p>
            <button onClick={onDisconnect} className="btn-accent">
              Disconnect
            </button>
          </>
        ) : (
          <>
            <div className="mb-4 flex gap-2">
              <button
                className={`provider-tab ${selectedProvider === "openai" ? "provider-tab-active" : ""}`}
                onClick={() => setSelectedProvider("openai")}
              >
                OpenAI
              </button>
              <button
                className={`provider-tab ${selectedProvider === "claude" ? "provider-tab-active" : ""}`}
                onClick={() => setSelectedProvider("claude")}
              >
                Claude
              </button>
            </div>

            <label className="text-muted mb-1.5 block text-xs">
              {selectedProvider === "claude" ? "Anthropic API key" : "OpenAI API key"}
            </label>
            <div className="relative mb-2">
              <input
                type={showKey ? "text" : "password"}
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder={selectedProvider === "claude" ? "sk-ant-…" : "sk-…"}
                className="field-input pr-9"
              />
              <button
                onClick={() => setShowKey((s) => !s)}
                className="text-muted absolute top-1/2 right-2.5 -translate-y-1/2"
              >
                {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>

            {status === "invalid" && (
              <p className="mb-2 flex items-center gap-1.5 text-xs text-red-500">
                <AlertCircle size={13} /> That key didn't validate. Check and try again.
              </p>
            )}

            <button
              onClick={handleConnect}
              disabled={status === "validating" || !key.trim()}
              className="btn-accent"
            >
              {status === "validating" && <Loader2 size={14} className="animate-spin" />}
              {status === "validating" ? "Validating…" : "Connect"}
            </button>
          </>
        )}

        <p className="text-muted mt-3 text-[11px] leading-relaxed">
          Your key is only used to validate the connection and is kept in this browser session -
          never stored on our servers.
        </p>
      </div>
    </div>
  );
}

export default ApiKeyModal;
