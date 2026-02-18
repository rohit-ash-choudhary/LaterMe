# ⚡ Quick Start - Test Frontend with Render Backend

## 🎯 3 Simple Steps:

### 1️⃣ Get Your Render URL
Go to Render Dashboard → Your Service → Copy the URL
Example: `https://laterme-backend.onrender.com`

### 2️⃣ Create `.env` File
In `LaterMe/` folder, create `.env` file:

```env
VITE_API_URL=https://your-actual-render-url.onrender.com/api
```

**Replace `your-actual-render-url` with your real Render service name!**

### 3️⃣ Start Frontend
```bash
npm run dev
```

Open `http://localhost:5173` and test! 🎉

---

## ✅ Done!

Your frontend will now connect to your Render backend.

**Note:** Free Render services sleep after 15 min. First request may take ~30 seconds to wake up.

---

## 📝 For Vercel Later:

When ready to deploy:
1. Vercel Dashboard → Settings → Environment Variables
2. Add: `VITE_API_URL=https://your-render-url.onrender.com/api`
3. Deploy!
