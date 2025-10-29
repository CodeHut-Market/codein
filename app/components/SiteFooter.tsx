"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CheckCircle2,
  Github,
  Linkedin,
  Loader2,
  Twitter,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";

const socialLinks = {
  github: "https://github.com/CodeHut-Market",
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
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubscribe(e: FormEvent) {
    e.preventDefault();
    if (!email) return;
    try {
      setStatus("loading");
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Subscription failed");
      setStatus("success");
      setEmail("");
    } catch (err) {
      setStatus("error");
    } finally {
      setTimeout(() => setStatus("idle"), 2500);
    }
  }

  return (
    <footer
      role="contentinfo"
      aria-label="Site footer"
      className="border-t border-border bg-background/95"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        {/* grid: sections + compact newsletter in second row */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0">
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-1">
              <h3 className="text-[11px] font-semibold text-foreground uppercase">
                {section.title}
              </h3>
              <ul className="space-y-0 text-[12px] text-muted-foreground">
                {section.links.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="hover:text-accent transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Compact newsletter placed within the grid as last column on large screens */}
            <div className="col-span-1 sm:col-span-2 lg:col-span-1 flex flex-col justify-center">
            <h3 className="text-[11px] font-semibold text-foreground uppercase">
              Newsletter
            </h3>
            <form
              onSubmit={handleSubscribe}
              className="mt-0 flex items-center gap-2 w-full"
              aria-label="Newsletter subscription"
            >
              <Input
                type="email"
                required
                placeholder="Email address"
                className="text-sm py-1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email address"
              />
              <Button size="sm" type="submit" disabled={status === "loading"}>
                {status === "loading" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : status === "success" ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                ) : status === "error" ? (
                  <XCircle className="h-4 w-4 text-destructive" />
                ) : (
                  "Subscribe"
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* bottom row: links + social + copyright (compact) */}
  <div className="mt-1 pt-1 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]">
          <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
            <Link href="/terms" className="hover:text-accent">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-accent">
              Privacy
            </Link>
            <Link href="/cookies" className="hover:text-accent">
              Cookies
            </Link>
            <Link href="/dmca" className="hover:text-accent">
              DMCA
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Link
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </Link>
              <Link
                href={socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </Link>
              <Link
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </Link>
            </div>

            <div className="text-muted-foreground">© {new Date().getFullYear()} CodeHut Market</div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;