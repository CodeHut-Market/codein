"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { 
  Heart, 
  MessageCircle, 
  Download, 
  UserPlus, 
  Eye, 
  Star,
  Activity,
  ExternalLink
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import { supabase, isSupabaseEnabled } from '../../lib/supabaseClient'

interface ActivityItem {
  id: string
  type: 'like' | 'comment' | 'download' | 'follow' | 'view' | 'rating'
  snippetId?: string
  snippetTitle?: string
  userId: string
  username: string
  userAvatar?: string
  timestamp: Date
  metadata?: {
    rating?: number
    commentText?: string
  }
}

interface ActivityFeedProps {
  currentUserId: string
}

export default function ActivityFeed({ currentUserId }: ActivityFeedProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (currentUserId) {
      fetchRecentActivities()
      subscribeToRealTimeUpdates()
    }

    return () => {
      // Cleanup subscriptions when component unmounts
      if (isSupabaseEnabled()) {
        supabase?.removeAllChannels()
      }
    }
  }, [currentUserId])

  const fetchRecentActivities = async () => {
    try {
      setLoading(true)
      
      // Generate mock activity data for now
      // In production, this would query your activities table
      const mockActivities: ActivityItem[] = [
        {
          id: '1',
          type: 'like',
          snippetId: 'snippet-1',
          snippetTitle: 'React Hooks Tutorial',
          userId: 'user-1',
          username: 'johndoe',
          userAvatar: undefined,
          timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        },
        {
          id: '2',
          type: 'comment',
          snippetId: 'snippet-2',
          snippetTitle: 'JavaScript Array Methods',
          userId: 'user-2',
          username: 'jansmith',
          userAvatar: undefined,
          timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
          metadata: {
            commentText: 'Great explanation of map and filter!'
          }
        },
        {
          id: '3',
          type: 'download',
          snippetId: 'snippet-3',
          snippetTitle: 'CSS Grid Layout',
          userId: 'user-3',
          username: 'alexchen',
          userAvatar: undefined,
          timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        },
        {
          id: '4',
          type: 'follow',
          userId: 'user-4',
          username: 'sarahwilson',
          userAvatar: undefined,
          timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
        },
        {
          id: '5',
          type: 'rating',
          snippetId: 'snippet-4',
          snippetTitle: 'Node.js Express Setup',
          userId: 'user-5',
          username: 'mikejohnson',
          userAvatar: undefined,
          timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
          metadata: {
            rating: 5
          }
        },
        {
          id: '6',
          type: 'view',
          snippetId: 'snippet-5',
          snippetTitle: 'Python Data Analysis',
          userId: 'user-6',
          username: 'emmadavis',
          userAvatar: undefined,
          timestamp: new Date(Date.now() - 90 * 60 * 1000), // 1.5 hours ago
        },
        {
          id: '7',
          type: 'like',
          snippetId: 'snippet-6',
          snippetTitle: 'Vue.js Components',
          userId: 'user-7',
          username: 'davidbrown',
          userAvatar: undefined,
          timestamp: new Date(Date.now() - 120 * 60 * 1000), // 2 hours ago
        },
        {
          id: '8',
          type: 'download',
          snippetId: 'snippet-7',
          snippetTitle: 'TypeScript Interfaces',
          userId: 'user-8',
          username: 'lisalee',
          userAvatar: undefined,
          timestamp: new Date(Date.now() - 180 * 60 * 1000), // 3 hours ago
        }
      ]

      setActivities(mockActivities.slice(0, 10))
    } catch (error) {
      console.error('Error fetching activities:', error)
    } finally {
      setLoading(false)
    }
  }

  const subscribeToRealTimeUpdates = () => {
    if (!isSupabaseEnabled()) return

    // Subscribe to real-time updates for activities
    const subscription = supabase
      ?.channel('activities')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'activities',
          filter: `target_user_id=eq.${currentUserId}`
        }, 
        (payload) => {
          console.log('New activity:', payload)
          // Add new activity to the top of the list
          const newActivity = payload.new as ActivityItem
          setActivities(prev => [newActivity, ...prev.slice(0, 9)])
        }
      )
      .subscribe()

    return () => {
      subscription?.unsubscribe()
    }
  }

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'like':
        return <Heart className="h-4 w-4 text-red-500" />
      case 'comment':
        return <MessageCircle className="h-4 w-4 text-blue-500" />
      case 'download':
        return <Download className="h-4 w-4 text-green-500" />
      case 'follow':
        return <UserPlus className="h-4 w-4 text-purple-500" />
      case 'view':
        return <Eye className="h-4 w-4 text-gray-500" />
      case 'rating':
        return <Star className="h-4 w-4 text-yellow-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getActivityText = (activity: ActivityItem) => {
    switch (activity.type) {
      case 'like':
        return (
          <span>
            <span className="font-medium">{activity.username}</span> liked your snippet{' '}
            <Link href={`/snippet/${activity.snippetId}`} className="text-primary hover:underline">
              "{activity.snippetTitle}"
            </Link>
          </span>
        )
      case 'comment':
        return (
          <span>
            <span className="font-medium">{activity.username}</span> commented on{' '}
            <Link href={`/snippet/${activity.snippetId}`} className="text-primary hover:underline">
              "{activity.snippetTitle}"
            </Link>
            {activity.metadata?.commentText && (
              <span className="block text-sm text-muted-foreground mt-1">
                "{activity.metadata.commentText}"
              </span>
            )}
          </span>
        )
      case 'download':
        return (
          <span>
            <span className="font-medium">{activity.username}</span> downloaded{' '}
            <Link href={`/snippet/${activity.snippetId}`} className="text-primary hover:underline">
              "{activity.snippetTitle}"
            </Link>
          </span>
        )
      case 'follow':
        return (
          <span>
            <span className="font-medium">{activity.username}</span> started following you
          </span>
        )
      case 'view':
        return (
          <span>
            <span className="font-medium">{activity.username}</span> viewed{' '}
            <Link href={`/snippet/${activity.snippetId}`} className="text-primary hover:underline">
              "{activity.snippetTitle}"
            </Link>
          </span>
        )
      case 'rating':
        return (
          <span>
            <span className="font-medium">{activity.username}</span> rated{' '}
            <Link href={`/snippet/${activity.snippetId}`} className="text-primary hover:underline">
              "{activity.snippetTitle}"
            </Link>
            {activity.metadata?.rating && (
              <span className="ml-2">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={`inline h-3 w-3 ${
                      i < activity.metadata!.rating! 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </span>
            )}
          </span>
        )
      default:
        return <span>Unknown activity</span>
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest interactions with your snippets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="flex items-start space-x-3 animate-pulse">
                <div className="w-8 h-8 bg-muted rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest interactions with your snippets</CardDescription>
        </div>
        <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
          Live
        </Badge>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No recent activity</p>
            <p className="text-sm text-muted-foreground mt-2">
              Share your snippets to start seeing activity here!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 group">
                <div className="flex-shrink-0">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={activity.userAvatar} alt={activity.username} />
                    <AvatarFallback className="text-xs">
                      {activity.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {getActivityIcon(activity.type)}
                      <div className="text-sm">
                        {getActivityText(activity)}
                      </div>
                    </div>
                    {activity.snippetId && (
                      <Link href={`/snippet/${activity.snippetId}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </Link>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
            
            <div className="pt-4 border-t">
              <Link href="/activity">
                <Button variant="outline" className="w-full">
                  View All Activity
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}