"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const options = [
    { key: "light", label: "Light" },
    { key: "dark", label: "Dark" },
    { key: "system", label: "System" },
  ];
    // The old ThemeSwitcher has been removed
}
import { supabase } from "@/lib/supabaseClient";

import { User } from "@supabase/supabase-js";
import { CodeSnippet } from "@shared/api";

function QuickAction({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href} className="flex flex-col items-center justify-center p-4 rounded-xl bg-gradient-to-br from-indigo-500/20 via-sky-400/10 to-cyan-300/10 hover:bg-indigo-500/30 transition-colors shadow-md">
      <span className="mb-2 text-2xl">{icon}</span>
      <span className="font-medium text-indigo-700 dark:text-indigo-300">{label}</span>
    </Link>
  );
}

export default function LoggedInHome() {
  const [user, setUser] = useState<User | null>(null);
  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user);
    });
    fetch("/api/snippets/explore?limit=2")
      .then((res) => res.json())
      .then((data) => setSnippets(data.snippets || []));
  }, []);

  return (
    <>
      <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(80,120,255,0.10),transparent_70%)]" />
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-sky-400 to-cyan-300 bg-clip-text text-transparent drop-shadow mb-2">
          Welcome, {user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Developer"}!
        </h1>
        <p className="mt-2 max-w-xl text-base md:text-lg text-foreground/70 leading-relaxed">
          Your personalized dashboard. Explore, upload, and manage your code snippets with ease.
        </p>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-2xl">
          <QuickAction href="/upload" icon={<span>🚀</span>} label="Upload Snippet" />
          <QuickAction href="/profile" icon={<span>👤</span>} label="View Profile" />
          <QuickAction href="/explore" icon={<span>🔍</span>} label="Explore More" />
        </div>
        <div className="mt-12 w-full max-w-3xl">
          <h2 className="text-2xl font-bold mb-4 text-indigo-600 dark:text-indigo-300">Latest Uploaded Snippets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {snippets.length === 0 ? (
              <div className="col-span-2 text-muted-foreground">No snippets found.</div>
            ) : (
              snippets.map((snippet) => (
                <Link key={snippet.id} href={`/snippet/${snippet.id}`} className="block p-4 rounded-lg border border-indigo-200 bg-white/60 dark:bg-black/30 shadow hover:shadow-lg transition-all">
                  <h3 className="font-semibold text-lg mb-1 text-indigo-700 dark:text-indigo-200">{snippet.title}</h3>
                  <p className="text-sm text-foreground/70 mb-2">{snippet.description}</p>
                  <span className="text-xs text-indigo-500">{snippet.language}</span>
                </Link>
              ))
            )}
          </div>
        </div>
        <div className="mt-16 flex flex-wrap justify-center gap-4 text-base">
          <Link href="/explore" className="text-indigo-600 hover:underline">Explore</Link>
          <Link href="/upload" className="text-indigo-600 hover:underline">Upload</Link>
          <Link href="/profile" className="text-indigo-600 hover:underline">Profile</Link>
          <Link href="/favorites" className="text-indigo-600 hover:underline">Favorites</Link>
          <Link href="/ui-library" className="text-indigo-600 hover:underline">UI Library</Link>
        </div>
        <footer className="mt-24 text-xs text-foreground/40">
          Interactive Home • {new Date().getFullYear()}
        </footer>
      </main>
    </>
  );
}