# FUTUROO - Deployment & Frontend-Backend Connection Guide

## What is Vite?

**Vite** (pronounced "veet", French for "fast") is a modern build tool and development server for frontend applications.

### Why Vite?
- ⚡ **Lightning Fast**: Uses native ES modules, no bundling during development
- 🔥 **Hot Module Replacement (HMR)**: Instant updates without page refresh
- 📦 **Optimized Production Builds**: Uses Rollup for production bundling
- 🎯 **Simple Configuration**: Works out of the box with minimal config

### How Vite Works:
1. **Development**: Serves files directly via ES modules (very fast)
2. **Production**: Bundles everything into optimized static files

---

## Frontend Deployment Options

### Option 1: Vercel (Recommended - Easiest) ✅ 100% FREE

**Free Tier Details:**
- ✅ Unlimited deployments
- ✅ 100 GB bandwidth/month
- ✅ Free SSL certificates
- ✅ Custom domains
- ✅ Automatic deployments from GitHub
- ✅ No credit card required
- ✅ No time limits
- ✅ Forever free for personal projects

**Limits:**
- 100 GB bandwidth/month (usually enough for thousands of visitors)
- Serverless functions: 10 seconds execution time (Hobby plan)
- 50 MB function size limit

**Cost:** $0/month forever

#### Step 1: Prepare for Deployment
```bash
# Build the production version
npm run build
```

This creates a `dist` folder with optimized static files.

#### Step 2: Deploy to Vercel

**Method A: Via Vercel CLI**
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? futuroo
# - Directory? ./
# - Override settings? No
```

**Method B: Via GitHub (Recommended)**
1. Push your code to GitHub
2. Go to https://vercel.com
3. Click "New Project"
4. Import your GitHub repository
5. Vercel auto-detects Vite
6. Click "Deploy"

**Vercel Configuration:**
```json
// vercel.json (optional)
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

**Environment Variables:**
In Vercel dashboard → Settings → Environment Variables:
```
VITE_API_URL=https://your-backend-api.com/api/v1
```

#### Step 3: Custom Domain (Optional)
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records as instructed

---

### Option 2: Netlify ✅ 100% FREE

**Free Tier Details:**
- ✅ 100 GB bandwidth/month
- ✅ 300 build minutes/month
- ✅ Free SSL certificates
- ✅ Custom domains
- ✅ Automatic deployments from GitHub
- ✅ No credit card required
- ✅ No time limits
- ✅ Forever free

**Limits:**
- 100 GB bandwidth/month
- 300 build minutes/month (usually enough for ~300 builds)
- Serverless functions: 10 seconds execution time
- 50 MB function size limit

**Cost:** $0/month forever

#### Step 1: Build
```bash
npm run build
```

#### Step 2: Deploy

**Method A: Drag & Drop**
1. Go to https://app.netlify.com
2. Drag the `dist` folder to Netlify
3. Done!

**Method B: Via GitHub**
1. Push to GitHub
2. Connect Netlify to your repo
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`

**Netlify Configuration:**
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

### Option 3: Cloudflare Pages ✅ 100% FREE

**Free Tier Details:**
- ✅ Unlimited bandwidth (yes, unlimited!)
- ✅ Unlimited requests
- ✅ Free SSL certificates
- ✅ Custom domains
- ✅ Automatic deployments from GitHub
- ✅ No credit card required
- ✅ No time limits
- ✅ Forever free

**Limits:**
- 500 builds/month (usually more than enough)
- 20 minutes build time per build

**Cost:** $0/month forever

1. Push code to GitHub
2. Go to https://pages.cloudflare.com
3. Connect repository
4. Build settings:
   - Framework preset: Vite
   - Build command: `npm run build`
   - Build output directory: `dist`

---

### Option 4: GitHub Pages ✅ 100% FREE

**Free Tier Details:**
- ✅ Unlimited bandwidth
- ✅ Free SSL certificates
- ✅ Custom domains
- ✅ Automatic deployments from GitHub
- ✅ No credit card required
- ✅ No time limits
- ✅ Forever free (if repo is public)

**Limits:**
- Only works with public repositories (free)
- Private repos require GitHub Pro ($4/month)
- 1 GB repository size limit
- 100 GB bandwidth/month (soft limit)

**Cost:** $0/month (public repos) or $4/month (private repos)

#### Step 1: Update vite.config.js
```javascript
export default {
  base: '/futuroo/', // Your repo name
  // ... rest of config
}
```

#### Step 2: Install gh-pages
```bash
npm install --save-dev gh-pages
```

#### Step 3: Add deploy script to package.json
```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

#### Step 4: Deploy
```bash
npm run deploy
```

---

## Connecting Frontend to Backend

### Step 1: Create API Configuration

