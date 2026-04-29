import React, { useState, useRef, useEffect } from "react";
import "./Preview.css";

export default function Preview({ html, status, charCount, onReset }) {
  const [activeTab, setActiveTab] = useState("preview");
  const [copied, setCopied] = useState(false);
  const iframeRef = useRef(null);

  // Update iframe when html changes (streaming)
  useEffect(() => {
    if (!iframeRef.current || !html) return;
    const doc = iframeRef.current.contentDocument;
    if (!doc) return;
    try {
      doc.open();
      doc.write(html);
      doc.close();
    } catch {}
  }, [html]);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(html);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const downloadCode = () => {
    const blob = new Blob([html], { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "app.html";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const openInNewTab = () => {
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  const isGenerating = status === "generating";
  const isDone = status === "done";
  const hasContent = html.length > 0;

  return (
    <div className="preview-panel">
      {/* Top bar */}
      <div className="preview-bar">
        <div className="preview-tabs">
          <button
            className={`preview-tab ${activeTab === "preview" ? "active" : ""}`}
            onClick={() => setActiveTab("preview")}
          >
            Preview
          </button>
          <button
            className={`preview-tab ${activeTab === "code" ? "active" : ""}`}
            onClick={() => setActiveTab("code")}
          >
            Code
            {hasContent && (
              <span className="tab-badge">{formatBytes(charCount)}</span>
            )}
          </button>
        </div>

        <div className="preview-actions">
          {isGenerating && (
            <span className="generating-pill">
              <span className="gen-dot" />
              Generating
            </span>
          )}
          {isDone && hasContent && (
            <>
              <button className="action-btn" onClick={copyCode} title="Copy HTML">
                {copied ? "✓ Copied" : "Copy"}
              </button>
              <button className="action-btn" onClick={downloadCode} title="Download">
                ↓ Download
              </button>
              <button className="action-btn accent" onClick={openInNewTab} title="Open in new tab">
                ↗ Open
              </button>
            </>
          )}
          <button className="action-btn dim" onClick={onReset} title="New app">
            ✕ New
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="preview-content">
        {activeTab === "preview" && (
          <div className="iframe-wrap">
            {!hasContent && (
              <div className="preview-placeholder">
                <div className="placeholder-icon">
                  {isGenerating ? "⚡" : "🖼"}
                </div>
                <p>
                  {isGenerating
                    ? "Building your app..."
                    : "Your app preview will appear here"}
                </p>
              </div>
            )}
            <iframe
              ref={iframeRef}
              className={`preview-iframe ${hasContent ? "visible" : ""}`}
              title="App Preview"
              sandbox="allow-scripts allow-forms allow-modals"
            />
            {isGenerating && hasContent && (
              <div className="streaming-overlay">
                <span className="stream-badge">
                  <span className="gen-dot" /> Live rendering...
                </span>
              </div>
            )}
          </div>
        )}

        {activeTab === "code" && (
          <div className="code-wrap">
            {hasContent ? (
              <pre className="code-block">
                <code>{html}</code>
              </pre>
            ) : (
              <div className="preview-placeholder">
                <p>No code generated yet</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes}B`;
  return `${(bytes / 1024).toFixed(1)}KB`;
}
