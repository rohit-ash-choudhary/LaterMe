# 🔄 Wake Up Your Render Backend

## The Issue:
Render free tier services **sleep after 15 minutes of inactivity**. The first request after sleep takes ~30 seconds to wake up.

## ✅ Quick Fix:

### Step 1: Wake Up the Service
Open this URL in your browser and **wait 30-60 seconds**:
```
https://laterme-backend.onrender.com/api/health
```

**What to expect:**
- First 30 seconds: Loading/connecting...
- After 30 seconds: You should see:
  ```json
  {
    "status": "UP",
    "service": "LaterMe Backend",
    "timestamp": 1234567890
  }
  ```

### Step 2: Try Your Frontend Again
Once the health endpoint responds, your frontend should work!

## 🔍 Check Service Status:

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click on your `laterme-backend` service
3. Check the status:
   - **"Live"** = Service is awake ✅
   - **"Sleeping"** = Service is sleeping (needs wake up) 😴

## 💡 Pro Tips:

### Option 1: Keep Service Awake (Free Tier)
- Make a request every 14 minutes (before it sleeps)
- Use a service like [UptimeRobot](https://uptimerobot.com) (free) to ping your health endpoint every 5 minutes

### Option 2: Upgrade to Paid Plan
- Paid plans don't sleep
- Service stays awake 24/7

## 🧪 Test Commands:

### Test Health Endpoint:
```bash
curl https://laterme-backend.onrender.com/api/health
```

### Test Login Endpoint (after wake up):
```bash
curl -X POST https://laterme-backend.onrender.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","passHash":"password"}'
```

## ⏱️ Expected Timeline:

1. **Wake up request:** 30-60 seconds
2. **Service becomes active:** After health check responds
3. **Frontend works:** Immediately after service is awake

---

## 🎯 Quick Action:

**Right now:** Open `https://laterme-backend.onrender.com/api/health` in your browser and wait 30 seconds!
