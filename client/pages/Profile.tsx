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
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-3 sm:gap-0">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">{snippet.title}</h3>
        <div className="flex items-center justify-between sm:justify-end gap-2">
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

      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed line-clamp-3">
        {snippet.description}
      </p>

      <div className="flex flex-wrap gap-1 mb-4">
        {snippet.tags.slice(0, 4).map((tag) => (
          <Badge key={tag} variant="secondary" className="text-xs">
            {tag}
          </Badge>
        ))}
        {snippet.tags.length > 4 && (
          <Badge variant="secondary" className="text-xs">
            +{snippet.tags.length - 4}
          </Badge>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>{snippet.rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <Download className="w-4 h-4" />
            <span>{snippet.downloads}</span>
          </div>
        </div>
        <span className="text-xs sm:text-sm">{new Date(snippet.createdAt).toLocaleDateString()}</span>
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
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/explore"
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">CodeHut</h1>
          </div>
        </div>
      </header>

      {/* Profile Header - MEGA DRAMATIC NEW DESIGN */}
      <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 border-b border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Animated background effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 via-green-500/30 to-yellow-500/30 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-60 h-60 bg-white/20 rounded-full blur-3xl animate-bounce"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-yellow-300/30 rounded-full blur-2xl"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-8 sm:py-12 text-white">
          <div className="text-center mb-8">
            <h1 className="text-6xl sm:text-7xl font-black mb-4 drop-shadow-2xl animate-pulse">
              🌟 DEVELOPER PROFILE 🌟
            </h1>
            <p className="text-2xl font-bold text-white/90">
              ⚡ CODING SUPERSTAR SHOWCASE ⚡
            </p>
          </div>
          
          <div className="flex flex-col gap-4 sm:gap-6">
            {/* Avatar and basic info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
              {/* Avatar with fallback */}
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-2xl transform hover:scale-110 transition-all duration-500">
                <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
                {user.avatar && !avatarError ? (
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="relative z-10 w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-white/50"
                    onError={handleAvatarError}
                  />
                ) : (
                  <span className="relative z-10 text-white text-4xl sm:text-5xl font-black drop-shadow-lg">
                    {getInitials(user.username)}
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 drop-shadow-2xl animate-pulse">
                  🚀 {user.username} 🚀
                </h1>
                {user.bio && (
                  <p className="mt-2 text-white/90 text-lg sm:text-xl leading-relaxed bg-white/20 backdrop-blur-md rounded-2xl p-4">{user.bio}</p>
                )}

                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 mt-6 text-lg text-white/90">
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-4 py-2">
                    <Calendar className="w-5 h-5" />
                    <span className="font-bold">
                      Joined {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-4 py-2">
                    <Star className="w-5 h-5" />
                    <span className="font-bold">{user.rating} ⭐ RATING!</span>
                  </div>
                </div>
              </div>

              {!isOwner && (
                <div className="flex flex-row sm:flex-col gap-2 sm:gap-3 w-full sm:w-auto">
                  <Button variant="outline" className="flex-1 sm:flex-none bg-white/20 border-white/40 text-white hover:bg-white/30 backdrop-blur-md font-bold text-lg py-3">💫 Follow</Button>
                  <Button variant="outline" className="flex-1 sm:flex-none bg-white/20 border-white/40 text-white hover:bg-white/30 backdrop-blur-md font-bold text-lg py-3">💬 Message</Button>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:bg-gray-700 rounded-lg p-3 sm:p-4 text-center border border-blue-100 dark:border-gray-600">
                <div className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {snippets.length}
                </div>
                <div className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 font-medium">Code Snippets</div>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:bg-gray-700 rounded-lg p-3 sm:p-4 text-center border border-emerald-100 dark:border-gray-600">
                <div className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {user.totalDownloads}
                </div>
                <div className="text-xs sm:text-sm text-emerald-700 dark:text-emerald-300 font-medium">Downloads</div>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:bg-gray-700 rounded-lg p-3 sm:p-4 text-center border border-amber-100 dark:border-gray-600">
                <div className="text-xl sm:text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {user.rating}
                </div>
                <div className="text-xs sm:text-sm text-amber-700 dark:text-amber-300 font-medium">Avg Rating</div>
              </div>
              <div className="bg-gradient-to-br from-violet-50 to-purple-50 dark:bg-gray-700 rounded-lg p-3 sm:p-4 text-center border border-violet-100 dark:border-gray-600">
                <div className="text-xl sm:text-2xl font-bold text-violet-600 dark:text-violet-400">
                  ${snippets.reduce((sum, s) => sum + s.downloads * s.price, 0)}
                </div>
                <div className="text-xs sm:text-sm text-violet-700 dark:text-violet-300 font-medium">Earnings</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        <Tabs defaultValue="snippets" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/70 backdrop-blur-sm border border-gray-200/30 rounded-xl p-1">
            <TabsTrigger 
              value="snippets"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white rounded-lg font-medium text-xs sm:text-sm"
            >
              📝 Snippets ({snippets.length})
            </TabsTrigger>
            <TabsTrigger 
              value="reviews"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white rounded-lg font-medium text-xs sm:text-sm"
            >
              ⭐ Reviews
            </TabsTrigger>
            <TabsTrigger 
              value="activity"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-lg font-medium text-xs sm:text-sm"
            >
              📊 Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="snippets">
            {snippets.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
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
              <div className="text-center py-8 sm:py-12">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full flex items-center justify-center mb-4">
                  <User className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">No code snippets yet</h3>
                <p className="text-gray-500 text-sm sm:text-base mb-4 px-4">
                  {isOwner ? "Start sharing your code with the community!" : "This user hasn't shared any snippets yet."}
                </p>
                {isOwner && (
                  <Button asChild className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600">
                    <Link to="/upload">
                      📤 Upload Your First Snippet
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="reviews">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
              <div className="text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full flex items-center justify-center mb-4">
                  <Star className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Reviews & Feedback
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                  Reviews from buyers will appear here.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
              <div className="text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gradient-to-br from-violet-400 to-purple-400 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Recent Activity
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
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
