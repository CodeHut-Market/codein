"use client";

import { CodeSnippet } from '@shared/api';
import {
    ArrowLeft,
    Calendar,
    Code2,
    Copy,
    Download,
    ExternalLink,
    Eye,
    Share2,
    Star,
    User
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import FavoriteButton from '../../../client/components/FavoriteButton';
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/explore">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Explore
              </Link>
            </Button>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">{snippet.title}</h1>
                  <p className="text-lg text-muted-foreground mb-4">{snippet.description}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={`https://github.com/${snippet.author}.png`} />
                        <AvatarFallback>
                          {snippet.author.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <Link 
                        href={`/profile/${snippet.author}`}
                        className="hover:text-primary transition-colors"
                      >
                        {snippet.author}
                      </Link>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(snippet.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="w-4 h-4" />
                      <span>{snippet.downloads.toLocaleString()} downloads</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{snippet.rating}/5</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="outline">{snippet.language}</Badge>
                {snippet.framework && (
                  <Badge variant="outline">{snippet.framework}</Badge>
                )}
                {snippet.tags.map(tag => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
                <Badge variant={snippet.price === 0 ? 'default' : 'destructive'}>
                  {snippet.price === 0 ? 'Free' : `$${snippet.price}`}
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <FavoriteButton 
                snippetId={snippet.id} 
                initialIsFavorited={false}
                showCount={true}
              />
              <Button variant="outline" size="sm" onClick={shareSnippet}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button onClick={downloadSnippet}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
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
                  </CardHeader>
                  <CardContent className="p-0">
                    <pre className="bg-muted/40 p-6 overflow-x-auto text-sm font-mono rounded-b-lg">
                      <code className="language-typescript">{snippet.code}</code>
                    </pre>
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
                    {snippet.rating}/5
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
