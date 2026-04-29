# ⚡ FORGE — AI App Generator

> Describe any app idea. Get a fully working, beautiful HTML app — instantly.

Built with **React + Vite** (frontend) · **Node.js + Express** (backend) · **Claude claude-opus-4-5** (AI)

---

## 🗂 Project Structure

```
ai-app-generator/
├── frontend/          ← React app → Deploy to Vercel
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx / .css
│   │   │   ├── PromptForm.jsx / .css
│   │   │   └── Preview.jsx / .css
│   │   ├── hooks/
│   │   │   └── useGenerator.js
│   │   ├── lib/
│   │   │   └── api.js
│   │   ├── App.jsx / .css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── vercel.json
│
└── backend/           ← Express API → Deploy to Railway
    ├── src/
    │   └── index.js
    ├── package.json
    └── railway.toml
```

---

## 🚀 Deployment Guide

### Step 1 — Get Your Anthropic API Key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign in → API Keys → Create Key
3. Copy the key (starts with `sk-ant-...`)

---

### Step 2 — Deploy Backend to Railway

1. Go to [railway.app](https://railway.app) and sign in
2. Click **New Project → Deploy from GitHub repo**
3. Connect your GitHub and push this project
4. In the Railway project, set the **Root Directory** to `backend`
5. Add these **Environment Variables**:
   ```
   ANTHROPIC_API_KEY=sk-ant-your-key-here
   FRONTEND_URL=https://your-app.vercel.app   ← fill after step 3
   PORT=3001
   ```
6. Railway will auto-detect Node.js and deploy
7. Copy the generated URL: `https://your-app.railway.app`

---

### Step 3 — Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **Add New → Project → Import Git Repository**
3. Select your repo, set **Root Directory** to `frontend`
4. Add Environment Variable:
   ```
   VITE_API_URL=https://your-app.railway.app   ← from step 2
   ```
5. Click **Deploy**
6. Copy your Vercel URL

---

### Step 4 — Update CORS on Railway

Go back to Railway → Environment Variables → update:
```
FRONTEND_URL=https://your-actual-vercel-url.vercel.app
```
Then redeploy.

---

## 💻 Local Development

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env → add your ANTHROPIC_API_KEY
npm run dev
# Runs on http://localhost:3001
```

### Frontend
```bash
cd frontend
npm install
# Create .env.local:
echo "VITE_API_URL=" > .env.local   # leave blank for local proxy
npm run dev
# Runs on http://localhost:5173
```

---

## ✨ Features

- **Streaming generation** — watch your app build token by token
- **Live preview** — iframe renders HTML as it streams in
- **App type selector** — hint the AI: Dashboard, Game, Tool, Quiz, etc.
- **One-click download** — get the HTML file instantly
- **Open in new tab** — full-screen preview
- **Code view** — inspect the generated HTML
- **Rate limiting** — 10 requests/minute per IP
- **6 quick-start examples** — Snake, Budget Tracker, Pomodoro, etc.

---

## 🔧 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/generate/stream` | Streaming generation (SSE) |
| POST | `/api/generate` | Non-streaming fallback |

### Request body
```json
{
  "prompt": "A todo app with drag and drop",
  "appType": "tool"
}
```

---

## 🛡 Security

- Rate limited: 10 req/min per IP
- Prompt max: 500 characters
- CORS locked to your frontend URL in production
- iframe sandbox: `allow-scripts allow-forms allow-modals`
- No user data stored anywhere

---

## 🎨 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18 + Vite 5 |
| Styling | Pure CSS with custom properties |
| Fonts | Syne + Instrument Serif + JetBrains Mono |
| Backend | Node.js + Express 4 |
| AI | Anthropic Claude claude-opus-4-5 |
| Streaming | Server-Sent Events (SSE) |
| Deploy | Vercel (FE) + Railway (BE) |
