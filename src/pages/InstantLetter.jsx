import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Send, Lock, Mail, Crown, AlertTriangle, X, Plus, Trash2 } from 'lucide-react'
import { canCreateLetter, isSubscriptionActive } from '../utils/subscription'
import { moderateContent } from '../utils/contentModeration'
import { lettersToSomeoneElseAPI } from '../services/api'

const InstantLetter = ({ user, subscription }) => {
  const navigate = useNavigate()
  const MAX_RECIPIENTS = 3 // Maximum number of recipients allowed
  
  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    
    // Check if email is verified
    if (user.emailVerified === false || user.emailVerified === undefined) {
      navigate('/verify-email', { 
        state: { 
          userData: user 
        } 
      })
      return
    }
  }, [user, navigate])
  const [recipient, setRecipient] = useState('email')
  const [emails, setEmails] = useState(['']) // Array to store multiple emails
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [showContentWarning, setShowContentWarning] = useState(false)
  const [contentWarning, setContentWarning] = useState(null)
  const [isSending, setIsSending] = useState(false)

  // Validate email format
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Add new email input field (max 3 recipients)
  const addEmailField = () => {
    if (emails.length < MAX_RECIPIENTS) {
      setEmails([...emails, ''])
    }
  }

  // Remove email field
  const removeEmailField = (index) => {
    if (emails.length > 1) {
      const newEmails = emails.filter((_, i) => i !== index)
      setEmails(newEmails)
    }
  }

  // Update email at specific index
  const updateEmail = (index, value) => {
    const newEmails = [...emails]
    newEmails[index] = value
    setEmails(newEmails)
  }

  // Get valid emails (non-empty and valid format)
  const getValidEmails = () => {
    return emails.filter(email => email.trim() && isValidEmail(email.trim()))
  }

  const handleSend = async () => {
    if (!message.trim()) {
      alert('Please write a message')
      return
    }

    if (recipient !== 'email') {
      alert('Please select email as recipient type')
      return
    }

    const validEmails = getValidEmails()
    if (validEmails.length === 0) {
      alert('Please enter at least one valid email address')
      return
    }
    
    if (validEmails.length > MAX_RECIPIENTS) {
      alert(`You can only send to a maximum of ${MAX_RECIPIENTS} recipients`)
      return
    }

    if (!user) {
      alert('Please login to send letters')
      navigate('/login')
      return
    }

    // Content moderation check
    const moderationResult = moderateContent(message)
    if (!moderationResult.isSafe) {
      setContentWarning(moderationResult)
      setShowContentWarning(true)
      return
    }

    // Check letter limit for free users
    if (user && !isSubscriptionActive(user.id)) {
      if (!canCreateLetter(user.id)) {
        setShowUpgradeModal(true)
        return
      }
    }

    setIsSending(true)

    try {
      // Call backend API
      const letterData = {
        recipients: validEmails,
        subject: subject || undefined,
        message: message.trim(),
      }

      const response = await lettersToSomeoneElseAPI.send(letterData)
      
      // Success - clear form
      setRecipient('email')
      setEmails([''])
      setSubject('')
      setMessage('')
      
      const recipientCount = validEmails.length
      const statusMessage = response.status === 'SENT' 
        ? `Letter sent successfully to ${recipientCount} recipient${recipientCount > 1 ? 's' : ''}!`
        : response.responseMessage || 'Letter saved but email delivery may have failed'
      
      alert(statusMessage)
      
    } catch (error) {
      console.error('Error sending letter:', error)
      alert(`Failed to send letter: ${error.message || 'Please try again later'}`)
    } finally {
      setIsSending(false)
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
            </div>
            <p className="text-xs text-gray-500 mt-2">
              ⚠️ All messages are checked for appropriate content. Threats, harmful language, or inappropriate content will be blocked.
            </p>
          </div>

          {/* Multiple Email Inputs (if email selected) */}
          {recipient === 'email' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Addresses <span className="text-gray-400 font-normal">(Maximum {MAX_RECIPIENTS} recipients)</span>
              </label>
              <div className="space-y-2">
                {emails.map((email, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => updateEmail(index, e.target.value)}
                      placeholder={`recipient${index + 1}@example.com`}
                      className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                        email.trim() && !isValidEmail(email.trim())
                          ? 'border-red-300 bg-red-50'
                          : 'border-gray-300'
                      }`}
                    />
                    {emails.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeEmailField(index)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove email"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addEmailField}
                  disabled={emails.length >= MAX_RECIPIENTS}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    emails.length >= MAX_RECIPIENTS
                      ? 'text-gray-400 border border-gray-300 bg-gray-50 cursor-not-allowed'
                      : 'text-primary border border-primary hover:bg-primary/10'
                  }`}
                  title={emails.length >= MAX_RECIPIENTS ? `Maximum ${MAX_RECIPIENTS} recipients allowed` : 'Add another recipient'}
                >
                  <Plus size={18} />
                  <span>
                    {emails.length >= MAX_RECIPIENTS 
                      ? `Maximum ${MAX_RECIPIENTS} recipients reached` 
                      : 'Add Another Email'}
                  </span>
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {getValidEmails().length > 0 
                  ? `✓ ${getValidEmails().length} valid email${getValidEmails().length > 1 ? 's' : ''} added (${MAX_RECIPIENTS - getValidEmails().length} remaining)`
                  : `Enter at least one valid email address (up to ${MAX_RECIPIENTS} recipients)`}
              </p>
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


          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={isSending}
            className={`w-full flex items-center justify-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg transition-colors font-medium ${
              isSending 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-purple-600'
            }`}
          >
            <Send size={20} />
            <span>{isSending ? 'Sending...' : 'Send Now'}</span>
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
                Please revise your message to ensure it's respectful and appropriate. LaterMe promotes positive communication.
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
