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

**Primary Error:**
```
java.net.SocketTimeoutException: Connect timed out
Couldn't connect to host, port: smtp.gmail.com, 587; timeout 15000
```

**Full Exception Chain:**
```
org.springframework.mail.MailSendException: Mail server connection failed. 
Failed messages: org.eclipse.angus.mail.util.MailConnectException: 
Couldn't connect to host, port: smtp.gmail.com, 587; timeout 15000;
  nested exception is: java.net.SocketTimeoutException: Connect timed out
```

**Key Stack Trace Points:**
- `EmailServiceImpl.sendHtmlEmail()` - Line 122
- `OtpServiceImpl.sendOtpEmail()` - Line 106
- `UserServiceImpl.createUser()` - Line 75
- `UserController.creatUser()` - Line 36

**Root Cause:**
```
Caused by: java.net.SocketTimeoutException: Connect timed out
	at java.base/sun.nio.ch.NioSocketImpl.timedFinishConnect(Unknown Source)
	at java.base/sun.nio.ch.NioSocketImpl.connect(Unknown Source)
	at java.base/java.net.SocksSocketImpl.connect(Unknown Source)
	at java.base/java.net.Socket.connect(Unknown Source)
	at org.eclipse.angus.mail.util.WriteTimeoutSocket.connect(WriteTimeoutSocket.java:118)
	at org.eclipse.angus.mail.util.SocketFetcher.createSocket(SocketFetcher.java:366)
	at org.eclipse.angus.mail.util.SocketFetcher.getSocket(SocketFetcher.java:243)
	at org.eclipse.angus.mail.smtp.SMTPTransport.openServer(SMTPTransport.java:2193)
```

**Warning Messages:**
```
⚠️  WARNING: Failed to send OTP email to [email]: Mail server connection failed. 
Please check your network connection and firewall settings. 
The SMTP ports (465/587) may be blocked.

OTP generated and email sent successfully for user: [email]
Unexpected exception while sending email: Mail server connection failed.
```

### Impact

- ✅ OTP codes are being generated successfully
- ✅ User accounts are being created in database
- ❌ Emails are not being delivered to users (connection timeout)
- ❌ Users cannot complete email verification
- ❌ New user registration flow is partially blocked
- ⚠️  Warning messages appear but registration continues (OTP still saved)

### Environment

- **Backend:** Production (Render.com)
- **Profile:** `production` (active)
- **Spring Boot Version:** 3.5.10
- **Java Version:** 17.0.18
- **SMTP Server:** smtp.gmail.com:587
- **Timeout:** 15000ms (15 seconds)
- **Mail Library:** Eclipse Angus Mail (Jakarta Mail)
- **Deployment:** Docker container on Render.com

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

- [ ] **URGENT:** Investigate Render.com network restrictions for SMTP ports
- [ ] Test SMTP connection from Render environment using telnet/netcat
- [ ] **RECOMMENDED:** Migrate to SendGrid/Mailgun/AWS SES (better for cloud)
- [ ] Add better error handling and logging for email failures
- [ ] Implement email sending retry mechanism with exponential backoff
- [ ] Add fallback: Store OTP in database even if email fails (already done)
- [ ] Consider async email sending to prevent blocking registration
- [ ] Add health check endpoint for email service connectivity
- [ ] Document workaround: Users can use resend OTP feature

### Workaround

Users can still register and the OTP is saved in the database. They can use the "Resend OTP" feature, which might work if the connection issue is temporary. However, this is not a reliable solution for production.

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
