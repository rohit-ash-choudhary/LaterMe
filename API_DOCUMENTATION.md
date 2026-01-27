# FUTUROO - REST API Documentation

Complete list of REST API endpoints needed for the backend based on frontend implementation.

## Base URL
```
https://api.futuroo.com/api/v1
```

## Authentication
All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

---

## 1. Authentication & User Management

### 1.1 User Registration
```
POST /auth/register
```
**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```
**Response:**
```json
{
  "user": {
    "id": "user_123",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "jwt_token_here"
}
```

### 1.2 User Login
```
POST /auth/login
```
**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
**Response:**
```json
{
  "user": {
    "id": "user_123",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "jwt_token_here"
}
```

### 1.3 Google OAuth Login
```
POST /auth/google
```
**Request Body:**
```json
{
  "idToken": "google_id_token"
}
```
**Response:** Same as login

### 1.4 Get Current User
```
GET /auth/me
```
**Response:**
```json
{
  "id": "user_123",
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### 1.5 Update User Email
```
PUT /auth/email
```
**Request Body:**
```json
{
  "email": "newemail@example.com"
}
```

### 1.6 Change Password
```
PUT /auth/password
```
**Request Body:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword"
}
```

### 1.7 Delete Account
```
DELETE /auth/account
```

---

## 2. Letters (Write Later - Future Letters)

### 2.1 Get All User Letters
```
GET /letters
```
**Query Parameters:**
- `type`: `drafts` | `scheduled` | `delivered`
- `page`: number (default: 1)
- `limit`: number (default: 20)

**Response:**
```json
{
  "letters": [
    {
      "id": "letter_123",
      "userId": "user_123",
      "title": "Letter to my 2030 self",
      "content": "Dear Future Me...",
      "deliveryType": "date" | "open-when",
      "deliveryDate": "2030-01-01",
      "openWhenTrigger": "lost" | "fail" | "succeed" | null,
      "mood": "😔" | "😌" | "😤" | "😍" | "😴" | null,
      "identity": "dreamer" | "survivor" | "beginner" | "builder" | "healer" | null,
      "isPublic": false,
      "status": "draft" | "scheduled" | "delivered",
      "isOpened": false,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 20
}
```

### 2.2 Get Single Letter
```
GET /letters/:letterId
```

### 2.3 Create Draft (Auto-save)
```
POST /letters/drafts
```
**Request Body:**
```json
{
  "title": "Letter to my 2030 self",
  "content": "Dear Future Me...",
  "deliveryType": "date",
  "deliveryDate": "2030-01-01",
  "openWhenTrigger": null,
  "mood": "😌",
  "identity": "dreamer",
  "isPublic": false
}
```

### 2.4 Update Draft
```
PUT /letters/drafts/:draftId
```
**Request Body:** Same as create

### 2.5 Delete Draft
```
DELETE /letters/drafts/:draftId
```

### 2.6 Schedule Letter (Send)
```
POST /letters/schedule
```
**Request Body:**
```json
{
  "title": "Letter to my 2030 self",
  "content": "Dear Future Me...",
  "deliveryType": "date" | "open-when",
  "deliveryDate": "2030-01-01" | null,
  "openWhenTrigger": "lost" | null,
  "mood": "😌",
  "identity": "dreamer",
  "isPublic": false
}
```
**Response:**
```json
{
  "letter": { ... },
  "message": "Letter scheduled successfully!"
}
```

### 2.7 Open/Receive Letter
```
POST /letters/:letterId/open
```
**Response:**
```json
{
  "letter": { ... },
  "timeWaited": {
    "days": 365,
    "message": "This waited 365 days to reach you"
  }
}
```

### 2.8 Mark Letter as Opened
```
PUT /letters/:letterId/opened
```

---

## 3. Public Letters

### 3.1 Get Public Letters
```
GET /public-letters
```
**Query Parameters:**
- `filter`: `latest` | `trending` | `most-liked` | `saved`
- `search`: string (search query)
- `page`: number
- `limit`: number

**Response:**
```json
{
  "letters": [
    {
      "id": "letter_123",
      "author": "John Doe",
      "authorId": "user_123",
      "title": "Letter to my 2030 self",
      "content": "Dear Future Me...",
      "likes": 120,
      "isLiked": false,
      "isSaved": false,
      "mood": "😌",
      "identity": "dreamer",
      "deliveryType": "date",
      "deliveryDate": "2030-01-01",
      "openWhenTrigger": null,
      "silentReactions": {
        "felt": 45,
        "helped": 32,
        "alone": 28
      },
      "userReactions": [],
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 100,
  "page": 1
}
```

### 3.2 Get Single Public Letter
```
GET /public-letters/:letterId
```

### 3.3 Like/Unlike Public Letter
```
POST /public-letters/:letterId/like
```
**Response:**
```json
{
  "liked": true,
  "likesCount": 121
}
```

### 3.4 Save/Unsave Public Letter
```
POST /public-letters/:letterId/save
```
**Response:**
```json
{
  "saved": true
}
```

### 3.5 Add Silent Reaction
```
POST /public-letters/:letterId/reactions
```
**Request Body:**
```json
{
  "reaction": "felt" | "helped" | "alone"
}
```
**Response:**
```json
{
  "reaction": "felt",
  "counts": {
    "felt": 46,
    "helped": 32,
    "alone": 28
  }
}
```

### 3.6 Remove Silent Reaction
```
DELETE /public-letters/:letterId/reactions/:reactionId
```

### 3.7 Get Saved Letters
```
GET /public-letters/saved
```

---

## 4. Instant Letters (Write to Someone)

### 4.1 Send Instant Letter
```
POST /instant-letters
```
**Request Body:**
```json
{
  "recipient": "email" | "public",
  "email": "recipient@example.com" | null,
  "subject": "Hello",
  "message": "Your message here...",
  "isPublic": false
}
```
**Note:** Content moderation check should be performed before saving.

**Response:**
```json
{
  "letter": { ... },
  "message": "Letter sent successfully!"
}
```

### 4.2 Get Instant Letters
```
GET /instant-letters
```
**Query Parameters:**
- `type`: `sent` | `received`
- `page`: number
- `limit`: number

---

## 5. Subscriptions

### 5.1 Get User Subscription
```
GET /subscriptions
```
**Response:**
```json
{
  "plan": "free" | "monthly" | "yearly" | "lifetime",
  "expiresAt": "2025-01-01T00:00:00Z" | null,
  "purchasedAt": "2024-01-01T00:00:00Z",
  "isActive": true
}
```

### 5.2 Subscribe to Plan
```
POST /subscriptions
```
**Request Body:**
```json
{
  "plan": "monthly" | "yearly" | "lifetime",
  "paymentMethodId": "pm_1234567890" // Stripe payment method ID
}
```
**Response:**
```json
{
  "subscription": {
    "plan": "monthly",
    "expiresAt": "2024-02-01T00:00:00Z",
    "purchasedAt": "2024-01-01T00:00:00Z"
  },
  "paymentIntent": {
    "id": "pi_1234567890",
    "clientSecret": "pi_1234567890_secret_xxx"
  }
}
```

### 5.3 Cancel Subscription
```
DELETE /subscriptions
```
**Response:**
```json
{
  "message": "Subscription will be cancelled at the end of billing period",
  "expiresAt": "2024-02-01T00:00:00Z"
}
```

### 5.4 Get Subscription Plans
```
GET /subscriptions/plans
```
**Response:**
```json
{
  "plans": [
    {
      "id": "monthly",
      "name": "Monthly",
      "price": 1,
      "period": "month",
      "currency": "USD"
    },
    {
      "id": "yearly",
      "name": "Yearly",
      "price": 8,
      "period": "year",
      "currency": "USD"
    },
    {
      "id": "lifetime",
      "name": "Lifetime",
      "price": 50,
      "period": "lifetime",
      "currency": "USD"
    }
  ]
}
```

---

## 6. Letter Limits & Usage

### 6.1 Get Letter Count
```
GET /letters/count
```
**Response:**
```json
{
  "total": 5,
  "drafts": 2,
  "scheduled": 2,
  "delivered": 1,
  "instant": 0,
  "limit": 10,
  "remaining": 5,
  "isUnlimited": false
}
```

### 6.2 Check if Can Create Letter
```
GET /letters/can-create
```
**Response:**
```json
{
  "canCreate": true,
  "reason": null
}
```
or
```json
{
  "canCreate": false,
  "reason": "Free tier limit reached. Upgrade to premium for unlimited letters."
}
```

---

## 7. Content Moderation

### 7.1 Check Content
```
POST /moderation/check
```
**Request Body:**
```json
{
  "content": "Your message text here..."
}
```
**Response:**
```json
{
  "isSafe": true,
  "warnings": []
}
```
or
```json
{
  "isSafe": false,
  "warnings": [
    {
      "severity": "high",
      "reason": "Contains harmful language",
      "message": "Your message contains inappropriate content. Please revise."
    }
  ]
}
```

---

## 8. Background Jobs / Scheduled Tasks

### 8.1 Letter Delivery Service
**Internal endpoint (called by cron job):**
```
POST /internal/letters/deliver
```
This should:
- Check all scheduled letters where `deliveryDate <= today`
- Move them from `scheduled` to `delivered`
- Send email notifications if configured
- Make public letters visible if `isPublic = true` and `deliveryDate <= today`

---

## Data Models

### User Model
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "password": "string (hashed)",
  "createdAt": "ISO8601",
  "updatedAt": "ISO8601"
}
```

### Letter Model
```json
{
  "id": "string",
  "userId": "string",
  "title": "string",
  "content": "string",
  "deliveryType": "date" | "open-when",
  "deliveryDate": "ISO8601" | null,
  "openWhenTrigger": "string" | null,
  "mood": "string" | null,
  "identity": "string" | null,
  "isPublic": "boolean",
  "status": "draft" | "scheduled" | "delivered",
  "isOpened": "boolean",
  "openedAt": "ISO8601" | null,
  "createdAt": "ISO8601",
  "updatedAt": "ISO8601"
}
```

### Public Letter Model
```json
{
  "id": "string",
  "letterId": "string",
  "author": "string",
  "authorId": "string",
  "title": "string",
  "content": "string",
  "likes": "number",
  "mood": "string" | null,
  "identity": "string" | null,
  "deliveryType": "string",
  "deliveryDate": "ISO8601",
  "openWhenTrigger": "string" | null,
  "silentReactions": {
    "felt": "number",
    "helped": "number",
    "alone": "number"
  },
  "createdAt": "ISO8601"
}
```

### Subscription Model
```json
{
  "id": "string",
  "userId": "string",
  "plan": "free" | "monthly" | "yearly" | "lifetime",
  "expiresAt": "ISO8601" | null,
  "purchasedAt": "ISO8601",
  "cancelledAt": "ISO8601" | null,
  "paymentMethodId": "string" | null,
  "stripeSubscriptionId": "string" | null
}
```

### Reaction Model
```json
{
  "id": "string",
  "letterId": "string",
  "userId": "string",
  "reaction": "felt" | "helped" | "alone",
  "createdAt": "ISO8601"
}
```

---

## Error Responses

All errors follow this format:
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {}
  }
}
```

### Common Error Codes:
- `UNAUTHORIZED` (401): Invalid or missing token
- `FORBIDDEN` (403): Insufficient permissions
- `NOT_FOUND` (404): Resource not found
- `VALIDATION_ERROR` (400): Invalid request data
- `RATE_LIMIT_EXCEEDED` (429): Too many requests
- `INTERNAL_ERROR` (500): Server error

---

## Rate Limiting
- Public endpoints: 100 requests/hour
- Authenticated endpoints: 1000 requests/hour
- Content moderation: 50 requests/hour

---

## Notes for Backend Implementation:

1. **Authentication**: Use JWT tokens with refresh token mechanism
2. **Password Hashing**: Use bcrypt with salt rounds (minimum 10)
3. **Content Moderation**: Integrate with moderation service (e.g., Google Perspective API, AWS Comprehend, or custom ML model)
4. **Payment Processing**: Integrate Stripe for subscription payments
5. **Email Service**: Use service like SendGrid, AWS SES, or Mailgun for notifications
6. **Database**: Recommended PostgreSQL or MongoDB
7. **Caching**: Use Redis for frequently accessed data (public letters, user subscriptions)
8. **File Storage**: If adding audio letters, use AWS S3 or similar
9. **Background Jobs**: Use Bull/BullMQ, Celery, or similar for scheduled letter delivery
10. **Search**: Use Elasticsearch or Algolia for public letter search functionality

---

## 🆓 FREE TIER SERVICES & IMPLEMENTATION GUIDE

This section covers all free services you can use to build the backend with zero cost.

---

## 1. FREE DATABASE OPTIONS

### 1.1 PostgreSQL (Recommended)

#### **Supabase** (Best Option)
- **Free Tier:**
  - 500 MB database storage
  - 2 GB bandwidth/month
  - Unlimited API requests
  - Real-time subscriptions
  - Built-in authentication
  - Auto backups
  - PostgreSQL 15
- **Limits:**
  - 500 MB storage (upgrade to $25/month for 8 GB)
  - 2 GB bandwidth (upgrade for more)
- **Setup:**
  ```bash
  # Install Supabase CLI
  npm install -g supabase
  
  # Initialize project
  supabase init
  
  # Start local development
  supabase start
  ```
- **Connection String:**
  ```
  postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres
  ```
- **Features:**
  - Built-in REST API (auto-generated)
  - Real-time subscriptions
  - Row Level Security (RLS)
  - Storage for files
  - Edge Functions (serverless)
- **Website:** https://supabase.com

#### **Neon** (Serverless PostgreSQL)
- **Free Tier:**
  - 0.5 GB storage
  - Unlimited projects
  - Branching (database branching like Git)
  - Auto-suspend after 5 minutes inactivity
- **Limits:**
  - 0.5 GB storage
  - Auto-suspend (wakes up in ~2 seconds)
- **Setup:**
  ```bash
  # Install Neon CLI
  npm install -g neonctl
  
  # Create project
  neonctl projects create
  ```
- **Connection String:**
  ```
  postgresql://[user]:[password]@[endpoint]/[database]
  ```
- **Website:** https://neon.tech

#### **Railway** (PostgreSQL)
- **Free Tier:**
  - $5 credit/month (enough for small DB)
  - 512 MB RAM
  - 1 GB storage
  - Auto-deploys from GitHub
- **Limits:**
  - $5 credit/month (expires if not used)
  - Sleeps after 7 days inactivity
- **Website:** https://railway.app

#### **ElephantSQL** (PostgreSQL)
- **Free Tier:**
  - 20 MB storage
  - 5 concurrent connections
  - Shared server
- **Limits:**
  - 20 MB storage (very limited)
  - Shared resources
- **Website:** https://www.elephantsql.com

#### **Aiven** (PostgreSQL)
- **Free Tier:**
  - $300 credit for 30 days
  - 1 GB storage
  - After trial: pay-as-you-go
- **Website:** https://aiven.io

### 1.2 MongoDB (Alternative)

#### **MongoDB Atlas**
- **Free Tier (M0):**
  - 512 MB storage
  - Shared RAM
  - No credit card required
  - 500 collections
- **Limits:**
  - 512 MB storage
  - Shared cluster (slower)
- **Connection String:**
  ```
  mongodb+srv://[username]:[password]@cluster0.xxxxx.mongodb.net/futuroo?retryWrites=true&w=majority
  ```
- **Website:** https://www.mongodb.com/cloud/atlas

#### **PlanetScale** (MySQL - Serverless)
- **Free Tier:**
  - 1 database
  - 1 GB storage
  - 1 billion row reads/month
  - 10 million row writes/month
- **Limits:**
  - 1 database
  - 1 GB storage
- **Website:** https://planetscale.com

---

## 2. FREE EMAIL SERVICES

### 2.1 SendGrid
- **Free Tier:**
  - 100 emails/day
  - Forever free
  - No credit card required
- **Limits:**
  - 100 emails/day (3,000/month)
  - SMTP and API access
- **Setup:**
  ```javascript
  const sgMail = require('@sendgrid/mail')
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  
  const msg = {
    to: 'user@example.com',
    from: 'noreply@futuroo.com',
    subject: 'Your letter has arrived!',
    text: 'Your future letter is ready to read.',
    html: '<p>Your future letter is ready to read.</p>'
  }
  
  sgMail.send(msg)
  ```
- **Website:** https://sendgrid.com

### 2.2 Mailgun
- **Free Tier:**
  - 5,000 emails/month (first 3 months)
  - 100 emails/day (after trial)
  - Forever free
- **Limits:**
  - 100 emails/day after trial
  - Requires credit card for trial
- **Website:** https://www.mailgun.com

### 2.3 Resend
- **Free Tier:**
  - 3,000 emails/month
  - 100 emails/day
  - Forever free
  - No credit card required
- **Limits:**
  - 3,000 emails/month
  - 100 emails/day
- **Setup:**
  ```javascript
  import { Resend } from 'resend'
  const resend = new Resend(process.env.RESEND_API_KEY)
  
  await resend.emails.send({
    from: 'noreply@futuroo.com',
    to: 'user@example.com',
    subject: 'Your letter has arrived!',
    html: '<p>Your future letter is ready to read.</p>'
  })
  ```
- **Website:** https://resend.com

### 2.4 Brevo (formerly Sendinblue)
- **Free Tier:**
  - 300 emails/day
  - Forever free
  - No credit card required
- **Limits:**
  - 300 emails/day (9,000/month)
  - SMTP and API access
- **Website:** https://www.brevo.com

### 2.5 AWS SES (Simple Email Service)
- **Free Tier:**
  - 62,000 emails/month (if sending from EC2)
  - 1,000 emails/month (if sending from other services)
  - First 12 months only
- **Limits:**
  - Sandbox mode initially (can only send to verified emails)
  - Need to request production access
- **Website:** https://aws.amazon.com/ses

### 2.6 Gmail SMTP (Free but Limited)
- **Free Tier:**
  - 500 emails/day
  - Requires Gmail account
- **Limits:**
  - 500 emails/day
  - Less reliable for production
  - Requires app password
- **Setup:**
  ```javascript
  const nodemailer = require('nodemailer')
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-app-password'
    }
  })
  ```

---

## 3. FREE HOSTING OPTIONS

### 3.1 Backend Hosting

#### **Render** (Recommended)
- **Free Tier:**
  - 750 hours/month (enough for 24/7)
  - 512 MB RAM
  - Auto-deploy from GitHub
  - Free SSL
  - Custom domains
- **Limits:**
  - Spins down after 15 minutes inactivity
  - Cold start ~30 seconds
  - 512 MB RAM
- **Setup:**
  ```yaml
  # render.yaml
  services:
    - type: web
      name: futuroo-api
      env: node
      buildCommand: npm install
      startCommand: npm start
      envVars:
        - key: DATABASE_URL
          sync: false
  ```
- **Website:** https://render.com

#### **Railway**
- **Free Tier:**
  - $5 credit/month
  - Auto-deploy from GitHub
  - Free SSL
  - Custom domains
- **Limits:**
  - $5 credit/month (expires)
  - Sleeps after 7 days inactivity
- **Website:** https://railway.app

#### **Fly.io**
- **Free Tier:**
  - 3 shared-cpu VMs
  - 3 GB persistent volumes
  - 160 GB outbound data/month
- **Limits:**
  - Shared resources
  - 3 VMs max
- **Website:** https://fly.io

#### **Heroku** (Limited Free Tier)
- **Free Tier:**
  - Discontinued (now paid only)
  - Alternative: Use Render or Railway

#### **Vercel** (Serverless - Best for Node.js)
- **Free Tier:**
  - Unlimited serverless functions
  - 100 GB bandwidth/month
  - Free SSL
  - Auto-deploy from GitHub
- **Limits:**
  - 10 seconds execution time (Hobby)
  - 50 MB function size
- **Setup:**
  ```javascript
  // api/letters.js
  export default async function handler(req, res) {
    // Your API logic
  }
  ```
- **Website:** https://vercel.com

#### **Netlify Functions**
- **Free Tier:**
  - 125,000 requests/month
  - 100 hours execution/month
  - Free SSL
- **Limits:**
  - 10 seconds execution time
  - 50 MB function size
- **Website:** https://www.netlify.com

#### **Glitch**
- **Free Tier:**
  - Always-on option (limited)
  - Auto-deploy from GitHub
  - Free SSL
- **Limits:**
  - Sleeps after inactivity
  - Limited resources
- **Website:** https://glitch.com

#### **Cyclic** (Serverless)
- **Free Tier:**
  - Unlimited requests
  - Auto-deploy from GitHub
  - Free SSL
- **Limits:**
  - Shared resources
  - 10 seconds execution time
- **Website:** https://cyclic.sh

### 3.2 Frontend Hosting (Already Using Vite)

#### **Vercel** (Recommended)
- **Free Tier:**
  - Unlimited deployments
  - 100 GB bandwidth/month
  - Free SSL
  - Auto-deploy from GitHub
- **Website:** https://vercel.com

#### **Netlify**
- **Free Tier:**
  - 100 GB bandwidth/month
  - 300 build minutes/month
  - Free SSL
- **Website:** https://www.netlify.com

#### **Cloudflare Pages**
- **Free Tier:**
  - Unlimited bandwidth
  - Unlimited requests
  - Free SSL
- **Website:** https://pages.cloudflare.com

---

## 4. FREE CACHING & REDIS

### 4.1 Upstash Redis
- **Free Tier:**
  - 10,000 commands/day
  - 256 MB storage
  - Global replication
- **Limits:**
  - 10,000 commands/day
  - 256 MB storage
- **Connection:**
  ```javascript
  import { Redis } from '@upstash/redis'
  
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  })
  ```
- **Website:** https://upstash.com

### 4.2 Redis Cloud
- **Free Tier:**
  - 30 MB storage
  - 30 connections
- **Limits:**
  - 30 MB storage
  - Shared resources
- **Website:** https://redis.com/try-free

---

## 5. FREE PAYMENT PROCESSING

### 5.1 Stripe
- **Free Tier:**
  - No monthly fee
  - 2.9% + $0.30 per transaction
  - Test mode (unlimited)
- **Limits:**
  - Only charges on successful transactions
  - Test mode completely free
- **Setup:**
  ```javascript
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
  
  // Create subscription
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
  })
  ```
- **Website:** https://stripe.com

### 5.2 PayPal
- **Free Tier:**
  - No monthly fee
  - 2.9% + $0.30 per transaction
- **Website:** https://www.paypal.com

---

## 6. FREE CONTENT MODERATION

### 6.1 Google Perspective API
- **Free Tier:**
  - 1 request/second
  - 1,000 requests/day
- **Limits:**
  - Rate limited
  - Requires Google Cloud account
- **Website:** https://www.perspectiveapi.com

### 6.2 Custom Implementation
- **Free:**
  - Use word lists (like in frontend)
  - No API costs
  - Unlimited usage

---

## 7. FREE BACKGROUND JOBS

### 7.1 GitHub Actions (Cron Jobs)
- **Free Tier:**
  - 2,000 minutes/month (private repos)
  - Unlimited (public repos)
- **Limits:**
  - 2,000 minutes/month for private
- **Setup:**
  ```yaml
  # .github/workflows/deliver-letters.yml
  name: Deliver Letters
  on:
    schedule:
      - cron: '0 * * * *' # Every hour
  jobs:
    deliver:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v2
        - name: Deliver letters
          run: |
            curl -X POST https://your-api.com/internal/letters/deliver \
              -H "Authorization: Bearer ${{ secrets.API_KEY }}"
  ```

### 7.2 Cron-job.org
- **Free Tier:**
  - 1 job every 5 minutes
  - HTTP requests only
- **Limits:**
  - 1 job per account
  - 5 minute minimum interval
- **Website:** https://cron-job.org

### 7.3 EasyCron
- **Free Tier:**
  - 1 job
  - 1 execution per hour
- **Limits:**
  - Very limited
- **Website:** https://www.easycron.com

---

## 8. COMPLETE FREE STACK RECOMMENDATION

### **Recommended Free Stack:**

1. **Database:** Supabase (PostgreSQL) - 500 MB free
2. **Backend Hosting:** Render or Vercel - Free tier
3. **Frontend Hosting:** Vercel or Netlify - Free tier
4. **Email:** Resend or Brevo - 3,000-9,000 emails/month free
5. **Caching:** Upstash Redis - 10,000 commands/day free
6. **Payments:** Stripe - No monthly fee, pay per transaction
7. **Content Moderation:** Custom word list (free)
8. **Background Jobs:** GitHub Actions (for cron) or Render Cron Jobs

### **Estimated Monthly Cost: $0**

---

## 9. IMPLEMENTATION EXAMPLES

### 9.1 Database Setup with Supabase

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Letters table
CREATE TABLE letters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  delivery_type VARCHAR(20) CHECK (delivery_type IN ('date', 'open-when')),
  delivery_date DATE,
  open_when_trigger VARCHAR(50),
  mood VARCHAR(10),
  identity VARCHAR(50),
  is_public BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'delivered')),
  is_opened BOOLEAN DEFAULT FALSE,
  opened_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  plan VARCHAR(20) CHECK (plan IN ('free', 'monthly', 'yearly', 'lifetime')),
  expires_at TIMESTAMP,
  purchased_at TIMESTAMP DEFAULT NOW(),
  cancelled_at TIMESTAMP,
  stripe_subscription_id VARCHAR(255)
);

-- Public letter reactions
CREATE TABLE letter_reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  letter_id UUID REFERENCES letters(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  reaction VARCHAR(20) CHECK (reaction IN ('felt', 'helped', 'alone')),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(letter_id, user_id, reaction)
);
```

