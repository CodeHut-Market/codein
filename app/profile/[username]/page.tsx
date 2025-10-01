"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    ArrowLeft,
    Calendar,
    Download,
    Edit3,
    Star,
    Trash2,
    User
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../../../client/contexts/AuthContext";

interface CodeSnippet {
  id: string;
  title: string;
  description: string;
  code: string;
  price: number;
  rating: number;
  author: string;
  authorId: string;
  tags: string[];
  language: string;
  downloads: number;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  username: string;
  email: string;
  bio: string;
  avatar: string;
  totalSnippets: number;
  totalDownloads: number;
  rating: number;
  createdAt: string;
}

interface ProfileData {
  user: User;
  snippets: CodeSnippet[];
}

function CodeSnippetCard({ 
  snippet, 
  isOwner = false, 
  onEdit, 
  onDelete 
}: { 
  snippet: CodeSnippet;
  isOwner?: boolean;
  onEdit?: (snippet: CodeSnippet) => void;
  onDelete?: (snippetId: string) => void;
}) {
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this snippet?')) {
      onDelete?.(snippet.id);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold">{snippet.title}</h3>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              ${snippet.price}
            </Badge>
            {isOwner && (
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit?.(snippet)}
                  className="h-8 w-8 p-0"
                >
                  <Edit3 className="h-3 w-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDelete}
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </div>

        <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
          {snippet.description}
        </p>

        <div className="flex flex-wrap gap-1 mb-4">
          {snippet.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{snippet.rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <Download className="w-4 h-4" />
              <span>{snippet.downloads}</span>
            </div>
          </div>
          <span>{new Date(snippet.createdAt).toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function UserProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const { user: currentUser } = useAuth();
  
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [avatarError, setAvatarError] = useState(false);

  // Check if the current user is viewing their own profile
  const isOwner = currentUser && profileData 
    ? currentUser.username === profileData.user.username || currentUser.username === username
    : false;

  useEffect(() => {
    if (username) {
      fetchUserProfile();
    }
  }, [username]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`/api/users/username/${username}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("User not found");
        } else {
          throw new Error(`Server error: ${response.status}`);
        }
      }

      const data: ProfileData = await response.json();
      setProfileData(data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setError(
        error instanceof Error ? error.message : "Failed to load profile",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarError = () => {
    setAvatarError(true);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/explore">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Profile</h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/explore">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Profile</h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">
              Profile Not Found
            </h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Link href="/explore">
              <Button>Browse Snippets</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { user, snippets } = profileData;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/explore">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Profile</h1>
      </div>

      {/* Profile Header */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar with fallback */}
            <Avatar className="w-24 h-24">
              {user.avatar && !avatarError ? (
                <AvatarImage 
                  src={user.avatar} 
                  alt={user.username}
                  onError={handleAvatarError}
                />
              ) : (
                <AvatarFallback className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                  {getInitials(user.username)}
                </AvatarFallback>
              )}
            </Avatar>

            <div className="flex-1">
              <h1 className="text-3xl font-bold">{user.username}</h1>
              {user.bio && (
                <p className="mt-2 text-muted-foreground max-w-2xl">{user.bio}</p>
              )}

              <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  <span>{user.rating} rating</span>
                </div>
              </div>
            </div>

            {isOwner ? (
              <div className="flex flex-col md:flex-row gap-4">
                <Button variant="outline" asChild>
                  <Link href="/profile/edit">
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row gap-4">
                <Button variant="outline">Follow</Button>
                <Button variant="outline">Message</Button>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold">{snippets.length}</div>
              <div className="text-sm text-muted-foreground">Code Snippets</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{user.totalDownloads}</div>
              <div className="text-sm text-muted-foreground">Total Downloads</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{user.rating}</div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                ${snippets.reduce((sum, s) => sum + s.downloads * s.price, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Earnings</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="space-y-6">
        <Tabs defaultValue="snippets" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="snippets">
              Code Snippets ({snippets.length})
            </TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="snippets">
            <Card>
              <CardHeader>
                <CardTitle>Code Snippets</CardTitle>
              </CardHeader>
              <CardContent>
                {snippets.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {snippets.map((snippet) => (
                      <CodeSnippetCard 
                        key={snippet.id} 
                        snippet={snippet} 
                        isOwner={isOwner}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <User className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground text-lg">No code snippets yet.</p>
                    {isOwner && (
                      <div className="mt-4">
                        <p className="text-muted-foreground mb-4">
                          Start sharing your code with the community!
                        </p>
                        <Link href="/upload">
                          <Button>Upload Your First Snippet</Button>
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            <Card>
              <CardContent className="p-8">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">
                    Reviews & Feedback
                  </h3>
                  <p className="text-muted-foreground">
                    Reviews from buyers will appear here.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardContent className="p-8">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">
                    Recent Activity
                  </h3>
                  <p className="text-muted-foreground">
                    Recent activity and contributions will appear here.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}