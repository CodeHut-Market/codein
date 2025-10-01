"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

// Types for real-time data
export interface RealTimeMetrics {
  snippetViews: Record<string, number>;
  snippetLikes: Record<string, number>;
  snippetDownloads: Record<string, number>;
  snippetComments: Record<string, number>;
  userFollowers: Record<string, number>;
  userSnippetCounts: Record<string, number>;
}

export interface OptimisticUpdate {
  id: string;
  type: 'like' | 'follow' | 'view' | 'download' | 'comment';
  targetId: string;
  delta: number;
  timestamp: number;
}

export interface ConnectionState {
  status: 'connecting' | 'connected' | 'disconnected' | 'error';
  lastConnected?: Date;
  errorMessage?: string;
  reconnectAttempts: number;
}

export interface RealTimeContextType {
  // Metrics
  metrics: RealTimeMetrics;
  
  // Connection state
  connectionState: ConnectionState;
  
  // Optimistic updates
  applyOptimisticUpdate: (update: OptimisticUpdate) => void;
  
  // Subscription management
  subscribeToSnippet: (snippetId: string) => void;
  unsubscribeFromSnippet: (snippetId: string) => void;
  subscribeToUser: (userId: string) => void;
  unsubscribeFromUser: (userId: string) => void;
  
  // Utility functions
  getSnippetViews: (snippetId: string) => number;
  getSnippetLikes: (snippetId: string) => number;
  getSnippetDownloads: (snippetId: string) => number;
  getSnippetComments: (snippetId: string) => number;
  getUserFollowers: (userId: string) => number;
  getUserSnippetCount: (userId: string) => number;
  
  // Force refresh
  refreshMetrics: () => Promise<void>;
}

const RealTimeContext = createContext<RealTimeContextType | undefined>(undefined);

export const useRealTime = () => {
  const context = useContext(RealTimeContext);
  if (!context) {
    throw new Error('useRealTime must be used within a RealTimeProvider');
  }
  return context;
};

