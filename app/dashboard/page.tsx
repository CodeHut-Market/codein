"use client"

import type { User } from '@supabase/supabase-js'
import {
    Activity,
    BarChart3,
    Code2,
    CreditCard,
    Eye,
    Heart,
    PlusCircle,
    TrendingUp,
    Upload,
    Users,
    Search,
    Filter
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import '../mobile-tabs-override.css'
import '../dashboard-animations.css'
import '../dashboard-themes.css'
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Progress } from "../components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { isSupabaseEnabled, supabase } from '../lib/supabaseClient'
import AnalyticsChart from '../components/dashboard/AnalyticsChart'
import ActivityFeed from '../components/dashboard/ActivityFeed'
import TrendingSnippets from '../components/dashboard/TrendingSnippets'
import SearchAndFilters from '../components/dashboard/SearchAndFilters'
import TagsManager from '../components/dashboard/TagsManager'
import EnhancedProgressTracker from '../components/dashboard/EnhancedProgressTracker'
import AchievementsSystem from '../components/dashboard/AchievementsSystem'
import EnhancedQuickActions from '../components/dashboard/EnhancedQuickActions'
import { RealTimeDashboardStats } from '../components/dashboard/RealTimeDashboardStats'

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [userSnippets, setUserSnippets] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalSnippets: 0,
    publicSnippets: 0,
    privateSnippets: 0,
    totalViews: 0,
    totalLikes: 0,
    totalDownloads: 0,
    averageRating: 0,
    monthlyGrowth: 0
  })
  const [loadingData, setLoadingData] = useState(false)

  useEffect(() => {
    if (isSupabaseEnabled()) {
      supabase!.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null)
        setIsLoading(false)
      })

      const {
        data: { subscription },
      } = supabase!.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null)
        setIsLoading(false)
      })

      return () => subscription.unsubscribe()
    } else {
      setIsLoading(false)
    }
  }, [])

  // Fetch user's snippets when user is available
  useEffect(() => {
    if (user) {
      fetchUserSnippets()
    }
  }, [user])

  const fetchUserSnippets = async () => {
    if (!user) return
    
    try {
      setLoadingData(true)
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };

      // Add user data to request headers
      headers['x-user-data'] = JSON.stringify({
        id: user.id,
        username: user.user_metadata?.username || user.email?.split('@')[0] || 'User',
        email: user.email
      });

      const res = await fetch('/api/snippets/my-snippets', {
        headers,
        cache: 'no-store'
      });

      if (!res.ok) {
        throw new Error('Failed to fetch snippets');
      }

      const data = await res.json();
      setUserSnippets(data.snippets || []);
      setStats(data.stats || stats);
      
      console.log('Dashboard: Fetched user snippets:', data.snippets?.length || 0);
    } catch (error) {
      console.error('Dashboard: Error fetching snippets:', error);
    } finally {
      setLoadingData(false);
    }
  }

  // Get recent snippets from user's snippets
  const recentSnippets = userSnippets.slice(0, 5).map(snippet => ({
    id: snippet.id,
    title: snippet.title,
    language: snippet.language,
    views: snippet.views || 0,
    likes: snippet.likes || 0,
    downloads: snippet.downloads || 0,
    createdAt: new Date(snippet.createdAt).toLocaleDateString(),
    tags: snippet.tags || [],
    visibility: snippet.visibility || 'public'
  }))

  const getUserDisplayName = (user: User | null) => {
    if (!user) return 'Guest User'
    return user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'
  }

  const getUserInitials = (user: User | null) => {
    if (!user) return 'GU'
    const name = user.user_metadata?.full_name || user.email
    return name ? name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) : 'U'
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen">
        <div className="space-y-8">
          {/* Enhanced Loading Header */}
          <div className="relative">
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-500/5 via-violet-500/5 to-emerald-500/5 rounded-3xl blur-3xl"></div>
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center space-x-4">
                <div className="h-20 w-20 bg-gradient-to-br from-primary/20 to-emerald-500/20 rounded-full animate-pulse"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-xl animate-pulse gradient-animation"></div>
                  <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-lg w-3/4 animate-pulse gradient-animation"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Loading Tabs */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-2 shadow-xl">
            <div className="grid grid-cols-3 lg:grid-cols-9 gap-2">
              {Array(9).fill(0).map((_, i) => (
                <div 
                  key={i} 
                  className={`h-12 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-xl animate-pulse gradient-animation ${i > 2 ? 'hidden lg:block' : ''}`}
                  style={{ animationDelay: `${i * 0.1}s` }}
                ></div>
              ))}
            </div>
          </div>

          {/* Enhanced Loading Stats Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {Array(4).fill(0).map((_, i) => (
              <div 
                key={i} 
                className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-xl loading-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              >
                <div className="space-y-4">
                  <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-lg w-2/3 animate-pulse gradient-animation"></div>
                  <div className="h-12 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-xl w-1/2 animate-pulse gradient-animation"></div>
                  <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-lg w-full animate-pulse gradient-animation"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Access Required</CardTitle>
            <CardDescription>
              Please sign in to view your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/login">
              <Button className="w-full">Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mobile-dashboard container mx-auto px-4 pt-4 pb-8 space-y-6 md:py-8 md:space-y-8 
                    min-h-screen safe-area-inset-top safe-area-inset-bottom 
                    mt-safe-top mb-safe-bottom max-w-full overflow-x-hidden">
      {/* Enhanced Modern Header */}
      <div className="relative">
        {/* Animated Background Effects */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-500/8 via-violet-500/8 to-emerald-500/8 rounded-3xl blur-3xl animate-pulse"></div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/3 via-transparent to-emerald-500/3 rounded-2xl"></div>
        
        <div className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            
            {/* Enhanced User Profile Section */}
            <div className="flex items-center space-x-4">
              <div className="relative group">
                <Avatar className="h-16 w-16 sm:h-20 sm:w-20 border-3 border-white shadow-2xl flex-shrink-0 ring-4 ring-primary/10 transition-all duration-300 group-hover:ring-primary/20 group-hover:scale-105">
                  <AvatarImage src={user.user_metadata?.avatar_url} alt={getUserDisplayName(user)} />
                  <AvatarFallback className="text-lg sm:text-xl font-bold bg-gradient-to-br from-primary via-blue-500 to-emerald-500 text-white">
                    {getUserInitials(user)}
                  </AvatarFallback>
                </Avatar>
                {/* Enhanced Online Status */}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-3 border-white dark:border-gray-900 rounded-full animate-pulse shadow-lg">
                  <div className="absolute inset-1 bg-emerald-400 rounded-full animate-ping"></div>
                </div>
              </div>
              
              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-700 to-emerald-600 dark:from-white dark:via-blue-300 dark:to-emerald-400 bg-clip-text text-transparent leading-tight">
                    Welcome back, {getUserDisplayName(user)}!
                  </h1>
                  <div className="hidden sm:block text-2xl animate-bounce">👋</div>
                </div>
                <p className="text-sm sm:text-base text-muted-foreground font-medium">
                  🚀 Ready to build something incredible today?
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 dark:bg-emerald-900/20 rounded-full">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    Online
                  </span>
                  <span className="hidden sm:inline">Last activity: Today</span>
                </div>
              </div>
            </div>

            {/* Enhanced Action Buttons */}
            <div className="flex gap-3">
              <Link href="/upload">
                <Button className="group flex items-center gap-2.5 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:from-violet-700 hover:via-purple-700 hover:to-fuchsia-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 px-6 py-3 font-semibold text-white border-0">
                  <Upload className="h-5 w-5 transition-transform group-hover:-translate-y-1 duration-300" />
                  <span>Upload</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Modern Tab Navigation */}
      <Tabs defaultValue="overview" className="space-y-6 w-full">
        <div className="w-full dashboard-container">
          
          {/* Enhanced Mobile Layout */}
          <div className="mobile-tabs block sm:hidden">
            <TabsList className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 w-full p-1.5 rounded-2xl shadow-xl">
              <TabsTrigger 
                value="overview" 
                className="flex-1 relative overflow-hidden rounded-xl py-3 px-4 text-sm font-semibold transition-all duration-300 !text-gray-900 dark:!text-gray-100 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-violet-600 data-[state=active]:!text-white data-[state=active]:shadow-lg hover:bg-purple-500/10 data-[state=active]:scale-105"
              >
                <span className="relative z-10">📊 Overview</span>
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="flex-1 relative overflow-hidden rounded-xl py-3 px-4 text-sm font-semibold transition-all duration-300 !text-gray-900 dark:!text-gray-100 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-600 data-[state=active]:!text-white data-[state=active]:shadow-lg hover:bg-amber-500/10 data-[state=active]:scale-105"
              >
                <span className="relative z-10">📈 Analytics</span>
              </TabsTrigger>
              <TabsTrigger 
                value="snippets" 
                className="flex-1 relative overflow-hidden rounded-xl py-3 px-4 text-sm font-semibold transition-all duration-300 !text-gray-900 dark:!text-gray-100 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-green-600 data-[state=active]:!text-white data-[state=active]:shadow-lg hover:bg-emerald-500/10 data-[state=active]:scale-105"
              >
                <span className="relative z-10">💾 Snippets</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Enhanced Desktop Layout */}
          <div className="desktop-tabs hidden sm:block">
            <div className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-2 shadow-xl">
              <TabsList className="bg-transparent w-full p-0 grid grid-cols-3 lg:grid-cols-9 gap-2 h-auto">
                <TabsTrigger value="overview" className="group relative overflow-hidden rounded-xl py-4 px-4 text-sm font-semibold transition-all duration-300 hover:scale-105 !text-gray-900 dark:!text-gray-100 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-violet-600 data-[state=active]:!text-white data-[state=active]:shadow-lg hover:shadow-md border-0 data-[state=active]:border-0">
                  <span className="relative z-10 flex items-center gap-2">
                    <span className="text-lg">📊</span>
                    <span>Overview</span>
                  </span>
                  <div className="absolute inset-0 bg-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </TabsTrigger>

                <TabsTrigger value="analytics" className="group relative overflow-hidden rounded-xl py-4 px-4 text-sm font-semibold transition-all duration-300 hover:scale-105 !text-gray-900 dark:!text-gray-100 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-600 data-[state=active]:!text-white data-[state=active]:shadow-lg hover:shadow-md border-0">
                  <span className="relative z-10 flex items-center gap-2">
                    <span className="text-lg">📈</span>
                    <span>Analytics</span>
                  </span>
                  <div className="absolute inset-0 bg-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </TabsTrigger>

                <TabsTrigger value="snippets" className="group relative overflow-hidden rounded-xl py-4 px-4 text-sm font-semibold transition-all duration-300 hover:scale-105 !text-gray-900 dark:!text-gray-100 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-green-600 data-[state=active]:!text-white data-[state=active]:shadow-lg hover:shadow-md border-0">
                  <span className="relative z-10 flex items-center gap-2">
                    <span className="text-lg">💾</span>
                    <span>Snippets</span>
                  </span>
                  <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </TabsTrigger>

                <TabsTrigger value="search" className="group relative overflow-hidden rounded-xl py-4 px-4 text-sm font-semibold transition-all duration-300 hover:scale-105 !text-gray-900 dark:!text-gray-100 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-600 data-[state=active]:!text-white data-[state=active]:shadow-lg hover:shadow-md border-0 hidden lg:flex">
                  <span className="relative z-10 flex items-center gap-2">
                    <span className="text-lg">🔍</span>
                    <span>Search</span>
                  </span>
                  <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </TabsTrigger>

                <TabsTrigger value="activity" className="group relative overflow-hidden rounded-xl py-4 px-4 text-sm font-semibold transition-all duration-300 hover:scale-105 !text-gray-900 dark:!text-gray-100 data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-600 data-[state=active]:!text-white data-[state=active]:shadow-lg hover:shadow-md border-0 hidden lg:flex">
                  <span className="relative z-10 flex items-center gap-2">
                    <span className="text-lg">⚡</span>
                    <span>Activity</span>
                  </span>
                  <div className="absolute inset-0 bg-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </TabsTrigger>

                <TabsTrigger value="trending" className="group relative overflow-hidden rounded-xl py-4 px-4 text-sm font-semibold transition-all duration-300 hover:scale-105 !text-gray-900 dark:!text-gray-100 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-600 data-[state=active]:!text-white data-[state=active]:shadow-lg hover:shadow-md border-0 hidden lg:flex">
                  <span className="relative z-10 flex items-center gap-2">
                    <span className="text-lg">🔥</span>
                    <span>Trending</span>
                  </span>
                  <div className="absolute inset-0 bg-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </TabsTrigger>

                <TabsTrigger value="tags" className="group relative overflow-hidden rounded-xl py-4 px-4 text-sm font-semibold transition-all duration-300 hover:scale-105 !text-gray-900 dark:!text-gray-100 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:!text-white data-[state=active]:shadow-lg hover:shadow-md border-0 hidden lg:flex">
                  <span className="relative z-10 flex items-center gap-2">
                    <span className="text-lg">🏷️</span>
                    <span>Tags</span>
                  </span>
                  <div className="absolute inset-0 bg-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </TabsTrigger>

                <TabsTrigger value="progress" className="group relative overflow-hidden rounded-xl py-4 px-4 text-sm font-semibold transition-all duration-300 hover:scale-105 !text-gray-900 dark:!text-gray-100 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:!text-white data-[state=active]:shadow-lg hover:shadow-md border-0 hidden lg:flex">
                  <span className="relative z-10 flex items-center gap-2">
                    <span className="text-lg">📊</span>
                    <span>Progress</span>
                  </span>
                  <div className="absolute inset-0 bg-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </TabsTrigger>

                <TabsTrigger value="achievements" className="group relative overflow-hidden rounded-xl py-4 px-4 text-sm font-semibold transition-all duration-300 hover:scale-105 !text-gray-900 dark:!text-gray-100 data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-amber-600 data-[state=active]:!text-white data-[state=active]:shadow-lg hover:shadow-md border-0 hidden lg:flex">
                  <span className="relative z-10 flex items-center gap-2">
                    <span className="text-lg">🏆</span>
                    <span>Achievements</span>
                  </span>
                  <div className="absolute inset-0 bg-yellow-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </TabsTrigger>
              </TabsList>
            </div>
          </div>
        </div>

        
        <TabsContent value="overview" className="space-y-4">
          <RealTimeDashboardStats />
          <EnhancedQuickActions />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <AnalyticsChart userId={user?.id || ''} />
        </TabsContent>
        
        <TabsContent value="snippets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Snippets</CardTitle>
              <CardDescription>
                Manage all your code submissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingData ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-muted-foreground">Loading your snippets...</div>
                </div>
              ) : recentSnippets.length === 0 ? (
                <div className="text-center py-8">
                  <Code2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">No snippets yet</p>
                  <Link href="/upload">
                    <Button>Upload Your First Snippet</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentSnippets.map((snippet) => (
                  <Link
                    key={snippet.id}
                    href={`/snippet/${snippet.id}`}
                    className="block"
                  >
                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer group">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold hover:text-primary transition-colors">{snippet.title}</h3>
                          <Badge variant="secondary">{snippet.language}</Badge>
                          <Badge variant={snippet.visibility === 'private' ? 'outline' : 'default'} className="text-xs">
                            {snippet.visibility}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <Eye className="mr-1 h-3 w-3" />
                            {snippet.views}
                          </span>
                          <span className="flex items-center">
                            <Heart className="mr-1 h-3 w-3" />
                            {snippet.likes}
                          </span>
                          <span>{snippet.createdAt}</span>
                        </div>
                        <div className="flex gap-1 mt-2">
                          {snippet.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="sm" onClick={(e) => { e.preventDefault(); console.log('Edit snippet:', snippet.id); }}>
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" onClick={(e) => { e.preventDefault(); console.log('Duplicate snippet:', snippet.id); }}>
                          Duplicate
                        </Button>
                        <Button variant="ghost" size="sm" onClick={(e) => e.preventDefault()}>
                          <BarChart3 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="search" className="space-y-4">
          <SearchAndFilters 
            snippets={recentSnippets.map(snippet => ({
              ...snippet,
              description: `Sample description for ${snippet.title}`,
              createdAt: new Date(snippet.createdAt),
              updatedAt: new Date(snippet.createdAt)
            }))}
            onFilteredResults={(results) => console.log('Filtered results:', results)}
          />
        </TabsContent>
        
        <TabsContent value="activity" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <ActivityFeed currentUserId={user?.id || ''} />
            
            <Card>
              <CardHeader>
                <CardTitle>Activity Summary</CardTitle>
                <CardDescription>
                  Your engagement metrics this week
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Upload className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Snippets Uploaded</span>
                  </div>
                  <span className="font-bold">3</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span className="text-sm">Likes Received</span>
                  </div>
                  <span className="font-bold">27</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Eye className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Profile Views</span>
                  </div>
                  <span className="font-bold">156</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">New Followers</span>
                  </div>
                  <span className="font-bold">8</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="trending" className="space-y-4">
          <TrendingSnippets limit={10} />
        </TabsContent>
        
        <TabsContent value="tags" className="space-y-4">
          <TagsManager />
        </TabsContent>
        
        <TabsContent value="progress" className="space-y-4">
          <EnhancedProgressTracker />
        </TabsContent>
        
        <TabsContent value="achievements" className="space-y-4">
          <AchievementsSystem />
        </TabsContent>
      </Tabs>
    </div>
  )
}