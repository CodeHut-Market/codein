import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { getCurrentUserId, isSnippetAccessible } from "@/lib/purchaseUtils";
import { CodeSnippet } from "@shared/api";
import {
    Code,
    Download,
    Eye,
    Lock,
    ShoppingCart,
    Star,
    User,
} from "lucide-react";
import { useEffect, useState } from "react";
import FavoriteButton from "./FavoriteButton";
import PurchaseModal from "./PurchaseModal";

// Conditional Link component for both React Router and Next.js compatibility
const ConditionalLink = ({ href, children, ...props }: any) => {
  // Check if we're in a Next.js environment
  if (typeof window !== 'undefined' && window.location.pathname.includes('/snippet/')) {
    // We're likely in Next.js context, use regular anchor
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  }
  
  // Try to use React Router Link, fallback to anchor
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { Link } = require("react-router-dom");
    return <Link to={href} {...props}>{children}</Link>;
  } catch {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  }
};

// Helper function to assign colors to tags
const getTagColor = (index: number): string => {
  const colors = [
    "bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-900/20 dark:text-violet-300 dark:border-violet-800",
    "bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900/20 dark:text-cyan-300 dark:border-cyan-800", 
    "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/20 dark:text-rose-300 dark:border-rose-800",
    "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800",
    "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800",
    "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800",
  ];
  return colors[index % colors.length];
};

interface SnippetCardProps {
  snippet: CodeSnippet;
  showPurchaseButton?: boolean;
  onPurchaseComplete?: () => void;
}

