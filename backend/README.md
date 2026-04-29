# AI App Generator Backend

Express.js backend for the AI App Generator with demo mode (no API credits required).

## 🚀 Deployment to Railway

### Step 1: Connect to Railway
1. Go to [Railway.app](https://railway.app)
2. Sign in with your GitHub account
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your `ai-app-generator` repository

### Step 2: Configure Environment Variables
In your Railway project settings, add these environment variables:

```
GROK_API_KEY=demo_mode_no_key_needed
FRONTEND_URL=*
PORT=8080
```

### Step 3: Deploy
Railway will automatically detect the `railway.toml` file and deploy using the configuration.

### Step 4: Get Your Backend URL
After deployment, Railway will provide a URL like:
`https://ai-app-generator-backend-production.up.railway.app`

## 🔧 Local Development

```bash
cd backend
npm install
npm run dev
```

## 📡 API Endpoints

- `GET /api/health` - Health check
- `POST /api/generate/stream` - Generate app (demo mode)

## 🎯 Demo Mode

This backend runs in demo mode and generates a beautiful todo app without requiring any AI API credits. Perfect for students and development!