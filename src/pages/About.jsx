import { Clock, Mail, Heart, Lock, Globe } from 'lucide-react'

const About = () => {
  return (
    <div className="min-h-[calc(100vh-200px)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-chrome-dark">About LaterMe</h1>
          <p className="text-xl text-chrome-gray-text">What You'll Be Tomorrow</p>
        </div>

        <div className="space-y-8">
          {/* Mission Section */}
          <div className="modern-card rounded-2xl p-8">
            <div className="flex items-start space-x-4 mb-6">
              <Heart className="text-chrome-red flex-shrink-0" size={32} />
              <div>
                <h2 className="text-3xl font-bold mb-4 text-chrome-dark">Our Mission</h2>
                <p className="text-chrome-gray-text leading-relaxed text-lg">
                  LaterMe is a platform that allows you to send messages through time—to your future self or to someone special. 
                  We believe in the power of reflection, growth, and connection. Write now, open later, and discover who you'll become.
                </p>
              </div>
            </div>
          </div>

          {/* What We Do Section */}
          <div className="modern-card rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-6 text-chrome-dark">What We Do</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-chrome-bg-light border border-chrome-border rounded-lg p-6">
                <Clock className="text-chrome-blue mb-4" size={32} />
                <h3 className="text-xl font-semibold mb-3 text-chrome-dark">Letters to Your Future Self</h3>
                <p className="text-chrome-gray-text leading-relaxed">
                  Write letters to yourself and schedule them for delivery on a specific date. 
                  Reflect on your goals, dreams, and thoughts, then read them when the time comes.
                </p>
              </div>
              <div className="bg-chrome-bg-light border border-chrome-border rounded-lg p-6">
                <Mail className="text-chrome-green mb-4" size={32} />
                <h3 className="text-xl font-semibold mb-3 text-chrome-dark">Letters to Someone Special</h3>
                <p className="text-chrome-gray-text leading-relaxed">
                  Send heartfelt messages to friends, family, or loved ones. 
                  Express your feelings now and have them delivered instantly or on a special date.
                </p>
              </div>
              <div className="bg-chrome-bg-light border border-chrome-border rounded-lg p-6">
                <Globe className="text-chrome-yellow mb-4" size={32} />
                <h3 className="text-xl font-semibold mb-3 text-chrome-dark">Public Letters</h3>
                <p className="text-chrome-gray-text leading-relaxed">
                  Share your thoughts with the world. Make your letters public and inspire others 
                  with your journey, wisdom, or stories.
                </p>
              </div>
              <div className="bg-chrome-bg-light border border-chrome-border rounded-lg p-6">
                <Lock className="text-chrome-red mb-4" size={32} />
                <h3 className="text-xl font-semibold mb-3 text-chrome-dark">Privacy First</h3>
                <p className="text-chrome-gray-text leading-relaxed">
                  Your letters are private by default. You control who sees your messages. 
                  We use encryption and secure practices to protect your data.
                </p>
              </div>
            </div>
          </div>

          {/* Why LaterMe Section */}
          <div className="modern-card rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-6 text-chrome-dark">Why LaterMe?</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-chrome-blue rounded-full flex items-center justify-center text-white font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-chrome-dark">Time Travel for Your Thoughts</h3>
                  <p className="text-chrome-gray-text leading-relaxed">
                    Capture your thoughts, dreams, and goals today, and revisit them in the future. 
                    See how you've grown and changed over time.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-chrome-green rounded-full flex items-center justify-center text-white font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-chrome-dark">Meaningful Connections</h3>
                  <p className="text-chrome-gray-text leading-relaxed">
                    Strengthen relationships by sending thoughtful messages to people you care about. 
                    Sometimes the best time to say something is later.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-chrome-yellow rounded-full flex items-center justify-center text-white font-bold">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-chrome-dark">Reflection and Growth</h3>
                  <p className="text-chrome-gray-text leading-relaxed">
                    Use LaterMe as a personal journal that delivers your past thoughts back to you. 
                    Learn from your experiences and celebrate your progress.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-chrome-red rounded-full flex items-center justify-center text-white font-bold">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-chrome-dark">Simple and Secure</h3>
                  <p className="text-chrome-gray-text leading-relaxed">
                    Easy to use, beautifully designed, and built with your privacy in mind. 
                    Your letters are encrypted and stored securely.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* How It Works Section */}
          <div className="modern-card rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-6 text-chrome-dark">How It Works</h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-chrome-blue rounded-full flex items-center justify-center text-white font-bold text-lg">
                    1
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-chrome-dark">Create Your Account</h3>
                  <p className="text-chrome-gray-text leading-relaxed">
                    Sign up for free and verify your email address to get started.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-chrome-green rounded-full flex items-center justify-center text-white font-bold text-lg">
                    2
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-chrome-dark">Write Your Letter</h3>
                  <p className="text-chrome-gray-text leading-relaxed">
                    Compose your message, choose whether it's private or public, and set a delivery date (or send it instantly).
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-chrome-yellow rounded-full flex items-center justify-center text-white font-bold text-lg">
                    3
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-chrome-dark">We Deliver It</h3>
                  <p className="text-chrome-gray-text leading-relaxed">
                    On the scheduled date, your letter will be delivered to you (or the recipient) via email, 
                    or you can open it on our platform.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-chrome-red rounded-full flex items-center justify-center text-white font-bold text-lg">
                    4
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-chrome-dark">Reflect and Grow</h3>
                  <p className="text-chrome-gray-text leading-relaxed">
                    Read your past thoughts, see how you've changed, and continue your journey of self-discovery.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="modern-card rounded-2xl p-8 bg-gradient-to-r from-chrome-blue/10 to-chrome-green/10">
            <h2 className="text-3xl font-bold mb-6 text-chrome-dark">Get in Touch</h2>
            <p className="text-chrome-gray-text leading-relaxed mb-6">
              Have questions, feedback, or suggestions? We'd love to hear from you!
            </p>
            <div className="bg-white border border-chrome-border rounded-lg p-6">
              <div className="flex items-center space-x-4">
                <Mail className="text-chrome-blue" size={24} />
                <div>
                  <p className="font-medium text-chrome-dark">Email Us</p>
                  <a href="mailto:lattermeee@gmail.com" className="text-chrome-blue hover:underline text-lg">
                    lattermeee@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
