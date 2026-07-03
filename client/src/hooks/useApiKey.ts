import { useState, useEffect, useCallback } from "react";
import type { Provider, ConnectionStatus } from "../types/chat";

const STORAGE_KEY = "chai-persona-ai-credentials";

interface StoredCredentials {
  provider: Provider;
  apiKey: string;
}

async function validateKeyRequest(provider: Provider, apiKey: string): Promise<boolean> {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/validate-key`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ provider, apiKey }),
  });
  return response.json().then((data) => data.valid);
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

    const isValid = await validateKeyRequest(nextProvider, trimmed);

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
