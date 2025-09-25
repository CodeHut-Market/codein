"use client"

import { useState } from "react"
import { Search, Filter, X, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"

interface SearchFilters {
  query: string
  language: string
  category: string
  priceRange: [number, number]
  rating: number
  sortBy: string
}

const PROGRAMMING_LANGUAGES = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C++",
  "C#",
  "PHP",
  "Ruby",
  "Go",
  "Rust",
  "Swift",
  "Kotlin",
]

const CATEGORIES = [
  "Web Components",
  "Mobile Apps",
  "Desktop Apps",
  "APIs",
  "Databases",
  "DevOps",
  "Machine Learning",
  "Games",
  "Utilities",
]

const SORT_OPTIONS = [
  { value: "relevance", label: "Most Relevant" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "newest", label: "Newest First" },
  { value: "popular", label: "Most Popular" },
]

export function SearchFilterBar() {
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    language: "all",
    category: "all",
    priceRange: [0, 500],
    rating: 0,
    sortBy: "relevance",
  })

  const [showFilters, setShowFilters] = useState(false)

  const handleSearch = () => {
    console.log("Searching with filters:", filters)
    // Implement search logic here
  }

  const handleReset = () => {
    setFilters({
      query: "",
      language: "all",
      category: "all",
      priceRange: [0, 500],
      rating: 0,
      sortBy: "relevance",
    })
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.language !== "all") count++
    if (filters.category !== "all") count++
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 500) count++
    if (filters.rating > 0) count++
    return count
  }

  const renderStars = (rating: number, onRatingChange: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button key={star} onClick={() => onRatingChange(star)} className="transition-colors hover:scale-110">
            <Star className={`h-5 w-5 ${star <= rating ? "fill-accent text-accent" : "text-muted-foreground"}`} />
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="bg-card border rounded-xl p-6 shadow-sm">
      <div className="space-y-4">
        {/* Main Search Bar */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search code snippets, templates, projects..."
              value={filters.query}
              onChange={(e) => setFilters({ ...filters, query: e.target.value })}
              className="pl-10 h-12 text-base"
            />
          </div>

          <Popover open={showFilters} onOpenChange={setShowFilters}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-12 px-4 relative bg-transparent">
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {getActiveFiltersCount() > 0 && (
                  <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {getActiveFiltersCount()}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Filters</h3>
                  <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Programming Language Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Programming Language</label>
                  <Select
                    value={filters.language}
                    onValueChange={(value) => setFilters({ ...filters, language: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Languages</SelectItem>
                      {PROGRAMMING_LANGUAGES.map((lang) => (
                        <SelectItem key={lang} value={lang.toLowerCase()}>
                          {lang}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Category Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select
                    value={filters.category}
                    onValueChange={(value) => setFilters({ ...filters, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category.toLowerCase()}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range Filter */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Price Range</label>
                  <div className="px-2">
                    <Slider
                      value={filters.priceRange}
                      onValueChange={(value) => setFilters({ ...filters, priceRange: value as [number, number] })}
                      max={500}
                      min={0}
                      step={10}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>${filters.priceRange[0]}</span>
                      <span>${filters.priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* Rating Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Minimum Rating</label>
                  {renderStars(filters.rating, (rating) => setFilters({ ...filters, rating }))}
                </div>

                {/* Filter Actions */}
                <div className="flex gap-2 pt-2">
                  <Button onClick={handleReset} variant="outline" size="sm" className="flex-1 bg-transparent">
                    Reset
                  </Button>
                  <Button
                    onClick={() => {
                      handleSearch()
                      setShowFilters(false)
                    }}
                    size="sm"
                    className="flex-1"
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Button onClick={handleSearch} className="h-12 px-6">
            Search
          </Button>
        </div>

        {/* Sort and Quick Filters */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <Select value={filters.sortBy} onValueChange={(value) => setFilters({ ...filters, sortBy: value })}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters Display */}
          {getActiveFiltersCount() > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              <div className="flex gap-1">
                {filters.language !== "all" && (
                  <Badge variant="secondary" className="text-xs">
                    {filters.language}
                    <button
                      onClick={() => setFilters({ ...filters, language: "all" })}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {filters.category !== "all" && (
                  <Badge variant="secondary" className="text-xs">
                    {filters.category}
                    <button
                      onClick={() => setFilters({ ...filters, category: "all" })}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {(filters.priceRange[0] > 0 || filters.priceRange[1] < 500) && (
                  <Badge variant="secondary" className="text-xs">
                    ${filters.priceRange[0]}-${filters.priceRange[1]}
                    <button
                      onClick={() => setFilters({ ...filters, priceRange: [0, 500] })}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {filters.rating > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {filters.rating}+ stars
                    <button onClick={() => setFilters({ ...filters, rating: 0 })} className="ml-1 hover:text-red-500">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
