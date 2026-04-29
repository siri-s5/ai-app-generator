import React, { useState, useRef, useEffect } from "react";
import "./PromptForm.css";

const APP_TYPES = [
  { id: "", label: "Auto" },
  { id: "dashboard", label: "Dashboard" },
  { id: "game", label: "Game" },
  { id: "tool", label: "Tool" },
  { id: "calculator", label: "Calc" },
  { id: "form", label: "Form" },
  { id: "landing page", label: "Landing" },
  { id: "quiz", label: "Quiz" },
  { id: "portfolio", label: "Portfolio" },
];

const PLACEHOLDERS = [
  "A todo app with drag-and-drop and priorities...",
  "A Pomodoro timer with breathing guide...",
  "A budget tracker with beautiful charts...",
  "A quiz game about world capitals...",
  "A typing speed test with WPM tracking...",
  "A flashcard app for learning vocabulary...",
  "A habit tracker with streak calendar...",
];

export default function PromptForm({ onGenerate, isGenerating }) {
  const [prompt, setPrompt] = useState("");
  const [appType, setAppType] = useState("");
  const [phIdx, setPhIdx] = useState(0);
  const [phVisible, setPhVisible] = useState(true);
  const textareaRef = useRef(null);

  useEffect(() => {
    const id = setInterval(() => {
      setPhVisible(false);
      setTimeout(() => {
        setPhIdx((i) => (i + 1) % PLACEHOLDERS.length);
        setPhVisible(true);
      }, 400);
    }, 3500);
    return () => clearInterval(id);
  }, []);

  const handleSubmit = () => {
    const trimmed = prompt.trim();
    if (!trimmed || isGenerating) return;
    onGenerate({ prompt: trimmed, appType });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit();
  };

  const useExample = () => {
    setPrompt(PLACEHOLDERS[phIdx].replace("...", ""));
    textareaRef.current?.focus();
  };

  return (
    <div className="prompt-form">
      <div className="form-header">
        <div className="form-eyebrow">
          <span className="eyebrow-line" />
          <span className="eyebrow-text">Describe. Generate. Ship.</span>
          <span className="eyebrow-line" />
        </div>
        <h1 className="form-title">
          Turn any idea into<br />
          <span className="form-title-gradient">a working app.</span>
        </h1>
        <p className="form-subtitle">
          Type your idea below. Get a fully interactive app in seconds.
        </p>
      </div>

      <div className="form-type-row">
        {APP_TYPES.map((t) => (
          <button
            key={t.id}
            className={`type-chip ${appType === t.id ? "active" : ""}`}
            onClick={() => setAppType(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="form-input-wrap">
        <textarea
          ref={textareaRef}
          className="form-textarea"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={phVisible ? PLACEHOLDERS[phIdx] : ""}
          rows={4}
          maxLength={500}
          disabled={isGenerating}
        />
        <div className="form-input-footer">
          <button className="example-btn" onClick={useExample} disabled={isGenerating}>
            ↺ Use this example
          </button>
          <span className="char-count">{prompt.length}/500</span>
        </div>
      </div>

      <button
        className={`generate-btn ${isGenerating ? "loading" : ""}`}
        onClick={handleSubmit}
        disabled={!prompt.trim() || isGenerating}
      >
        {isGenerating ? (
          <>
            <span className="btn-spinner" />
            Generating your app...
          </>
        ) : (
          <>
            <span className="btn-icon-wrap">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1L10.5 6H15L11 9.5L12.5 15L8 12L3.5 15L5 9.5L1 6H5.5L8 1Z" fill="currentColor"/>
              </svg>
            </span>
            Generate App
            <span className="btn-hint">⌘↵</span>
          </>
        )}
      </button>
    </div>
  );
}
