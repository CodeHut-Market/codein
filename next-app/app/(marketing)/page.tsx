import { ThemeToggle } from '../../components/theme-toggle'
import { Button } from '../../components/ui/button'

export default function MarketingHome() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center gap-4">
          <div className="font-bold text-xl">CodeHut</div>
          <nav className="ml-auto flex items-center gap-2">
            <Button variant="ghost">Features</Button>
            <Button variant="ghost">Pricing</Button>
            <Button variant="outline">Login</Button>
            <Button>Sign Up</Button>
            <ThemeToggle />
          </nav>
        </div>
      </header>
      <section className="flex flex-1 flex-col items-center justify-center gap-6 text-center px-6">
        <h1 className="text-5xl font-bold tracking-tight max-w-3xl">Find, Share & Monetize High‑Quality Code Snippets</h1>
        <p className="text-muted-foreground max-w-2xl text-lg">
          The new Next.js implementation is under active migration. Core UI primitives have been ported; advanced
          dashboards and snippet features are coming soon.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Button size="lg">Get Started</Button>
          <Button size="lg" variant="outline">Browse Snippets</Button>
        </div>
      </section>
    </main>
  )
}
