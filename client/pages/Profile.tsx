import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { CodeSnippet, GetUserResponse, UpdateCodeSnippetRequest } from "@shared/api";
import {
  ArrowLeft,
  Calendar,
  Download,
  Edit3,
  Star,
  Trash2
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

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
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900">{snippet.title}</h3>
        <div className="flex items-center gap-2">
          <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-medium">
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
                className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4 leading-relaxed">
        {snippet.description}
      </p>

      <div className="flex flex-wrap gap-1 mb-4">
        {snippet.tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="text-xs">
            {tag}
          </Badge>
        ))}
      </div>

      <div className="flex justify-between items-center text-sm text-gray-500">
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

  const isOwner = currentUser?.username === username;

  useEffect(() => {
    if (username) {
      fetchUserProfile();
    }
  }, [username]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/users/username/${username}`);

      if (!response.ok) {
        throw new Error("User not found");
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
      const token = localStorage.getItem('auth_token');
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
      const token = localStorage.getItem('auth_token');
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <Link
                to="/explore"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">CodeHut</h1>
            </div>
          </div>
        </header>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <Link
                to="/explore"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">CodeHut</h1>
            </div>
          </div>
        </header>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Profile Not Found
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link
              to="/explore"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">CodeHut</h1>
          </div>
        </div>
      </header>

      {/* Profile Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <img
              src={user.avatar}
              alt={user.username}
              className="w-24 h-24 rounded-full bg-gray-200"
            />

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">
                {user.username}
              </h1>
              {user.bio && (
                <p className="mt-2 text-gray-600 max-w-2xl">{user.bio}</p>
              )}

              <div className="flex items-center gap-6 mt-4 text-sm text-gray-500">
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

            <div className="flex flex-col md:flex-row gap-4">
              <Button variant="outline">Follow</Button>
              <Button variant="outline">Message</Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">
                {snippets.length}
              </div>
              <div className="text-sm text-gray-600">Code Snippets</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">
                {user.totalDownloads}
              </div>
              <div className="text-sm text-gray-600">Total Downloads</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">
                {user.rating}
              </div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">
                ${snippets.reduce((sum, s) => sum + s.downloads * s.price, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Earnings</div>
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
                <p className="text-gray-500 text-lg">No code snippets yet.</p>
                {isOwner && (
                  <p className="text-gray-400 mt-2">
                    Start sharing your code with the community!
                  </p>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="reviews">
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Reviews & Feedback
                </h3>
                <p className="text-gray-600">
                  Reviews from buyers will appear here.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Recent Activity
                </h3>
                <p className="text-gray-600">
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
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Edit Snippet</h3>
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
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    name="title"
                    type="text"
                    defaultValue={editingSnippet.title}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    name="description"
                    defaultValue={editingSnippet.description}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 h-24"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Code</label>
                  <textarea
                    name="code"
                    defaultValue={editingSnippet.code}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 h-48 font-mono text-sm"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Price ($)</label>
                    <input
                      name="price"
                      type="number"
                      step="0.01"
                      defaultValue={editingSnippet.price}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Language</label>
                    <input
                      name="language"
                      type="text"
                      defaultValue={editingSnippet.language}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
                  <input
                    name="tags"
                    type="text"
                    defaultValue={editingSnippet.tags.join(', ')}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
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
