"use client"

import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover"
import { Calendar } from "../ui/calendar"
import { 
  Search, 
  Filter, 
  Calendar as CalendarIcon,
  X,
  Eye,
  Heart,
  Download,
  Code2,
  Globe,
  Lock
} from 'lucide-react'
import { format } from 'date-fns'
import Link from 'next/link'

interface Snippet {
  id: string
  title: string
  description: string
  language: string
  visibility: 'public' | 'private'
  tags: string[]
  views: number
  likes: number
  downloads: number
  createdAt: Date
  updatedAt: Date
}

interface SearchFiltersProps {
  snippets: Snippet[]
  onFilteredResults: (results: Snippet[]) => void
}

interface FilterState {
  search: string
  language: string
  visibility: string
  dateRange: {
    from: Date | undefined
    to: Date | undefined
  }
  tags: string[]
}

const LANGUAGES = [
  'JavaScript',
  'TypeScript',
  'Python',
  'Java',
  'C++',
  'C#',
  'Go',
  'Rust',
  'PHP',
  'Ruby',
  'Swift',
  'Kotlin',
  'HTML',
  'CSS',
  'SQL',
  'Shell',
  'Other'
]

export default function SearchAndFilters({ snippets, onFilteredResults }: SearchFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    language: '',
    visibility: '',
    dateRange: {
      from: undefined,
      to: undefined
    },
    tags: []
  })
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [searchResults, setSearchResults] = useState<Snippet[]>(snippets)

  // Get all unique tags from snippets
  const availableTags = useMemo(() => {
    const tags = new Set<string>()
    snippets.forEach(snippet => {
      snippet.tags.forEach(tag => tags.add(tag))
    })
    return Array.from(tags).sort()
  }, [snippets])

  // Filter snippets based on current filter state
  const filteredSnippets = useMemo(() => {
    let results = snippets

    // Search filter
    if (filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase()
      results = results.filter(snippet => 
        snippet.title.toLowerCase().includes(searchTerm) ||
        snippet.description.toLowerCase().includes(searchTerm) ||
        snippet.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      )
    }

    // Language filter
    if (filters.language) {
      results = results.filter(snippet => snippet.language === filters.language)
    }

    // Visibility filter
    if (filters.visibility) {
      results = results.filter(snippet => snippet.visibility === filters.visibility)
    }

    // Date range filter
    if (filters.dateRange.from) {
      results = results.filter(snippet => snippet.createdAt >= filters.dateRange.from!)
    }
    if (filters.dateRange.to) {
      results = results.filter(snippet => snippet.createdAt <= filters.dateRange.to!)
    }

    // Tags filter
    if (filters.tags.length > 0) {
      results = results.filter(snippet => 
        filters.tags.every(tag => snippet.tags.includes(tag))
      )
    }

    return results
  }, [snippets, filters])

  // Update search results and notify parent
  useEffect(() => {
    setSearchResults(filteredSnippets)
    onFilteredResults(filteredSnippets)
  }, [filteredSnippets, onFilteredResults])

  const handleSearchChange = (value: string) => {
    setFilters(prev => ({ ...prev, search: value }))
  }

  const handleLanguageChange = (value: string) => {
    setFilters(prev => ({ ...prev, language: value === 'all' ? '' : value }))
  }

  const handleVisibilityChange = (value: string) => {
    setFilters(prev => ({ ...prev, visibility: value === 'all' ? '' : value }))
  }

  const handleTagToggle = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }))
  }

  const handleDateRangeChange = (range: { from: Date | undefined; to: Date | undefined }) => {
    setFilters(prev => ({ ...prev, dateRange: range }))
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      language: '',
      visibility: '',
      dateRange: { from: undefined, to: undefined },
      tags: []
    })
  }

  const hasActiveFilters = filters.search || filters.language || filters.visibility || 
    filters.dateRange.from || filters.dateRange.to || filters.tags.length > 0

  const getLanguageColor = (language: string) => {
    const colors: Record<string, string> = {
      'JavaScript': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'TypeScript': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'Python': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'Java': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      'CSS': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    }
    return colors[language] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
  }

  return (
    <div className="space-y-4">
      {/* Search Bar and Filters Header */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Search className="h-5 w-5" />
                <span>Search & Filter</span>
              </CardTitle>
              <CardDescription>
                Find your snippets quickly with advanced search and filtering
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">
                {filteredSnippets.length} result{filteredSnippets.length !== 1 ? 's' : ''}
              </Badge>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title, description, or tags..."
              value={filters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap gap-3">
            {/* Language Filter */}
            <Select value={filters.language || 'all'} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Languages</SelectItem>
                {LANGUAGES.map(lang => (
                  <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Visibility Filter */}
            <Select value={filters.visibility || 'all'} onValueChange={handleVisibilityChange}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>

            {/* Date Range Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateRange.from ? (
                    filters.dateRange.to ? (
                      <>
                        {format(filters.dateRange.from, "LLL dd, y")} -{" "}
                        {format(filters.dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(filters.dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={filters.dateRange.from}
                  selected={{
                    from: filters.dateRange.from,
                    to: filters.dateRange.to
                  }}
                  onSelect={(range) => {
                    if (range) {
                      handleDateRangeChange({ from: range.from, to: range.to });
                    } else {
                      handleDateRangeChange({ from: undefined, to: undefined });
                    }
                  }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>

            {/* Tags Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>Tags</span>
              {filters.tags.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {filters.tags.length}
                </Badge>
              )}
            </Button>
          </div>

          {/* Active Tags Display */}
          {filters.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground">Active tags:</span>
              {filters.tags.map(tag => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="cursor-pointer hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => handleTagToggle(tag)}
                >
                  #{tag}
                  <X className="ml-1 h-3 w-3" />
                </Badge>
              ))}
            </div>
          )}

          {/* Tags Filter Panel */}
          {isFilterOpen && (
            <Card className="p-4">
              <h4 className="font-medium mb-3">Filter by Tags</h4>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {availableTags.map(tag => (
                  <Badge
                    key={tag}
                    variant={filters.tags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/10"
                    onClick={() => handleTagToggle(tag)}
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Search Results */}
      <Card>
        <CardHeader>
          <CardTitle>Search Results</CardTitle>
          <CardDescription>
            {filteredSnippets.length} snippet{filteredSnippets.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredSnippets.length === 0 ? (
            <div className="text-center py-8">
              <Code2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-2">No snippets found</p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search criteria or filters
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSnippets.map((snippet) => (
                <Link key={snippet.id} href={`/snippet/${snippet.id}`}>
                  <div className="border rounded-lg p-4 hover:bg-accent/50 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold hover:text-primary transition-colors">
                          {snippet.title}
                        </h3>
                        <p className="text-muted-foreground text-sm mt-1">
                          {snippet.description}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getLanguageColor(snippet.language)}>
                          {snippet.language}
                        </Badge>
                        {snippet.visibility === 'private' ? (
                          <Lock className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Globe className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <Eye className="mr-1 h-3 w-3" />
                          {snippet.views}
                        </span>
                        <span className="flex items-center">
                          <Heart className="mr-1 h-3 w-3" />
                          {snippet.likes}
                        </span>
                        <span className="flex items-center">
                          <Download className="mr-1 h-3 w-3" />
                          {snippet.downloads}
                        </span>
                        <span>{format(snippet.createdAt, 'MMM dd, yyyy')}</span>
                      </div>
                      
                      <div className="flex gap-1">
                        {snippet.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                        {snippet.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{snippet.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}