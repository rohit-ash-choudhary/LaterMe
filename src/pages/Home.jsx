import { Link } from 'react-router-dom'
import { Mail, Globe, ArrowRight, Calendar, Send } from 'lucide-react'

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section - Chrome 2026 Style */}
      <div className="text-center mb-16 animate-fade-in">
        <div className="inline-block mb-6">
          <span className="px-4 py-2 bg-chrome-blue/10 text-chrome-blue rounded-full text-sm font-medium">
            ✨ Time-travel for your thoughts
          </span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-chrome-dark leading-tight tracking-tight">
          Time-delivered letters<br />to yourself.
        </h1>
        <p className="text-xl md:text-2xl text-chrome-gray max-w-2xl mx-auto mb-4 font-normal">
          Messages for Who You'll Be
        </p>
        <p className="text-lg text-chrome-gray/70 max-w-xl mx-auto">
          Imagine opening this one year from now.
        </p>
      </div>

      {/* Primary CTA - Chrome 2026 Style */}
      <div className="flex justify-center mb-16">
        <Link
          to="/write-later"
          className="group relative px-8 py-4 btn-modern text-white rounded-full font-medium text-lg flex items-center space-x-3 transition-all duration-200"
        >
          <Mail size={20} className="relative z-10" />
          <span className="relative z-10">Write a Letter to My Future</span>
          <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform duration-200 relative z-10" />
        </Link>
      </div>


      {/* Feature Cards - Chrome 2026 Style */}
      <div className="grid md:grid-cols-3 gap-6 mb-16">
        <Link
          to="/write-later"
          className="group modern-card p-6 relative"
        >
          <div className="relative z-10">
            <div className="w-12 h-12 bg-chrome-blue/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-chrome-blue/20 transition-colors">
              <Mail className="text-chrome-blue" size={24} />
            </div>
            <h3 className="text-xl font-medium mb-3 text-chrome-dark">Write Later</h3>
            <p className="text-chrome-gray mb-4 leading-relaxed text-sm">
              Write now.
              <br />
              Open it on the day that matters.
              <br />
              <span className="text-xs text-chrome-blue font-medium mt-2 inline-block">✨ Or choose an Open-When trigger</span>
            </p>
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
              <div className="flex items-center text-xs text-chrome-gray">
                <Calendar size={14} className="mr-2" />
                <span>Delivered on: 25 Feb 2027</span>
              </div>
              <ArrowRight size={16} className="text-chrome-blue group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          </div>
        </Link>

        <Link
          to="/public-letters"
          className="group modern-card p-6 relative"
        >
          <div className="relative z-10">
            <div className="w-12 h-12 bg-chrome-green/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-chrome-green/20 transition-colors">
              <Globe className="text-chrome-green" size={24} />
            </div>
            <h3 className="text-xl font-medium mb-3 text-chrome-dark">Public Letters</h3>
            <p className="text-chrome-gray mb-4 leading-relaxed text-sm">
              Read stories from people becoming something new.
            </p>
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
              <div className="text-xs text-chrome-gray">
                <span className="font-medium text-chrome-green text-sm">1,234</span> stories shared
              </div>
              <ArrowRight size={16} className="text-chrome-blue group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          </div>
        </Link>

        <Link
          to="/write-to-someone"
          className="group modern-card p-6 relative"
        >
          <div className="relative z-10">
            <div className="w-12 h-12 bg-chrome-yellow/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-chrome-yellow/20 transition-colors">
              <Send className="text-chrome-yellow" size={24} />
            </div>
            <h3 className="text-xl font-medium mb-3 text-chrome-dark">Write Letter to Someone Else</h3>
            <p className="text-chrome-gray mb-4 leading-relaxed text-sm">
              Send a message to someone special.
              <br />
              Share it—or keep it just yours.
            </p>
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
              <div className="text-xs text-chrome-gray">
                <span className="text-xs bg-chrome-green/10 text-chrome-green px-2 py-1 rounded-full">✓ Content moderated</span>
              </div>
              <ArrowRight size={16} className="text-chrome-blue group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          </div>
        </Link>
      </div>

      {/* Chrome 2026 Style Timeline Visual Element */}
      <div className="relative max-w-2xl mx-auto mt-12">
        <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-chrome-blue/20 via-chrome-blue/40 to-chrome-blue/20"></div>
        <div className="relative flex justify-around items-center py-6">
          <div className="text-center">
            <div className="w-3 h-3 rounded-full bg-chrome-blue mx-auto mb-2"></div>
            <p className="text-xs text-chrome-gray">Today</p>
          </div>
          <div className="text-center">
            <div className="w-3 h-3 rounded-full bg-chrome-blue/50 mx-auto mb-2"></div>
            <p className="text-xs text-chrome-gray">Scheduled</p>
          </div>
          <div className="text-center">
            <div className="w-3 h-3 rounded-full bg-chrome-blue mx-auto mb-2"></div>
            <p className="text-xs text-chrome-gray">Delivered</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
