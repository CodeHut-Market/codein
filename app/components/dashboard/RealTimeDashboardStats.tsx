"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { Eye, Heart, Download, Users, TrendingUp, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { useRealTime } from '../../contexts/RealTimeContext';
import { ConnectionStatusIndicator } from '../ui/connection-status';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../../client/contexts/AuthContext';

interface DashboardStats {
  totalSnippets: number;
  totalViews: number;
  totalLikes: number;
  totalDownloads: number;
  totalFollowers: number;
  avgViewsPerSnippet: number;
  engagementRate: number;
  monthlyGrowth: number;
}

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  trend?: number;
  isLoading?: boolean;
  realTimeValue?: number;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon,
  trend,
  isLoading,
  realTimeValue,
  className = ''
}) => {
  const displayValue = realTimeValue !== undefined ? realTimeValue : value;
  const hasPositiveTrend = trend && trend > 0;
  const hasNegativeTrend = trend && trend < 0;
  
  return (
    <Card className={`dashboard-stats-card interactive-feedback transition-all duration-300 hover:shadow-lg transform hover:scale-105 ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="flex items-center gap-2">
          {icon}
          {realTimeValue !== undefined && (
            <Badge variant="secondary" className="text-xs animate-pulse">
              Live
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {isLoading ? (
            <div className="loading-pulse h-8 w-16 rounded"></div>
          ) : (
            typeof displayValue === 'number' 
              ? displayValue.toLocaleString() 
              : displayValue
          )}
        </div>
        
        {trend !== undefined && !isLoading && (
          <div className={`flex items-center gap-1 text-xs mt-1 ${
            hasPositiveTrend ? 'text-green-600' : 
            hasNegativeTrend ? 'text-red-600' : 'text-muted-foreground'
          }`}>
            <TrendingUp size={12} className={hasNegativeTrend ? 'rotate-180' : ''} />
            <span>{Math.abs(trend)}% from last month</span>
          </div>
        )}
        
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};

export const RealTimeDashboardStats: React.FC = () => {
  const { user } = useAuth();
  const { 
    getUserFollowers, 
    getUserSnippetCount, 
    subscribeToUser, 
    unsubscribeFromUser,
    connectionState 
  } = useRealTime();
  // Use the existing supabase client from lib
  
  const [stats, setStats] = useState<DashboardStats>({
    totalSnippets: 0,
    totalViews: 0,
    totalLikes: 0,
    totalDownloads: 0,
    totalFollowers: 0,
    avgViewsPerSnippet: 0,
    engagementRate: 0,
    monthlyGrowth: 0
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [userSnippets, setUserSnippets] = useState<any[]>([]);
  
  // Subscribe to real-time updates for current user
  useEffect(() => {
    if (!user?.id) return;
    
    subscribeToUser(user.id);
    
    return () => {
      unsubscribeFromUser(user.id);
    };
  }, [user?.id, subscribeToUser, unsubscribeFromUser]);
  
  // Fetch initial stats
  useEffect(() => {
    if (!user?.id) return;
    
    const fetchStats = async () => {
      setIsLoading(true);
      
      try {
        // Fetch user's snippets with stats
        const { data: snippets, error: snippetsError } = await supabase
          .from('snippets')
          .select(`
            id,
            title,
            views,
            likes,
            downloads,
            created_at,
            is_public
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (snippetsError) throw snippetsError;
        
        setUserSnippets(snippets || []);
        
        // Calculate stats
        const totalSnippets = snippets?.length || 0;
        const totalViews = snippets?.reduce((sum, s) => sum + (s.views || 0), 0) || 0;
        const totalLikes = snippets?.reduce((sum, s) => sum + (s.likes || 0), 0) || 0;
        const totalDownloads = snippets?.reduce((sum, s) => sum + (s.downloads || 0), 0) || 0;
        
        // Calculate monthly growth
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        
        const currentMonthSnippets = snippets?.filter(s => {
          const date = new Date(s.created_at);
          return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        }).length || 0;
        
        const lastMonthSnippets = snippets?.filter(s => {
          const date = new Date(s.created_at);
          return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
        }).length || 0;
        
        const monthlyGrowth = lastMonthSnippets > 0 
          ? ((currentMonthSnippets - lastMonthSnippets) / lastMonthSnippets) * 100 
          : currentMonthSnippets > 0 ? 100 : 0;
        
        setStats({
          totalSnippets,
          totalViews,
          totalLikes,
          totalDownloads,
          totalFollowers: 0, // Will be updated by real-time
          avgViewsPerSnippet: totalSnippets > 0 ? Math.round(totalViews / totalSnippets) : 0,
          engagementRate: totalViews > 0 ? Math.round((totalLikes / totalViews) * 100) : 0,
          monthlyGrowth: Math.round(monthlyGrowth)
        });
        
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStats();
  }, [user?.id, supabase]);
  
  // Real-time follower count
  const realTimeFollowers = useMemo(() => {
    if (!user?.id) return 0;
    return getUserFollowers(user.id);
  }, [user?.id, getUserFollowers]);
  
  // Real-time snippet count
  const realTimeSnippetCount = useMemo(() => {
    if (!user?.id) return stats.totalSnippets;
    const rtCount = getUserSnippetCount(user.id);
    return rtCount > 0 ? rtCount : stats.totalSnippets;
  }, [user?.id, getUserSnippetCount, stats.totalSnippets]);
  
  // Calculate real-time totals for user's snippets
  const realTimeTotals = useMemo(() => {
    if (!userSnippets.length) return { views: stats.totalViews, likes: stats.totalLikes, downloads: stats.totalDownloads };
    
    // This would require subscribing to each snippet individually
    // For now, we'll use the base stats
    return {
      views: stats.totalViews,
      likes: stats.totalLikes,
      downloads: stats.totalDownloads
    };
  }, [userSnippets, stats]);
  
  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Dashboard Statistics</h2>
        <ConnectionStatusIndicator showLabel size="sm" />
      </div>
      
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Snippets"
          value={stats.totalSnippets}
          realTimeValue={realTimeSnippetCount}
          description="Code snippets created"
          icon={<Activity className="h-4 w-4 text-blue-600" />}
          trend={stats.monthlyGrowth}
          isLoading={isLoading}
          className="stats-card-snippets interactive-element focus-visible"
        />
        
        <StatCard
          title="Total Views"
          value={stats.totalViews}
          realTimeValue={realTimeTotals.views}
          description="Across all snippets"
          icon={<Eye className="h-4 w-4 text-emerald-600" />}
          isLoading={isLoading}
          className="stats-card-views interactive-element focus-visible"
        />
        
        <StatCard
          title="Total Likes"
          value={stats.totalLikes}
          realTimeValue={realTimeTotals.likes}
          description="Hearts from community"
          icon={<Heart className="h-4 w-4 text-rose-500" />}
          isLoading={isLoading}
          className="stats-card-likes interactive-element focus-visible"
        />
        
        <StatCard
          title="Followers"
          value={stats.totalFollowers}
          realTimeValue={realTimeFollowers}
          description="People following you"
          icon={<Users className="h-4 w-4 text-purple-600" />}
          isLoading={isLoading}
          className="stats-card-followers interactive-element focus-visible"
        />
      </div>
      
      {/* Additional Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Downloads"
          value={stats.totalDownloads}
          realTimeValue={realTimeTotals.downloads}
          description="Code downloads"
          icon={<Download className="h-4 w-4 text-orange-600" />}
          isLoading={isLoading}
        />
        
        <StatCard
          title="Avg Views/Snippet"
          value={stats.avgViewsPerSnippet}
          description="Average engagement"
          icon={<TrendingUp className="h-4 w-4 text-cyan-600" />}
          isLoading={isLoading}
        />
        
        <StatCard
          title="Engagement Rate"
          value={`${stats.engagementRate}%`}
          description="Likes per view"
          icon={<Activity className="h-4 w-4 text-indigo-600" />}
          isLoading={isLoading}
        />
      </div>
      
      {/* Connection Status Details */}
      {connectionState.status !== 'connected' && (
        <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <ConnectionStatusIndicator size="md" />
              <div>
                <p className="text-sm font-medium">Real-time updates {connectionState.status}</p>
                <p className="text-xs text-muted-foreground">
                  {connectionState.status === 'connecting' ? 
                    'Connecting to live updates...' : 
                    'Some statistics may not reflect the latest changes'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};