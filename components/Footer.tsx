"use client"

import {
  BookOpen,
  Code,
  DollarSign,
  ExternalLink,
  FileText,
  Github,
  Heart,
  HelpCircle,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Shield,
  Twitter,
  Upload,
  Users
} from 'lucide-react';
import Link from 'next/link';

const currentYear = new Date().getFullYear();

const footerSections = {
  product: {
    title: 'Product',
    links: [
      { name: 'Explore Code', href: '/explore', icon: Code },
      { name: 'Upload Code', href: '/upload', icon: Upload },
      { name: 'Favorites', href: '/favorites', icon: Heart },
      { name: 'Pricing', href: '/pricing', icon: DollarSign },
      { name: 'API Access', href: '/api-docs', icon: ExternalLink },
    ]
  },
  resources: {
    title: 'Resources',
    links: [
      { name: 'Documentation', href: '/docs', icon: BookOpen },
      { name: 'Tutorials', href: '/tutorials', icon: BookOpen },
      { name: 'Blog', href: '/blog', icon: FileText },
      { name: 'Help Center', href: '/help', icon: HelpCircle },
      { name: 'Status Page', href: '/status', icon: ExternalLink },
    ]
  },
  community: {
    title: 'Community',
    links: [
      { name: 'Community Hub', href: '/community', icon: Users },
      { name: 'Discord', href: 'https://discord.gg/codehut', icon: MessageCircle, external: true },
      { name: 'GitHub', href: 'https://github.com/codehut', icon: Github, external: true },
      { name: 'Contributors', href: '/contributors', icon: Users },
      { name: 'Events', href: '/events', icon: Users },
    ]
  },
  company: {
    title: 'Company',
    links: [
      { name: 'About Us', href: '/about', icon: Users },
      { name: 'Careers', href: '/careers', icon: Users },
      { name: 'Contact', href: '/contact', icon: Mail },
      { name: 'Press Kit', href: '/press', icon: FileText },
      { name: 'Partners', href: '/partners', icon: Users },
    ]
  },
  legal: {
    title: 'Legal',
    links: [
      { name: 'Privacy Policy', href: '/privacy', icon: Shield },
      { name: 'Terms of Service', href: '/terms', icon: FileText },
      { name: 'Cookie Policy', href: '/cookies', icon: FileText },
      { name: 'DMCA', href: '/dmca', icon: Shield },
      { name: 'Licenses', href: '/licenses', icon: FileText },
    ]
  }
};

const socialLinks = [
  { name: 'GitHub', href: 'https://github.com/codehut', icon: Github },
  { name: 'Twitter', href: 'https://twitter.com/codehut', icon: Twitter },
  { name: 'LinkedIn', href: 'https://linkedin.com/company/codehut', icon: Linkedin },
  { name: 'Email', href: 'mailto:hello@codehut.com', icon: Mail },
];

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center space-x-2 mb-4">
                <Code className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  CodeHut
                </span>
              </Link>
              <p className="text-muted-foreground mb-6 max-w-md">
                Build. Share. Ship. A comprehensive platform for developers to discover, 
                share, and monetize code snippets with the global community.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <a href="mailto:hello@codehut.com" className="hover:text-foreground transition-colors">
                    hello@codehut.com
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>San Francisco, CA</span>
                </div>
              </div>
            </div>

            {/* Footer Links */}
            {Object.entries(footerSections).map(([key, section]) => (
              <div key={key}>
                <h3 className="font-semibold text-foreground mb-4">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-2 group"
                        {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      >
                        <link.icon className="h-3 w-3 group-hover:text-primary transition-colors" />
                        <span>{link.name}</span>
                        {link.external && <ExternalLink className="h-3 w-3 opacity-50" />}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="py-8 border-t border-border">
          <div className="max-w-md mx-auto text-center lg:max-w-none lg:text-left">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Stay Updated
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get the latest code snippets, tutorials, and community updates delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto lg:mx-0">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button className="px-6 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="py-6 border-t border-border">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            {/* Copyright */}
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>© {currentYear} CodeHut. All rights reserved.</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">Built with ❤️ by developers, for developers</span>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="py-4 border-t border-border">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-2 lg:space-y-0 text-xs text-muted-foreground">
            <div className="flex flex-wrap items-center gap-4">
              <span>🌟 Over 10k+ code snippets</span>
              <span>👥 5k+ active developers</span>
              <span>⚡ 99.9% uptime</span>
              <span>🔒 SOC 2 compliant</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/security" className="hover:text-foreground transition-colors">
                Security
              </Link>
              <Link href="/accessibility" className="hover:text-foreground transition-colors">
                Accessibility
              </Link>
              <Link href="/sitemap" className="hover:text-foreground transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}