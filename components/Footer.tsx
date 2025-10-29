"use client"

import { Code, Github, Linkedin, Mail, MapPin, MessageCircle, Phone, Twitter } from 'lucide-react';
import Link from 'next/link';

const currentYear = new Date().getFullYear();

const footerSections = [
  {
    title: 'Resources',
    links: [
      { name: 'Documentation', href: '/docs' },
      { name: 'Tutorial', href: '/tutorials' },
      { name: 'Blogs', href: '/blog' },
      { name: 'API Access', href: '/api-docs' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'DMCA', href: '/dmca' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
    ],
  },
  {
    title: 'Community',
    links: [
      { name: 'Hub', href: '/community' },
      { name: 'Contributors', href: '/contributors' },
      { name: 'UI Library', href: '/ui-library' },
      { name: 'Help Center', href: '/help' },
    ],
  },
  {
    title: 'Company',
    links: [
      { name: 'About us', href: '/about' },
      { name: 'Contact', href: '/contact' },
      { name: 'Partners', href: '/partners' },
      { name: 'Licenses', href: '/licenses' },
    ],
  },
];

const socialLinks = [
  { name: 'GitHub', href: 'https://github.com/CodeHut-Market', icon: Github },
  { name: 'Discord', href: 'https://discord.gg/BqkC2YjD', icon: MessageCircle },
  { name: 'Twitter', href: 'https://twitter.com/codehut', icon: Twitter },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/codehut-market-a097ab387/', icon: Linkedin },
  { name: 'Email', href: 'mailto:marketcodehut@gmail.com', icon: Mail },
];

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-6">
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
                  <a href="mailto:marketcodehut@gmail.com" className="hover:text-foreground transition-colors">
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
                <h3 className="font-semibold text-foreground mb-4 uppercase tracking-wide text-sm">
                  {section.title}
                </h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link href={link.href} className="hover:text-foreground transition-colors">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Signup - Moved below footer sections */}
        <div className="pb-8 border-t border-border pt-8">
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
              {socialLinks.map((social) => {
                // Special handling for Discord with custom styling
                if (social.name === 'Discord') {
                  return (
                    <a 
                      key={social.name}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-2 group" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      href="https://discord.gg/BqkC2YjD"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle h-3 w-3 group-hover:text-primary transition-colors">
                        <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"></path>
                      </svg>
                      <span>Discord</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-external-link h-3 w-3 opacity-50">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" x2="21" y1="14" y2="3"></line>
                      </svg>
                    </a>
                  );
                }
                
                // Default styling for other social links
                return (
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
                );
              })}
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