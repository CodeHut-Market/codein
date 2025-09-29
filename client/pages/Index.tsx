import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CodeSnippet } from "@shared/api";
import { Search, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import BackgroundGl from "@/components/BackgroundGl";
import Logo from "@/components/Logo";
import NotificationCenter from "@/components/NotificationCenter";
import SnippetCard from "@/components/SnippetCard";
import ThemeToggle from "@/components/ThemeToggle";

export default function Index() {
  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchPopularSnippets();
  }, []);

  const fetchPopularSnippets = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/snippets/popular?limit=6");

      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        console.error(
          "Failed to fetch popular snippets:",
          response.status,
          response.statusText,
        );
        setSnippets([]);
        return;
      }

      const data = await response.json();

      // Handle both success and error responses
      if (data.snippets && Array.isArray(data.snippets)) {
        setSnippets(data.snippets);
      } else {
        console.error("Invalid response format:", data);
        setSnippets([]);
      }
    } catch (error) {
      console.error("Error fetching snippets:", error);
      setSnippets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Redirect to explore page with search query
      window.location.href = `/explore?query=${encodeURIComponent(searchQuery)}`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-violet-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-200 border-t-emerald-500 mx-auto mb-4 shadow-lg"></div>
          <p className="text-gray-600 dark:text-gray-300 font-medium">Loading popular snippets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-violet-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-sm border-b border-border/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <a href="https://w2sp61d0-8081.inc1.devtunnels.ms/" className="inline-flex items-center">
                <Logo size="md" />
              </a>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <NotificationCenter />
              <Button variant="ghost" asChild className="hover:bg-gradient-to-r hover:from-cyan-50 hover:to-violet-50 dark:hover:from-cyan-900/20 dark:hover:to-violet-900/20">
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild className="bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700 text-white shadow-lg">
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="bg-gradient-to-r from-emerald-600 via-cyan-600 to-violet-600 bg-clip-text text-transparent">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Code Snippets Marketplace
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 mt-4 max-w-2xl mx-auto">
            Buy and Sell Quality Code Snippets Instantly
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              asChild
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <Link to="/upload">Upload Your Code</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-2 border-violet-200 hover:border-violet-300 text-violet-700 hover:bg-violet-50 dark:border-violet-700 dark:text-violet-300 dark:hover:bg-violet-900/20 px-8 py-4 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200"
            >
              <Link to="/explore">Browse Snippets</Link>
            </Button>
          </div>

          {/* Background GL */}
          <BackgroundGl />

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-500 w-5 h-5" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search code snippets, tools, components..."
                className="pl-12 pr-4 py-4 w-full rounded-xl border-2 border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 dark:border-gray-600 dark:focus:border-emerald-500 dark:focus:ring-emerald-800/20 text-lg placeholder:text-gray-400 shadow-lg hover:shadow-xl transition-all duration-200"
              />
            </form>
          </div>
        </div>

        {/* Popular Code Snippets */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-gray-100 dark:via-gray-300 dark:to-gray-100 bg-clip-text text-transparent mb-3">
              Popular Code Snippets
            </h2>
            <div className="flex items-center justify-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-amber-400 fill-current" />
              ))}
              <span className="ml-2 text-amber-600 dark:text-amber-400 font-medium">Trending Now</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {snippets && snippets.length > 0 ? (
              snippets.map((snippet) => (
                <SnippetCard
                  key={snippet.id}
                  snippet={snippet}
                  onPurchaseComplete={fetchPopularSnippets}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-emerald-100 to-cyan-100 dark:from-emerald-900/20 dark:to-cyan-900/20 rounded-full flex items-center justify-center">
                    <Search className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 text-lg">
                    {loading
                      ? "Loading amazing code snippets..."
                      : "No popular snippets available at the moment."}
                  </p>
                  <Button asChild variant="outline" className="border-2 border-cyan-200 hover:border-cyan-300 text-cyan-700 hover:bg-cyan-50 dark:border-cyan-700 dark:text-cyan-300 dark:hover:bg-cyan-900/20">
                    <Link to="/explore">Browse All Snippets</Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Component Showcase Section */}
      <section className="bg-muted/30 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">Enhanced UI Components</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Experience our modernized component library with improved accessibility and design
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="bg-background p-6 rounded-lg shadow-xs border">
              <h3 className="font-semibold mb-3 text-foreground">Enhanced Buttons</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Buttons with improved focus states and shadow utilities
              </p>
              <div className="space-y-2">
                <Button className="w-full">
                  <Star className="w-4 h-4 mr-2" />
                  Primary Action
                </Button>
                <Button variant="outline" className="w-full">
                  Secondary Action  
                </Button>
              </div>
            </div>

            <div className="bg-background p-6 rounded-lg shadow-xs border">
              <h3 className="font-semibold mb-3 text-foreground">Modern Badges</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Enhanced badges with better accessibility and styling
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="default">TypeScript</Badge>
                <Badge variant="secondary">React</Badge>
                <Badge variant="outline">Popular</Badge>
              </div>
            </div>

            <div className="bg-background p-6 rounded-lg shadow-xs border">
              <h3 className="font-semibold mb-3 text-foreground">Improved Inputs</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Better focus handling and file input support
              </p>
              <div className="space-y-2">
                <Input placeholder="Search components..." />
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input className="pl-10" placeholder="With icon..." />
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <Link to="/explore">
              <Button size="lg" variant="outline">
                Explore All Components
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500 text-sm">
            © 2025 CodeHut. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
