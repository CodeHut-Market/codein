import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CodeSnippet } from "@shared/api";
import { ArrowLeft, Filter, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import Logo from "@/components/Logo";
import SnippetCard from "@/components/SnippetCard";

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("query") || "",
  );
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchSnippets();
  }, [searchParams]);

  const fetchSnippets = async () => {
    try {
      setLoading(true);

      const queryParams = new URLSearchParams();
      const query = searchParams.get("query");
      if (query) queryParams.set("query", query);

      const response = await fetch(`/api/snippets?${queryParams.toString()}`);

      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        console.error(
          "Failed to fetch snippets:",
          response.status,
          response.statusText,
        );
        setSnippets([]);
        setTotalCount(0);
        return;
      }

      const data = await response.json();

      // Handle both success and error responses
      if (data.snippets && Array.isArray(data.snippets)) {
        setSnippets(data.snippets);
        setTotalCount(data.total || data.snippets.length);
      } else {
        console.error("Invalid response format:", data);
        setSnippets([]);
        setTotalCount(0);
      }
    } catch (error) {
      console.error("Error fetching snippets:", error);
      setSnippets([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const newSearchParams = new URLSearchParams(searchParams);

    if (searchQuery.trim()) {
      newSearchParams.set("query", searchQuery.trim());
    } else {
      newSearchParams.delete("query");
    }

    setSearchParams(newSearchParams);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <header className="bg-background/80 backdrop-blur-sm border-b border-border/50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link
                  to="/"
                  className="flex items-center gap-2 text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Link>
                <a href="https://w2sp61d0-8081.inc1.devtunnels.ms/" className="inline-flex items-center">
                  <Logo size="md" />
                </a>
              </div>
            </div>
          </div>
        </header>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-cyan-200 border-t-cyan-500 dark:border-slate-600 dark:border-t-cyan-400 mx-auto mb-4 shadow-lg"></div>
            <p className="text-gray-600 dark:text-gray-300 font-medium">Loading awesome snippets...</p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-sm border-b border-border/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="flex items-center gap-2 text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300 transition-colors font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Link>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">CodeHut</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-cyan-600 to-teal-600 dark:from-indigo-400 dark:via-cyan-400 dark:to-teal-400 bg-clip-text text-transparent mb-4">
            Explore Code Snippets
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            {searchParams.get("query")
              ? `Search results for "${searchParams.get("query")}" (${totalCount} found)`
              : "Discover quality code snippets from our community"}
          </p>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-500 w-5 h-5" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search code snippets, tools, components..."
                  className="pl-12 pr-4 py-4 w-full rounded-xl border-2 border-gray-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 dark:border-gray-600 dark:focus:border-cyan-500 dark:focus:ring-cyan-800/20 text-lg placeholder:text-gray-400 shadow-lg hover:shadow-xl transition-all duration-200"
                />
              </div>
            </form>
            <Button variant="outline" className="flex items-center gap-2 border-2 border-indigo-200 hover:border-indigo-300 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-700 dark:text-indigo-300 dark:hover:bg-indigo-900/20 px-6 py-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>

          {/* Results Summary */}
          {totalCount > 0 && (
            <div className="mb-6">
              <Badge className="bg-gradient-to-r from-emerald-100 to-cyan-100 dark:from-emerald-900/20 dark:to-cyan-900/20 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 px-3 py-1">
                {totalCount} snippets found
              </Badge>
            </div>
          )}
        </div>

        {/* Code Snippets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {snippets.length > 0 ? (
            snippets.map((snippet) => (
              <SnippetCard
                key={snippet.id}
                snippet={snippet}
                onPurchaseComplete={fetchSnippets}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-cyan-100 to-indigo-100 dark:from-cyan-900/20 dark:to-indigo-900/20 rounded-full flex items-center justify-center">
                  <Search className="w-10 h-10 text-cyan-600 dark:text-cyan-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
                  No code snippets found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  {searchParams.get("query") ? (
                    <>
                      No results for "<span className="font-medium text-cyan-600 dark:text-cyan-400">{searchParams.get("query")}</span>".
                      <br />
                      Try different keywords or browse all snippets.
                    </>
                  ) : (
                    "Start exploring our amazing collection of code snippets"
                  )}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  {searchParams.get("query") && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchQuery("");
                        setSearchParams(new URLSearchParams());
                      }}
                      className="border-2 border-cyan-200 hover:border-cyan-300 text-cyan-700 hover:bg-cyan-50 dark:border-cyan-700 dark:text-cyan-300 dark:hover:bg-cyan-900/20"
                    >
                      Clear Search
                    </Button>
                  )}
                  <Button asChild className="bg-gradient-to-r from-indigo-500 to-cyan-600 hover:from-indigo-600 hover:to-cyan-700 text-white">
                    <Link to="/upload">Upload a Snippet</Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
