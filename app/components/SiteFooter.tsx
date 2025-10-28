"use client";
import { Code2, Github, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";

// TODO: Move to a central config file later
const socialLinks = {
  github: "https://github.com/CodeHut-Market", // placeholder
  twitter: "https://twitter.com/your-handle",
  linkedin: "https://www.linkedin.com/company/your-company/",
};

export function SiteFooter() {
  return (
    <footer className="bg-gradient-to-b from-background to-muted/20 border-t border-primary/10 mt-0" role="contentinfo" aria-label="Site footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-0">
        <div className="flex items-center justify-between gap-2 text-[11px]">
          <div className="flex items-center gap-3">
            <Code2 className="h-3 w-3 text-primary" />
            <div className="flex items-center gap-2 text-[11px]">
              <Link href="/explore" className="text-muted-foreground hover:text-accent">Browse</Link>
              <span className="text-muted-foreground">·</span>
              <Link href="/docs" className="text-muted-foreground hover:text-accent">Docs</Link>
              <span className="text-muted-foreground">·</span>
              <Link href="/contact" className="text-muted-foreground hover:text-accent">Contact</Link>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-accent" aria-label="GitHub"><Github className="h-3 w-3" /></Link>
            <Link href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-accent" aria-label="Twitter"><Twitter className="h-3 w-3" /></Link>
            <Link href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-accent" aria-label="LinkedIn"><Linkedin className="h-3 w-3" /></Link>
          </div>

          <div className="text-[11px] text-muted-foreground">©2025 Marketplace</div>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;