# Outdoor Search

A two-screen web app that sends a keyword to an n8n webhook and displays the results.

---

## Run Locally (Mac)

**Prerequisites:** Node.js installed. If you don't have it:
```bash
brew install node
```

**1. Install dependencies:**
```bash
cd outdoor-search
npm install
```

**2. Start the dev server:**
```bash
npm run dev
```

**3. Open your browser at:** `http://localhost:5173`

---

## Deploy to Vercel via GitHub

**1. Push to GitHub:**
```bash
git init
git add .
git commit -m "Initial commit"
gh repo create outdoor-search --public --source=. --push
# or push manually to a repo you create on github.com
```

**2. Connect to Vercel:**
- Go to [vercel.com](https://vercel.com) → New Project
- Import your GitHub repo
- Vercel auto-detects Vite — no config needed
- Click **Deploy** ✓

---

## How It Works

| Screen | What happens |
|--------|-------------|
| Search | User types a keyword and hits Search |
| Loading | App POSTs `{ keyword }` to the n8n webhook and waits |
| Results | Webhook response is displayed — handles JSON objects, arrays, or plain text |

The webhook URL is hardcoded in `src/App.jsx`. To change it, update `WEBHOOK_URL` at the top of that file.
