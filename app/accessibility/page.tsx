import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Accessibility Statement | CodeIn',
  description: 'CodeIn\'s commitment to accessibility and compliance with WCAG guidelines',
}

export default function AccessibilityStatement() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            Accessibility Statement
          </h1>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Our Commitment to Accessibility
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                CodeIn is committed to ensuring digital accessibility for people with disabilities. We are continually 
                improving the user experience for everyone and applying the relevant accessibility standards to ensure 
                we provide equal access to all our users.
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                <p className="text-blue-900 dark:text-blue-200 font-semibold">
                  We believe that everyone, regardless of their abilities, should have access to information and 
                  functionality on the web.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Accessibility Standards
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                CodeIn strives to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards. 
                These guidelines help make web content more accessible to a wider range of people with disabilities.
              </p>
              
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="border border-green-200 dark:border-green-600 bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-900 dark:text-green-200 mb-2">
                    Level A
                  </h3>
                  <p className="text-green-800 dark:text-green-300 text-sm">
                    ✅ Basic accessibility features implemented
                  </p>
                </div>
                <div className="border border-yellow-200 dark:border-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-200 mb-2">
                    Level AA
                  </h3>
                  <p className="text-yellow-800 dark:text-yellow-300 text-sm">
                    🔄 In progress - our target compliance level
                  </p>
                </div>
                <div className="border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Level AAA
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    📋 Future enhancement consideration
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Accessibility Features
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                We have implemented the following accessibility features across our platform:
              </p>

              <div className="space-y-6">
                <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-3 flex items-center">
                    <span className="mr-2">🎨</span> Visual Accessibility
                  </h3>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                    <li>High contrast color schemes with 4.5:1 minimum ratio</li>
                    <li>Dark and light theme options</li>
                    <li>Scalable fonts that work with browser zoom up to 200%</li>
                    <li>Clear focus indicators for keyboard navigation</li>
                    <li>Meaningful alt text for all images</li>
                    <li>No flashing content that could trigger seizures</li>
                  </ul>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-green-900 dark:text-green-200 mb-3 flex items-center">
                    <span className="mr-2">⌨️</span> Keyboard Accessibility
                  </h3>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                    <li>Full keyboard navigation support</li>
                    <li>Logical tab order throughout the interface</li>
                    <li>Keyboard shortcuts for common actions</li>
                    <li>Skip links to main content areas</li>
                    <li>Escape key support for modal dialogs</li>
                  </ul>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-200 mb-3 flex items-center">
                    <span className="mr-2">🔊</span> Screen Reader Support
                  </h3>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                    <li>Semantic HTML structure with proper headings</li>
                    <li>ARIA labels and descriptions where needed</li>
                    <li>Form labels properly associated with inputs</li>
                    <li>Status updates announced to screen readers</li>
                    <li>Descriptive link text and button labels</li>
                  </ul>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-orange-900 dark:text-orange-200 mb-3 flex items-center">
                    <span className="mr-2">📱</span> Mobile Accessibility
                  </h3>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                    <li>Touch targets at least 44x44 pixels</li>
                    <li>Responsive design that works on all screen sizes</li>
                    <li>Support for mobile screen readers</li>
                    <li>Gesture-based navigation alternatives</li>
                    <li>Orientation support (portrait and landscape)</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Assistive Technology Compatibility
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                CodeIn has been tested and is compatible with the following assistive technologies:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Screen Readers</h3>
                  <ul className="text-gray-700 dark:text-gray-300 text-sm space-y-1">
                    <li>• NVDA (Windows)</li>
                    <li>• JAWS (Windows)</li>
                    <li>• VoiceOver (macOS, iOS)</li>
                    <li>• TalkBack (Android)</li>
                    <li>• Orca (Linux)</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Other Tools</h3>
                  <ul className="text-gray-700 dark:text-gray-300 text-sm space-y-1">
                    <li>• Dragon NaturallySpeaking</li>
                    <li>• Switch navigation devices</li>
                    <li>• Eye-tracking software</li>
                    <li>• Voice control systems</li>
                    <li>• Browser zoom (up to 200%)</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Known Limitations
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                While we strive for full accessibility, we acknowledge some current limitations:
              </p>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg">
                <ul className="list-disc pl-6 text-yellow-800 dark:text-yellow-300 space-y-2">
                  <li>Code syntax highlighting may not be fully accessible to screen readers (we provide alternative text descriptions)</li>
                  <li>Some complex interactive components are still being optimized for keyboard navigation</li>
                  <li>Third-party embedded content may not meet our accessibility standards</li>
                  <li>Dynamic content updates may require manual refresh in some assistive technologies</li>
                </ul>
                <p className="text-yellow-800 dark:text-yellow-300 mt-4 font-semibold">
                  We are actively working to address these limitations in upcoming releases.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Accessibility Testing
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We regularly test our platform using both automated and manual methods:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border border-gray-200 dark:border-gray-600 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Automated Testing</h3>
                  <ul className="text-gray-700 dark:text-gray-300 text-sm space-y-1">
                    <li>• axe-core accessibility engine</li>
                    <li>• Lighthouse accessibility audits</li>
                    <li>• Pa11y command line tool</li>
                    <li>• Continuous integration checks</li>
                  </ul>
                </div>
                <div className="border border-gray-200 dark:border-gray-600 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Manual Testing</h3>
                  <ul className="text-gray-700 dark:text-gray-300 text-sm space-y-1">
                    <li>• Screen reader testing</li>
                    <li>• Keyboard-only navigation</li>
                    <li>• Color contrast validation</li>
                    <li>• User testing with disabilities</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Feedback and Support
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                We welcome feedback about the accessibility of CodeIn. If you encounter any accessibility barriers or have suggestions for improvement, please don&apos;t hesitate to contact us.
              </p>

              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-green-900 dark:text-green-200 mb-4">
                  Contact Our Accessibility Team
                </h3>
                <div className="space-y-3 text-gray-700 dark:text-gray-300">
                  <p><strong>Email:</strong> accessibility@codein.com</p>
                  <p><strong>Response Time:</strong> We aim to respond within 2 business days</p>
                  <p><strong>Phone:</strong> [Phone number with accessibility support hours]</p>
                  <p><strong>Alternative Formats:</strong> We can provide information in alternative formats upon request</p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Ongoing Improvements
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Accessibility is an ongoing process. Our roadmap includes:
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <span className="text-blue-600 dark:text-blue-400">🔄</span>
                  <span className="text-gray-700 dark:text-gray-300">Regular accessibility audits and updates</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <span className="text-green-600 dark:text-green-400">👥</span>
                  <span className="text-gray-700 dark:text-gray-300">User testing with disability communities</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <span className="text-purple-600 dark:text-purple-400">📚</span>
                  <span className="text-gray-700 dark:text-gray-300">Staff training on accessibility best practices</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <span className="text-orange-600 dark:text-orange-400">🔧</span>
                  <span className="text-gray-700 dark:text-gray-300">Integration of accessibility tools in development workflow</span>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Legal Information
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                This accessibility statement was created on {new Date().toLocaleDateString()} and reflects our ongoing commitment to digital accessibility. 
                We review and update this statement regularly as we continue to improve our accessibility features.
              </p>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  <strong>Note:</strong> If you need immediate assistance or encounter critical accessibility issues, 
                  please contact our support team directly for priority assistance.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}