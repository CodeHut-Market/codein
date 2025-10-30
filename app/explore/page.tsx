"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CodeSnippet } from "@shared/api"
import {
    BookmarkPlus,
    ExternalLink,
    Heart,
    Search,
    Star
} from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Script from 'next/script'
import { RealTimeSnippetCard } from '../components/ui/real-time-snippet-card'

import { RealTimeSnippetCard } from '../components/ui/real-time-snippet-card'

// Adapter function to convert CodeSnippet to format expected by RealTimeSnippetCard
const adaptCodeSnippetForRealTime = (snippet: CodeSnippet) => ({
  id: snippet.id,
  title: snippet.title,
  description: snippet.description,
  language: snippet.language,
  user_id: snippet.authorId,
  rating: snippet.rating,
  price: snippet.price,
  user: {
    username: snippet.author || 'Anonymous',
    display_name: snippet.author || 'Anonymous',
    avatar_url: undefined
  },
  views: snippet.views || snippet.downloads || 0,
  likes: snippet.likes || 0,
  downloads: snippet.downloads || 0,
  created_at: snippet.createdAt,
  updated_at: snippet.updatedAt,
  is_public: (snippet.visibility !== 'private'),
  tags: snippet.tags || []
});

export default function ExplorePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [snippets, setSnippets] = useState<CodeSnippet[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [searchQuery, setSearchQuery] = useState(searchParams.get("query") || "")
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLanguage, setSelectedLanguage] = useState('all')
  const [sortBy, setSortBy] = useState('trending')
  const [featuredSnippets, setFeaturedSnippets] = useState<CodeSnippet[]>([])
  const [razorpayScriptLoaded, setRazorpayScriptLoaded] = useState(false)

  useEffect(() => {
    // Reset pagination when filters change
    setCurrentPage(1)
    setSnippets([])
    fetchSnippets(1, false) // Reset to page 1, replace all snippets
    fetchFeaturedSnippets()
  }, [searchParams, selectedCategory, selectedLanguage, sortBy])

  const fetchSnippets = async (page: number = 1, append: boolean = false) => {
    try {
      if (!append) {
        setLoading(true)
      } else {
        setLoadingMore(true)
      }
      
      const params = new URLSearchParams()
      const q = searchParams.get("query")
      if (q) params.set("query", q)
      if (selectedLanguage !== 'all') params.set("language", selectedLanguage)
      if (selectedCategory !== 'all') params.set("category", selectedCategory)
      if (sortBy !== 'trending') params.set("sortBy", sortBy)
      params.set("page", page.toString())
      params.set("limit", "12") // Load 12 items per page for better grid layout
      
      const res = await fetch(`/api/snippets/explore?${params.toString()}`, { cache: "no-store" })
      if (!res.ok) {
        if (!append) {
          setSnippets([])
          setTotalCount(0)
        }
        return
      }
      
      const data = await res.json()
      if (Array.isArray(data.snippets)) {
        if (append) {
          // Append new snippets to existing ones
          setSnippets(prev => [...prev, ...data.snippets])
        } else {
          // Replace all snippets
          setSnippets(data.snippets)
        }
        setTotalCount(data.total || data.snippets.length)
        setTotalPages(data.totalPages || 1)
        setCurrentPage(page)
      } else {
        if (!append) {
          setSnippets([])
          setTotalCount(0)
        }
      }
    } catch (e) {
      console.error(e)
      if (!append) {
        setSnippets([])
        setTotalCount(0)
      }
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const fetchFeaturedSnippets = async () => {
    try {
      const res = await fetch('/api/snippets?featured=true&limit=3', { cache: "no-store" })
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data.snippets)) {
          setFeaturedSnippets(data.snippets.slice(0, 3))
        }
      }
    } catch (e) {
      console.error('Failed to fetch featured snippets:', e)
      // Keep empty array as fallback
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (searchQuery.trim()) {
      params.set("query", searchQuery.trim())
    } else {
      params.delete("query")
    }
    router.push(`/explore?${params.toString()}`)
  }

  const handleFilterChange = () => {
    // Reset pagination and fetch from page 1
    setCurrentPage(1)
    setSnippets([])
    fetchSnippets(1, false)
  }

  const handleLoadMore = () => {
    if (currentPage < totalPages && !loadingMore) {
      fetchSnippets(currentPage + 1, true)
    }
  }

  const categories = [
    'All', 'React', 'Vue', 'Angular', 'Frontend', 'Backend', 'Mobile', 
    'Data Science', 'Machine Learning', 'Database', 'DevOps', 'UI/UX'
  ]

  const languages = [
    'All', 'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'Go', 
    'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin', 'Dart', 'CSS', 'SQL'
  ]

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-64 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4 relative">
        <div className="flex items-center justify-center gap-4 mb-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-violet-600 to-emerald-600 bg-clip-text text-transparent">
            Explore Code Snippets
          </h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {searchParams.get("query")
            ? `Search results for "${searchParams.get("query")}" (${totalCount} found)`
            : "Discover amazing code snippets shared by the community. Find solutions, get inspired, and share your own creations."}
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="border-2 hover:border-primary/20 transition-colors duration-200">
        <CardHeader className="bg-gradient-to-r from-primary/5 via-violet-500/5 to-emerald-500/5">
          <CardTitle className="flex items-center text-primary">
            <Search className="mr-2 h-5 w-5 text-emerald-600" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search snippets, tags, or descriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 border-2 focus:border-primary/50 hover:border-primary/30 transition-colors"
              />
            </div>
            <Select value={selectedCategory} onValueChange={(value) => {
              setSelectedCategory(value)
              handleFilterChange()
            }}>
              <SelectTrigger className="w-full md:w-[180px] border-2 hover:border-violet-500/30 focus:border-violet-500/50 transition-colors">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category.toLowerCase()}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedLanguage} onValueChange={(value) => {
              setSelectedLanguage(value)
              handleFilterChange()
            }}>
              <SelectTrigger className="w-full md:w-[180px] border-2 hover:border-emerald-500/30 focus:border-emerald-500/50 transition-colors">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map(language => (
                  <SelectItem key={language} value={language.toLowerCase()}>
                    {language}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(value) => {
              setSortBy(value)
              handleFilterChange()
            }}>
              <SelectTrigger className="w-full md:w-[180px] border-2 hover:border-amber-500/30 focus:border-amber-500/50 transition-colors">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="trending">Trending</SelectItem>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="popular">Most Liked</SelectItem>
                <SelectItem value="views">Most Viewed</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit" className="bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 transition-all duration-200 shadow-lg hover:shadow-primary/25">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </form>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Found {totalCount} snippets</span>
            <span>Showing results for &apos;{searchQuery || 'all snippets'}&apos;</span>
          </div>
        </CardContent>
      </Card>

      {/* Featured Snippets */}
      {featuredSnippets.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-yellow-500" />
            <h2 className="text-2xl font-bold">Featured Snippets</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredSnippets.map((snippet) => (
              <div key={snippet.id} className="relative">
                <RealTimeSnippetCard 
                  snippet={adaptCodeSnippetForRealTime(snippet)}
                />
                <div className="absolute -top-2 -right-2 z-10">
                  <Badge className="bg-yellow-500 text-yellow-50 shadow-lg">
                    <Star className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Snippets */}
      <Tabs defaultValue="grid" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">All Snippets</h2>
          <TabsList>
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="grid" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {snippets.length > 0 ? (
              snippets.map((snippet) => (
                <RealTimeSnippetCard 
                  key={snippet.id} 
                  snippet={adaptCodeSnippetForRealTime(snippet)}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground text-lg">No code snippets found.</p>
                {searchParams.get("query") && (
                  <p className="text-muted-foreground/60 mt-2">Try adjusting your search terms.</p>
                )}
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="list" className="space-y-4">
          {snippets.length > 0 ? (
            snippets.map((snippet) => (
              <Card key={snippet.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-lg font-semibold">{snippet.title}</h3>
                            <Badge variant="secondary">{snippet.language}</Badge>
                          </div>
                          <p className="text-muted-foreground">{snippet.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src="" alt={snippet.author} />
                              <AvatarFallback>{snippet.author?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">{snippet.author}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">{new Date(snippet.createdAt).toLocaleDateString()}</span>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button size="sm">
                            <ExternalLink className="mr-2 h-3 w-3" />
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            <Heart className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <BookmarkPlus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {snippet.tags?.map((tag: string) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        )) || []}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No code snippets found.</p>
              {searchParams.get("query") && (
                <p className="text-muted-foreground/60 mt-2">Try adjusting your search terms.</p>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Load More Button */}
      {snippets.length > 0 && currentPage < totalPages && (
        <div className="text-center">
          <Button 
            variant="outline" 
            size="lg" 
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="bg-gradient-to-r from-primary/5 to-emerald-500/5 hover:from-primary/10 hover:to-emerald-500/10 border-2 border-primary/20 hover:border-primary/30 transition-all duration-200"
          >
            {loadingMore ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent mr-2"></div>
                Loading more...
              </>
            ) : (
              <>
                Load More Snippets
                <span className="ml-2 text-sm text-muted-foreground">
                  ({snippets.length} of {totalCount})
                </span>
              </>
            )}
          </Button>
        </div>
      )}
      
      {/* End of results message */}
      {snippets.length > 0 && currentPage >= totalPages && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            🎉 You&apos;ve seen all {totalCount} snippets!
            <span className="block mt-1 text-sm">
              Try adjusting your filters to discover more content.
            </span>
          </p>
        </div>
      )}

      <Script
        id="razorpay-checkout-script"
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setRazorpayScriptLoaded(true)}
        strategy="lazyOnload"
      />
    </div>
  )
}
