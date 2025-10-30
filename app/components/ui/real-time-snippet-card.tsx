


"use client";

import { RazorpayOptions, RazorpayPaymentResponse } from '@/types/razorpay';

import { Bookmark, Download, Eye, Heart, MessageCircle, Share2, ShoppingCart, Star } from 'lucide-react';
import Link from 'next/link';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { useAuth } from '../../../client/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useRazorpay } from '@/hooks/use-razorpay';
import { useRealTime } from '../../contexts/RealTimeContext';
import { useOptimisticActions } from '../../hooks/useOptimisticActions';
import { supabase } from '../../lib/supabaseClient';
import { cn } from '../../lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { GuestSnippetModal } from './guest-snippet-modal';
import { Badge } from './badge';
import { Button } from './button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000"; // Fallback for development

interface RealTimeSnippetCardProps {
  snippet: {
    id: string;
    title: string;
    description?: string;
    language: string;
    user_id: string;
    price?: number;
    rating?: number;
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
  const { user, token } = useAuth();
  const { toast } = useToast();
  const { ensureRazorpay } = useRazorpay();
    
    const [showGuestModal, setShowGuestModal] = useState(false);
    const { getSnippetViews, getSnippetLikes, getSnippetDownloads, getSnippetComments, subscribeToSnippet, unsubscribeFromSnippet } = useRealTime();
    const { toggleLike, incrementView, incrementDownload } = useOptimisticActions();
    const [isLiked, setIsLiked] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [hasViewed, setHasViewed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const priceValue = useMemo(() => typeof snippet.price === 'number' ? snippet.price : 0, [snippet.price]);
    const priceLabel = useMemo(() => {
      if (priceValue <= 0) return 'Free';
      return priceValue % 1 === 0 ? `$${priceValue.toFixed(0)}` : `$${priceValue.toFixed(2)}`;
    }, [priceValue]);
    const pricePillClasses = useMemo(
      () => priceValue <= 0
        ? 'bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-500 shadow-emerald-200/50 dark:shadow-emerald-900/30'
        : 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 shadow-amber-200/50 dark:shadow-amber-900/30',
      [priceValue]
    );
    const ratingValue = useMemo(() => typeof snippet.rating === 'number' ? snippet.rating : 0, [snippet.rating]);
    const ratingLabel = useMemo(() => ratingValue > 0 ? ratingValue.toFixed(1) : 'New', [ratingValue]);
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
    const handlePayment = useCallback(async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!snippet?.id) {
        return;
      }

      if (!user?.id) {
        setShowGuestModal(true);
        return;
      }

      setPaymentLoading(true);

      try {
        let authToken = token;
        if (!authToken && supabase) {
          const { data } = await supabase.auth.getSession();
          authToken = data.session?.access_token ?? null;
        }

        if (!authToken) {
          toast({
            title: 'Authentication required',
            description: 'Please sign in again before completing your purchase.',
            variant: 'destructive',
          });
          setShowGuestModal(true);
          setPaymentLoading(false);
          return;
        }

        const requestHeaders: Record<string, string> = {
          'Content-Type': 'application/json',
          'x-user-data': JSON.stringify({ id: user.id, email: user.email }),
        };

        if (authToken) {
          requestHeaders.Authorization = `Bearer ${authToken}`;
        }

        const orderResponse = await fetch(`${BACKEND_URL}/api/payments/create-order`, {
          method: 'POST',
          headers: requestHeaders,
          body: JSON.stringify({ snippetId: snippet.id }),
        });

        if (!orderResponse.ok) {
          const errorBody = await orderResponse.json().catch(() => ({}));
          throw new Error(errorBody.error || 'Unable to start checkout.');
        }

        const order = await orderResponse.json();
        const isDemoCheckout = Boolean(order.demo);

        const ready = await ensureRazorpay();
        if (!ready || typeof window === 'undefined' || !window.Razorpay) {
          throw new Error('Razorpay checkout SDK is not loaded yet. Please wait a moment and try again.');
        }

        const checkout = new window.Razorpay({
          key: order.key,
          amount: order.amount,
          currency: order.currency ?? 'INR',
          name: 'CodeHut',
          description: `Purchase of ${snippet.title}`,
          order_id: order.id,
          prefill: {
            name: user.username || 'Anonymous',
            email: user.email,
          },
          notes: {
            snippet_id: snippet.id,
            buyer_id: user.id,
            mode: isDemoCheckout ? 'demo' : 'live',
          },
          theme: {
            color: '#3399cc',
          },
          handler: async (paymentResponse: RazorpayPaymentResponse) => {
            try {
              if (isDemoCheckout) {
                toast({
                  title: 'Demo payment completed',
                  description: 'This was a simulated checkout. Configure Razorpay keys for live payments.',
                });
                await incrementDownload(snippet.id);
                return;
              }

              const verifyHeaders: Record<string, string> = {
                'Content-Type': 'application/json',
                'x-user-data': JSON.stringify({ id: user.id, email: user.email }),
              };

              if (authToken) {
                verifyHeaders.Authorization = `Bearer ${authToken}`;
              }

              const verifyResponse = await fetch(`${BACKEND_URL}/api/payments/verify`, {
                method: 'POST',
                headers: verifyHeaders,
                body: JSON.stringify({
                  ...paymentResponse,
                  snippetId: snippet.id,
                }),
              });

              if (!verifyResponse.ok) {
                const verifyError = await verifyResponse.json().catch(() => ({}));
                throw new Error(verifyError.error || 'Payment verification failed.');
              }

              toast({
                title: 'Payment successful',
                description: 'You now have access to the full snippet.',
              });
              await incrementDownload(snippet.id);
            } catch (verifyError) {
              console.error('Payment verification failed', verifyError);
              toast({
                title: 'Payment verification failed',
                description: verifyError instanceof Error ? verifyError.message : 'Please contact support.',
                variant: 'destructive',
              });
            } finally {
              setPaymentLoading(false);
            }
          },
          modal: {
            ondismiss: () => {
              setPaymentLoading(false);
              if (isDemoCheckout) {
                toast({
                  title: 'Checkout closed',
                  description: 'Demo payment was cancelled before completion.',
                  variant: 'destructive',
                });
              }
            },
          },
        } as RazorpayOptions);

        checkout.on?.('payment.failed', (failure) => {
          console.error('Payment failed:', failure);
          toast({
            title: 'Payment failed',
            description: failure?.error?.description || 'Please try again with a different payment method.',
            variant: 'destructive',
          });
          setPaymentLoading(false);
        });

        checkout.open();

        if (isDemoCheckout) {
          toast({
            title: 'Demo checkout mode',
            description: 'Using Razorpay test gateway. Use card 4111 1111 1111 1111, any future expiry, CVV 111 to simulate a payment.',
          });
        }
      } catch (error) {
        console.error('Payment failed:', error);
        toast({
          title: 'Payment failed',
          description: error instanceof Error ? error.message : 'Please try again.',
          variant: 'destructive',
        });
        setPaymentLoading(false);
      }
  }, [token, user, snippet, incrementDownload, toast, supabase, ensureRazorpay]);
    return (
      <Card className={cn("group transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 cursor-pointer border-2 border-gray-200 dark:border-gray-700 overflow-hidden text-gray-900 dark:text-gray-100", compact && "p-4", className)} onClick={handleView}>
        {user?.id ? (
          <Link href={`/snippet/${snippet.id}`} className="block">
            <CardHeader className={cn("space-y-1 border-b border-gray-100 dark:border-gray-800", compact && "pb-2")}> 
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2 flex-1">
                  <CardTitle className={cn("group-hover:text-primary transition-colors text-gray-900 dark:text-gray-100", compact ? "text-base" : "text-lg")}>{snippet.title}</CardTitle>
                  {snippet.description && (
                    <CardDescription className={cn("line-clamp-3 text-sm text-gray-700 dark:text-gray-200", compact && "text-xs")}> 
                      {snippet.description}
                    </CardDescription>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2 ml-1">
                  <span className={cn("px-3 py-1 rounded-full text-xs font-semibold text-white shadow-md", pricePillClasses)}>
                    {priceLabel}
                  </span>
                  <span className="flex items-center gap-1 text-sm font-semibold text-amber-600 dark:text-amber-400">
                    <Star className={cn("h-4 w-4", ratingValue > 0 ? "fill-current" : "stroke-current")}/>
                    {ratingLabel}{ratingValue > 0 ? <span className="text-xs font-medium text-muted-foreground ml-1">/ 5</span> : null}
                  </span>
                  {!snippet.is_public && (<Badge variant="secondary" className="flex-shrink-0">Private</Badge>)}
                </div>
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
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1"><Eye size={14} /><span className="transition-all duration-300">{realTimeViews.toLocaleString()}</span></div>
                  <div className="flex items-center gap-1"><Heart size={14} className={isLiked ? "text-red-500 fill-red-500" : ""} /><span className="transition-all duration-300">{realTimeLikes.toLocaleString()}</span></div>
                  <div className="flex items-center gap-1"><Download size={14} /><span className="transition-all duration-300">{realTimeDownloads.toLocaleString()}</span></div>
                  {realTimeComments > 0 && (<div className="flex items-center gap-1"><MessageCircle size={14} /><span className="transition-all duration-300">{realTimeComments}</span></div>)}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={handlePayment}
                    disabled={paymentLoading}
                    className="relative overflow-hidden bg-gradient-to-r from-fuchsia-600 via-violet-600 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-transform duration-200 px-4"
                  >
                    {paymentLoading ? 'Processing...' : (
                      <>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Buy Now
                      </>
                    )}
                  </Button>
                  {showActions && user && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" onClick={handleLike} disabled={isLoading} className={cn("h-8 px-2", isLiked && "text-red-500 hover:text-red-600")}>
                        <Heart size={14} className={isLiked ? "fill-current" : ""} />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={handleBookmark} disabled={isLoading} className={cn("h-8 px-2", isBookmarked && "text-yellow-500 hover:text-yellow-600")}>
                        <Bookmark size={14} className={isBookmarked ? "fill-current" : ""} />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={handleDownload} disabled={isLoading} className="h-8 px-2">
                        <Download size={14} />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={handleShare} className="h-8 px-2">
                        <Share2 size={14} />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Link>
        ) : (
          <div className="block cursor-not-allowed select-none">
            <CardHeader className={cn("space-y-1 border-b border-gray-100 dark:border-gray-800", compact && "pb-2")}> 
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2 flex-1">
                  <CardTitle className={cn("group-hover:text-primary transition-colors", compact ? "text-base" : "text-lg")}>{snippet.title}</CardTitle>
                  {snippet.description && (
                    <CardDescription className={cn("line-clamp-3 text-sm text-gray-700 dark:text-gray-200", compact && "text-xs")}>
                      {snippet.description}
                    </CardDescription>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2 ml-1">
                  <span className={cn("px-3 py-1 rounded-full text-xs font-semibold text-white shadow-md", pricePillClasses)}>
                    {priceLabel}
                  </span>
                  <span className="flex items-center gap-1 text-sm font-semibold text-amber-600 dark:text-amber-400">
                    <Star className={cn("h-4 w-4", ratingValue > 0 ? "fill-current" : "stroke-current")}/>
                    {ratingLabel}{ratingValue > 0 ? <span className="text-xs font-medium text-muted-foreground ml-1">/ 5</span> : null}
                  </span>
                  {!snippet.is_public && (<Badge variant="secondary" className="flex-shrink-0">Private</Badge>)}
                </div>
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
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1"><Eye size={14} /><span className="transition-all duration-300">{realTimeViews.toLocaleString()}</span></div>
                  <div className="flex items-center gap-1"><Heart size={14} className={isLiked ? "text-red-500 fill-red-500" : ""} /><span className="transition-all duration-300">{realTimeLikes.toLocaleString()}</span></div>
                  <div className="flex items-center gap-1"><Download size={14} /><span className="transition-all duration-300">{realTimeDownloads.toLocaleString()}</span></div>
                  {realTimeComments > 0 && (<div className="flex items-center gap-1"><MessageCircle size={14} /><span className="transition-all duration-300">{realTimeComments}</span></div>)}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={handlePayment}
                    disabled={paymentLoading}
                    className="relative overflow-hidden bg-gradient-to-r from-fuchsia-600 via-violet-600 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-transform duration-200 px-4"
                  >
                    {paymentLoading ? 'Processing...' : (
                      <>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Buy Now
                      </>
                    )}
                  </Button>
                  {showActions && user && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" onClick={handleLike} disabled={isLoading} className={cn("h-8 px-2", isLiked && "text-red-500 hover:text-red-600")}>
                        <Heart size={14} className={isLiked ? "fill-current" : ""} />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={handleBookmark} disabled={isLoading} className={cn("h-8 px-2", isBookmarked && "text-yellow-500 hover:text-yellow-600")}>
                        <Bookmark size={14} className={isBookmarked ? "fill-current" : ""} />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={handleDownload} disabled={isLoading} className="h-8 px-2">
                        <Download size={14} />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={handleShare} className="h-8 px-2">
                        <Share2 size={14} />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </div>
        )}
        <GuestSnippetModal open={showGuestModal} onClose={() => setShowGuestModal(false)} />
      </Card>
    );
  };
