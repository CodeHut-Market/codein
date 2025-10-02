import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | CodeIn',
  description: 'Privacy Policy and data protection practices for CodeIn platform',
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            Privacy Policy
          </h1>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Our Commitment to Privacy
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                At CodeIn, we take your privacy seriously. This Privacy Policy explains how we collect, use, 
                disclose, and safeguard your information when you use our platform. We are committed to 
                protecting your personal information and your right to privacy.
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-blue-900 dark:text-blue-200 font-semibold">
                  We will never sell your personal information to third parties.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Information We Collect
              </h2>
              
              <div className="space-y-6">
                <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-green-900 dark:text-green-200 mb-3">
                    📋 Personal Information You Provide
                  </h3>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                    <li>Account registration information (name, email, username)</li>
                    <li>Profile information and bio</li>
                    <li>Code snippets and content you upload</li>
                    <li>Comments and community interactions</li>
                    <li>Support and communication correspondence</li>
                  </ul>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-3">
                    🔍 Information Automatically Collected
                  </h3>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                    <li>Device information (browser type, operating system)</li>
                    <li>Usage data (pages visited, time spent, features used)</li>
                    <li>IP address and general location information</li>
                    <li>Cookies and similar tracking technologies</li>
                    <li>Performance and error logs</li>
                  </ul>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-orange-900 dark:text-orange-200 mb-3">
                    🔗 Information from Third Parties
                  </h3>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                    <li>OAuth provider information (GitHub, Google, etc.)</li>
                    <li>Social media profile data (when you connect accounts)</li>
                    <li>Analytics and advertising partners (anonymized data)</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                How We Use Your Information
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We use the information we collect for the following purposes:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">🚀 Platform Operation</h3>
                  <ul className="text-gray-700 dark:text-gray-300 text-sm space-y-1">
                    <li>• Provide and maintain our services</li>
                    <li>• Process user registration and authentication</li>
                    <li>• Enable code sharing and collaboration</li>
                    <li>• Facilitate community interactions</li>
                  </ul>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">📊 Improvement & Analytics</h3>
                  <ul className="text-gray-700 dark:text-gray-300 text-sm space-y-1">
                    <li>• Analyze usage patterns and preferences</li>
                    <li>• Improve platform performance and features</li>
                    <li>• Personalize user experience</li>
                    <li>• Conduct research and development</li>
                  </ul>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">📧 Communication</h3>
                  <ul className="text-gray-700 dark:text-gray-300 text-sm space-y-1">
                    <li>• Send important service updates</li>
                    <li>• Respond to support requests</li>
                    <li>• Notify about platform changes</li>
                    <li>• Send marketing communications (with consent)</li>
                  </ul>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">🛡️ Security & Compliance</h3>
                  <ul className="text-gray-700 dark:text-gray-300 text-sm space-y-1">
                    <li>• Detect and prevent fraud</li>
                    <li>• Ensure platform security</li>
                    <li>• Comply with legal obligations</li>
                    <li>• Enforce terms of service</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Information Sharing and Disclosure
              </h2>
              <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg mb-6 border-l-4 border-red-500">
                <h3 className="text-lg font-semibold text-red-900 dark:text-red-200 mb-2">
                  🚫 We DO NOT Sell Your Data
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  CodeIn does not sell, rent, or trade your personal information to third parties for their commercial purposes.
                </p>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We may share your information in the following limited circumstances:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-2">
                <li><strong>With your consent:</strong> When you explicitly agree to share information</li>
                <li><strong>Service providers:</strong> Third-party vendors who help us operate the platform (hosting, analytics, support)</li>
                <li><strong>Legal requirements:</strong> When required by law, court order, or government request</li>
                <li><strong>Safety purposes:</strong> To protect the rights, property, or safety of CodeIn, users, or others</li>
                <li><strong>Business transfers:</strong> In connection with a merger, acquisition, or sale of assets (with notice)</li>
                <li><strong>Public content:</strong> Code snippets and content you choose to make public</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Data Security
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We implement appropriate technical and organizational security measures to protect your personal information:
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="border border-blue-200 dark:border-blue-600 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">🔐 Encryption</h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">Data encrypted in transit (TLS 1.3) and at rest (AES-256)</p>
                </div>
                <div className="border border-green-200 dark:border-green-600 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-900 dark:text-green-200 mb-2">🔒 Access Control</h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">Multi-factor authentication and role-based access</p>
                </div>
                <div className="border border-purple-200 dark:border-purple-600 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-900 dark:text-purple-200 mb-2">📊 Monitoring</h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">24/7 security monitoring and incident response</p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Your Privacy Rights
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Depending on your location, you may have the following rights regarding your personal information:
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <span className="text-blue-600 dark:text-blue-400 text-xl">👁️</span>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">Right to Access</h3>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">Request a copy of the personal information we hold about you</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <span className="text-green-600 dark:text-green-400 text-xl">✏️</span>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">Right to Correction</h3>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">Request correction of inaccurate or incomplete information</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <span className="text-red-600 dark:text-red-400 text-xl">🗑️</span>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">Right to Deletion</h3>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">Request deletion of your personal information (subject to legal requirements)</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <span className="text-purple-600 dark:text-purple-400 text-xl">📤</span>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">Right to Portability</h3>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">Export your data in a structured, machine-readable format</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <span className="text-orange-600 dark:text-orange-400 text-xl">🛑</span>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">Right to Object</h3>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">Object to processing of your personal information for marketing purposes</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Data Retention
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
                <li>Account information: Until account deletion or 3 years of inactivity</li>
                <li>Content and code snippets: Until user deletion or account closure</li>
                <li>Usage analytics: Anonymized after 2 years</li>
                <li>Communication records: 7 years for legal compliance</li>
                <li>Security logs: 1 year unless required for ongoing investigations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                International Data Transfers
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Your information may be transferred to and processed in countries other than your own. We ensure adequate 
                protection through:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
                <li>Standard Contractual Clauses (SCCs) with service providers</li>
                <li>Adequacy decisions by relevant authorities</li>
                <li>Other appropriate safeguards as required by law</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Children's Privacy
              </h2>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg">
                <p className="text-yellow-800 dark:text-yellow-200 font-semibold mb-2">
                  ⚠️ Age Restriction
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  CodeIn is not intended for children under 13 years of age. We do not knowingly collect personal 
                  information from children under 13. If you are a parent or guardian and believe your child has 
                  provided us with personal information, please contact us immediately.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Changes to This Privacy Policy
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any changes by:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
                <li>Posting the new Privacy Policy on this page</li>
                <li>Updating the "Last updated" date</li>
                <li>Sending email notifications for material changes</li>
                <li>Displaying prominent notices on our platform</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Contact Us
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                If you have any questions about this Privacy Policy or our privacy practices, please contact us:
              </p>

              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Privacy Team</h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-1">Email: privacy@codein.com</p>
                    <p className="text-gray-700 dark:text-gray-300 mb-1">Response Time: Within 48 hours</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Data Protection Officer</h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-1">Email: dpo@codein.com</p>
                    <p className="text-gray-700 dark:text-gray-300 mb-1">For GDPR-related inquiries</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-blue-900 dark:text-blue-200 text-sm">
                  <strong>Need immediate assistance?</strong> For urgent privacy concerns or security issues, 
                  contact us at security@codein.com
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}