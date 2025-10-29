"use client";

import {
  Code,
  Github,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Twitter,
} from "lucide-react";
import Link from "next/link";

const currentYear = new Date().getFullYear();

const footerSections = [
  {
    title: "Resources",
    links: [
      { name: "Documentation", href: "/docs" },
      { name: "Tutorial", href: "/tutorials" },
      { name: "Blogs", href: "/blog" },
      { name: "API Access", href: "/api-docs" },
    ],
  },
  {
    title: "Legal",
    links: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "DMCA", href: "/dmca" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
    ],
  },
  {
    title: "Community",
    links: [
      { name: "Hub", href: "/community" },
      { name: "Contributors", href: "/contributors" },
      { name: "UI Library", href: "/ui-library" },
      { name: "Help Center", href: "/help" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About us", href: "/about" },
      { name: "Contact", href: "/contact" },
      { name: "Partners", href: "/partners" },
      { name: "Licenses", href: "/licenses" },
    ],
  },
];

const socialLinks = [
  { name: "GitHub", href: "https://github.com/CodeHut-Market", icon: Github },
  { name: "Discord", href: "https://discord.gg/BqkC2YjD", icon: MessageCircle },
  { name: "Twitter", href: "https://twitter.com/codehut", icon: Twitter },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/codehut-market-a097ab387/",
    icon: Linkedin,
  },
  { name: "Email", href: "mailto:marketcodehut@gmail.com", icon: Mail },
];

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-12 grid grid-cols-1 gap-8 lg:grid-cols-5">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Code className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                CodeHut
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-6">
              Build. Share. Ship. A platform for developers to discover, share, and monetize code snippets with the global community.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <a
                  href="mailto:marketcodehut@gmail.com"
                  className="hover:text-foreground transition-colors"
                >
                  marketcodehut@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>Upcoming</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>New Delhi, India</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-foreground mb-3 uppercase text-sm">
                {section.title}
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Stay Updated */}
        <div className="py-8 border-t border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="font-semibold text-foreground uppercase text-sm mb-2">Stay Updated</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Get the latest code snippets, tutorials, and community updates in your inbox.
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-3 py-2 border border-border rounded-md text-sm bg-background w-full sm:w-64"
            />
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
              Subscribe
            </button>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="py-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-muted-foreground">
          <div className="flex flex-wrap justify-center sm:justify-start gap-2 text-center">
            <span>© {currentYear} CodeHut. All rights reserved.</span>
            <span className="hidden sm:inline">•</span>
            <span>Built with ❤️ by developers, for developers</span>
          </div>

          <div className="flex items-center gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className="p-2 hover:text-foreground hover:bg-accent rounded-md transition-colors"
              >
                <social.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
