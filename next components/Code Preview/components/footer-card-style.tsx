import Link from "next/link"
import { Code2, Github, Twitter, Linkedin, BookOpen, Users, Zap } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function FooterCardStyle() {
  return (
    <footer className="bg-muted/30 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Brand Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Code2 className="h-10 w-10 text-primary" />
            <span className="text-2xl font-bold text-foreground">CodeMarket</span>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Empowering developers worldwide with premium code snippets, templates, and components. Build faster, code
            smarter.
          </p>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Marketplace Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Zap className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">Marketplace</h3>
              </div>
              <ul className="space-y-2">
                <li>
                  <Link href="/browse" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                    Browse Code
                  </Link>
                </li>
                <li>
                  <Link href="/sell" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                    Sell Your Code
                  </Link>
                </li>
                <li>
                  <Link
                    href="/categories"
                    className="text-sm text-muted-foreground hover:text-accent transition-colors"
                  >
                    Categories
                  </Link>
                </li>
                <li>
                  <Link href="/featured" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                    Featured Items
                  </Link>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Resources Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <BookOpen className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">Resources</h3>
              </div>
              <ul className="space-y-2">
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
                  <Link href="/tutorials" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                    Tutorials
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                    Blog
                  </Link>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Community Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Users className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">Community</h3>
              </div>
              <ul className="space-y-2">
                <li>
                  <Link href="/forum" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                    Forum
                  </Link>
                </li>
                <li>
                  <Link href="/discord" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                    Discord
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                    Support
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Social Links */}
            <div className="flex space-x-6">
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

            {/* Legal Links */}
            <div className="flex flex-wrap gap-6 text-sm">
              <Link href="/terms" className="text-muted-foreground hover:text-accent transition-colors">
                Terms
              </Link>
              <Link href="/privacy" className="text-muted-foreground hover:text-accent transition-colors">
                Privacy
              </Link>
              <Link href="/cookies" className="text-muted-foreground hover:text-accent transition-colors">
                Cookies
              </Link>
            </div>

            {/* Copyright */}
            <p className="text-sm text-muted-foreground">© 2025 CodeMarket</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
