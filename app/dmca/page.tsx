import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'DMCA Policy | CodeIn',
  description: 'Digital Millennium Copyright Act policy and copyright infringement procedures for CodeIn',
}

export default function DMCAPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            DMCA Policy
          </h1>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Overview
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                CodeIn respects the intellectual property rights of others and expects users to do the same. 
                In accordance with the Digital Millennium Copyright Act (DMCA), we will respond to valid notices 
                of copyright infringement and take appropriate action.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Reporting Copyright Infringement
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                If you believe that content on CodeIn infringes your copyright, please provide our DMCA agent with the following information:
              </p>

              <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg mb-6">
                <h3 className="text-lg font-semibold text-red-900 dark:text-red-200 mb-4">
                  Required Information for DMCA Takedown Notice:
                </h3>
                <ol className="list-decimal pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                  <li>A physical or electronic signature of the copyright owner or authorized representative</li>
                  <li>Identification of the copyrighted work claimed to have been infringed</li>
                  <li>Identification of the material that is claimed to be infringing and information sufficient to locate the material</li>
                  <li>Your contact information (address, telephone number, and email address)</li>
                  <li>A statement that you have a good faith belief that use of the material is not authorized</li>
                  <li>A statement that the information in the notification is accurate and that you are authorized to act on behalf of the copyright owner</li>
                </ol>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                DMCA Agent Contact Information
              </h2>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-2">
                  Designated DMCA Agent:
                </h3>
                <div className="text-gray-700 dark:text-gray-300">
                  <p><strong>Name:</strong> CodeIn DMCA Agent</p>
                  <p><strong>Email:</strong> dmca@codein.com</p>
                  <p><strong>Address:</strong> [Your Company Address]</p>
                  <p><strong>Phone:</strong> [Your Phone Number]</p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Counter-Notification Process
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                If you believe that your content was removed or disabled by mistake or misidentification, 
                you may file a counter-notification with the following information:
              </p>
              <ol className="list-decimal pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-2">
                <li>Your physical or electronic signature</li>
                <li>Identification of the material that was removed and its location before removal</li>
                <li>A statement under penalty of perjury that you have a good faith belief the material was removed by mistake</li>
                <li>Your name, address, telephone number, and consent to jurisdiction</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Our Response Process
              </h2>
              <div className="space-y-4">
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-900 dark:text-green-200">Step 1: Review</h3>
                  <p className="text-gray-700 dark:text-gray-300">We will review all DMCA notices within 24-48 hours</p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                  <h3 className="font-semibold text-yellow-900 dark:text-yellow-200">Step 2: Action</h3>
                  <p className="text-gray-700 dark:text-gray-300">Valid notices will result in removal or disabling of the infringing material</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-200">Step 3: Notification</h3>
                  <p className="text-gray-700 dark:text-gray-300">We will notify the alleged infringer of the takedown</p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Repeat Infringer Policy
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                CodeIn has a policy of terminating, in appropriate circumstances, the accounts of users who are repeat infringers. 
                We may also limit access to the service and/or terminate the accounts of any users who infringe any intellectual property rights of others.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Fair Use Consideration
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Before submitting a DMCA takedown notice, please consider whether the use of the copyrighted material 
                may be protected by fair use doctrine. Fair use allows limited use of copyrighted material for purposes such as:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
                <li>Educational purposes</li>
                <li>Commentary and criticism</li>
                <li>Research and scholarship</li>
                <li>Transformative use</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                False Claims Warning
              </h2>
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                <p className="text-red-900 dark:text-red-200 font-semibold">
                  Warning: Filing a false DMCA claim may result in legal consequences, including liability for damages, 
                  attorney's fees, and perjury charges.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Modifications to This Policy
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We reserve the right to modify this DMCA policy at any time. Changes will be posted on this page 
                with an updated revision date.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Additional Resources
              </h2>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li><strong>DMCA Official Website:</strong> https://www.dmca.com</li>
                  <li><strong>Copyright Office:</strong> https://www.copyright.gov</li>
                  <li><strong>Fair Use Guidelines:</strong> https://www.copyright.gov/fair-use/</li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}