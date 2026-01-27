import { Link, useLocation } from 'react-router-dom'
import { Mail, Globe, User, LogOut, BookOpen, Bookmark, Crown, Send } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

const Header = ({ user, subscription, onLogout }) => {
  const location = useLocation()
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const menuRef = useRef(null)

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
    <header className="glass-strong sticky top-0 z-50 border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="text-3xl font-extrabold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
              FUTUROO
            </div>
            <span className="hidden sm:inline text-sm text-gray-600 font-medium">
              Messages for Who You'll Be
            </span>
          </Link>

          {/* Center Tabs */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              to="/write-later"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isActive('/write-later')
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Mail size={18} />
              <span>Write Later</span>
            </Link>
            <Link
              to="/public-letters"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isActive('/public-letters')
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Globe size={18} />
              <span>Public Letters</span>
            </Link>
            <Link
              to="/write-to-someone"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isActive('/write-to-someone')
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Send size={18} />
              <span>Write Letter to Someone Else</span>
            </Link>
          </nav>

          {/* Right Side - Auth */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="hidden sm:inline text-gray-700">{user.name}</span>
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                    {subscription && subscription.plan !== 'free' && (
                      <div className="px-4 py-2 border-b border-gray-100">
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
                      className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 text-gray-700"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <BookOpen size={18} />
                      <span>My Letters</span>
                    </Link>
                    <Link
                      to="/public-letters?filter=saved"
                      className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 text-gray-700"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <Bookmark size={18} />
                      <span>Saved for later you</span>
                    </Link>
                    <Link
                      to="/pricing"
                      className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 text-gray-700"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <Crown size={18} />
                      <span>{subscription && subscription.plan !== 'free' ? 'Manage Subscription' : 'Upgrade to Premium'}</span>
                    </Link>
                    <Link
                      to="/manage-account"
                      className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 text-gray-700"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <User size={18} />
                      <span>Manage Account</span>
                    </Link>
                    <hr className="my-2" />
                    <button
                      onClick={() => {
                        onLogout()
                        setShowProfileMenu(false)
                      }}
                      className="w-full flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 text-red-600"
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 hover:text-primary transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden flex items-center justify-around py-2 border-t border-gray-100">
          <Link
            to="/write-later"
            className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg ${
              isActive('/write-later') ? 'text-primary' : 'text-gray-600'
            }`}
          >
            <Mail size={20} />
            <span className="text-xs">Write Later</span>
          </Link>
          <Link
            to="/public-letters"
            className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg ${
              isActive('/public-letters') ? 'text-primary' : 'text-gray-600'
            }`}
          >
            <Globe size={20} />
            <span className="text-xs">Public</span>
          </Link>
          <Link
            to="/write-to-someone"
            className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg ${
              isActive('/write-to-someone') ? 'text-primary' : 'text-gray-600'
            }`}
          >
            <Send size={20} />
            <span className="text-xs">To Someone Else</span>
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Header
