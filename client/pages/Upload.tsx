import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    CreateCodeSnippetRequest
} from "@shared/api";
import { 
  ArrowLeft, 
  BarChart3, 
  FileText, 
  Search, 
  Upload as UploadIcon, 
  X, 
  AlertCircle, 
  CheckCircle, 
  Loader2,
  Copy,
  FileCode
} from "lucide-react";
import { useCallback, useState, useRef } from "react";
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
  const [plagiarismStatus, setPlagiarismStatus] = useState<{
    checking: boolean;
    result: null | {
      isPlagiarized: boolean;
      similarity: number;
      status: string;
      message: string;
      matchedSnippets?: Array<{ title: string; author: string; similarity: number }>;
    };
  }>({ checking: false, result: null });
  const [tagInput, setTagInput] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Supported languages with extensions
  const supportedLanguages: { [key: string]: { extensions: string[]; label: string } } = {
    javascript: { extensions: ['.js', '.jsx', '.mjs'], label: 'JavaScript' },
    typescript: { extensions: ['.ts', '.tsx'], label: 'TypeScript' },
    python: { extensions: ['.py'], label: 'Python' },
    java: { extensions: ['.java'], label: 'Java' },
    'c++': { extensions: ['.cpp', '.cc', '.cxx', '.h', '.hpp'], label: 'C++' },
    c: { extensions: ['.c', '.h'], label: 'C' },
    'c#': { extensions: ['.cs'], label: 'C#' },
    html: { extensions: ['.html', '.htm'], label: 'HTML/CSS' },
    php: { extensions: ['.php'], label: 'PHP' },
    ruby: { extensions: ['.rb'], label: 'Ruby' },
    go: { extensions: ['.go'], label: 'Go' },
    rust: { extensions: ['.rs'], label: 'Rust' },
    kotlin: { extensions: ['.kt', '.kts'], label: 'Kotlin' },
    swift: { extensions: ['.swift'], label: 'Swift' },
    dart: { extensions: ['.dart'], label: 'Dart' },
    sql: { extensions: ['.sql'], label: 'SQL' },
    'shell/bash': { extensions: ['.sh', '.bash'], label: 'Shell/Bash' },
  };

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

  // Detect language from file extension
  const detectLanguage = (filename: string): string => {
    const extension = '.' + filename.split('.').pop()?.toLowerCase();
    for (const [lang, config] of Object.entries(supportedLanguages)) {
      if (config.extensions.includes(extension)) {
        return config.label;
      }
    }
    return 'JavaScript'; // Default
  };

  // Validate code snippet
  const validateSnippet = (snippet: CreateCodeSnippetRequest): {[key: string]: string} => {
    const newErrors: {[key: string]: string} = {};
    
    if (!snippet.title || snippet.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }
    if (snippet.title && snippet.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }
    if (!snippet.code || snippet.code.trim().length < 10) {
      newErrors.code = 'Code snippet must be at least 10 characters';
    }
    if (snippet.code && snippet.code.length > 500000) {
      newErrors.code = 'Code snippet is too large (max 500KB)';
    }
    if (snippet.description && snippet.description.length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters';
    }
    
    // Basic XSS prevention check for web languages
    if (['HTML/CSS', 'JavaScript', 'TypeScript'].includes(snippet.language)) {
      const dangerousPatterns = [
        /<script[^>]*>[\s\S]*?<\/script>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi
      ];
      
      for (const pattern of dangerousPatterns) {
        if (pattern.test(snippet.code)) {
          newErrors.code = 'Code contains potentially unsafe patterns. Please review for security issues.';
          break;
        }
      }
    }
    
    return newErrors;
  };

  // Process uploaded files with enhanced detection
  const processFiles = async (files: File[]) => {
    setUploading(true);
    setValidationErrors({});
    
    for (const file of files) {
      if (file.size > 1024 * 1024 * 5) { // 5MB limit
        setError(`${file.name} is too large (max 5MB)`);
        continue;
      }
      
      try {
        const text = await file.text();
        const detectedLanguage = detectLanguage(file.name);
        
        setFormData(prev => ({
          ...prev,
          title: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
          code: text,
          language: detectedLanguage
        }));
        
        setUploadedFileName(file.name);
        
        // Auto-detect framework based on content
        let detectedFramework = '';
        if (text.includes('import React') || text.includes('from \'react\'') || text.includes('from "react"')) {
          detectedFramework = 'Frontend';
        } else if (text.includes('import Vue') || text.includes('from \'vue\'')) {
          detectedFramework = 'Frontend';
        } else if (text.includes('@angular')) {
          detectedFramework = 'Frontend';
        } else if (text.includes('from django') || text.includes('import django')) {
          detectedFramework = 'Backend';
        } else if (text.includes('from flask') || text.includes('import flask')) {
          detectedFramework = 'Backend';
        } else if (text.includes('express') && text.includes('require')) {
          detectedFramework = 'Backend';
        }
        
        if (detectedFramework) {
          setFormData(prev => ({ ...prev, framework: detectedFramework }));
        }
        
        // Extract potential tags
        const suggestions: string[] = [];
        if (detectedLanguage === 'JavaScript' || detectedLanguage === 'TypeScript') {
          const functionMatches = text.match(/(?:function|const|let|var)\s+(\w+)/g);
          const classMatches = text.match(/class\s+(\w+)/g);
          
          if (functionMatches) {
            functionMatches.forEach(match => {
              const name = match.split(/\s+/).pop();
              if (name && name.length > 2 && !['function', 'const', 'let', 'var'].includes(name)) {
                suggestions.push(name);
              }
            });
          }
          if (classMatches) {
            classMatches.forEach(match => {
              const name = match.split(/\s+/).pop();
              if (name && name.length > 2) suggestions.push(name);
            });
          }
        }
        
        // Add suggested tags
        const uniqueSuggestions = [...new Set(suggestions.slice(0, 5))];
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, ...uniqueSuggestions.filter(s => !prev.tags.includes(s))].slice(0, 10)
        }));
        
      } catch (error) {
        setError(`Error reading ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    
    setUploading(false);
  };
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
      processFiles(files);
    }
  }, []);

  // Handle file input change
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length > 0) {
      processFiles(files);
    }
  };

  // Handle paste event
  const handlePaste = (e: React.ClipboardEvent) => {
    const pastedText = e.clipboardData.getData('text');
    if (pastedText && pastedText.length > 10) {
      setFormData(prev => ({
        ...prev,
        code: pastedText
      }));
      setUploadedFileName('Pasted code');
    }
  };

  // Copy code to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(formData.code);
    setSuccessMessage('Code copied to clipboard!');
    setTimeout(() => setSuccessMessage(''), 2000);
  };

  const handleFileUpload = (file: File) => {
    processFiles([file]);
  };

  const clearUploadedFile = () => {
    setFormData((prev) => ({ ...prev, code: "" }));
    setUploadedFileName("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate snippet first
    const errors = validateSnippet(formData);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setError('Please fix validation errors before submitting');
      return;
    }
    
    setLoading(true);
    setError("");
    setValidationErrors({});
    setPlagiarismStatus({ checking: false, result: null });

    try {
      // STEP 1: COMPULSORY PLAGIARISM CHECK
      setPlagiarismStatus({ checking: true, result: null });
      
      const plagiarismResponse = await authenticatedFetch("/api/snippets/detect-plagiarism", {
        method: "POST",
        body: JSON.stringify({
          code: formData.code,
          language: formData.language,
          authorId: user?.id,
        }),
      });

      if (!plagiarismResponse.ok) {
        throw new Error("Plagiarism check failed. Please try again.");
      }

      const plagiarismData = await plagiarismResponse.json();
      setPlagiarismStatus({ checking: false, result: plagiarismData });
      
      // BLOCK upload if plagiarism detected
      if (plagiarismData.status === 'BLOCK') {
        setError(`❌ Upload Blocked: ${plagiarismData.message}`);
        setLoading(false);
        return;
      }
      
      // WARN user if similarity is high but not blocking
      if (plagiarismData.status === 'REVIEW') {
        const proceed = window.confirm(
          `⚠️ Warning: ${plagiarismData.message}\n\n` +
          `Similarity: ${(plagiarismData.similarity * 100).toFixed(1)}%\n\n` +
          `Do you want to proceed anyway?`
        );
        
        if (!proceed) {
          setLoading(false);
          return;
        }
      }

      // STEP 2: UPLOAD THE SNIPPET
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

      // Show success message
      setSuccessMessage('✅ Snippet uploaded successfully!');
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        code: "",
        price: 0,
        tags: [],
        language: "",
        framework: "",
      });
      setUploadedFileName("");
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate("/explore");
      }, 1500);
      
    } catch (error) {
      console.error("Error uploading snippet:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to upload code snippet",
      );
    } finally {
      setLoading(false);
      setPlagiarismStatus({ checking: false, result: plagiarismStatus.result });
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
        {/* HUGE DRAMATIC HERO SECTION */}
        <div className="relative text-center mb-12 bg-gradient-to-r from-red-500 via-purple-600 to-blue-600 rounded-3xl p-12 text-white shadow-2xl overflow-hidden">
          {/* Animated background effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/30 via-pink-500/30 to-green-500/30 animate-pulse"></div>
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/20 rounded-full blur-3xl animate-bounce"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-yellow-300/30 rounded-full blur-2xl"></div>
          
          <div className="relative z-10">
            <h1 className="text-6xl sm:text-7xl font-black mb-6 drop-shadow-2xl animate-pulse">
              🚀 UPLOAD YOUR CODE! 🚀
            </h1>
            <p className="text-2xl sm:text-3xl font-bold text-white/90 mb-6">
              💰 SHARE & EARN BIG! 💰
            </p>
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 inline-block">
              <p className="text-xl font-bold">
                🔥 Join thousands of developers making money! 🔥
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-violet-200/50 p-4 sm:p-6 lg:p-8 shadow-xl">
          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-50/80 border border-green-200 rounded-xl backdrop-blur-sm flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-green-700 font-medium text-sm">{successMessage}</p>
            </div>
          )}

          {error && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50/80 border border-red-200 rounded-xl backdrop-blur-sm flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
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
                className={`mt-1 border-violet-200 focus:border-violet-500 focus:ring-violet-500 bg-white/80 ${
                  validationErrors.title ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                }`}
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                required
              />
              {validationErrors.title && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {validationErrors.title}
                </p>
              )}
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
                className={`mt-1 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 bg-white/80 ${
                  validationErrors.description ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                }`}
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
              {validationErrors.description && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {validationErrors.description}
                </p>
              )}
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div>
                <Label className="text-2xl font-black text-red-600 mb-6 block uppercase tracking-wider">
                  🔥 CHOOSE YOUR PROGRAMMING LANGUAGE! 🔥
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
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
                      className={`px-4 py-4 text-lg font-black rounded-xl border-2 transition-all duration-300 transform hover:scale-110 shadow-lg ${
                        formData.language === lang
                          ? 'bg-gradient-to-r from-green-400 to-blue-500 border-green-500 text-white shadow-2xl scale-105 animate-pulse'
                          : 'bg-gradient-to-r from-white to-gray-100 border-gray-300 text-gray-800 hover:from-yellow-200 hover:to-orange-200 hover:border-orange-400 hover:shadow-xl'
                      }`}
                    >
                      💻 {lang}
                    </button>
                  ))}
                </div>
                {!formData.language && (
                  <p className="text-xl text-red-600 mt-2 font-bold animate-bounce">⚠️ PLEASE SELECT A PROGRAMMING LANGUAGE! ⚠️</p>
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
                    className={`min-h-[200px] font-mono text-sm border-teal-200 focus:border-teal-500 focus:ring-teal-500 bg-white/80 resize-y ${
                      validationErrors.code ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                    }`}
                    value={formData.code}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, code: e.target.value }))
                    }
                    onPaste={handlePaste}
                    required
                  />
                  
                  {/* Copy Button */}
                  {formData.code && (
                    <button
                      type="button"
                      onClick={copyToClipboard}
                      className="absolute top-2 right-2 p-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors shadow-md"
                      title="Copy code"
                    >
                      <Copy size={16} />
                    </button>
                  )}
                  
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
                
                {validationErrors.code && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {validationErrors.code}
                  </p>
                )}

                {/* File Upload Button */}
                <div className="mt-2 flex justify-between items-center">
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-100 to-cyan-100 hover:from-teal-200 hover:to-cyan-200 text-teal-700 text-sm font-medium rounded-lg border border-teal-200 cursor-pointer transition-all duration-200">
                    <FileText className="w-4 h-4" />
                    Choose File
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept=".js,.ts,.jsx,.tsx,.py,.java,.cpp,.c,.cs,.html,.css,.php,.rb,.go,.rs,.kt,.swift,.txt,.sql,.sh,.bash,.dart,.json,.xml,.md,.yml,.yaml"
                      onChange={handleFileInput}
                      multiple
                    />
                  </label>
                  <p className="text-xs text-teal-600">
                    {uploading ? (
                      <span className="flex items-center gap-1">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Processing file...
                      </span>
                    ) : (
                      'Or drag & drop a code file anywhere in the text area'
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Plagiarism Check Status */}
            {plagiarismStatus.checking && (
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl flex items-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                <p className="text-blue-700 font-medium">🔍 Checking code for plagiarism...</p>
              </div>
            )}

            {plagiarismStatus.result && !plagiarismStatus.checking && (
              <div className={`p-4 rounded-xl border-2 ${
                plagiarismStatus.result.status === 'PASS' 
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300' 
                  : plagiarismStatus.result.status === 'REVIEW'
                  ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300'
                  : 'bg-gradient-to-r from-red-50 to-pink-50 border-red-300'
              }`}>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    {plagiarismStatus.result.status === 'PASS' ? (
                      <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
                    ) : plagiarismStatus.result.status === 'REVIEW' ? (
                      <AlertCircle className="w-6 h-6 text-yellow-600 mt-1" />
                    ) : (
                      <AlertCircle className="w-6 h-6 text-red-600 mt-1" />
                    )}
                    <div className="flex-1">
                      <p className={`font-bold ${
                        plagiarismStatus.result.status === 'PASS' ? 'text-green-700' :
                        plagiarismStatus.result.status === 'REVIEW' ? 'text-yellow-700' :
                        'text-red-700'
                      }`}>
                        {plagiarismStatus.result.message}
                      </p>
                      <p className={`text-sm mt-1 ${
                        plagiarismStatus.result.status === 'PASS' ? 'text-green-600' :
                        plagiarismStatus.result.status === 'REVIEW' ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        Similarity Score: {(plagiarismStatus.result.similarity * 100).toFixed(1)}%
                      </p>
                      
                      {plagiarismStatus.result.matchedSnippets && plagiarismStatus.result.matchedSnippets.length > 0 && (
                        <div className="mt-3 space-y-1">
                          <p className="text-xs font-semibold text-gray-700">Similar snippets found:</p>
                          {plagiarismStatus.result.matchedSnippets.slice(0, 3).map((match, idx) => (
                            <div key={idx} className="text-xs text-gray-600 pl-3">
                              • "{match.title}" by {match.author} ({(match.similarity * 100).toFixed(1)}% similar)
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Code Preview */}
            {formData.code && (
              <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FileCode className="w-5 h-5" />
                    Code Preview
                  </h3>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {formData.code.split('\n').length} lines • {formData.language || 'No language'}
                  </span>
                </div>
                <pre className="p-4 bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-700 overflow-x-auto max-h-64 text-sm">
                  <code>{formData.code}</code>
                </pre>
              </div>
            )}

            <div className="flex gap-4">
              <Button
                type="submit"
                className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={loading || plagiarismStatus.checking}
              >
                <UploadIcon className="w-4 h-4" />
                {plagiarismStatus.checking 
                  ? "Checking Plagiarism..." 
                  : loading 
                  ? "Uploading..." 
                  : "Upload Code"}
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
