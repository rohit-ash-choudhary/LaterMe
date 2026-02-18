// Security utilities for XSS protection and input sanitization

/**
 * Sanitize HTML to prevent XSS attacks
 * @param {string} html - HTML string to sanitize
 * @returns {string} - Sanitized HTML
 */
export const sanitizeHtml = (html) => {
  if (!html) return ''
  
  const div = document.createElement('div')
  div.textContent = html
  return div.innerHTML
}

/**
 * Escape HTML special characters
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text
 */
export const escapeHtml = (text) => {
  if (!text) return ''
  
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }
  
  return text.replace(/[&<>"']/g, (m) => map[m])
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate and sanitize user input
 * @param {string} input - User input
 * @param {number} maxLength - Maximum length
 * @returns {string} - Sanitized input
 */
export const sanitizeInput = (input, maxLength = 1000) => {
  if (!input) return ''
  
  // Remove any HTML tags
  let sanitized = input.replace(/<[^>]*>/g, '')
  
  // Trim and limit length
  sanitized = sanitized.trim().substring(0, maxLength)
  
  // Escape special characters
  return escapeHtml(sanitized)
}

/**
 * Check if token is expired (basic check)
 * @param {string} token - JWT token
 * @returns {boolean} - True if expired or invalid
 */
export const isTokenExpired = (token) => {
  if (!token) return true
  
  try {
    // Decode JWT token (without verification)
    const payload = JSON.parse(atob(token.split('.')[1]))
    const exp = payload.exp * 1000 // Convert to milliseconds
    return Date.now() >= exp
  } catch (e) {
    return true
  }
}

/**
 * Get token expiration time
 * @param {string} token - JWT token
 * @returns {Date|null} - Expiration date or null
 */
export const getTokenExpiration = (token) => {
  if (!token) return null
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return new Date(payload.exp * 1000)
  } catch (e) {
    return null
  }
}
