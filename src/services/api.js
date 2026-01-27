// API Service Layer - All API calls go through here
import { apiRequest } from '../config/api'

// Authentication APIs
export const authAPI = {
  register: (userData) => 
    apiRequest('/auth/register', {
      method: 'POST',
      body: userData,
    }),
  
  login: (credentials) =>
    apiRequest('/auth/login', {
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
  
  updateEmail: (email) =>
    apiRequest('/auth/email', {
      method: 'PUT',
      body: { email },
    }),
  
  changePassword: (passwords) =>
    apiRequest('/auth/password', {
      method: 'PUT',
      body: passwords,
    }),
  
  deleteAccount: () =>
    apiRequest('/auth/account', {
      method: 'DELETE',
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
      body: draftData,
    }),
  
  updateDraft: (draftId, draftData) =>
    apiRequest(`/letters/drafts/${draftId}`, {
      method: 'PUT',
      body: draftData,
    }),
  
  deleteDraft: (draftId) =>
    apiRequest(`/letters/drafts/${draftId}`, {
      method: 'DELETE',
    }),
  
  schedule: (letterData) =>
    apiRequest('/letters/schedule', {
      method: 'POST',
      body: letterData,
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
    apiRequest(`/public-letters?filter=${filter}&search=${encodeURIComponent(search)}&page=${page}`),
  
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
      body: { reaction },
    }),
  
  removeReaction: (letterId, reactionId) =>
    apiRequest(`/public-letters/${letterId}/reactions/${reactionId}`, {
      method: 'DELETE',
    }),
  
  getSaved: () =>
    apiRequest('/public-letters/saved'),
}

// Instant Letters APIs
export const instantLettersAPI = {
  send: (letterData) =>
    apiRequest('/instant-letters', {
      method: 'POST',
      body: letterData,
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
