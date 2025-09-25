import { useState, useEffect } from "react";
import {
  Heart,
  Search,
  Filter,
  Grid,
  List,
  SortAsc,
  SortDesc,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Logo from "@/components/Logo";
import SnippetCard from "@/components/SnippetCard";
import FavoriteButton from "@/components/FavoriteButton";
import { CodeSnippet } from "@shared/api";
import { useNotifications } from "@/hooks/useNotifications";

interface FavoritesPageProps {
  userId?: string;
}

export default function FavoritesPage({
  userId = "demo-user",
}: FavoritesPageProps) {
  const [favorites, setFavorites] = useState<CodeSnippet[]>([]);
  const [filteredFavorites, setFilteredFavorites] = useState<CodeSnippet[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "title" | "price" | "rating">(
    "date",
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterLanguage, setFilterLanguage] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError } = useNotifications();

  // Demo favorites data
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
  }, [userId]);

  useEffect(() => {
    filterAndSortFavorites();
  }, [favorites, searchQuery, sortBy, sortOrder, filterLanguage]);

  const loadFavorites = async () => {
    setLoading(true);
    try {
      // In a real app, fetch from API
      // const response = await fetch(`/api/favorites?userId=${userId}`);
      // const data = await response.json();

      // Demo: load from localStorage
      const userFavorites = JSON.parse(
        localStorage.getItem("userFavorites") || "[]",
      );
      const favoriteSnippets = demoFavorites.filter((snippet) =>
        userFavorites.includes(snippet.id),
      );

      setFavorites(favoriteSnippets);
    } catch (error) {
      showError({
        title: "Failed to Load Favorites",
        description:
          "There was an error loading your favorites. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortFavorites = () => {
    let filtered = [...favorites];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (snippet) =>
          snippet.title.toLowerCase().includes(query) ||
          snippet.description.toLowerCase().includes(query) ||
          snippet.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          snippet.author.toLowerCase().includes(query),
      );
    }

    // Apply language filter
    if (filterLanguage !== "all") {
      filtered = filtered.filter(
        (snippet) => snippet.language === filterLanguage,
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "price":
          comparison = a.price - b.price;
          break;
        case "rating":
          comparison = a.rating - b.rating;
          break;
        case "date":
        default:
          comparison =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    setFilteredFavorites(filtered);
  };

  const removeFavorite = async (snippetId: string) => {
    try {
      setFavorites((prev) => prev.filter((fav) => fav.id !== snippetId));

      // Update localStorage
      const userFavorites = JSON.parse(
        localStorage.getItem("userFavorites") || "[]",
      );
      const updatedFavorites = userFavorites.filter(
        (id: string) => id !== snippetId,
      );
      localStorage.setItem("userFavorites", JSON.stringify(updatedFavorites));

      showSuccess({
        title: "Removed from Favorites",
        description: "Snippet removed from your favorites list.",
        duration: 3000,
      });
    } catch (error) {
      showError({
        title: "Failed to Remove Favorite",
        description: "There was an error removing the snippet from favorites.",
      });
    }
  };

  const removeSelectedFavorites = async () => {
    try {
      setFavorites((prev) =>
        prev.filter((fav) => !selectedItems.includes(fav.id)),
      );

      // Update localStorage
      const userFavorites = JSON.parse(
        localStorage.getItem("userFavorites") || "[]",
      );
      const updatedFavorites = userFavorites.filter(
        (id: string) => !selectedItems.includes(id),
      );
      localStorage.setItem("userFavorites", JSON.stringify(updatedFavorites));

      setSelectedItems([]);

      showSuccess({
        title: "Favorites Removed",
        description: `Removed ${selectedItems.length} snippet${selectedItems.length > 1 ? "s" : ""} from favorites.`,
        duration: 3000,
      });
    } catch (error) {
      showError({
        title: "Failed to Remove Favorites",
        description: "There was an error removing the selected snippets.",
      });
    }
  };

  const toggleSelectItem = (snippetId: string) => {
    setSelectedItems((prev) =>
      prev.includes(snippetId)
        ? prev.filter((id) => id !== snippetId)
        : [...prev, snippetId],
    );
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === filteredFavorites.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredFavorites.map((fav) => fav.id));
    }
  };

  const availableLanguages = Array.from(
    new Set(favorites.map((fav) => fav.language)),
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <a href="https://w2sp61d0-8081.inc1.devtunnels.ms/" className="inline-flex items-center">
                <Logo />
              </a>
              <div className="flex items-center gap-2">
                <Heart className="w-6 h-6 text-red-500 fill-current" />
                <h1 className="text-2xl font-bold">My Favorites</h1>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats and Actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-sm">
              {filteredFavorites.length} favorite
              {filteredFavorites.length !== 1 ? "s" : ""}
            </Badge>
            {selectedItems.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={removeSelectedFavorites}
                className="flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Remove Selected ({selectedItems.length})
              </Button>
            )}
          </div>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search favorites..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Select
                  value={filterLanguage}
                  onValueChange={setFilterLanguage}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Languages</SelectItem>
                    {availableLanguages.map((lang) => (
                      <SelectItem key={lang} value={lang}>
                        {lang}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={sortBy}
                  onValueChange={(value) => setSortBy(value as any)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date Added</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
                  }
                >
                  {sortOrder === "asc" ? (
                    <SortAsc className="w-4 h-4" />
                  ) : (
                    <SortDesc className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            {filteredFavorites.length > 0 && (
              <div className="flex items-center gap-2 mt-4">
                <Checkbox
                  checked={selectedItems.length === filteredFavorites.length}
                  onCheckedChange={toggleSelectAll}
                  id="select-all"
                />
                <label
                  htmlFor="select-all"
                  className="text-sm text-muted-foreground cursor-pointer"
                >
                  Select all
                </label>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Favorites Grid/List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-2">Loading favorites...</p>
          </div>
        ) : filteredFavorites.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {favorites.length === 0
                  ? "No favorites yet"
                  : "No matching favorites"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {favorites.length === 0
                  ? "Start by adding some code snippets to your favorites!"
                  : "Try adjusting your search or filters to find what you're looking for."}
              </p>
              {favorites.length === 0 && (
                <Button onClick={() => (window.location.href = "/explore")}>
                  Explore Snippets
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <AnimatePresence>
            <div
              className={cn(
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4",
              )}
            >
              {filteredFavorites.map((snippet, index) => (
                <motion.div
                  key={snippet.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="absolute top-3 left-3 z-10">
                    <Checkbox
                      checked={selectedItems.includes(snippet.id)}
                      onCheckedChange={() => toggleSelectItem(snippet.id)}
                      className="bg-background border-2"
                    />
                  </div>

                  <div className="absolute top-3 right-3 z-10">
                    <FavoriteButton
                      snippetId={snippet.id}
                      userId={userId}
                      initialIsFavorited={true}
                      variant="ghost"
                      className="bg-background/80 backdrop-blur-sm"
                    />
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
