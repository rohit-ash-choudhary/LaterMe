import { Link } from 'react-router-dom'
import { Mail, Globe, ArrowRight, Calendar, Send } from 'lucide-react'

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-20 animate-fade-in">
        <div className="inline-block mb-6">
          <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium backdrop-blur-sm">
            ✨ Time-travel for your thoughts
          </span>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight tracking-tight">
          Time-delivered letters<br />to yourself.
        </h1>
        <p className="text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto mb-4 font-medium">
          Messages for Who You'll Be
        </p>
        <p className="text-lg text-gray-500 max-w-xl mx-auto italic">
          Imagine opening this one year from now.
        </p>
      </div>

      {/* Primary CTA - The Star */}
      <div className="flex justify-center mb-20">
        <Link
          to="/write-later"
          className="group relative px-12 py-6 btn-modern text-white rounded-2xl font-semibold text-xl flex items-center space-x-3 overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-300"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <Mail size={28} className="animate-envelope relative z-10" />
          <span className="relative z-10">Write a Letter to My Future</span>
          <ArrowRight size={22} className="ml-2 group-hover:translate-x-2 transition-transform duration-300 relative z-10" />
        </Link>
      </div>


      {/* Feature Cards - Experiential */}
      <div className="grid md:grid-cols-3 gap-6 mb-16">
        <Link
          to="/write-later"
          className="group modern-card p-8 rounded-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors"></div>
          <div className="relative z-10">
            <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
              <Mail className="text-primary" size={28} />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-800">Write Later</h3>
            <p className="text-gray-600 mb-5 leading-relaxed text-base">
              Write now.
              <br />
              Open it on the day that matters.
              <br />
              <span className="text-sm text-primary font-semibold mt-2 inline-block">✨ Or choose an Open-When trigger</span>
            </p>
            <div className="flex items-center justify-between mt-6 pt-5 border-t border-gray-100">
              <div className="flex items-center text-sm text-gray-500">
                <Calendar size={16} className="mr-2" />
                <span>Delivered on: 25 Feb 2027</span>
              </div>
              <ArrowRight size={20} className="text-primary group-hover:translate-x-2 transition-transform duration-300" />
            </div>
          </div>
        </Link>

        <Link
          to="/public-letters"
          className="group modern-card p-8 rounded-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors"></div>
          <div className="relative z-10">
            <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
              <Globe className="text-primary" size={28} />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-800">Public Letters</h3>
            <p className="text-gray-600 mb-5 leading-relaxed text-base">
              Read stories from people becoming something new.
            </p>
            <div className="flex items-center justify-between mt-6 pt-5 border-t border-gray-100">
              <div className="text-sm text-gray-500">
                <span className="font-bold text-primary text-base">1,234</span> stories shared
              </div>
              <ArrowRight size={20} className="text-primary group-hover:translate-x-2 transition-transform duration-300" />
            </div>
          </div>
        </Link>

        <Link
          to="/write-to-someone"
          className="group modern-card p-8 rounded-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full -mr-16 -mt-16 group-hover:bg-secondary/10 transition-colors"></div>
          <div className="relative z-10">
            <div className="w-14 h-14 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
              <Send className="text-secondary" size={28} />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-800">Write Letter to Someone Else</h3>
            <p className="text-gray-600 mb-5 leading-relaxed text-base">
              Send a message to someone special.
              <br />
              Share it—or keep it just yours.
            </p>
            <div className="flex items-center justify-between mt-6 pt-5 border-t border-gray-100">
              <div className="text-sm text-gray-500">
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">✓ Content moderated</span>
              </div>
              <ArrowRight size={20} className="text-primary group-hover:translate-x-2 transition-transform duration-300" />
            </div>
          </div>
        </Link>
      </div>

      {/* Subtle Timeline Visual Element */}
      <div className="relative max-w-2xl mx-auto mt-16">
        <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-primary/20 via-primary/40 to-primary/20"></div>
        <div className="relative flex justify-around items-center py-8">
          <div className="text-center">
            <div className="w-3 h-3 rounded-full bg-primary mx-auto mb-2"></div>
            <p className="text-xs text-gray-500">Today</p>
          </div>
          <div className="text-center">
            <div className="w-3 h-3 rounded-full bg-primary/50 mx-auto mb-2"></div>
            <p className="text-xs text-gray-500">Scheduled</p>
          </div>
          <div className="text-center">
            <div className="w-3 h-3 rounded-full bg-primary mx-auto mb-2"></div>
            <p className="text-xs text-gray-500">Delivered</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
