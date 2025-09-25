import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, Filter, X, SlidersHorizontal } from "lucide-react";
import { CodeSnippet, GetCodeSnippetsResponse } from "@shared/api";
import SnippetCard from "@/components/SnippetCard";

interface SearchFilters {
  query: string;
  languages: string[];
  frameworks: string[];
  tags: string[];
  minPrice: number;
  maxPrice: number;
  sortBy: string;
  sortOrder: string;
}

export default function AdvancedSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [availableFilters, setAvailableFilters] = useState<any>(null);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState<SearchFilters>({
    query: searchParams.get("query") || "",
    languages: searchParams.getAll("language"),
    frameworks: searchParams.getAll("framework"),
    tags: searchParams.getAll("tag"),
    minPrice: Number(searchParams.get("minPrice")) || 0,
    maxPrice: Number(searchParams.get("maxPrice")) || 100,
    sortBy: searchParams.get("sortBy") || "createdAt",
    sortOrder: searchParams.get("sortOrder") || "desc",
  });

  useEffect(() => {
    fetchAvailableFilters();
  }, []);

  useEffect(() => {
    performSearch();
  }, [searchParams]);

  const fetchAvailableFilters = async () => {
    try {
      const response = await fetch("/api/search/filters");
      if (response.ok) {
        const data = await response.json();
        setAvailableFilters(data);
      }
    } catch (error) {
      console.error("Error fetching filters:", error);
    }
  };

  const performSearch = async () => {
    setLoading(true);

    try {
      const queryParams = new URLSearchParams();

      // Add search parameters
      if (filters.query) queryParams.set("query", filters.query);
      if (filters.minPrice > 0)
        queryParams.set("minPrice", filters.minPrice.toString());
      if (filters.maxPrice < 100)
        queryParams.set("maxPrice", filters.maxPrice.toString());
      queryParams.set("sortBy", filters.sortBy);
      queryParams.set("sortOrder", filters.sortOrder);

      // Add arrays
      filters.languages.forEach((lang) => queryParams.append("language", lang));
      filters.frameworks.forEach((fw) => queryParams.append("framework", fw));
      filters.tags.forEach((tag) => queryParams.append("tag", tag));

      const response = await fetch(`/api/snippets?${queryParams.toString()}`);
      if (response.ok) {
        const data: GetCodeSnippetsResponse = await response.json();
        setSnippets(data.snippets);
        setTotalCount(data.total);
      }
    } catch (error) {
      console.error("Error performing search:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);

    // Update URL parameters
    const newSearchParams = new URLSearchParams();

    if (updatedFilters.query)
      newSearchParams.set("query", updatedFilters.query);
    if (updatedFilters.minPrice > 0)
      newSearchParams.set("minPrice", updatedFilters.minPrice.toString());
    if (updatedFilters.maxPrice < 100)
      newSearchParams.set("maxPrice", updatedFilters.maxPrice.toString());
    newSearchParams.set("sortBy", updatedFilters.sortBy);
    newSearchParams.set("sortOrder", updatedFilters.sortOrder);

    updatedFilters.languages.forEach((lang) =>
      newSearchParams.append("language", lang),
    );
    updatedFilters.frameworks.forEach((fw) =>
      newSearchParams.append("framework", fw),
    );
    updatedFilters.tags.forEach((tag) => newSearchParams.append("tag", tag));

    setSearchParams(newSearchParams);
  };

  const clearFilters = () => {
    const clearedFilters: SearchFilters = {
      query: "",
      languages: [],
      frameworks: [],
      tags: [],
      minPrice: 0,
      maxPrice: 100,
      sortBy: "createdAt",
      sortOrder: "desc",
    };
    setFilters(clearedFilters);
    setSearchParams(new URLSearchParams());
  };

  const removeFilter = (type: string, value: string) => {
    switch (type) {
      case "language":
        updateFilters({
          languages: filters.languages.filter((l) => l !== value),
        });
        break;
      case "framework":
        updateFilters({
          frameworks: filters.frameworks.filter((f) => f !== value),
        });
        break;
      case "tag":
        updateFilters({ tags: filters.tags.filter((t) => t !== value) });
        break;
    }
  };

  const activeFilterCount =
    filters.languages.length +
    filters.frameworks.length +
    filters.tags.length +
    (filters.minPrice > 0 ? 1 : 0) +
    (filters.maxPrice < 100 ? 1 : 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link
              to="/explore"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">
              Advanced Search
            </h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      Filters
                      {activeFilterCount > 0 && (
                        <Badge variant="secondary">{activeFilterCount}</Badge>
                      )}
                    </CardTitle>
                    {activeFilterCount > 0 && (
                      <Button variant="ghost" size="sm" onClick={clearFilters}>
                        Clear All
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Search Query */}
                  <div>
                    <Label htmlFor="search" className="text-sm font-medium">
                      Search Query
                    </Label>
                    <div className="mt-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="search"
                        value={filters.query}
                        onChange={(e) =>
                          updateFilters({ query: e.target.value })
                        }
                        placeholder="Search snippets..."
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Languages */}
                  {availableFilters && (
                    <div>
                      <Label className="text-sm font-medium">
                        Programming Languages
                      </Label>
                      <div className="mt-2 space-y-2">
                        {availableFilters.languages.map((language: string) => (
                          <div
                            key={language}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`lang-${language}`}
                              checked={filters.languages.includes(language)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  updateFilters({
                                    languages: [...filters.languages, language],
                                  });
                                } else {
                                  updateFilters({
                                    languages: filters.languages.filter(
                                      (l) => l !== language,
                                    ),
                                  });
                                }
                              }}
                            />
                            <Label
                              htmlFor={`lang-${language}`}
                              className="text-sm"
                            >
                              {language}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Separator />

                  {/* Frameworks */}
                  {availableFilters &&
                    availableFilters.frameworks.length > 0 && (
                      <>
                        <div>
                          <Label className="text-sm font-medium">
                            Frameworks
                          </Label>
                          <div className="mt-2 space-y-2">
                            {availableFilters.frameworks.map(
                              (framework: string) => (
                                <div
                                  key={framework}
                                  className="flex items-center space-x-2"
                                >
                                  <Checkbox
                                    id={`fw-${framework}`}
                                    checked={filters.frameworks.includes(
                                      framework,
                                    )}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        updateFilters({
                                          frameworks: [
                                            ...filters.frameworks,
                                            framework,
                                          ],
                                        });
                                      } else {
                                        updateFilters({
                                          frameworks: filters.frameworks.filter(
                                            (f) => f !== framework,
                                          ),
                                        });
                                      }
                                    }}
                                  />
                                  <Label
                                    htmlFor={`fw-${framework}`}
                                    className="text-sm"
                                  >
                                    {framework}
                                  </Label>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                        <Separator />
                      </>
                    )}

                  {/* Price Range */}
                  <div>
                    <Label className="text-sm font-medium">Price Range</Label>
                    <div className="mt-2 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="minPrice" className="text-xs">
                            Min
                          </Label>
                          <Input
                            id="minPrice"
                            type="number"
                            min="0"
                            value={filters.minPrice}
                            onChange={(e) =>
                              updateFilters({
                                minPrice: Number(e.target.value),
                              })
                            }
                            placeholder="0"
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <Label htmlFor="maxPrice" className="text-xs">
                            Max
                          </Label>
                          <Input
                            id="maxPrice"
                            type="number"
                            min="0"
                            value={filters.maxPrice}
                            onChange={(e) =>
                              updateFilters({
                                maxPrice: Number(e.target.value),
                              })
                            }
                            placeholder="100"
                            className="text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Sort Options */}
                  <div>
                    <Label className="text-sm font-medium">Sort By</Label>
                    <div className="mt-2 space-y-2">
                      <Select
                        value={filters.sortBy}
                        onValueChange={(value) =>
                          updateFilters({ sortBy: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="createdAt">
                            Date Created
                          </SelectItem>
                          <SelectItem value="rating">Rating</SelectItem>
                          <SelectItem value="downloads">Downloads</SelectItem>
                          <SelectItem value="price">Price</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select
                        value={filters.sortOrder}
                        onValueChange={(value) =>
                          updateFilters({ sortOrder: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="desc">Descending</SelectItem>
                          <SelectItem value="asc">Ascending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {/* Active Filters */}
            {activeFilterCount > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-gray-700">
                    Active filters:
                  </span>
                  {filters.languages.map((lang) => (
                    <Badge key={lang} variant="secondary" className="gap-1">
                      {lang}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => removeFilter("language", lang)}
                      />
                    </Badge>
                  ))}
                  {filters.frameworks.map((fw) => (
                    <Badge key={fw} variant="secondary" className="gap-1">
                      {fw}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => removeFilter("framework", fw)}
                      />
                    </Badge>
                  ))}
                  {filters.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => removeFilter("tag", tag)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Search Results
                </h2>
                <p className="text-gray-600">
                  {loading
                    ? "Searching..."
                    : `${totalCount} snippet${totalCount !== 1 ? "s" : ""} found`}
                </p>
              </div>

              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>

            {/* Results Grid */}
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                  <p className="text-gray-600">Searching snippets...</p>
                </div>
              </div>
            ) : snippets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {snippets.map((snippet) => (
                  <SnippetCard
                    key={snippet.id}
                    snippet={snippet}
                    onPurchaseComplete={performSearch}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No results found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search terms or filters to find what you're
                  looking for.
                </p>
                <Button onClick={clearFilters} variant="outline">
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
