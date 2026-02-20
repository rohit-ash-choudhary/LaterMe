import { Mail } from 'lucide-react'

const Privacy = () => {
  return (
    <div className="min-h-[calc(100vh-200px)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="modern-card rounded-2xl p-8">
          <h1 className="text-4xl font-bold mb-4 text-chrome-dark">Privacy Policy</h1>
          <p className="text-chrome-gray-text mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-chrome-dark">1. Introduction</h2>
              <p className="text-chrome-gray-text leading-relaxed">
                Welcome to LaterMe. We are committed to protecting your privacy and ensuring the security of your personal information. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-chrome-dark">2. Information We Collect</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium mb-2 text-chrome-dark">2.1 Personal Information</h3>
                  <p className="text-chrome-gray-text leading-relaxed">
                    We collect information that you provide directly to us, including:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-2 text-chrome-gray-text ml-4">
                    <li>Name and email address</li>
                    <li>Account credentials (password, securely hashed)</li>
                    <li>Letters and messages you create and send</li>
                    <li>Delivery preferences and scheduling information</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2 text-chrome-dark">2.2 Usage Information</h3>
                  <p className="text-chrome-gray-text leading-relaxed">
                    We automatically collect certain information about your use of the service, such as:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-2 text-chrome-gray-text ml-4">
                    <li>Device information and browser type</li>
                    <li>IP address and location data</li>
                    <li>Usage patterns and feature interactions</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-chrome-dark">3. How We Use Your Information</h2>
              <p className="text-chrome-gray-text leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-chrome-gray-text ml-4">
                <li>Provide, maintain, and improve our services</li>
                <li>Process and deliver your letters according to your preferences</li>
                <li>Send you important service-related communications</li>
                <li>Authenticate your account and ensure security</li>
                <li>Respond to your inquiries and provide customer support</li>
                <li>Detect and prevent fraud or abuse</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-chrome-dark">4. Data Storage and Security</h2>
              <div className="space-y-4">
                <p className="text-chrome-gray-text leading-relaxed">
                  We implement appropriate technical and organizational measures to protect your personal information:
                </p>
                <ul className="list-disc list-inside space-y-2 text-chrome-gray-text ml-4">
                  <li>All data is encrypted in transit using SSL/TLS</li>
                  <li>Passwords are hashed using secure algorithms</li>
                  <li>Access to personal data is restricted to authorized personnel only</li>
                  <li>Regular security audits and updates</li>
                </ul>
                <p className="text-chrome-gray-text leading-relaxed mt-4">
                  However, no method of transmission over the internet or electronic storage is 100% secure. 
                  While we strive to use commercially acceptable means to protect your information, we cannot guarantee absolute security.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-chrome-dark">5. Letter Privacy</h2>
              <div className="space-y-4">
                <p className="text-chrome-gray-text leading-relaxed">
                  Your letters are private by default. We respect your privacy choices:
                </p>
                <ul className="list-disc list-inside space-y-2 text-chrome-gray-text ml-4">
                  <li><strong>Private Letters:</strong> Only you can access your private letters. They are never shared or made public.</li>
                  <li><strong>Public Letters:</strong> Letters you choose to make public will be visible to all users. You control this setting.</li>
                  <li><strong>Letters to Someone Else:</strong> These are sent directly to the recipient's email address. We do not store the recipient's email after delivery.</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-chrome-dark">6. Data Retention</h2>
              <p className="text-chrome-gray-text leading-relaxed">
                We retain your personal information for as long as your account is active or as needed to provide you services. 
                You may delete your account at any time, which will permanently delete all associated data, including your letters.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-chrome-dark">7. Your Rights</h2>
              <p className="text-chrome-gray-text leading-relaxed mb-4">
                You have the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-chrome-gray-text ml-4">
                <li>Access your personal information</li>
                <li>Correct inaccurate or incomplete information</li>
                <li>Delete your account and all associated data</li>
                <li>Export your letters and data</li>
                <li>Opt-out of non-essential communications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-chrome-dark">8. Third-Party Services</h2>
              <p className="text-chrome-gray-text leading-relaxed">
                We use third-party services for email delivery (Gmail API) and hosting. These services have their own privacy policies 
                governing the use of your information. We do not sell or share your personal information with third parties for marketing purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-chrome-dark">9. Children's Privacy</h2>
              <p className="text-chrome-gray-text leading-relaxed">
                Our service is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. 
                If you believe we have collected information from a child under 13, please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-chrome-dark">10. Changes to This Policy</h2>
              <p className="text-chrome-gray-text leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page 
                and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-chrome-dark">11. Contact Us</h2>
              <p className="text-chrome-gray-text leading-relaxed mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-chrome-bg-light border border-chrome-border rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <Mail className="text-chrome-blue" size={20} />
                  <div>
                    <p className="font-medium text-chrome-dark">Email</p>
                    <a href="mailto:lattermeee@gmail.com" className="text-chrome-blue hover:underline">
                      lattermeee@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Privacy
