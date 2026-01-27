// API Configuration
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
    try {
      const userData = JSON.parse(user)
      return userData.token // Assuming backend returns token
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
    const response = await fetch(`${apiConfig.baseURL}${endpoint}`, {
      ...options,
      headers: config,
      body: options.body ? JSON.stringify(options.body) : undefined,
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `API Error: ${response.status} ${response.statusText}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('API Request Error:', error)
    throw error
  }
}
