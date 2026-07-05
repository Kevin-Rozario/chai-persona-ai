import type { ReferenceItem } from "@/types/chat";

interface StreamCallbacks {
  onToken: (value: string) => void;
  onReferences: (value: ReferenceItem[]) => void;
  onSummary: (value: string) => void;
  onDone: () => void;
  onError: (message: string) => void;
}

export async function streamChat(
  url: string,
  body: unknown,
  callbacks: StreamCallbacks,
): Promise<void> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok || !res.body) {
    callbacks.onError("Failed to reach server.");
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split("\n\n");
    buffer = parts.pop() ?? "";

    for (const part of parts) {
      if (!part.trim()) continue;

      const lines = part.split("\n");
      const eventLine = lines.find((l) => l.startsWith("event:"));
      const dataLine = lines.find((l) => l.startsWith("data:"));
      if (!eventLine || !dataLine) continue;

      const eventName = eventLine.replace("event:", "").trim();
      const data = JSON.parse(dataLine.replace("data:", "").trim());

      switch (eventName) {
        case "token":
          callbacks.onToken(data.value);
          break;
        case "references":
          callbacks.onReferences(data.value);
          break;
        case "summary":
          callbacks.onSummary(data.value);
          break;
        case "done":
          callbacks.onDone();
          break;
        case "error":
          callbacks.onError(data.message);
          break;
      }
    }
  }
}
