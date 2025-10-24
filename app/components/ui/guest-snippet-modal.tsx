"use client";
import React from "react";
import { X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface GuestSnippetModalProps {
  open: boolean;
  onClose: () => void;
}

export const GuestSnippetModal: React.FC<GuestSnippetModalProps> = ({ open, onClose }) => {
  const router = useRouter();
  const [loading, setLoading] = React.useState<string | null>(null);
  if (!open) return null;
  const handleNavigate = async (path: string) => {
    setLoading(path);
    await router.replace(path);
    // Modal will unmount after navigation
  };
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-indigo-100 via-sky-100 to-cyan-100 dark:from-indigo-900 dark:via-sky-900 dark:to-cyan-900 rounded-2xl shadow-2xl p-8 w-full max-w-md relative border-2 border-indigo-300 dark:border-indigo-700">
        <button
          className="absolute top-4 right-4 text-gray-700 dark:text-cyan-200 hover:text-indigo-600 dark:hover:text-cyan-300 transition-colors"
          onClick={() => { onClose(); }}
          aria-label="Close"
        >
          <X size={24} />
        </button>
  <h2 className="text-2xl font-bold text-indigo-700 dark:text-cyan-200 mb-2">Sign in required</h2>
  <p className="text-base text-gray-900 dark:text-gray-100 mb-6">You should log in to view snippet details and access all features.</p>
        <div className="flex flex-col gap-3">
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg text-center transition-colors flex items-center justify-center"
            onClick={() => handleNavigate('/login')}
            disabled={!!loading}
          >
            {loading === '/login' ? <span className="loader mr-2" /> : null}Sign In
          </button>
          <button
            className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 rounded-lg text-center transition-colors flex items-center justify-center"
            onClick={() => handleNavigate('/signup')}
            disabled={!!loading}
          >
            {loading === '/signup' ? <span className="loader mr-2" /> : null}Sign Up
          </button>
          <button
            className="bg-white dark:bg-gray-800 border border-indigo-200 dark:border-cyan-700 text-indigo-700 dark:text-cyan-200 font-medium py-2 rounded-lg text-center transition-colors flex items-center justify-center"
            onClick={() => handleNavigate('/demo')}
            disabled={!!loading}
          >
            {loading === '/demo' ? <span className="loader mr-2" /> : null}Learn More
          </button>
        </div>
      </div>
      {/* Simple loader style */}
      <style>{`.loader { border: 2px solid #fff; border-top: 2px solid #6366f1; border-radius: 50%; width: 1em; height: 1em; animation: spin 0.8s linear infinite; display: inline-block; } @keyframes spin { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }`}</style>
    </div>
  );
};
