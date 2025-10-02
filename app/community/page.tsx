"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowRight,
  Bookmark,
  Calendar,
  Code,
  Crown,
  Eye,
  Gift,
  Globe,
  Heart,
  MessageCircle,
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

  // Community statistics
  const communityStats = [
    { icon: Users, value: '25,000+', label: 'Active Members', color: 'text-blue-500' },
    { icon: Code, value: '50,000+', label: 'Code Snippets', color: 'text-green-500' },
    { icon: MessageCircle, value: '100,000+', label: 'Discussions', color: 'text-purple-500' },
    { icon: Star, value: '500,000+', label: 'Stars Given', color: 'text-yellow-500' }
  ]

  // Featured community categories
  const categories = [
    { name: 'Web Development', icon: Globe, count: '12.5k', trending: true },
    { name: 'Mobile Apps', icon: Users, count: '8.3k', trending: false },
    { name: 'Data Science', icon: TrendingUp, count: '6.7k', trending: true },
    { name: 'DevOps', icon: Zap, count: '4.2k', trending: false },
    { name: 'AI & ML', icon: Sparkles, count: '9.1k', trending: true },
    { name: 'Game Dev', icon: Trophy, count: '3.8k', trending: false }
  ]

  // Featured members data
  const featuredMembers = [
    {
      name: 'Sarah Chen',
      role: 'Full Stack Architect',
      avatar: 'https://github.com/shadcn.png',
      contributions: 234,
      followers: 1523,
      specialties: ['React', 'Node.js', 'TypeScript'],
      badge: 'Expert'
    },
    {
      name: 'Alex Rodriguez',
      role: 'UI/UX Engineer',
      avatar: 'https://github.com/shadcn.png',
      contributions: 189,
      followers: 987,
      specialties: ['Vue.js', 'Design Systems', 'CSS'],
      badge: 'Mentor'
    },
    {
      name: 'Michael Kim',
      role: 'DevOps Specialist',
      avatar: 'https://github.com/shadcn.png',
      contributions: 156,
      followers: 743,
      specialties: ['Docker', 'AWS', 'Kubernetes'],
      badge: 'Contributor'
    },
    {
      name: 'Emma Wilson',
      role: 'Mobile Developer',
      avatar: 'https://github.com/shadcn.png',
      contributions: 201,
      followers: 1234,
      specialties: ['React Native', 'Flutter', 'iOS'],
      badge: 'Rising Star'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-6 py-20">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4 mr-2" />
              Join 25,000+ developers worldwide
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Developer
              <span className="block bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
                Community
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Connect with passionate developers, share knowledge, and build amazing projects together. 
              Your journey to becoming a better developer starts here.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-4 h-auto">
                <Users className="w-5 h-5 mr-2" />
                Join Community
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-4 h-auto backdrop-blur-sm">
                <Globe className="w-5 h-5 mr-2" />
                Explore Content
              </Button>
            </div>
          </div>
        </div>
        
        {/* Floating elements for visual appeal */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full backdrop-blur-sm animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-yellow-400/20 rounded-full backdrop-blur-sm animate-pulse"></div>
        <div className="absolute top-1/2 right-20 w-12 h-12 bg-pink-400/20 rounded-full backdrop-blur-sm animate-pulse"></div>
      </section>

      <div className="container mx-auto px-6 py-16 space-y-16">
        {/* Community Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {communityStats.map((stat, index) => (
            <Card key={index} className="text-center group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-md">
              <CardContent className="py-8">
                <stat.icon className={`h-12 w-12 mx-auto mb-4 ${stat.color} group-hover:scale-110 transition-transform`} />
                <div className="text-3xl font-bold mb-2 bg-gradient-to-br from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Featured Categories */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Popular Categories
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover content across different domains and find your community
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-0 shadow-md overflow-hidden">
                <CardContent className="p-6 relative">
                  {category.trending && (
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
                        Trending
                      </Badge>
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl text-white group-hover:scale-110 transition-transform">
                        <category.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{category.name}</h3>
                        <p className="text-muted-foreground">{category.count} members</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Search Section */}
        <section className="max-w-3xl mx-auto">
          <Card className="border-0 shadow-xl bg-gradient-to-r from-white to-gray-50">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <h3 className="text-2xl font-bold">Find Your Tribe</h3>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    placeholder="Search discussions, members, or topics..."
                    className="pl-12 text-lg py-4 h-auto border-0 bg-white shadow-md focus:shadow-lg transition-shadow"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Main Content Tabs */}
        <section>
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-8">
            <div className="flex justify-center">
              <TabsList className="grid w-full max-w-md grid-cols-2 bg-muted/50 p-1">
                <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="members" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  Top Members
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-12">
              {/* Recent Discussions Preview */}
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-center">Latest Discussions</h3>
                <div className="grid gap-6">
                  {[
                    {
                      title: "Best practices for React state management in 2024",
                      author: "react_expert",
                      replies: 23,
                      likes: 45,
                      tags: ["react", "state-management", "hooks"],
                      time: "2 hours ago"
                    },
                    {
                      title: "Python vs JavaScript for backend development",
                      author: "fullstack_dev",
                      replies: 67,
                      likes: 89,
                      tags: ["python", "javascript", "backend"],
                      time: "4 hours ago"
                    },
                    {
                      title: "Building scalable microservices with Docker",
                      author: "devops_ninja",
                      replies: 34,
                      likes: 56,
                      tags: ["docker", "microservices", "devops"],
                      time: "1 day ago"
                    }
                  ].map((discussion, index) => (
                    <Card key={index} className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-md">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <h4 className="font-bold text-xl group-hover:text-primary transition-colors">
                            {discussion.title}
                          </h4>
                          
                          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">{discussion.author[0].toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{discussion.author}</span>
                            </div>
                            <span className="flex items-center">
                              <MessageCircle className="h-4 w-4 mr-1" />
                              {discussion.replies}
                            </span>
                            <span className="flex items-center">
                              <Heart className="h-4 w-4 mr-1" />
                              {discussion.likes}
                            </span>
                            <span>{discussion.time}</span>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            {discussion.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Members Tab */}
            <TabsContent value="members" className="space-y-8">
              <div className="text-center space-y-4">
                <h3 className="text-3xl font-bold">Community Champions</h3>
                <p className="text-xl text-muted-foreground">Meet our most active and helpful community members</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredMembers.map((member, index) => (
                  <Card key={index} className="text-center group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-md">
                    <CardContent className="p-6 space-y-6">
                      <div className="relative">
                        <Avatar className="h-20 w-20 mx-auto ring-4 ring-purple-100 group-hover:ring-purple-200 transition-all">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback className="text-lg font-bold bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <Badge className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
                          {member.badge}
                        </Badge>
                      </div>
                      
                      <div>
                        <h4 className="font-bold text-lg">{member.name}</h4>
                        <p className="text-muted-foreground">{member.role}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="font-bold text-lg text-primary">{member.contributions}</div>
                          <div className="text-muted-foreground">Contributions</div>
                        </div>
                        <div>
                          <div className="font-bold text-lg text-primary">{member.followers}</div>
                          <div className="text-muted-foreground">Followers</div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap justify-center gap-2">
                        {member.specialties.slice(0, 2).map((specialty) => (
                          <Badge key={specialty} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                        {member.specialties.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{member.specialties.length - 2}
                          </Badge>
                        )}
                      </div>
                      
                      <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 border-0">
                        Connect
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* CTA Section */}
        <section className="relative overflow-hidden">
          <Card className="border-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white shadow-2xl">
            <CardContent className="relative p-12 text-center space-y-8">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold">
                  Ready to Join?
                </h2>
                <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                  Connect with developers, share your knowledge, and grow your skills together. 
                  Your coding journey starts here.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-4 h-auto">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Start Discussion
                  </Button>
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-4 h-auto backdrop-blur-sm">
                    <Users className="w-5 h-5 mr-2" />
                    Browse Community
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}