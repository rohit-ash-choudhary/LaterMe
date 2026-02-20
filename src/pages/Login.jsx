import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, LogIn, CheckCircle, RefreshCw } from 'lucide-react'
import { authAPI } from '../services/api'

const Login = ({ onLogin, user }) => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showVerificationOptions, setShowVerificationOptions] = useState(false)
  const [unverifiedUserData, setUnverifiedUserData] = useState(null)
  const [resendingOtp, setResendingOtp] = useState(false)
  const hasNavigatedRef = useRef(false) // Track if we've already navigated
  const isSubmittingRef = useRef(false) // Track if we're currently submitting

  // Redirect if already logged in
  useEffect(() => {
    // Prevent multiple navigations or running during submission
    if (hasNavigatedRef.current || isSubmittingRef.current) {
      return
    }

    // Check localStorage as well in case user prop hasn't updated yet
    const storedUser = localStorage.getItem('laterme_user')
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        // Only redirect if email is verified
        if (userData?.emailVerified === true) {
          hasNavigatedRef.current = true
          navigate('/', { replace: true })
          return
        }
      } catch (e) {
        // Invalid stored user, continue with login
      }
    }
    
    // Check user prop only if it's verified (to avoid infinite loops)
    // But skip if user is unverified (they're in the login flow)
    if (user?.emailVerified === true) {
      hasNavigatedRef.current = true
      navigate('/', { replace: true })
    }
  }, [user?.emailVerified, navigate]) // Only depend on emailVerified, not entire user object

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    isSubmittingRef.current = true // Mark that we're submitting

    // Simple validation
    if (!email || !password) {
      setError('Please fill in all fields')
      setLoading(false)
      isSubmittingRef.current = false
      return
    }

    // Email validation and trimming
    const trimmedEmail = email.trim().toLowerCase()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(trimmedEmail)) {
      setError('Please enter a valid email address')
      setLoading(false)
      return
    }

    try {
      // Call backend API to login
      // Note: Backend DTO expects 'passHash' field name (same as registration)
      const response = await authAPI.login({
        email: trimmedEmail,  // Use trimmed and lowercased email
        passHash: password  // Backend expects 'passHash' field name
      })
      
      // Backend returns LoginResponceDTO directly: { id, name, email }
      // NOT wrapped in {user: {...}, token: ...}
      // Backend only returns this if email is verified (checked in backend)
      const userData = {
        id: response.id,
        name: response.name,
        email: response.email,
        token: response.token, // JWT token from backend
        refreshToken: response.refreshToken, // Refresh token from backend
        emailVerified: response.emailVerified !== undefined ? response.emailVerified : true
      }
      
      // Store user data in localStorage
      localStorage.setItem('laterme_user', JSON.stringify(userData))
      
      // Mark that we're navigating to prevent useEffect from interfering
      hasNavigatedRef.current = true
      isSubmittingRef.current = false // Reset submission flag before navigation
      
      // Auto login
      onLogin(userData)
      
      // Check if email is verified - if not, redirect to verification page
      // Use setTimeout to ensure navigation happens after state update
      // Always pass userData in state to ensure VerifyEmail has access to it
      setTimeout(() => {
        if (userData.emailVerified === false || userData.emailVerified === undefined) {
          navigate('/verify-email', { 
            state: { 
              userData: userData // Explicitly pass userData
            },
            replace: true 
          })
        } else {
          navigate('/', { replace: true })
        }
      }, 0)
    } catch (error) {
      // Reset submission flag on error
      isSubmittingRef.current = false
      
      // Handle API errors
      console.error('Login error:', error)
      
      // Check if error is about email not being verified
      const errorMessage = error.message || ''
      const errorData = error.data || {}
      const isEmailNotVerified = errorMessage.toLowerCase().includes('email not verified') || 
                                  errorMessage.toLowerCase().includes('email is not verified') ||
                                  errorMessage.toLowerCase().includes('verify your email') ||
                                  errorMessage.toLowerCase().includes('email verification') ||
                                  errorMessage.toLowerCase().includes('please verify') ||
                                  (error.status === 403 && errorMessage.toLowerCase().includes('verified'))
      
      if (isEmailNotVerified) {
        // Try to get user data from error response
        let userData = null
        
        // Check if error has user data in it (backend might return this)
        if (error.userData) {
          userData = error.userData
        } else if (errorData.user || errorData.userData) {
          userData = errorData.user || errorData.userData
        } else if (errorData.id) {
          // Backend might return user ID and other fields in error response
          userData = {
            id: errorData.id,
            name: errorData.name,
            email: errorData.email || trimmedEmail,
            emailVerified: false
          }
        }
        
        // If we have user data with ID, store it and show verification options
        if (userData && userData.id) {
          // Store user data with unverified status
          const userDataToStore = {
            ...userData,
            emailVerified: false,
            email: userData.email || trimmedEmail
          }
          localStorage.setItem('laterme_user', JSON.stringify(userDataToStore))
          onLogin(userDataToStore)
          setUnverifiedUserData(userDataToStore)
          setShowVerificationOptions(true)
          setError('Please verify your email address. Check your inbox for the verification code.')
          setLoading(false)
          return
        } else {
          // If we don't have user ID, show a message with verification option
          // Store email in localStorage so VerifyEmail can access it
          const emailOnlyData = {
            email: trimmedEmail,
            emailVerified: false
          }
          localStorage.setItem('laterme_user', JSON.stringify(emailOnlyData))
          onLogin(emailOnlyData)
          setUnverifiedUserData(emailOnlyData)
          setShowVerificationOptions(true)
          setError('Please verify your email address. Check your inbox for the verification code.')
        }
      }
      
      // Handle other errors
      if (error.message.includes('Cannot connect to backend') || error.message.includes('Failed to fetch')) {
        const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'
        setError(`Cannot connect to backend server at ${backendUrl}. The service may be sleeping (free tier) or unavailable. Please try again.`)
      } else if (error.message.includes('Invalid emails') || error.message.includes('email not register') || error.message.includes('Pass is invalid')) {
        setError('Invalid email or password')
      } else if (error.message.includes('INVALID_CREDENTIALS')) {
        setError('Invalid email or password')
      } else {
        setError(error.message || 'Login failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoToVerifyEmail = () => {
    // Ensure userData is in localStorage before navigating
    if (unverifiedUserData) {
      // Make sure it's stored in localStorage (even if only email)
      localStorage.setItem('laterme_user', JSON.stringify(unverifiedUserData))
      // Update parent state
      onLogin(unverifiedUserData)
      
      hasNavigatedRef.current = true
      // Use replace: false to allow back navigation if needed
      navigate('/verify-email', {
        state: {
          userData: unverifiedUserData
        },
        replace: false
      })
    } else {
      // If no user data, try to get from localStorage
      try {
        const stored = localStorage.getItem('laterme_user')
        if (stored) {
          const storedData = JSON.parse(stored)
          if (storedData) {
            hasNavigatedRef.current = true
            navigate('/verify-email', {
              state: {
                userData: storedData
              },
              replace: false
            })
            return
          }
        }
      } catch (e) {
        console.error('Error reading stored user data:', e)
      }
      
      // If still no user data, navigate anyway - VerifyEmail will handle it
      hasNavigatedRef.current = true
      navigate('/verify-email', { replace: false })
    }
  }

  const handleResendOtp = async () => {
    if (!unverifiedUserData || !unverifiedUserData.id) {
      setError('Unable to resend OTP. Please try logging in again or go to verify email page.')
      return
    }

    setResendingOtp(true)
    setError('')

    try {
      const response = await authAPI.resendOtp(unverifiedUserData.id)
      const message = response?.message || 'OTP has been resent to your email!'
      const emailSent = response?.emailSent !== false
      const status = response?.status || 'success'
      
      if (!emailSent || status === 'warning') {
        setError('⚠️ ' + (response?.message || 'OTP was generated, but email delivery failed. Please try again or check your email spam folder.'))
      } else {
        setError('✓ ' + message)
        setTimeout(() => {
          setError('')
        }, 3000)
      }
    } catch (error) {
      console.error('Resend OTP error:', error)
      setError(error.message || 'Failed to resend OTP. Please try again.')
    } finally {
      setResendingOtp(false)
    }
  }

  const handleGoogleLogin = () => {
    // Mock Google login
    const userData = {
      id: Date.now(),
      name: 'Google User',
      email: 'user@gmail.com',
    }
    onLogin(userData)
    navigate('/')
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="modern-card rounded-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your LaterMe account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className={`px-4 py-3 rounded-lg text-sm ${
                error.startsWith('✓') 
                  ? 'bg-green-50 border border-green-200 text-green-700' 
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}>
                <div className="flex items-start">
                  <div className="flex-1">
                    {error}
                  </div>
                </div>
                
                {/* Show verification options if email verification error */}
                {showVerificationOptions && (
                  <div className="mt-3 pt-3 border-t border-current/20 space-y-2">
                    <button
                      type="button"
                      onClick={handleGoToVerifyEmail}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-purple-600 transition-colors text-sm font-medium"
                    >
                      <CheckCircle size={16} />
                      <span>Go to Verify Email Page</span>
                    </button>
                    
                    {unverifiedUserData?.id && (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={resendingOtp}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <RefreshCw size={16} className={resendingOtp ? 'animate-spin' : ''} />
                        <span>{resendingOtp ? 'Sending...' : 'Resend OTP'}</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-purple-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogIn size={20} />
              <span>{loading ? 'Logging in...' : 'Login'}</span>
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or login with</span>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {/* Google Login - Coming Soon */}
              <button
                disabled
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg bg-gray-50 opacity-60 cursor-not-allowed relative"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="text-gray-700 font-medium">Login with Google</span>
                <span className="absolute -top-2 -right-2 bg-chrome-yellow text-chrome-dark text-xs font-semibold px-2 py-0.5 rounded-full">
                  Coming Soon
                </span>
              </button>

              {/* Apple Login - Coming Soon */}
              <button
                disabled
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg bg-gray-50 opacity-60 cursor-not-allowed relative"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                <span className="text-gray-700 font-medium">Login with Apple</span>
                <span className="absolute -top-2 -right-2 bg-chrome-yellow text-chrome-dark text-xs font-semibold px-2 py-0.5 rounded-full">
                  Coming Soon
                </span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
