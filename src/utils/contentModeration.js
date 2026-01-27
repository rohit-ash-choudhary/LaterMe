// Content moderation utility

// List of inappropriate/harmful words and phrases
const harmfulWords = [
  // Threats
  'kill', 'murder', 'die', 'death threat', 'harm you', 'hurt you', 'attack',
  // Violence
  'violence', 'assault', 'bomb', 'weapon', 'gun', 'knife',
  // Hate speech
  'hate', 'racist', 'discrimination', 'slur',
  // Harassment
  'harass', 'stalk', 'bully', 'intimidate',
  // Explicit content indicators
  'explicit', 'nsfw',
]

// List of inappropriate phrases
const harmfulPhrases = [
  'i will kill',
  'i will hurt',
  'i will harm',
  'threaten to',
  'going to die',
  'should die',
  'deserves to die',
]

// Check if content contains harmful words
export const containsHarmfulWords = (text) => {
  const lowerText = text.toLowerCase()
  
  // Check for harmful words
  for (const word of harmfulWords) {
    if (lowerText.includes(word)) {
      return {
        isHarmful: true,
        reason: `Content contains inappropriate language: "${word}"`,
        severity: 'high'
      }
    }
  }
  
  // Check for harmful phrases
  for (const phrase of harmfulPhrases) {
    if (lowerText.includes(phrase)) {
      return {
        isHarmful: true,
        reason: `Content contains threatening language: "${phrase}"`,
        severity: 'high'
      }
    }
  }
  
  return { isHarmful: false }
}

// Check if content is too short or lacks substance
export const isContentDecent = (text) => {
  if (!text || text.trim().length < 10) {
    return {
      isValid: false,
      reason: 'Message is too short. Please write at least 10 characters.'
    }
  }
  
  // Check if it's just repeated characters or spam
  const trimmedText = text.trim()
  const uniqueChars = new Set(trimmedText.toLowerCase().replace(/\s/g, ''))
  if (uniqueChars.size < 3 && trimmedText.length > 20) {
    return {
      isValid: false,
      reason: 'Message appears to be spam or lacks meaningful content.'
    }
  }
  
  return { isValid: true }
}

// Main moderation check
export const moderateContent = (text) => {
  // First check for harmful content
  const harmfulCheck = containsHarmfulWords(text)
  if (harmfulCheck.isHarmful) {
    return {
      isSafe: false,
      ...harmfulCheck
    }
  }
  
  // Then check if content is decent
  const decentCheck = isContentDecent(text)
  if (!decentCheck.isValid) {
    return {
      isSafe: false,
      ...decentCheck,
      severity: 'medium'
    }
  }
  
  return { isSafe: true }
}
