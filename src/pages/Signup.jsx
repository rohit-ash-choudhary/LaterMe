import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, UserPlus } from 'lucide-react'
import { authAPI } from '../services/api'

const Signup = ({ onLogin, user }) => {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const hasNavigatedRef = useRef(false) // Track if we've already navigated

  // Redirect if already logged in and verified
  useEffect(() => {
    // Prevent multiple navigations
    if (hasNavigatedRef.current) {
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
        // Invalid stored user, continue with signup
      }
    }
    
    // Check user prop only if it's verified (to avoid infinite loops)
    if (user?.emailVerified === true) {
      hasNavigatedRef.current = true
      navigate('/', { replace: true })
    }
  }, [user?.emailVerified, navigate]) // Only depend on emailVerified, not entire user object

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Simple validation
    if (!name || !email || !password) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      setLoading(false)
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      setLoading(false)
      return
    }

    try {
      // Call backend API to register user
      // Note: Backend expects 'passHash' field name
      const response = await authAPI.register({
        name,
        email,
        passHash: password  // Backend expects 'passHash' instead of 'password'
      })
      
      // Backend returns SignupResponseDTO with id, name, email, emailVerified, token
      // Ensure email is included in userData
      const userData = {
        id: response.id,
        name: response.name || name, // Fallback to form input if response doesn't have it
        email: response.email || email, // Fallback to form input if response doesn't have it
        token: response.token || null, // JWT token (may be null until email verified)
        refreshToken: null, // Refresh token only after email verification
        emailVerified: response.emailVerified || false
      }
      
      // Ensure email is always set (use form value as fallback)
      if (!userData.email) {
        userData.email = email
      }
      
      // Store user data temporarily (not fully logged in until verified)
      localStorage.setItem('laterme_user', JSON.stringify(userData))
      
      // Mark that we're navigating to prevent useEffect from interfering
      hasNavigatedRef.current = true
      
      // Update parent component's user state (even though not verified)
      onLogin(userData)
      
      // Redirect to OTP verification page with userData
      // Note: Even if email sending fails, OTP is saved in database
      // User can use "Resend OTP" feature if email wasn't received
      navigate('/verify-email', { 
        state: { 
          userData,
          emailDeliveryWarning: response.emailSent === false || response.status === 'warning'
        }, 
        replace: true 
      })
    } catch (error) {
      // Handle API errors
      console.error('Registration error:', error)
      if (error.message.includes('Cannot connect to backend') || error.message.includes('Failed to fetch')) {
        const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'
        setError(`Cannot connect to backend server at ${backendUrl}. The service may be sleeping (free tier) or unavailable. Please try again.`)
      } else if (error.message.includes('already exists') || 
                 error.message.includes('already registered') ||
                 error.message.includes('User with email') ||
                 error.message.includes('EMAIL_ALREADY_EXISTS')) {
        // Extract email from error message if available
        const emailMatch = error.message.match(/email\s+([^\s]+)\s+already/i)
        if (emailMatch) {
          setError(`Email ${emailMatch[1]} is already registered. Please use a different email or try logging in.`)
        } else {
          setError('This email is already registered. Please use a different email or try logging in.')
        }
      } else if (error.message.includes('VALIDATION_ERROR') || error.message.includes('Validation failed')) {
        setError('Please check your input and try again')
      } else if (error.message.includes('Mail server') || error.message.includes('SMTP') || error.message.includes('email delivery')) {
        // Email sending failed but user might still be created
        setError('Account created, but email delivery failed. Please use "Resend OTP" on the verification page.')
        // Still try to navigate to verification page if we have user data
        try {
          const storedUser = localStorage.getItem('laterme_user')
          if (storedUser) {
            const userData = JSON.parse(storedUser)
            setTimeout(() => {
              navigate('/verify-email', { 
                state: { 
                  userData,
                  emailDeliveryWarning: true
                }, 
                replace: true 
              })
            }, 2000)
          }
        } catch (e) {
          // If navigation fails, user can try again
        }
      } else {
        setError(error.message || 'Registration failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignup = () => {
    // Mock Google signup
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
            <h1 className="text-3xl font-bold mb-2">Create Account</h1>
            <p className="text-gray-600">Join LaterMe and start your journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
            </div>

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
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-purple-600 transition-colors font-medium cursor-pointer relative z-10 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ pointerEvents: 'auto', cursor: loading ? 'not-allowed' : 'pointer', position: 'relative', zIndex: 10 }}
            >
              <UserPlus size={20} />
              <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or sign up with</span>
              </div>
            </div>

            <button
              onClick={handleGoogleSignup}
              className="mt-4 w-full flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
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
              <span className="text-gray-700 font-medium">Sign up with Google</span>
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup
