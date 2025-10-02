import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | CodeIn',
  description: 'Terms of Service and usage guidelines for CodeIn platform',
}

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            Terms of Service
          </h1>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                By accessing and using CodeIn, you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                2. Restricted Use License
              </h2>
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg mb-4 border-l-4 border-red-500">
                <p className="text-red-800 dark:text-red-200 font-semibold mb-2">⚠️ IMPORTANT: LIMITED LICENSE ONLY</p>
                <p className="text-gray-700 dark:text-gray-300">
                  CodeIn grants you a limited, non-exclusive, non-transferable, revocable license to access and use 
                  our platform solely for your personal, non-commercial use in accordance with these Terms.
                </p>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                <strong>You are STRICTLY PROHIBITED from:</strong>
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-2">
                <li><strong>Copying or reproducing</strong> any part of the website, platform, or codebase</li>
                <li><strong>Reverse engineering, decompiling, or extracting</strong> any source code or business logic</li>
                <li><strong>Creating derivative works</strong> or competing platforms based on CodeIn</li>
                <li><strong>Commercial use</strong> of any CodeIn intellectual property without written permission</li>
                <li><strong>Scraping, crawling, or automated data extraction</strong> from our platform</li>
                <li><strong>Removing or altering</strong> any copyright, trademark, or proprietary notices</li>
                <li><strong>Distributing or reselling</strong> any part of our platform or content</li>
                <li><strong>Using our platform</strong> to build competing services or products</li>
              </ul>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                <p className="text-yellow-800 dark:text-yellow-200">
                  <strong>Violation Notice:</strong> Any breach of these restrictions will result in immediate termination 
                  of your account and may subject you to legal action for copyright infringement and damages.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                3. User Account and Conduct
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                When creating an account, you must provide accurate and complete information. 
                You are responsible for safeguarding your account and all activities under your account.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                You agree not to:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
                <li>Upload malicious code or harmful content</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Spam or harass other users</li>
                <li>Share inappropriate or offensive content</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                4. Content Ownership
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                You retain ownership of any code snippets or content you upload to CodeIn. 
                However, by uploading content, you grant CodeIn a license to use, modify, and display your content on the platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                5. Intellectual Property Protection
              </h2>
              <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border-2 border-red-200 dark:border-red-600 mb-4">
                <h3 className="text-lg font-semibold text-red-900 dark:text-red-200 mb-3">
                  🛡️ CodeIn Proprietary Rights
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  All rights, title, and interest in and to the CodeIn platform, including but not limited to:
                </p>
                <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
                  <li>Source code, algorithms, and business logic</li>
                  <li>User interface designs and user experience flows</li>
                  <li>Database schemas and data structures</li>
                  <li>API endpoints and integration methods</li>
                  <li>Branding, logos, and visual identity</li>
                  <li>Documentation and technical specifications</li>
                </ul>
                <p className="text-red-800 dark:text-red-200 font-semibold">
                  Are the exclusive property of CodeIn and are protected by copyright, trademark, patent, 
                  and other intellectual property laws worldwide.
                </p>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                <p className="text-yellow-800 dark:text-yellow-200 font-semibold">
                  ⚖️ Legal Notice: Unauthorized copying, reproduction, or use of CodeIn's intellectual property 
                  is strictly prohibited and may result in immediate legal action, including claims for damages, 
                  injunctive relief, and attorney's fees.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                6. Privacy Policy
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, 
                to understand our practices.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                7. Service Availability
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We strive to maintain high availability but cannot guarantee uninterrupted service. 
                We reserve the right to modify or discontinue the service at any time.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                8. Limitation of Liability
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                In no event shall CodeIn or its suppliers be liable for any damages arising out of the use or inability to use the materials on CodeIn, 
                even if CodeIn or an authorized representative has been notified of the possibility of such damage.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                9. Governing Law
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the 
                exclusive jurisdiction of the courts in that state or location.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                10. Changes to Terms
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We reserve the right to modify these terms at any time. Changes will be posted on this page with an updated revision date.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                11. Contact Information
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300">
                  Email: legal@codein.com<br />
                  Website: https://codein.com/contact
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}