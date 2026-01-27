import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Crown, Calendar, Infinity } from 'lucide-react'
import { PRICING, setUserSubscription } from '../utils/subscription'

const Pricing = ({ user, onSubscriptionUpdate }) => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleSubscribe = async (plan) => {
    if (!user) {
      alert('Please login to subscribe')
      navigate('/login')
      return
    }

    setLoading(true)

    // Simulate payment processing
    setTimeout(() => {
      // In a real app, this would process payment via Stripe/PayPal/etc
      setUserSubscription(user.id, plan)
      
      // Update user subscription status
      if (onSubscriptionUpdate) {
        onSubscriptionUpdate()
      }
      
      setLoading(false)
      const planNames = {
        monthly: 'Monthly',
        yearly: 'Yearly',
        lifetime: 'Lifetime'
      }
      alert(`Successfully subscribed to ${planNames[plan] || plan} plan!`)
      navigate('/write-later')
    }, 1500)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-xl text-gray-600">
          Unlock unlimited letters and premium features
        </p>
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
            onClick={() => handleSubscribe('monthly')}
            disabled={loading}
            className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-purple-600 transition-colors font-medium disabled:opacity-50 text-sm"
          >
            {loading ? 'Processing...' : 'Subscribe Monthly'}
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
            onClick={() => handleSubscribe('yearly')}
            disabled={loading}
            className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-purple-600 transition-colors font-medium disabled:opacity-50 text-sm"
          >
            {loading ? 'Processing...' : 'Subscribe Yearly'}
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
            onClick={() => handleSubscribe('lifetime')}
            disabled={loading}
            className="w-full px-4 py-2 bg-white text-primary rounded-lg hover:bg-gray-100 transition-colors font-medium disabled:opacity-50 text-sm"
          >
            {loading ? 'Processing...' : 'Get Lifetime Access'}
          </button>
        </div>
      </div>

      <div className="mt-12 text-center">
        <p className="text-gray-600 mb-4">
          Free plan includes 10 letters. Upgrade for unlimited access.
        </p>
        <button
          onClick={() => navigate('/')}
          className="text-primary hover:underline"
        >
          Back to Home
        </button>
      </div>
    </div>
  )
}

export default Pricing
