"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowRight,
  ArrowUp,
  Bookmark,
  Calendar,
  Clock,
  Code,
  Crown,
  Eye,
  Gift,
  Globe,
  Heart,
  MessageCircle,
  MessageSquare,
  Search,
  Sparkles,
  Star,
  Trophy,
  TrendingUp,
  Users,
  Zap
} from 'lucide-react'
import { useState } from 'react'

export default function CommunityPage() {
  const [selectedTab, setSelectedTab] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const featuredMembers = [
    {
      name: 'Sarah Chen',
      role: 'Full Stack Developer',
      avatar: 'https://github.com/shadcn.png',
      contributions: 234,
      followers: 1523,
      specialties: ['React', 'Node.js', 'TypeScript'],
      verified: true
    },
    {
      name: 'Alex Rodriguez',
      role: 'Senior Frontend Engineer',
      avatar: 'https://github.com/shadcn.png',
      contributions: 189,
      followers: 987,
      specialties: ['Vue.js', 'CSS', 'Design'],
      verified: true
    },
    {
      name: 'Emily Watson',
      role: 'DevOps Engineer',
      avatar: 'https://github.com/shadcn.png',
      contributions: 156,
      followers: 743,
      specialties: ['Docker', 'AWS', 'Python'],
      verified: false
    }
  ]

  const discussionTopics = [
    {
      id: 1,
      title: 'Best practices for React hooks in 2024',
      author: 'dev_master',
      avatar: 'https://github.com/shadcn.png',
      category: 'React',
      replies: 23,
      views: 1240,
      likes: 45,
      timeAgo: '2 hours ago',
      tags: ['react', 'hooks', 'best-practices'],
      isPinned: true,
      hasNewReplies: true
    },
    {
      id: 2,
      title: 'TypeScript utility types you should know',
      author: 'type_wizard',
      avatar: 'https://github.com/shadcn.png',
      category: 'TypeScript',
      replies: 18,
      views: 890,
      likes: 67,
      timeAgo: '4 hours ago',
      tags: ['typescript', 'utility-types', 'advanced'],
      isPinned: false,
      hasNewReplies: true
    },
    {
      id: 3,
      title: 'Optimizing database queries for performance',
      author: 'sql_guru',
      avatar: 'https://github.com/shadcn.png',
      category: 'Database',
      replies: 31,
      views: 1567,
      likes: 89,
      timeAgo: '6 hours ago',
      tags: ['sql', 'performance', 'optimization'],
      isPinned: false,
      hasNewReplies: false
    },
    {
      id: 4,
      title: 'CSS Grid vs Flexbox: When to use what?',
      author: 'style_master',
      avatar: 'https://github.com/shadcn.png',
      category: 'CSS',
      replies: 42,
      views: 2134,
      likes: 156,
      timeAgo: '8 hours ago',
      tags: ['css', 'layout', 'grid', 'flexbox'],
      isPinned: false,
      hasNewReplies: true
    }
  ]

  const events = [
    {
      id: 1,
      title: 'CodeHut Weekly Challenge: Build a Todo App',
      type: 'Challenge',
      date: '2024-01-15',
      time: '10:00 AM EST',
      participants: 156,
      prize: '$500',
      status: 'active',
      difficulty: 'intermediate'
    },
    {
      id: 2,
      title: 'Live Coding Session: Advanced React Patterns',
      type: 'Workshop',
      date: '2024-01-18',
      time: '2:00 PM EST',
      participants: 89,
      host: 'Sarah Chen',
      status: 'upcoming',
      difficulty: 'advanced'
    },
    {
      id: 3,
      title: 'Code Review Friday: Submit Your Snippets',
      type: 'Review Session',
      date: '2024-01-19',
      time: '3:00 PM EST',
      participants: 67,
      status: 'upcoming',
      difficulty: 'all-levels'
    }
  ]

  const showcaseSnippets = [
    {
      id: 1,
      title: 'Custom React Hook for API Calls',
      author: 'dev_hero',
      avatar: 'https://github.com/shadcn.png',
      language: 'JavaScript',
      views: 2340,
      likes: 89,
      bookmarks: 156,
      tags: ['react', 'hooks', 'api'],
      description: 'A comprehensive custom hook for handling API calls with loading states, error handling, and caching.',
      featured: true
    },
    {
      id: 2,
      title: 'Python Data Validation Decorator',
      author: 'py_expert',
      avatar: 'https://github.com/shadcn.png',
      language: 'Python',
      views: 1890,
      likes: 67,
      bookmarks: 134,
      tags: ['python', 'decorator', 'validation'],
      description: 'Elegant decorator for validating function parameters with type checking and custom rules.',
      featured: true
    },
    {
      id: 3,
      title: 'CSS Animation Library',
      author: 'anim_master',
      avatar: 'https://github.com/shadcn.png',
      language: 'CSS',
      views: 1456,
      likes: 78,
      bookmarks: 98,
      tags: ['css', 'animation', 'library'],
      description: 'Lightweight CSS animation library with smooth transitions and performance optimizations.',
      featured: false
    }
  ]

  const leaderboard = [
    { rank: 1, name: 'CodeMaster', points: 2340, change: '+12' },
    { rank: 2, name: 'DevGuru', points: 2156, change: '+8' },
    { rank: 3, name: 'ByteWizard', points: 1987, change: '-2' },
    { rank: 4, name: 'ScriptNinja', points: 1834, change: '+15' },
    { rank: 5, name: 'AlgoExpert', points: 1723, change: '+5' }
  ]

  const categories = [
    { id: 'all', name: 'All', count: 234 },
    { id: 'react', name: 'React', count: 45 },
    { id: 'typescript', name: 'TypeScript', count: 38 },
    { id: 'python', name: 'Python', count: 56 },
    { id: 'javascript', name: 'JavaScript', count: 67 },
    { id: 'css', name: 'CSS', count: 28 }
  ]

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold">
          Developer <span className="text-primary">Community</span>
        </h1>
        <p className="text-xl text-muted-foreground">
          Connect, learn, and grow with thousands of developers worldwide
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">12,456</div>
            <div className="text-sm text-muted-foreground">Active Members</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Code className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">34,567</div>
            <div className="text-sm text-muted-foreground">Code Snippets</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <MessageCircle className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">8,901</div>
            <div className="text-sm text-muted-foreground">Discussions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Trophy className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">234</div>
            <div className="text-sm text-muted-foreground">Challenges Won</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="discussions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="discussions">Discussions</TabsTrigger>
          <TabsTrigger value="showcase">Showcase</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        {/* Discussions */}
        <TabsContent value="discussions" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Community Discussions
                  </CardTitle>
                  <CardDescription>
                    Ask questions, share knowledge, and connect with other developers
                  </CardDescription>
                </div>
                <Button>Start Discussion</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search discussions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      {category.name} ({category.count})
                    </Button>
                  ))}
                </div>
              </div>

              {/* Discussion List */}
              <div className="space-y-4">
                {discussionTopics.map((topic) => (
                  <Card key={topic.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex space-x-4">
                        <Avatar>
                          <AvatarImage src={topic.avatar} />
                          <AvatarFallback>{topic.author[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                {topic.isPinned && <Zap className="h-4 w-4 text-yellow-500" />}
                                <h3 className="font-semibold hover:text-primary cursor-pointer">
                                  {topic.title}
                                </h3>
                                {topic.hasNewReplies && (
                                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                    New
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                <span>by {topic.author}</span>
                                <span>{topic.timeAgo}</span>
                                <Badge variant="outline">{topic.category}</Badge>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <ArrowUp className="h-4 w-4" />
                                <span>{topic.likes}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Eye className="h-4 w-4" />
                                <span>{topic.views}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <MessageSquare className="h-4 w-4" />
                                <span>{topic.replies}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {topic.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Showcase */}
        <TabsContent value="showcase" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="h-5 w-5 mr-2" />
                Community Showcase
              </CardTitle>
              <CardDescription>
                Discover amazing code snippets from our community members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {showcaseSnippets.map((snippet) => (
                  <Card key={snippet.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-sm">{snippet.title}</h3>
                            {snippet.featured && (
                              <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                <Star className="w-3 h-3 mr-1" />
                                Featured
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{snippet.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={snippet.avatar} />
                          <AvatarFallback>{snippet.author[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground">{snippet.author}</span>
                        <Badge variant="outline" className="text-xs">{snippet.language}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Eye className="h-3 w-3" />
                            <span>{snippet.views}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Heart className="h-3 w-3" />
                            <span>{snippet.likes}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Bookmark className="h-3 w-3" />
                            <span>{snippet.bookmarks}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {snippet.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Events */}
        <TabsContent value="events" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Community Events
              </CardTitle>
              <CardDescription>
                Join coding challenges, workshops, and community activities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {events.map((event) => (
                <Card key={event.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold">{event.title}</h3>
                          <Badge 
                            variant={event.status === 'active' ? 'default' : 'secondary'}
                            className={event.status === 'active' ? 'bg-green-500' : ''}
                          >
                            {event.status}
                          </Badge>
                          <Badge variant="outline">{event.type}</Badge>
                          <Badge variant="outline">{event.difficulty}</Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{event.date}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>{event.participants} participants</span>
                          </div>
                          {event.prize && (
                            <div className="flex items-center space-x-1">
                              <Gift className="h-4 w-4" />
                              <span>{event.prize} prize</span>
                            </div>
                          )}
                          {event.host && (
                            <div className="flex items-center space-x-1">
                              <span>Host: {event.host}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <Button>
                        {event.status === 'active' ? 'Join Now' : 'Register'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Members */}
        <TabsContent value="members" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Featured Members
              </CardTitle>
              <CardDescription>
                Meet the most active and helpful members of our community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {featuredMembers.map((member) => (
                  <Card key={member.name} className="text-center hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="relative mx-auto w-20 h-20">
                          <Avatar className="w-20 h-20">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback>{member.name[0]}</AvatarFallback>
                          </Avatar>
                          {member.verified && (
                            <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1">
                              <Crown className="h-3 w-3 text-white" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold">{member.name}</h3>
                          <p className="text-sm text-muted-foreground">{member.role}</p>
                        </div>
                        <div className="flex justify-center space-x-4 text-sm">
                          <div className="text-center">
                            <div className="font-semibold">{member.contributions}</div>
                            <div className="text-muted-foreground">Snippets</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold">{member.followers}</div>
                            <div className="text-muted-foreground">Followers</div>
                          </div>
                        </div>
                        <div className="flex flex-wrap justify-center gap-1">
                          {member.specialties.map((specialty) => (
                            <Badge key={specialty} variant="secondary" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                        <Button size="sm" className="w-full">
                          Follow
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Leaderboard */}
        <TabsContent value="leaderboard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="h-5 w-5 mr-2" />
                Community Leaderboard
              </CardTitle>
              <CardDescription>
                Top contributors this month based on community engagement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaderboard.map((user) => (
                  <div key={user.rank} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                        {user.rank}
                      </div>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold">{user.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {user.points} points
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={user.change.startsWith('+') ? 'default' : 'secondary'}
                        className={user.change.startsWith('+') ? 'bg-green-500' : 'bg-red-500'}
                      >
                        {user.change}
                      </Badge>
                      {user.rank <= 3 && (
                        <Trophy className={`h-5 w-5 ${user.rank === 1 ? 'text-yellow-500' : user.rank === 2 ? 'text-gray-400' : 'text-amber-600'}`} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* CTA Section */}
      <Card className="bg-gradient-to-r from-primary/10 to-purple-600/10 border-primary/20">
        <CardContent className="text-center py-12">
          <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Connect with developers, share your knowledge, and grow your skills together
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8">
              <MessageCircle className="w-5 h-5 mr-2" />
              Start Discussion
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8">
              <Users className="w-5 h-5 mr-2" />
              Browse Members
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}