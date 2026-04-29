import { useState, useRef, useCallback } from "react";
import { generateAppStream } from "../lib/api";

export function useGenerator() {
  const [status, setStatus] = useState("idle"); // idle | generating | done | error
  const [html, setHtml] = useState("");
  const [error, setError] = useState("");
  const [charCount, setCharCount] = useState(0);
  const abortRef = useRef(false);

  const generate = useCallback(async ({ prompt, appType }) => {
    abortRef.current = false;
    setStatus("generating");
    setHtml("");
    setError("");
    setCharCount(0);

    let accumulated = "";

    await generateAppStream({
      prompt,
      appType,
      onChunk: (text) => {
        if (abortRef.current) return;
        accumulated += text;
        setHtml(accumulated);
        setCharCount(accumulated.length);
      },
      onDone: () => {
        if (!abortRef.current) setStatus("done");
      },
      onError: (msg) => {
        setError(msg);
        setStatus("error");
      },
    });
  }, []);

  const reset = useCallback(() => {
    abortRef.current = true;
    setStatus("idle");
    setHtml("");
    setError("");
    setCharCount(0);
  }, []);

  return { status, html, error, charCount, generate, reset };
}
