"use client";

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
    AlertCircle, CheckCircle,
    Copy,
    Loader2,
    Upload,
    User,
    X
} from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../../../client/contexts/AuthContext';
import { CodeSnippet } from '../../../shared/api';
import { supabase } from '../../lib/supabaseClient';
import {
    detectFramework,
    detectLanguage,
    extractTagsFromCode,
    validateSnippet
} from '../../lib/utils/snippetHelpers';

// Supported languages matching database schema
const SUPPORTED_LANGUAGES = {
  text: { extensions: ['.txt'], label: 'Plain Text' },
  javascript: { extensions: ['.js', '.jsx', '.mjs'], label: 'JavaScript' },
  typescript: { extensions: ['.ts', '.tsx'], label: 'TypeScript' },
  python: { extensions: ['.py'], label: 'Python' },
  java: { extensions: ['.java'], label: 'Java' },
  cpp: { extensions: ['.cpp', '.cc', '.cxx', '.h', '.hpp'], label: 'C++' },
  c: { extensions: ['.c', '.h'], label: 'C' },
  csharp: { extensions: ['.cs'], label: 'C#' },
  html: { extensions: ['.html', '.htm'], label: 'HTML' },
  css: { extensions: ['.css', '.scss', '.sass', '.less'], label: 'CSS' },
  sql: { extensions: ['.sql'], label: 'SQL' },
  json: { extensions: ['.json'], label: 'JSON' },
  xml: { extensions: ['.xml'], label: 'XML' },
  markdown: { extensions: ['.md', '.markdown'], label: 'Markdown' },
  yaml: { extensions: ['.yml', '.yaml'], label: 'YAML' },
  rust: { extensions: ['.rs'], label: 'Rust' },
  go: { extensions: ['.go'], label: 'Go' },
  php: { extensions: ['.php'], label: 'PHP' },
  ruby: { extensions: ['.rb'], label: 'Ruby' },
  swift: { extensions: ['.swift'], label: 'Swift' },
  kotlin: { extensions: ['.kt', '.kts'], label: 'Kotlin' }
};

// Frameworks
const FRAMEWORKS = [
  'React', 'Vue', 'Angular', 'Next.js', 'Nuxt', 'Svelte', 
  'Express', 'Django', 'Flask', 'FastAPI', 'Spring', 'Laravel',
  'Rails', 'ASP.NET', 'None'
];

interface AdvancedUploaderProps {
  onSuccess?: (snippet: CodeSnippet) => void;
  onCancel?: () => void;
}

