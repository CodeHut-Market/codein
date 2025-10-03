import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    CreateCodeSnippetRequest
} from "@shared/api";
import { ArrowLeft, BarChart3, FileText, Search, Upload as UploadIcon, X } from "lucide-react";
import { useCallback, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth, useAuthenticatedFetch } from "../contexts/AuthContext";

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
  const [tagInput, setTagInput] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-emerald-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-violet-200 border-t-violet-600 mx-auto mb-4 shadow-lg"></div>
          <p className="text-violet-700 font-medium">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated (avoid white screen)
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Drag and drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, []);

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setFormData((prev) => ({ ...prev, code: content }));
      setUploadedFileName(file.name);
      
      // Auto-detect language from file extension
      const extension = file.name.split('.').pop()?.toLowerCase();
      const languageMap: { [key: string]: string } = {
        js: 'JavaScript',
        ts: 'TypeScript',
        jsx: 'React',
        tsx: 'React',
        py: 'Python',
        java: 'Java',
        cpp: 'C++',
        c: 'C',
        html: 'HTML',
        css: 'CSS',
        php: 'PHP',
        rb: 'Ruby',
        go: 'Go',
        rs: 'Rust',
        kt: 'Kotlin',
        swift: 'Swift',
      };
      
      if (extension && languageMap[extension]) {
        setFormData((prev) => ({ ...prev, language: languageMap[extension] }));
      }
    };
    reader.readAsText(file);
  };

  const clearUploadedFile = () => {
    setFormData((prev) => ({ ...prev, code: "" }));
    setUploadedFileName("");
  };

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
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-emerald-50 to-amber-50">
      {/* Header */}
      <header className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-violet-200/50 dark:border-gray-700/50 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-2 sm:py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="flex items-center gap-2 text-violet-600 hover:text-violet-800 transition-colors duration-200 font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
              </Link>
              <div className="h-4 w-px bg-violet-300"></div>
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-violet-600 to-emerald-600 bg-clip-text text-transparent">
                Upload Code
              </h1>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <Button 
                asChild 
                variant="outline"
                size="sm"
                className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-700 dark:text-emerald-300 dark:hover:bg-emerald-900/20"
              >
                <Link to="/explore" className="flex items-center gap-1 sm:gap-2">
                  <Search className="w-4 h-4" />
                  <span className="hidden sm:inline">Explore</span>
                </Link>
              </Button>
              <Button 
                asChild 
                variant="outline"
                size="sm"
                className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-700 dark:text-indigo-300 dark:hover:bg-indigo-900/20"
              >
                <Link to="/dashboard" className="flex items-center gap-1 sm:gap-2">
                  <BarChart3 className="w-4 h-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-violet-600 via-emerald-600 to-amber-600 bg-clip-text text-transparent mb-3 sm:mb-4">
            Upload Your Code
          </h1>
          <p className="text-base sm:text-lg text-gray-700 px-4">
            Share your code snippets with the community and 
            <span className="text-emerald-600 font-semibold"> earn money</span>
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-violet-200/50 p-4 sm:p-6 lg:p-8 shadow-xl">
          {error && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50/80 border border-red-200 rounded-xl backdrop-blur-sm">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <Label
                htmlFor="title"
                className="text-sm font-semibold text-violet-700"
              >
                Title *
              </Label>
              <Input
                id="title"
                type="text"
                placeholder="React Login Form"
                className="mt-1 border-violet-200 focus:border-violet-500 focus:ring-violet-500 bg-white/80"
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
                className="text-sm font-semibold text-emerald-700"
              >
                Description *
              </Label>
              <Textarea
                id="description"
                placeholder="Simple and responsive login component using React and Tailwind."
                className="mt-1 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 bg-white/80"
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

            <div className="space-y-4 sm:space-y-6">
              <div>
                <Label className="text-sm font-semibold text-amber-700 mb-3 block">
                  Primary Programming Language *
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mb-4">
                  {[
                    'JavaScript', 'Python', 'TypeScript', 'Java',
                    'C++', 'C#', 'PHP', 'Ruby', 
                    'Go', 'Rust', 'Swift', 'Kotlin',
                    'Dart', 'HTML/CSS', 'SQL', 'Shell/Bash'
                  ].map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, language: lang }))}
                      className={`px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-lg border transition-all duration-200 ${
                        formData.language === lang
                          ? 'bg-amber-100 border-amber-400 text-amber-800 shadow-sm'
                          : 'bg-white/60 border-gray-200 text-gray-700 hover:bg-amber-50 hover:border-amber-300'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
                {!formData.language && (
                  <p className="text-xs text-red-600 mt-1">Please select a programming language</p>
                )}
              </div>

              <div>
                <Label className="text-sm font-semibold text-rose-700 mb-3 block">
                  Category
                </Label>
                <select
                  value={formData.framework}
                  onChange={(e) => setFormData(prev => ({ ...prev, framework: e.target.value }))}
                  className="w-full px-3 py-3 text-sm border border-rose-200 rounded-lg bg-white/80 focus:border-rose-500 focus:ring-rose-500 focus:outline-none"
                >
                  <option value="">Select category</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Full Stack">Full Stack</option>
                  <option value="Mobile">Mobile Development</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Machine Learning">Machine Learning</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Testing">Testing</option>
                  <option value="API">API Development</option>
                  <option value="Database">Database</option>
                  <option value="Security">Security</option>
                  <option value="Algorithms">Algorithms</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <Label
                htmlFor="price"
                className="text-sm font-semibold text-cyan-700"
              >
                Price ($) *
              </Label>
              <Input
                id="price"
                type="number"
                placeholder="5"
                className="mt-1 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500 bg-white/80"
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
                className="text-sm font-semibold text-indigo-700"
              >
                Tags
              </Label>
              <div className="mt-1">
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-indigo-100 to-violet-100 text-indigo-800 text-sm rounded-full border border-indigo-200"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-200 rounded-full w-4 h-4 flex items-center justify-center text-xs transition-colors"
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
                  className="border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500 bg-white/80"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleTagKeyPress}
                />
                <p className="text-xs text-indigo-600 mt-1">
                  Press Enter to add each tag
                </p>
              </div>
            </div>

            <div>
              <Label
                htmlFor="code"
                className="text-sm font-semibold text-teal-700"
              >
                Code *
              </Label>
              
              {/* Drag & Drop Zone */}
              <div
                className={`mt-1 relative transition-all duration-300 ${
                  isDragging 
                    ? 'ring-4 ring-teal-200 ring-opacity-50 bg-teal-50/50' 
                    : ''
                }`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                {uploadedFileName && (
                  <div className="mb-2 p-3 bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-teal-700">
                        <FileText className="w-4 h-4" />
                        <span className="text-sm font-medium">Uploaded: {uploadedFileName}</span>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={clearUploadedFile}
                        className="h-6 w-6 p-0 text-teal-600 hover:text-teal-800 hover:bg-teal-100"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}

                <div className="relative">
                  <Textarea
                    id="code"
                    placeholder="Paste your code here or drag & drop a file..."
                    className="min-h-[200px] font-mono text-sm border-teal-200 focus:border-teal-500 focus:ring-teal-500 bg-white/80 resize-y"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, code: e.target.value }))
                    }
                    required
                  />
                  
                  {/* Drag Overlay */}
                  {isDragging && (
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-100/90 via-cyan-100/90 to-emerald-100/90 border-2 border-dashed border-teal-400 rounded-lg flex items-center justify-center z-10">
                      <div className="text-center p-6">
                        <UploadIcon className="w-12 h-12 text-teal-600 mx-auto mb-3 animate-bounce" />
                        <p className="text-lg font-semibold text-teal-700 mb-1">Drop your file here!</p>
                        <p className="text-sm text-teal-600">Supported: .js, .ts, .py, .java, .cpp, .html, .css and more</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* File Upload Button */}
                <div className="mt-2 flex justify-between items-center">
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-100 to-cyan-100 hover:from-teal-200 hover:to-cyan-200 text-teal-700 text-sm font-medium rounded-lg border border-teal-200 cursor-pointer transition-all duration-200">
                    <FileText className="w-4 h-4" />
                    Choose File
                    <input
                      type="file"
                      className="hidden"
                      accept=".js,.ts,.jsx,.tsx,.py,.java,.cpp,.c,.html,.css,.php,.rb,.go,.rs,.kt,.swift,.txt"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file);
                      }}
                    />
                  </label>
                  <p className="text-xs text-teal-600">
                    Or drag & drop a code file anywhere in the text area
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={loading}
              >
                <UploadIcon className="w-4 h-4" />
                {loading ? "Uploading..." : "Upload Code"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="border-violet-200 text-violet-700 hover:bg-violet-50 hover:border-violet-300 transition-colors duration-200" 
                asChild
              >
                <Link to="/">Cancel</Link>
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
