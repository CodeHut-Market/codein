"use client"

import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Badge } from "../ui/badge"
import { TrendingUp, TrendingDown, Eye, Download, Heart, Activity } from 'lucide-react'
import { format, subDays, eachDayOfInterval } from 'date-fns'

interface AnalyticsData {
  date: string
  views: number
  downloads: number
  likes: number
  snippets: number
}

interface TrendData {
  current: number
  previous: number
  change: number
  isPositive: boolean
}

interface AnalyticsChartProps {
  userId: string
}

export default function AnalyticsChart({ userId }: AnalyticsChartProps) {
  const [data, setData] = useState<AnalyticsData[]>([])
  const [loading, setLoading] = useState(true)
  const [trends, setTrends] = useState<{
    views: TrendData
    downloads: TrendData
    likes: TrendData
    snippets: TrendData
  }>({
    views: { current: 0, previous: 0, change: 0, isPositive: true },
    downloads: { current: 0, previous: 0, change: 0, isPositive: true },
    likes: { current: 0, previous: 0, change: 0, isPositive: true },
    snippets: { current: 0, previous: 0, change: 0, isPositive: true }
  })
  const [activeTab, setActiveTab] = useState('views')

  useEffect(() => {
    if (userId) {
      fetchAnalyticsData()
    }
  }, [userId])

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)
      
      // Generate mock data for the past 30 days
      const endDate = new Date()
      const startDate = subDays(endDate, 29)
      const dateRange = eachDayOfInterval({ start: startDate, end: endDate })
      
      const mockData: AnalyticsData[] = dateRange.map((date, index) => ({
        date: format(date, 'MMM dd'),
        views: Math.floor(Math.random() * 50) + 10 + index * 2,
        downloads: Math.floor(Math.random() * 20) + 5 + index,
        likes: Math.floor(Math.random() * 15) + 2 + Math.floor(index / 2),
        snippets: Math.floor(Math.random() * 3) + (index % 7 === 0 ? 1 : 0)
      }))

      // Calculate trends (comparing last 15 days to previous 15 days)
      const currentPeriod = mockData.slice(15)
      const previousPeriod = mockData.slice(0, 15)

      const calculateTrend = (current: number[], previous: number[]): TrendData => {
        const currentSum = current.reduce((a, b) => a + b, 0)
        const previousSum = previous.reduce((a, b) => a + b, 0)
        const change = previousSum > 0 ? ((currentSum - previousSum) / previousSum) * 100 : 0
        
        return {
          current: currentSum,
          previous: previousSum,
          change: Math.round(change * 10) / 10,
          isPositive: change >= 0
        }
      }

      setTrends({
        views: calculateTrend(
          currentPeriod.map(d => d.views),
          previousPeriod.map(d => d.views)
        ),
        downloads: calculateTrend(
          currentPeriod.map(d => d.downloads),
          previousPeriod.map(d => d.downloads)
        ),
        likes: calculateTrend(
          currentPeriod.map(d => d.likes),
          previousPeriod.map(d => d.likes)
        ),
        snippets: calculateTrend(
          currentPeriod.map(d => d.snippets),
          previousPeriod.map(d => d.snippets)
        )
      })

      setData(mockData)
    } catch (error) {
      console.error('Error fetching analytics data:', error)
    } finally {
      setLoading(false)
    }
  }

  const TrendIndicator = ({ trend, label, icon: Icon, color }: {
    trend: TrendData
    label: string
    icon: any
    color: string
  }) => (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-medium">{label}</p>
          <p className="text-2xl font-bold">{trend.current.toLocaleString()}</p>
        </div>
      </div>
      <div className="text-right">
        <div className={`flex items-center space-x-1 ${
          trend.isPositive ? 'text-green-600' : 'text-red-600'
        }`}>
          {trend.isPositive ? (
            <TrendingUp className="h-4 w-4" />
          ) : (
            <TrendingDown className="h-4 w-4" />
          )}
          <span className="font-semibold">{Math.abs(trend.change)}%</span>
        </div>
        <p className="text-xs text-muted-foreground">vs. prev period</p>
      </div>
    </div>
  )

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  if (loading) {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Analytics Dashboard</CardTitle>
          <CardDescription>Performance metrics over the past 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="text-center">
              <Activity className="h-8 w-8 animate-pulse mx-auto mb-2 text-muted-foreground" />
              <p className="text-muted-foreground">Loading analytics data...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Analytics Dashboard</CardTitle>
        <CardDescription>Performance metrics and trends over the past 30 days</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Trend Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <TrendIndicator
            trend={trends.views}
            label="Total Views"
            icon={Eye}
            color="bg-blue-100 text-blue-600 dark:bg-blue-900/20"
          />
          <TrendIndicator
            trend={trends.downloads}
            label="Downloads"
            icon={Download}
            color="bg-green-100 text-green-600 dark:bg-green-900/20"
          />
          <TrendIndicator
            trend={trends.likes}
            label="Likes"
            icon={Heart}
            color="bg-red-100 text-red-600 dark:bg-red-900/20"
          />
          <TrendIndicator
            trend={trends.snippets}
            label="New Snippets"
            icon={Activity}
            color="bg-purple-100 text-purple-600 dark:bg-purple-900/20"
          />
        </div>

        {/* Charts */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="views">Views</TabsTrigger>
            <TabsTrigger value="downloads">Downloads</TabsTrigger>
            <TabsTrigger value="likes">Likes</TabsTrigger>
            <TabsTrigger value="snippets">Snippets</TabsTrigger>
          </TabsList>

          <TabsContent value="views" className="mt-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="date" 
                    className="text-muted-foreground"
                    fontSize={12}
                  />
                  <YAxis className="text-muted-foreground" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="views"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fill="url(#viewsGradient)"
                    name="Views"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="downloads" className="mt-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="downloadsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="date" 
                    className="text-muted-foreground"
                    fontSize={12}
                  />
                  <YAxis className="text-muted-foreground" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="downloads"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="url(#downloadsGradient)"
                    name="Downloads"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="likes" className="mt-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="likesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="date" 
                    className="text-muted-foreground"
                    fontSize={12}
                  />
                  <YAxis className="text-muted-foreground" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="likes"
                    stroke="#ef4444"
                    strokeWidth={2}
                    fill="url(#likesGradient)"
                    name="Likes"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="snippets" className="mt-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="snippetsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="date" 
                    className="text-muted-foreground"
                    fontSize={12}
                  />
                  <YAxis className="text-muted-foreground" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="snippets"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    fill="url(#snippetsGradient)"
                    name="New Snippets"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}