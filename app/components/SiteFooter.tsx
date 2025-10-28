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
    <footer className="bg-gradient-to-b from-background to-muted/20 border-t border-primary/10 mt-1" role="contentinfo" aria-label="Site footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1">
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-1 mb-0">
              <Code2 className="h-3 w-3 text-primary" />
              <span className="text-[11px] font-bold bg-gradient-to-r from-primary via-violet-600 to-emerald-600 bg-clip-text text-transparent">Marketplace</span>
            </div>
            <p className="text-muted-foreground text-[10px] leading-none mb-0 hidden md:block">
              Buy, sell, and discover quality code snippets.
            </p>
            <div className="flex space-x-1">
              <Link href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-accent transition-colors" aria-label="GitHub">
                <Github className="h-3 w-3" />
              </Link>
              <Link href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-accent transition-colors" aria-label="Twitter">
                <Twitter className="h-3 w-3" />
              </Link>
              <Link href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-accent transition-colors" aria-label="LinkedIn">
                <Linkedin className="h-3 w-3" />
              </Link>
            </div>
          </div>
          <div>
            <h3 className="font-medium text-foreground mb-0 text-xs">Marketplace</h3>
            <ul className="space-y-0 text-[10px]">
              <li><Link href="/explore" className="text-muted-foreground hover:text-accent transition-colors">Browse</Link></li>
              <li><Link href="/upload" className="text-muted-foreground hover:text-accent transition-colors">Sell</Link></li>
              <li><Link href="/pricing" className="text-muted-foreground hover:text-accent transition-colors">Pricing</Link></li>
              <li><Link href="/featured" className="text-muted-foreground hover:text-accent transition-colors">Featured</Link></li>
            </ul>
          </div>
            <div>
              <h3 className="font-medium text-foreground mb-0 text-xs">Support</h3>
              <ul className="space-y-0 text-[10px]">
                <li><Link href="/help" className="text-muted-foreground hover:text-accent transition-colors">Help</Link></li>
                <li><Link href="/docs" className="text-muted-foreground hover:text-accent transition-colors">Docs</Link></li>
                <li><Link href="/contact" className="text-muted-foreground hover:text-accent transition-colors">Contact</Link></li>
                <li><Link href="/community" className="text-muted-foreground hover:text-accent transition-colors">Community</Link></li>
              </ul>
            </div>
          <div>
            <h3 className="font-medium text-foreground mb-0 text-xs">Stay Updated</h3>
            <form onSubmit={handleSubscribe} className="flex items-center gap-1" aria-label="Newsletter subscription form">
              <Input
                type="email"
                required
                placeholder="you@example.com"
                className="text-[10px] py-0.5 px-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email address"
              />
              <Button size="sm" className="px-2 py-0.5 bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 transition-all duration-200" type="submit" disabled={status === "loading"} aria-live="polite">
                {status === "loading" ? <Loader2 className="h-3 w-3 animate-spin" /> : status === "success" ? <CheckCircle2 className="h-3 w-3" /> : status === "error" ? <XCircle className="h-3 w-3" /> : "Go"}
              </Button>
            </form>
          </div>
        </div>
        <div className="mt-1 pt-1 border-t border-border flex flex-col md:flex-row gap-1 md:gap-0 items-center justify-between">
          <div className="flex flex-wrap gap-2 text-[10px]">
            <Link href="/terms" className="text-muted-foreground hover:text-accent transition-colors">Terms</Link>
            <Link href="/privacy" className="text-muted-foreground hover:text-accent transition-colors">Privacy</Link>
            <Link href="/cookies" className="text-muted-foreground hover:text-accent transition-colors">Cookies</Link>
            <Link href="/dmca" className="text-muted-foreground hover:text-accent transition-colors">DMCA</Link>
          </div>
          <p className="text-[10px] text-muted-foreground">©2025 Marketplace</p>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;