export default function AdvancedUploader({ onSuccess, onCancel }: AdvancedUploaderProps) {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [currentSnippet, setCurrentSnippet] = useState({
    title: '',
    message: '', // description
    code: '',
    language: 'text',
    tags: [] as string[],
    framework: '',
    visibility: 'public' as 'public' | 'private' | 'unlisted',
    price: 0
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tagInput, setTagInput] = useState('');
  const [userProfile, setUserProfile] = useState<any>(null);
  const [recentSnippets, setRecentSnippets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Initialize user and profile
  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    if (!supabase || !user) return;

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (!error && profile) {
        setUserProfile(profile);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  // Handle file drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      processFiles(files);
    }
  }, []);

  // Process uploaded files
  const processFiles = async (files: File[]) => {
    setUploading(true);
    setErrors({});
    
    for (const file of files) {
      if (file.size > 1024 * 1024 * 5) { // 5MB limit
        setErrors({ file: `${file.name} is too large (max 5MB)` });
        continue;
      }
      
      try {
        const text = await file.text();
        const language = detectLanguage(file.name);
        const framework = detectFramework(text);
        const suggestedTags = extractTagsFromCode(text, language);
        
        setCurrentSnippet(prev => ({
          ...prev,
          title: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
          code: text,
          language: language,
          framework: framework || prev.framework,
          tags: [...new Set([...prev.tags, ...suggestedTags])].slice(0, 10)
        }));
      } catch (error) {
        setErrors({ file: `Error reading ${file.name}: ${(error as Error).message}` });
      }
    }
    
    setUploading(false);
  };

  // Handle drag events
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
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
      setCurrentSnippet(prev => ({
        ...prev,
        code: pastedText
      }));
    }
  };

  // Add tag
  const addTag = () => {
    if (tagInput.trim() && currentSnippet.tags.length < 10 && !currentSnippet.tags.includes(tagInput.trim())) {
      setCurrentSnippet(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim().toLowerCase()]
      }));
      setTagInput('');
    }
  };

  // Remove tag
  const removeTag = (index: number) => {
    setCurrentSnippet(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  // Submit snippet
  const handleSubmit = async () => {
    if (!user) {
      setErrors({ auth: 'You must be logged in to upload snippets' });
      return;
    }
    
    const validationErrors = validateSnippet(currentSnippet);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setUploading(true);
    setErrors({});
    
    try {
      // Prepare headers with user information
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };

      if (user) {
        headers['x-user-data'] = JSON.stringify({
          id: user.id,
          username: (user as any).user_metadata?.username || user.email?.split('@')[0] || 'User',
          email: user.email
        });
      }

      const res = await fetch('/api/snippets', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          title: currentSnippet.title.trim(),
          code: currentSnippet.code,
          description: currentSnippet.message.trim() || '',
          language: currentSnippet.language,
          price: currentSnippet.price,
          tags: currentSnippet.tags,
          framework: currentSnippet.framework || undefined,
          visibility: currentSnippet.visibility,
          allowComments: true
        })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Upload failed' }));
        throw new Error(errorData.error || `Upload failed with status ${res.status}`);
      }
      
      const data = await res.json();
      
      // Reset form
      setCurrentSnippet({
        title: '',
        message: '',
        code: '',
        language: 'text',
        tags: [],
        framework: '',
        visibility: 'public',
        price: 0
      });
      
      setSuccessMessage('Snippet uploaded successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      
      if (onSuccess && data.snippet) {
        onSuccess(data.snippet);
      }
    } catch (error) {
      console.error('Error uploading snippet:', error);
      setErrors({ submit: `Failed to upload snippet: ${(error as Error).message}` });
    } finally {
      setUploading(false);
    }
  };

  // Copy code to clipboard
  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  if (!user) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Authentication Required</CardTitle>
          <CardDescription>
            Please sign in to upload code snippets
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Profile Section */}
      {userProfile && (
        <Card>
          <CardContent className="p-4 flex items-center">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mr-4">
              {userProfile.avatar_url ? (
                <img src={userProfile.avatar_url} alt={userProfile.username} className="rounded-full" />
              ) : (
                <User className="text-muted-foreground" size={24} />
              )}
            </div>
            <div>
              <p className="font-semibold">{userProfile.username || 'Anonymous'}</p>
              <p className="text-sm text-muted-foreground">Ready to share some code?</p>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Success Message */}
      {successMessage && (
        <Card className="border-green-500 bg-green-50 dark:bg-green-950">
          <CardContent className="p-4 flex items-center">
            <CheckCircle className="mr-2 text-green-600" size={20} />
            <span className="text-green-900 dark:text-green-100">{successMessage}</span>
          </CardContent>
        </Card>
      )}
      
      {/* Error Messages */}
      {errors.submit && (
        <Card className="border-red-500 bg-red-50 dark:bg-red-950">
          <CardContent className="p-4 flex items-center">
            <AlertCircle className="mr-2 text-red-600" size={20} />
            <span className="text-red-900 dark:text-red-100">{errors.submit}</span>
          </CardContent>
        </Card>
      )}
      
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Upload className="mr-2" size={20} />
            Upload Code Snippet
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Drag and Drop Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
              dragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/25 hover:border-muted-foreground/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onPaste={handlePaste}
          >
            <Upload className="mx-auto mb-4 text-muted-foreground" size={48} />
            <p className="text-lg mb-2">Drag & drop your code file here</p>
            <p className="text-sm text-muted-foreground mb-4">or paste code directly (Ctrl+V)</p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
            >
              Browse Files
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileInput}
              className="hidden"
              accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.cs,.html,.css,.json,.xml,.md,.yml,.yaml,.rs,.go,.php,.rb,.swift,.kt,.txt"
            />
          </div>
          
          {/* Error Display */}
          {errors.file && (
            <Card className="mt-4 border-red-500 bg-red-50 dark:bg-red-950">
              <CardContent className="p-3 flex items-center">
                <AlertCircle className="mr-2 text-red-600" size={20} />
                <span className="text-red-900 dark:text-red-100">{errors.file}</span>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
      
      {/* Snippet Details Form */}
      {currentSnippet.code && (
        <Card>
          <CardHeader>
            <CardTitle>Snippet Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Title *
              </label>
              <Input
                type="text"
                value={currentSnippet.title}
                onChange={(e) => setCurrentSnippet(prev => ({ ...prev, title: e.target.value }))}
                className={errors.title ? 'border-red-500' : ''}
                placeholder="Enter snippet title"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>
            
            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <Textarea
                value={currentSnippet.message}
                onChange={(e) => setCurrentSnippet(prev => ({ ...prev, message: e.target.value }))}
                className={errors.message ? 'border-red-500' : ''}
                rows={3}
                placeholder="Brief description of your snippet"
              />
              {errors.message && (
                <p className="text-red-500 text-sm mt-1">{errors.message}</p>
              )}
            </div>
            
            {/* Language and Framework */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Language
                </label>
                <Select value={currentSnippet.language} onValueChange={(value) => setCurrentSnippet(prev => ({ ...prev, language: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(SUPPORTED_LANGUAGES).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Framework
                </label>
                <Select value={currentSnippet.framework || "none"} onValueChange={(value) => setCurrentSnippet(prev => ({ ...prev, framework: value === "none" ? "" : value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select framework" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {FRAMEWORKS.map(fw => (
                      <SelectItem key={fw} value={fw}>
                        {fw}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Tags */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {currentSnippet.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button
                      onClick={() => removeTag(index)}
                      className="ml-1 hover:text-red-600"
                    >
                      <X size={14} />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="Add tags (press Enter)"
                />
                <Button
                  onClick={addTag}
                  variant="outline"
                  disabled={!tagInput.trim() || currentSnippet.tags.length >= 10}
                >
                  Add Tag
                </Button>
              </div>
            </div>
            
            {/* Visibility */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Visibility
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="public"
                    checked={currentSnippet.visibility === 'public'}
                    onChange={(e) => setCurrentSnippet(prev => ({ ...prev, visibility: e.target.value as any }))}
                    className="mr-2"
                  />
                  Public
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="private"
                    checked={currentSnippet.visibility === 'private'}
                    onChange={(e) => setCurrentSnippet(prev => ({ ...prev, visibility: e.target.value as any }))}
                    className="mr-2"
                  />
                  Private
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="unlisted"
                    checked={currentSnippet.visibility === 'unlisted'}
                    onChange={(e) => setCurrentSnippet(prev => ({ ...prev, visibility: e.target.value as any }))}
                    className="mr-2"
                  />
                  Unlisted
                </label>
              </div>
            </div>
            
            {/* Code Preview */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Code Preview
              </label>
              <div className="relative">
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto border">
                  <code className="text-sm font-mono">{currentSnippet.code.substring(0, 500)}
                    {currentSnippet.code.length > 500 && '...'}</code>
                </pre>
                <Button
                  onClick={() => copyToClipboard(currentSnippet.code)}
                  className="absolute top-2 right-2"
                  size="sm"
                  variant="secondary"
                >
                  <Copy size={16} />
                </Button>
              </div>
              {errors.code && (
                <p className="text-red-500 text-sm mt-1">{errors.code}</p>
              )}
            </div>
            
            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={uploading || !user}
              className="w-full"
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 animate-spin" size={20} />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2" size={20} />
                  Upload Snippet
                </>
              )}
            </Button>
            
            {onCancel && (
              <Button
                onClick={onCancel}
                variant="outline"
                className="w-full"
              >
                Cancel
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
