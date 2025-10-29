"use client"

import FavoriteButton from "@/components/FavoriteButton"
import SnippetCard from "@/components/SnippetCard"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabaseClient"
import { CodeSnippet } from "@shared/api"
import { AnimatePresence, motion } from "framer-motion"
import { 
  Filter, 
  Grid, 
  Heart, 
  List, 
  LogIn,
  Search, 
  SortAsc, 
  SortDesc, 
  Sparkles, 
  Star, 
  Trash2,
  TrendingUp,
  Code,
  Download,
  UserPlus,
  Lock
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface FavoriteItem {
  user_id?: string
  snippet_id: string
  created_at: string
  snippets?: CodeSnippet
  snippet?: CodeSnippet
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<CodeSnippet[]>([])
  const [filteredFavorites, setFilteredFavorites] = useState<CodeSnippet[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"date" | "title" | "price" | "rating" | "downloads">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [filterLanguage, setFilterLanguage] = useState<string>("all")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [showSignInDialog, setShowSignInDialog] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const router = useRouter()

  // Enhanced demo favorites data
  const demoFavorites: CodeSnippet[] = [
    {
      id: "snippet-1",
      title: "React Authentication Hook",
      description: "Custom React hook for handling user authentication with JWT tokens, automatic token refresh, and persistent login state.",
      code: `import { useState, useEffect, useContext, createContext } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // Authentication logic here
  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}`,
      price: 15,
      rating: 4.8,
      author: "DevExpert",
      authorId: "user-123",
      tags: ["react", "authentication", "hooks", "jwt"],
      language: "TypeScript",
      framework: "React",
      category: "Authentication",
      downloads: 1250,
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-01-20T14:45:00Z",
      visibility: "public",
      allowComments: true
    },
    {
      id: "snippet-2", 
      title: "Python Data Validator",
      description: "Comprehensive data validation library with custom rules, type checking, and detailed error reporting for Python applications.",
      code: `from typing import Any, Dict, List, Optional, Union
import re

class DataValidator:
    def __init__(self):
        self.rules = {}
        
    def validate(self, data: Dict[str, Any]) -> Dict[str, Any]:
        errors = {}
        for field, value in data.items():
            if field in self.rules:
                field_errors = self._validate_field(field, value)
                if field_errors:
                    errors[field] = field_errors
        return {"valid": len(errors) == 0, "errors": errors}`,
      price: 25,
      rating: 4.9,
      author: "PythonPro",
      authorId: "user-456",
      tags: ["python", "validation", "data", "library"],
      language: "Python",
      framework: "FastAPI",
      category: "Utilities",
      downloads: 890,
      createdAt: "2024-02-01T09:15:00Z",
      updatedAt: "2024-02-05T16:30:00Z",
      visibility: "public",
      allowComments: true
    },
    {
      id: "snippet-3",
      title: "CSS Grid Layout System",
      description: "Modern CSS Grid-based layout system with responsive breakpoints, flexible columns, and utility classes.",
      code: `.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem;
}

.grid-item {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

@media (max-width: 768px) {
  .grid-container {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 1rem;
  }
}`,
      price: 10,
      rating: 4.7,
      author: "CSSMaster",
      authorId: "user-789",
      tags: ["css", "grid", "responsive", "layout"],
      language: "CSS",
      framework: undefined,
      category: "UI/UX",
      downloads: 2100,
      createdAt: "2024-01-28T12:00:00Z",
      updatedAt: "2024-01-28T12:00:00Z",
      visibility: "public",
      allowComments: true
    }
  ]

  // Load favorites from API or localStorage
  const loadFavorites = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Check Supabase authentication first
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError || !session) {
        console.log('No active session found:', sessionError)
        setIsAuthenticated(false)
        setShowSignInDialog(true)
        setFavorites([])
        setLoading(false)
        return
      }

      // User is authenticated - set states immediately
      console.log('✅ Active session found for user:', session.user.email)
      setUserId(session.user.id)
      setIsAuthenticated(true)
      setShowSignInDialog(false) // Hide dialog immediately
      
      // Try API with auth token
      try {
        const response = await fetch('/api/favorites', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        })
        
        if (response.ok) {
          const data = await response.json()
          // Map favorites to snippet format (API returns 'snippets' not 'snippet')
          const favoriteSnippets = data.favorites?.map((fav: FavoriteItem) => {
            const snippet = fav.snippets || fav.snippet
            return {
              ...snippet,
              // Ensure all required fields exist
              author: snippet.author || 'Unknown',
              authorId: snippet.authorId,
              createdAt: snippet.createdAt,
              updatedAt: snippet.updatedAt,
              allowComments: snippet.allowComments ?? true,
            }
          }).filter(Boolean) || []
          setFavorites(favoriteSnippets)
          console.log('✅ Loaded', favoriteSnippets.length, 'favorites')
        } else if (response.status === 401) {
          // Token might be expired - try to refresh
          console.log('⚠️ Token expired, attempting refresh...')
          const { data: { session: newSession }, error: refreshError } = await supabase.auth.refreshSession()
          
          if (newSession) {
            console.log('✅ Session refreshed, retrying...')
            // Retry with new token
            loadFavorites()
          } else {
            console.log('❌ Session refresh failed:', refreshError)
            setIsAuthenticated(false)
            setShowSignInDialog(true)
            setFavorites([])
          }
        } else {
          throw new Error(`API error: ${response.status}`)
        }
      } catch (apiError) {
        console.error('API error:', apiError)
        // Don't immediately show sign-in dialog if we have a session
        // The user is authenticated, just couldn't load favorites
        setError('Failed to load favorites. Please refresh the page.')
      }
    } catch (error) {
      console.error('Error loading favorites:', error)
      setError('Failed to load favorites. Please try again.')
      setIsAuthenticated(false)
      setShowSignInDialog(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFavorites()

    // Listen for auth state changes to reload favorites
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔔 Auth state changed:', event, session?.user?.email)
      
      if (event === 'SIGNED_IN' && session) {
        console.log('✅ User signed in, reloading favorites')
        setIsAuthenticated(true)
        setShowSignInDialog(false)
        setUserId(session.user.id)
        loadFavorites()
      } else if (event === 'SIGNED_OUT') {
        console.log('👋 User signed out')
        setIsAuthenticated(false)
        setShowSignInDialog(true)
        setFavorites([])
        setUserId(null)
      } else if (event === 'TOKEN_REFRESHED' && session) {
        console.log('🔄 Token refreshed')
        setIsAuthenticated(true)
        setShowSignInDialog(false)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Filter and sort favorites
  useEffect(() => {
    let filtered = [...favorites]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(snippet =>
        snippet.title.toLowerCase().includes(query) ||
        snippet.description.toLowerCase().includes(query) ||
        snippet.language.toLowerCase().includes(query) ||
        snippet.tags.some(tag => tag.toLowerCase().includes(query)) ||
        snippet.author.toLowerCase().includes(query)
      )
    }

    // Apply language filter
    if (filterLanguage !== "all") {
      filtered = filtered.filter(snippet => 
        snippet.language.toLowerCase() === filterLanguage.toLowerCase()
      )
    }

    // Apply category filter
    if (filterCategory !== "all" && filterCategory) {
      filtered = filtered.filter(snippet => 
        snippet.category?.toLowerCase() === filterCategory.toLowerCase()
      )
    }

    // Apply tab filter
    if (activeTab !== "all") {
      switch (activeTab) {
        case "recent":
          filtered = filtered.filter(snippet => {
            const createdDate = new Date(snippet.createdAt)
            const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            return createdDate >= weekAgo
          })
          break
        case "popular":
          filtered = filtered.filter(snippet => snippet.downloads > 1000)
          break
        case "premium":
          filtered = filtered.filter(snippet => snippet.price > 0)
          break
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: string | number, bValue: string | number
      
      switch (sortBy) {
        case "title":
          aValue = a.title.toLowerCase()
          bValue = b.title.toLowerCase()
          break
        case "price":
          aValue = a.price
          bValue = b.price
          break
        case "rating":
          aValue = a.rating
          bValue = b.rating
          break
        case "downloads":
          aValue = a.downloads
          bValue = b.downloads
          break
        case "date":
        default:
          aValue = new Date(a.createdAt).getTime()
          bValue = new Date(b.createdAt).getTime()
          break
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0
      }
    })

    setFilteredFavorites(filtered)
  }, [favorites, searchQuery, filterLanguage, filterCategory, sortBy, sortOrder, activeTab])

  const removeFavorite = async (snippetId: string) => {
    try {
      const response = await fetch(`/api/favorites?snippetId=${snippetId}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      
      // Update state immediately for better UX
      setFavorites(prev => prev.filter(f => f.id !== snippetId))
      
      if (!response.ok) {
        // Update localStorage as fallback
        const userFavorites = JSON.parse(localStorage.getItem("userFavorites") || "[]")
        const updated = userFavorites.filter((id: string) => id !== snippetId)
        localStorage.setItem("userFavorites", JSON.stringify(updated))
      }
    } catch (error) {
      console.error('Failed to remove favorite:', error)
      // Fallback to localStorage
      const userFavorites = JSON.parse(localStorage.getItem("userFavorites") || "[]")
      const updated = userFavorites.filter((id: string) => id !== snippetId)
      localStorage.setItem("userFavorites", JSON.stringify(updated))
    }
  }

  const removeSelectedFavorites = async () => {
    const promises = selectedItems.map(id => removeFavorite(id))
    await Promise.all(promises)
    setSelectedItems([])
  }

  const toggleSelectItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    setSelectedItems(
      selectedItems.length === filteredFavorites.length 
        ? [] 
        : filteredFavorites.map(f => f.id)
    )
  }

  const availableLanguages = Array.from(new Set(favorites.map(f => f.language).filter(Boolean)))
  const availableCategories = Array.from(new Set(favorites.map(f => f.category).filter(Boolean)))

  const favoriteStats = {
    total: favorites.length,
    recent: favorites.filter(f => {
      const createdDate = new Date(f.createdAt)
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      return createdDate >= weekAgo
    }).length,
    popular: favorites.filter(f => f.downloads > 1000).length,
    premium: favorites.filter(f => f.price > 0).length
  }

  return (
    <>
      {/* Sign In Dialog */}
      <Dialog open={showSignInDialog} onOpenChange={setShowSignInDialog}>
        <DialogContent className="sm:max-w-lg border-2 border-gray-200 shadow-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur">
          <DialogHeader className="bg-white/90 dark:bg-slate-900/90 rounded-lg px-4 py-3">
            <DialogTitle className="flex items-center gap-2 text-2xl text-slate-900 dark:text-slate-100">
              <Lock className="h-6 w-6 text-pink-500" />
              Sign in to view favorites
            </DialogTitle>
            <DialogDescription className="pt-3 text-base text-slate-700 dark:text-slate-300">
              You need to sign in to access your favorites page and manage your saved snippets.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-6">
            <div className="flex items-start gap-4 rounded-xl border border-pink-500/40 bg-pink-100/90 dark:bg-pink-500/10 dark:border-pink-400/40 backdrop-blur-sm p-4">
              <div className="rounded-full bg-pink-500/30 dark:bg-pink-500/20 p-3">
                <Heart className="h-6 w-6 text-pink-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Save Your Favorites</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">
                  Keep track of code snippets you love and access them from any device
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-xl border border-purple-500/40 bg-purple-100/90 dark:bg-purple-500/10 dark:border-purple-400/40 backdrop-blur-sm p-4">
              <div className="rounded-full bg-purple-500/30 dark:bg-purple-500/20 p-3">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Organize & Search</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">
                  Filter by language, category, and sort your collection your way
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-xl border border-blue-500/40 bg-blue-100/90 dark:bg-blue-500/10 dark:border-blue-400/40 backdrop-blur-sm p-4">
              <div className="rounded-full bg-blue-500/30 dark:bg-blue-500/20 p-3">
                <UserPlus className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Join the Community</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">
                  Free account - no credit card required, ready in seconds
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-3 bg-white/90 dark:bg-slate-900/90 rounded-lg px-4 py-3">
            <Button
              variant="outline"
              onClick={() => router.push('/explore')}
              className="w-full sm:w-auto border-2 border-slate-200/80 dark:border-slate-700/80 bg-slate-50/70 dark:bg-slate-800/70 text-slate-800 dark:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800"
            >
              Browse Snippets
            </Button>
            <Button
              onClick={() => {
                setShowSignInDialog(false);
                router.push('/login');
              }}
              className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-lg"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Sign In Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Main Content - Only show if authenticated */}
      {isAuthenticated === false ? (
        // Empty state while dialog is showing
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Lock className="h-16 w-16 mx-auto text-gray-400" />
            <h2 className="text-2xl font-bold text-gray-900">Authentication Required</h2>
            <p className="text-gray-600">Please sign in to view your favorites</p>
          </div>
        </div>
      ) : (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-pink-500 via-purple-600 to-blue-600 text-white">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative container mx-auto px-6 py-16">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-white rounded-full text-sm font-medium text-purple-600">
              <Sparkles className="w-4 h-4 mr-2" />
              Your curated collection
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              My
              <span className="block bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
                Favorites
              </span>
            </h1>
            
            <p className="text-xl text-purple-100 max-w-2xl mx-auto">
              Your handpicked collection of amazing code snippets. 
              Organize, search, and access your favorite code anytime.
            </p>
          </div>
        </div>
        
        {/* Floating heart elements */}
        <div className="absolute top-20 left-10 w-8 h-8 text-pink-300 opacity-60">
          <Heart className="w-full h-full fill-current animate-pulse" />
        </div>
        <div className="absolute bottom-20 right-10 w-6 h-6 text-yellow-300 opacity-60">
          <Star className="w-full h-full fill-current animate-pulse" />
        </div>
      </section>

      <div className="container mx-auto px-6 py-12 space-y-8">
        {/* Stats Cards */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total', value: favoriteStats.total, icon: Heart, color: 'text-pink-500' },
            { label: 'Recent', value: favoriteStats.recent, icon: TrendingUp, color: 'text-green-500' },
            { label: 'Popular', value: favoriteStats.popular, icon: Star, color: 'text-yellow-500' },
            { label: 'Premium', value: favoriteStats.premium, icon: Code, color: 'text-purple-500' }
          ].map((stat, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow border-0 shadow-md">
              <CardContent className="py-6">
                <stat.icon className={`h-8 w-8 mx-auto mb-2 ${stat.color}`} />
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-muted-foreground text-sm">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Filters and Controls */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filter & Sort
                </CardTitle>
                <CardDescription>
                  Find exactly what you're looking for
                </CardDescription>
              </div>
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
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search favorites..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={filterLanguage} onValueChange={setFilterLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="All Languages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  {availableLanguages.map(lang => (
                    <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={(value: "date" | "title" | "price" | "rating" | "downloads") => setSortBy(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date Added</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="downloads">Downloads</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
              >
                {sortOrder === "asc" ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              </Button>
            </div>
            
            {selectedItems.length > 0 && (
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <span className="text-sm">{selectedItems.length} items selected</span>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={removeSelectedFavorites}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove Selected
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Category Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 max-w-md mx-auto">
            <TabsTrigger value="all">All ({favoriteStats.total})</TabsTrigger>
            <TabsTrigger value="recent">Recent ({favoriteStats.recent})</TabsTrigger>
            <TabsTrigger value="popular">Popular ({favoriteStats.popular})</TabsTrigger>
            <TabsTrigger value="premium">Premium ({favoriteStats.premium})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-8">
            {loading ? (
              <Card className="text-center py-16">
                <CardContent>
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Loading your favorites...</h3>
                  <p className="text-muted-foreground">This might take a moment</p>
                </CardContent>
              </Card>
            ) : error ? (
              <Card className="text-center py-16">
                <CardContent>
                  <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Something went wrong</h3>
                  <p className="text-muted-foreground mb-6">{error}</p>
                  <Button onClick={loadFavorites} className="px-8">
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            ) : filteredFavorites.length === 0 ? (
              <Card className="text-center py-16">
                <CardContent>
                  <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    {favorites.length === 0 ? "No favorites yet" : "No matching favorites"}
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    {favorites.length === 0 
                      ? "Start building your collection by adding code snippets to your favorites!" 
                      : "Try adjusting your search or filters to find what you're looking for."
                    }
                  </p>
                  {favorites.length === 0 && (
                    <Button onClick={() => window.location.href = "/explore"} className="px-8">
                      <Search className="w-4 h-4 mr-2" />
                      Explore Snippets
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {filteredFavorites.length > 0 && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Badge variant="secondary" className="text-sm">
                        {filteredFavorites.length} favorite{filteredFavorites.length !== 1 ? "s" : ""}
                      </Badge>
                      {filteredFavorites.length > 0 && (
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={selectedItems.length === filteredFavorites.length}
                            onCheckedChange={toggleSelectAll}
                            id="select-all"
                          />
                          <label htmlFor="select-all" className="text-sm text-muted-foreground cursor-pointer">
                            Select all
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <AnimatePresence>
                  <div className={cn(
                    viewMode === "grid" 
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                      : "space-y-4"
                  )}>
                    {filteredFavorites.map((snippet, i) => (
                      <motion.div
                        key={snippet.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: i * 0.05 }}
                        className="relative group"
                      >
                        <div className="absolute top-3 left-3 z-10">
                          <Checkbox
                            checked={selectedItems.includes(snippet.id)}
                            onCheckedChange={() => toggleSelectItem(snippet.id)}
                            className="bg-white border-2 shadow-sm"
                          />
                        </div>
                        
                        <div className="absolute top-3 right-3 z-10">
                          <FavoriteButton
                            snippetId={snippet.id}
                            userId={userId || undefined}
                            initialIsFavorited={true}
                            variant="ghost"
                            className="bg-white hover:bg-white text-red-500 border shadow-sm"
                          />
                        </div>
                        
                        <div className="transform transition-transform group-hover:-translate-y-1">
                          <SnippetCard snippet={snippet} />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </AnimatePresence>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
      )}
    </>
  )
}