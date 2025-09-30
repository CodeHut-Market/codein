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
    Users
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Progress } from "../components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { isSupabaseEnabled, supabase } from '../lib/supabaseClient'

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
    averageRating: 0
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
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between relative">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/5 via-violet-500/5 to-emerald-500/5 rounded-2xl blur-3xl"></div>
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16 border-2 border-primary/20 shadow-lg">
            <AvatarImage src={user.user_metadata?.avatar_url} alt={getUserDisplayName(user)} />
            <AvatarFallback className="text-lg bg-gradient-to-br from-primary/20 to-emerald-500/20">
              {getUserInitials(user)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground via-violet-600 to-emerald-600 bg-clip-text text-transparent">
              Welcome back, {getUserDisplayName(user)}!
            </h1>
            <p className="text-muted-foreground">
              Here's what's happening with your code snippets
            </p>
          </div>
        </div>
        <Link href="/upload">
          <Button className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-primary hover:from-emerald-600/90 hover:to-primary/90 transition-all duration-200 shadow-lg hover:shadow-emerald-500/25">
            <PlusCircle className="h-4 w-4" />
            <span>New Snippet</span>
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-primary/60 hover:border-l-primary hover:shadow-lg transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-primary/5 to-transparent">
            <CardTitle className="text-sm font-medium">Total Snippets</CardTitle>
            <Code2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{loadingData ? '...' : stats.totalSnippets}</div>
            <p className="text-xs text-muted-foreground">
              {stats.publicSnippets} public, {stats.privateSnippets} private
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-emerald-500/60 hover:border-l-emerald-500 hover:shadow-lg transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-emerald-500/5 to-transparent">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{loadingData ? '...' : stats.totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Total downloads: {stats.totalDownloads}
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-rose-500/60 hover:border-l-rose-500 hover:shadow-lg transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-rose-500/5 to-transparent">
            <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
            <Heart className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-500">{loadingData ? '...' : stats.totalLikes}</div>
            <p className="text-xs text-muted-foreground">
              Avg rating: {stats.averageRating.toFixed(1)}/5
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-violet-500/60 hover:border-l-violet-500 hover:shadow-lg transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-violet-500/5 to-transparent">
            <CardTitle className="text-sm font-medium">Followers</CardTitle>
            <Users className="h-4 w-4 text-violet-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-violet-600">{loadingData ? '...' : userSnippets.length}</div>
            <p className="text-xs text-muted-foreground">
              Recent uploads
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-muted/50 border border-primary/10">
          <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80">Overview</TabsTrigger>
          <TabsTrigger value="snippets" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-emerald-600/80">Recent Snippets</TabsTrigger>
          <TabsTrigger value="activity" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-violet-600/80">Activity</TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-600 data-[state=active]:to-amber-600/80">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common tasks to manage your code snippets
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2">
                <Link href="/upload">
                  <Button variant="outline" className="w-full justify-start">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload New Snippet
                  </Button>
                </Link>
                <Link href="/explore">
                  <Button variant="outline" className="w-full justify-start">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Browse Trending
                  </Button>
                </Link>
                <Link href="/favorites">
                  <Button variant="outline" className="w-full justify-start">
                    <Heart className="mr-2 h-4 w-4" />
                    View Favorites
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                </Link>
                <Link href="/transactions">
                  <Button variant="outline" className="w-full justify-start">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Transaction History
                  </Button>
                </Link>
                <Link href="/dashboard/profile">
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Profile Dashboard
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Progress</CardTitle>
                <CardDescription>
                  Your activity this month
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Total Snippets</span>
                    <span>{stats.totalSnippets}</span>
                  </div>
                  <Progress value={Math.min((stats.totalSnippets / 10) * 100, 100)} className="mt-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Public vs Private</span>
                    <span>{stats.publicSnippets}/{stats.privateSnippets}</span>
                  </div>
                  <Progress value={stats.totalSnippets > 0 ? (stats.publicSnippets / stats.totalSnippets) * 100 : 0} className="mt-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Avg Rating</span>
                    <span>{stats.averageRating.toFixed(1)}/5</span>
                  </div>
                  <Progress value={(stats.averageRating / 5) * 100} className="mt-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="snippets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Snippets</CardTitle>
              <CardDescription>
                Your latest code submissions
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
                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold hover:text-primary transition-colors">{snippet.title}</h3>
                          <Badge variant="secondary">{snippet.language}</Badge>
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
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={(e) => e.preventDefault()}>
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest actions and interactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingData ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-muted-foreground">Loading activity...</div>
                </div>
              ) : recentSnippets.length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No recent activity</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentSnippets.slice(0, 3).map((snippet, index) => (
                    <div key={snippet.id} className="flex items-start space-x-3">
                      <Upload className="h-4 w-4 mt-1 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm">
                          Uploaded new snippet
                          <span className="font-medium"> "{snippet.title}"</span>
                        </p>
                        <p className="text-xs text-muted-foreground">{snippet.createdAt}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>
                  How your snippets are performing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Average Views per Snippet</span>
                  <span className="font-bold">{Math.round(stats.totalViews / stats.totalSnippets)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Like-to-View Ratio</span>
                  <span className="font-bold">{Math.round((stats.totalLikes / stats.totalViews) * 100)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Most Popular Language</span>
                  <Badge>JavaScript</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Growth Trends</CardTitle>
                <CardDescription>
                  Your account growth over time
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Monthly Growth</span>
                  <span className="font-bold text-green-600">+{stats.monthlyGrowth}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">New Followers (30d)</span>
                  <span className="font-bold">+23</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Engagement Score</span>
                  <span className="font-bold">8.7/10</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}