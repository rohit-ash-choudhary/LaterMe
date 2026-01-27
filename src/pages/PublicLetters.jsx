import { useState, useEffect } from 'react'
import { Heart, MessageCircle, Share2, Bookmark, TrendingUp, Clock, Star, Search, Sparkles, Leaf, Flame } from 'lucide-react'
import { format } from 'date-fns'

const PublicLetters = ({ user }) => {
  const [letters, setLetters] = useState([])
  const [filter, setFilter] = useState('latest')
  const [searchQuery, setSearchQuery] = useState('')
  const [savedLetters, setSavedLetters] = useState([])

  const silentReactions = [
    { id: 'felt', emoji: '🤍', label: 'I felt this', icon: Heart, color: 'text-pink-500' },
    { id: 'helped', emoji: '🌱', label: 'This helped me', icon: Leaf, color: 'text-green-500' },
    { id: 'alone', emoji: '🕯️', label: "You're not alone", icon: Flame, color: 'text-yellow-500' },
  ]

  useEffect(() => {
    // Load mock public letters
    const mockLetters = [
      {
        id: 1,
        author: 'Ashhh Saharan',
        title: 'Letter to my 2030 self',
        content: 'Dear Future Me, I hope you are doing well. I am writing this in 2024, and I want to remind you of the dreams we had. Remember to stay true to yourself and never give up on what matters most.',
        likes: 120,
        comments: 24,
        createdAt: new Date('2024-01-15').toISOString(),
        isLiked: false,
        isSaved: false,
        silentReactions: { felt: 45, helped: 32, alone: 28 },
        userReactions: [],
      },
      {
        id: 2,
        author: 'John Doe',
        title: 'Reflections on Growth',
        content: 'Looking back at this moment, I want to remember how far I\'ve come. The challenges we faced made us stronger, and I hope you\'re still pushing forward.',
        likes: 89,
        comments: 12,
        createdAt: new Date('2024-01-20').toISOString(),
        isLiked: true,
        isSaved: false,
        silentReactions: { felt: 23, helped: 18, alone: 15 },
        userReactions: ['felt'],
      },
      {
        id: 3,
        author: 'Jane Smith',
        title: 'A Message of Hope',
        content: 'To my future self: Keep believing in yourself. The journey ahead might be uncertain, but you have the strength to overcome anything.',
        likes: 156,
        comments: 31,
        createdAt: new Date('2024-01-18').toISOString(),
        isLiked: false,
        isSaved: true,
        silentReactions: { felt: 67, helped: 54, alone: 42 },
        userReactions: ['helped'],
      },
    ]
    
    // Load public letters from localStorage (letters marked as public)
    const publicLetters = JSON.parse(localStorage.getItem('futuroo_public') || '[]')
    
    // Merge mock letters with user-created public letters
    // Remove duplicates and sort by date
    const allLetters = [...mockLetters, ...publicLetters]
      .filter((letter, index, self) => 
        index === self.findIndex(l => l.id === letter.id)
      )
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    
    setLetters(allLetters)

    // Load saved letters
    const saved = JSON.parse(localStorage.getItem('futuroo_saved') || '[]')
    setSavedLetters(saved)
  }, [])
  
  // Re-filter letters when component updates (to show newly available letters)
  useEffect(() => {
    const interval = setInterval(() => {
      setLetters(prevLetters => [...prevLetters]) // Trigger re-render to re-filter
    }, 60000) // Check every minute
    
    return () => clearInterval(interval)
  }, [])

  const handleLike = (letterId) => {
    if (!user) {
      alert('Please login to like letters')
      return
    }
    setLetters(letters.map(letter =>
      letter.id === letterId
        ? { ...letter, likes: letter.isLiked ? letter.likes - 1 : letter.likes + 1, isLiked: !letter.isLiked }
        : letter
    ))
  }

  const handleSave = (letterId) => {
    if (!user) {
      alert('Please login to save letters')
      return
    }
    const letter = letters.find(l => l.id === letterId)
    const updatedSaved = letter.isSaved
      ? savedLetters.filter(id => id !== letterId)
      : [...savedLetters, letterId]
    localStorage.setItem('futuroo_saved', JSON.stringify(updatedSaved))
    setSavedLetters(updatedSaved)
    setLetters(letters.map(l =>
      l.id === letterId ? { ...l, isSaved: !l.isSaved } : l
    ))
  }

  const handleSilentReaction = (letterId, reactionId) => {
    if (!user) {
      alert('Please login to react')
      return
    }
    setLetters(letters.map(letter => {
      if (letter.id === letterId) {
        const hasReaction = letter.userReactions?.includes(reactionId) || false
        const newReactions = hasReaction
          ? letter.userReactions.filter(r => r !== reactionId)
          : [...(letter.userReactions || []), reactionId]
        
        return {
          ...letter,
          userReactions: newReactions,
          silentReactions: {
            ...letter.silentReactions,
            [reactionId]: hasReaction
              ? (letter.silentReactions[reactionId] || 1) - 1
              : (letter.silentReactions[reactionId] || 0) + 1
          }
        }
      }
      return letter
    }))
  }

  const handleShare = async (letter) => {
    const url = `${window.location.origin}/public-letters/${letter.id}`
    if (navigator.share) {
      try {
        await navigator.share({
          title: letter.title,
          text: letter.content.substring(0, 100),
          url,
        })
      } catch (err) {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(url)
      alert('Link copied to clipboard!')
    }
  }

  const filteredLetters = letters
    .filter(letter => {
      // Filter by search query
      if (searchQuery) {
        const matchesSearch = letter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
               letter.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
               letter.author.toLowerCase().includes(searchQuery.toLowerCase())
        if (!matchesSearch) return false
      }
      
      // Filter by delivery date - only show letters where delivery date has passed
      // For date-based letters, check if deliveryDate has passed
      if (letter.deliveryType === 'date' && letter.deliveryDate) {
        const deliveryDate = new Date(letter.deliveryDate)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        deliveryDate.setHours(0, 0, 0, 0)
        if (deliveryDate > today) {
          return false // Don't show letters with future delivery dates
        }
      }
      
      // For Open-When letters, they can be shown immediately (user decides when to open)
      // For letters without deliveryType (old mock data), show them
      
      return true
    })
    .sort((a, b) => {
      switch (filter) {
        case 'trending':
          return b.likes - a.likes
        case 'most-liked':
          return b.likes - a.likes
        case 'latest':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt)
      }
    })

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Public Letters</h1>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search letters..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => setFilter('trending')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              filter === 'trending'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <TrendingUp size={18} />
            <span>🔥 Trending</span>
          </button>
          <button
            onClick={() => setFilter('latest')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              filter === 'latest'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Clock size={18} />
            <span>🕒 Latest</span>
          </button>
          <button
            onClick={() => setFilter('most-liked')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              filter === 'most-liked'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Star size={18} />
            <span>❤️ Most Liked</span>
          </button>
        </div>
      </div>

      {/* Letters Feed */}
      <div className="space-y-6">
        {filteredLetters.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>
              {searchQuery 
                ? 'No letters found matching your search.' 
                : letters.length > 0
                  ? 'No letters are available yet. Some may be scheduled for future dates.'
                  : 'No letters found. Be the first to share your story!'}
            </p>
          </div>
        ) : (
          filteredLetters.map((letter) => (
            <div
              key={letter.id}
              className="modern-card rounded-2xl p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                    {letter.author.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{letter.author}</div>
                    <div className="text-sm text-gray-500">
                      {format(new Date(letter.createdAt), 'MMM dd, yyyy')}
                    </div>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-3">{letter.title}</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">{letter.content}</p>

              {/* Silent Reactions */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center gap-4 mb-3">
                  {silentReactions.map((reaction) => {
                    const Icon = reaction.icon
                    const count = letter.silentReactions?.[reaction.id] || 0
                    const isActive = letter.userReactions?.includes(reaction.id) || false
                    return (
                      <button
                        key={reaction.id}
                        onClick={() => handleSilentReaction(letter.id, reaction.id)}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                          isActive
                            ? `${reaction.color.replace('text-', 'bg-')}/10 ${reaction.color}`
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                        title={reaction.label}
                      >
                        <span className="text-lg">{reaction.emoji}</span>
                        {count > 0 && <span className="text-sm font-medium">{count}</span>}
                      </button>
                    )
                  })}
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleLike(letter.id)}
                      className={`flex items-center space-x-2 px-3 py-1 rounded-lg transition-colors ${
                        letter.isLiked
                          ? 'text-red-500 bg-red-50'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Heart size={18} fill={letter.isLiked ? 'currentColor' : 'none'} />
                      <span>{letter.likes}</span>
                    </button>
                    <button
                      onClick={() => handleShare(letter)}
                      className="flex items-center space-x-2 px-3 py-1 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      <Share2 size={18} />
                      <span>Share</span>
                    </button>
                  </div>
                  <button
                    onClick={() => handleSave(letter.id)}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      letter.isSaved
                        ? 'text-primary bg-primary/10'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Bookmark size={18} fill={letter.isSaved ? 'currentColor' : 'none'} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default PublicLetters