### 9.2 Email Service with Resend

```javascript
// utils/email.js
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendLetterDeliveryEmail(userEmail, letterTitle) {
  try {
    await resend.emails.send({
      from: 'FUTUROO <noreply@futuroo.com>',
      to: userEmail,
      subject: 'Your letter has arrived! 📬',
      html: `
        <h1>Your letter has arrived!</h1>
        <p>Your letter "${letterTitle}" is ready to read.</p>
        <a href="https://futuroo.com/letters">Open Letter</a>
      `
    })
  } catch (error) {
    console.error('Email send failed:', error)
  }
}
```

### 9.3 Background Job with GitHub Actions

```yaml
# .github/workflows/deliver-letters.yml
name: Deliver Scheduled Letters

on:
  schedule:
    - cron: '0 * * * *' # Every hour
  workflow_dispatch: # Manual trigger

jobs:
  deliver:
    runs-on: ubuntu-latest
    steps:
      - name: Deliver letters
        run: |
          curl -X POST ${{ secrets.API_URL }}/internal/letters/deliver \
            -H "Authorization: Bearer ${{ secrets.API_SECRET_KEY }}" \
            -H "Content-Type: application/json"
```

---

## 10. MONITORING & ANALYTICS (FREE)

### 10.1 Uptime Monitoring
- **UptimeRobot:** 50 monitors free
- **Pingdom:** 1 check free
- **StatusCake:** Unlimited checks free

