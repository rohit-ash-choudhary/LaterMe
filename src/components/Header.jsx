import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Mail, Globe, User, LogOut, BookOpen, Bookmark, Crown, Send, Menu, X } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

const Header = ({ user, subscription, onLogout }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const menuRef = useRef(null)
  
  // Helper function to handle navigation for protected routes
  const handleProtectedNavigation = (e, path) => {
    // Check if user is logged in
    let currentUser = user
    if (!currentUser) {
      const storedUser = localStorage.getItem('laterme_user')
      if (storedUser) {
        try {
          currentUser = JSON.parse(storedUser)
        } catch (e) {
          // Invalid user data, let default navigation happen
          return
        }
      }
    }
    
    // If user exists but is not verified, redirect to verify-email
    if (currentUser && (currentUser.emailVerified === false || currentUser.emailVerified === undefined)) {
      e.preventDefault()
      navigate('/verify-email', {
        state: {
          userData: currentUser
        },
        replace: false
      })
    }
    // If no user, let default navigation happen (will be handled by ProtectedRoute)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const isActive = (path) => location.pathname === path

  return (
    <header className="chrome-header sticky top-0 z-50">
      <div className="chrome-header-container">
        {/* Top Bar - Chrome Style */}
        <div className="chrome-top-bar">
          {/* Logo - Modern Next-Gen Style */}
          <Link to="/" className="chrome-logo group">
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <div className="chrome-logo-text">
                  LaterMe
                </div>
                <div className="chrome-tagline">
                  What You'll Be Tomorrow
                </div>
              </div>
            </div>
          </Link>

          {/* Chrome-Style Tabs Navigation */}
          <nav className="chrome-tabs-container">
            <Link
              to="/write-later"
              onClick={(e) => {
                handleProtectedNavigation(e, '/write-later')
                setShowMobileMenu(false)
              }}
              className={`chrome-tab ${isActive('/write-later') ? 'chrome-tab-active' : ''}`}
            >
              <Mail size={18} className="chrome-tab-icon" />
              <span className="chrome-tab-text">Write Later</span>
              {isActive('/write-later') && <div className="chrome-tab-indicator" />}
            </Link>
            <Link
              to="/public-letters"
              onClick={() => setShowMobileMenu(false)}
              className={`chrome-tab ${isActive('/public-letters') ? 'chrome-tab-active' : ''}`}
            >
              <Globe size={18} className="chrome-tab-icon" />
              <span className="chrome-tab-text">Public Letters</span>
              {isActive('/public-letters') && <div className="chrome-tab-indicator" />}
            </Link>
            <Link
              to="/write-to-someone"
              onClick={(e) => {
                handleProtectedNavigation(e, '/write-to-someone')
                setShowMobileMenu(false)
              }}
              className={`chrome-tab ${isActive('/write-to-someone') ? 'chrome-tab-active' : ''}`}
            >
              <Send size={18} className="chrome-tab-icon" />
              <span className="chrome-tab-text">To Someone</span>
              {isActive('/write-to-someone') && <div className="chrome-tab-indicator" />}
            </Link>
          </nav>

          {/* Right Side - Chrome Style Actions */}
          <div className="chrome-actions">
            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="chrome-profile-button"
                >
                  <div className="chrome-avatar">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="chrome-profile-name">{user.name}</span>
                </button>

                {showProfileMenu && (
                  <div className="chrome-dropdown">
                    {subscription && subscription.plan !== 'free' && (
                      <div className="chrome-dropdown-header">
                        <div className="flex items-center space-x-2 text-primary">
                          <Crown size={16} />
                          <span className="text-sm font-medium">
                            {subscription.plan === 'lifetime' 
                              ? 'Lifetime Premium' 
                              : subscription.plan === 'yearly'
                              ? 'Yearly Premium'
                              : subscription.plan === 'monthly'
                              ? 'Monthly Premium'
                              : 'Free'}
                          </span>
                        </div>
                      </div>
                    )}
                    <Link
                      to="/write-later"
                      onClick={(e) => {
                        handleProtectedNavigation(e, '/write-later')
                        setShowProfileMenu(false)
                      }}
                      className="chrome-dropdown-item"
                    >
                      <BookOpen size={18} />
                      <span>My Letters</span>
                    </Link>
                    <Link
                      to="/public-letters?filter=saved"
                      className="chrome-dropdown-item"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <Bookmark size={18} />
                      <span>Saved for later you</span>
                    </Link>
                    <Link
                      to="/pricing"
                      className="chrome-dropdown-item"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <Crown size={18} />
                      <span>{subscription && subscription.plan !== 'free' ? 'Manage Subscription' : 'Upgrade to Premium'}</span>
                    </Link>
                    <Link
                      to="/manage-account"
                      onClick={(e) => {
                        handleProtectedNavigation(e, '/manage-account')
                        setShowProfileMenu(false)
                      }}
                      className="chrome-dropdown-item"
                    >
                      <User size={18} />
                      <span>Manage Account</span>
                    </Link>
                    <div className="chrome-dropdown-divider" />
                    <button
                      onClick={() => {
                        onLogout()
                        setShowProfileMenu(false)
                      }}
                      className="chrome-dropdown-item chrome-dropdown-item-danger"
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="chrome-auth-buttons">
                <Link
                  to="/login"
                  className="chrome-button-text"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="chrome-button-primary"
                >
                  Sign Up
                </Link>
              </div>
            )}
            
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="chrome-mobile-menu-button"
            >
              {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation - Chrome Style */}
        {showMobileMenu && (
          <nav className="chrome-mobile-nav">
            <Link
              to="/write-later"
              onClick={(e) => {
                handleProtectedNavigation(e, '/write-later')
                setShowMobileMenu(false)
              }}
              className={`chrome-mobile-tab ${isActive('/write-later') ? 'chrome-mobile-tab-active' : ''}`}
            >
              <Mail size={20} />
              <span>Write Later</span>
            </Link>
            <Link
              to="/public-letters"
              onClick={() => setShowMobileMenu(false)}
              className={`chrome-mobile-tab ${isActive('/public-letters') ? 'chrome-mobile-tab-active' : ''}`}
            >
              <Globe size={20} />
              <span>Public Letters</span>
            </Link>
            <Link
              to="/write-to-someone"
              onClick={(e) => {
                handleProtectedNavigation(e, '/write-to-someone')
                setShowMobileMenu(false)
              }}
              className={`chrome-mobile-tab ${isActive('/write-to-someone') ? 'chrome-mobile-tab-active' : ''}`}
            >
              <Send size={20} />
              <span>To Someone</span>
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}

export default Header
