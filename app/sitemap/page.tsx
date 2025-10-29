import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sitemap | CodeIn',
  description: 'Complete site navigation and page directory for CodeIn platform',
}

export default function Sitemap() {
  const siteStructure = [
    {
      category: "Main Pages",
      pages: [
        { name: "Home", url: "/", description: "CodeIn homepage and platform overview" },
        { name: "About", url: "/about", description: "Learn about CodeIn's mission and team" },
        { name: "Contact", url: "/contact", description: "Get in touch with our team" },
        { name: "Pricing", url: "/pricing", description: "View our pricing plans and features" },
      ]
    },
    {
      category: "Authentication",
      pages: [
        { name: "Sign Up", url: "/signup", description: "Create a new CodeIn account" },
        { name: "Login", url: "/login", description: "Sign in to your CodeIn account" },
        { name: "Reset Password", url: "/reset-password", description: "Reset your account password" },
      ]
    },
    {
      category: "Platform Features",
      pages: [
        { name: "Dashboard", url: "/dashboard", description: "Main user dashboard and overview" },
        { name: "Explore", url: "/explore", description: "Discover code snippets and projects" },
        { name: "Upload", url: "/upload", description: "Upload and share your code snippets" },
        { name: "Favorites", url: "/favorites", description: "View your saved and liked content" },
        { name: "Profile", url: "/profile", description: "Manage your user profile and settings" },
      ]
    },
    {
      category: "Resources",
      pages: [
        { name: "Documentation", url: "/docs", description: "API documentation and guides" },
        { name: "Blog", url: "/blog", description: "Latest news, tutorials, and insights" },
        { name: "Tutorials", url: "/tutorials", description: "Learn how to use CodeIn effectively" },
        { name: "Help", url: "/help", description: "Support articles and FAQ" },
        { name: "API Documentation", url: "/api-docs", description: "Complete API reference and examples" },
      ]
    },
    {
      category: "Community",
      pages: [
        { name: "Community", url: "/community", description: "Join the CodeIn developer community" },
        { name: "Events", url: "/events", description: "Upcoming events and meetups" },
        { name: "Contributors", url: "/contributors", description: "Meet our community contributors" },
        { name: "Partners", url: "/partners", description: "Our technology and business partners" },
      ]
    },
    {
      category: "Company",
      pages: [
        { name: "Careers", url: "/careers", description: "Join our team and grow with us" },
        { name: "Press", url: "/press", description: "Press releases and media resources" },
        { name: "Status", url: "/status", description: "System status and uptime monitoring" },
      ]
    },
    {
      category: "Tools & Utilities",
      pages: [
        { name: "Demo", url: "/demo", description: "Try CodeIn without signing up" },
        { name: "UI Library", url: "/ui-library", description: "Explore our component library" },
        { name: "Snippet View", url: "/snippet", description: "View and interact with code snippets" },
      ]
    },
    {
      category: "Legal & Privacy",
      pages: [
        { name: "Terms of Service", url: "/terms", description: "Our terms and conditions" },
        { name: "Cookie Policy", url: "/cookies", description: "How we use cookies and tracking" },
        { name: "DMCA Policy", url: "/dmca", description: "Copyright and DMCA procedures" },
        { name: "Licenses", url: "/licenses", description: "Open source licenses and attributions" },
        { name: "Security Policy", url: "/security", description: "Our security practices and policies" },
        { name: "Accessibility", url: "/accessibility", description: "Accessibility commitment and features" },
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 md:p-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Sitemap
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Complete navigation guide to all pages and features on CodeIn
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="space-y-12">
            {siteStructure.map((section, index) => (
              <section key={index} className="border-b border-gray-200 dark:border-gray-600 pb-8 last:border-b-0">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6 flex items-center">
                  <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                    {index + 1}
                  </span>
                  {section.category}
                </h2>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {section.pages.map((page, pageIndex) => (
                    <Link
                      key={pageIndex}
                      href={page.url}
                      className="block p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md transition-all duration-200 group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-1">
                            {page.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {page.description}
                          </p>
                          <p className="text-xs font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded inline-block">
                            {page.url}
                          </p>
                        </div>
                        <div className="ml-2 text-gray-400 group-hover:text-blue-500 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Additional Information */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-600">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-3">
                  🔍 Search & Discovery
                </h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  Can&apos;t find what you&apos;re looking for? Use our search functionality or browse by categories. 
                  Most pages also have breadcrumb navigation to help you understand your location within the site.
                </p>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-green-900 dark:text-green-200 mb-3">
                  📱 Mobile Navigation
                </h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  All pages are optimized for mobile devices with responsive design and touch-friendly navigation. 
                  Use the mobile menu to access all major sections.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-8 bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 text-center">
              Platform Statistics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {siteStructure.reduce((total, section) => total + section.pages.length, 0)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Pages</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {siteStructure.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Categories</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  100%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Mobile Ready</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  AA
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">WCAG Level</div>
              </div>
            </div>
          </div>

          {/* Footer Navigation Help */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Need help navigating or have suggestions for new features?
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="/contact" 
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Contact Support
              </Link>
              <Link 
                href="/help" 
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Help Center
              </Link>
              <Link 
                href="/docs" 
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Documentation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}