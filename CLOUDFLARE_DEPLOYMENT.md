# ☁️ Cloudflare Pages Deployment Guide

## ⚠️ Important: Environment Variables ARE Required

**Yes, you DO need to add the environment variable in Cloudflare Pages!**

### Why?
- Vite embeds `VITE_*` environment variables **at build time** (not runtime)
- Without it, your frontend will try to connect to `http://localhost:8080/api` (the default)
- The `.env` file is **NOT** used in production builds

---

## 📋 Step-by-Step: Deploy to Cloudflare Pages

### Step 1: Push to GitHub
✅ Already done! Your code is at: `https://github.com/rohit-ash-choudhary/LaterMe.git`

### Step 2: Connect to Cloudflare Pages
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Pages** → **Create a project**
3. Connect your GitHub repository: `rohit-ash-choudhary/LaterMe`
4. Select the repository

### Step 3: Configure Build Settings
- **Framework preset:** Vite
- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Root directory:** `/` (leave as default)

### Step 4: Add Environment Variable (REQUIRED!)
1. In Cloudflare Pages project settings
2. Go to **Settings** → **Environment variables**
3. Click **Add variable**
4. Add:
   ```
   Variable name: VITE_API_URL
   Value: https://laterme-backend.onrender.com/api
   ```
5. Make sure it's added to **Production**, **Preview**, and **Development** environments

### Step 5: Deploy
- Click **Save and Deploy**
- Cloudflare will build and deploy your site

---

## 🔄 Alternative: Hardcode URL (Not Recommended)

If you really don't want to use environment variables, you could hardcode it:

**In `src/config/api.js`:**
```javascript
const API_URL = 'https://laterme-backend.onrender.com/api'
```

**But this is NOT recommended because:**
- ❌ Can't easily switch between dev/prod
- ❌ Hard to maintain
- ❌ Not flexible

---

## ✅ Recommended Approach:

**Use environment variables in Cloudflare Pages:**
- ✅ Flexible
- ✅ Easy to change
- ✅ Best practice
- ✅ Works for dev/staging/prod

---

## 🎯 Quick Summary:

**Question:** Do I need env variables for Cloudflare?
**Answer:** **YES!** You need to add `VITE_API_URL` in Cloudflare Pages settings.

**Why?** Vite variables are embedded at build time, so Cloudflare needs to know the value during the build process.

---

## 📝 Environment Variable to Add:

```
VITE_API_URL=https://laterme-backend.onrender.com/api
```

**Note:** No port number needed! Cloudflare Pages and Render both use HTTPS on standard ports (443) automatically.

Add this in Cloudflare Pages → Settings → Environment variables

---

## 🚀 After Deployment:

Your frontend will be live at:
```
https://your-project-name.pages.dev
```

And it will connect to your Render backend automatically! 🎉
