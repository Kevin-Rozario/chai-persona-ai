import { useState, useEffect, useCallback } from "react";
import type { Provider, ConnectionStatus } from "../types/chat";

const STORAGE_KEY = "persona-ai-credentials";

interface StoredCredentials {
  provider: Provider;
  apiKey: string;
}

// Mock validator — replace with a fetch to POST /api/validate-key once
// the server route exists. Server makes one lightweight call to the
// provider using this key and returns { valid: boolean }.
async function mockValidateKey(provider: Provider, apiKey: string): Promise<boolean> {
  await new Promise((r) => setTimeout(r, 900));
  const prefixOk = provider === "claude" ? apiKey.startsWith("sk-ant-") : apiKey.startsWith("sk-");
  return prefixOk && apiKey.length > 20;
}

export function useApiKey() {
  const [provider, setProvider] = useState<Provider>("claude");
  const [apiKey, setApiKey] = useState("");
  const [status, setStatus] = useState<ConnectionStatus>("idle");

  useEffect(() => {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const saved: StoredCredentials = JSON.parse(raw);
    setProvider(saved.provider);
    setApiKey(saved.apiKey);
    setStatus("connected");
  }, []);

  const connect = useCallback(async (nextProvider: Provider, nextKey: string) => {
    const trimmed = nextKey.trim();
    if (!trimmed) return;
    setStatus("validating");

    const isValid = await mockValidateKey(nextProvider, trimmed);

    if (isValid) {
      setProvider(nextProvider);
      setApiKey(trimmed);
      setStatus("connected");
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ provider: nextProvider, apiKey: trimmed }),
      );
    } else {
      setStatus("invalid");
    }
  }, []);

  const disconnect = useCallback(() => {
    setApiKey("");
    setStatus("idle");
    sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  return { provider, apiKey, status, connect, disconnect };
}
