"use client"

import {
  ArrowDownRight,
  ArrowLeft,
  ArrowUpRight,
  Award,
  Clock,
  Code,
  Crown,
  Download,
  Eye,
  GitFork,
  Heart,
  MessageCircle,
  Share2,
  Target,
  TrendingUp,
  Users
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Progress } from "../../components/ui/progress"

export default function ProfileDashboard() {
  const [timeRange, setTimeRange] = useState('7d')
  const [isLoading, setIsLoading] = useState(false)

  const handleTimeRangeChange = (newRange: string) => {
    setIsLoading(true)
    setTimeRange(newRange)
    // Simulate loading delay
    setTimeout(() => setIsLoading(false), 500)
  }

  // Generate more comprehensive mock data based on time range
  const generateData = (days: number) => {
    const data = []
    const now = new Date()
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      const baseViews = 300 + Math.random() * 400
      const baseLikes = Math.floor(baseViews * (0.05 + Math.random() * 0.15))
      const baseDownloads = Math.floor(baseLikes * (0.3 + Math.random() * 0.5))
      
      data.push({
        name: days <= 7 ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()] 
              : `${date.getMonth() + 1}/${date.getDate()}`,
        views: Math.floor(baseViews),
        likes: baseLikes,
        downloads: baseDownloads,
        date: date.toISOString().split('T')[0]
      })
    }
    return data
  }

  // Dynamic data based on selected time range
  const viewsData = generateData(timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90)

  const languageData = [
    { name: 'JavaScript', value: 35, color: '#f1c40f' },
    { name: 'TypeScript', value: 25, color: '#3498db' },
    { name: 'Python', value: 20, color: '#e74c3c' },
    { name: 'React', value: 15, color: '#61dafb' },
    { name: 'Other', value: 5, color: '#95a5a6' }
  ]

  const performanceMetrics = [
    {
      title: 'Total Views',
      value: '45.2K',
      change: '+12.5%',
      changeValue: '+5.1K',
      trend: 'up',
      icon: <Eye className="h-4 w-4" />,
      description: 'vs last month'
    },
    {
      title: 'Total Likes',
      value: '2.8K',
      change: '+8.2%',
      changeValue: '+212',
      trend: 'up',
      icon: <Heart className="h-4 w-4" />,
      description: 'vs last month'
    },
    {
      title: 'Downloads',
      value: '1.2K',
      change: '+15.3%',
      changeValue: '+161',
      trend: 'up',
      icon: <Download className="h-4 w-4" />,
      description: 'vs last month'
    },
    {
      title: 'Followers',
      value: '1.5K',
      change: '+5.7%',
      changeValue: '+81',
      trend: 'up',
      icon: <Users className="h-4 w-4" />,
      description: 'vs last month'
    }
  ]

  const recentActivity = [
    {
      id: 1,
      type: 'upload',
      message: 'Uploaded new snippet',
      title: 'React Custom Hook for API Calls',
      time: '2 hours ago',
      icon: <Code className="h-4 w-4" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 2,
      type: 'milestone',
      message: 'Reached 1,000 total views milestone!',
      time: '3 hours ago',
      icon: <Target className="h-4 w-4" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      id: 3,
      type: 'like',
      message: 'Your snippet received 10 new likes',
      title: 'Python Data Validation Decorator',
      time: '4 hours ago',
      icon: <Heart className="h-4 w-4" />,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      id: 4,
      type: 'follow',
      message: 'You gained 3 new followers',
      details: 'alex_dev, sarah_codes, john_react',
      time: '6 hours ago',
      icon: <Users className="h-4 w-4" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 5,
      type: 'comment',
      message: 'New comment on your snippet',
      title: 'CSS Grid Layout Helper',
      details: '"This is exactly what I needed! Thanks for sharing."',
      time: '8 hours ago',
      icon: <MessageCircle className="h-4 w-4" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 6,
      type: 'achievement',
      message: 'Achievement unlocked: Code Master',
      details: '100+ snippets uploaded',
      time: '1 day ago',
      icon: <Award className="h-4 w-4" />,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      id: 7,
      type: 'trending',
      message: 'Your snippet is trending',
      title: 'React Custom Hook for API Calls',
      details: 'Featured in "Today\'s Top Picks"',
      time: '1 day ago',
      icon: <TrendingUp className="h-4 w-4" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      id: 8,
      type: 'fork',
      message: 'Your snippet was forked',
      title: 'Node.js Error Handler Middleware',
      details: 'By @developer_mike',
      time: '2 days ago',
      icon: <GitFork className="h-4 w-4" />,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    }
  ]

  const topSnippets = [
    {
      id: 1,
      title: 'React Custom Hook for API Calls',
      views: 1234,
      likes: 89,
      language: 'TypeScript',
      trend: '+15%'
    },
    {
      id: 2,
      title: 'Python Data Validation Decorator',
      views: 987,
      likes: 67,
      language: 'Python',
      trend: '+8%'
    },
    {
      id: 3,
      title: 'CSS Grid Layout Helper',
      views: 756,
      likes: 45,
      language: 'CSS',
      trend: '+23%'
    },
    {
      id: 4,
      title: 'Node.js Error Handler Middleware',
      views: 654,
      likes: 38,
      language: 'JavaScript',
      trend: '+12%'
    }
  ]

  const goals = [
    {
      title: '1K Followers',
      current: 1523,
      target: 2000,
      progress: 76,
      icon: <Users className="h-4 w-4" />
    },
    {
      title: '50K Total Views',
      current: 45200,
      target: 50000,
      progress: 90,
      icon: <Eye className="h-4 w-4" />
    },
    {
      title: '300 Snippets',
      current: 234,
      target: 300,
      progress: 78,
      icon: <Code className="h-4 w-4" />
    }
  ]

  return (
    <div className="flex-1 space-y-8 p-8">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Profile Dashboard</h2>
            <p className="text-muted-foreground">
              Welcome back, Sarah! Here's your coding activity overview.
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <select 
            value={timeRange} 
            onChange={(e) => handleTimeRangeChange(e.target.value)}
            className="px-3 py-1 border rounded-md bg-background hover:bg-accent transition-colors"
            disabled={isLoading}
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <Button className="hover:scale-105 transition-transform">
            <Share2 className="mr-2 h-4 w-4" />
            Share Profile
          </Button>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {performanceMetrics.map((metric) => (
          <Card key={metric.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <div className="p-2 bg-primary/10 rounded-full">
                {metric.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center justify-between mt-2">
                <p className={`text-xs flex items-center font-medium ${
                  metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.trend === 'up' ? (
                    <ArrowUpRight className="mr-1 h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="mr-1 h-3 w-3" />
                  )}
                  {metric.change}
                </p>
                <p className="text-xs text-muted-foreground">
                  {metric.changeValue}
                </p>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {metric.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Main Analytics Chart */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Analytics Overview</CardTitle>
            <CardDescription>
              Your snippet performance over the selected period
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            {isLoading ? (
              <div className="h-80 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={viewsData}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorLikes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="views" 
                    stroke="#8884d8" 
                    fillOpacity={1} 
                    fill="url(#colorViews)" 
                    strokeWidth={2}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="likes" 
                    stroke="#82ca9d" 
                    fillOpacity={1} 
                    fill="url(#colorLikes)" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest actions and notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full ${activity.bgColor}`}>
                    <div className={activity.color}>
                      {activity.icon}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {activity.message}
                    </p>
                    {activity.title && (
                      <p className="text-sm text-primary font-medium">
                        "{activity.title}"
                      </p>
                    )}
                    {activity.details && (
                      <p className="text-xs text-muted-foreground italic">
                        {activity.details}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground flex items-center mt-1">
                      <Clock className="mr-1 h-3 w-3" />
                      {activity.time}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Eye className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Top Snippets */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Top Performing Snippets</CardTitle>
            <CardDescription>
              Your most popular code snippets this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topSnippets.map((snippet, index) => (
                <div key={snippet.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{snippet.title}</h4>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <Badge variant="outline" className="text-xs">{snippet.language}</Badge>
                        <span>{snippet.views} views</span>
                        <span>{snippet.likes} likes</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-green-600">{snippet.trend}</span>
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Language Distribution & Goals */}
        <div className="col-span-3 space-y-6">
          {/* Language Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Language Distribution</CardTitle>
              <CardDescription>
                Your coding language usage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={languageData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {languageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {languageData.map((lang) => (
                  <div key={lang.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: lang.color }}></div>
                      <span>{lang.name}</span>
                    </div>
                    <span className="font-medium">{lang.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Goals Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Goals & Achievements</CardTitle>
              <CardDescription>
                Track your coding milestones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {goals.map((goal) => (
                  <div key={goal.title} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {goal.icon}
                        <span className="text-sm font-medium">{goal.title}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {goal.current.toLocaleString()} / {goal.target.toLocaleString()}
                      </span>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                    <div className="text-xs text-muted-foreground">
                      {goal.progress}% complete
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Profile Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Summary</CardTitle>
          <CardDescription>
            Your CodeHut presence at a glance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-8">
            <Avatar className="w-20 h-20">
              <AvatarImage src="https://github.com/shadcn.png" alt="Sarah Chen" />
              <AvatarFallback className="text-lg">SC</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 grid gap-6 md:grid-cols-5">
              <div className="text-center">
                <div className="text-2xl font-bold">234</div>
                <div className="text-sm text-muted-foreground">Snippets</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">1.5K</div>
                <div className="text-sm text-muted-foreground">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">45.2K</div>
                <div className="text-sm text-muted-foreground">Views</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">2.8K</div>
                <div className="text-sm text-muted-foreground">Likes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">4.8</div>
                <div className="text-sm text-muted-foreground">Rating</div>
              </div>
            </div>
            
            <div className="text-right">
              <Badge className="mb-2">
                <Crown className="w-3 h-3 mr-1" />
                Pro Member
              </Badge>
              <div className="text-sm text-muted-foreground">
                Member since Jan 2023
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}