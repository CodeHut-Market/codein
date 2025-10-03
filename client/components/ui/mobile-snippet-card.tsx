import { cn } from '@/lib/utils';
import {
    Calendar,
    ChevronDown,
    ChevronUp,
    Code2,
    Copy,
    Download,
    Eye,
    Heart,
    MoreVertical,
    Share,
    User
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface SnippetCardProps {
  snippet: {
    id: string;
    title: string;
    description: string;
    language: string;
    code: string;
    author: {
      name: string;
      avatar?: string;
    };
    stats: {
      views: number;
      likes: number;
      downloads: number;
    };
    createdAt: string;
    tags?: string[];
  };
  variant?: 'default' | 'compact' | 'featured';
  className?: string;
}

const languageColors: Record<string, string> = {
  javascript: 'bg-yellow-100 text-yellow-800',
  typescript: 'bg-blue-100 text-blue-800',
  python: 'bg-green-100 text-green-800',
  react: 'bg-cyan-100 text-cyan-800',
  vue: 'bg-emerald-100 text-emerald-800',
  angular: 'bg-red-100 text-red-800',
  css: 'bg-pink-100 text-pink-800',
  html: 'bg-orange-100 text-orange-800',
  java: 'bg-amber-100 text-amber-800',
  php: 'bg-indigo-100 text-indigo-800',
};

export function MobileSnippetCard({ snippet, variant = 'default', className }: SnippetCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [showFullCode, setShowFullCode] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const getLanguageColor = (language: string): string => {
    return languageColors[language.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const truncateCode = (code: string, maxLines: number = 8): string => {
    const lines = code.split('\n');
    if (lines.length <= maxLines) return code;
    return lines.slice(0, maxLines).join('\n');
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(snippet.code);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: snippet.title,
          text: snippet.description,
          url: window.location.origin + `/snippet/${snippet.id}`,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback to copying URL
      const url = window.location.origin + `/snippet/${snippet.id}`;
      await navigator.clipboard.writeText(url);
    }
  };

  if (variant === 'compact') {
    return (
      <div className={cn(
        "bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all duration-200",
        className
      )}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <Link to={`/snippet/${snippet.id}`}>
              <h3 className="font-semibold text-gray-900 text-base truncate hover:text-blue-600 transition-colors">
                {snippet.title}
              </h3>
            </Link>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {snippet.description}
            </p>
          </div>
          <span className={cn(
            "text-xs px-2 py-1 rounded-full font-medium ml-3 flex-shrink-0",
            getLanguageColor(snippet.language)
          )}>
            {snippet.language}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{formatNumber(snippet.stats.views)}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Heart className="w-4 h-4" />
              <span>{formatNumber(snippet.stats.likes)}</span>
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyCode}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Copy className="w-4 h-4" />
            </button>
            <Link
              to={`/snippet/${snippet.id}`}
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              View
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden",
      variant === 'featured' && "ring-2 ring-blue-500 ring-opacity-20",
      className
    )}>
      {/* Header */}
      <div className="p-4 pb-3">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <Link to={`/snippet/${snippet.id}`}>
              <h3 className="font-semibold text-gray-900 text-lg leading-tight hover:text-blue-600 transition-colors">
                {snippet.title}
              </h3>
            </Link>
            {snippet.description && (
              <p className="text-gray-600 mt-2 text-sm leading-relaxed line-clamp-3">
                {snippet.description}
              </p>
            )}
          </div>
          
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors flex-shrink-0 ml-3"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>

        {/* Author & Meta */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="font-medium">{snippet.author.name}</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className={cn(
              "text-xs px-2 py-1 rounded-full font-medium",
              getLanguageColor(snippet.language)
            )}>
              {snippet.language}
            </span>
            <span className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(snippet.createdAt)}</span>
            </span>
          </div>
        </div>

        {/* Tags */}
        {snippet.tags && snippet.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {snippet.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full"
              >
                #{tag}
              </span>
            ))}
            {snippet.tags.length > 3 && (
              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-500 rounded-full">
                +{snippet.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Code Preview */}
      <div className="border-t border-gray-100">
        <div className="bg-gray-50 px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Code2 className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Code Preview</span>
            </div>
            <button
              onClick={() => setShowFullCode(!showFullCode)}
              className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
            >
              <span>{showFullCode ? 'Show Less' : 'Show More'}</span>
              {showFullCode ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-gray-300 font-mono leading-relaxed">
              <code>
                {showFullCode ? snippet.code : truncateCode(snippet.code)}
                {!showFullCode && snippet.code.split('\n').length > 8 && (
                  <span className="text-gray-500">...</span>
                )}
              </code>
            </pre>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between">
          {/* Stats */}
          <div className="flex items-center space-x-6">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={cn(
                "flex items-center space-x-2 text-sm transition-colors",
                isLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"
              )}
            >
              <Heart className={cn("w-5 h-5", isLiked && "fill-current")} />
              <span>{formatNumber(snippet.stats.likes + (isLiked ? 1 : 0))}</span>
            </button>
            
            <span className="flex items-center space-x-2 text-sm text-gray-500">
              <Eye className="w-5 h-5" />
              <span>{formatNumber(snippet.stats.views)}</span>
            </span>
            
            <span className="flex items-center space-x-2 text-sm text-gray-500">
              <Download className="w-5 h-5" />
              <span>{formatNumber(snippet.stats.downloads)}</span>
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyCode}
              className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Copy className="w-4 h-4" />
              <span>Copy</span>
            </button>
            
            <button
              onClick={handleShare}
              className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <Share className="w-4 h-4" />
              <span>Share</span>
            </button>
            
            <Link
              to={`/snippet/${snippet.id}`}
              className="flex items-center space-x-1 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg transition-all duration-200 shadow-sm"
            >
              <span>View Full</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Dropdown Actions */}
      {showActions && (
        <div className="border-t border-gray-100 bg-gray-50 p-3">
          <div className="flex flex-wrap gap-2">
            <button className="text-sm text-gray-600 hover:text-gray-800 bg-white px-3 py-2 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
              Add to Favorites
            </button>
            <button className="text-sm text-gray-600 hover:text-gray-800 bg-white px-3 py-2 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
              Report Issue
            </button>
            <button className="text-sm text-gray-600 hover:text-gray-800 bg-white px-3 py-2 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
              Follow Author
            </button>
          </div>
        </div>
      )}
    </div>
  );
}