"use client";

import { CodeSnippet } from '@shared/api';
import {
    ArrowLeft,
    Calendar,
    CheckCircle2,
    Code2,
    Copy,
    Download,
    ExternalLink,
    Eye,
    Lock,
    Share2,
    ShoppingCart,
    Sparkles,
    Star,
    User
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import FavoriteButton from '../../../client/components/FavoriteButton';
import { useAuth } from '../../../client/contexts/AuthContext';
import { RazorpayOptions, RazorpayPaymentResponse } from '@/types/razorpay';
import { useToast } from '@/hooks/use-toast';
import { useRazorpay } from '@/hooks/use-razorpay';
import SnippetCard from '../../../client/components/SnippetCard';
import { Avatar, AvatarFallback, AvatarImage } from '../../../client/components/ui/avatar';
import { Badge } from '../../../client/components/ui/badge';
import { Button } from '../../../client/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../client/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../client/components/ui/tabs';

interface Params { id: string }

interface SnippetDetailPageProps { 
  params: Params 
}

export default function SnippetDetailPage({ params }: SnippetDetailPageProps) {
  const [snippet, setSnippet] = useState<CodeSnippet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedSnippets, setRelatedSnippets] = useState<CodeSnippet[]>([]);
  const [copied, setCopied] = useState(false);
  const { user, token } = useAuth();
  const { toast } = useToast();
  const { ensureRazorpay } = useRazorpay();
  const [paymentLoading, setPaymentLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const purchaseSectionRef = useRef<HTMLDivElement | null>(null);
  const purchaseIntent = searchParams?.get('purchase') === '1';

  // compute paid state and code preview before any early returns so hooks
  // (useMemo) are called in the same order on every render.
  const priceValue = snippet?.price ?? 0;
  const isPaidSnippet = priceValue > 0;
  const codePreview = useMemo(() => {
    if (!snippet?.code) return '';
    if (!isPaidSnippet) return snippet.code;
    const lines = snippet.code.split('\n');
    const previewLines = lines.slice(0, 8);
    let preview = previewLines.join('\n');
    if (lines.length > previewLines.length) {
      preview += '\n\n// Purchase to unlock the full source code';
    }
    return preview;
  }, [snippet?.code, isPaidSnippet]);

  // Demo snippet as fallback
  const demoSnippet: CodeSnippet = {
    id: params.id,
    title: "React Custom Hook - useLocalStorage",
    description: "A powerful React hook for managing localStorage with TypeScript support, automatic serialization, and error handling. Perfect for persisting user preferences, form data, and application state.",
    code: `import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(\`Error reading localStorage key "\${key}":\`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(\`Error setting localStorage key "\${key}":\`, error);
    }
  };

  const removeValue = () => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.warn(\`Error removing localStorage key "\${key}":\`, error);
    }
  };

  return [storedValue, setValue, removeValue] as const;
}

// Usage example:
// const [name, setName, removeName] = useLocalStorage('name', 'Anonymous');`,
    price: 0,
    rating: 4.8,
    language: "TypeScript",
    framework: "React",
    tags: ["react", "hooks", "typescript", "localstorage", "state-management"],
    author: "ReactExpert",
    authorId: "react-expert-123",
    downloads: 1847,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  };

  const demoRelatedSnippets: CodeSnippet[] = [
    {
      id: "related-1",
      title: "React useSessionStorage Hook",
      description: "Similar to useLocalStorage but for sessionStorage",
      code: "// Session storage hook...",
      price: 0,
      rating: 4.6,
      language: "TypeScript",
      framework: "React",
      tags: ["react", "hooks", "sessionstorage"],
      author: "ReactExpert",
      authorId: "react-expert-123",
      downloads: 943,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "related-2",
      title: "React useFetch Hook",
      description: "Custom hook for making HTTP requests",
      code: "// Fetch hook...",
      price: 5,
      rating: 4.9,
      language: "TypeScript",
      framework: "React",
      tags: ["react", "hooks", "api", "fetch"],
      author: "ApiMaster",
      authorId: "api-master-456",
      downloads: 2156,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  useEffect(() => {
    loadSnippet();
  }, [params.id]);

  useEffect(() => {
    if (purchaseIntent && purchaseSectionRef.current) {
      purchaseSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [purchaseIntent, snippet]);

  const loadSnippet = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/snippets/${params.id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          console.error('Snippet not found for ID:', params.id);
          setError(`Snippet not found (ID: ${params.id}). It may have been deleted or the URL is incorrect.`);
          return;
        }
        throw new Error(`Failed to load snippet: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API Response:', data);
      
      // Handle both direct snippet response and wrapped response
      const snippetData = data.snippet || data;
      setSnippet(snippetData);
      
      // Load related snippets
      loadRelatedSnippets(snippetData.tags, snippetData.language);
      
    } catch (error) {
      console.error("Failed to load snippet", error);
      setError(error instanceof Error ? error.message : "Failed to load snippet");
      // Don't show demo data - let user know there was an actual error
    } finally {
      setLoading(false);
    }
  };

  const loadRelatedSnippets = async (tags: string[], language: string) => {
    try {
      const response = await fetch(`/api/snippets/related?tags=${tags.join(',')}&language=${language}&exclude=${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setRelatedSnippets(data.snippets || demoRelatedSnippets);
      } else {
        setRelatedSnippets(demoRelatedSnippets);
      }
    } catch (error) {
      console.error("Failed to load related snippets", error);
      setRelatedSnippets(demoRelatedSnippets);
    }
  };

  const copyToClipboard = async () => {
    if (!snippet) return;
    if ((snippet.price ?? 0) > 0) {
      return;
    }
    
    try {
      await navigator.clipboard.writeText(snippet.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy code', error);
    }
  };

  const shareSnippet = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: snippet?.title,
          text: snippet?.description,
          url: url,
        });
      } catch (error) {
        console.error('Error sharing', error);
      }
    } else {
      // Fallback to copying URL
      try {
        await navigator.clipboard.writeText(url);
        // Could show a toast here
      } catch (error) {
        console.error('Failed to copy URL', error);
      }
    }
  };

  const downloadSnippet = () => {
    if (!snippet) return;
    if ((snippet.price ?? 0) > 0) {
      return;
    }
    
    const fileExtension = snippet.language.toLowerCase() === 'javascript' ? 'js' :
                         snippet.language.toLowerCase() === 'typescript' ? 'ts' :
                         snippet.language.toLowerCase() === 'python' ? 'py' :
                         snippet.language.toLowerCase() === 'css' ? 'css' :
                         'txt';
    
    const filename = `${snippet.title.toLowerCase().replace(/\s+/g, '-')}.${fileExtension}`;
    const blob = new Blob([snippet.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading snippet...</p>
        </div>
      </div>
    );
  }

  if (error && !snippet) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center py-8">
            <Code2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error loading snippet</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <div className="flex gap-2 justify-center">
              <Button onClick={loadSnippet} variant="outline">Try Again</Button>
              <Button asChild>
                <Link href="/explore">Browse Snippets</Link>
              </Button>
            </div>
            <div className="mt-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard">← Back to Dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!snippet) return null;


  const priceLabel = priceValue <= 0
    ? 'Free'
    : priceValue % 1 === 0
      ? `$${priceValue.toFixed(0)}`
      : `$${priceValue.toFixed(2)}`;
  const pricePillClasses = priceValue <= 0
    ? 'bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-500 text-white shadow-emerald-200/60 dark:shadow-emerald-900/30'
    : 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white shadow-amber-200/60 dark:shadow-amber-900/30';
  const ratingLabel = (snippet.rating ?? 0) > 0
    ? `${(snippet.rating ?? 0).toFixed(1)}/5`
    : 'New';

  const handleBuyNow = async () => {
    if (!snippet) {
      return;
    }

    if (!user?.id) {
      const redirectUrl = encodeURIComponent(`/snippet/${snippet.id}?purchase=1`);
      router.push(`/login?redirect=${redirectUrl}`);
      return;
    }

    setPaymentLoading(true);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'x-user-data': JSON.stringify({ id: user.id, email: user.email }),
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const orderResponse = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers,
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
              await loadSnippet();
              return;
            }

            const verifyHeaders: Record<string, string> = {
              'Content-Type': 'application/json',
              'x-user-data': JSON.stringify({ id: user.id, email: user.email }),
            };

            if (token) {
              verifyHeaders.Authorization = `Bearer ${token}`;
            }

            const verifyResponse = await fetch('/api/payments/verify', {
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
            await loadSnippet();
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
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/explore">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Explore
              </Link>
            </Button>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            <div className="flex-1 space-y-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold mb-3 text-gray-900 dark:text-gray-50 flex items-center gap-2">
                      <Sparkles className="h-6 w-6 text-primary" />
                      {snippet.title}
                    </h1>
                  </div>
                  <div className="hidden lg:flex flex-col items-end gap-3 min-w-[180px]">
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold shadow-lg ${pricePillClasses}`}>
                      {priceLabel}
                    </span>
                    <span className="flex items-center gap-1 text-sm font-semibold text-amber-600 dark:text-amber-400">
                      <Star className="h-4 w-4 fill-current" />
                      {ratingLabel}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {snippet.downloads.toLocaleString()} downloads
                    </span>
                  </div>
                </div>
                <div className="rounded-2xl border border-primary/10 bg-gradient-to-r from-primary/5 via-violet-500/5 to-emerald-500/5 p-5 shadow-sm">
                  <p className="text-base leading-relaxed text-gray-700 dark:text-gray-200">
                    {snippet.description}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    {isPaidSnippet ? (
                      <Button
                        onClick={handleBuyNow}
                        disabled={paymentLoading}
                        className="bg-gradient-to-r from-fuchsia-600 via-violet-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 text-white shadow-lg"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {paymentLoading ? 'Processing...' : `Buy Now for ${priceLabel}`}
                      </Button>
                    ) : (
                      <Button onClick={downloadSnippet} className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-lg">
                        <Download className="w-4 h-4 mr-2" />
                        Download Free
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={shareSnippet}>
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                    <FavoriteButton 
                      snippetId={snippet.id} 
                      initialIsFavorited={false}
                      showCount={true}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={`https://github.com/${snippet.author}.png`} />
                    <AvatarFallback>
                      {snippet.author.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Link 
                    href={`/profile/${snippet.author}`}
                    className="hover:text-primary transition-colors font-medium"
                  >
                    {snippet.author}
                  </Link>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(snippet.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{snippet.downloads.toLocaleString()} downloads</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{ratingLabel}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{snippet.language}</Badge>
                {snippet.framework && (
                  <Badge variant="outline">{snippet.framework}</Badge>
                )}
                {snippet.tags.map(tag => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${pricePillClasses}`}>
                  {priceLabel}
                </span>
              </div>
            </div>

            <div className="lg:hidden flex flex-col items-end gap-3">
              <span className={`px-4 py-2 rounded-full text-sm font-semibold shadow-lg ${pricePillClasses}`}>
                {priceLabel}
              </span>
              <span className="flex items-center gap-1 text-sm font-semibold text-amber-600 dark:text-amber-400">
                <Star className="h-4 w-4 fill-current" />
                {ratingLabel}
              </span>
              <span className="text-xs text-muted-foreground">
                {snippet.downloads.toLocaleString()} downloads
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Code Section */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="code" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="code">Code</TabsTrigger>
                <TabsTrigger value="comments">Comments (0)</TabsTrigger>
              </TabsList>
              
              <TabsContent value="code" className="space-y-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">Source Code</CardTitle>
                    {isPaidSnippet ? (
                      <Button
                        size="sm"
                        onClick={handleBuyNow}
                        disabled={paymentLoading}
                        className="bg-gradient-to-r from-fuchsia-600 via-violet-600 to-indigo-600 text-white shadow-md hover:shadow-lg"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {paymentLoading ? 'Processing...' : 'Unlock Full Code'}
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyToClipboard}
                        disabled={copied}
                      >
                        {copied ? (
                          <>
                            <Eye className="w-4 h-4 mr-2" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-2" />
                            Copy
                          </>
                        )}
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="relative">
                      {isPaidSnippet && (
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background/85" />
                      )}
                      <pre className="bg-muted/40 p-6 overflow-x-auto text-sm font-mono rounded-b-lg">
                        <code className="language-typescript">{codePreview}</code>
                      </pre>
                    </div>
                    {isPaidSnippet && (
                      <div className="border-t border-border bg-background/90 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <Lock className="h-4 w-4 text-primary" />
                          <span>Purchase to unlock the complete source code, downloads, and copy access.</span>
                        </div>
                        <Button onClick={handleBuyNow} className="bg-gradient-to-r from-fuchsia-600 via-violet-600 to-indigo-600 text-white shadow-md hover:shadow-lg">
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Buy Now for {priceLabel}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="comments" className="space-y-4">
                <Card>
                  <CardContent className="text-center py-12">
                    <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No comments yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Be the first to share your thoughts about this snippet!
                    </p>
                    <Button disabled>Add Comment (Coming Soon)</Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Author Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">About the Author</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={`https://github.com/${snippet.author}.png`} />
                    <AvatarFallback>
                      {snippet.author.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{snippet.author}</h4>
                    <p className="text-sm text-muted-foreground">Developer</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href={`/profile/${snippet.author}`}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Profile
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            {/* Stats */}
              <Card ref={purchaseSectionRef} id="purchase" className="border-2 border-primary/20 shadow-lg shadow-primary/10">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-lg">Purchase Access</CardTitle>
                  <p className="text-sm text-muted-foreground">One-time purchase with lifetime access</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-4xl font-semibold text-gray-900 dark:text-gray-100">
                    {priceLabel}
                  </div>
                  <Button
                    className="w-full bg-gradient-to-r from-fuchsia-600 via-violet-600 to-indigo-600 text-white shadow-lg hover:shadow-xl"
                    onClick={handleBuyNow}
                    disabled={paymentLoading}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {paymentLoading ? 'Processing...' : 'Buy Now'}
                  </Button>
                  <div className="rounded-xl border border-primary/10 bg-primary/5 p-4 space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                      <span>Complete, unblurred source code download</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                      <span>Lifetime updates and future improvements</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                      <span>Commercial usage and modification rights</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                      <span>Direct author support for integration questions</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
              <CardHeader>
                <CardTitle className="text-lg">Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Downloads:</span>
                  <span className="font-medium">{snippet.downloads.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Rating:</span>
                  <span className="font-medium flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    {ratingLabel}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Created:</span>
                  <span className="font-medium text-sm">{formatDate(snippet.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Updated:</span>
                  <span className="font-medium text-sm">{formatDate(snippet.updatedAt)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Related Snippets */}
        {relatedSnippets.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Related Snippets</h2>
              <Button variant="outline" asChild>
                <Link href={`/explore?tags=${snippet.tags.join(',')}&language=${snippet.language}`}>
                  View All
                </Link>
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedSnippets.slice(0, 3).map(relatedSnippet => (
                <SnippetCard key={relatedSnippet.id} snippet={relatedSnippet} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
