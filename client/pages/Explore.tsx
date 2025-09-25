import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, Search, Star, Filter } from "lucide-react";
import { useEffect, useState } from "react";
import { CodeSnippet, GetCodeSnippetsResponse } from "@shared/api";

import SnippetCard from "@/components/SnippetCard";
import Logo from "@/components/Logo";

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
      <div className="min-h-screen bg-background">
        <header className="bg-background border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link
                  to="/"
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading snippets...</p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">CodeHut</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Explore Code Snippets
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            {searchParams.get("query")
              ? `Search results for "${searchParams.get("query")}" (${totalCount} found)`
              : "Discover quality code snippets from our community"}
          </p>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search code snippets, tools, components..."
                  className="pl-10 pr-4 py-3 w-full rounded-lg border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                />
              </div>
            </form>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>
        </div>

        {/* Code Snippets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {snippets.length > 0 ? (
            snippets.map((snippet) => (
              <SnippetCard
                key={snippet.id}
                snippet={snippet}
                onPurchaseComplete={fetchSnippets}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">No code snippets found.</p>
              {searchParams.get("query") && (
                <p className="text-gray-400 mt-2">
                  Try adjusting your search terms.
                </p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