export const RealTimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use the existing supabase client from lib
  
  // Early return if supabase is not available
  if (!supabase) {
    console.warn('Supabase client not available for real-time features');
  }

  // State management
  const [metrics, setMetrics] = useState<RealTimeMetrics>({
    snippetViews: {},
    snippetLikes: {},
    snippetDownloads: {},
    snippetComments: {},
    userFollowers: {},
    userSnippetCounts: {}
  });
  
  const [connectionState, setConnectionState] = useState<ConnectionState>({
    status: 'connecting',
    reconnectAttempts: 0
  });
  
  const [optimisticUpdates, setOptimisticUpdates] = useState<OptimisticUpdate[]>([]);
  
  // Refs for subscription management
  const channelsRef = useRef<Map<string, RealtimeChannel>>(new Map());
  const subscribedSnippetsRef = useRef<Set<string>>(new Set());
  const subscribedUsersRef = useRef<Set<string>>(new Set());
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Apply optimistic update
  const applyOptimisticUpdate = useCallback((update: OptimisticUpdate) => {
    setOptimisticUpdates(prev => [...prev.filter(u => u.id !== update.id), update]);
    
    // Apply the update immediately to metrics
    setMetrics(prev => {
      const newMetrics = { ...prev };
      
      switch (update.type) {
        case 'like':
          newMetrics.snippetLikes = {
            ...prev.snippetLikes,
            [update.targetId]: (prev.snippetLikes[update.targetId] || 0) + update.delta
          };
          break;
        case 'follow':
          newMetrics.userFollowers = {
            ...prev.userFollowers,
            [update.targetId]: (prev.userFollowers[update.targetId] || 0) + update.delta
          };
          break;
        case 'view':
          newMetrics.snippetViews = {
            ...prev.snippetViews,
            [update.targetId]: (prev.snippetViews[update.targetId] || 0) + update.delta
          };
          break;
        case 'download':
          newMetrics.snippetDownloads = {
            ...prev.snippetDownloads,
            [update.targetId]: (prev.snippetDownloads[update.targetId] || 0) + update.delta
          };
          break;
        case 'comment':
          newMetrics.snippetComments = {
            ...prev.snippetComments,
            [update.targetId]: (prev.snippetComments[update.targetId] || 0) + update.delta
          };
          break;
      }
      
      return newMetrics;
    });
    
    // Clean up old optimistic updates after 10 seconds
    setTimeout(() => {
      setOptimisticUpdates(prev => prev.filter(u => u.id !== update.id));
    }, 10000);
  }, []);
  
  // Connection management
  const handleConnectionChange = useCallback((status: ConnectionState['status'], error?: string) => {
    setConnectionState(prev => ({
      ...prev,
      status,
      errorMessage: error,
      lastConnected: status === 'connected' ? new Date() : prev.lastConnected,
      reconnectAttempts: status === 'connected' ? 0 : prev.reconnectAttempts
    }));
  }, []);
  
  // Auto-reconnect logic
  const attemptReconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    setConnectionState(prev => ({
      ...prev,
      status: 'connecting',
      reconnectAttempts: prev.reconnectAttempts + 1
    }));
    
    // Exponential backoff: 1s, 2s, 4s, 8s, max 30s
    const delay = Math.min(1000 * Math.pow(2, connectionState.reconnectAttempts), 30000);
    
    reconnectTimeoutRef.current = setTimeout(() => {
      // Re-establish all subscriptions
      const snippetIds = Array.from(subscribedSnippetsRef.current);
      const userIds = Array.from(subscribedUsersRef.current);
      
      snippetIds.forEach(id => subscribeToSnippet(id));
      userIds.forEach(id => subscribeToUser(id));
    }, delay);
  }, [connectionState.reconnectAttempts]);
  
  // Database event handlers
  const handleSnippetUpdate = useCallback((payload: RealtimePostgresChangesPayload<any>) => {
    const { new: newRecord, old: oldRecord, eventType } = payload;
    
    if (eventType === 'UPDATE' && newRecord && oldRecord) {
      setMetrics(prev => {
        const newMetrics = { ...prev };
        
        // Update views
        if (newRecord.views !== oldRecord.views) {
          newMetrics.snippetViews = {
            ...prev.snippetViews,
            [newRecord.id]: newRecord.views
          };
        }
        
        // Update likes
        if (newRecord.likes !== oldRecord.likes) {
          newMetrics.snippetLikes = {
            ...prev.snippetLikes,
            [newRecord.id]: newRecord.likes
          };
        }
        
        // Update downloads
        if (newRecord.downloads !== oldRecord.downloads) {
          newMetrics.snippetDownloads = {
            ...prev.snippetDownloads,
            [newRecord.id]: newRecord.downloads
          };
        }
        
        return newMetrics;
      });
    }
  }, []);
  
  const handleLikeUpdate = useCallback((payload: RealtimePostgresChangesPayload<any>) => {
    const { new: newRecord, old: oldRecord, eventType } = payload;
    
    if (eventType === 'INSERT' && newRecord) {
      setMetrics(prev => ({
        ...prev,
        snippetLikes: {
          ...prev.snippetLikes,
          [newRecord.snippet_id]: (prev.snippetLikes[newRecord.snippet_id] || 0) + 1
        }
      }));
    } else if (eventType === 'DELETE' && oldRecord) {
      setMetrics(prev => ({
        ...prev,
        snippetLikes: {
          ...prev.snippetLikes,
          [oldRecord.snippet_id]: Math.max((prev.snippetLikes[oldRecord.snippet_id] || 0) - 1, 0)
        }
      }));
    }
  }, []);
  
  const handleFollowUpdate = useCallback((payload: RealtimePostgresChangesPayload<any>) => {
    const { new: newRecord, old: oldRecord, eventType } = payload;
    
    if (eventType === 'INSERT' && newRecord) {
      setMetrics(prev => ({
        ...prev,
        userFollowers: {
          ...prev.userFollowers,
          [newRecord.followed_id]: (prev.userFollowers[newRecord.followed_id] || 0) + 1
        }
      }));
    } else if (eventType === 'DELETE' && oldRecord) {
      setMetrics(prev => ({
        ...prev,
        userFollowers: {
          ...prev.userFollowers,
          [oldRecord.followed_id]: Math.max((prev.userFollowers[oldRecord.followed_id] || 0) - 1, 0)
        }
      }));
    }
  }, []);
  
  const handleCommentUpdate = useCallback((payload: RealtimePostgresChangesPayload<any>) => {
    const { new: newRecord, old: oldRecord, eventType } = payload;
    
    if (eventType === 'INSERT' && newRecord) {
      setMetrics(prev => ({
        ...prev,
        snippetComments: {
          ...prev.snippetComments,
          [newRecord.snippet_id]: (prev.snippetComments[newRecord.snippet_id] || 0) + 1
        }
      }));
    } else if (eventType === 'DELETE' && oldRecord) {
      setMetrics(prev => ({
        ...prev,
        snippetComments: {
          ...prev.snippetComments,
          [oldRecord.snippet_id]: Math.max((prev.snippetComments[oldRecord.snippet_id] || 0) - 1, 0)
        }
      }));
    }
  }, []);
  
  // Subscription functions
  const subscribeToSnippet = useCallback((snippetId: string) => {
    if (!supabase || subscribedSnippetsRef.current.has(snippetId)) return;
    
    const channelName = `snippet-${snippetId}`;
    const channel = supabase.channel(channelName);
    
    // Subscribe to snippet updates
    channel
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'snippets',
        filter: `id=eq.${snippetId}`
      }, handleSnippetUpdate)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'snippet_likes',
        filter: `snippet_id=eq.${snippetId}`
      }, handleLikeUpdate)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'snippet_comments',
        filter: `snippet_id=eq.${snippetId}`
      }, handleCommentUpdate)
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          handleConnectionChange('connected');
        } else if (status === 'CHANNEL_ERROR') {
          handleConnectionChange('error', 'Failed to subscribe to snippet updates');
          attemptReconnect();
        }
      });
    
    channelsRef.current.set(channelName, channel);
    subscribedSnippetsRef.current.add(snippetId);
  }, [supabase, handleSnippetUpdate, handleLikeUpdate, handleCommentUpdate, handleConnectionChange, attemptReconnect]);
  
  const unsubscribeFromSnippet = useCallback((snippetId: string) => {
    const channelName = `snippet-${snippetId}`;
    const channel = channelsRef.current.get(channelName);
    
    if (channel) {
      supabase.removeChannel(channel);
      channelsRef.current.delete(channelName);
      subscribedSnippetsRef.current.delete(snippetId);
    }
  }, [supabase]);
  
  const subscribeToUser = useCallback((userId: string) => {
    if (!supabase || subscribedUsersRef.current.has(userId)) return;
    
    const channelName = `user-${userId}`;
    const channel = supabase.channel(channelName);
    
    // Subscribe to follow updates
    channel
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'follows',
        filter: `followed_id=eq.${userId}`
      }, handleFollowUpdate)
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          handleConnectionChange('connected');
        } else if (status === 'CHANNEL_ERROR') {
          handleConnectionChange('error', 'Failed to subscribe to user updates');
          attemptReconnect();
        }
      });
    
    channelsRef.current.set(channelName, channel);
    subscribedUsersRef.current.add(userId);
  }, [supabase, handleFollowUpdate, handleConnectionChange, attemptReconnect]);
  
  const unsubscribeFromUser = useCallback((userId: string) => {
    const channelName = `user-${userId}`;
    const channel = channelsRef.current.get(channelName);
    
    if (channel) {
      supabase.removeChannel(channel);
      channelsRef.current.delete(channelName);
      subscribedUsersRef.current.delete(userId);
    }
  }, [supabase]);
  
  // Utility functions
  const getSnippetViews = useCallback((snippetId: string) => metrics.snippetViews[snippetId] || 0, [metrics.snippetViews]);
  const getSnippetLikes = useCallback((snippetId: string) => metrics.snippetLikes[snippetId] || 0, [metrics.snippetLikes]);
  const getSnippetDownloads = useCallback((snippetId: string) => metrics.snippetDownloads[snippetId] || 0, [metrics.snippetDownloads]);
  const getSnippetComments = useCallback((snippetId: string) => metrics.snippetComments[snippetId] || 0, [metrics.snippetComments]);
  const getUserFollowers = useCallback((userId: string) => metrics.userFollowers[userId] || 0, [metrics.userFollowers]);
  const getUserSnippetCount = useCallback((userId: string) => metrics.userSnippetCounts[userId] || 0, [metrics.userSnippetCounts]);
  
  // Refresh metrics from database
  const refreshMetrics = useCallback(async () => {
    try {
      // Fetch current metrics for subscribed items
      const snippetIds = Array.from(subscribedSnippetsRef.current);
      const userIds = Array.from(subscribedUsersRef.current);
      
      if (snippetIds.length > 0) {
        const { data: snippets } = await supabase
          .from('snippets')
          .select('id, views, likes, downloads')
          .in('id', snippetIds);
        
        if (snippets) {
          setMetrics(prev => {
            const newMetrics = { ...prev };
            snippets.forEach(snippet => {
              newMetrics.snippetViews[snippet.id] = snippet.views || 0;
              newMetrics.snippetLikes[snippet.id] = snippet.likes || 0;
              newMetrics.snippetDownloads[snippet.id] = snippet.downloads || 0;
            });
            return newMetrics;
          });
        }
        
        // Fetch comment counts
        const { data: comments } = await supabase
          .from('snippet_comments')
          .select('snippet_id')
          .in('snippet_id', snippetIds);
        
        if (comments) {
          const commentCounts: Record<string, number> = {};
          comments.forEach(comment => {
            commentCounts[comment.snippet_id] = (commentCounts[comment.snippet_id] || 0) + 1;
          });
          
          setMetrics(prev => ({
            ...prev,
            snippetComments: { ...prev.snippetComments, ...commentCounts }
          }));
        }
      }
      
      if (userIds.length > 0) {
        // Fetch follower counts
        const { data: follows } = await supabase
          .from('follows')
          .select('followed_id')
          .in('followed_id', userIds);
        
        if (follows) {
          const followerCounts: Record<string, number> = {};
          follows.forEach(follow => {
            followerCounts[follow.followed_id] = (followerCounts[follow.followed_id] || 0) + 1;
          });
          
          setMetrics(prev => ({
            ...prev,
            userFollowers: { ...prev.userFollowers, ...followerCounts }
          }));
        }
        
        // Fetch snippet counts
        const { data: snippetCounts } = await supabase
          .from('snippets')
          .select('user_id')
          .in('user_id', userIds);
        
        if (snippetCounts) {
          const counts: Record<string, number> = {};
          snippetCounts.forEach(snippet => {
            counts[snippet.user_id] = (counts[snippet.user_id] || 0) + 1;
          });
          
          setMetrics(prev => ({
            ...prev,
            userSnippetCounts: { ...prev.userSnippetCounts, ...counts }
          }));
        }
      }
    } catch (error) {
      console.error('Failed to refresh metrics:', error);
    }
  }, [supabase]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clean up all channels
      channelsRef.current.forEach(channel => {
        supabase.removeChannel(channel);
      });
      channelsRef.current.clear();
      
      // Clear reconnect timeout
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [supabase]);
  
  // Initial connection setup
  useEffect(() => {
    handleConnectionChange('connected');
  }, [handleConnectionChange]);
  
  const contextValue: RealTimeContextType = {
    metrics,
    connectionState,
    applyOptimisticUpdate,
    subscribeToSnippet,
    unsubscribeFromSnippet,
    subscribeToUser,
    unsubscribeFromUser,
    getSnippetViews,
    getSnippetLikes,
    getSnippetDownloads,
    getSnippetComments,
    getUserFollowers,
    getUserSnippetCount,
    refreshMetrics
  };
  
  return (
    <RealTimeContext.Provider value={contextValue}>
      {children}
    </RealTimeContext.Provider>
  );
};