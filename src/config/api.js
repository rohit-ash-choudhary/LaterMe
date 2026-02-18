// API Configuration
// Get API URL from environment variable or use default
// Backend runs on port 8080 locally, or on Render in production
// Backend uses /api as the context path
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

export const apiConfig = {
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
}

// Helper function to get auth token
export const getAuthToken = () => {
  const user = localStorage.getItem('laterme_user')
  if (user) {
    try {
      const userData = JSON.parse(user)
      const token = userData.token
      
      // Check if token is expired
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]))
          const exp = payload.exp * 1000
          if (Date.now() >= exp) {
            // Token expired, clear user data
            localStorage.removeItem('laterme_user')
            return null
          }
        } catch (e) {
          // Invalid token format
          return null
        }
      }
      
      return token
    } catch (e) {
      return null
    }
  }
  return null
}

// Helper function to get refresh token
export const getRefreshToken = () => {
  const user = localStorage.getItem('laterme_user')
  if (user) {
    try {
      const userData = JSON.parse(user)
      return userData.refreshToken
    } catch (e) {
      return null
    }
  }
  return null
}

// Helper function to get user ID
export const getUserId = () => {
  const user = localStorage.getItem('laterme_user')
  if (user) {
    try {
      const userData = JSON.parse(user)
      return userData.id || userData.userId
    } catch (e) {
      return null
    }
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
    const fetchOptions = {
      method: options.method || 'GET',
      headers: config,
    }
    
    // Only add body if it exists and is not empty
    if (options.body && Object.keys(options.body).length > 0) {
      fetchOptions.body = JSON.stringify(options.body)
    }
    
    const response = await fetch(`${apiConfig.baseURL}${endpoint}`, fetchOptions)
    
    // Get content type before reading response
    const contentType = response.headers.get('content-type') || ''
    const isJson = contentType.includes('application/json')
    
    if (!response.ok) {
      // Try to parse as JSON, but handle plain text responses too
      let errorData = {}
      
      if (isJson) {
        try {
          errorData = await response.json()
        } catch (e) {
          errorData = { message: `API Error: ${response.status} ${response.statusText}` }
        }
      } else {
        const text = await response.text().catch(() => '')
        errorData = { message: text || `API Error: ${response.status} ${response.statusText}` }
      }
      
      // Handle validation errors (object with field names as keys or errors object)
      if (errorData.errors && typeof errorData.errors === 'object') {
        const validationErrors = Object.values(errorData.errors).join(', ')
        throw new Error(validationErrors || errorData.message || `API Error: ${response.status} ${response.statusText}`)
      }
      
      if (typeof errorData === 'object' && !errorData.message && Object.keys(errorData).length > 0) {
        const validationErrors = Object.values(errorData).join(', ')
        throw new Error(validationErrors || `API Error: ${response.status} ${response.statusText}`)
      }
      
      throw new Error(errorData.message || errorData.error?.message || `API Error: ${response.status} ${response.statusText}`)
    }
    
    // Handle both JSON and plain text responses
    if (isJson) {
      try {
        return await response.json()
      } catch (e) {
        // If JSON parsing fails, try text
        const text = await response.text().catch(() => '')
        return text || {}
      }
    } else {
      // Plain text response
      const text = await response.text().catch(() => '')
      return text
    }
  } catch (error) {
    console.error('API Request Error:', error)
    
    // Provide more helpful error messages
    if (error.message.includes('Failed to fetch') || error.message.includes('ERR_CONNECTION_REFUSED')) {
      const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'
      throw new Error(`Cannot connect to backend server at ${backendUrl}. Please check if the backend is running.`)
    }
    
    throw error
  }
}
