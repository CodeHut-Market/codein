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
import './mobile-tabs-override.css'
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
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded"></div>
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/5 via-violet-500/5 to-emerald-500/5 rounded-2xl blur-3xl"></div>
        <div className="flex items-center space-x-3 sm:space-x-4">
          <Avatar className="h-12 w-12 sm:h-16 sm:w-16 border-2 border-primary/20 shadow-lg flex-shrink-0">
            <AvatarImage src={user.user_metadata?.avatar_url} alt={getUserDisplayName(user)} />
            <AvatarFallback className="text-sm sm:text-lg bg-gradient-to-br from-primary/20 to-emerald-500/20">
              {getUserInitials(user)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-foreground via-violet-600 to-emerald-600 bg-clip-text text-transparent truncate">
              Welcome back, {getUserDisplayName(user)}!
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Here's what's happening with your code snippets
            </p>
          </div>
        </div>
        <Link href="/upload" className="shrink-0">
          <Button className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-primary hover:from-emerald-600/90 hover:to-primary/90 transition-all duration-200 shadow-lg hover:shadow-emerald-500/25 text-sm sm:text-base px-3 py-2 sm:px-4 sm:py-2">
            <PlusCircle className="h-4 w-4" />
            <span className="hidden sm:inline">New Snippet</span>
            <span className="sm:hidden">New</span>
          </Button>
        </Link>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4 w-full">
        {/* MOBILE-FIRST Tab Navigation - No Overflow Guaranteed */}
        <div className="w-full dashboard-container">
          
          {/* Mobile Layout: Simple 3-Tab Flex */}
          <div className="mobile-tabs block sm:hidden">
            <div className="tabs-list-mobile">
              <TabsTrigger 
                value="overview" 
                className="tabs-trigger-mobile"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="tabs-trigger-mobile"
              >
                Analytics
              </TabsTrigger>
              <TabsTrigger 
                value="snippets" 
                className="tabs-trigger-mobile"
              >
                Snippets
              </TabsTrigger>
            </div>
          </div>

          {/* Desktop Layout: Full Grid */}
          <div className="desktop-tabs hidden sm:block">
            <TabsList className="bg-muted/50 border border-primary/10 w-full p-2 grid grid-cols-3 lg:grid-cols-9 gap-1">
              <TabsTrigger value="overview" className="data-[state=active]:bg-primary text-sm px-3 py-2">Overview</TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-amber-600 text-sm px-3 py-2">Analytics</TabsTrigger>
              <TabsTrigger value="snippets" className="data-[state=active]:bg-emerald-600 text-sm px-3 py-2">Snippets</TabsTrigger>
              <TabsTrigger value="search" className="hidden lg:block data-[state=active]:bg-blue-600 text-sm px-3 py-2">Search</TabsTrigger>
              <TabsTrigger value="activity" className="hidden lg:block data-[state=active]:bg-violet-600 text-sm px-3 py-2">Activity</TabsTrigger>
              <TabsTrigger value="trending" className="hidden lg:block data-[state=active]:bg-orange-600 text-sm px-3 py-2">Trending</TabsTrigger>
              <TabsTrigger value="tags" className="hidden lg:block data-[state=active]:bg-purple-600 text-sm px-3 py-2">Tags</TabsTrigger>
              <TabsTrigger value="progress" className="hidden lg:block data-[state=active]:bg-green-600 text-sm px-3 py-2">Progress</TabsTrigger>
              <TabsTrigger value="achievements" className="hidden lg:block data-[state=active]:bg-yellow-600 text-sm px-3 py-2">Achievements</TabsTrigger>
            </TabsList>
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