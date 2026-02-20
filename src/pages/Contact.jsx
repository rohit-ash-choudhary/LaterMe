import { Mail, MessageCircle, HelpCircle, Bug, Heart } from 'lucide-react'

const Contact = () => {
  return (
    <div className="min-h-[calc(100vh-200px)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-chrome-dark">Contact Us</h1>
          <p className="text-xl text-chrome-gray-text">We're here to help! Reach out to us for any questions or issues.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Email Card */}
          <div className="modern-card rounded-2xl p-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-chrome-blue/10 rounded-full flex items-center justify-center">
                <Mail className="text-chrome-blue" size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-chrome-dark">Email Us</h2>
                <p className="text-chrome-gray-text">For any issues or inquiries</p>
              </div>
            </div>
            <div className="bg-chrome-bg-light border border-chrome-border rounded-lg p-6">
              <p className="text-sm text-chrome-gray-text mb-2">Email Address</p>
              <a 
                href="mailto:lattermeee@gmail.com" 
                className="text-xl font-semibold text-chrome-blue hover:underline break-all"
              >
                lattermeee@gmail.com
              </a>
            </div>
            <p className="text-chrome-gray-text mt-4 text-sm">
              We typically respond within 24-48 hours. For urgent issues, please include "URGENT" in your subject line.
            </p>
          </div>

          {/* Support Types Card */}
          <div className="modern-card rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6 text-chrome-dark">How Can We Help?</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <HelpCircle className="text-chrome-blue flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-medium text-chrome-dark">General Questions</p>
                  <p className="text-sm text-chrome-gray-text">About features, how to use LaterMe, or account help</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Bug className="text-chrome-red flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-medium text-chrome-dark">Report a Bug</p>
                  <p className="text-sm text-chrome-gray-text">Found an issue? Let us know and we'll fix it</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MessageCircle className="text-chrome-green flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-medium text-chrome-dark">Feedback & Suggestions</p>
                  <p className="text-sm text-chrome-gray-text">Share your ideas to help us improve</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Heart className="text-chrome-red flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-medium text-chrome-dark">Privacy Concerns</p>
                  <p className="text-sm text-chrome-gray-text">Questions about data security or privacy</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="modern-card rounded-2xl p-8">
          <h2 className="text-3xl font-bold mb-6 text-chrome-dark">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2 text-chrome-dark">How do I reset my password?</h3>
              <p className="text-chrome-gray-text leading-relaxed">
                If you've forgotten your password, please email us at <a href="mailto:lattermeee@gmail.com" className="text-chrome-blue hover:underline">lattermeee@gmail.com</a> with your registered email address, and we'll help you reset it.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 text-chrome-dark">Can I delete my account?</h3>
              <p className="text-chrome-gray-text leading-relaxed">
                Yes! You can delete your account from the "Manage Account" page. This will permanently delete all your letters and data. If you need help, contact us.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 text-chrome-dark">Are my letters private?</h3>
              <p className="text-chrome-gray-text leading-relaxed">
                Yes, by default all letters are private. Only letters you explicitly choose to make public will be visible to others. You have full control over your privacy settings.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 text-chrome-dark">What if I don't receive my scheduled letter?</h3>
              <p className="text-chrome-gray-text leading-relaxed">
                If you don't receive a scheduled letter, please check your spam folder first. If it's still not there, contact us at <a href="mailto:lattermeee@gmail.com" className="text-chrome-blue hover:underline">lattermeee@gmail.com</a> and we'll investigate.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form Info */}
        <div className="modern-card rounded-2xl p-8 bg-gradient-to-r from-chrome-blue/10 to-chrome-green/10">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4 text-chrome-dark">Ready to Reach Out?</h2>
            <p className="text-chrome-gray-text mb-6">
              Send us an email at <a href="mailto:lattermeee@gmail.com" className="text-chrome-blue hover:underline font-semibold">lattermeee@gmail.com</a> and we'll get back to you as soon as possible.
            </p>
            <a 
              href="mailto:lattermeee@gmail.com?subject=LaterMe Support Request"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-chrome-blue text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              <Mail size={20} />
              <span>Send Us an Email</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
