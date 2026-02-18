import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { FileText, Calendar, Send, Save, Lock, Heart, AlertCircle, Trophy, DollarSign, Lightbulb, X, Globe, Crown, Zap, Mail, Trash2 } from 'lucide-react'
import { format, differenceInMonths, differenceInDays, isBefore, parseISO } from 'date-fns'
import { canCreateLetter, getRemainingFreeLetters, isSubscriptionActive } from '../utils/subscription'
import { lettersToSomeoneElseAPI, lettersAPI } from '../services/api'

const WriteLater = ({ user, subscription }) => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('drafts')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [deliveryType, setDeliveryType] = useState('date') // 'date' or 'open-when'
  const [deliveryDate, setDeliveryDate] = useState('')
  const [openWhenTrigger, setOpenWhenTrigger] = useState('')
  const [mood, setMood] = useState('')
  const [identity, setIdentity] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [drafts, setDrafts] = useState([])
  const [scheduled, setScheduled] = useState([])
  const [delivered, setDelivered] = useState([])
  const [instantLetters, setInstantLetters] = useState([])
  const [showCheckIn, setShowCheckIn] = useState(false)
  const [showBeforeOpen, setShowBeforeOpen] = useState(false)
  const [showDeliveryRitual, setShowDeliveryRitual] = useState(false)
  const [letterToOpen, setLetterToOpen] = useState(null)
  const [viewingLetter, setViewingLetter] = useState(null)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [remainingLetters, setRemainingLetters] = useState(null)

  const openWhenOptions = [
    { value: 'lost', label: 'Open when I feel lost', icon: AlertCircle, color: 'text-blue-500' },
    { value: 'fail', label: 'Open when I fail', icon: Heart, color: 'text-red-500' },
    { value: 'succeed', label: 'Open when I succeed', icon: Trophy, color: 'text-yellow-500' },
    { value: 'broke', label: "Open when I'm broke", icon: DollarSign, color: 'text-green-500' },
    { value: 'forgot', label: 'Open when I forget why I started', icon: Lightbulb, color: 'text-purple-500' },
  ]

  const moodOptions = [
    { value: 'sad', emoji: '😔', label: 'Sad' },
    { value: 'calm', emoji: '😌', label: 'Calm' },
    { value: 'angry', emoji: '😤', label: 'Angry' },
    { value: 'happy', emoji: '😍', label: 'Happy' },
    { value: 'tired', emoji: '😴', label: 'Tired' },
  ]

  const identityOptions = [
    { value: 'dreamer', label: 'Dreamer', emoji: '✨', description: 'The version of you that believes anything is possible' },
    { value: 'survivor', label: 'Survivor', emoji: '🛡️', description: 'The version of you that has overcome challenges' },
    { value: 'beginner', label: 'Beginner', emoji: '🌱', description: 'The version of you that is starting fresh' },
    { value: 'builder', label: 'Builder', emoji: '🏗️', description: 'The version of you that creates and constructs' },
    { value: 'healer', label: 'Healer', emoji: '💚', description: 'The version of you that nurtures and cares' },
  ]

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
    
    // Load all letters from backend API
    try {
      loadAllLetters()
      
      // Load letters to someone else from backend API
      loadLettersToSomeoneElse()
      
      // Check remaining letters
      const remaining = getRemainingFreeLetters(user.id)
      setRemainingLetters(remaining)
    } catch (error) {
      console.error('Error initializing WriteLater:', error)
      // Don't navigate away, just log the error so the page can still render
    }
  }, [user, navigate])

  const loadAllLetters = async () => {
    if (!user) return
    
    try {
      // Load drafts
      const draftsData = await lettersAPI.getAll('drafts')
      setDrafts(draftsData || [])
      
      // Load scheduled letters
      const scheduledData = await lettersAPI.getAll('scheduled')
      setScheduled(scheduledData || [])
      
      // Load delivered letters (letters ready to open)
      const deliveredData = await lettersAPI.getAll('delivered')
      setDelivered(deliveredData || [])
    } catch (error) {
      console.error('Error loading letters:', error)
      // Fallback to empty arrays
      setDrafts([])
      setScheduled([])
      setDelivered([])
    }
  }

  const loadLettersToSomeoneElse = async () => {
    if (!user) return
    
    try {
      const letters = await lettersToSomeoneElseAPI.getAll()
      // Transform backend response to match frontend format
      const transformedLetters = letters.map(letter => ({
        id: letter.id,
        recipient: letter.recipients?.[0] || 'Unknown',
        recipients: letter.recipients || [],
        subject: letter.subject || 'No Subject',
        message: letter.message,
        status: letter.status,
        sentAt: letter.sentAt,
        createdAt: letter.createdAt,
        isPublic: false,
      }))
      setInstantLetters(transformedLetters)
    } catch (error) {
      console.error('Error loading letters to someone else:', error)
      // Fallback to empty array on error
      setInstantLetters([])
    }
  }

  // Refresh letters when tab changes
  useEffect(() => {
    if (user) {
      if (activeTab === 'instant') {
        loadLettersToSomeoneElse()
      } else {
        loadAllLetters()
      }
    }
  }, [activeTab, user])

  // Periodically check for letters that should be marked as delivered
  useEffect(() => {
    if (!user) return
    
    const checkDeliveredInterval = setInterval(() => {
      // Reload letters to check for date-based deliveries
      loadAllLetters()
    }, 60000) // Check every minute
    
    return () => clearInterval(checkDeliveredInterval)
  }, [user])

  // Auto-save draft to backend
  useEffect(() => {
    if ((title || content) && user) {
      const autoSaveTimer = setTimeout(async () => {
        try {
          const draftData = {
            title: title || 'Untitled',
            content,
            deliveryType,
            deliveryDate: deliveryDate || undefined,
            openWhenTrigger: openWhenTrigger || undefined,
            mood: mood || undefined,
            identity: identity || undefined,
            isPublic: isPublic || false,
          }
          
          // Try to update existing draft or create new one
          // For auto-save, we'll create/update via API
          // Note: You might want to track the current draft ID
          await lettersAPI.createDraft(draftData)
          // Reload drafts after auto-save
          const draftsData = await lettersAPI.getAll('drafts')
          setDrafts(draftsData || [])
        } catch (error) {
          console.error('Error auto-saving draft:', error)
          // Silently fail for auto-save
        }
      }, 3000) // Increased to 3 seconds to reduce API calls
      return () => clearTimeout(autoSaveTimer)
    }
  }, [title, content, deliveryDate, deliveryType, openWhenTrigger, mood, identity, isPublic, user])

  const handleSaveDraft = async () => {
    if (!user) {
      alert('Please login to save drafts')
      return
    }
    
    try {
      const draftData = {
        title: title || 'Untitled',
        content,
        deliveryType,
        deliveryDate: deliveryDate || undefined,
        openWhenTrigger: openWhenTrigger || undefined,
        mood: mood || undefined,
        identity: identity || undefined,
        isPublic: isPublic || false,
      }
      
      await lettersAPI.createDraft(draftData)
      await loadAllLetters() // Reload all letters
      alert('Draft saved!')
    } catch (error) {
      console.error('Error saving draft:', error)
      alert('Failed to save draft: ' + (error.message || 'Please try again'))
    }
  }

  const handleSend = async () => {
    if (!title || !content) {
      alert('Please fill in title and content')
      return
    }
    
    if (!user) {
      alert('Please login to schedule letters')
      navigate('/login')
      return
    }
    
    // Check letter limit for free users
    if (!isSubscriptionActive(user.id)) {
      if (!canCreateLetter(user.id)) {
        setShowUpgradeModal(true)
        return
      }
    }
    
    if (deliveryType === 'date' && !deliveryDate) {
      alert('Please select a delivery date')
      return
    }
    if (deliveryType === 'open-when' && !openWhenTrigger) {
      alert('Please select an Open-When trigger')
      return
    }

    try {
      // Format deliveryDate properly if it exists
      let formattedDeliveryDate = undefined
      if (deliveryType === 'date' && deliveryDate) {
        // If it's just a date (yyyy-MM-dd), add time to make it end of day
        if (deliveryDate.length === 10) {
          formattedDeliveryDate = deliveryDate + 'T23:59:59'
        } else {
          formattedDeliveryDate = deliveryDate
        }
      }
      
      const letterData = {
        title,
        content,
        deliveryType,
        deliveryDate: formattedDeliveryDate,
        openWhenTrigger: deliveryType === 'open-when' ? openWhenTrigger : undefined,
        mood: mood || undefined,
        identity: identity || undefined,
        isPublic: isPublic || false,
      }
      
      await lettersAPI.schedule(letterData)
      
      // Reload all letters
      await loadAllLetters()

      // Clear form
      setTitle('')
      setContent('')
      setDeliveryDate('')
      setOpenWhenTrigger('')
      setMood('')
      setIdentity('')
      setDeliveryType('date')
      setIsPublic(false)

      alert('Letter scheduled successfully!')
    } catch (error) {
      console.error('Error scheduling letter:', error)
      alert('Failed to schedule letter: ' + (error.message || 'Please try again'))
    }
  }

  const loadDraft = (draft) => {
    setTitle(draft.title || '')
    setContent(draft.content || '')
    setDeliveryDate(draft.deliveryDate || '')
    setDeliveryType(draft.deliveryType || 'date')
    setOpenWhenTrigger(draft.openWhenTrigger || '')
    setMood(draft.mood || '')
    setIdentity(draft.identity || '')
    setIsPublic(draft.isPublic || false)
    setActiveTab('drafts')
  }

  const handleDeleteDraft = async (draftId, e) => {
    e.stopPropagation() // Prevent triggering the onClick to load draft
    
    if (window.confirm('Are you sure you want to delete this draft? This action cannot be undone.')) {
      try {
        await lettersAPI.deleteDraft(draftId)
        
        // Reload drafts
        await loadAllLetters()
        
        // If the deleted draft was currently loaded, clear the form
        if (title || content) {
          const currentDraft = drafts.find(d => d.id === draftId)
          if (currentDraft && 
              (currentDraft.title === title || currentDraft.content === content)) {
            setTitle('')
            setContent('')
            setDeliveryDate('')
            setOpenWhenTrigger('')
            setMood('')
            setIdentity('')
            setIsPublic(false)
            setDeliveryType('date')
          }
        }
      } catch (error) {
        console.error('Error deleting draft:', error)
        alert('Failed to delete draft: ' + (error.message || 'Please try again'))
      }
    }
  }

  const canOpenLetter = (letter) => {
    if (!letter) return false
    
    // Check if letter is already opened
    if (letter.isOpened || letter.status === 'opened') {
      return false
    }
    
    // Check delivery type
    if (letter.deliveryType === 'date') {
      // For date-based letters, check if delivery date has passed
      if (letter.deliveryDate) {
        const deliveryDate = new Date(letter.deliveryDate)
        const now = new Date()
        return deliveryDate <= now
      }
      return false
    } else if (letter.deliveryType === 'open-when') {
      // For open-when letters, they can always be opened manually
      // (user decides when the trigger condition is met)
      return true
    }
    
    return false
  }

  const handleOpenLetter = async (letter) => {
    if (!user) {
      alert('Please login to open letters')
      return
    }

    // Check if letter can be opened
    if (!canOpenLetter(letter)) {
      if (letter.deliveryType === 'date' && letter.deliveryDate) {
        const deliveryDate = new Date(letter.deliveryDate)
        const now = new Date()
        if (deliveryDate > now) {
          alert(`This letter will be available on ${format(deliveryDate, 'MMM dd, yyyy')}`)
          return
        }
      }
      alert('This letter cannot be opened yet')
      return
    }

    // Set letter to open and show check-in modal
    setLetterToOpen(letter)
    setShowCheckIn(true)
  }

  const confirmOpenLetter = () => {
    if (!letterToOpen) return
    setShowCheckIn(false)
    setShowBeforeOpen(true)
  }

  const proceedToDeliveryRitual = async () => {
    if (!letterToOpen) return
    
    setShowBeforeOpen(false)
    setShowDeliveryRitual(true)
    
    // After animation, open the letter via API
    setTimeout(async () => {
      try {
        // Get current mood if letter has mood requirement
        const currentMood = letterToOpen.mood || null
        
        // Call backend API to open the letter with current mood
        const openedLetter = await lettersAPI.open(letterToOpen.id, currentMood)
        
        // Reload all letters to get updated status
        await loadAllLetters()
        
        setShowDeliveryRitual(false)
        setViewingLetter({
          title: openedLetter.title,
          content: openedLetter.content,
          createdAt: openedLetter.createdAt,
          mood: openedLetter.mood,
          identity: openedLetter.identity,
          deliveryType: openedLetter.deliveryType,
          deliveryDate: openedLetter.deliveryDate,
          openWhenTrigger: openedLetter.openWhenTrigger,
        })
        setLetterToOpen(null)
      } catch (error) {
        console.error('Error opening letter:', error)
        alert('Failed to open letter: ' + (error.message || 'Please try again'))
        setShowDeliveryRitual(false)
        setLetterToOpen(null)
      }
    }, 3000) // Show ritual for 3 seconds
  }

  const closeLetterView = () => {
    setViewingLetter(null)
  }

  const renderLetterList = (letters, emptyMessage) => {
    if (letters.length === 0) {
      return (
        <div className="text-center py-12 text-gray-500">
          <p>{emptyMessage}</p>
        </div>
      )
    }

    return (
      <div className="space-y-3">
        {letters.map((letter) => {
          const TriggerIcon = letter.openWhenTrigger 
            ? openWhenOptions.find(opt => opt.value === letter.openWhenTrigger)?.icon 
            : null
          const triggerColor = letter.openWhenTrigger
            ? openWhenOptions.find(opt => opt.value === letter.openWhenTrigger)?.color
            : ''
          const moodEmoji = letter.mood 
            ? moodOptions.find(opt => opt.value === letter.mood)?.emoji 
            : null

          // For instant letters, show different format
          if (activeTab === 'instant') {
            const isFailed = letter.status === 'FAILED'
            
            return (
              <div
                key={letter.id}
                className="modern-card p-4 rounded-xl relative group"
                onClick={() => {
                  if (!isFailed) {
                    setViewingLetter({
                      title: letter.subject || 'Instant Letter',
                      content: letter.message,
                      createdAt: letter.createdAt,
                      recipient: letter.recipient,
                      recipients: letter.recipients || []
                    })
                  }
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{letter.subject || 'No Subject'}</h4>
                      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Mail size={12} />
                        Instant
                      </span>
                    </div>
                    {letter.recipients && letter.recipients.length > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        To: {letter.recipients.join(', ')}
                        {letter.recipients.length > 1 && (
                          <span className="ml-1">({letter.recipients.length} recipients)</span>
                        )}
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                  {letter.message.substring(0, 100)}...
                </p>
                <div className="flex items-center gap-2 flex-wrap text-xs text-gray-400">
                  {letter.sentAt ? (
                    <span>📅 Sent: {format(new Date(letter.sentAt), 'MMM dd, yyyy, h:mm a')}</span>
                  ) : letter.createdAt ? (
                    <span>📅 Created: {format(new Date(letter.createdAt), 'MMM dd, yyyy, h:mm a')}</span>
                  ) : null}
                  {letter.status && (
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      letter.status === 'SENT' ? 'bg-green-100 text-green-600' :
                      letter.status === 'FAILED' ? 'bg-red-100 text-red-600' :
                      'bg-yellow-100 text-yellow-600'
                    }`}>
                      {letter.status}
                    </span>
                  )}
                  {!isFailed && (
                    <span className="text-primary font-medium cursor-pointer">Click to view →</span>
                  )}
                </div>
                {/* Retry button for failed letters */}
                {isFailed && (
                  <button
                    onClick={async (e) => {
                      e.stopPropagation()
                      if (window.confirm('Do you want to try sending this letter again?')) {
                        try {
                          const response = await lettersToSomeoneElseAPI.retry(letter.id)
                          if (response.status === 'SENT') {
                            alert('Letter sent successfully!')
                          } else {
                            alert(`Retry failed: ${response.responseMessage || 'Please try again later'}`)
                          }
                          // Reload letters
                          await loadLettersToSomeoneElse()
                        } catch (error) {
                          console.error('Error retrying letter:', error)
                          alert(`Failed to retry: ${error.message || 'Please try again later'}`)
                        }
                      }
                    }}
                    className="mt-3 w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-purple-600 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <RefreshCw size={16} />
                    <span>Try Again</span>
                  </button>
                )}
              </div>
            )
          }

          return (
            <div
              key={letter.id}
              className={`modern-card p-4 rounded-xl relative group ${
                activeTab === 'drafts' ? 'cursor-pointer' : ''
              } ${(activeTab === 'scheduled' || activeTab === 'delivered') && !letter.isOpened ? 'cursor-pointer' : ''}`}
              onClick={() => {
                if (activeTab === 'drafts') {
                  loadDraft(letter)
                } else if (activeTab === 'scheduled' || activeTab === 'delivered') {
                  // Check if letter can be opened
                  if (canOpenLetter(letter)) {
                    handleOpenLetter(letter)
                  } else if (letter.deliveryType === 'date' && letter.deliveryDate) {
                    const deliveryDate = new Date(letter.deliveryDate)
                    alert(`This letter will be available on ${format(deliveryDate, 'MMM dd, yyyy')}`)
                  } else if (letter.deliveryType === 'open-when') {
                    // For open-when letters, allow opening
                    handleOpenLetter(letter)
                  }
                }
              }}
            >
              {/* Delete button for drafts */}
              {activeTab === 'drafts' && (
                <button
                  onClick={(e) => handleDeleteDraft(letter.id, e)}
                  className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                  title="Delete draft"
                >
                  <Trash2 size={16} />
                </button>
              )}
              
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{letter.title}</h4>
                    {letter.isPublic && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Globe size={12} />
                        Public
                      </span>
                    )}
                  </div>
                  {letter.identity && (
                    <p className="text-xs text-gray-500 mt-1">
                      Written by: The {identityOptions.find(opt => opt.value === letter.identity)?.label} version of you
                    </p>
                  )}
                </div>
                {moodEmoji && (
                  <span className="text-lg" title={`Written while feeling: ${moodOptions.find(opt => opt.value === letter.mood)?.label}`}>
                    {moodEmoji}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                {letter.content.substring(0, 100)}...
              </p>
              <div className="flex items-center gap-2 flex-wrap text-xs text-gray-400">
                {letter.deliveryType === 'date' && letter.deliveryDate && (
                  <span>📅 {format(new Date(letter.deliveryDate), 'MMM dd, yyyy')}</span>
                )}
                {letter.deliveryType === 'open-when' && letter.openWhenTrigger && TriggerIcon && (
                  <span className={`flex items-center gap-1 ${triggerColor}`}>
                    <TriggerIcon size={12} />
                    {openWhenOptions.find(opt => opt.value === letter.openWhenTrigger)?.label}
                  </span>
                )}
                {letter.updatedAt && (
                  <span>• Updated: {format(new Date(letter.updatedAt), 'MMM dd, yyyy')}</span>
                )}
                {activeTab === 'scheduled' && !letter.isOpened && canOpenLetter(letter) && (
                  <span className="text-primary font-medium">✨ Ready to open - Click to receive →</span>
                )}
                {activeTab === 'scheduled' && !letter.isOpened && !canOpenLetter(letter) && letter.deliveryDate && (
                  <span className="text-gray-500">⏳ Not yet available</span>
                )}
                {activeTab === 'delivered' && !letter.isOpened && (
                  <span className="text-primary font-medium">📬 Click to open →</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Panel */}
        <div className="lg:col-span-1">
          <div className="modern-card rounded-2xl p-6 sticky top-24">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">My Letters</h2>
            <div className="space-y-2">
              <button
                onClick={() => setActiveTab('drafts')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'drafts'
                    ? 'bg-primary text-white'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FileText size={20} />
                <span>Drafts ({drafts.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('scheduled')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'scheduled'
                    ? 'bg-primary text-white'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Calendar size={20} />
                <span>Arriving Moments ({scheduled.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('delivered')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'delivered'
                    ? 'bg-primary text-white'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Send size={20} />
                <span>Received ({delivered.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('instant')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'instant'
                    ? 'bg-primary text-white'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Mail size={20} />
                <span>Instant Letters ({instantLetters.length})</span>
              </button>
            </div>

            <div className="mt-6 max-h-96 overflow-y-auto">
              {activeTab === 'drafts' && renderLetterList(drafts, 'No drafts yet')}
              {activeTab === 'scheduled' && renderLetterList(scheduled, 'No arriving moments yet')}
              {activeTab === 'delivered' && renderLetterList(delivered, 'No received letters yet')}
              {activeTab === 'instant' && renderLetterList(instantLetters, 'No instant letters yet')}
            </div>
          </div>
        </div>

        {/* Main Writing Area */}
        <div className="lg:col-span-2">
          <div className="modern-card rounded-2xl p-8">
            <h1 className="text-2xl font-bold mb-6">Letter to My Future Self</h1>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Letter to my 2030 self"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Write your letter...
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="To the person I'll become...&#10;&#10;Right now, I'm writing this because...&#10;&#10;I want you to remember that...&#10;&#10;When you read this, I hope..."
                  rows={12}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl modern-input focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all resize-none"
                />
              </div>

              {/* Delivery Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  When should this letter be opened?
                </label>
                <div className="flex gap-3 mb-4">
                  <button
                    type="button"
                    onClick={() => setDeliveryType('date')}
                    className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                      deliveryType === 'date'
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <Calendar size={20} className="mx-auto mb-1" />
                    <span className="text-sm font-medium">Date-Based</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryType('open-when')}
                    className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                      deliveryType === 'open-when'
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <Heart size={20} className="mx-auto mb-1" />
                    <span className="text-sm font-medium">Open-When</span>
                  </button>
                </div>
              </div>

              {/* Date-Based Delivery */}
              {deliveryType === 'date' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📅 Deliver On
                  </label>
                  <input
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              )}

              {/* Open-When Triggers */}
              {deliveryType === 'open-when' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Open when...
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {openWhenOptions.map((option) => {
                      const Icon = option.icon
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setOpenWhenTrigger(option.value)}
                          className={`p-4 rounded-lg border-2 text-left transition-all ${
                            openWhenTrigger === option.value
                              ? 'border-primary bg-primary/10'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <Icon size={20} className={option.color} />
                            <span className="text-sm font-medium text-gray-700">{option.label}</span>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Identity Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Who are you writing as? <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {identityOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setIdentity(option.value)}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${
                        identity === option.value
                          ? 'border-primary bg-primary/10'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-lg">{option.emoji}</span>
                        <span className="text-sm font-medium text-gray-700">{option.label}</span>
                      </div>
                      <p className="text-xs text-gray-500">{option.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mood Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  How are you feeling right now? <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <div className="flex gap-3">
                  {moodOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setMood(option.value)}
                      className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                        mood === option.value
                          ? 'border-primary bg-primary/10'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-2xl block mb-1">{option.emoji}</span>
                      <span className="text-xs text-gray-600">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Privacy Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Who can see this letter?
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsPublic(false)}
                    className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg border-2 transition-all ${
                      !isPublic
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <Lock size={18} />
                    <span className="font-medium">Private</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPublic(true)}
                    className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg border-2 transition-all ${
                      isPublic
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <Globe size={18} />
                    <span className="font-medium">Public</span>
                  </button>
                </div>
                {isPublic && (
                  <p className="text-xs text-gray-500 mt-2">
                    This letter will be visible to everyone in the Public Letters tab
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleSaveDraft}
                  className="flex items-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Save size={18} />
                  <span>Save Draft</span>
                </button>
                <button
                  onClick={handleSend}
                  className="flex items-center space-x-2 px-6 py-3 btn-modern text-white rounded-xl transition-all"
                >
                  <Send size={18} />
                  <span>Send</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Past-Me Check-in Modal */}
      {showCheckIn && letterToOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <button
              onClick={() => {
                setShowCheckIn(false)
                setLetterToOpen(null)
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
            
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">Past-Me Check-in</h3>
              {letterToOpen.createdAt && (
                <p className="text-gray-600">
                  You wrote this {(() => {
                    const months = differenceInMonths(new Date(), new Date(letterToOpen.createdAt))
                    const days = differenceInDays(new Date(), new Date(letterToOpen.createdAt))
                    if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`
                    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`
                    return 'today'
                  })()}.
                </p>
              )}
              <p className="text-lg text-gray-700 mt-4 font-medium">
                Want to receive it now?
              </p>
              {letterToOpen.mood && (
                <p className="text-sm text-gray-500 mt-2">
                  You wrote this while feeling: {moodOptions.find(opt => opt.value === letterToOpen.mood)?.emoji} {moodOptions.find(opt => opt.value === letterToOpen.mood)?.label}
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCheckIn(false)
                  setLetterToOpen(null)
                }}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Not yet
              </button>
              <button
                onClick={confirmOpenLetter}
                className="flex-1 px-4 py-3 bg-primary text-white rounded-lg hover:bg-purple-600 transition-colors font-medium"
              >
                Receive
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Before You Open Screen */}
      {showBeforeOpen && letterToOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="modern-card rounded-2xl max-w-lg w-full p-8 text-center animate-scale-in">
            <div className="mb-6">
              <h2 className="text-3xl font-bold mb-4">Before You Open</h2>
              <p className="text-xl text-gray-600 mb-6">Take a breath.</p>
              {letterToOpen.createdAt && (
                <p className="text-lg text-gray-700">
                  You wrote this on {format(new Date(letterToOpen.createdAt), 'dd MMM yyyy')}.
                </p>
              )}
              {letterToOpen.identity && (
                <p className="text-sm text-gray-500 mt-3">
                  Written by: The {identityOptions.find(opt => opt.value === letterToOpen.identity)?.label} version of you
                </p>
              )}
            </div>
            <button
              onClick={proceedToDeliveryRitual}
              className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-purple-600 transition-colors font-medium text-lg"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Delivery Ritual */}
      {showDeliveryRitual && letterToOpen && (
        <div className="fixed inset-0 gradient-primary flex items-center justify-center z-50 p-4">
          <div className="text-center text-white animate-fade-in">
            {letterToOpen.createdAt && (() => {
              const days = differenceInDays(new Date(), new Date(letterToOpen.createdAt))
              return (
                <>
                  <div className="text-6xl mb-6 animate-pulse">✉️</div>
                  <h2 className="text-4xl font-bold mb-4">This waited {days} day{days !== 1 ? 's' : ''} to reach you</h2>
                  <p className="text-xl opacity-90">
                    {format(new Date(letterToOpen.createdAt), 'dd MMM yyyy, h:mm a')}
                  </p>
                  <p className="text-lg opacity-75 mt-2">
                    → {format(new Date(), 'dd MMM yyyy, h:mm a')}
                  </p>
                </>
              )
            })()}
          </div>
        </div>
      )}

      {/* Letter View */}
      {viewingLetter && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="modern-card rounded-2xl max-w-2xl w-full p-8 my-8 animate-scale-in">
            <button
              onClick={closeLetterView}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
            
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-4">{viewingLetter.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                {viewingLetter.createdAt && (
                  <span>
                    {viewingLetter.recipient ? 'Sent' : 'Written'}: {format(new Date(viewingLetter.createdAt), 'dd MMM yyyy, h:mm a')}
                  </span>
                )}
                {viewingLetter.openedAt && (
                  <span>• Received: {format(new Date(viewingLetter.openedAt), 'dd MMM yyyy, h:mm a')}</span>
                )}
              </div>
              {viewingLetter.recipient && (
                <div className="mt-2">
                  <p className="text-sm text-primary font-medium">
                    To: {viewingLetter.recipient}
                  </p>
                  {viewingLetter.recipients && viewingLetter.recipients.length > 1 && (
                    <p className="text-xs text-gray-500 mt-1">
                      Also sent to: {viewingLetter.recipients.filter(r => r !== viewingLetter.recipient).join(', ')}
                    </p>
                  )}
                </div>
              )}
              {viewingLetter.identity && (
                <p className="text-sm text-primary mt-2">
                  Written by: The {identityOptions.find(opt => opt.value === viewingLetter.identity)?.label} version of you
                </p>
              )}
            </div>
            
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed text-lg">
                {viewingLetter.content}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="modern-card rounded-2xl max-w-md w-full p-6 animate-scale-in">
            <button
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
            
            <div className="text-center mb-6">
              <Crown className="mx-auto mb-4 text-yellow-500" size={48} />
              <h3 className="text-2xl font-bold mb-2">You've Reached Your Limit</h3>
              <p className="text-gray-600">
                You've used all 10 free letters. Upgrade to premium for unlimited letters!
              </p>
            </div>

            <div className="space-y-3 mb-6">
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
    </div>
  )
}

export default WriteLater
