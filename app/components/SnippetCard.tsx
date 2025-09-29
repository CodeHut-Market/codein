"use client";

import {
    BookmarkPlus,
    DollarSign,
    Download,
    ExternalLink,
    Eye,
    Heart
} from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { CodeHighlighter } from './ui/syntax-highlighter';

interface CodeSnippet {
  id: string;
  title: string;
  code: string;
  description?: string;
  price?: number;
  rating?: number;
  author: string;
  authorId?: string;
  tags?: string[];
  language: string;
  framework?: string;
  downloads?: number;
  createdAt: string;
  updatedAt?: string;
}

interface SnippetCardProps {
  snippet: CodeSnippet;
  onPurchaseComplete?: () => void;
  showCode?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
}

export default function SnippetCard({ 
  snippet, 
  onPurchaseComplete,
  showCode = false,
  variant = 'default'
}: SnippetCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showPreview, setShowPreview] = useState(showCode);

  const handleLike = () => {
    setIsLiked(!isLiked);
    // Add toast notification if available
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // Add toast notification if available
  };

  const handleDownload = () => {
    // Create download functionality
    const blob = new Blob([snippet.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${snippet.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${getFileExtension(snippet.language)}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getFileExtension = (language: string): string => {
    const extMap: Record<string, string> = {
      'javascript': 'js',
      'typescript': 'ts',
      'python': 'py',
      'java': 'java',
      'cpp': 'cpp',
      'c++': 'cpp',
      'c#': 'cs',
      'csharp': 'cs',
      'php': 'php',
      'ruby': 'rb',
      'go': 'go',
      'rust': 'rs',
      'swift': 'swift',
      'kotlin': 'kt',
      'dart': 'dart',
      'html': 'html',
      'css': 'css',
      'scss': 'scss',
      'sql': 'sql',
      'bash': 'sh',
      'shell': 'sh',
      'json': 'json',
      'yaml': 'yml',
      'xml': 'xml',
      'markdown': 'md',
    };
    return extMap[language.toLowerCase()] || 'txt';
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
    return `${Math.ceil(diffDays / 365)} years ago`;
  };

  // Enhanced language badge colors
  const getLanguageBadgeClass = (language: string) => {
    const lang = language.toLowerCase();
    switch(lang) {
      case 'javascript':
        return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800';
      case 'typescript':
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800';
      case 'python':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800';
      case 'react':
        return 'bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900/20 dark:text-cyan-300 dark:border-cyan-800';
      case 'vue':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800';
      case 'angular':
        return 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/20 dark:text-rose-300 dark:border-rose-800';
      case 'go':
        return 'bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900/20 dark:text-cyan-300 dark:border-cyan-800';
      case 'rust':
        return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800';
      case 'swift':
        return 'bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-900/20 dark:text-violet-300 dark:border-violet-800';
      case 'java':
        return 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/20 dark:text-rose-300 dark:border-rose-800';
      case 'css':
        return 'bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-900/20 dark:text-violet-300 dark:border-violet-800';
      case 'html':
        return 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/20 dark:text-rose-300 dark:border-rose-800';
      default:
        return 'bg-muted text-muted-foreground border-muted-foreground/20';
    }
  };

  if (variant === 'compact') {
    return (
      <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-card to-card/95 hover:shadow-primary/5 border-border/50 hover:border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-sm line-clamp-1">{snippet.title}</h3>
                <Badge 
                  variant="outline" 
                  className={`text-xs font-medium hover-lift ${getLanguageBadgeClass(snippet.language)}`}
                >
                  {snippet.language}
                </Badge>
              </div>
              
              <p className="text-xs text-muted-foreground line-clamp-2">
                {snippet.description || 'No description available'}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-5 w-5">
                    <AvatarImage src="" alt={snippet.author} />
                    <AvatarFallback className="text-xs">
                      {snippet.author?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-medium">{snippet.author}</span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(snippet.createdAt)}
                  </span>
                </div>
                
                {snippet.price && snippet.price > 0 && (
                  <Badge variant="outline" className="text-xs">
                    <DollarSign className="h-3 w-3 mr-1" />
                    ${snippet.price}
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {snippet.tags?.slice(0, 2).map((tag: string) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {(snippet.tags?.length || 0) > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{(snippet.tags?.length || 0) - 2}
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center space-x-1">
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={handleLike}>
                    <Heart className={`h-3 w-3 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={handleDownload}>
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-card to-card/95 hover:shadow-primary/5 border-border/50 hover:border-primary/20">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-lg line-clamp-2">{snippet.title}</CardTitle>
            <CardDescription className="line-clamp-3">
              {snippet.description || 'No description available'}
            </CardDescription>
          </div>
          <div className="flex flex-col items-end space-y-1">
            <Badge 
              variant="outline" 
              className={`font-medium hover-lift ${getLanguageBadgeClass(snippet.language)}`}
            >
              {snippet.language}
            </Badge>
            {snippet.price && snippet.price > 0 && (
              <Badge variant="outline">
                <DollarSign className="h-3 w-3 mr-1" />
                ${snippet.price}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Author Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src="" alt={snippet.author} />
              <AvatarFallback className="text-xs">
                {snippet.author?.[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{snippet.author}</span>
            <span className="text-sm text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">
              {formatDate(snippet.createdAt)}
            </span>
          </div>
        </div>

        {/* Tags */}
        {snippet.tags && snippet.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {snippet.tags.slice(0, 4).map((tag: string) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {snippet.tags.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{snippet.tags.length - 4} more
              </Badge>
            )}
          </div>
        )}

        {/* Code Preview */}
        {showPreview && (
          <div className="border rounded-lg overflow-hidden">
            <CodeHighlighter
              code={snippet.code.substring(0, 500) + (snippet.code.length > 500 ? '...' : '')}
              language={snippet.language}
              showLineNumbers={false}
              allowCopy={false}
              allowDownload={false}
            />
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <Eye className="mr-1 h-3 w-3" />
              {snippet.downloads || 0}
            </span>
            <span className="flex items-center">
              <Download className="mr-1 h-3 w-3" />
              {snippet.downloads || 0}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button size="sm" className="flex-1">
            <ExternalLink className="mr-2 h-3 w-3" />
            View Details
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={handleLike}
          >
            <Heart className={`h-3 w-3 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={handleBookmark}
          >
            <BookmarkPlus className={`h-3 w-3 ${isBookmarked ? 'fill-primary text-primary' : ''}`} />
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={handleDownload}
          >
            <Download className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}