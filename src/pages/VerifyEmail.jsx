import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Mail, RefreshCw, CheckCircle, ArrowLeft } from 'lucide-react'
import { authAPI } from '../services/api'

const VerifyEmail = ({ onLogin }) => {
  // Ensure onLogin is available
  if (!onLogin) {
    console.error('VerifyEmail: onLogin prop is missing')
  }
  const navigate = useNavigate()
  const location = useLocation()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [userId, setUserId] = useState(null)
  const [userEmail, setUserEmail] = useState('')
  const [isInitializing, setIsInitializing] = useState(true)
  
  // Use refs to prevent infinite loops
  const hasInitializedRef = useRef(false)
  const isNavigatingRef = useRef(false)
  const lastPathnameRef = useRef('')

  useEffect(() => {
    // Reset initialization flag if pathname changed (user navigated to this page again)
    if (lastPathnameRef.current !== location.pathname) {
      hasInitializedRef.current = false
      isNavigatingRef.current = false
      lastPathnameRef.current = location.pathname
    }
    
    // Prevent re-running if already initialized or currently navigating
    if (hasInitializedRef.current || isNavigatingRef.current) {
      return
    }
    
    // Get user data from location state or localStorage
    let userData = location.state?.userData
    const emailWarning = location.state?.emailDeliveryWarning || false
    
    // If not in state, try localStorage (this handles login redirects)
    if (!userData || !userData.id) {
      try {
        const stored = localStorage.getItem('laterme_user')
        if (stored) {
          userData = JSON.parse(stored)
        }
      } catch (e) {
        console.error('Error parsing stored user data:', e)
      }
    }
    
    // Check if user is already verified - if so, redirect to home
    if (userData && userData.emailVerified === true) {
      isNavigatingRef.current = true
      navigate('/', { replace: true })
      return
    }
    
    // If no user data at all, redirect to signup
    if (!userData || !userData.id) {
      console.warn('No user data found, redirecting to signup')
      isNavigatingRef.current = true
      navigate('/signup', { replace: true })
      return
    }

    // Set user data immediately to prevent blank page
    // This must happen before any redirects
    setUserId(userData.id)
    // Ensure email is set - use stored email or show placeholder
    setUserEmail(userData.email || 'your email')
    
    // Mark as initialized to prevent re-running
    hasInitializedRef.current = true
    
    // Show warning if email delivery failed during signup
    if (emailWarning) {
      setError('⚠️ Email delivery failed, but OTP was generated. Please use "Resend OTP" to try again, or check your email spam folder.')
      setTimeout(() => {
        setError('')
      }, 8000)
    }
  }, [location.pathname, navigate]) // Only depend on pathname and navigate - state is read once on mount

  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      // Handle paste
      const pastedOtp = value.slice(0, 6).split('')
      const newOtp = [...otp]
      pastedOtp.forEach((char, i) => {
        if (index + i < 6 && /^\d$/.test(char)) {
          newOtp[index + i] = char
        }
      })
      setOtp(newOtp)
      
      // Focus next empty input or submit
      const nextIndex = Math.min(index + pastedOtp.length, 5)
      if (nextIndex < 6) {
        document.getElementById(`otp-${nextIndex}`)?.focus()
      } else {
        handleSubmit()
      }
      return
    }

    if (!/^\d$/.test(value) && value !== '') return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus()
    }
  }

  const handleSubmit = async (e) => {
    if (e) e.preventDefault()
    
    const otpCode = otp.join('')
    if (otpCode.length !== 6) {
      setError('Please enter the complete 6-digit OTP')
      return
    }

    if (!userId) {
      setError('User session expired. Please sign up again.')
      return
    }

    setError('')
    setLoading(true)

    try {
      const response = await authAPI.verifyEmail(userId, otpCode)
      
      // Update user data with verified status
      // Ensure all required fields are present
      const userData = {
        id: response.id || userId,
        name: response.name || location.state?.userData?.name || '',
        email: response.email || location.state?.userData?.email || userEmail,
        token: response.token || null, // JWT token from backend
        refreshToken: response.refreshToken || null, // Refresh token from backend
        emailVerified: true // Mark as verified
      }
      
      // Update localStorage with verified user data
      localStorage.setItem('laterme_user', JSON.stringify(userData))
      
      // Update parent component's user state
      if (onLogin) {
        onLogin(userData)
      } else {
        console.error('VerifyEmail: onLogin function is not available')
      }
      
      // Small delay to ensure state is updated before navigation
      isNavigatingRef.current = true
      setTimeout(() => {
        navigate('/', { replace: true })
      }, 100)
    } catch (error) {
      console.error('Verification error:', error)
      setError(error.message || 'Invalid OTP. Please try again.')
      setOtp(['', '', '', '', '', ''])
      document.getElementById('otp-0')?.focus()
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    // Get userId from state or localStorage
    let currentUserId = userId
    if (!currentUserId) {
      try {
        const stored = localStorage.getItem('laterme_user')
        if (stored) {
          const userData = JSON.parse(stored)
          currentUserId = userData.id
        }
      } catch (e) {
        console.error('Error parsing stored user data:', e)
      }
    }
    
    if (!currentUserId) {
      setError('User session expired. Please sign up again.')
      navigate('/signup', { replace: true })
      return
    }

    setResending(true)
    setError('')

    try {
      const response = await authAPI.resendOtp(currentUserId)
      setError('')
      
      // Handle response object
      const message = response?.message || 'OTP has been resent to your email!'
      const emailSent = response?.emailSent !== false // Default to true if not specified
      const status = response?.status || 'success'
      
      // Check if email delivery failed
      if (!emailSent || status === 'warning') {
        const warningMsg = message || 'OTP was generated, but email delivery failed. The OTP is still valid and saved in the system. You can still enter it below.'
        const warningError = '⚠️ ' + warningMsg
        setError(warningError)
        // Keep the error visible longer for important warnings
        setTimeout(() => {
          // Clear the warning after timeout
          setError(prevError => {
            // Only clear if it's still the same warning message
            if (prevError === warningError) {
              return ''
            }
            return prevError
          })
        }, 10000)
      } else {
        // Show success message without alert (better UX)
        const successMsg = message || 'OTP has been resent to your email!'
        // Temporarily show success message
        setError('✓ ' + successMsg)
        setTimeout(() => {
          setError('')
        }, 3000)
      }
      
      setOtp(['', '', '', '', '', ''])
      document.getElementById('otp-0')?.focus()
    } catch (error) {
      console.error('Resend OTP error:', error)
      // Check if it's a connection error
      if (error.message && error.message.includes('Cannot connect to backend')) {
        const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'
        setError(`Cannot connect to backend server at ${backendUrl}. The service may be sleeping (free tier) or unavailable. Please try again.`)
      } else {
        setError(error.message || 'Failed to resend OTP. Please try again.')
      }
    } finally {
      setResending(false)
    }
  }

  // Give time for useEffect to set userId before showing error
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitializing(false)
    }, 100)
    return () => clearTimeout(timer)
  }, [])
  
  if (!userId && isInitializing) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading verification page...</p>
        </div>
      </div>
    )
  }
  
  // If still no userId after initialization, show error and redirect
  if (!userId) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          <div className="modern-card rounded-2xl p-8">
            <p className="text-red-600 mb-4">Unable to load verification page. Redirecting...</p>
            <button
              onClick={() => navigate('/signup', { replace: true })}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              Go to Signup
            </button>
          </div>
        </div>
      </div>
    )
  }

  const handleBack = () => {
    // Always go back to signup page (where user came from)
    if (!isNavigatingRef.current) {
      isNavigatingRef.current = true
      navigate('/signup', { replace: true })
    }
  }

  // Handle browser back button
  useEffect(() => {
    const handlePopState = () => {
      // When browser back button is pressed, go to signup
      if (!isNavigatingRef.current) {
        isNavigatingRef.current = true
        navigate('/signup', { replace: true })
      }
    }
    
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [navigate])

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="modern-card rounded-2xl p-8">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
            type="button"
          >
            <ArrowLeft size={20} className="mr-2" />
            <span>Back</span>
          </button>

          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Mail className="text-primary" size={32} />
            </div>
            <h1 className="text-3xl font-bold mb-2">Verify Your Email</h1>
            <p className="text-gray-600">
              We've sent a 6-digit code to
            </p>
            <p className="text-gray-900 font-medium mt-1">{userEmail}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className={`px-4 py-3 rounded-lg text-sm ${
                error.startsWith('✓') 
                  ? 'bg-green-50 border border-green-200 text-green-700' 
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}>
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                Enter the verification code
              </label>
              <div className="flex justify-center gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    autoFocus={index === 0}
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || otp.join('').length !== 6}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-purple-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <RefreshCw className="animate-spin" size={20} />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <CheckCircle size={20} />
                  <span>Verify Email</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm mb-2">
              Didn't receive the code?
            </p>
            <button
              onClick={handleResendOtp}
              disabled={resending}
              className="text-primary hover:underline font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
            >
              <RefreshCw className={resending ? 'animate-spin' : ''} size={16} />
              <span>{resending ? 'Sending...' : 'Resend OTP'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmail
