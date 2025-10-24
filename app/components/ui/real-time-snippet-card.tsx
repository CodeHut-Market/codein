"use client";

import { Bookmark, Download, Eye, Heart, MessageCircle, Share2 } from 'lucide-react';
import Link from 'next/link';
import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../../client/contexts/AuthContext';
import { useRealTime } from '../../contexts/RealTimeContext';
import { useOptimisticActions } from '../../hooks/useOptimisticActions';
import { supabase } from '../../lib/supabaseClient';
import { cn } from '../../lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { GuestSnippetModal } from './guest-snippet-modal';
import { Badge } from './badge';
import { Button } from './button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';

interface RealTimeSnippetCardProps {
  snippet: {
    id: string;
    title: string;
    description?: string;
    language: string;
    user_id: string;
    user?: {
      username?: string;
      avatar_url?: string;
      display_name?: string;
    };
    views?: number;
    likes?: number;
    downloads?: number;
    created_at: string;
    updated_at: string;
    is_public: boolean;
    tags?: string[];
  };
  showActions?: boolean;
  compact?: boolean;
  className?: string;
}
  export const RealTimeSnippetCard = (props: RealTimeSnippetCardProps) => {
    const { snippet, showActions = true, compact = false, className = '' } = props;
    const { user } = useAuth();
    const [showGuestModal, setShowGuestModal] = useState(false);
    const { getSnippetViews, getSnippetLikes, getSnippetDownloads, getSnippetComments, subscribeToSnippet, unsubscribeFromSnippet } = useRealTime();
    const { toggleLike, incrementView, incrementDownload } = useOptimisticActions();
    const [isLiked, setIsLiked] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [hasViewed, setHasViewed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
      subscribeToSnippet(snippet.id);
      return () => { unsubscribeFromSnippet(snippet.id); };
    }, [snippet.id, subscribeToSnippet, unsubscribeFromSnippet]);
    useEffect(() => {
      if (!user?.id) return;
      const checkUserInteractions = async () => {
        try {
          const { data: likeData } = await supabase
            .from('snippet_likes')
            .select('id')
            .eq('snippet_id', snippet.id)
            .eq('user_id', user.id)
            .maybeSingle();
          setIsLiked(!!likeData);
          const { data: bookmarkData, error: bookmarkError } = await supabase
            .from('user_bookmarks')
            .select('id')
            .eq('snippet_id', snippet.id)
            .eq('user_id', user.id)
            .maybeSingle();
          if (!bookmarkError || bookmarkError.code !== 'PGRST116') {
            setIsBookmarked(!!bookmarkData);
          }
        } catch {}
      };
      checkUserInteractions();
    }, [user?.id, snippet.id]);
    const realTimeViews = getSnippetViews(snippet.id) || snippet.views || 0;
    const realTimeLikes = getSnippetLikes(snippet.id) || snippet.likes || 0;
    const realTimeDownloads = getSnippetDownloads(snippet.id) || snippet.downloads || 0;
    const realTimeComments = getSnippetComments(snippet.id) || 0;
    const displayName = snippet.user?.display_name || snippet.user?.username || 'Anonymous';
    const handleLike = useCallback(async (e: React.MouseEvent) => {
      e.preventDefault(); e.stopPropagation();
      if (!user?.id || isLoading) return;
      setIsLoading(true);
      try {
        const newLikedState = await toggleLike(snippet.id, user.id, isLiked);
        setIsLiked(newLikedState);
      } finally { setIsLoading(false); }
    }, [user?.id, snippet.id, isLiked, toggleLike, isLoading]);
    const handleView = useCallback(() => {
      if (!user?.id) { setShowGuestModal(true); return; }
      if (!hasViewed && user.id !== snippet.user_id) {
        incrementView(snippet.id); setHasViewed(true);
      }
    }, [hasViewed, user?.id, snippet.id, snippet.user_id, incrementView]);
    const handleDownload = useCallback(async (e: React.MouseEvent) => {
      e.preventDefault(); e.stopPropagation();
      if (!user?.id || isLoading) return;
      setIsLoading(true);
      try {
        await incrementDownload(snippet.id);
        window.open(`/api/snippets/${snippet.id}/download`, '_blank');
      } finally { setIsLoading(false); }
    }, [user?.id, snippet.id, incrementDownload, isLoading]);
    const handleBookmark = useCallback(async (e: React.MouseEvent) => {
      e.preventDefault(); e.stopPropagation();
      if (!user?.id || isLoading) return;
      setIsLoading(true);
      try {
        if (isBookmarked) {
          await supabase.from('user_bookmarks').delete().eq('snippet_id', snippet.id).eq('user_id', user.id);
          setIsBookmarked(false);
        } else {
          await supabase.from('user_bookmarks').insert({ snippet_id: snippet.id, user_id: user.id });
          setIsBookmarked(true);
        }
      } finally { setIsLoading(false); }
    }, [user?.id, snippet.id, isBookmarked, supabase, isLoading]);
    const handleShare = useCallback(async (e: React.MouseEvent) => {
      e.preventDefault(); e.stopPropagation();
      const url = `${window.location.origin}/snippet/${snippet.id}`;
      if (navigator.share) {
        try { await navigator.share({ title: snippet.title, text: snippet.description, url }); } catch { navigator.clipboard.writeText(url); }
      } else { navigator.clipboard.writeText(url); }
    }, [snippet.id, snippet.title, snippet.description]);
    return (
      <Card className={cn("group transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 cursor-pointer border-2 border-gray-200 dark:border-gray-700 overflow-hidden text-gray-900 dark:text-gray-100", compact && "p-4", className)} onClick={handleView}>
        {user?.id ? (
          <Link href={`/snippet/${snippet.id}`} className="block">
            <CardHeader className={cn("space-y-1 border-b border-gray-100 dark:border-gray-800", compact && "pb-2")}> 
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <CardTitle className={cn("group-hover:text-primary transition-colors text-gray-900 dark:text-gray-100", compact ? "text-base" : "text-lg")}>{snippet.title}</CardTitle>
                  {snippet.description && (<CardDescription className={cn("line-clamp-2 text-gray-700 dark:text-gray-200", compact && "text-sm")}>{snippet.description}</CardDescription>)}
                </div>
                {!snippet.is_public && (<Badge variant="secondary" className="ml-2 flex-shrink-0">Private</Badge>)}
              </div>
              <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                <Badge variant="outline" className="text-xs whitespace-nowrap flex-shrink-0">{snippet.language}</Badge>
                {snippet.tags?.slice(0, 5).map((tag) => (<Badge key={tag} variant="secondary" className="text-xs whitespace-nowrap flex-shrink-0">{tag}</Badge>))}
                {snippet.tags && snippet.tags.length > 5 && (<Badge variant="outline" className="text-xs whitespace-nowrap flex-shrink-0">+{snippet.tags.length - 5}</Badge>)}
              </div>
            </CardHeader>
            <CardContent className={cn("space-y-4", compact && "space-y-2")}> 
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6"><AvatarImage src={snippet.user?.avatar_url} /><AvatarFallback className="text-xs">{displayName.charAt(0).toUpperCase()}</AvatarFallback></Avatar>
                <span className="text-sm text-gray-700 dark:text-gray-200">{displayName}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(snippet.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1"><Eye size={14} /><span className="transition-all duration-300">{realTimeViews.toLocaleString()}</span></div>
                  <div className="flex items-center gap-1"><Heart size={14} className={isLiked ? "text-red-500 fill-red-500" : ""} /><span className="transition-all duration-300">{realTimeLikes.toLocaleString()}</span></div>
                  <div className="flex items-center gap-1"><Download size={14} /><span className="transition-all duration-300">{realTimeDownloads.toLocaleString()}</span></div>
                  {realTimeComments > 0 && (<div className="flex items-center gap-1"><MessageCircle size={14} /><span className="transition-all duration-300">{realTimeComments}</span></div>)}
                </div>
                {showActions && user && (<div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="sm" onClick={handleLike} disabled={isLoading} className={cn("h-8 px-2", isLiked && "text-red-500 hover:text-red-600")}> <Heart size={14} className={isLiked ? "fill-current" : ""} /> </Button>
                  <Button variant="ghost" size="sm" onClick={handleBookmark} disabled={isLoading} className={cn("h-8 px-2", isBookmarked && "text-yellow-500 hover:text-yellow-600")}> <Bookmark size={14} className={isBookmarked ? "fill-current" : ""} /> </Button>
                  <Button variant="ghost" size="sm" onClick={handleDownload} disabled={isLoading} className="h-8 px-2"> <Download size={14} /> </Button>
                  <Button variant="ghost" size="sm" onClick={handleShare} className="h-8 px-2"> <Share2 size={14} /> </Button>
                </div>)}
              </div>
            </CardContent>
          </Link>
        ) : (
          <div className="block cursor-not-allowed select-none">
            <CardHeader className={cn("space-y-1 border-b border-gray-100 dark:border-gray-800", compact && "pb-2")}> 
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <CardTitle className={cn("group-hover:text-primary transition-colors", compact ? "text-base" : "text-lg")}>{snippet.title}</CardTitle>
                  {snippet.description && (<CardDescription className={cn("line-clamp-2", compact && "text-sm")}>{snippet.description}</CardDescription>)}
                </div>
                {!snippet.is_public && (<Badge variant="secondary" className="ml-2 flex-shrink-0">Private</Badge>)}
              </div>
              <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                <Badge variant="outline" className="text-xs whitespace-nowrap flex-shrink-0">{snippet.language}</Badge>
                {snippet.tags?.slice(0, 5).map((tag) => (<Badge key={tag} variant="secondary" className="text-xs whitespace-nowrap flex-shrink-0">{tag}</Badge>))}
                {snippet.tags && snippet.tags.length > 5 && (<Badge variant="outline" className="text-xs whitespace-nowrap flex-shrink-0">+{snippet.tags.length - 5}</Badge>)}
              </div>
            </CardHeader>
            <CardContent className={cn("space-y-4", compact && "space-y-2")}> 
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6"><AvatarImage src={snippet.user?.avatar_url} /><AvatarFallback className="text-xs">{displayName.charAt(0).toUpperCase()}</AvatarFallback></Avatar>
                <span className="text-sm text-muted-foreground">{displayName}</span>
                <span className="text-xs text-muted-foreground">{new Date(snippet.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1"><Eye size={14} /><span className="transition-all duration-300">{realTimeViews.toLocaleString()}</span></div>
                  <div className="flex items-center gap-1"><Heart size={14} className={isLiked ? "text-red-500 fill-red-500" : ""} /><span className="transition-all duration-300">{realTimeLikes.toLocaleString()}</span></div>
                  <div className="flex items-center gap-1"><Download size={14} /><span className="transition-all duration-300">{realTimeDownloads.toLocaleString()}</span></div>
                  {realTimeComments > 0 && (<div className="flex items-center gap-1"><MessageCircle size={14} /><span className="transition-all duration-300">{realTimeComments}</span></div>)}
                </div>
                {showActions && user && (<div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="sm" onClick={handleLike} disabled={isLoading} className={cn("h-8 px-2", isLiked && "text-red-500 hover:text-red-600")}> <Heart size={14} className={isLiked ? "fill-current" : ""} /> </Button>
                  <Button variant="ghost" size="sm" onClick={handleBookmark} disabled={isLoading} className={cn("h-8 px-2", isBookmarked && "text-yellow-500 hover:text-yellow-600")}> <Bookmark size={14} className={isBookmarked ? "fill-current" : ""} /> </Button>
                  <Button variant="ghost" size="sm" onClick={handleDownload} disabled={isLoading} className="h-8 px-2"> <Download size={14} /> </Button>
                  <Button variant="ghost" size="sm" onClick={handleShare} className="h-8 px-2"> <Share2 size={14} /> </Button>
                </div>)}
              </div>
            </CardContent>
          </div>
        )}
        <GuestSnippetModal open={showGuestModal} onClose={() => setShowGuestModal(false)} />
      </Card>
    );
  };
