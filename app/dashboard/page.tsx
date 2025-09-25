"use client"

import type { User } from '@supabase/supabase-js'
import {
    Activity,
    BarChart3,
    Code2,
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

  // Mock data for demonstration
  const stats = {
    totalSnippets: 24,
    totalViews: 1247,
    totalLikes: 89,
    totalFollowers: 156,
    weeklyUploads: 5,
    monthlyGrowth: 12.5
  }

  const recentSnippets = [
    {
      id: 1,
      title: 'React Hook for API Calls',
      language: 'JavaScript',
      views: 234,
      likes: 18,
      createdAt: '2 days ago',
      tags: ['react', 'hooks', 'api']
    },
    {
      id: 2,
      title: 'Python Data Processing',
      language: 'Python',
      views: 156,
      likes: 12,
      createdAt: '5 days ago',
      tags: ['python', 'data', 'pandas']
    },
    {
      id: 3,
      title: 'CSS Grid Layout',
      language: 'CSS',
      views: 89,
      likes: 7,
      createdAt: '1 week ago',
      tags: ['css', 'grid', 'layout']
    }
  ]

  const activity = [
    { action: 'Uploaded new snippet', snippet: 'React Hook for API Calls', time: '2 hours ago' },
    { action: 'Received a like on', snippet: 'Python Data Processing', time: '4 hours ago' },
    { action: 'New follower', snippet: null, time: '6 hours ago' },
    { action: 'Snippet featured', snippet: 'CSS Grid Layout', time: '1 day ago' }
  ]

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
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.user_metadata?.avatar_url} alt={getUserDisplayName(user)} />
            <AvatarFallback className="text-lg">
              {getUserInitials(user)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {getUserDisplayName(user)}!</h1>
            <p className="text-muted-foreground">
              Here's what's happening with your code snippets
            </p>
          </div>
        </div>
        <Link href="/upload">
          <Button className="flex items-center space-x-2">
            <PlusCircle className="h-4 w-4" />
            <span>New Snippet</span>
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Snippets</CardTitle>
            <Code2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSnippets}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.weeklyUploads} this week
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.monthlyGrowth}% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLikes}</div>
            <p className="text-xs text-muted-foreground">
              Across all snippets
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Followers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFollowers}</div>
            <p className="text-xs text-muted-foreground">
              Growing community
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="snippets">Recent Snippets</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
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
                    <span>Uploads Goal</span>
                    <span>{stats.weeklyUploads * 4}/20</span>
                  </div>
                  <Progress value={(stats.weeklyUploads * 4) / 20 * 100} className="mt-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Engagement Rate</span>
                    <span>68%</span>
                  </div>
                  <Progress value={68} className="mt-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Profile Completeness</span>
                    <span>85%</span>
                  </div>
                  <Progress value={85} className="mt-2" />
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
              <div className="space-y-4">
                {recentSnippets.map((snippet) => (
                  <div
                    key={snippet.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold">{snippet.title}</h3>
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
                    <Button variant="ghost" size="sm">
                      <BarChart3 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
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
              <div className="space-y-4">
                {activity.map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Activity className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm">
                        {item.action}
                        {item.snippet && (
                          <span className="font-medium"> "{item.snippet}"</span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
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