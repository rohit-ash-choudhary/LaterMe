import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import WriteLater from './pages/WriteLater'
import PublicLetters from './pages/PublicLetters'
import InstantLetter from './pages/InstantLetter'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Pricing from './pages/Pricing'
import ManageAccount from './pages/ManageAccount'
import { getUserSubscription, isSubscriptionActive } from './utils/subscription'

function App() {
  const [user, setUser] = useState(null)
  const [subscription, setSubscription] = useState(null)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('futuroo_user')
    if (storedUser) {
      const userData = JSON.parse(storedUser)
      setUser(userData)
      // Load subscription status
      if (userData?.id) {
        const sub = getUserSubscription(userData.id)
        setSubscription(sub)
      }
    }
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem('futuroo_user', JSON.stringify(userData))
    // Load subscription status
    if (userData?.id) {
      const sub = getUserSubscription(userData.id)
      setSubscription(sub)
    }
  }

  const handleLogout = () => {
    setUser(null)
    setSubscription(null)
    localStorage.removeItem('futuroo_user')
  }

  const handleSubscriptionUpdate = () => {
    if (user?.id) {
      const sub = getUserSubscription(user.id)
      setSubscription(sub)
    }
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-background">
        <Header user={user} subscription={subscription} onLogout={handleLogout} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/write-later" element={<WriteLater user={user} subscription={subscription} />} />
            <Route path="/public-letters" element={<PublicLetters user={user} />} />
            <Route path="/write-to-someone" element={<InstantLetter user={user} subscription={subscription} />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/signup" element={<Signup onLogin={handleLogin} />} />
            <Route path="/pricing" element={<Pricing user={user} onSubscriptionUpdate={handleSubscriptionUpdate} />} />
            <Route path="/manage-account" element={<ManageAccount user={user} onLogout={handleLogout} onSubscriptionUpdate={handleSubscriptionUpdate} />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
