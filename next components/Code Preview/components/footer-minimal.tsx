import Link from "next/link"
import { Code2, Github, Twitter, Linkedin } from "lucide-react"

export function FooterMinimal() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-2">
            <Code2 className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">CodeMarket</span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap justify-center md:justify-end gap-6">
            <Link href="/browse" className="text-muted-foreground hover:text-accent transition-colors">
              Browse Code
            </Link>
            <Link href="/sell" className="text-muted-foreground hover:text-accent transition-colors">
              Sell Code
            </Link>
            <Link href="/docs" className="text-muted-foreground hover:text-accent transition-colors">
              Documentation
            </Link>
            <Link href="/support" className="text-muted-foreground hover:text-accent transition-colors">
              Support
            </Link>
          </nav>

          {/* Social Links */}
          <div className="flex space-x-4">
            <Link href="#" className="text-muted-foreground hover:text-accent transition-colors" aria-label="GitHub">
              <Github className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-accent transition-colors" aria-label="Twitter">
              <Twitter className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-accent transition-colors" aria-label="LinkedIn">
              <Linkedin className="h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">© 2025 CodeMarket. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
