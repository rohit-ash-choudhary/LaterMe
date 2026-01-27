import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Send, Globe, Lock, Mail, Crown, AlertTriangle, X } from 'lucide-react'
import { canCreateLetter, isSubscriptionActive } from '../utils/subscription'
import { moderateContent } from '../utils/contentModeration'

const InstantLetter = ({ user, subscription }) => {
  const navigate = useNavigate()
  const [recipient, setRecipient] = useState('email')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [showContentWarning, setShowContentWarning] = useState(false)
  const [contentWarning, setContentWarning] = useState(null)

  const handleSend = () => {
    if (!message.trim()) {
      alert('Please write a message')
      return
    }

    if (recipient === 'email' && !email.trim()) {
      alert('Please enter an email address')
      return
    }

    if (!user && !isPublic) {
      alert('Please login to send private letters')
      navigate('/login')
      return
    }

    // Content moderation check - only for letters to someone else (not to self)
    if (recipient !== 'myself') {
      const moderationResult = moderateContent(message)
      if (!moderationResult.isSafe) {
        setContentWarning(moderationResult)
        setShowContentWarning(true)
        return
      }
    }

    // Check letter limit for free users
    if (user && !isSubscriptionActive(user.id)) {
      if (!canCreateLetter(user.id)) {
        setShowUpgradeModal(true)
        return
      }
    }

    // Save the letter
    const letter = {
      id: Date.now(),
      recipient: recipient === 'myself' ? 'myself' : email,
      subject,
      message,
      isPublic,
      createdAt: new Date().toISOString(),
    }

    if (isPublic) {
      // Add to public letters (in a real app, this would go to a backend)
      const publicLetters = JSON.parse(localStorage.getItem('futuroo_public') || '[]')
      publicLetters.unshift({
        ...letter,
        author: user?.name || 'Anonymous',
        likes: 0,
        comments: 0,
        isLiked: false,
        isSaved: false,
      })
      localStorage.setItem('futuroo_public', JSON.stringify(publicLetters))
    } else {
      // Save to instant letters
      const instantLetters = JSON.parse(localStorage.getItem('futuroo_instant') || '[]')
      instantLetters.unshift(letter)
      localStorage.setItem('futuroo_instant', JSON.stringify(instantLetters))
    }

    // Clear form
    setRecipient('email')
    setEmail('')
    setSubject('')
    setMessage('')
    setIsPublic(false)

    alert(isPublic ? 'Letter shared publicly!' : 'Letter sent!')
    
    if (isPublic) {
      navigate('/public-letters')
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="modern-card rounded-2xl p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Mail className="text-primary" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Write Letter to Someone Else</h1>
            <p className="text-gray-600">Send a message to someone special</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Recipient Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To:
            </label>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setRecipient('email')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  recipient === 'email'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Mail size={18} />
                <span>Send to Email</span>
              </button>
              <button
                onClick={() => {
                  setRecipient('public')
                  setIsPublic(true)
                }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  recipient === 'public'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Globe size={18} />
                <span>Share Publicly</span>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              ⚠️ All messages are checked for appropriate content. Threats, harmful language, or inappropriate content will be blocked.
            </p>
          </div>

          {/* Email Input (if email selected) */}
          {recipient === 'email' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="recipient@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          )}

          {/* Subject (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="A quick note..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Just wanted to say..."
              rows={10}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
          </div>

          {/* Privacy Toggle (if not public) */}
          {recipient !== 'public' && (
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsPublic(!isPublic)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isPublic
                    ? 'bg-primary/10 text-primary border border-primary'
                    : 'bg-gray-100 text-gray-700 border border-gray-200'
                }`}
              >
                {isPublic ? <Globe size={18} /> : <Lock size={18} />}
                <span>{isPublic ? 'Public' : 'Private'}</span>
              </button>
            </div>
          )}

          {/* Send Button */}
          <button
            onClick={handleSend}
            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-purple-600 transition-colors font-medium"
          >
            <Send size={20} />
            <span>Send Now</span>
          </button>
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <button
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
            
            <div className="text-center mb-6">
              <Crown className="mx-auto mb-4 text-yellow-500" size={48} />
              <h3 className="text-2xl font-bold mb-2">You've Reached Your Limit</h3>
              <p className="text-gray-600">
                You've used all 10 free letters. Upgrade to premium for unlimited letters!
              </p>
            </div>

            <div className="space-y-3">
              <Link
                to="/pricing"
                className="block w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-purple-600 transition-colors font-medium text-center"
                onClick={() => setShowUpgradeModal(false)}
              >
                View Pricing Plans
              </Link>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="w-full px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content Warning Modal */}
      {showContentWarning && contentWarning && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <button
              onClick={() => {
                setShowContentWarning(false)
                setContentWarning(null)
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
            
            <div className="text-center mb-6">
              <AlertTriangle className="mx-auto mb-4 text-red-500" size={48} />
              <h3 className="text-2xl font-bold mb-2 text-red-600">
                {contentWarning.severity === 'high' ? 'Inappropriate Content Detected' : 'Content Issue'}
              </h3>
              <p className="text-gray-700 mb-2 font-medium">
                {contentWarning.reason}
              </p>
              <p className="text-sm text-gray-600">
                Please revise your message to ensure it's respectful and appropriate. FUTUROO promotes positive communication.
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-red-800">
                <strong>Our Community Guidelines:</strong>
              </p>
              <ul className="text-sm text-red-700 mt-2 space-y-1 list-disc list-inside">
                <li>No threats, violence, or harmful language</li>
                <li>No harassment or bullying</li>
                <li>Be respectful and kind</li>
                <li>Messages must be meaningful and appropriate</li>
              </ul>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowContentWarning(false)
                  setContentWarning(null)
                }}
                className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-purple-600 transition-colors font-medium"
              >
                I'll Revise My Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default InstantLetter
