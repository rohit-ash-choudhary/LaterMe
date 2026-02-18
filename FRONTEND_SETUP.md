# 🚀 Frontend Setup for Local Testing with Render Backend

## ✅ What I've Done:

1. ✅ Fixed API path from `/api/v1` to `/api` (matches your backend)
2. ✅ Updated error messages to show the actual backend URL
3. ✅ Created `.env.example` template file

---

## 📋 Step-by-Step Setup:

### Step 1: Get Your Render Backend URL

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click on your backend service
3. Copy the **Service URL** (e.g., `https://laterme-backend.onrender.com`)

### Step 2: Create `.env` File

1. In your frontend root directory (`LaterMe/`), create a file named `.env`
2. Copy the content from `.env.example` and update with your Render URL:

```env
# Replace 'your-service-name' with your actual Render service name
VITE_API_URL=https://your-service-name.onrender.com/api
```

**Example:**
```env
VITE_API_URL=https://laterme-backend.onrender.com/api
```

### Step 3: Start Your Frontend

```bash
npm run dev
```

Your frontend will now connect to your Render backend! 🎉

---

## 🔄 Switching Between Local and Render Backend

### For Render Backend (Current Setup):
```env
# .env
VITE_API_URL=https://your-service-name.onrender.com/api
```

### For Local Backend (if you want to test locally):
```env
# .env
VITE_API_URL=http://localhost:8080/api
```

**Note:** After changing `.env`, restart your dev server (`npm run dev`)

---

## ✅ Testing Checklist

- [ ] Created `.env` file with your Render URL
- [ ] Started frontend: `npm run dev`
- [ ] Tested signup functionality
- [ ] Tested login functionality
- [ ] Verified API calls are going to Render backend

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to backend"
- **Check:** Is your Render service running? (Free tier sleeps after 15 min)
- **Solution:** Make a request to wake it up: `https://your-service.onrender.com/api/health`

### Issue: "CORS error"
- **Check:** Your backend needs to allow your frontend domain
- **Solution:** Check `SecurityConfig.java` in backend for CORS settings

### Issue: "404 Not Found"
- **Check:** API path is correct (`/api` not `/api/v1`)
- **Solution:** Already fixed in `api.js` ✅

### Issue: Environment variable not working
- **Check:** File is named exactly `.env` (not `.env.local` or `.env.development`)
- **Solution:** Restart your dev server after creating/changing `.env`

---

## 📝 For Vercel Deployment Later

When you deploy to Vercel:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add:
   ```
   VITE_API_URL=https://your-service-name.onrender.com/api
   ```
3. Redeploy

That's it! Your Vercel frontend will use the Render backend.

---

## 🎯 Quick Start

1. **Get Render URL:** `https://your-service-name.onrender.com`
2. **Create `.env` file:**
   ```env
   VITE_API_URL=https://your-service-name.onrender.com/api
   ```
3. **Start frontend:**
   ```bash
   npm run dev
   ```
4. **Test it!** Open `http://localhost:5173` (or whatever port Vite uses)

---

## ✨ You're All Set!

Your frontend is now configured to test with your Render backend locally. Once you're happy with everything, you can deploy the frontend to Vercel!