Create `src/config/api.js`:
```javascript
// src/config/api.js

// Get API URL from environment variable or use default
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'

export const apiConfig = {
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
}

// Helper function to get auth token
export const getAuthToken = () => {
  const user = localStorage.getItem('futuroo_user')
  if (user) {
    const userData = JSON.parse(user)
    return userData.token // Assuming backend returns token
  }
  return null
}

// API request helper
export const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken()
  
  const config = {
    ...apiConfig.headers,
    ...options.headers,
  }
  
  if (token) {
    config.Authorization = `Bearer ${token}`
  }
  
  try {
    const response = await fetch(`${apiConfig.baseURL}${endpoint}`, {
      ...options,
      headers: config,
    })
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('API Request Error:', error)
    throw error
  }
}
```

### Step 2: Create API Service Layer

Create `src/services/api.js`:
```javascript
// src/services/api.js
import { apiRequest } from '../config/api'

// Authentication APIs
export const authAPI = {
  register: (userData) => 
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  
  login: (credentials) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  
  getCurrentUser: () =>
    apiRequest('/auth/me'),
  
  updateEmail: (email) =>
    apiRequest('/auth/email', {
      method: 'PUT',
      body: JSON.stringify({ email }),
    }),
  
  changePassword: (passwords) =>
    apiRequest('/auth/password', {
      method: 'PUT',
      body: JSON.stringify(passwords),
    }),
}

// Letters APIs
export const lettersAPI = {
  getAll: (type = 'drafts', page = 1, limit = 20) =>
    apiRequest(`/letters?type=${type}&page=${page}&limit=${limit}`),
  
  getById: (letterId) =>
    apiRequest(`/letters/${letterId}`),
  
  createDraft: (draftData) =>
    apiRequest('/letters/drafts', {
      method: 'POST',
      body: JSON.stringify(draftData),
    }),
  
  updateDraft: (draftId, draftData) =>
    apiRequest(`/letters/drafts/${draftId}`, {
      method: 'PUT',
      body: JSON.stringify(draftData),
    }),
  
  deleteDraft: (draftId) =>
    apiRequest(`/letters/drafts/${draftId}`, {
      method: 'DELETE',
    }),
  
  schedule: (letterData) =>
    apiRequest('/letters/schedule', {
      method: 'POST',
      body: JSON.stringify(letterData),
    }),
  
  open: (letterId) =>
    apiRequest(`/letters/${letterId}/open`, {
      method: 'POST',
    }),
  
  markOpened: (letterId) =>
    apiRequest(`/letters/${letterId}/opened`, {
      method: 'PUT',
    }),
}

// Public Letters APIs
export const publicLettersAPI = {
  getAll: (filter = 'latest', search = '', page = 1) =>
    apiRequest(`/public-letters?filter=${filter}&search=${search}&page=${page}`),
  
  getById: (letterId) =>
    apiRequest(`/public-letters/${letterId}`),
  
  like: (letterId) =>
    apiRequest(`/public-letters/${letterId}/like`, {
      method: 'POST',
    }),
  
  save: (letterId) =>
    apiRequest(`/public-letters/${letterId}/save`, {
      method: 'POST',
    }),
  
  addReaction: (letterId, reaction) =>
    apiRequest(`/public-letters/${letterId}/reactions`, {
      method: 'POST',
      body: JSON.stringify({ reaction }),
    }),
  
  getSaved: () =>
    apiRequest('/public-letters/saved'),
}

// Instant Letters APIs
export const instantLettersAPI = {
  send: (letterData) =>
    apiRequest('/instant-letters', {
      method: 'POST',
      body: JSON.stringify(letterData),
    }),
  
  getAll: (type = 'sent', page = 1) =>
    apiRequest(`/instant-letters?type=${type}&page=${page}`),
}

// Subscription APIs
export const subscriptionAPI = {
  getCurrent: () =>
    apiRequest('/subscriptions'),
  
  subscribe: (plan, paymentMethodId) =>
    apiRequest('/subscriptions', {
      method: 'POST',
      body: JSON.stringify({ plan, paymentMethodId }),
    }),
  
  cancel: () =>
    apiRequest('/subscriptions', {
      method: 'DELETE',
    }),
  
  getPlans: () =>
    apiRequest('/subscriptions/plans'),
}

// Letter Limits APIs
export const limitsAPI = {
  getCount: () =>
    apiRequest('/letters/count'),
  
  canCreate: () =>
    apiRequest('/letters/can-create'),
}

// Content Moderation API
export const moderationAPI = {
  check: (content) =>
    apiRequest('/moderation/check', {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),
}
```

### Step 3: Update Login Component to Use API

Update `src/pages/Login.jsx`:
```javascript
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, LogIn } from 'lucide-react'
import { authAPI } from '../services/api'

const Login = ({ onLogin }) => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await authAPI.login({ email, password })
      
      // Store token and user data
      localStorage.setItem('futuroo_user', JSON.stringify({
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        token: response.token, // Store JWT token
      }))
      
      onLogin(response.user)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  // ... rest of component
}
```

### Step 4: Update WriteLater Component

