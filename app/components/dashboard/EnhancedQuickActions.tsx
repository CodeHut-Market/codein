import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Plus, 
  Upload, 
  Search, 
  Star, 
  Download, 
  Share2, 
  Copy, 
  Edit, 
  Trash2,
  Eye,
  Heart,
  MessageSquare,
  TrendingUp,
  Bookmark,
  Archive,
  RefreshCw,
  Zap,
  Rocket,
  Target,
  Clock,
  CheckCircle
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { toast } from '@/hooks/use-toast';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
  color: string;
  category: 'create' | 'manage' | 'discover' | 'engage' | 'analyze';
  shortcut?: string;
  badge?: string;
  priority: number;
  contextual?: boolean;
  conditions?: {
    has_snippets?: boolean;
    has_drafts?: boolean;
    has_favorites?: boolean;
    time_of_day?: 'morning' | 'afternoon' | 'evening';
    recent_activity?: boolean;
  };
}

interface RecentActivity {
  id: string;
  type: 'snippet_created' | 'snippet_liked' | 'snippet_downloaded' | 'comment_received';
  title: string;
  timestamp: string;
  action: () => void;
}

interface DraftSnippet {
  id: string;
  title: string;
  language: string;
  last_modified: string;
  progress: number;
}

export default function EnhancedQuickActions() {
  const router = useRouter();
  const [userContext, setUserContext] = useState<{
    has_snippets: boolean;
    has_drafts: boolean;
    has_favorites: boolean;
    snippet_count: number;
    draft_count: number;
    favorite_count: number;
    recent_activity: boolean;
    time_of_day: 'morning' | 'afternoon' | 'evening';
  }>({
    has_snippets: true,
    has_drafts: true,
    has_favorites: true,
    snippet_count: 78,
    draft_count: 3,
    favorite_count: 12,
    recent_activity: true,
    time_of_day: 'afternoon'
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [drafts, setDrafts] = useState<DraftSnippet[]>([]);
  const [showAllActions, setShowAllActions] = useState(false);

  const mockRecentActivity: RecentActivity[] = [
    {
      id: '1',
      type: 'comment_received',
      title: 'New comment on "React Custom Hook"',
      timestamp: '2024-12-15T10:30:00Z',
      action: () => router.push('/snippet/react-custom-hook?tab=comments')
    },
    {
      id: '2',
      type: 'snippet_liked',
      title: '"Python Data Analysis" received 3 new likes',
      timestamp: '2024-12-15T09:15:00Z',
      action: () => router.push('/snippet/python-data-analysis?tab=analytics')
    },
    {
      id: '3',
      type: 'snippet_downloaded',
      title: '"TypeScript Utility Types" was downloaded 5 times',
      timestamp: '2024-12-15T08:45:00Z',
      action: () => router.push('/snippet/typescript-utility-types?tab=analytics')
    }
  ];

  const mockDrafts: DraftSnippet[] = [
    {
      id: '1',
      title: 'Advanced React Patterns',
      language: 'javascript',
      last_modified: '2024-12-14T16:20:00Z',
      progress: 75
    },
    {
      id: '2',
      title: 'Python Machine Learning Pipeline',
      language: 'python',
      last_modified: '2024-12-13T14:10:00Z',
      progress: 45
    },
    {
      id: '3',
      title: 'CSS Grid Layout Examples',
      language: 'css',
      last_modified: '2024-12-12T11:30:00Z',
      progress: 20
    }
  ];

  useEffect(() => {
    setRecentActivity(mockRecentActivity);
    setDrafts(mockDrafts);
    
    // Set time of day context
    const hour = new Date().getHours();
    const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
    setUserContext(prev => ({ ...prev, time_of_day: timeOfDay }));
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        const relevantActions = getRelevantActions();
        const action = relevantActions.find(a => {
          if (!a.shortcut) return false;
          const shortcut = a.shortcut.toLowerCase();
          const key = event.key.toLowerCase();
          
          if (shortcut.includes('ctrl+n') && key === 'n') return true;
          if (shortcut.includes('ctrl+u') && key === 'u') return true;
          if (shortcut.includes('ctrl+k') && key === 'k') return true;
          
          return false;
        });
        
        if (action) {
          event.preventDefault();
          action.action();
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [drafts]);

  const allQuickActions: QuickAction[] = [
    // Create Actions
    {
      id: 'create-snippet',
      title: 'Create New Snippet',
      description: 'Start coding something new',
      icon: <Plus size={20} />,
      action: () => router.push('/upload'),
      color: 'bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 hover:from-blue-600 hover:via-blue-700 hover:to-indigo-700',
      category: 'create',
      shortcut: 'Ctrl+N',
      priority: 1
    },
    {
      id: 'upload-file',
      title: 'Upload Code File',
      description: 'Import existing code',
      icon: <Upload size={20} />,
      action: () => router.push('/upload'),
      color: 'bg-gradient-to-br from-emerald-500 via-green-600 to-teal-600 hover:from-emerald-600 hover:via-green-700 hover:to-teal-700',
      category: 'create',
      shortcut: 'Ctrl+U',
      priority: 2
    },
    {
      id: 'continue-draft',
      title: 'Continue Draft',
      description: 'Resume your work in progress',
      icon: <Edit size={20} />,
      action: () => {
        // Show draft selection modal or navigate to most recent draft
        if (drafts.length > 0) {
          router.push(`/upload?draft=${drafts[0].id}`);
        } else {
          router.push('/upload');
        }
      },
      color: 'bg-gradient-to-br from-orange-500 via-amber-600 to-yellow-600 hover:from-orange-600 hover:via-amber-700 hover:to-yellow-700',
      category: 'create',
      badge: userContext.draft_count.toString(),
      priority: 1,
      contextual: true,
      conditions: { has_drafts: true }
    },

    // Manage Actions
    {
      id: 'my-snippets',
      title: 'My Snippets',
      description: 'View and manage your code',
      icon: <Eye size={20} />,
      action: () => router.push('/profile?tab=snippets'),
      color: 'bg-gradient-to-br from-purple-500 via-violet-600 to-indigo-600 hover:from-purple-600 hover:via-violet-700 hover:to-indigo-700',
      category: 'manage',
      badge: userContext.snippet_count.toString(),
      priority: 2
    },
    {
      id: 'favorites',
      title: 'Favorites',
      description: 'Your saved snippets',
      icon: <Star size={20} />,
      action: () => router.push('/favorites'),
      color: 'bg-gradient-to-br from-yellow-500 via-amber-500 to-orange-500 hover:from-yellow-600 hover:via-amber-600 hover:to-orange-600',
      category: 'manage',
      badge: userContext.favorite_count.toString(),
      priority: 3,
      contextual: true,
      conditions: { has_favorites: true }
    },
    {
      id: 'archive',
      title: 'Archive Manager',
      description: 'Organize old snippets',
      icon: <Archive size={20} />,
      action: () => router.push('/profile?tab=archived'),
      color: 'bg-gradient-to-br from-slate-500 via-gray-600 to-zinc-600 hover:from-slate-600 hover:via-gray-700 hover:to-zinc-700',
      category: 'manage',
      priority: 4
    },

    // Discover Actions
    {
      id: 'explore',
      title: 'Explore Code',
      description: 'Discover trending snippets',
      icon: <TrendingUp size={20} />,
      action: () => router.push('/explore'),
      color: 'bg-gradient-to-br from-pink-500 via-rose-600 to-red-600 hover:from-pink-600 hover:via-rose-700 hover:to-red-700',
      category: 'discover',
      priority: 2
    },
    {
      id: 'search',
      title: 'Advanced Search',
      description: 'Find specific code patterns',
      icon: <Search size={20} />,
      action: () => router.push('/explore?search=advanced'),
      color: 'bg-gradient-to-br from-indigo-500 via-blue-600 to-cyan-600 hover:from-indigo-600 hover:via-blue-700 hover:to-cyan-700',
      category: 'discover',
      shortcut: 'Ctrl+K',
      priority: 1
    },
    {
      id: 'recommendations',
      title: 'Recommended',
      description: 'Code suggestions for you',
      icon: <Target size={20} />,
      action: () => router.push('/explore?filter=recommended'),
      color: 'bg-gradient-to-br from-teal-500 via-emerald-600 to-green-600 hover:from-teal-600 hover:via-emerald-700 hover:to-green-700',
      category: 'discover',
      priority: 3,
      contextual: true,
      conditions: { has_snippets: true }
    },

    // Engage Actions
    {
      id: 'recent-activity',
      title: 'Recent Activity',
      description: 'Check latest interactions',
      icon: <Clock size={20} />,
      action: () => router.push('/dashboard?tab=activity'),
      color: 'bg-gradient-to-br from-cyan-500 via-teal-600 to-blue-600 hover:from-cyan-600 hover:via-teal-700 hover:to-blue-700',
      category: 'engage',
      badge: recentActivity.length.toString(),
      priority: 1,
      contextual: true,
      conditions: { recent_activity: true }
    },
    {
      id: 'share-collection',
      title: 'Share Collection',
      description: 'Share your best snippets',
      icon: <Share2 size={20} />,
      action: async () => {
        try {
          const profileUrl = `${window.location.origin}/profile`;
          await navigator.clipboard.writeText(profileUrl);
          toast({
            title: "Profile URL Copied! 🎉",
            description: "Your profile link has been copied to clipboard",
            variant: "default",
          });
        } catch (error) {
          toast({
            title: "Copy Failed",
            description: "Unable to copy to clipboard. Please try again.",
            variant: "destructive",
          });
        }
      },
      color: 'bg-gradient-to-br from-rose-500 via-pink-600 to-fuchsia-600 hover:from-rose-600 hover:via-pink-700 hover:to-fuchsia-700',
      category: 'engage',
      priority: 3,
      contextual: true,
      conditions: { has_snippets: true }
    },
    {
      id: 'feedback',
      title: 'Give Feedback',
      description: 'Help others improve their code',
      icon: <MessageSquare size={20} />,
      action: () => router.push('/community'),
      color: 'bg-gradient-to-br from-emerald-500 via-green-600 to-lime-600 hover:from-emerald-600 hover:via-green-700 hover:to-lime-700',
      category: 'engage',
      priority: 4
    },

    // Analyze Actions
    {
      id: 'analytics',
      title: 'View Analytics',
      description: 'Check your code performance',
      icon: <TrendingUp size={20} />,
      action: () => router.push('/dashboard?tab=analytics'),
      color: 'bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-600 hover:from-violet-600 hover:via-purple-700 hover:to-indigo-700',
      category: 'analyze',
      priority: 2,
      contextual: true,
      conditions: { has_snippets: true }
    },
    {
      id: 'performance',
      title: 'Performance Report',
      description: 'Monthly progress summary',
      icon: <CheckCircle size={20} />,
      action: () => router.push('/dashboard?tab=performance'),
      color: 'bg-gradient-to-br from-lime-500 via-green-600 to-emerald-600 hover:from-lime-600 hover:via-green-700 hover:to-emerald-700',
      category: 'analyze',
      priority: 3
    }
  ];

  const getRelevantActions = () => {
    return allQuickActions.filter(action => {
      if (!action.contextual) return true;
      if (!action.conditions) return true;

      const conditions = action.conditions;
      
      if (conditions.has_snippets && !userContext.has_snippets) return false;
      if (conditions.has_drafts && !userContext.has_drafts) return false;
      if (conditions.has_favorites && !userContext.has_favorites) return false;
      if (conditions.recent_activity && !userContext.recent_activity) return false;
      if (conditions.time_of_day && conditions.time_of_day !== userContext.time_of_day) return false;

      return true;
    }).sort((a, b) => a.priority - b.priority);
  };

  const relevantActions = getRelevantActions();
  const displayActions = showAllActions ? relevantActions : relevantActions.slice(0, 6);

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'snippet_created': return <Plus size={16} className="text-blue-500" />;
      case 'snippet_liked': return <Heart size={16} className="text-red-500" />;
      case 'snippet_downloaded': return <Download size={16} className="text-green-500" />;
      case 'comment_received': return <MessageSquare size={16} className="text-purple-500" />;
      default: return <Clock size={16} className="text-gray-500" />;
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Context-Aware Greeting */}
      <div className="text-center py-6 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-purple-50/50 to-pink-50/50 rounded-2xl -z-10" />
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Good {userContext.time_of_day}, Developer! 
          <Zap className="inline-block ml-2 text-yellow-500 animate-pulse" size={28} />
        </h2>
        <p className="text-muted-foreground mt-2 text-lg">
          What would you like to work on today?
        </p>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {displayActions.map(action => (
          <Card 
            key={action.id} 
            className="group hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 cursor-pointer border border-gray-200/50 hover:border-white/30 bg-white/70 backdrop-blur-sm hover:scale-105 hover:-translate-y-1"
            onClick={action.action}
          >
            <CardContent className="p-6 text-center space-y-4 relative overflow-hidden">
              {/* Background gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-gray-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className={cn(
                "w-14 h-14 mx-auto rounded-xl flex items-center justify-center text-white transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-lg group-hover:shadow-xl",
                action.color
              )}>
                {action.icon}
              </div>
              
              <div className="relative z-10">
                <h4 className="font-bold text-sm mb-2 flex items-center justify-center gap-2 group-hover:text-gray-800 transition-colors">
                  {action.title}
                  {action.badge && (
                    <Badge variant="secondary" className="text-xs px-2 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-0">
                      {action.badge}
                    </Badge>
                  )}
                </h4>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {action.description}
                </p>
              </div>

              {action.shortcut && (
                <div className="text-xs text-gray-600 bg-gradient-to-r from-gray-100 to-gray-200 px-3 py-1.5 rounded-full font-mono border border-gray-300/50 shadow-sm">
                  {action.shortcut}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Show More/Less Button */}
      {relevantActions.length > 6 && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => setShowAllActions(!showAllActions)}
            className="flex items-center gap-2 bg-gradient-to-r from-white to-gray-50 hover:from-blue-50 hover:to-purple-50 border-gray-200 hover:border-blue-200 text-gray-700 hover:text-blue-700 transition-all duration-300 px-6 py-3 rounded-xl shadow-sm hover:shadow-md"
          >
            {showAllActions ? (
              <>
                Show Less
                <RefreshCw size={16} className="rotate-180 transition-transform duration-300" />
              </>
            ) : (
              <>
                Show More Actions ({relevantActions.length - 6})
                <RefreshCw size={16} className="transition-transform duration-300" />
              </>
            )}
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        {recentActivity.length > 0 && (
          <Card className="bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/50 border border-blue-100/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold flex items-center gap-2 text-blue-800">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg">
                    <Clock size={18} />
                  </div>
                  Recent Activity
                </h3>
                <Badge variant="secondary" className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-0">
                  {recentActivity.length}
                </Badge>
              </div>
              
              <div className="space-y-3">
                {recentActivity.slice(0, 3).map(activity => (
                  <div 
                    key={activity.id} 
                    className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-white to-blue-50/30 hover:from-blue-50 hover:to-indigo-50 cursor-pointer transition-all duration-200 border border-transparent hover:border-blue-200/50 shadow-sm hover:shadow-md"
                    onClick={activity.action}
                  >
                    <div className="mt-0.5">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate text-gray-800">
                        {activity.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {getTimeAgo(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {recentActivity.length > 3 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-blue-700 border border-blue-200/50"
                  onClick={() => router.push('/dashboard?tab=activity')}
                >
                  View All Activity ({recentActivity.length})
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Draft Snippets */}
        {drafts.length > 0 && (
          <Card className="bg-gradient-to-br from-orange-50/50 via-white to-amber-50/50 border border-orange-100/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold flex items-center gap-2 text-orange-800">
                  <div className="p-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg">
                    <Edit size={18} />
                  </div>
                  Continue Your Work
                </h3>
                <Badge variant="secondary" className="bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 border-0">
                  {drafts.length}
                </Badge>
              </div>
              
              <div className="space-y-3">
                {drafts.slice(0, 3).map(draft => (
                  <div 
                    key={draft.id} 
                    className="p-4 rounded-xl bg-gradient-to-r from-white to-orange-50/30 hover:from-orange-50 hover:to-amber-50 cursor-pointer transition-all duration-200 border border-transparent hover:border-orange-200/50 shadow-sm hover:shadow-md"
                    onClick={() => router.push(`/upload?draft=${draft.id}`)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold text-sm truncate flex-1 text-gray-800">
                        {draft.title}
                      </h4>
                      <Badge variant="outline" className="text-xs ml-2 bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 border-orange-200">
                        {draft.language}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground font-medium">Progress</span>
                        <span className="font-bold text-orange-700">{draft.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 shadow-inner">
                        <div 
                          className="bg-gradient-to-r from-orange-500 to-amber-500 h-2 rounded-full transition-all duration-500 shadow-sm"
                          style={{ width: `${draft.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Modified {getTimeAgo(draft.last_modified)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {drafts.length > 3 && (
                <Button variant="ghost" size="sm" className="w-full mt-4 bg-gradient-to-r from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 text-orange-700 border border-orange-200/50">
                  View All Drafts ({drafts.length})
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Contextual Tips */}
      <Card className="bg-gradient-to-br from-purple-50/80 via-blue-50/80 to-indigo-50/80 border border-purple-200/50 shadow-lg hover:shadow-xl transition-shadow duration-300 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100/20 via-transparent to-blue-100/20" />
        <CardContent className="p-8 relative z-10">
          <div className="flex items-start gap-5">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl shadow-lg">
              <Rocket size={24} />
            </div>
            <div>
              <h3 className="font-bold mb-3 text-lg flex items-center gap-2">
                <span className="text-2xl">💡</span>
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Pro Tip
                </span>
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {userContext.time_of_day === 'morning' 
                  ? "Start your day by reviewing yesterday's activity and setting coding goals! ☀️"
                  : userContext.time_of_day === 'afternoon'
                  ? "Perfect time to create new snippets and explore trending code! 🚀"
                  : "Wind down by organizing your snippets and planning tomorrow's coding session! 🌙"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}