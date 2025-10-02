import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Licenses | CodeIn',
  description: 'Open source licenses and third-party attributions for CodeIn platform',
}

export default function Licenses() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            Licenses & Attributions
          </h1>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                CodeIn Platform License
              </h2>
              <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg mb-6 border-2 border-red-200 dark:border-red-600">
                <h3 className="text-xl font-semibold text-red-900 dark:text-red-200 mb-2">
                  ⚠️ Proprietary Software - All Rights Reserved
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Copyright © {new Date().getFullYear()} CodeIn. All rights reserved.
                </p>
                <div className="bg-white dark:bg-gray-800 p-4 rounded border-2 border-red-300 dark:border-red-600">
                  <div className="space-y-3 text-sm">
                    <p className="text-red-800 dark:text-red-200 font-semibold">
                      🚫 UNAUTHORIZED USE PROHIBITED
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      This software and all associated documentation, design, code, and content are the exclusive 
                      property of CodeIn and are protected by copyright, trademark, and other intellectual property laws.
                    </p>
                    <div className="bg-red-50 dark:bg-red-900/30 p-3 rounded border-l-4 border-red-500">
                      <p className="text-gray-700 dark:text-gray-300 font-medium">STRICTLY PROHIBITED:</p>
                      <ul className="list-disc pl-4 mt-2 text-gray-700 dark:text-gray-300">
                        <li>Copying, reproducing, or duplicating the website or platform</li>
                        <li>Reverse engineering, decompiling, or extracting source code</li>
                        <li>Creating derivative works or competing platforms</li>
                        <li>Commercial use of any CodeIn intellectual property</li>
                        <li>Distribution, sublicensing, or resale of any part of the platform</li>
                      </ul>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">
                      <strong>Legal Notice:</strong> Violations will be prosecuted to the full extent of the law. 
                      For licensing inquiries, contact: legal@codein.com
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Third-Party Dependencies
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                CodeIn is built using various open-source libraries and frameworks. We acknowledge and thank the contributors of these projects:
              </p>

              <div className="space-y-6">
                {/* Next.js */}
                <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Next.js
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    License: MIT | Version: 14.x
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    React framework for production-grade applications with server-side rendering and static site generation.
                  </p>
                  <a href="https://github.com/vercel/next.js" className="text-blue-600 dark:text-blue-400 hover:underline">
                    GitHub Repository
                  </a>
                </div>

                {/* React */}
                <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    React
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    License: MIT | Version: 18.x
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    A JavaScript library for building user interfaces with component-based architecture.
                  </p>
                  <a href="https://github.com/facebook/react" className="text-blue-600 dark:text-blue-400 hover:underline">
                    GitHub Repository
                  </a>
                </div>

                {/* TypeScript */}
                <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    TypeScript
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    License: Apache 2.0 | Version: 5.x
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    Strongly typed programming language that builds on JavaScript by adding static type definitions.
                  </p>
                  <a href="https://github.com/microsoft/TypeScript" className="text-blue-600 dark:text-blue-400 hover:underline">
                    GitHub Repository
                  </a>
                </div>

                {/* Tailwind CSS */}
                <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Tailwind CSS
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    License: MIT | Version: 3.x
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    Utility-first CSS framework for rapidly building custom user interfaces.
                  </p>
                  <a href="https://github.com/tailwindlabs/tailwindcss" className="text-blue-600 dark:text-blue-400 hover:underline">
                    GitHub Repository
                  </a>
                </div>

                {/* Framer Motion */}
                <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Framer Motion
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    License: MIT | Version: 11.x
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    Production-ready motion library for React with declarative animations.
                  </p>
                  <a href="https://github.com/framer/motion" className="text-blue-600 dark:text-blue-400 hover:underline">
                    GitHub Repository
                  </a>
                </div>

                {/* Supabase */}
                <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Supabase
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    License: Apache 2.0 | Version: 2.x
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    Open source Firebase alternative with real-time database and authentication.
                  </p>
                  <a href="https://github.com/supabase/supabase" className="text-blue-600 dark:text-blue-400 hover:underline">
                    GitHub Repository
                  </a>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                UI Components & Icons
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200">Radix UI</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">MIT License</p>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">Accessible component primitives</p>
                </div>
                <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200">Lucide React</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">ISC License</p>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">Beautiful & consistent icon toolkit</p>
                </div>
                <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200">Heroicons</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">MIT License</p>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">Hand-crafted SVG icons</p>
                </div>
                <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200">React Hook Form</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">MIT License</p>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">Performant forms library</p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Development Tools
              </h2>
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200">ESLint</h4>
                    <p className="text-gray-600 dark:text-gray-400">MIT License</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200">Prettier</h4>
                    <p className="text-gray-600 dark:text-gray-400">MIT License</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200">PostCSS</h4>
                    <p className="text-gray-600 dark:text-gray-400">MIT License</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Font Licenses
              </h2>
              <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Inter Font Family
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  License: SIL Open Font License 1.1
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  A typeface carefully crafted & designed for computer screens.
                </p>
                <a href="https://github.com/rsms/inter" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Font Repository
                </a>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                License Compliance
              </h2>
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  CodeIn is committed to license compliance and respects all third-party intellectual property rights. 
                  All dependencies are used in accordance with their respective licenses.
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  If you believe any license attribution is missing or incorrect, please contact us at: 
                  <strong className="text-green-700 dark:text-green-300"> legal@codein.com</strong>
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Full License Texts
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Complete license texts for all third-party components can be found in our source code repository 
                or requested by contacting our legal team.
              </p>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Repository:</strong> https://github.com/codein/platform<br />
                  <strong>License Directory:</strong> /licenses/<br />
                  <strong>Contact:</strong> legal@codein.com
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}