Update `src/pages/WriteLater.jsx` to use API:
```javascript
import { lettersAPI } from '../services/api'

// In component:
const handleSend = async () => {
  if (!title || !content) {
    alert('Please fill in title and content')
    return
  }

  try {
    const letterData = {
      title,
      content,
      deliveryType,
      deliveryDate: deliveryType === 'date' ? deliveryDate : null,
      openWhenTrigger: deliveryType === 'open-when' ? openWhenTrigger : null,
      mood,
      identity,
      isPublic,
    }

    const response = await lettersAPI.schedule(letterData)
    alert('Letter scheduled successfully!')
    
    // Clear form
    setTitle('')
    setContent('')
    // ... reset other fields
  } catch (error) {
    alert('Failed to schedule letter: ' + error.message)
  }
}
```

### Step 5: Environment Variables

Create `.env` file for development:
```env
# .env
VITE_API_URL=http://localhost:3000/api/v1
```

Create `.env.production` for production:
```env
# .env.production
VITE_API_URL=https://your-backend-api.com/api/v1
```

**Important:** Vite requires `VITE_` prefix for environment variables to be exposed to the frontend.

### Step 6: Update App.jsx to Check Auth

```javascript
// src/App.jsx
import { useEffect } from 'react'
import { authAPI } from './services/api'

function App() {
  const [user, setUser] = useState(null)
  const [subscription, setSubscription] = useState(null)

  useEffect(() => {
    // Check if user has token
    const storedUser = localStorage.getItem('futuroo_user')
    if (storedUser) {
      const userData = JSON.parse(storedUser)
      
      // Verify token with backend
      authAPI.getCurrentUser()
        .then(user => {
          setUser(user)
          // Load subscription
        })
        .catch(() => {
          // Token invalid, clear storage
          localStorage.removeItem('futuroo_user')
        })
    }
  }, [])

  // ... rest of component
}
```

---

## CORS Configuration (Backend)

Your backend needs to allow requests from your frontend domain.

### Example (Node.js/Express):
```javascript
const cors = require('cors')

app.use(cors({
  origin: [
    'http://localhost:5173', // Vite dev server
    'https://futuroo.vercel.app', // Production frontend
    'https://futuroo.netlify.app', // Alternative domain
  ],
  credentials: true,
}))
```

### Example (Python/Flask):
```python
from flask_cors import CORS

CORS(app, origins=[
    "http://localhost:5173",
    "https://futuroo.vercel.app",
])
```

---

## Complete Deployment Workflow

### 1. Development Setup
```bash
# Frontend
npm run dev  # Runs on http://localhost:5173

# Backend (separate terminal)
# Your backend should run on http://localhost:3000
```

### 2. Production Build
```bash
# Build frontend
npm run build

# Test production build locally
npm run preview  # Runs on http://localhost:4173
```

### 3. Deploy Frontend
```bash
# Option A: Vercel
vercel

# Option B: Netlify
netlify deploy --prod

# Option C: Manual upload dist/ folder
```

### 4. Deploy Backend
```bash
# Deploy to Render/Railway/Vercel
# Make sure to set environment variables:
# - DATABASE_URL
# - JWT_SECRET
# - STRIPE_SECRET_KEY
# - EMAIL_API_KEY
```

### 5. Update Frontend Environment
```bash
# In Vercel/Netlify dashboard:
# Set VITE_API_URL=https://your-backend-api.com/api/v1
```

---

## Testing the Connection

### Test Script
```javascript
// test-api.js
const API_URL = 'https://your-backend-api.com/api/v1'

async function testConnection() {
  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        'Authorization': 'Bearer YOUR_TOKEN'
      }
    })
    console.log('Connection successful:', await response.json())
  } catch (error) {
    console.error('Connection failed:', error)
  }
}

testConnection()
```

---

## Troubleshooting

### Issue: CORS Error
**Solution:** Update backend CORS settings to include your frontend domain

### Issue: 401 Unauthorized
**Solution:** Check if token is being sent correctly in Authorization header

### Issue: Environment Variables Not Working
**Solution:** 
- Make sure variables start with `VITE_`
- Rebuild after changing `.env` files
- Check deployment platform environment variables

### Issue: API URL Not Found
**Solution:**
- Check `VITE_API_URL` is set correctly
- Verify backend is running and accessible
- Check network tab in browser DevTools

---

## Quick Reference

### Frontend Commands
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Backend Integration Checklist
- [ ] Create API service layer
- [ ] Update components to use API calls
- [ ] Set up environment variables
- [ ] Configure CORS on backend
- [ ] Test API connection
- [ ] Deploy frontend
- [ ] Deploy backend
- [ ] Update production environment variables

---

## Example: Complete API Integration

See `src/services/api.js` for all API methods. Replace all `localStorage` operations with API calls:

**Before (localStorage):**
```javascript
const users = JSON.parse(localStorage.getItem('futuroo_users') || '[]')
```

**After (API):**
```javascript
const response = await authAPI.getCurrentUser()
const user = response.user
```

This guide covers everything you need to deploy and connect your frontend to the backend! 🚀
