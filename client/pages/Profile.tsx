import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeSnippet, GetUserResponse, UpdateCodeSnippetRequest } from "@shared/api";
import {
    ArrowLeft,
    Calendar,
    Download,
    Edit3,
    Star,
    Trash2,
    User
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

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
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{snippet.title}</h3>
        <div className="flex items-center gap-2">
          <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded text-sm font-medium">
            ${snippet.price}
          </span>
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
                className="h-8 w-8 p-0 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed">
        {snippet.description}
      </p>

      <div className="flex flex-wrap gap-1 mb-4">
        {snippet.tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="text-xs">
            {tag}
          </Badge>
        ))}
      </div>

      <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
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
    </div>
  );
}

export default function Profile() {
  const { username } = useParams<{ username: string }>();
  const { user: currentUser } = useAuth();
  const [profileData, setProfileData] = useState<GetUserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingSnippet, setEditingSnippet] = useState<CodeSnippet | null>(null);
  const [avatarError, setAvatarError] = useState(false);

  const isOwner = currentUser?.username === username;

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

      const data: GetUserResponse = await response.json();
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

  const handleEditSnippet = (snippet: CodeSnippet) => {
    setEditingSnippet(snippet);
  };

  const handleUpdateSnippet = async (snippetId: string, updateData: UpdateCodeSnippetRequest) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/snippets/${snippetId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error('Failed to update snippet');
      }

      // Refresh the profile data to show updated snippet
      await fetchUserProfile();
      setEditingSnippet(null);
    } catch (error) {
      console.error('Error updating snippet:', error);
      alert('Failed to update snippet');
    }
  };

  const handleDeleteSnippet = async (snippetId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/snippets/${snippetId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete snippet');
      }

      // Refresh the profile data to remove deleted snippet
      await fetchUserProfile();
    } catch (error) {
      console.error('Error deleting snippet:', error);
      alert('Failed to delete snippet');
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <Link
                to="/explore"
                className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">CodeHut</h1>
            </div>
          </div>
        </header>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <Link
                to="/explore"
                className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">CodeHut</h1>
            </div>
          </div>
        </header>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Profile Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
            <Button asChild>
              <Link to="/explore">Browse Snippets</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const { user, snippets } = profileData;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link
              to="/explore"
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">CodeHut</h1>
          </div>
        </div>
      </header>

      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar with fallback */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              {user.avatar && !avatarError ? (
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-24 h-24 rounded-full object-cover"
                  onError={handleAvatarError}
                />
              ) : (
                <span className="text-white text-xl font-bold">
                  {getInitials(user.username)}
                </span>
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {user.username}
              </h1>
              {user.bio && (
                <p className="mt-2 text-gray-600 dark:text-gray-300 max-w-2xl">{user.bio}</p>
              )}

              <div className="flex items-center gap-6 mt-4 text-sm text-gray-500 dark:text-gray-400">
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

            {!isOwner && (
              <div className="flex flex-col md:flex-row gap-4">
                <Button variant="outline">Follow</Button>
                <Button variant="outline">Message</Button>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {snippets.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Code Snippets</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {user.totalDownloads}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Total Downloads</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {user.rating}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Average Rating</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                ${snippets.reduce((sum, s) => sum + s.downloads * s.price, 0)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Total Earnings</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="snippets" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto">
            <TabsTrigger value="snippets">
              Code Snippets ({snippets.length})
            </TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="snippets">
            {snippets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {snippets.map((snippet) => (
                  <CodeSnippetCard 
                    key={snippet.id} 
                    snippet={snippet} 
                    isOwner={isOwner}
                    onEdit={handleEditSnippet}
                    onDelete={handleDeleteSnippet}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <User className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                <p className="text-gray-500 dark:text-gray-400 text-lg">No code snippets yet.</p>
                {isOwner && (
                  <div className="mt-4">
                    <p className="text-gray-400 dark:text-gray-500 mb-4">
                      Start sharing your code with the community!
                    </p>
                    <Button asChild>
                      <Link to="/upload">Upload Your First Snippet</Link>
                    </Button>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="reviews">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Reviews & Feedback
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Reviews from buyers will appear here.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Recent Activity
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Recent activity and contributions will appear here.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Edit Snippet Modal */}
      {editingSnippet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Edit Snippet</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const updateData: UpdateCodeSnippetRequest = {
                title: formData.get('title') as string,
                description: formData.get('description') as string,
                code: formData.get('code') as string,
                price: parseFloat(formData.get('price') as string),
                language: formData.get('language') as string,
                tags: (formData.get('tags') as string).split(',').map(tag => tag.trim()),
              };
              handleUpdateSnippet(editingSnippet.id, updateData);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Title</label>
                  <input
                    name="title"
                    type="text"
                    defaultValue={editingSnippet.title}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Description</label>
                  <textarea
                    name="description"
                    defaultValue={editingSnippet.description}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 h-24 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Code</label>
                  <textarea
                    name="code"
                    defaultValue={editingSnippet.code}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 h-48 font-mono text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Price ($)</label>
                    <input
                      name="price"
                      type="number"
                      step="0.01"
                      defaultValue={editingSnippet.price}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Language</label>
                    <input
                      name="language"
                      type="text"
                      defaultValue={editingSnippet.language}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Tags (comma-separated)</label>
                  <input
                    name="tags"
                    type="text"
                    defaultValue={editingSnippet.tags.join(', ')}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="react, javascript, hooks"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingSnippet(null)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Update Snippet
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
