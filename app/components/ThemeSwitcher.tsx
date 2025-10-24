"use client";
import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!theme) setTheme("system");
  }, []);
  const options = [
    { key: "light", label: "Light" },
    { key: "dark", label: "Dark" },
    { key: "system", label: "System" },
  ];
  return (
    <div className="fixed top-6 right-6 z-50">
      <div className="relative">
        <button
          className="p-3 rounded-full bg-gradient-to-br from-indigo-500 via-sky-400 to-cyan-300 shadow hover:scale-105 transition-transform"
          onClick={() => setOpen((v) => !v)}
          aria-label="Theme switcher"
          type="button"
        >
          <span role="img" aria-label="theme">🌓</span>
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-black/90 rounded-xl shadow-lg border border-indigo-200 dark:border-indigo-700 py-2 flex flex-col">
            {options.map(opt => (
              <button
                key={opt.key}
                className={`px-4 py-2 text-left text-sm font-medium rounded-lg transition-colors ${theme === opt.key ? "bg-indigo-100 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-200" : "hover:bg-indigo-50 dark:hover:bg-indigo-900 text-foreground"}`}
                onClick={() => { setTheme(opt.key); setOpen(false); }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}