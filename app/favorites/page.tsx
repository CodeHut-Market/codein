"use client";
import FavoriteButton from "@/components/FavoriteButton";
import SnippetCard from "@/components/SnippetCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CodeSnippet } from "@shared/api";
import { AnimatePresence, motion } from "framer-motion";
import { Grid, Heart, List, Search, SortAsc, SortDesc, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

interface FavoriteItem {
  id: string;
  created_at: string;
  snippet: CodeSnippet & {
    profiles: {
      username: string;
      first_name: string;
      last_name: string;
      avatar_url?: string;
    };
  };
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<CodeSnippet[]>([]);
  const [filteredFavorites, setFilteredFavorites] = useState<CodeSnippet[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "title" | "price" | "rating">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterLanguage, setFilterLanguage] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Demo favorites data - fallback for when API is not available
  const demoFavorites: CodeSnippet[] = [
    {
      id: "snippet-1",
      title: "React Login Form",
      description:
        "Simple and responsive login component using React and Tailwind CSS with form validation and loading states.",
      code: "import { useState } from 'react';...",
      price: 5,
      rating: 4.8,
      author: "JohnDoe",
      authorId: "user-1",
      tags: ["React", "Form", "Authentication", "Tailwind"],
      language: "JavaScript",
      framework: "React",
      downloads: 89,
      createdAt: "2024-01-20T12:00:00Z",
      updatedAt: "2024-01-20T12:00:00Z",
    },
    {
      id: "snippet-2",
      title: "Vue Dashboard Component",
      description:
        "Complete dashboard with charts and analytics using Vue 3 and Chart.js with real-time data updates.",
      code: "<template>...",
      price: 15,
      rating: 4.9,
      author: "SarahK",
      authorId: "user-2",
      tags: ["Vue", "Dashboard", "Charts", "Analytics"],
      language: "JavaScript",
      framework: "Vue",
      downloads: 45,
      createdAt: "2024-02-25T09:30:00Z",
      updatedAt: "2024-02-25T09:30:00Z",
    },
    {
      id: "snippet-5",
      title: "React Shopping Cart",
      description:
        "Full-featured shopping cart with local storage, animations, and quantity management using React hooks.",
      code: "import { useState, useEffect } from 'react';...",
      price: 12,
      rating: 4.8,
      author: "ReactPro",
      authorId: "user-5",
      tags: ["React", "E-commerce", "Cart", "LocalStorage", "Animation"],
      language: "JavaScript",
      framework: "React",
      downloads: 78,
      createdAt: "2024-02-15T11:45:00Z",
      updatedAt: "2024-02-15T11:45:00Z",
    },
  ];

  useEffect(() => {
    loadFavorites();
  }, []);

  useEffect(() => {
    filterAndSortFavorites();
  }, [favorites, searchQuery, sortBy, sortOrder, filterLanguage]);

  const loadFavorites = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/favorites');
      
      if (!response.ok) {
        if (response.status === 401) {
          // User not authenticated, use demo data
          const userFavorites = JSON.parse(localStorage.getItem("userFavorites") || "[]");
          const favoriteSnippets = demoFavorites.filter((snippet) => userFavorites.includes(snippet.id));
          setFavorites(favoriteSnippets);
          return;
        }
        
        throw new Error(`Failed to load favorites: ${response.status}`);
      }
      
      const data = await response.json();
      const formattedFavorites: CodeSnippet[] = data.favorites.map((fav: FavoriteItem) => ({
        id: fav.snippet.id,
        title: fav.snippet.title,
        description: fav.snippet.description,
        code: fav.snippet.code,
        language: fav.snippet.language,
        tags: fav.snippet.tags || [],
        author: fav.snippet.profiles?.username || 'Unknown',
        authorId: fav.snippet.author_id,
        downloads: fav.snippet.downloads || 0,
        likes: fav.snippet.likes || 0,
        rating: 4.5, // TODO: Calculate from actual ratings
        price: 0, // TODO: Get from actual pricing data
        framework: fav.snippet.language, // TODO: Map to actual framework
        createdAt: fav.snippet.created_at,
        updatedAt: fav.snippet.updated_at,
      }));
      
      setFavorites(formattedFavorites);
      
    } catch (error) {
      console.error("Failed to load favorites", error);
      setError(error instanceof Error ? error.message : "Failed to load favorites");
      
      // Fallback to local storage demo data
      const userFavorites = JSON.parse(localStorage.getItem("userFavorites") || "[]");
      const favoriteSnippets = demoFavorites.filter((snippet) => userFavorites.includes(snippet.id));
      setFavorites(favoriteSnippets);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortFavorites = () => {
    let filtered = [...favorites];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((s) =>
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.tags.some((tag) => tag.toLowerCase().includes(q)) ||
        s.author.toLowerCase().includes(q)
      );
    }
    if (filterLanguage !== "all") {
      filtered = filtered.filter((s) => s.language === filterLanguage);
    }
    filtered.sort((a, b) => {
      let cmp = 0;
      switch (sortBy) {
        case "title":
          cmp = a.title.localeCompare(b.title); break;
        case "price":
          cmp = a.price - b.price; break;
        case "rating":
          cmp = a.rating - b.rating; break;
        case "date":
        default:
          cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      return sortOrder === "asc" ? cmp : -cmp;
    });
    setFilteredFavorites(filtered);
  };

  const removeFavorite = async (snippetId: string) => {
    try {
      const response = await fetch(`/api/favorites?snippetId=${snippetId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        // Remove from state
        setFavorites((prev) => prev.filter((f) => f.id !== snippetId));
      } else {
        // Fallback to localStorage for demo
        setFavorites((prev) => prev.filter((f) => f.id !== snippetId));
        const userFavorites = JSON.parse(localStorage.getItem("userFavorites") || "[]");
        const updated = userFavorites.filter((id: string) => id !== snippetId);
        localStorage.setItem("userFavorites", JSON.stringify(updated));
      }
    } catch (error) {
      console.error('Failed to remove favorite:', error);
      // Fallback to localStorage
      setFavorites((prev) => prev.filter((f) => f.id !== snippetId));
      const userFavorites = JSON.parse(localStorage.getItem("userFavorites") || "[]");
      const updated = userFavorites.filter((id: string) => id !== snippetId);
      localStorage.setItem("userFavorites", JSON.stringify(updated));
    }
  };

  const removeSelectedFavorites = async () => {
    for (const snippetId of selectedItems) {
      await removeFavorite(snippetId);
    }
    setSelectedItems([]);
  };

  const toggleSelectItem = (id: string) => {
    setSelectedItems((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };
  const toggleSelectAll = () => {
    if (selectedItems.length === filteredFavorites.length) setSelectedItems([]);
    else setSelectedItems(filteredFavorites.map((f) => f.id));
  };

  const availableLanguages = Array.from(new Set(favorites.map((f) => f.language)));

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-red-500 fill-current" />
            <h1 className="text-2xl font-bold">My Favorites</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}> <Grid className="w-4 h-4" /> </Button>
            <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}> <List className="w-4 h-4" /> </Button>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-sm">{filteredFavorites.length} favorite{filteredFavorites.length !== 1 ? "s" : ""}</Badge>
            {selectedItems.length > 0 && (
              <Button variant="destructive" size="sm" onClick={removeSelectedFavorites} className="flex items-center gap-2">
                <Trash2 className="w-4 h-4" /> Remove Selected ({selectedItems.length})
              </Button>
            )}
          </div>
        </div>
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input placeholder="Search favorites..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
                </div>
              </div>
              <div className="flex gap-4">
                {/* Simplified selects for migration phase; reintroduce after shadcn setup in Next context */}
                <Button variant="outline" size="icon" onClick={() => setSortOrder((p) => p === "asc" ? "desc" : "asc")}>{sortOrder === "asc" ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}</Button>
              </div>
            </div>
            {filteredFavorites.length > 0 && (
              <div className="flex items-center gap-2 mt-4">
                <Checkbox checked={selectedItems.length === filteredFavorites.length} onCheckedChange={toggleSelectAll} id="select-all" />
                <label htmlFor="select-all" className="text-sm text-muted-foreground cursor-pointer">Select all</label>
              </div>
            )}
          </CardContent>
        </Card>
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
            <p className="text-muted-foreground mt-2">Loading favorites...</p>
          </div>
        ) : error ? (
          <Card className="text-center py-12">
            <CardContent>
              <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Error loading favorites</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={loadFavorites}>Try Again</Button>
            </CardContent>
          </Card>
        ) : filteredFavorites.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">{favorites.length === 0 ? "No favorites yet" : "No matching favorites"}</h3>
              <p className="text-muted-foreground mb-4">{favorites.length === 0 ? "Start by adding some code snippets to your favorites!" : "Try adjusting your search or filters to find what you're looking for."}</p>
              {favorites.length === 0 && (
                <Button onClick={() => (window.location.href = "/explore")}>Explore Snippets</Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <AnimatePresence>
            <div className={cn(viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4")}> 
              {filteredFavorites.map((snippet, i) => (
                <motion.div key={snippet.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ delay: i * 0.05 }} className="relative">
                  <div className="absolute top-3 left-3 z-10">
                    <Checkbox checked={selectedItems.includes(snippet.id)} onCheckedChange={() => toggleSelectItem(snippet.id)} className="bg-background border-2" />
                  </div>
                  <div className="absolute top-3 right-3 z-10">
                    <FavoriteButton snippetId={snippet.id} userId={userId} initialIsFavorited variant="ghost" className="bg-background/80 backdrop-blur-sm" />
                  </div>
                  <SnippetCard snippet={snippet} />
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
