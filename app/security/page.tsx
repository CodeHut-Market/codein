import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Security Policy | CodeIn',
  description: 'Security practices, data protection measures, and vulnerability disclosure for CodeIn platform',
}

export default function SecurityPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            Security Policy
          </h1>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Our Commitment to Security
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                CodeIn takes security seriously and is committed to protecting our users&apos; data and privacy. 
                We implement industry-standard security measures and continuously monitor and improve our security posture.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Security Measures
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-2">
                    🔐 Authentication & Authorization
                  </h3>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                    <li>Multi-factor authentication (MFA)</li>
                    <li>OAuth 2.0 integration</li>
                    <li>Secure session management</li>
                    <li>Role-based access controls</li>
                  </ul>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-900 dark:text-green-200 mb-2">
                    🛡️ Data Protection
                  </h3>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                    <li>Encryption in transit (TLS 1.3)</li>
                    <li>Encryption at rest (AES-256)</li>
                    <li>Regular data backups</li>
                    <li>Data anonymization</li>
                  </ul>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-200 mb-2">
                    🔍 Monitoring & Detection
                  </h3>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                    <li>24/7 security monitoring</li>
                    <li>Automated threat detection</li>
                    <li>Intrusion detection systems</li>
                    <li>Security audit logging</li>
                  </ul>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-200 mb-2">
                    🏗️ Infrastructure Security
                  </h3>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                    <li>Secure cloud infrastructure</li>
                    <li>Network segmentation</li>
                    <li>Regular security updates</li>
                    <li>Firewall protection</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Vulnerability Disclosure Program
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We welcome security researchers and the community to help us maintain the highest level of security. 
                If you discover a security vulnerability, please follow our responsible disclosure process.
              </p>

              <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg mb-6">
                <h3 className="text-lg font-semibold text-red-900 dark:text-red-200 mb-4">
                  🚨 How to Report a Security Vulnerability
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                    <p className="text-gray-700 dark:text-gray-300">
                      <strong>Email us directly:</strong> security@codein.com (PGP key available)
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                    <p className="text-gray-700 dark:text-gray-300">
                      <strong>Include details:</strong> Steps to reproduce, impact assessment, and proof of concept
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                    <p className="text-gray-700 dark:text-gray-300">
                      <strong>Allow time:</strong> We&apos;ll respond within 24 hours and provide updates every 48 hours
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                <p className="text-yellow-800 dark:text-yellow-200">
                  <strong>Please do not:</strong> Publicly disclose the vulnerability before we&apos;ve had a chance to address it, 
                  access user data, or perform destructive actions.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Security Response Timeline
              </h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">24h</span>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">Initial Response</h3>
                    <p className="text-gray-600 dark:text-gray-400">Acknowledgment and initial assessment</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">7d</span>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">Investigation & Fix</h3>
                    <p className="text-gray-600 dark:text-gray-400">Detailed analysis and resolution development</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">30d</span>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">Public Disclosure</h3>
                    <p className="text-gray-600 dark:text-gray-400">Coordinated disclosure after fix deployment</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Security Best Practices for Users
              </h2>
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-green-900 dark:text-green-200 mb-4">
                  Protect Your Account
                </h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                  <li>Use a strong, unique password for your CodeIn account</li>
                  <li>Enable two-factor authentication (2FA) when available</li>
                  <li>Regularly review your account activity and settings</li>
                  <li>Log out from shared or public computers</li>
                  <li>Keep your browser and extensions up to date</li>
                  <li>Be cautious about code snippets from untrusted sources</li>
                  <li>Report suspicious activity immediately</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Compliance & Certifications
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">GDPR</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">General Data Protection Regulation compliant</p>
                </div>
                <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">SOC 2</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Type II certification in progress</p>
                </div>
                <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">ISO 27001</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Information security management</p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Security Contact Information
              </h2>
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">Security Team</h3>
                    <p className="text-gray-700 dark:text-gray-300">security@codein.com</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">PGP Key</h3>
                    <p className="text-gray-700 dark:text-gray-300">Available at: https://codein.com/pgp-key.asc</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">Bug Bounty Program</h3>
                    <p className="text-gray-700 dark:text-gray-300">Coming soon - stay tuned for updates</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Security Updates
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We regularly update this security policy to reflect our evolving security practices and compliance requirements. 
                Major changes will be communicated through our official channels.
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-blue-900 dark:text-blue-200">
                  <strong>Stay informed:</strong> Follow our security announcements at https://status.codein.com
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}