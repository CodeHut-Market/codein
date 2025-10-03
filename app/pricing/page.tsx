import Link from 'next/link'
import { Button } from "../components/ui/button"

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-6 py-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-6">Pricing Plans</h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-12">
            Choose the perfect plan for your needs.
          </p>
          
          <div className="mt-16">
            <Link href="/ui-library">
              <Button size="lg">Browse UI Components</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
