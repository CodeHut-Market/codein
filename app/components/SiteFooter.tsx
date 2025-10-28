"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Code2, Github, Linkedin, Loader2, Twitter, XCircle } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";

// TODO: Move to a central config file later
const socialLinks = {
  github: "https://github.com/CodeHut-Market", // placeholder
  twitter: "https://twitter.com/your-handle",
  linkedin: "https://www.linkedin.com/company/your-company/",
};

export function SiteFooter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  async function handleSubscribe(e: FormEvent) {
    e.preventDefault();
    if (!email) return;
    try {
      setStatus("loading");
      setMessage("");
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Subscription failed");
      setStatus("success");
      setMessage("Subscribed! Check your inbox.");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage((err as Error).message || "Failed to subscribe");
    } finally {
      setTimeout(() => setStatus("idle"), 4000);
    }
  }
  return (
    <footer className="bg-gradient-to-b from-background to-muted/20 border-t border-primary/10 mt-12" role="contentinfo" aria-label="Site footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-3">
              <Code2 className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold bg-gradient-to-r from-primary via-violet-600 to-emerald-600 bg-clip-text text-transparent">Marketplace</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              Buy, sell, and discover quality code snippets, templates, and components.
            </p>
            <div className="flex space-x-4">
              <Link href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-accent transition-colors" aria-label="GitHub">
                <Github className="h-5 w-5" />
              </Link>
              <Link href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-accent transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-accent transition-colors" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-3">Marketplace</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/explore" className="text-muted-foreground hover:text-accent transition-colors">Browse Code</Link></li>
              <li><Link href="/upload" className="text-muted-foreground hover:text-accent transition-colors">Sell Code</Link></li>
              <li><Link href="/pricing" className="text-muted-foreground hover:text-accent transition-colors">Pricing</Link></li>
              <li><Link href="/featured" className="text-muted-foreground hover:text-accent transition-colors">Featured</Link></li>
            </ul>
          </div>
            <div>
              <h3 className="font-semibold text-foreground mb-3">Support</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/help" className="text-muted-foreground hover:text-accent transition-colors">Help Center</Link></li>
                <li><Link href="/docs" className="text-muted-foreground hover:text-accent transition-colors">Documentation</Link></li>
                <li><Link href="/contact" className="text-muted-foreground hover:text-accent transition-colors">Contact</Link></li>
                <li><Link href="/community" className="text-muted-foreground hover:text-accent transition-colors">Community</Link></li>
              </ul>
            </div>
          <div>
            <h3 className="font-semibold text-foreground mb-3">Stay Updated</h3>
            <p className="text-sm text-muted-foreground mb-3">Get the latest snippets & marketplace updates.</p>
            <form onSubmit={handleSubscribe} className="flex flex-col space-y-2" aria-label="Newsletter subscription form">
              <Input
                type="email"
                required
                placeholder="you@example.com"
                className="text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email address"
              />
              <Button size="sm" className="w-full bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 transition-all duration-200" type="submit" disabled={status === "loading"} aria-live="polite">
                {status === "loading" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {status === "success" && <CheckCircle2 className="mr-2 h-4 w-4" />}
                {status === "error" && <XCircle className="mr-2 h-4 w-4" />}
                {status === "loading" ? "Subscribing..." : status === "success" ? "Subscribed" : status === "error" ? "Retry" : "Subscribe"}
              </Button>
              {message && (
                <p className="text-xs text-muted-foreground" role="status">{message}</p>
              )}
            </form>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-border flex flex-col md:flex-row gap-4 md:gap-0 items-center justify-between">
          <div className="flex flex-wrap gap-6 text-sm">
            <Link href="/terms" className="text-muted-foreground hover:text-accent transition-colors">Terms</Link>
            <Link href="/privacy" className="text-muted-foreground hover:text-accent transition-colors">Privacy</Link>
            <Link href="/cookies" className="text-muted-foreground hover:text-accent transition-colors">Cookies</Link>
            <Link href="/dmca" className="text-muted-foreground hover:text-accent transition-colors">DMCA</Link>
          </div>
          <p className="text-sm text-muted-foreground">© 2025 Marketplace. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;