### 10.2 Error Tracking
- **Sentry:** 5,000 events/month free
- **Rollbar:** 5,000 events/month free

### 10.3 Analytics
- **Google Analytics:** Free, unlimited
- **Plausible:** Limited free tier

---

## 11. SECURITY (FREE)

### 11.1 SSL Certificates
- **Let's Encrypt:** Free, auto-renewal
- **Cloudflare:** Free SSL for all sites

### 11.2 DDoS Protection
- **Cloudflare:** Free tier includes DDoS protection

---

## 12. STORAGE (If Needed for Audio Letters)

### 12.1 Cloudflare R2
- **Free Tier:** 10 GB storage, 1 million Class A operations/month
- **Website:** https://www.cloudflare.com/products/r2

### 12.2 Backblaze B2
- **Free Tier:** 10 GB storage, 1 GB download/day
- **Website:** https://www.backblaze.com/b2/cloud-storage.html

---

## SUMMARY: 100% FREE STACK

| Service | Provider | Free Tier Limits |
|---------|----------|------------------|
| **Database** | Supabase | 500 MB, 2 GB bandwidth |
| **Backend Hosting** | Render | 750 hours/month, 512 MB RAM |
| **Frontend Hosting** | Vercel | Unlimited, 100 GB bandwidth |
| **Email** | Resend | 3,000 emails/month |
| **Caching** | Upstash | 10,000 commands/day |
| **Payments** | Stripe | No monthly fee |
| **Background Jobs** | GitHub Actions | 2,000 minutes/month |
| **SSL** | Let's Encrypt | Free forever |
| **Monitoring** | UptimeRobot | 50 monitors |

**Total Monthly Cost: $0.00** 🎉

---

## QUICK START GUIDE

1. **Create Supabase project** → Get database URL
2. **Create Render account** → Deploy backend
3. **Create Vercel account** → Deploy frontend
4. **Create Resend account** → Get API key
5. **Create Stripe account** → Get API keys
6. **Set up GitHub Actions** → For letter delivery cron

All free, all production-ready! 🚀

---

## Additional Features to Consider:

1. **Email Notifications**:
   - Letter delivery notifications
   - Subscription expiry reminders
   - Welcome emails

2. **Analytics Endpoints** (Admin):
   - User statistics
   - Letter statistics
   - Subscription metrics

3. **Admin Endpoints**:
   - User management
   - Content moderation review
   - Subscription management

4. **Webhooks**:
   - Stripe payment webhooks
   - Email delivery webhooks
