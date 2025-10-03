import { cn } from '@/lib/utils';
import {
    Award,
    Calendar,
    Code,
    Download,
    Edit3,
    Eye,
    Filter,
    Heart,
    MoreVertical,
    Plus,
    Search,
    Settings,
    Share2,
    Trash2,
    TrendingUp,
    User
} from 'lucide-react';
import { useState } from 'react';

interface UserStats {
  totalSnippets: number;
  totalViews: number;
  totalLikes: number;
  totalDownloads: number;
  rank: number;
  joinDate: string;
}

interface RecentSnippet {
  id: string;
  title: string;
  language: string;
  views: number;
  likes: number;
  downloads: number;
  createdAt: string;
  isPublic: boolean;
}

const mockStats: UserStats = {
  totalSnippets: 24,
  totalViews: 1247,
  totalLikes: 89,
  totalDownloads: 156,
  rank: 152,
  joinDate: '2024-01-15'
};

const mockSnippets: RecentSnippet[] = [
  {
    id: '1',
    title: 'React Custom Hook for API Calls',
    language: 'React',
    views: 234,
    likes: 12,
    downloads: 8,
    createdAt: '2024-03-15',
    isPublic: true
  },
  {
    id: '2',
    title: 'CSS Grid Layout Helper',
    language: 'CSS',
    views: 89,
    likes: 5,
    downloads: 3,
    createdAt: '2024-03-14',
    isPublic: true
  },
  {
    id: '3',
    title: 'Python Data Validator',
    language: 'Python',
    views: 167,
    likes: 9,
    downloads: 12,
    createdAt: '2024-03-13',
    isPublic: false
  }
];

export function MobileDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'snippets' | 'analytics'>('overview');
  const [stats, setStats] = useState<UserStats>(mockStats);
  const [snippets, setSnippets] = useState<RecentSnippet[]>(mockSnippets);
  const [selectedSnippets, setSelectedSnippets] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const toggleSnippetSelection = (id: string) => {
    setSelectedSnippets(prev => 
      prev.includes(id) 
        ? prev.filter(snippetId => snippetId !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome back, Developer!</p>
              </div>
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'snippets', label: 'Snippets', icon: Code },
              { id: 'analytics', label: 'Analytics', icon: Calendar },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-colors",
                    activeTab === tab.id
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Code className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalSnippets}</p>
                    <p className="text-xs text-gray-600">Snippets</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Eye className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalViews)}</p>
                    <p className="text-xs text-gray-600">Views</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <Heart className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalLikes}</p>
                    <p className="text-xs text-gray-600">Likes</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Download className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalDownloads}</p>
                    <p className="text-xs text-gray-600">Downloads</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Achievement Card */}
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-6 text-white">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Rank #{stats.rank}</h3>
                  <p className="text-white/90 text-sm">Global developer ranking</p>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Recent Snippets</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {snippets.slice(0, 3).map((snippet) => (
                  <div key={snippet.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{snippet.title}</h4>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                            {snippet.language}
                          </span>
                          <span className="flex items-center space-x-1">
                            <Eye className="w-3 h-3" />
                            <span>{snippet.views}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Heart className="w-3 h-3" />
                            <span>{snippet.likes}</span>
                          </span>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                        {formatDate(snippet.createdAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-gray-100">
                <button
                  onClick={() => setActiveTab('snippets')}
                  className="w-full text-center text-blue-600 font-medium text-sm hover:text-blue-700 transition-colors"
                >
                  View All Snippets
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl py-4 font-medium shadow-sm hover:shadow-md transition-shadow">
                <Plus className="w-5 h-5" />
                <span>New Snippet</span>
              </button>
              <button className="flex items-center justify-center space-x-2 bg-white border border-gray-200 text-gray-700 rounded-xl py-4 font-medium hover:bg-gray-50 transition-colors">
                <TrendingUp className="w-5 h-5" />
                <span>View Stats</span>
              </button>
            </div>
          </div>
        )}

        {/* Snippets Tab */}
        {activeTab === 'snippets' && (
          <div className="space-y-4">
            {/* Search and Filters */}
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search your snippets..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  "p-3 border border-gray-300 rounded-lg transition-colors",
                  showFilters ? "bg-blue-50 border-blue-500 text-blue-600" : "bg-white text-gray-600 hover:bg-gray-50"
                )}
              >
                <Filter className="w-4 h-4" />
              </button>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                      <option value="">All Languages</option>
                      <option value="javascript">JavaScript</option>
                      <option value="python">Python</option>
                      <option value="react">React</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Visibility</label>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                      <option value="">All</option>
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Snippets List */}
            <div className="space-y-3">
              {snippets.map((snippet) => (
                <div key={snippet.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start space-x-3 flex-1 min-w-0">
                        <input
                          type="checkbox"
                          checked={selectedSnippets.includes(snippet.id)}
                          onChange={() => toggleSnippetSelection(snippet.id)}
                          className="mt-1 text-blue-600 focus:ring-blue-500 rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">{snippet.title}</h3>
                          <div className="flex items-center space-x-3 mt-1">
                            <span className={cn(
                              "px-2 py-1 rounded-full text-xs font-medium",
                              snippet.language === 'React' ? "bg-blue-100 text-blue-800" :
                              snippet.language === 'CSS' ? "bg-green-100 text-green-800" :
                              "bg-purple-100 text-purple-800"
                            )}>
                              {snippet.language}
                            </span>
                            <span className={cn(
                              "px-2 py-1 rounded-full text-xs",
                              snippet.isPublic ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                            )}>
                              {snippet.isPublic ? 'Public' : 'Private'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center space-x-1">
                          <Eye className="w-3 h-3" />
                          <span>{snippet.views}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Heart className="w-3 h-3" />
                          <span>{snippet.likes}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Download className="w-3 h-3" />
                          <span>{snippet.downloads}</span>
                        </span>
                      </div>
                      <span>{formatDate(snippet.createdAt)}</span>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="border-t border-gray-100 px-4 py-2">
                    <div className="flex justify-between">
                      <div className="flex space-x-2">
                        <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium">
                          <Edit3 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                        <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-700 text-sm font-medium">
                          <Share2 className="w-3 h-3" />
                          <span>Share</span>
                        </button>
                      </div>
                      <button className="flex items-center space-x-1 text-red-600 hover:text-red-700 text-sm font-medium">
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bulk Actions */}
            {selectedSnippets.length > 0 && (
              <div className="fixed bottom-20 left-4 right-4 bg-white border border-gray-200 rounded-lg p-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">
                    {selectedSnippets.length} selected
                  </span>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 text-sm font-medium text-red-600 hover:text-red-700 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                      Delete
                    </button>
                    <button className="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
                      Export
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Performance Overview</h3>
              
              {/* Simple Chart Placeholder */}
              <div className="h-32 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center mb-4">
                <div className="text-center">
                  <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Chart visualization would go here</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">+12%</p>
                  <p className="text-sm text-gray-600">Views this week</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">+8%</p>
                  <p className="text-sm text-gray-600">Likes this week</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Top Performing Snippets</h3>
              <div className="space-y-3">
                {snippets.map((snippet, index) => (
                  <div key={snippet.id} className="flex items-center space-x-3">
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                      index === 0 ? "bg-yellow-100 text-yellow-800" :
                      index === 1 ? "bg-gray-100 text-gray-600" :
                      "bg-orange-100 text-orange-800"
                    )}>
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{snippet.title}</p>
                      <p className="text-sm text-gray-500">{snippet.views} views</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}