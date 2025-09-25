import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Star,
  Download,
  User,
  Code,
  Calendar,
  ShoppingCart,
  Eye,
  EyeOff,
  Lock,
} from "lucide-react";
import { CodeSnippet } from "@shared/api";
import PurchaseModal from "@/components/PurchaseModal";
import Logo from "@/components/Logo";
import { getCurrentUserId, isSnippetAccessible } from "@/lib/purchaseUtils";
import useRequireAuth from "@/hooks/useRequireAuth";

export default function SnippetDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [snippet, setSnippet] = useState<CodeSnippet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showFullCode, setShowFullCode] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(false);

  useEffect(() => {
    if (id) {
      fetchSnippet();
    }
  }, [id]);

  const fetchSnippet = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/snippets/${id}`);

      if (!response.ok) {
        if (response.status === 404) {
          setError("Code snippet not found");
        } else {
          throw new Error("Failed to fetch snippet");
        }
        return;
      }

      const data: CodeSnippet = await response.json();
      setSnippet(data);

      // Check access after setting snippet
      await checkAccess(data);
    } catch (error) {
      console.error("Error fetching snippet:", error);
      setError("Failed to load code snippet");
    } finally {
      setLoading(false);
    }
  };

  const checkAccess = async (snippetData?: CodeSnippet) => {
    const currentSnippet = snippetData || snippet;
    if (!currentSnippet) return;

    // Don't check access for free snippets
    if (currentSnippet.price === 0) {
      setHasAccess(true);
      setCheckingAccess(false);
      return;
    }

    setCheckingAccess(true);
    try {
      const userId = getCurrentUserId();
      const accessible = await isSnippetAccessible(currentSnippet, userId);
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
  };

  const handleShowCodeClick = () => {
    if (snippet && snippet.price > 0 && !hasAccess) {
  // Show purchase modal for paid snippets without access
  const requireAuth = useRequireAuth();
  if (!requireAuth()) return;
  setShowPurchaseModal(true);
    } else {
      // Toggle code view for free snippets or purchased snippets
      setShowFullCode(!showFullCode);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-background border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <Link
                to="/explore"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Link>
              <a href="https://w2sp61d0-8081.inc1.devtunnels.ms/" className="inline-flex items-center">
                <Logo size="md" />
              </a>
            </div>
          </div>
        </header>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading snippet...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !snippet) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-background border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <Link
                to="/explore"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Link>
              <a href="https://w2sp61d0-8081.inc1.devtunnels.ms/" className="inline-flex items-center">
                <Logo size="md" />
              </a>
            </div>
          </div>
        </header>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Snippet Not Found
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button asChild>
              <Link to="/explore">Browse Snippets</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link
              to="/explore"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Explore
            </Link>
            <Logo size="md" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Snippet Header */}
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {snippet.title}
                </h1>
                <p className="text-lg text-gray-600 mb-6">
                  {snippet.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {snippet.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    <span>
                      {snippet.language}
                      {snippet.framework && ` • ${snippet.framework}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <Link
                      to={`/profile/${snippet.author}`}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {snippet.author}
                    </Link>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>{snippet.rating} rating</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    <span>{snippet.downloads} downloads</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Published{" "}
                      {new Date(snippet.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Purchase Section */}
              <div className="lg:w-80">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>
                        {snippet.price === 0 ? "Free Download" : "Purchase"}
                      </span>
                      <div className="text-2xl font-bold text-green-600">
                        {snippet.price === 0 ? "Free" : `₹${snippet.price}`}
                      </div>
                    </CardTitle>
                    <CardDescription>
                      {snippet.price === 0
                        ? "Free to download and use"
                        : "One-time purchase with lifetime access"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {snippet.price === 0 ? (
                      <Button
                        className="w-full bg-green-600 hover:bg-green-700"
                        disabled
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Free Download
                      </Button>
                    ) : hasAccess ? (
                      <div className="text-center py-4">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Code className="w-8 h-8 text-green-600" />
                        </div>
                        <p className="text-green-600 font-semibold">
                          Already Purchased!
                        </p>
                        <p className="text-sm text-gray-600">
                          You have access to the full code
                        </p>
                      </div>
                    ) : (
                      <Button
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={() => setShowPurchaseModal(true)}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Buy Now for ₹{snippet.price}
                      </Button>
                    )}

                    <div className="text-xs text-gray-500">
                      <h4 className="font-semibold mb-2">What you'll get:</h4>
                      <ul className="space-y-1">
                        <li>• Complete source code</li>
                        <li>• Lifetime access</li>
                        <li>• Copy and modify rights</li>
                        <li>• Author support</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Code Preview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Code Preview</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShowCodeClick}
                  disabled={checkingAccess}
                >
                  {checkingAccess ? (
                    "Checking access..."
                  ) : snippet.price > 0 && !hasAccess ? (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Purchase to View Full Code
                    </>
                  ) : showFullCode ? (
                    <>
                      <EyeOff className="w-4 h-4 mr-2" />
                      Hide Full Code
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4 mr-2" />
                      Show Full Code
                    </>
                  )}
                </Button>
              </div>
              <CardDescription>
                {snippet.price === 0 || hasAccess
                  ? showFullCode
                    ? "Complete source code"
                    : "Preview of the code snippet"
                  : "Preview only - Purchase required for full code"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Show preview for everyone, but full code only if they have access */}
              {(snippet.price === 0 || hasAccess) && showFullCode ? (
                // Full code access - show complete code
                <div className="bg-gray-900 rounded-lg p-4 overflow-auto">
                  <pre className="text-green-400 text-sm font-mono">
                    <code>{snippet.code}</code>
                  </pre>
                </div>
              ) : (
                // Preview mode or no access - show limited preview
                <>
                  <div className="bg-gray-900 rounded-lg p-4 overflow-auto">
                    <pre className="text-green-400 text-sm font-mono">
                      <code>
                        {snippet.code.substring(0, 400)}
                        {snippet.code.length > 400 && "..."}
                        {snippet.code.length > 400 && (
                          <div className="text-gray-400 mt-4">
                            // Preview truncated -{" "}
                            {snippet.price > 0
                              ? "Purchase to see full code"
                              : "Click 'Show Full Code' to see more"}
                          </div>
                        )}
                      </code>
                    </pre>
                  </div>

                  {/* Payment required message for paid snippets */}
                  {snippet.price > 0 && !hasAccess && (
                    <div className="mt-4 p-4 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg text-center">
                      <Lock className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 mb-3">
                        This is a paid snippet. Purchase to view the complete
                        source code.
                      </p>
                      <Button
                        size="sm"
                        onClick={() => setShowPurchaseModal(true)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Purchase for ₹{snippet.price}
                      </Button>
                    </div>
                  )}

                  {snippet.price === 0 && (
                    <p className="text-xs text-gray-500 mt-2">
                      This is a preview. Click "Show Full Code" to see the
                      complete code.
                    </p>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Author Info */}
          <Card>
            <CardHeader>
              <CardTitle>About the Author</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(snippet.author)}&background=random`}
                  alt={snippet.author}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {snippet.author}
                  </h4>
                  <p className="text-sm text-gray-600">
                    Experienced {snippet.language} developer
                  </p>
                </div>
                <div className="ml-auto">
                  <Button variant="outline" asChild>
                    <Link to={`/profile/${snippet.author}`}>View Profile</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Purchase Modal */}
      <PurchaseModal
        snippet={snippet}
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        onPurchaseComplete={handlePurchaseComplete}
      />
    </div>
  );
}
