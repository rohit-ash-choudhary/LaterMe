import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ProtectedRoute = ({ user, children }) => {
  const navigate = useNavigate()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Check localStorage if user prop is not set
    let currentUser = user
    if (!currentUser) {
      const storedUser = localStorage.getItem('laterme_user')
      if (storedUser) {
        try {
          currentUser = JSON.parse(storedUser)
        } catch (e) {
          navigate('/login')
          setIsChecking(false)
          return
        }
      }
    }

    // If no user at all, redirect to login
    if (!currentUser) {
      navigate('/login')
      setIsChecking(false)
      return
    }

    // Check if email is verified
    if (currentUser.emailVerified === false || currentUser.emailVerified === undefined) {
      // Redirect to verify email page with user data
      navigate('/verify-email', { 
        state: { 
          userData: currentUser 
        } 
      })
      setIsChecking(false)
      return
    }

    setIsChecking(false)
  }, [user, navigate])

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
