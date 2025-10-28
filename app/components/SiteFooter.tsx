"use client";
import { Github, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";

// TODO: Move to a central config file later
const socialLinks = {
  github: "https://github.com/CodeHut-Market", // placeholder
  twitter: "https://twitter.com/your-handle",
  linkedin: "https://www.linkedin.com/company/your-company/",
};

const footerSections = [
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "/docs" },
      { label: "Tutorial", href: "/tutorials" },
      { label: "Blogs", href: "/blog" },
      { label: "API Access", href: "/api-docs" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "DMCA", href: "/dmca" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Hub", href: "/community" },
      { label: "Contributors", href: "/contributors" },
      { label: "UI Library", href: "/ui-library" },
      { label: "Help Center", href: "/help" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About us", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Partners", href: "/partners" },
      { label: "Licenses", href: "/licenses" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer
      className="bg-gradient-to-b from-background to-muted/20 border-t border-primary/10 mt-0"
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground tracking-wide uppercase">
                {section.title}
              </h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {section.links.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="hover:text-accent transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-border pt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} CodeHut Market</span>
            <span>·</span>
            <Link href="/explore" className="hover:text-accent">Explore</Link>
            <span>·</span>
            <Link href="/pricing" className="hover:text-accent">Pricing</Link>
            <span>·</span>
            <Link href="/status" className="hover:text-accent">Status</Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent"
              aria-label="GitHub"
            >
              <Github className="h-3 w-3" />
            </Link>
            <Link
              href={socialLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent"
              aria-label="Twitter"
            >
              <Twitter className="h-3 w-3" />
            </Link>
            <Link
              href={socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;