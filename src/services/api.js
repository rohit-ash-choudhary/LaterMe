// API Service Layer - All API calls go through here
import { apiRequest, getUserId } from '../config/api'

// Authentication APIs
export const authAPI = {
  register: (userData) => 
    apiRequest('/v1/auth/register', {
      method: 'POST',
      body: userData,
    }),
  
  login: (credentials) =>
    apiRequest('/v1/auth/login', {
      method: 'POST',
      body: credentials,
    }),
  
  googleLogin: (idToken) =>
    apiRequest('/auth/google', {
      method: 'POST',
      body: { idToken },
    }),
  
  getCurrentUser: () =>
    apiRequest('/auth/me'),
  
  changePassword: (passwords) =>
    apiRequest('/v1/auth/password', {
      method: 'POST',
      body: passwords,
    }),
  
  deleteAccount: () =>
    apiRequest('/v1/auth/account', {
      method: 'DELETE',
    }),

  verifyEmail: (userId, otpCode) => {
    return apiRequest('/v1/auth/verify-email', {
      method: 'POST',
      headers: {
        'userId': userId.toString(),
      },
      body: { otpCode },
    })
  },

  resendOtp: (userId) => {
    if (!userId) {
      throw new Error('User not logged in')
    }
    return apiRequest('/v1/auth/resend-otp', {
      method: 'POST',
      headers: {
        'userId': userId.toString(),
      },
    })
  },
}

// Letters APIs (Write Later - Future Letters)
export const lettersAPI = {
  getAll: (type = 'drafts') => {
    const userId = getUserId()
    if (!userId) {
      throw new Error('User not logged in')
    }
    return apiRequest(`/letters?type=${type}`, {
      headers: {
        'userId': userId.toString(),
      },
    })
  },
  
  getById: (letterId) => {
    const userId = getUserId()
    if (!userId) {
      throw new Error('User not logged in')
    }
    return apiRequest(`/letters/${letterId}`, {
      headers: {
        'userId': userId.toString(),
      },
    })
  },
  
  createDraft: (draftData) => {
    const userId = getUserId()
    if (!userId) {
      throw new Error('User not logged in')
    }
    return apiRequest('/letters/drafts', {
      method: 'POST',
      headers: {
        'userId': userId.toString(),
      },
      body: draftData,
    })
  },
  
  updateDraft: (draftId, draftData) => {
    const userId = getUserId()
    if (!userId) {
      throw new Error('User not logged in')
    }
    return apiRequest(`/letters/drafts/${draftId}`, {
      method: 'PUT',
      headers: {
        'userId': userId.toString(),
      },
      body: draftData,
    })
  },
  
  deleteDraft: (draftId) => {
    const userId = getUserId()
    if (!userId) {
      throw new Error('User not logged in')
    }
    return apiRequest(`/letters/drafts/${draftId}`, {
      method: 'DELETE',
      headers: {
        'userId': userId.toString(),
      },
    })
  },
  
  schedule: (letterData) => {
    const userId = getUserId()
    if (!userId) {
      throw new Error('User not logged in')
    }
    return apiRequest('/letters/schedule', {
      method: 'POST',
      headers: {
        'userId': userId.toString(),
      },
      body: letterData,
    })
  },
  
  open: (letterId, currentMood = null) => {
    const userId = getUserId()
    if (!userId) {
      throw new Error('User not logged in')
    }
    const body = currentMood ? { currentMood } : {}
    return apiRequest(`/letters/${letterId}/open`, {
      method: 'POST',
      headers: {
        'userId': userId.toString(),
      },
      body: Object.keys(body).length > 0 ? body : undefined,
    })
  },
  
  markOpened: (letterId) => {
    const userId = getUserId()
    if (!userId) {
      throw new Error('User not logged in')
    }
    return apiRequest(`/letters/${letterId}/opened`, {
      method: 'PUT',
      headers: {
        'userId': userId.toString(),
      },
    })
  },
}

// Public Letters APIs
export const publicLettersAPI = {
  getAll: (filter = 'latest', search = '') => {
    const userId = getUserId()
    const headers = userId ? { 'userId': userId.toString() } : {}
    return apiRequest(`/public-letters?filter=${filter}&search=${encodeURIComponent(search)}`, {
      headers,
    }).then(response => response.letters || [])
  },
  
  getById: (letterId) => {
    const userId = getUserId()
    return apiRequest(`/public-letters/${letterId}`, {
      headers: userId ? { 'userId': userId.toString() } : {},
    })
  },
  
  like: (letterId) => {
    const userId = getUserId()
    if (!userId) {
      throw new Error('User not logged in')
    }
    return apiRequest(`/public-letters/${letterId}/like`, {
      method: 'POST',
      headers: {
        'userId': userId.toString(),
      },
    })
  },
  
  unlike: (letterId) => {
    const userId = getUserId()
    if (!userId) {
      throw new Error('User not logged in')
    }
    return apiRequest(`/public-letters/${letterId}/like`, {
      method: 'DELETE',
      headers: {
        'userId': userId.toString(),
      },
    })
  },
  
  save: (letterId) => {
    const userId = getUserId()
    if (!userId) {
      throw new Error('User not logged in')
    }
    return apiRequest(`/public-letters/${letterId}/save`, {
      method: 'POST',
      headers: {
        'userId': userId.toString(),
      },
    })
  },
  
  unsave: (letterId) => {
    const userId = getUserId()
    if (!userId) {
      throw new Error('User not logged in')
    }
    return apiRequest(`/public-letters/${letterId}/save`, {
      method: 'DELETE',
      headers: {
        'userId': userId.toString(),
      },
    })
  },
  
  getSaved: () => {
    const userId = getUserId()
    if (!userId) {
      throw new Error('User not logged in')
    }
    return apiRequest('/public-letters/saved', {
      headers: {
        'userId': userId.toString(),
      },
    }).then(response => response.letters || [])
  },
}

// Letters to Someone Else APIs (Write Letter to Someone Else)
export const lettersToSomeoneElseAPI = {
  send: (letterData) => {
    const userId = getUserId()
    if (!userId) {
      throw new Error('User not logged in')
    }
    return apiRequest('/letters-to-someone-else', {
      method: 'POST',
      headers: {
        'userId': userId.toString(),
      },
      body: letterData,
    })
  },
  
  getAll: () => {
    const userId = getUserId()
    if (!userId) {
      throw new Error('User not logged in')
    }
    return apiRequest('/letters-to-someone-else', {
      headers: {
        'userId': userId.toString(),
      },
    })
  },
  
  retry: (letterId) => {
    const userId = getUserId()
    if (!userId) {
      throw new Error('User not logged in')
    }
    return apiRequest(`/letters-to-someone-else/${letterId}/retry`, {
      method: 'POST',
      headers: {
        'userId': userId.toString(),
      },
    })
  },
}

// Keep old name for backward compatibility
export const instantLettersAPI = lettersToSomeoneElseAPI

// Subscription APIs
export const subscriptionAPI = {
  getCurrent: () =>
    apiRequest('/subscriptions'),
  
  subscribe: (plan, paymentMethodId) =>
    apiRequest('/subscriptions', {
      method: 'POST',
      body: { plan, paymentMethodId },
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
      body: { content },
    }),
}
