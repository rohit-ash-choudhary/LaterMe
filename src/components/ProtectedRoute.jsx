import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const ProtectedRoute = ({ user, children }) => {
  const navigate = useNavigate()
  const [isChecking, setIsChecking] = useState(true)
  const hasCheckedRef = useRef(false)
  const isNavigatingRef = useRef(false)

  useEffect(() => {
    // Prevent multiple checks
    if (hasCheckedRef.current || isNavigatingRef.current) {
      return
    }

    // Check localStorage if user prop is not set
    let currentUser = user
    if (!currentUser) {
      const storedUser = localStorage.getItem('laterme_user')
      if (storedUser) {
        try {
          currentUser = JSON.parse(storedUser)
        } catch (e) {
          isNavigatingRef.current = true
          navigate('/login', { replace: true })
          setIsChecking(false)
          return
        }
      }
    }

    // If no user at all, redirect to login
    if (!currentUser) {
      isNavigatingRef.current = true
      navigate('/login', { replace: true })
      setIsChecking(false)
      return
    }

    // Check if email is verified - redirect to verify email page if not verified
    if (currentUser.emailVerified === false || currentUser.emailVerified === undefined) {
      isNavigatingRef.current = true
      // Redirect to verify email page with user data
      navigate('/verify-email', { 
        state: { 
          userData: currentUser 
        },
        replace: true
      })
      setIsChecking(false)
      return
    }

    // User is verified, allow access
    hasCheckedRef.current = true
    setIsChecking(false)
  }, [user?.id, user?.emailVerified, navigate]) // Only depend on specific user properties, not entire object

  // Show loading while checking
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Get current user (from prop or localStorage)
  const currentUser = user || (() => {
    try {
      const stored = localStorage.getItem('laterme_user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })()

  // Only render children if user is verified
  if (!currentUser || currentUser.emailVerified !== true) {
    return null
  }

  return children
}

export default ProtectedRoute
