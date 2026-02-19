# GitHub Issues Tracker

## Issue #1: Email OTP Sending Failure - SMTP Connection Timeout

**Status:** 🔴 Open  
**Priority:** High  
**Labels:** `backend`, `email`, `smtp`, `production-issue`  
**Created:** 2026-02-18  
**Affects:** User registration and email verification flow

### Problem Description

The backend is unable to send OTP emails to users during registration. The SMTP connection to Gmail is timing out, preventing new users from receiving verification codes.

### Error Details

```
java.net.SocketTimeoutException: Connect timed out
Couldn't connect to host, port: smtp.gmail.com, 587; timeout 15000
```

**Stack Trace Location:**
- `EmailServiceImpl.sendHtmlEmail()` - Line 122
- `OtpServiceImpl.sendOtpEmail()` - Line 106
- `UserServiceImpl.createUser()` - Line 75

### Impact

- ✅ OTP codes are being generated successfully
- ❌ Emails are not being delivered to users
- ❌ Users cannot complete email verification
- ❌ New user registration flow is blocked

### Environment

- **Backend:** Production (Render.com)
- **Profile:** `production`
- **SMTP Server:** smtp.gmail.com:587
- **Timeout:** 15000ms (15 seconds)

### Possible Causes

1. **Network/Firewall Issues:**
   - Render.com may be blocking outbound SMTP connections
   - Port 587 (TLS) or 465 (SSL) may be blocked
   - Firewall rules preventing SMTP access

2. **Gmail SMTP Configuration:**
   - App password may be incorrect or expired
   - Gmail account security settings blocking connections
   - Rate limiting from Gmail

3. **Render.com Limitations:**
   - Free tier may have network restrictions
   - Outbound connections may be limited

### Suggested Solutions

1. **Check Render.com Network Settings:**
   - Verify outbound SMTP ports are allowed
   - Check if Render has any network restrictions

2. **Try Alternative SMTP Services:**
   - Use SendGrid, Mailgun, or AWS SES
   - These services are more reliable for cloud deployments
   - Better suited for production environments

3. **Gmail Configuration:**
   - Verify app password is correct
   - Check Gmail account security settings
   - Consider using OAuth2 instead of app passwords

4. **Increase Timeout:**
   - Try increasing SMTP connection timeout
   - Add retry logic for failed email sends

5. **Add Fallback Mechanism:**
   - Store OTP in database even if email fails
   - Allow users to request OTP resend
   - Show OTP in logs for development (remove in production)

### Related Files

- Backend: `EmailServiceImpl.java`
- Backend: `OtpServiceImpl.java`
- Backend: `UserServiceImpl.java`
- Backend: `application-production.properties`

### Next Steps

- [ ] Investigate Render.com network restrictions
- [ ] Test SMTP connection from Render environment
- [ ] Consider migrating to SendGrid/Mailgun
- [ ] Add better error handling and logging
- [ ] Implement email sending retry mechanism

---

## Issue Template for Future Issues

When creating new issues, use this format:

```markdown
## Issue #[NUMBER]: [Title]

**Status:** 🔴 Open / 🟡 In Progress / 🟢 Resolved  
**Priority:** Low / Medium / High / Critical  
**Labels:** `tag1`, `tag2`  
**Created:** YYYY-MM-DD  
**Affects:** [Component/Feature]

### Problem Description
[Clear description of the issue]

### Error Details
[Error messages, stack traces, logs]

### Impact
[What is affected by this issue]

### Environment
[Where the issue occurs]

### Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

### Expected Behavior
[What should happen]

### Actual Behavior
[What actually happens]

### Suggested Solutions
[Possible fixes or workarounds]

### Related Files
[List of relevant files]

### Next Steps
- [ ] Task 1
- [ ] Task 2
```
