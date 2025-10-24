"use client";
import Link from 'next/link';
import React, { useState, useEffect } from 'react';

export default function LandingPage(){
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    import("@/lib/supabaseClient").then(({ supabase }) => {
      supabase.auth.getUser().then(({ data }) => {
        setUser(data?.user);
      });
    });
  }, []);

  if (user) {
    const LoggedInHome = require("./home-loggedin").default;
    return <LoggedInHome />;
  }
  // ...existing code...
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(80,120,255,0.15),transparent_70%)]" />
      <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-sky-400 to-cyan-300 bg-clip-text text-transparent drop-shadow">
        Build. Share. Ship.
      </h1>
      <p className="mt-6 max-w-2xl text-base md:text-lg text-foreground/70 leading-relaxed">
        Organize, share, and discover code snippets with developers worldwide. 
        Build your personal code library and collaborate with the community.
      </p>
      <div className="mt-10 flex flex-col sm:flex-row gap-4">
        <Link href="/signup" className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-6 py-3 font-medium text-white shadow hover:bg-indigo-500 transition-colors">
          Get Started Free
        </Link>
        <Link href="/demo" className="inline-flex items-center justify-center rounded-md border border-white/20 backdrop-blur px-6 py-3 font-medium text-foreground hover:bg-white/10 transition-colors">
          View Demo
        </Link>
      </div>
      <div className="mt-4 text-sm text-foreground/60">
        <Link href="/ui-library" className="hover:text-foreground transition-colors">
          UI Library
        </Link>{" "}
        •{" "}
        <Link href="/login" className="hover:text-foreground transition-colors">
          Already have an account? Sign in
        </Link>
      </div>
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
        <Feature title="Code Organization" desc="Organize your code snippets with tags, categories, and advanced search." />
        <Feature title="Team Collaboration" desc="Share snippets with your team, manage permissions, and track usage." />
        <Feature title="Discover & Learn" desc="Browse community snippets and discover new coding techniques." />
      </div>
      <footer className="mt-24 text-xs text-foreground/40">
        MIT Licensed • {new Date().getFullYear()}
      </footer>
    </main>
  );
}

function Feature({ title, desc }: { title: string; desc: string }){
  return (
    <div className="p-6 rounded-xl shadow-xl border-0 bg-gradient-to-br from-purple-100 via-blue-100 to-green-100 dark:from-purple-900 dark:via-blue-900 dark:to-green-900 hover:scale-[1.02] transition-transform duration-300">
      <h3 className="font-semibold text-lg mb-2 bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 bg-clip-text text-transparent drop-shadow-lg">{title}</h3>
      <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">{desc}</p>
    </div>
  );
}