import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Lock, Crown, Calendar, X, Save, Eye, EyeOff } from 'lucide-react'
import { getUserSubscription, isSubscriptionActive } from '../utils/subscription'

const ManageAccount = ({ user, onLogout, onSubscriptionUpdate }) => {
  const navigate = useNavigate()
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(false)
  
  // Form states
  const [email, setEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    // Load user data
    const userData = JSON.parse(localStorage.getItem('futuroo_users') || '[]')
    const currentUser = userData.find(u => u.id === user.id)
    
    if (currentUser) {
      setEmail(currentUser.email || '')
    }

    // Load subscription
    const sub = getUserSubscription(user.id)
    setSubscription(sub)
  }, [user, navigate])

  const handleUpdateEmail = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    // Simulate API call
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('futuroo_users') || '[]')
      const updatedUsers = users.map(u => 
        u.id === user.id ? { ...u, email } : u
      )
      localStorage.setItem('futuroo_users', JSON.stringify(updatedUsers))
      
      setLoading(false)
      setMessage({ type: 'success', text: 'Email updated successfully!' })
    }, 1000)
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setMessage({ type: '', text: '' })

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' })
      return
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' })
      return
    }

    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('futuroo_users') || '[]')
      const currentUser = users.find(u => u.id === user.id)
      
      // In a real app, verify current password
      if (currentUser) {
        const updatedUsers = users.map(u => 
          u.id === user.id ? { ...u, password: newPassword } : u
        )
        localStorage.setItem('futuroo_users', JSON.stringify(updatedUsers))
        
        setLoading(false)
        setMessage({ type: 'success', text: 'Password changed successfully!' })
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        setLoading(false)
        setMessage({ type: 'error', text: 'User not found' })
      }
    }, 1000)
  }

  const handleCancelSubscription = () => {
    if (window.confirm('Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.')) {
      // In a real app, this would cancel the subscription
      alert('Subscription cancellation requested. This feature will be implemented with payment integration.')
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const isActive = isSubscriptionActive(user?.id)
  const subscriptionStatus = subscription?.plan === 'free' 
    ? 'Free' 
    : subscription?.plan === 'lifetime'
    ? 'Lifetime'
    : isActive
    ? 'Active'
    : 'Expired'

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Manage Account</h1>
        <p className="text-gray-600">Update your account settings and preferences</p>
      </div>

      {/* Account Information */}
      <div className="modern-card rounded-2xl p-6 mb-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <User className="text-primary" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{user?.name || 'User'}</h2>
            <p className="text-sm text-gray-500">Account Information</p>
          </div>
        </div>

        <form onSubmit={handleUpdateEmail} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl modern-input focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center space-x-2 px-6 py-3 btn-modern text-white rounded-xl font-medium disabled:opacity-50 transition-all"
          >
            <Save size={18} />
            <span>{loading ? 'Updating...' : 'Update Email'}</span>
          </button>
        </form>
      </div>

      {/* Subscription Status */}
      <div className="modern-card rounded-2xl p-6 mb-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center">
            <Crown className="text-yellow-500" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Subscription</h2>
            <p className="text-sm text-gray-500">Manage your subscription</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <p className="font-medium text-gray-700">Current Plan</p>
              <p className="text-sm text-gray-500 capitalize">{subscription?.plan || 'Free'} Plan</p>
            </div>
            <span className={`px-4 py-2 rounded-lg text-sm font-medium ${
              subscriptionStatus === 'Active' || subscriptionStatus === 'Lifetime'
                ? 'bg-green-100 text-green-700'
                : subscriptionStatus === 'Expired'
                ? 'bg-red-100 text-red-700'
                : 'bg-gray-100 text-gray-700'
            }`}>
              {subscriptionStatus}
            </span>
          </div>

          {subscription?.expiresAt && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar size={16} />
              <span>
                {subscription.plan === 'lifetime' 
                  ? 'Never expires' 
                  : `Expires on ${formatDate(subscription.expiresAt)}`}
              </span>
            </div>
          )}

          {subscription?.purchasedAt && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar size={16} />
              <span>Purchased on {formatDate(subscription.purchasedAt)}</span>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              onClick={() => navigate('/pricing')}
              className="flex-1 px-6 py-3 btn-modern text-white rounded-xl font-medium transition-all"
            >
              {subscription?.plan === 'free' ? 'Upgrade to Premium' : 'Change Plan'}
            </button>
            
            {subscription?.plan !== 'free' && subscription?.plan !== 'lifetime' && (
              <button
                onClick={handleCancelSubscription}
                className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel Subscription
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="modern-card rounded-2xl p-6 mb-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
            <Lock className="text-blue-500" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Change Password</h2>
            <p className="text-sm text-gray-500">Update your account password</p>
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl modern-input focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl modern-input focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl modern-input focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {message.text && (
            <div className={`p-4 rounded-xl ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex items-center space-x-2 px-6 py-3 btn-modern text-white rounded-xl font-medium disabled:opacity-50 transition-all"
          >
            <Lock size={18} />
            <span>{loading ? 'Updating...' : 'Change Password'}</span>
          </button>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="modern-card rounded-2xl p-6 border-2 border-red-200">
        <div className="flex items-center space-x-3 mb-4">
          <X className="text-red-500" size={24} />
          <div>
            <h2 className="text-xl font-semibold text-red-600">Danger Zone</h2>
            <p className="text-sm text-gray-500">Irreversible actions</p>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                // In a real app, this would delete the account
                alert('Account deletion feature will be implemented with backend integration.')
              }
            }}
            className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-medium"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  )
}

export default ManageAccount
