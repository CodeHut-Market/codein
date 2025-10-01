import React, { useState, useEffect } from 'react';
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
      action: () => console.log('Navigate to comment')
    },
    {
      id: '2',
      type: 'snippet_liked',
      title: '"Python Data Analysis" received 3 new likes',
      timestamp: '2024-12-15T09:15:00Z',
      action: () => console.log('View snippet analytics')
    },
    {
      id: '3',
      type: 'snippet_downloaded',
      title: '"TypeScript Utility Types" was downloaded 5 times',
      timestamp: '2024-12-15T08:45:00Z',
      action: () => console.log('View download stats')
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

  const allQuickActions: QuickAction[] = [
    // Create Actions
    {
      id: 'create-snippet',
      title: 'Create New Snippet',
      description: 'Start coding something new',
      icon: <Plus size={20} />,
      action: () => console.log('Create new snippet'),
      color: 'bg-blue-500 hover:bg-blue-600',
      category: 'create',
      shortcut: 'Ctrl+N',
      priority: 1
    },
    {
      id: 'upload-file',
      title: 'Upload Code File',
      description: 'Import existing code',
      icon: <Upload size={20} />,
      action: () => console.log('Upload file'),
      color: 'bg-green-500 hover:bg-green-600',
      category: 'create',
      shortcut: 'Ctrl+U',
      priority: 2
    },
    {
      id: 'continue-draft',
      title: 'Continue Draft',
      description: 'Resume your work in progress',
      icon: <Edit size={20} />,
      action: () => console.log('Continue draft'),
      color: 'bg-orange-500 hover:bg-orange-600',
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
      action: () => console.log('View my snippets'),
      color: 'bg-purple-500 hover:bg-purple-600',
      category: 'manage',
      badge: userContext.snippet_count.toString(),
      priority: 2
    },
    {
      id: 'favorites',
      title: 'Favorites',
      description: 'Your saved snippets',
      icon: <Star size={20} />,
      action: () => console.log('View favorites'),
      color: 'bg-yellow-500 hover:bg-yellow-600',
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
      action: () => console.log('Manage archive'),
      color: 'bg-gray-500 hover:bg-gray-600',
      category: 'manage',
      priority: 4
    },

    // Discover Actions
    {
      id: 'explore',
      title: 'Explore Code',
      description: 'Discover trending snippets',
      icon: <TrendingUp size={20} />,
      action: () => console.log('Explore trending'),
      color: 'bg-pink-500 hover:bg-pink-600',
      category: 'discover',
      priority: 2
    },
    {
      id: 'search',
      title: 'Advanced Search',
      description: 'Find specific code patterns',
      icon: <Search size={20} />,
      action: () => console.log('Advanced search'),
      color: 'bg-indigo-500 hover:bg-indigo-600',
      category: 'discover',
      shortcut: 'Ctrl+K',
      priority: 1
    },
    {
      id: 'recommendations',
      title: 'Recommended',
      description: 'Code suggestions for you',
      icon: <Target size={20} />,
      action: () => console.log('View recommendations'),
      color: 'bg-teal-500 hover:bg-teal-600',
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
      action: () => console.log('View recent activity'),
      color: 'bg-cyan-500 hover:bg-cyan-600',
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
      action: () => console.log('Share collection'),
      color: 'bg-rose-500 hover:bg-rose-600',
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
      action: () => console.log('Give feedback'),
      color: 'bg-emerald-500 hover:bg-emerald-600',
      category: 'engage',
      priority: 4
    },

    // Analyze Actions
    {
      id: 'analytics',
      title: 'View Analytics',
      description: 'Check your code performance',
      icon: <TrendingUp size={20} />,
      action: () => console.log('View analytics'),
      color: 'bg-violet-500 hover:bg-violet-600',
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
      action: () => console.log('View performance'),
      color: 'bg-lime-500 hover:bg-lime-600',
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
      <div className="text-center py-4">
        <h2 className="text-2xl font-bold">
          Good {userContext.time_of_day}, Developer! 
          <Zap className="inline-block ml-2 text-yellow-500" size={24} />
        </h2>
        <p className="text-muted-foreground mt-1">
          What would you like to work on today?
        </p>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {displayActions.map(action => (
          <Card 
            key={action.id} 
            className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-blue-200"
            onClick={action.action}
          >
            <CardContent className="p-4 text-center space-y-3">
              <div className={cn(
                "w-12 h-12 mx-auto rounded-lg flex items-center justify-center text-white transition-transform group-hover:scale-110",
                action.color
              )}>
                {action.icon}
              </div>
              
              <div>
                <h4 className="font-semibold text-sm mb-1 flex items-center justify-center gap-2">
                  {action.title}
                  {action.badge && (
                    <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                      {action.badge}
                    </Badge>
                  )}
                </h4>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {action.description}
                </p>
              </div>

              {action.shortcut && (
                <div className="text-xs text-muted-foreground bg-gray-100 px-2 py-1 rounded">
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
            className="flex items-center gap-2"
          >
            {showAllActions ? (
              <>
                Show Less
                <RefreshCw size={16} className="rotate-180" />
              </>
            ) : (
              <>
                Show More Actions ({relevantActions.length - 6})
                <RefreshCw size={16} />
              </>
            )}
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        {recentActivity.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Clock size={18} />
                  Recent Activity
                </h3>
                <Badge variant="secondary">{recentActivity.length}</Badge>
              </div>
              
              <div className="space-y-3">
                {recentActivity.slice(0, 3).map(activity => (
                  <div 
                    key={activity.id} 
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={activity.action}
                  >
                    <div className="mt-0.5">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
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
                <Button variant="ghost" size="sm" className="w-full mt-3">
                  View All Activity ({recentActivity.length})
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Draft Snippets */}
        {drafts.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Edit size={18} />
                  Continue Your Work
                </h3>
                <Badge variant="secondary">{drafts.length}</Badge>
              </div>
              
              <div className="space-y-3">
                {drafts.slice(0, 3).map(draft => (
                  <div 
                    key={draft.id} 
                    className="p-3 rounded-lg border hover:border-blue-200 cursor-pointer transition-colors"
                    onClick={() => console.log('Open draft', draft.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm truncate flex-1">
                        {draft.title}
                      </h4>
                      <Badge variant="outline" className="text-xs ml-2">
                        {draft.language}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{draft.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
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
                <Button variant="ghost" size="sm" className="w-full mt-3">
                  View All Drafts ({drafts.length})
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Contextual Tips */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Rocket size={20} />
            </div>
            <div>
              <h3 className="font-semibold mb-2">💡 Pro Tip</h3>
              <p className="text-sm text-muted-foreground">
                {userContext.time_of_day === 'morning' 
                  ? "Start your day by reviewing yesterday's activity and setting coding goals!"
                  : userContext.time_of_day === 'afternoon'
                  ? "Perfect time to create new snippets and explore trending code!"
                  : "Wind down by organizing your snippets and planning tomorrow's coding session!"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}