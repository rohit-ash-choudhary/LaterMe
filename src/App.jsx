import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import WriteLater from './pages/WriteLater'
import PublicLetters from './pages/PublicLetters'
import InstantLetter from './pages/InstantLetter'
import Login from './pages/Login'
import Signup from './pages/Signup'
import VerifyEmail from './pages/VerifyEmail'
import Pricing from './pages/Pricing'
import ManageAccount from './pages/ManageAccount'
// Subscription utilities removed - will be handled by backend API

function App() {
  const [user, setUser] = useState(null)
  const [subscription, setSubscription] = useState(null)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('laterme_user')
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        
        // Set user state regardless of verification status
        // This allows the app to know about unverified users and handle them properly
        // Individual pages and ProtectedRoute will check emailVerified status
        if (userData && userData.id) {
          setUser(userData)
          // Subscription removed - will be handled by backend API in the future
          setSubscription(null)
        }
      } catch (e) {
        console.error('Error parsing user data:', e)
        localStorage.removeItem('laterme_user')
      }
    }
  }, [])

  const handleLogin = (userData) => {
    // Ensure userData is properly formatted
    const formattedUserData = {
      ...userData,
      emailVerified: userData.emailVerified !== undefined ? userData.emailVerified : false
    }
    setUser(formattedUserData)
    localStorage.setItem('laterme_user', JSON.stringify(formattedUserData))
    // Subscription removed - will be handled by backend API in the future
    setSubscription(null)
  }

  const handleLogout = () => {
    setUser(null)
    setSubscription(null)
    localStorage.removeItem('laterme_user')
  }

  const handleSubscriptionUpdate = () => {
    // Subscription removed - will be handled by backend API in the future
    setSubscription(null)
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-background">
        <Header user={user} subscription={subscription} onLogout={handleLogout} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/write-later" element={
              <ProtectedRoute user={user}>
                <WriteLater user={user} subscription={subscription} />
              </ProtectedRoute>
            } />
            <Route path="/public-letters" element={<PublicLetters user={user} />} />
            <Route path="/write-to-someone" element={
              <ProtectedRoute user={user}>
                <InstantLetter user={user} subscription={subscription} />
              </ProtectedRoute>
            } />
            <Route path="/login" element={<Login onLogin={handleLogin} user={user} />} />
            <Route path="/signup" element={<Signup onLogin={handleLogin} user={user} />} />
            <Route path="/verify-email" element={<VerifyEmail onLogin={handleLogin} />} />
            <Route path="/pricing" element={<Pricing user={user} onSubscriptionUpdate={handleSubscriptionUpdate} />} />
            <Route path="/manage-account" element={
              <ProtectedRoute user={user}>
                <ManageAccount user={user} onLogout={handleLogout} onSubscriptionUpdate={handleSubscriptionUpdate} />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
