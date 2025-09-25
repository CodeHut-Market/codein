"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { CodeSnippet } from "@shared/api"
import {
    Calendar,
    Check,
    Code,
    Edit3,
    Github,
    Heart,
    Link as LinkIcon,
    MapPin,
    PlusCircle,
    Twitter,
    X
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import SnippetCard from '../components/SnippetCard'

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [userSnippets, setUserSnippets] = useState<CodeSnippet[]>([])
  const [loadingSnippets, setLoadingSnippets] = useState(false)
  const [profileData, setProfileData] = useState({
    name: 'Sarah Chen',
    username: 'sarah_codes',
    email: 'sarah.chen@example.com',
    bio: 'Full-stack developer passionate about React, Node.js, and building amazing user experiences.',
    location: 'San Francisco, CA',
    website: 'https://sarahchen.dev',
    github: 'sarah-codes',
    twitter: 'sarah_codes',
  })

  const userStats = {
    snippets: userSnippets.length,
    followers: 1234,
    following: 567,
    views: 23456,
    likes: 3456,
    downloads: 7890,
    joinDate: 'March 2023',
  }

  const fetchUserSnippets = async () => {
    setLoadingSnippets(true)
    try {
      const response = await fetch('/api/snippets/user?userId=user123')
      const data = await response.json()
      setUserSnippets(data.snippets || [])
    } catch (error) {
      console.error('Failed to fetch user snippets:', error)
    } finally {
      setLoadingSnippets(false)
    }
  }

  useEffect(() => {
    fetchUserSnippets()
  }, [])

  const handleSave = () => {
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Header */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="w-24 h-24 mb-4">
                  <AvatarImage src="https://github.com/shadcn.png" alt={profileData.name} />
                  <AvatarFallback className="text-2xl">
                    {profileData.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="w-full">
                  {!isEditing ? (
                    <div className="flex items-center justify-center mb-2">
                      <h1 className="text-3xl font-bold">{profileData.name}</h1>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="ml-2"
                        onClick={() => setIsEditing(true)}
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2 mb-4">
                      <Button onClick={handleSave} size="sm">
                        <Check className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button onClick={handleCancel} variant="outline" size="sm">
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
                
                <p className="text-xl text-muted-foreground">@{profileData.username}</p>
                <p className="text-muted-foreground">{profileData.bio}</p>
                
                <div className="flex flex-wrap gap-2 mt-4 text-sm text-muted-foreground">
                  {profileData.location && (
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {profileData.location}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center mt-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 mr-1" />
                  Joined {userStats.joinDate}
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {profileData.website && (
                    <Link href={profileData.website} className="text-primary hover:underline">
                      <LinkIcon className="w-4 h-4 inline mr-1" />
                      Website
                    </Link>
                  )}
                  {profileData.github && (
                    <Link href={`https://github.com/${profileData.github}`} className="text-primary hover:underline">
                      <Github className="w-4 h-4 inline mr-1" />
                      GitHub
                    </Link>
                  )}
                  {profileData.twitter && (
                    <Link href={`https://twitter.com/${profileData.twitter}`} className="text-primary hover:underline">
                      <Twitter className="w-4 h-4 inline mr-1" />
                      Twitter
                    </Link>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold">{userStats.snippets}</div>
                  <div className="text-sm text-muted-foreground">Snippets</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{userStats.followers}</div>
                  <div className="text-sm text-muted-foreground">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{userStats.following}</div>
                  <div className="text-sm text-muted-foreground">Following</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Snippets */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Code className="w-5 h-5 mr-2" />
                Recent Snippets
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {loadingSnippets ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg animate-pulse">
                    <div className="space-y-1 flex-1">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                  </div>
                ))
              ) : userSnippets.length > 0 ? (
                userSnippets.slice(0, 3).map((snippet) => (
                  <div key={snippet.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="space-y-1 flex-1">
                      <h4 className="font-semibold text-sm line-clamp-1">{snippet.title}</h4>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <Badge variant="outline" className="text-xs">{snippet.language}</Badge>
                        <span>{new Date(snippet.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Code className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">No snippets uploaded yet</p>
                  <Link href="/upload">
                    <Button size="sm" className="mt-2">Upload First Snippet</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="snippets" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="snippets">My Snippets</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="snippets" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>My Snippets ({userSnippets.length})</CardTitle>
                    <Link href="/upload">
                      <Button size="sm">
                        <PlusCircle className="w-4 h-4 mr-2" />
                        New Snippet
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  {loadingSnippets ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Array(4).fill(0).map((_, i) => (
                        <div key={i} className="border rounded-lg p-4 animate-pulse">
                          <div className="h-4 bg-muted rounded mb-2"></div>
                          <div className="h-3 bg-muted rounded w-3/4 mb-2"></div>
                          <div className="h-20 bg-muted rounded"></div>
                        </div>
                      ))}
                    </div>
                  ) : userSnippets.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {userSnippets.map((snippet) => (
                        <SnippetCard
                          key={snippet.id}
                          snippet={snippet}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Code className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No snippets yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Share your first code snippet with the community
                      </p>
                      <Link href="/upload">
                        <Button>
                          <PlusCircle className="w-4 h-4 mr-2" />
                          Upload Your First Snippet
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="favorites" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Favorite Snippets</CardTitle>
                  <CardDescription>
                    Code snippets you've bookmarked for later reference
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No favorites yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start exploring snippets and save your favorites
                    </p>
                    <Link href="/explore">
                      <Button variant="outline">Browse Snippets</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                  <CardDescription>
                    Manage your profile information and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={profileData.username}
                        onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={profileData.website}
                        onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={profileData.bio}
                        onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                        disabled={!isEditing}
                        rows={3}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}