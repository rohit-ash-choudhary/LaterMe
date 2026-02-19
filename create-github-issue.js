#!/usr/bin/env node
/**
 * Script to create GitHub issue for email OTP sending failure
 * 
 * Usage:
 *   node create-github-issue.js
 * 
 * Requires GITHUB_TOKEN environment variable or .env file
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Load environment variables if .env file exists
try {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        process.env[key.trim()] = valueParts.join('=').trim();
      }
    });
  }
} catch (e) {
  // Ignore if .env doesn't exist
}

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = 'rohit-ash-choudhary';
const REPO_NAME = 'LaterMe';

if (!GITHUB_TOKEN) {
  console.error('❌ Error: GITHUB_TOKEN environment variable is required');
  console.log('\nTo create the issue manually:');
  console.log('1. Go to: https://github.com/' + REPO_OWNER + '/' + REPO_NAME + '/issues/new');
  console.log('2. Use the title and body from ISSUES.md file');
  process.exit(1);
}

const issueData = {
  title: 'Email OTP Sending Failure - SMTP Connection Timeout',
  body: `## Problem Description

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

Users can still register and the OTP is saved in the database. They can use the "Resend OTP" feature, which might work if the connection issue is temporary. However, this is not a reliable solution for production.`,
  labels: ['backend', 'email', 'smtp', 'production-issue', 'bug', 'high-priority']
};

const postData = JSON.stringify(issueData);

const options = {
  hostname: 'api.github.com',
  port: 443,
  path: `/repos/${REPO_OWNER}/${REPO_NAME}/issues`,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': postData.length,
    'Authorization': `token ${GITHUB_TOKEN}`,
    'User-Agent': 'Node.js GitHub Issue Creator'
  }
};

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    if (res.statusCode === 201) {
      const response = JSON.parse(data);
      console.log('✅ GitHub issue created successfully!');
      console.log(`📝 Issue #${response.number}: ${response.title}`);
      console.log(`🔗 URL: ${response.html_url}`);
      console.log(`\n💡 Use this issue number in your commit message: Fixes #${response.number}`);
    } else {
      console.error('❌ Failed to create issue');
      console.error(`Status: ${res.statusCode}`);
      console.error(`Response: ${data}`);
      process.exit(1);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Error creating issue:', error.message);
  process.exit(1);
});

req.write(postData);
req.end();
