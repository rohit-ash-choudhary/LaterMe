# ⚠️ IMPORTANT: Update Your .env File!

## The Problem:
Your frontend is trying to connect to `http://localhost:8080/api` but your backend is on Render!

## Quick Fix:

### Step 1: Get Your Render URL
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click on your backend service
3. Copy the **Service URL** (e.g., `https://laterme-backend.onrender.com`)

### Step 2: Update `.env` File
Open `LaterMe/.env` and replace `your-service-name` with your actual Render service name:

**Current (needs update):**
```env
VITE_API_URL=https://your-service-name.onrender.com/api
```

**Example (if your service is `laterme-backend`):**
```env
VITE_API_URL=https://laterme-backend.onrender.com/api
```

### Step 3: Restart Your Frontend
```bash
# Stop your current dev server (Ctrl+C)
# Then restart:
npm run dev
```

## ✅ That's It!

After updating `.env` and restarting, your frontend will connect to Render backend!

---

## 🔍 How to Find Your Render URL:

1. Go to https://dashboard.render.com
2. Click on your service (probably named `laterme-backend`)
3. Look for "Service URL" or "Live URL"
4. Copy that URL (without `/api` at the end)
5. Use it in `.env` like: `VITE_API_URL=https://your-url.onrender.com/api`
