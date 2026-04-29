import React from "react";
import "./Header.css";

export default function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <div className="header-logo-wrap">
          <svg className="logo-icon" viewBox="0 0 28 28" fill="none">
            <polygon points="14,2 26,8 26,20 14,26 2,20 2,8" stroke="url(#lg)" strokeWidth="1.5" fill="none"/>
            <polygon points="14,7 21,11 21,17 14,21 7,17 7,11" fill="url(#lg2)" opacity="0.6"/>
            <circle cx="14" cy="14" r="3" fill="url(#lg)"/>
            <defs>
              <linearGradient id="lg" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#7b5cff"/>
                <stop offset="100%" stopColor="#ff5cf8"/>
              </linearGradient>
              <linearGradient id="lg2" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#7b5cff" stopOpacity="0.4"/>
                <stop offset="100%" stopColor="#ff5cf8" stopOpacity="0.2"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <span className="header-brand">FORGE</span>
        <div className="header-divider" />
        <span className="header-tag">AI App Generator</span>
      </div>
      <div className="header-right">
        <span className="header-status">
          <span className="status-dot" />
          <span className="status-text">Online</span>
        </span>
      </div>
    </header>
  );
}
