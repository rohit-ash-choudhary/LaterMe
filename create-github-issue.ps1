# PowerShell script to create GitHub issue for email OTP sending failure
# 
# Usage:
#   .\create-github-issue.ps1
# 
# Or with token:
#   $env:GITHUB_TOKEN="your_token_here"; .\create-github-issue.ps1

$GITHUB_TOKEN = $env:GITHUB_TOKEN
$REPO_OWNER = "rohit-ash-choudhary"
$REPO_NAME = "LaterMe"

if (-not $GITHUB_TOKEN) {
    Write-Host "❌ Error: GITHUB_TOKEN environment variable is required" -ForegroundColor Red
    Write-Host ""
    Write-Host "To create the issue manually:" -ForegroundColor Yellow
    Write-Host "1. Go to: https://github.com/$REPO_OWNER/$REPO_NAME/issues/new" -ForegroundColor Cyan
    Write-Host "2. Use the title and body from ISSUES.md file" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Or set your token:" -ForegroundColor Yellow
    Write-Host '  $env:GITHUB_TOKEN="your_github_token_here"' -ForegroundColor Cyan
    Write-Host '  .\create-github-issue.ps1' -ForegroundColor Cyan
    exit 1
}

$issueData = @{
    title = "Email OTP Sending Failure - SMTP Connection Timeout"
    body = @"
## Problem Description

The backend is unable to send OTP emails to users during registration. The SMTP connection to Gmail is timing out, preventing new users from receiving verification codes.

## Error Details

\`\`\`
java.net.SocketTimeoutException: Connect timed out
Couldn't connect to host, port: smtp.gmail.com, 587; timeout 15000
\`\`\`

**Full Exception:**
\`\`\`
org.springframework.mail.MailSendException: Mail server connection failed. 
Failed messages: org.eclipse.angus.mail.util.MailConnectException: 
Couldn't connect to host, port: smtp.gmail.com, 587; timeout 15000;
  nested exception is: java.net.SocketTimeoutException: Connect timed out
\`\`\`

## Impact

- ✅ OTP codes are being generated successfully
- ✅ User accounts are being created in database
- ❌ Emails are not being delivered to users (connection timeout)
- ❌ Users cannot complete email verification
- ⚠️  Warning messages appear but registration continues (OTP still saved)

## Environment

- **Backend:** Production (Render.com)
- **Profile:** \`production\` (active)
- **Spring Boot Version:** 3.5.10
- **Java Version:** 17.0.18
- **SMTP Server:** smtp.gmail.com:587
- **Timeout:** 15000ms (15 seconds)
- **Mail Library:** Eclipse Angus Mail (Jakarta Mail)

## Root Cause

\`\`\`
Caused by: java.net.SocketTimeoutException: Connect timed out
	at java.base/sun.nio.ch.NioSocketImpl.timedFinishConnect(Unknown Source)
	at java.base/sun.nio.ch.NioSocketImpl.connect(Unknown Source)
	at org.eclipse.angus.mail.smtp.SMTPTransport.openServer(SMTPTransport.java:2193)
\`\`\`

## Possible Causes

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

## Suggested Solutions

1. **Check Render.com Network Settings:**
   - Verify outbound SMTP ports are allowed
   - Check if Render has any network restrictions

2. **Try Alternative SMTP Services (RECOMMENDED):**
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
   - Store OTP in database even if email fails (already implemented)
   - Allow users to request OTP resend (already implemented)
   - Add async email sending to prevent blocking

## Related Files

- Backend: \`EmailServiceImpl.java\`
- Backend: \`OtpServiceImpl.java\`
- Backend: \`UserServiceImpl.java\`
- Backend: \`application-production.properties\`
- Frontend: \`src/pages/Signup.jsx\`
- Frontend: \`src/pages/VerifyEmail.jsx\`

## Next Steps

- [ ] **URGENT:** Investigate Render.com network restrictions for SMTP ports
- [ ] Test SMTP connection from Render environment using telnet/netcat
- [ ] **RECOMMENDED:** Migrate to SendGrid/Mailgun/AWS SES (better for cloud)
- [ ] Add better error handling and logging for email failures
- [ ] Implement email sending retry mechanism with exponential backoff
- [ ] Consider async email sending to prevent blocking registration
- [ ] Add health check endpoint for email service connectivity

## Workaround

Users can still register and the OTP is saved in the database. They can use the "Resend OTP" feature, which might work if the connection issue is temporary. However, this is not a reliable solution for production.
"@
    labels = @("backend", "email", "smtp", "production-issue", "bug", "high-priority")
} | ConvertTo-Json -Depth 10

$headers = @{
    "Authorization" = "token $GITHUB_TOKEN"
    "Accept" = "application/vnd.github.v3+json"
    "Content-Type" = "application/json"
    "User-Agent" = "PowerShell GitHub Issue Creator"
}

try {
    $response = Invoke-RestMethod -Uri "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/issues" `
        -Method Post `
        -Headers $headers `
        -Body $issueData `
        -ContentType "application/json"
    
    Write-Host "✅ GitHub issue created successfully!" -ForegroundColor Green
    Write-Host "📝 Issue #$($response.number): $($response.title)" -ForegroundColor Cyan
    Write-Host "🔗 URL: $($response.html_url)" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "💡 Use this issue number in your commit message: Fixes #$($response.number)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Issue Number: $($response.number)" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to create issue" -ForegroundColor Red
    Write-Host "Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
    exit 1
}
