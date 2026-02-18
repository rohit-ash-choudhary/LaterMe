// Subscription utility functions
// NOTE: Subscription storage has been removed. All subscription logic will be handled by backend API in the future.

export const FREE_LETTER_LIMIT = 10
export const PRICING = {
  monthly: { price: 1, name: 'Monthly', period: 'month' },
  yearly: { price: 8, name: 'Yearly', period: 'year' },
  lifetime: { price: 50, name: 'Lifetime', period: 'lifetime' },
}

// Get user subscription status
// TODO: This will be replaced with backend API call
export const getUserSubscription = (userId) => {
  // Subscription storage removed - will be handled by backend
  // For now, return free plan
  return { plan: 'free', expiresAt: null, purchasedAt: null }
}

// Set user subscription
// TODO: This will be replaced with backend API call
export const setUserSubscription = (userId, plan, purchasedAt = null) => {
  // Subscription storage removed - will be handled by backend
  console.warn('setUserSubscription: Subscription storage removed. This will be handled by backend API.')
  return { plan, expiresAt: null, purchasedAt: purchasedAt || new Date().toISOString() }
}

// Check if subscription is active
// TODO: This will be replaced with backend API call
// For now, allowing unlimited letters until payment system is implemented
export const isSubscriptionActive = (userId) => {
  // Temporarily return true to allow unlimited letters
  // This will be replaced with backend API call once payment system is ready
  return false // Set to false to enforce free plan limits
}

// Get user's letter count from backend
// TODO: This should fetch from backend API
export const getUserLetterCount = async (userId) => {
  if (!userId) return 0
  
  // This should be replaced with backend API call
  // For now, return 0 as letters are stored in backend
  return 0
}

// Check if user can create more letters
// TODO: This will be replaced with backend API call
export const canCreateLetter = (userId) => {
  if (!userId) return false
  
  // Temporarily allowing unlimited letters until payment system is implemented
  // This will be replaced with backend API call
  // For now, check against free limit
  // TODO: Fetch actual letter count from backend
  return true // Allow unlimited for now
}

// Get remaining free letters
// TODO: This will be replaced with backend API call
export const getRemainingFreeLetters = (userId) => {
  if (!userId) return 0
  
  // Temporarily showing unlimited until payment system is implemented
  // This will be replaced with backend API call
  // TODO: Fetch actual letter count from backend
  return 'Unlimited' // Show unlimited for now
}
