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
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import FavoriteButton from "./FavoriteButton";
import PurchaseModal from "./PurchaseModal";

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
      <Card className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start mb-2">
            <CardTitle className="text-lg leading-tight group-hover:text-blue-600 transition-colors">
              {snippet.title}
            </CardTitle>
            <Badge
              variant={snippet.price === 0 ? "secondary" : "default"}
              className="ml-2 shrink-0"
            >
              {snippet.price === 0 ? "Free" : `₹${snippet.price}`}
            </Badge>
          </div>
          <CardDescription className="text-sm leading-relaxed">
            {snippet.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {snippet.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {snippet.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{snippet.tags.length - 3} more
              </Badge>
            )}
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Code className="w-3 h-3" />
              <span>{snippet.language}</span>
              {snippet.framework && <span>• {snippet.framework}</span>}
            </div>
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              <Link
                to={`/profile/${snippet.author}`}
                className="hover:text-blue-600 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                {snippet.author}
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-yellow-600">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-medium">{snippet.rating}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <Download className="w-4 h-4" />
                <span>{snippet.downloads}</span>
              </div>
            </div>
            <span className="text-gray-500 text-xs">
              {new Date(snippet.createdAt).toLocaleDateString()}
            </span>
          </div>

          {/* Code Preview Toggle */}
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={handleCodePreviewToggle}
            disabled={checkingAccess}
          >
            {snippet.price > 0 && !hasAccess ? (
              <Lock className="w-4 h-4 mr-2" />
            ) : (
              <Eye className="w-4 h-4 mr-2" />
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
            <div className="bg-gray-900 rounded-lg p-3 overflow-hidden">
              <pre className="text-green-400 text-xs font-mono overflow-x-auto">
                <code>
                  {hasAccess || snippet.price === 0
                    ? snippet.code
                    : snippet.code.length > 150
                      ? `${snippet.code.substring(0, 150)}...`
                      : snippet.code}
                </code>
              </pre>
              {!hasAccess && snippet.price > 0 && snippet.code.length > 150 && (
                <p className="text-xs text-gray-400 mt-2">
                  Preview truncated - full code available after purchase
                </p>
              )}
            </div>
          )}

          {/* Access Denied Message */}
          {showCodePreview && snippet.price > 0 && !hasAccess && (
            <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <Lock className="w-8 h-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-2">
                This is a paid snippet. Purchase to view the full code.
              </p>
              <Button size="sm" onClick={() => setShowPurchaseModal(true)}>
                Purchase ₹{snippet.price}
              </Button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            {showPurchaseButton && (
              <Button
                className="flex-1"
                onClick={() => setShowPurchaseModal(true)}
                disabled={snippet.price === 0}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {snippet.price === 0
                  ? "Download Free"
                  : `Buy ₹${snippet.price}`}
              </Button>
            )}

            <Button variant="outline" asChild>
              <Link to={`/snippet/${snippet.id}`}>View Details</Link>
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
