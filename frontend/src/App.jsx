import React from "react";
import Header from "./components/Header";
import PromptForm from "./components/PromptForm";
import Preview from "./components/Preview";
import { useGenerator } from "./hooks/useGenerator";
import "./App.css";

export default function App() {
  const { status, html, error, charCount, generate, reset } = useGenerator();

  const isIdle = status === "idle";
  const isGenerating = status === "generating";
  const isDone = status === "done";
  const isError = status === "error";
  const showSplit = isGenerating || isDone || isError;

  return (
    <div className="app">
      <div className="grid-lines" />
      <Header />

      <div className={`app-body ${showSplit ? "split" : "centered"}`}>
        <div className="app-left">
          {isIdle ? (
            <>
              <PromptForm onGenerate={generate} isGenerating={false} />
              <Examples onGenerate={generate} />
            </>
          ) : (
            <div className="regenerate-panel">
              <PromptForm onGenerate={generate} isGenerating={isGenerating} />
              {isError && (
                <div className="error-banner">
                  <span>⚠</span> {error}
                </div>
              )}
            </div>
          )}
        </div>

        {showSplit && (
          <div className="app-right">
            <Preview
              html={html}
              status={status}
              charCount={charCount}
              onReset={reset}
            />
          </div>
        )}
      </div>

      {isIdle && <Footer />}
    </div>
  );
}

function Examples({ onGenerate }) {
  const examples = [
    { icon: "🎮", label: "Snake Game", prompt: "A snake game with score tracking and increasing speed", type: "game" },
    { icon: "📊", label: "Budget Tracker", prompt: "A personal budget tracker with pie charts and monthly summary", type: "dashboard" },
    { icon: "⏱", label: "Pomodoro Timer", prompt: "A Pomodoro timer with work/break cycles and session stats", type: "tool" },
    { icon: "🧠", label: "Trivia Quiz", prompt: "A trivia quiz about science with 10 questions and score at the end", type: "quiz" },
    { icon: "📝", label: "Markdown Editor", prompt: "A split-pane markdown editor with live preview", type: "tool" },
    { icon: "🌤", label: "Weather UI", prompt: "A beautiful weather dashboard with animated weather icons and 5-day forecast", type: "dashboard" },
  ];

  return (
    <div className="examples-section">
      <p className="examples-label">Quick start</p>
      <div className="examples-grid">
        {examples.map((ex) => (
          <button
            key={ex.label}
            className="example-card"
            onClick={() => onGenerate({ prompt: ex.prompt, appType: ex.type })}
          >
            <span className="ex-icon">{ex.icon}</span>
            <span className="ex-label">{ex.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="footer">
      Every app is generated fresh · No storage · No logins
    </footer>
  );
}
