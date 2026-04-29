// API key comes from env var — set VITE_GROK_API_KEY in your .env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

export async function generateAppStream({ prompt, appType, onChunk, onDone, onError }) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/generate/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        appType,
      }),
    });

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      onError(`API Error ${response.status}: ${errBody.error || response.statusText}`);
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.text) {
              onChunk(data.text);
            } else if (data.done) {
              onDone();
              return;
            } else if (data.error) {
              onError(data.error);
              return;
            }
          } catch (e) {
            // Ignore parsing errors for incomplete chunks
          }
        }
      }
    }
  } catch (err) {
    console.error("Generation error:", err);
    onError("Network error. Please check your connection and try again.");
  }
}
