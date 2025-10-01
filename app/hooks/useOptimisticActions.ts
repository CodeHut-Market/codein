"use client";

import { useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRealTime } from '../contexts/RealTimeContext';
import { useToastContext } from '../../components/ToastProvider';

export const useOptimisticActions = () => {
  // Use the existing supabase client from lib
  const { applyOptimisticUpdate } = useRealTime();
  const { success, error } = useToastContext();
  
  // Optimistic like/unlike
  const toggleLike = useCallback(async (snippetId: string, currentUserId: string, isCurrentlyLiked: boolean) => {
    if (!supabase) {
      error('Database connection not available');
      return false;
    }

    const updateId = `like-${snippetId}-${Date.now()}`;
    const delta = isCurrentlyLiked ? -1 : 1;
    
    // Apply optimistic update immediately
    applyOptimisticUpdate({
      id: updateId,
      type: 'like',
      targetId: snippetId,
      delta,
      timestamp: Date.now()
    });
    
    try {
      if (isCurrentlyLiked) {
        // Unlike
        const { error } = await supabase
          .from('snippet_likes')
          .delete()
          .eq('snippet_id', snippetId)
          .eq('user_id', currentUserId);
        
        if (error) throw error;
        
        // Update snippet likes count
        await supabase.rpc('decrement_snippet_likes', { snippet_id: snippetId });
      } else {
        // Like
        const { error } = await supabase
          .from('snippet_likes')
          .insert({ snippet_id: snippetId, user_id: currentUserId });
        
        if (error) throw error;
        
        // Update snippet likes count
        await supabase.rpc('increment_snippet_likes', { snippet_id: snippetId });
      }
      
      return !isCurrentlyLiked;
    } catch (error) {
      console.error('Error toggling like:', error);
      
      // Revert optimistic update on error
      applyOptimisticUpdate({
        id: `revert-${updateId}`,
        type: 'like',
        targetId: snippetId,
        delta: -delta,
        timestamp: Date.now()
      });
      
      error(isCurrentlyLiked ? 'Failed to unlike snippet' : 'Failed to like snippet');
      
      return isCurrentlyLiked;
    }
  }, [supabase, applyOptimisticUpdate, success, error]);
  
  // Optimistic follow/unfollow
  const toggleFollow = useCallback(async (targetUserId: string, currentUserId: string, isCurrentlyFollowing: boolean) => {
    if (!supabase) {
      error('Database connection not available');
      return false;
    }

    const updateId = `follow-${targetUserId}-${Date.now()}`;
    const delta = isCurrentlyFollowing ? -1 : 1;
    
    // Apply optimistic update immediately
    applyOptimisticUpdate({
      id: updateId,
      type: 'follow',
      targetId: targetUserId,
      delta,
      timestamp: Date.now()
    });
    
    try {
      if (isCurrentlyFollowing) {
        // Unfollow
        const { error } = await supabase
          .from('follows')
          .delete()
          .eq('follower_id', currentUserId)
          .eq('followed_id', targetUserId);
        
        if (error) throw error;
      } else {
        // Follow
        const { error } = await supabase
          .from('follows')
          .insert({ follower_id: currentUserId, followed_id: targetUserId });
        
        if (error) throw error;
      }
      
      success(isCurrentlyFollowing ? 'Unfollowed successfully' : 'Following successfully');
      
      return !isCurrentlyFollowing;
    } catch (error) {
      console.error('Error toggling follow:', error);
      
      // Revert optimistic update on error
      applyOptimisticUpdate({
        id: `revert-${updateId}`,
        type: 'follow',
        targetId: targetUserId,
        delta: -delta,
        timestamp: Date.now()
      });
      
      error(isCurrentlyFollowing ? 'Failed to unfollow user' : 'Failed to follow user');
      
      return isCurrentlyFollowing;
    }
  }, [supabase, applyOptimisticUpdate, success, error]);
  
  // Optimistic view increment
  const incrementView = useCallback(async (snippetId: string) => {
    if (!supabase) {
      error('Database connection not available');
      return false;
    }

    const updateId = `view-${snippetId}-${Date.now()}`;
    
    // Apply optimistic update immediately
    applyOptimisticUpdate({
      id: updateId,
      type: 'view',
      targetId: snippetId,
      delta: 1,
      timestamp: Date.now()
    });
    
    try {
      const { error } = await supabase.rpc('increment_snippet_views', { snippet_id: snippetId });
      if (error) throw error;
    } catch (error) {
      console.error('Error incrementing view:', error);
      
      // Revert optimistic update on error
      applyOptimisticUpdate({
        id: `revert-${updateId}`,
        type: 'view',
        targetId: snippetId,
        delta: -1,
        timestamp: Date.now()
      });
    }
  }, [supabase, applyOptimisticUpdate]);
  
  // Optimistic download increment
  const incrementDownload = useCallback(async (snippetId: string) => {
    if (!supabase) {
      error('Database connection not available');
      return null;
    }

    const updateId = `download-${snippetId}-${Date.now()}`;
    
    // Apply optimistic update immediately
    applyOptimisticUpdate({
      id: updateId,
      type: 'download',
      targetId: snippetId,
      delta: 1,
      timestamp: Date.now()
    });
    
    try {
      const { error } = await supabase.rpc('increment_snippet_downloads', { snippet_id: snippetId });
      if (error) throw error;
      
      success('Download started');
    } catch (error) {
      console.error('Error incrementing download:', error);
      
      // Revert optimistic update on error
      applyOptimisticUpdate({
        id: `revert-${updateId}`,
        type: 'download',
        targetId: snippetId,
        delta: -1,
        timestamp: Date.now()
      });
      
      error('Failed to track download');
    }
  }, [supabase, applyOptimisticUpdate, success, error]);
  
  // Optimistic comment addition
  const addComment = useCallback(async (snippetId: string, userId: string, content: string) => {
    if (!supabase) {
      error('Database connection not available');
      return null;
    }

    const updateId = `comment-${snippetId}-${Date.now()}`;
    
    // Apply optimistic update immediately
    applyOptimisticUpdate({
      id: updateId,
      type: 'comment',
      targetId: snippetId,
      delta: 1,
      timestamp: Date.now()
    });
    
    try {
      const { data, error } = await supabase
        .from('snippet_comments')
        .insert({
          snippet_id: snippetId,
          user_id: userId,
          content: content.trim()
        })
        .select()
        .single();
      
      if (error) throw error;
      
      success('Comment added successfully');
      return data;
    } catch (error) {
      console.error('Error adding comment:', error);
      
      // Revert optimistic update on error
      applyOptimisticUpdate({
        id: `revert-${updateId}`,
        type: 'comment',
        targetId: snippetId,
        delta: -1,
        timestamp: Date.now()
      });
      
      error('Failed to add comment');
      return null;
    }
  }, [supabase, applyOptimisticUpdate, success, error]);
  
  return {
    toggleLike,
    toggleFollow,
    incrementView,
    incrementDownload,
    addComment
  };
};

// Hook for managing real-time subscriptions in components
export const useRealTimeSubscription = () => {
  const { subscribeToSnippet, unsubscribeFromSnippet, subscribeToUser, unsubscribeFromUser } = useRealTime();
  
  // Subscribe to snippet when component mounts
  const useSnippetSubscription = useCallback((snippetId: string | null) => {
    useEffect(() => {
      if (!snippetId) return;
      
      subscribeToSnippet(snippetId);
      
      return () => {
        unsubscribeFromSnippet(snippetId);
      };
    }, [snippetId]);
  }, [subscribeToSnippet, unsubscribeFromSnippet]);
  
  // Subscribe to user when component mounts
  const useUserSubscription = useCallback((userId: string | null) => {
    useEffect(() => {
      if (!userId) return;
      
      subscribeToUser(userId);
      
      return () => {
        unsubscribeFromUser(userId);
      };
    }, [userId]);
  }, [subscribeToUser, unsubscribeFromUser]);
  
  return {
    useSnippetSubscription,
    useUserSubscription
  };
};

// Import useEffect for the subscription hooks
import { useEffect } from 'react';