import Link from "next/link"
import { Code2, Github, Twitter, Linkedin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function FooterComprehensive() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand and Description */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Code2 className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">CodeHut</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              The premier marketplace for developers to buy, sell, and discover high-quality code snippets, templates,
              and components.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-accent transition-colors" aria-label="GitHub">
                <Github className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-accent transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-accent transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Marketplace */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Marketplace</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/browse" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                  Browse Code
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/sell" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                  Sell Your Code
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/featured" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                  Featured Items
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/help" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/docs" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/api" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                  API Reference
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                  Community Forum
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Stay Updated</h3>
            <p className="text-sm text-muted-foreground mb-4">Get the latest code snippets and marketplace updates.</p>
            <div className="flex flex-col space-y-2">
              <Input type="email" placeholder="Enter your email" className="text-sm" />
              <Button size="sm" className="w-full">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-wrap gap-6 text-sm">
              <Link href="/terms" className="text-muted-foreground hover:text-accent transition-colors">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-muted-foreground hover:text-accent transition-colors">
                Privacy Policy
              </Link>
              <Link href="/cookies" className="text-muted-foreground hover:text-accent transition-colors">
                Cookie Policy
              </Link>
              <Link href="/dmca" className="text-muted-foreground hover:text-accent transition-colors">
                DMCA
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">© 2025 CodeHut. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