export default function SnippetCard({
  snippet,
  showPurchaseButton = true,
  onPurchaseComplete,
}: SnippetCardProps) {
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showCodePreview, setShowCodePreview] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(false);

  // Check purchase status when component mounts or after purchase
  useEffect(() => {
    // Only check access for paid snippets
    if (snippet.price > 0) {
      checkAccess();
    } else {
      // Free snippets are always accessible
      setHasAccess(true);
      setCheckingAccess(false);
    }
  }, [snippet.id, snippet.price]);

  const checkAccess = async () => {
    // Don't check access for free snippets
    if (snippet.price === 0) {
      setHasAccess(true);
      setCheckingAccess(false);
      return;
    }

    setCheckingAccess(true);
    try {
      const userId = getCurrentUserId();
      const accessible = await isSnippetAccessible(snippet, userId);
      setHasAccess(accessible);
    } catch (error) {
      console.error("Error in checkAccess:", error);
      // Default to no access for paid snippets if there's an error
      setHasAccess(false);
    } finally {
      setCheckingAccess(false);
    }
  };

  const handlePurchaseComplete = () => {
    // Recheck access after purchase
    checkAccess();
    onPurchaseComplete?.();
  };

  const handleCodePreviewToggle = () => {
    if (snippet.price === 0 || hasAccess) {
      setShowCodePreview(!showCodePreview);
    } else {
      // Show purchase modal for paid snippets without access
      setShowPurchaseModal(true);
    }
  };

    return (
    <>
      <Card className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02] hover-gradient-emerald border-l-4 border-l-emerald-400 dark:border-l-emerald-500 h-full flex flex-col">
        <CardHeader className="pb-3 flex-shrink-0">
          <div className="flex justify-between items-start mb-2 gap-2">
            <CardTitle className="text-lg leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors flex-1 min-w-0">
              <span className="break-words line-clamp-2">{snippet.title}</span>
            </CardTitle>
            <Badge
              variant={snippet.price === 0 ? "secondary" : "default"}
              className={`shrink-0 ${
                snippet.price === 0 
                  ? "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800" 
                  : "bg-gradient-to-r from-violet-500 to-purple-600 text-white border-0"
              }`}
            >
              {snippet.price === 0 ? "Free" : `₹${snippet.price}`}
            </Badge>
          </div>
          <CardDescription className="text-sm leading-relaxed line-clamp-3">
            {snippet.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 flex-1 flex flex-col">
          {/* Tags - Mobile Optimized */}
          <div className="flex flex-wrap gap-1">
            {snippet.tags.slice(0, 3).map((tag, index) => (
              <Badge 
                key={tag} 
                variant="outline" 
                className={`text-xs ${getTagColor(index)}`}
              >
                <span className="truncate max-w-20">{tag}</span>
              </Badge>
            ))}
            {snippet.tags.length > 3 && (
              <Badge variant="outline" className="text-xs bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border-amber-200 dark:from-amber-900/20 dark:to-orange-900/20 dark:text-amber-300 dark:border-amber-800">
                +{snippet.tags.length - 3}
              </Badge>
            )}
          </div>

          {/* Metadata - Mobile Stack */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-500">
            <div className="flex items-center gap-1 min-w-0">
              <Code className="w-3 h-3 text-cyan-500 flex-shrink-0" />
              <span className="text-cyan-700 dark:text-cyan-400 font-medium truncate">{snippet.language}</span>
              {snippet.framework && <span className="text-violet-600 dark:text-violet-400 truncate">• {snippet.framework}</span>}
            </div>
            <div className="flex items-center gap-1 min-w-0">
              <User className="w-3 h-3 text-indigo-500 flex-shrink-0" />
              <ConditionalLink
                href={`/profile/${snippet.author}`}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium truncate"
                onClick={(e: any) => e.stopPropagation()}
              >
                {snippet.author}
              </ConditionalLink>
            </div>
          </div>

          {/* Stats - Mobile Responsive */}
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-medium text-xs sm:text-sm">{snippet.rating}</span>
              </div>
              <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <Download className="w-4 h-4" />
                <span className="font-medium text-xs sm:text-sm">{snippet.downloads}</span>
              </div>
            </div>
            <span className="text-gray-500 text-xs hidden sm:block">
              {new Date(snippet.createdAt).toLocaleDateString()}
            </span>
            <span className="text-gray-500 text-xs sm:hidden">
              {new Date(snippet.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>

          {/* Code Preview Toggle */}
          <Button
            variant="outline"
            size="sm"
            className={`w-full transition-all duration-200 ${
              snippet.price > 0 && !hasAccess 
                ? "border-rose-200 hover:border-rose-300 text-rose-700 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-400 dark:hover:bg-rose-900/10" 
                : "border-emerald-200 hover:border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-900/10"
            }`}
            onClick={handleCodePreviewToggle}
            disabled={checkingAccess}
          >
            {snippet.price > 0 && !hasAccess ? (
              <Lock className="w-4 h-4 mr-2 text-rose-500" />
            ) : (
              <Eye className="w-4 h-4 mr-2 text-emerald-500" />
            )}
            {checkingAccess
              ? "Checking access..."
              : snippet.price > 0 && !hasAccess
                ? "Purchase to View"
                : showCodePreview
                  ? "Hide Preview"
                  : "Show Preview"}
          </Button>

          {/* Code Preview */}
          {showCodePreview && (snippet.price === 0 || hasAccess) && (
            <div className="bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 rounded-lg p-4 overflow-hidden border border-slate-700">
              <pre className="text-emerald-400 text-xs font-mono overflow-x-auto">
                <code>
                  {hasAccess || snippet.price === 0
                    ? snippet.code
                    : snippet.code.length > 150
                      ? `${snippet.code.substring(0, 150)}...`
                      : snippet.code}
                </code>
              </pre>
              {!hasAccess && snippet.price > 0 && snippet.code.length > 150 && (
                <p className="text-xs text-slate-400 mt-2">
                  Preview truncated - full code available after purchase
                </p>
              )}
            </div>
          )}

          {/* Access Denied Message */}
          {showCodePreview && snippet.price > 0 && !hasAccess && (
            <div className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 border-2 border-dashed border-rose-300 dark:border-rose-700 rounded-lg p-4 text-center">
              <Lock className="w-8 h-8 mx-auto text-rose-400 mb-2" />
              <p className="text-sm text-rose-600 dark:text-rose-400 mb-2">
                This is a paid snippet. Purchase to view the full code.
              </p>
              <Button 
                size="sm" 
                onClick={() => setShowPurchaseModal(true)}
                className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white border-0"
              >
                Purchase ₹{snippet.price}
              </Button>
            </div>
          )}

          {/* Action Buttons - Mobile Stack */}
          <div className="flex flex-col sm:flex-row gap-2 mt-auto">
            {showPurchaseButton && (
              <Button
                className={`flex-1 transition-all duration-200 min-h-10 ${
                  snippet.price === 0
                    ? "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
                    : "bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white"
                }`}
                onClick={() => setShowPurchaseModal(true)}
                disabled={snippet.price === 0}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                <span className="truncate">
                  {snippet.price === 0
                    ? "Download Free"
                    : `Buy ₹${snippet.price}`}
                </span>
              </Button>
            )}

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                asChild 
                className="border-cyan-200 hover:border-cyan-300 text-cyan-700 hover:bg-cyan-50 dark:border-cyan-800 dark:text-cyan-400 dark:hover:bg-cyan-900/10 flex-1 min-h-10"
              >
                <ConditionalLink href={`/snippet/${snippet.id}`}>
                  <span className="truncate">View Details</span>
                </ConditionalLink>
              </Button>

              <FavoriteButton
                snippetId={snippet.id}
                userId={getCurrentUserId() || undefined}
                size="sm"
                variant="outline"
                initialIsFavorited={false}
                showCount
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Purchase Modal */}
      <PurchaseModal
        snippet={snippet}
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        onPurchaseComplete={handlePurchaseComplete}
      />
    </>
  );
}
