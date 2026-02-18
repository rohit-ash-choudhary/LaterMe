// Payment Gateway Detection based on IP/Country

/**
 * Detect user's country based on IP address
 * Returns country code (e.g., 'IN' for India, 'US' for United States)
 */
export const detectUserCountry = async () => {
  try {
    // Using a free IP geolocation service
    const response = await fetch('https://ipapi.co/json/')
    const data = await response.json()
    return data.country_code || 'US' // Default to US if detection fails
  } catch (error) {
    console.error('Error detecting country:', error)
    // Fallback: Try another service
    try {
      const response = await fetch('https://api.country.is/')
      const data = await response.json()
      return data.country || 'US'
    } catch (fallbackError) {
      console.error('Fallback country detection failed:', fallbackError)
      return 'US' // Default to US
    }
  }
}

/**
 * Get payment gateway based on country
 * @param {string} countryCode - ISO country code (e.g., 'IN', 'US')
 * @returns {string} - Payment gateway name ('razorpay' or 'paypal')
 */
export const getPaymentGateway = (countryCode) => {
  // India uses Razorpay
  if (countryCode === 'IN') {
    return 'razorpay'
  }
  // All other countries use PayPal
  return 'paypal'
}

/**
 * Get payment gateway name for display
 * @param {string} gateway - Gateway code ('razorpay' or 'paypal')
 * @returns {string} - Display name
 */
export const getPaymentGatewayName = (gateway) => {
  const names = {
    razorpay: 'Razorpay',
    paypal: 'PayPal'
  }
  return names[gateway] || 'PayPal'
}

/**
 * Get payment gateway logo/icon info
 * @param {string} gateway - Gateway code
 * @returns {object} - Logo info
 */
export const getPaymentGatewayInfo = (gateway) => {
  const info = {
    razorpay: {
      name: 'Razorpay',
      description: 'Secure payments powered by Razorpay',
      logo: 'https://razorpay.com/assets/razorpay-logo.svg',
      color: '#3399CC'
    },
    paypal: {
      name: 'PayPal',
      description: 'Pay securely with PayPal',
      logo: 'https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg',
      color: '#0070BA'
    }
  }
  return info[gateway] || info.paypal
}
