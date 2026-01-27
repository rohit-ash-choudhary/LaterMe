// Subscription utility functions

export const FREE_LETTER_LIMIT = 10
export const PRICING = {
  monthly: { price: 1, name: 'Monthly', period: 'month' },
  yearly: { price: 8, name: 'Yearly', period: 'year' },
  lifetime: { price: 50, name: 'Lifetime', period: 'lifetime' },
}

// Get user subscription status
export const getUserSubscription = (userId) => {
  const subscriptions = JSON.parse(localStorage.getItem('futuroo_subscriptions') || '{}')
  return subscriptions[userId] || { plan: 'free', expiresAt: null, purchasedAt: null }
}

// Set user subscription
export const setUserSubscription = (userId, plan, purchasedAt = null) => {
  const subscriptions = JSON.parse(localStorage.getItem('futuroo_subscriptions') || '{}')
  let expiresAt = null
  
  if (plan === 'monthly') {
    expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
  } else if (plan === 'yearly') {
    expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 365 days from now
  } else if (plan === 'lifetime') {
    expiresAt = null // lifetime never expires
  }
  
  subscriptions[userId] = {
    plan,
    expiresAt,
    purchasedAt: purchasedAt || new Date().toISOString(),
  }
  
  localStorage.setItem('futuroo_subscriptions', JSON.stringify(subscriptions))
  return subscriptions[userId]
}

// Check if subscription is active
export const isSubscriptionActive = (userId) => {
  const subscription = getUserSubscription(userId)
  
  if (subscription.plan === 'free') return false
  if (subscription.plan === 'lifetime') return true
  if (subscription.plan === 'monthly' || subscription.plan === 'yearly') {
    if (!subscription.expiresAt) return false
    return new Date(subscription.expiresAt) > new Date()
  }
  return false
}

// Get user's letter count
export const getUserLetterCount = (userId) => {
  const allDrafts = JSON.parse(localStorage.getItem('futuroo_drafts') || '[]')
  const allScheduled = JSON.parse(localStorage.getItem('futuroo_scheduled') || '[]')
  const allDelivered = JSON.parse(localStorage.getItem('futuroo_delivered') || '[]')
  const allInstant = JSON.parse(localStorage.getItem('futuroo_instant') || '[]')
  
  // Filter by user ID (in a real app, letters would have userId)
  // For now, we'll count all letters if user is logged in
  const totalLetters = allDrafts.length + allScheduled.length + allDelivered.length + allInstant.length
  return totalLetters
}

// Check if user can create more letters
export const canCreateLetter = (userId) => {
  if (!userId) return false
  
  const subscription = getUserSubscription(userId)
  const isActive = isSubscriptionActive(userId)
  
  if (isActive) return true // Premium users have unlimited
  
  const letterCount = getUserLetterCount(userId)
  return letterCount < FREE_LETTER_LIMIT
}

// Get remaining free letters
export const getRemainingFreeLetters = (userId) => {
  if (!userId) return 0
  
  const subscription = getUserSubscription(userId)
  const isActive = isSubscriptionActive(userId)
  
  if (isActive) return 'Unlimited'
  
  const letterCount = getUserLetterCount(userId)
  return Math.max(0, FREE_LETTER_LIMIT - letterCount)
}
