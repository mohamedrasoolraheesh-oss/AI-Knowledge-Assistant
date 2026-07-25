# 🧠 AI Knowledge Assistant

Your intelligent document companion — powered by Claude AI. Upload PDFs, images, and text files, then ask questions and get instant answers.

## ✨ Features

- 💬 **Real AI chat** — powered by Claude Sonnet 4
- 📄 **Document upload** — PDF, images (PNG/JPG/WebP), text (.txt/.md/.csv)
- 🔍 **Context-aware answers** — Claude reads your docs and answers from them
- 📊 **Analytics** — track documents and conversations
- 🌙 **Dark mode** — easy on the eyes
- 📱 **Responsive** — works on mobile too

## 🚀 Quick Start

```bash
# 1. Clone
git clone https://github.com/mohamedrasoolraheesh-oss/AI-Knowledge-Assistant.git
cd AI-Knowledge-Assistant

# 2. Install
npm install

# 3. Add your API key
cp .env.example .env
# Edit .env and add: VITE_ANTHROPIC_API_KEY=sk-ant-your-key-here

# 4. Run
npm run dev
```

Open http://localhost:5173 — that's it!

## 🔑 Getting an API Key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up / log in
3. Create an API key
4. Paste it into your `.env` file

## 📦 Deploy to Vercel

### Option A — Vercel CLI
```bash
npm install -g vercel
npm run build
vercel --prod
# Set VITE_ANTHROPIC_API_KEY in Vercel dashboard → Settings → Environment Variables
```

### Option B — GitHub + Vercel (recommended)
1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. Add environment variable: `VITE_ANTHROPIC_API_KEY` = your key
4. Click Deploy ✅

> ⚠️ **Security note**: For production apps with multiple users, proxy the API through a backend (Next.js API route, Express, etc.) so your key isn't exposed. For personal use, the direct approach here is fine.

## 🗂 Project Structure

```
ai-knowledge-assistant/
├── src/
│   ├── App.jsx          # Main app — all components
│   ├── App.css          # All styles
│   └── main.jsx         # React entry point
├── public/
│   └── brain.svg        # Favicon
├── index.html
├── vite.config.js
├── vercel.json          # Vercel SPA routing config
├── .env.example         # API key template
└── package.json
```

## 🛠 Tech Stack

- [React 18](https://react.dev) + [Vite 5](https://vitejs.dev)
- [Anthropic Claude API](https://docs.anthropic.com)
- Zero external UI dependencies — pure CSS

## 📝 License

MIT 
