import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="glass border-t border-white/20 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="text-sm text-gray-600">
            © 2024 FUTUROO. All rights reserved.
          </div>
          <nav className="flex items-center space-x-6">
            <Link to="/about" className="text-sm text-gray-600 hover:text-primary transition-colors">
              About
            </Link>
            <Link to="/privacy" className="text-sm text-gray-600 hover:text-primary transition-colors">
              Privacy
            </Link>
            <Link to="/contact" className="text-sm text-gray-600 hover:text-primary transition-colors">
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}

export default Footer
