import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookie Policy | CodeIn',
  description: 'Cookie usage policy and data collection practices for CodeIn platform',
}

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            Cookie Policy
          </h1>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                What Are Cookies?
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Cookies are small text files that are placed on your computer or mobile device when you visit our website. 
                They are widely used to make websites work more efficiently and provide a better user experience.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                How We Use Cookies
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                CodeIn uses cookies to:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
                <li>Remember your login status and preferences</li>
                <li>Analyze how you use our website to improve our services</li>
                <li>Provide personalized content and features</li>
                <li>Ensure security and prevent fraud</li>
                <li>Remember your theme preferences (light/dark mode)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Types of Cookies We Use
              </h2>
              
              <div className="space-y-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-200 mb-2">
                    Essential Cookies
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    These cookies are necessary for the website to function properly. They enable basic functions like 
                    page navigation and access to secure areas of the website.
                  </p>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-green-900 dark:text-green-200 mb-2">
                    Performance Cookies
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    These cookies collect information about how visitors use our website, such as which pages are 
                    most popular and if they get error messages from web pages.
                  </p>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-2">
                    Functionality Cookies
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    These cookies allow the website to remember choices you make and provide enhanced, 
                    more personal features like remembering your username and preferences.
                  </p>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-orange-900 dark:text-orange-200 mb-2">
                    Analytics Cookies
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    We use analytics cookies to understand how our website is being used and to improve our services. 
                    This data is anonymized and helps us make our platform better.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Third-Party Cookies
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We may also use third-party services that set cookies on our behalf to provide certain functionalities:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
                <li><strong>Google Analytics:</strong> To analyze website traffic and user behavior</li>
                <li><strong>Authentication Services:</strong> For secure login and user management</li>
                <li><strong>CDN Services:</strong> For faster content delivery</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Managing Cookies
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                You can control and manage cookies in various ways:
              </p>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Browser Settings
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  Most browsers allow you to control cookies through their settings preferences:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                  <li>Block all cookies</li>
                  <li>Allow only first-party cookies</li>
                  <li>Delete cookies when you close your browser</li>
                  <li>View which cookies are stored and delete individual cookies</li>
                </ul>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                <p className="text-yellow-800 dark:text-yellow-200">
                  <strong>Note:</strong> Disabling certain cookies may affect the functionality of our website and your user experience.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Cookie Consent
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                By continuing to use our website, you consent to our use of cookies as described in this policy. 
                We will ask for your consent before setting any non-essential cookies.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Updates to This Policy
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We may update this Cookie Policy from time to time. Any changes will be posted on this page with 
                an updated revision date.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Contact Us
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                If you have any questions about our use of cookies, please contact us:
              </p>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300">
                  Email: privacy@codein.com<br />
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