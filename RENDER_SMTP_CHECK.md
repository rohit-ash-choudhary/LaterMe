# How to Check Render.com SMTP Settings

## Step-by-Step Guide to Check SMTP Port Restrictions

### 1. Access Your Render.com Dashboard

1. Go to: https://dashboard.render.com
2. Log in to your account
3. Select your **LaterMe Backend** service

### 2. Check Service Settings

#### A. Network & Security Settings

1. In your service dashboard, click on **"Settings"** tab (left sidebar)
2. Look for these sections:
   - **"Network"** or **"Security"**
   - **"Environment Variables"**
   - **"Build & Deploy"**

#### B. Check Outbound Connections

1. Go to **Settings** → Look for **"Network"** or **"Security"** section
2. Check for:
   - **"Outbound Connections"**
   - **"Port Restrictions"**
   - **"Firewall Rules"**
   - **"Network Policies"**

### 3. Check Service Plan/Tier

1. In **Settings** tab, look for **"Plan"** or **"Service Plan"**
2. Check if you're on:
   - **Free Tier** (may have restrictions)
   - **Starter** ($7/month)
   - **Professional** ($25/month)

**Note:** Free tier often has network restrictions including SMTP blocking.

### 4. Check Logs for Network Errors

1. Go to **"Logs"** tab in your service
2. Look for errors like:
   - `Connection refused`
   - `Port blocked`
   - `Network timeout`
   - `SMTP connection failed`

### 5. Test SMTP Connection from Render

#### Option A: Check Render Documentation

1. Go to: https://render.com/docs
2. Search for:
   - "SMTP"
   - "Email sending"
   - "Network restrictions"
   - "Outbound connections"
   - "Port blocking"

#### Option B: Check Render Status/Support

1. Go to: https://status.render.com
2. Check for any network-related issues
3. Or contact support: https://render.com/support

### 6. Specific Places to Check in Render Dashboard

#### Location 1: Service Settings
```
Dashboard → Your Service → Settings Tab
├── Plan (check if Free/Paid)
├── Network (if available)
└── Security (if available)
```

#### Location 2: Environment Variables
```
Dashboard → Your Service → Environment Tab
Check for:
- SMTP_HOST
- SMTP_PORT
- MAIL settings
```

#### Location 3: Service Logs
```
Dashboard → Your Service → Logs Tab
Look for SMTP connection errors
```

### 7. Render.com Free Tier Limitations

**Known Free Tier Restrictions:**
- ❌ Outbound SMTP connections may be blocked
- ❌ Port 587 (TLS) and 465 (SSL) may be restricted
- ❌ Network egress filtering
- ✅ HTTP/HTTPS outbound connections allowed

**Upgrade Options:**
- **Starter Plan** ($7/month) - May allow SMTP
- **Professional Plan** ($25/month) - Full network access

### 8. How to Verify SMTP is Blocked

#### Test from Render Environment:

1. **SSH into your Render service** (if available):
   ```bash
   # Check if you can connect to Gmail SMTP
   telnet smtp.gmail.com 587
   # or
   nc -zv smtp.gmail.com 587
   ```

2. **Check from your application logs:**
   - Look for the exact error message
   - `SocketTimeoutException` = Connection timeout (likely blocked)
   - `Connection refused` = Port blocked
   - `Network unreachable` = Firewall blocking

### 9. Alternative: Check Render Support Documentation

1. **Render Docs:**
   - https://render.com/docs
   - Search: "email", "SMTP", "network"

2. **Render Community:**
   - https://community.render.com
   - Search for: "SMTP blocked", "email sending"

3. **Contact Render Support:**
   - https://render.com/support
   - Ask: "Does free tier allow outbound SMTP connections to Gmail?"

### 10. Quick Checklist

- [ ] Checked Service Settings → Plan (Free/Paid?)
- [ ] Checked Settings → Network/Security section
- [ ] Reviewed service logs for SMTP errors
- [ ] Checked Render documentation for SMTP restrictions
- [ ] Tested SMTP connection (if SSH available)
- [ ] Contacted Render support if unclear

### 11. What to Ask Render Support

If you contact support, ask:

> "I'm trying to send emails via Gmail SMTP (smtp.gmail.com:587) from my Render service, but getting connection timeouts. Does the free tier block outbound SMTP connections? If so, which paid plan allows SMTP access?"

### 12. Expected Findings

**If SMTP is blocked:**
- You'll see connection timeouts in logs
- No way to enable it on free tier
- Need to upgrade or use alternative email service

**If SMTP is allowed:**
- Check your Gmail app password
- Verify SMTP configuration
- Check Gmail account security settings

---

## Recommended Solution

Since Render.com free tier likely blocks SMTP, the best solution is to use a cloud email service:

1. **SendGrid** (Free tier: 100 emails/day)
2. **Mailgun** (Free tier: 5,000 emails/month)
3. **AWS SES** (Pay as you go, very cheap)

These services use HTTP APIs instead of SMTP, which work better with cloud platforms.
