import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { ArrowLeft, Upload as UploadIcon } from "lucide-react";
import { useState } from "react";
import {
  CreateCodeSnippetRequest,
  CreateCodeSnippetResponse,
} from "@shared/api";
import Logo from "@/components/Logo";
import { useAuth, useAuthenticatedFetch } from "@/contexts/AuthContext";

export default function Upload() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();
  const authenticatedFetch = useAuthenticatedFetch();
  const [formData, setFormData] = useState<CreateCodeSnippetRequest>({
    title: "",
    description: "",
    code: "",
    price: 0,
    tags: [],
    language: "",
    framework: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated (avoid white screen)
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  const [tagInput, setTagInput] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await authenticatedFetch("/api/snippets", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        let errorMessage = "Failed to upload code snippet";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // If JSON parsing fails, use default error message
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      // Redirect to explore page or snippet detail page
      navigate("/explore");
    } catch (error) {
      console.error("Error uploading snippet:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to upload code snippet",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()],
        }));
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/"
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
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Upload Your Code
          </h1>
          <p className="text-lg text-gray-600">
            Share your code snippets with the community and earn money
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label
                htmlFor="title"
                className="text-sm font-medium text-gray-700"
              >
                Title *
              </Label>
              <Input
                id="title"
                type="text"
                placeholder="React Login Form"
                className="mt-1"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                required
              />
            </div>

            <div>
              <Label
                htmlFor="description"
                className="text-sm font-medium text-gray-700"
              >
                Description *
              </Label>
              <Textarea
                id="description"
                placeholder="Simple and responsive login component using React and Tailwind."
                className="mt-1"
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="language"
                  className="text-sm font-medium text-gray-700"
                >
                  Language *
                </Label>
                <Input
                  id="language"
                  type="text"
                  placeholder="JavaScript"
                  className="mt-1"
                  value={formData.language}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      language: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div>
                <Label
                  htmlFor="framework"
                  className="text-sm font-medium text-gray-700"
                >
                  Framework (Optional)
                </Label>
                <Input
                  id="framework"
                  type="text"
                  placeholder="React"
                  className="mt-1"
                  value={formData.framework}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      framework: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div>
              <Label
                htmlFor="price"
                className="text-sm font-medium text-gray-700"
              >
                Price ($) *
              </Label>
              <Input
                id="price"
                type="number"
                placeholder="5"
                className="mt-1"
                min="1"
                value={formData.price || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    price: Number(e.target.value),
                  }))
                }
                required
              />
            </div>

            <div>
              <Label
                htmlFor="tags"
                className="text-sm font-medium text-gray-700"
              >
                Tags
              </Label>
              <div className="mt-1">
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-md"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <Input
                  id="tags"
                  type="text"
                  placeholder="Add tags (press Enter to add)"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleTagKeyPress}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Press Enter to add each tag
                </p>
              </div>
            </div>

            <div>
              <Label
                htmlFor="code"
                className="text-sm font-medium text-gray-700"
              >
                Code *
              </Label>
              <Textarea
                id="code"
                placeholder="Paste your code here..."
                className="mt-1 font-mono text-sm"
                rows={10}
                value={formData.code}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, code: e.target.value }))
                }
                required
              />
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                disabled={loading}
              >
                <UploadIcon className="w-4 h-4" />
                {loading ? "Uploading..." : "Upload Code"}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link to="/">Cancel</Link>
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
