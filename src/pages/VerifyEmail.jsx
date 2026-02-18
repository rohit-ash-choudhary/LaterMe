import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Mail, RefreshCw, CheckCircle, ArrowLeft } from 'lucide-react'
import { authAPI } from '../services/api'

const VerifyEmail = ({ onLogin }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [userId, setUserId] = useState(null)
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    // Get user data from location state or localStorage
    const userData = location.state?.userData || JSON.parse(localStorage.getItem('laterme_user') || '{}')
    
    if (!userData || !userData.id) {
      // If no user data, redirect to signup
      navigate('/signup')
      return
    }

    setUserId(userData.id)
    setUserEmail(userData.email || '')
  }, [location, navigate])

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
      const userData = {
        id: response.id,
        name: response.name,
        email: response.email,
        token: response.token, // JWT token from backend
        refreshToken: response.refreshToken, // Refresh token from backend
        emailVerified: true
      }
      
      localStorage.setItem('laterme_user', JSON.stringify(userData))
      onLogin(userData)
      navigate('/')
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
    if (!userId) {
      setError('User session expired. Please sign up again.')
      return
    }

    setResending(true)
    setError('')

    try {
      const response = await authAPI.resendOtp(userId)
      setError('')
      
      // Handle response object
      const message = response?.message || 'OTP has been resent to your email!'
      const emailSent = response?.emailSent !== false // Default to true if not specified
      const status = response?.status || 'success'
      
      // Check if email delivery failed
      if (!emailSent || status === 'warning') {
        setError(message || 'OTP was generated, but email delivery failed. The OTP is still valid and saved in the system.')
      } else {
        alert(message || 'OTP has been resent to your email!')
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

  if (!userId) {
    return null // Will redirect
  }

  const handleBack = () => {
    // Always go back to signup page (where user came from)
    navigate('/signup', { replace: true })
  }

  // Handle browser back button
  useEffect(() => {
    const handlePopState = () => {
      // When browser back button is pressed, go to signup
      navigate('/signup', { replace: true })
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
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
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
