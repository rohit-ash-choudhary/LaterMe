import { useState, useEffect } from 'react'
import { Check, Crown, Calendar, Infinity, Clock, CreditCard } from 'lucide-react'
import { PRICING } from '../utils/subscription'
import { detectUserCountry, getPaymentGateway, getPaymentGatewayInfo } from '../utils/paymentGateway'

const Pricing = ({ user, onSubscriptionUpdate }) => {
  const [paymentGateway, setPaymentGateway] = useState(null)
  const [countryCode, setCountryCode] = useState(null)
  const [detecting, setDetecting] = useState(true)

  useEffect(() => {
    // Detect user's country and set payment gateway
    const detectGateway = async () => {
      try {
        const country = await detectUserCountry()
        setCountryCode(country)
        const gateway = getPaymentGateway(country)
        setPaymentGateway(gateway)
      } catch (error) {
        console.error('Error detecting payment gateway:', error)
        // Default to PayPal if detection fails
        setPaymentGateway('paypal')
      } finally {
        setDetecting(false)
      }
    }
    
    detectGateway()
  }, [])

  const gatewayInfo = paymentGateway ? getPaymentGatewayInfo(paymentGateway) : null

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-xl text-gray-600 mb-6">
          Unlock unlimited letters and premium features
        </p>
        
        {/* Coming Soon Banner */}
        <div className="max-w-2xl mx-auto mb-8 modern-card rounded-2xl p-6 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border-2 border-primary/20">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Clock className="text-primary" size={32} />
            <h2 className="text-2xl font-bold text-gray-800">Payment System Coming Soon!</h2>
          </div>
          <p className="text-gray-700 mb-4">
            We're working hard to bring you secure payment options. Premium subscriptions will be available soon.
          </p>
          {detecting ? (
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <span className="text-sm">Detecting your location...</span>
            </div>
          ) : gatewayInfo && (
            <div className="flex items-center justify-center space-x-3 bg-white/50 rounded-lg p-3">
              <CreditCard className="text-primary" size={20} />
              <span className="text-sm text-gray-700">
                <strong>Payment Gateway:</strong> <span className="text-primary font-semibold">{gatewayInfo.name}</span>
                {countryCode === 'IN' && ' (India)'}
                {countryCode !== 'IN' && countryCode && ` (${countryCode})`}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {/* Monthly Plan */}
        <div className="modern-card rounded-2xl border-2 border-gray-200/50 p-6 relative">
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <Crown className="text-yellow-500" size={20} />
              <h3 className="text-xl font-bold">Monthly</h3>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold">${PRICING.monthly.price}</span>
              <span className="text-gray-600">/month</span>
            </div>
            <p className="text-gray-500 mt-2 text-sm">Billed monthly</p>
          </div>

          <ul className="space-y-2 mb-6 text-sm">
            <li className="flex items-start space-x-2">
              <Check className="text-primary mt-1 flex-shrink-0" size={16} />
              <span>Unlimited letters</span>
            </li>
            <li className="flex items-start space-x-2">
              <Check className="text-primary mt-1 flex-shrink-0" size={16} />
              <span>All premium features</span>
            </li>
            <li className="flex items-start space-x-2">
              <Check className="text-primary mt-1 flex-shrink-0" size={16} />
              <span>Cancel anytime</span>
            </li>
          </ul>

          <button
            disabled
            className="w-full px-4 py-2 bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed font-medium text-sm flex items-center justify-center space-x-2"
          >
            <Clock size={16} />
            <span>Coming Soon</span>
          </button>
        </div>

        {/* Yearly Plan */}
        <div className="modern-card rounded-2xl border-2 border-primary/50 p-6 relative bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="absolute top-4 right-4">
            <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
              Popular
            </span>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="text-primary" size={20} />
              <h3 className="text-xl font-bold">Yearly</h3>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold">${PRICING.yearly.price}</span>
              <span className="text-gray-600">/year</span>
            </div>
            <p className="text-gray-500 mt-2 text-sm">
              ${(PRICING.yearly.price / 12).toFixed(2)}/month
            </p>
            <p className="text-primary text-xs font-medium mt-1">
              Save ${(PRICING.monthly.price * 12 - PRICING.yearly.price).toFixed(0)} per year!
            </p>
          </div>

          <ul className="space-y-2 mb-6 text-sm">
            <li className="flex items-start space-x-2">
              <Check className="text-primary mt-1 flex-shrink-0" size={16} />
              <span>Unlimited letters</span>
            </li>
            <li className="flex items-start space-x-2">
              <Check className="text-primary mt-1 flex-shrink-0" size={16} />
              <span>All premium features</span>
            </li>
            <li className="flex items-start space-x-2">
              <Check className="text-primary mt-1 flex-shrink-0" size={16} />
              <span>Best value</span>
            </li>
          </ul>

          <button
            disabled
            className="w-full px-4 py-2 bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed font-medium text-sm flex items-center justify-center space-x-2"
          >
            <Clock size={16} />
            <span>Coming Soon</span>
          </button>
        </div>

        {/* Lifetime Plan */}
        <div className="gradient-primary rounded-2xl shadow-2xl p-6 text-white relative border border-white/20">
          <div className="absolute top-4 right-4">
            <span className="bg-white/20 text-white px-2 py-1 rounded-full text-xs font-medium">
              Best Value
            </span>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <Infinity className="text-white" size={20} />
              <h3 className="text-xl font-bold">Lifetime</h3>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold">${PRICING.lifetime.price}</span>
              <span className="text-white/80 text-sm">one-time</span>
            </div>
            <p className="text-white/80 mt-2 text-sm">Pay once, use forever</p>
          </div>

          <ul className="space-y-2 mb-6 text-sm">
            <li className="flex items-start space-x-2">
              <Check className="text-white mt-1 flex-shrink-0" size={16} />
              <span>Unlimited letters forever</span>
            </li>
            <li className="flex items-start space-x-2">
              <Check className="text-white mt-1 flex-shrink-0" size={16} />
              <span>All premium features</span>
            </li>
            <li className="flex items-start space-x-2">
              <Check className="text-white mt-1 flex-shrink-0" size={16} />
              <span>No recurring charges</span>
            </li>
          </ul>

          <button
            disabled
            className="w-full px-4 py-2 bg-white/50 text-gray-600 rounded-lg cursor-not-allowed font-medium text-sm flex items-center justify-center space-x-2"
          >
            <Clock size={16} />
            <span>Coming Soon</span>
          </button>
        </div>
      </div>

      <div className="mt-12 text-center">
        <p className="text-gray-600 mb-4">
          Free plan includes 10 letters. Premium subscriptions coming soon!
        </p>
        {gatewayInfo && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg inline-block">
            <p className="text-sm text-gray-600">
              <strong>Payment Method:</strong> {gatewayInfo.name} will be available for your region
            </p>
            <p className="text-xs text-gray-500 mt-1">{gatewayInfo.description}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Pricing
