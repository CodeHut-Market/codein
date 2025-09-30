"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from '@/components/ui/input'
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from '@/components/ui/textarea'
import type { User } from '@supabase/supabase-js'
import {
    AlertTriangle,
    CheckCircle,
    Code2,
    DollarSign,
    FileText,
    Loader2,
    Plus,
    ShieldAlert,
    UploadCloud,
    Upload as UploadIcon,
    X
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { isSupabaseEnabled, supabase } from '../lib/supabaseClient'

export default function UploadPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Form state
  const [title, setTitle] = useState('')
  const [code, setCode] = useState('')
  const [uploading, setUploading] = useState(false)
  const [language, setLanguage] = useState('typescript')
  const [price, setPrice] = useState('0')
  const [description, setDescription] = useState('')
  const [uploadMessage, setUploadMessage] = useState<string | null>(null)
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  const [category, setCategory] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  const [allowComments, setAllowComments] = useState(true)
  
  // Plagiarism detection
  const [plagStatus, setPlagStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [similarity, setSimilarity] = useState<number | null>(null)
  const [plagMessage, setPlagMessage] = useState('')

  // Preview state
  const [showPreview, setShowPreview] = useState(false)
  
  // Drag and drop state
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedFileName, setUploadedFileName] = useState("")

  useEffect(() => {
    if (isSupabaseEnabled()) {
      supabase!.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null)
        setIsLoading(false)
      })

      const {
        data: { subscription },
      } = supabase!.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null)
        setIsLoading(false)
      })

      return () => subscription.unsubscribe()
    } else {
      setIsLoading(false)
    }
  }, [])

  const languages = [
    'typescript', 'javascript', 'python', 'java', 'cpp', 'csharp', 'go', 
    'rust', 'php', 'ruby', 'swift', 'kotlin', 'dart', 'sql', 'css', 'html'
  ]

  const categories = [
    'Frontend', 'Backend', 'Mobile', 'Data Science', 'Machine Learning', 
    'DevOps', 'UI/UX', 'Database', 'API', 'Testing', 'Utilities', 'Other'
  ]

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim()) && tags.length < 10) {
      setTags([...tags, newTag.trim()])
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  async function handleUpload() {
    if (!title.trim() || !code.trim()) return
    setUploading(true)
    setUploadMessage(null)
    try {
      // Prepare headers with user information
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };

      // Add user data to request headers if user is authenticated
      if (user) {
        headers['x-user-data'] = JSON.stringify({
          id: user.id,
          username: user.user_metadata?.username || user.email?.split('@')[0] || 'User',
          email: user.email
        });
        console.log('Upload: Adding user data to request:', {
          id: user.id,
          username: user.user_metadata?.username || user.email?.split('@')[0],
          email: user.email
        });
      } else {
        console.log('Upload: No authenticated user found');
      }

      const res = await fetch('/api/snippets', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          title: title.trim(),
          code,
          description: description.trim(),
          language,
          price: parseFloat(price) || 0,
          tags,
          category,
          isPublic,
          allowComments
        })
      })
      if (!res.ok) throw new Error('Upload failed')
      const data = await res.json()
      setUploadMessage('Uploaded successfully! Redirecting...')
      // Optimistic redirect to detail page
      if (data.snippet?.id) {
        setTimeout(() => router.push(`/snippet/${data.snippet.id}`), 600)
      }
      // Clear form (optimistic)
      setTitle('')
      setCode('')
      setDescription('')
      setPrice('0')
      setTags([])
      setCategory('')
    } catch (e) {
      setUploadMessage((e as Error).message)
    } finally {
      setUploading(false)
      setTimeout(() => setUploadMessage(null), 4000)
    }
  }

  async function detectPlagiarism() {
    if (!code.trim()) return
    try {
      setPlagStatus('loading')
      setPlagMessage('')
      const res = await fetch('/api/snippets/detect-plagiarism', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
      if (!res.ok) throw new Error('Detection failed')
      const data = await res.json()
      setSimilarity(data.similarity ?? null)
      setPlagStatus('done')
      setPlagMessage(`Similarity score: ${(data.similarity * 100).toFixed(1)}%`)
    } catch (e) {
      setPlagStatus('error')
      setPlagMessage((e as Error).message)
    } finally {
      setTimeout(() => setPlagStatus('idle'), 5000)
    }
  }

  // Drag and drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }, [])

  const handleFileUpload = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      setCode(content)
      setUploadedFileName(file.name)
      
      // Auto-detect language from file extension
      const extension = file.name.split('.').pop()?.toLowerCase()
      const languageMap: { [key: string]: string } = {
        js: 'javascript',
        ts: 'typescript',
        jsx: 'javascript',
        tsx: 'typescript',
        py: 'python',
        java: 'java',
        cpp: 'cpp',
        c: 'cpp',
        html: 'html',
        css: 'css',
        php: 'php',
        rb: 'ruby',
        go: 'go',
        rs: 'rust',
        kt: 'kotlin',
        swift: 'swift',
      }
      
      if (extension && languageMap[extension]) {
        setLanguage(languageMap[extension])
      }
      
      // Auto-generate title if empty
      if (!title.trim() && file.name) {
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "")
        const formattedName = nameWithoutExt.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
        setTitle(formattedName)
      }
    }
    reader.readAsText(file)
  }

  const clearUploadedFile = () => {
    setCode("")
    setUploadedFileName("")
  }

  const getFormProgress = () => {
    let completed = 0
    const total = 6
    if (title.trim()) completed++
    if (code.trim()) completed++
    if (description.trim()) completed++
    if (language) completed++
    if (category) completed++
    if (tags.length > 0) completed++
    return (completed / total) * 100
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please sign in to upload code snippets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/login">
              <Button className="w-full">Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl relative">
      {/* Header */}
      <div className="text-center mb-8 relative">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-emerald-500/5 via-primary/5 to-violet-500/5 rounded-2xl blur-3xl"></div>
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-emerald-600 via-primary to-violet-600 bg-clip-text text-transparent">
          Upload Code Snippet
        </h1>
        <p className="text-muted-foreground">
          Share your code with the community. Help others learn and grow.
        </p>
      </div>

      {/* Progress Indicator */}
      <Card className="mb-8 border-2 hover:border-emerald-500/20 transition-colors duration-200">
        <CardHeader className="bg-gradient-to-r from-emerald-500/5 via-primary/5 to-violet-500/5">
          <CardTitle className="text-lg flex items-center text-primary">
            <CheckCircle className="mr-2 h-5 w-5 text-emerald-600" />
            Upload Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Form Completion</span>
              <span className="text-emerald-600 font-medium">{Math.round(getFormProgress())}%</span>
            </div>
            <Progress value={getFormProgress()} className="[&>div]:bg-gradient-to-r [&>div]:from-emerald-500 [&>div]:to-primary" />
            <p className="text-xs text-muted-foreground">
              Complete all fields for the best visibility
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6 overflow-visible">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-muted/50 border border-primary/10">
              <TabsTrigger value="basic" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-emerald-600/80">Basic Info</TabsTrigger>
              <TabsTrigger value="code" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80">Code & Preview</TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-violet-600/80">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-8 overflow-visible pt-4">
              <Card className="overflow-visible">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-5 w-5" />
                    Basic Information
                  </CardTitle>
                  <CardDescription>
                    Provide essential details about your code snippet
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 overflow-visible pb-12">
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="title">
                      Title *
                    </label>
                    <Input 
                      id="title" 
                      value={title} 
                      onChange={e => setTitle(e.target.value)} 
                      placeholder="e.g., React Custom Hook for API Calls" 
                      required
                    />
                  </div>

                  <div className="grid gap-6 md:grid-cols-2 mb-8">
                    <div className="space-y-2 relative z-10 mb-6">
                      <label className="text-sm font-medium" htmlFor="language">
                        Programming Language *
                      </label>
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger className="border-2 hover:border-emerald-500/30 focus:border-emerald-500/50 transition-colors">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent className="z-[70]" position="popper" sideOffset={4}>
                          {languages.map(lang => (
                            <SelectItem key={lang} value={lang}>
                              {lang.charAt(0).toUpperCase() + lang.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 relative z-10 mb-6">
                      <label className="text-sm font-medium" htmlFor="category">
                        Category
                      </label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger className="border-2 hover:border-violet-500/30 focus:border-violet-500/50 transition-colors">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="z-[70]" position="popper" sideOffset={4}>
                          {categories.map(cat => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="description">
                      Description *
                    </label>
                    <Textarea 
                      id="description" 
                      value={description} 
                      onChange={e => setDescription(e.target.value)} 
                      placeholder="Describe what your code does, how to use it, and any special features..."
                      className="min-h-[120px]"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Tags (up to 10)
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-auto p-0 hover:bg-transparent"
                            onClick={() => removeTag(tag)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={newTag}
                        onChange={e => setNewTag(e.target.value)}
                        placeholder="Add a tag..."
                        onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addTag}
                        disabled={!newTag.trim() || tags.length >= 10}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="code" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Code2 className="mr-2 h-5 w-5" />
                    Code Editor
                  </CardTitle>
                  <CardDescription>
                    Paste your code and see a preview
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Tabs defaultValue="editor" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="editor">Editor</TabsTrigger>
                      <TabsTrigger value="preview">Preview</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="editor">
                      <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="code">
                          Code *
                        </label>
                        
                        {/* File Upload Status */}
                        {uploadedFileName && (
                          <div className="mb-2 p-3 bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-200 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-emerald-700">
                                <FileText className="w-4 h-4" />
                                <span className="text-sm font-medium">Uploaded: {uploadedFileName}</span>
                              </div>
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                onClick={clearUploadedFile}
                                className="h-6 w-6 p-0 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-100"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* Drag & Drop Zone */}
                        <div
                          className={`relative transition-all duration-300 ${
                            isDragging 
                              ? 'ring-4 ring-emerald-200 ring-opacity-50 bg-emerald-50/50' 
                              : ''
                          }`}
                          onDragEnter={handleDragEnter}
                          onDragLeave={handleDragLeave}
                          onDragOver={handleDragOver}
                          onDrop={handleDrop}
                        >
                          <Textarea 
                            id="code" 
                            value={code} 
                            onChange={e => setCode(e.target.value)} 
                            placeholder="Paste your code here or drag & drop a file..."
                            className="min-h-[400px] font-mono text-sm resize-y"
                            required
                          />
                          
                          {/* Drag Overlay */}
                          {isDragging && (
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/90 via-cyan-100/90 to-primary/10 border-2 border-dashed border-emerald-400 rounded-lg flex items-center justify-center z-10">
                              <div className="text-center p-6">
                                <UploadIcon className="w-16 h-16 text-emerald-600 mx-auto mb-4 animate-bounce" />
                                <p className="text-xl font-bold text-emerald-700 mb-2">Drop your file here!</p>
                                <p className="text-sm text-emerald-600">Supported: .js, .ts, .py, .java, .cpp, .html, .css and more</p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* File Upload Button */}
                        <div className="flex justify-between items-center mt-3">
                          <label className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-100 to-cyan-100 hover:from-emerald-200 hover:to-cyan-200 text-emerald-700 text-sm font-medium rounded-lg border border-emerald-200 cursor-pointer transition-all duration-200">
                            <FileText className="w-4 h-4" />
                            Choose File
                            <input
                              type="file"
                              className="hidden"
                              accept=".js,.ts,.jsx,.tsx,.py,.java,.cpp,.c,.html,.css,.php,.rb,.go,.rs,.kt,.swift,.txt"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) handleFileUpload(file)
                              }}
                            />
                          </label>
                          <p className="text-xs text-muted-foreground">
                            Or drag & drop a code file anywhere in the editor
                          </p>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="preview">
                      <div className="border rounded-lg p-4 bg-muted/50 min-h-[400px]">
                        <div className="flex items-center justify-between mb-4">
                          <Badge>{language}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {code.split('\n').length} lines
                          </span>
                        </div>
                        <pre className="text-sm overflow-auto">
                          <code>{code || 'Your code will appear here...'}</code>
                        </pre>
                      </div>
                    </TabsContent>
                  </Tabs>

                  {/* Plagiarism Check */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium">Code Originality Check</h4>
                      <p className="text-xs text-muted-foreground">
                        Verify your code's uniqueness
                      </p>
                    </div>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={detectPlagiarism} 
                      disabled={plagStatus === 'loading' || !code.trim()}
                    >
                      {plagStatus === 'loading' ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <ShieldAlert className="mr-2 h-4 w-4" />
                      )}
                      {plagStatus === 'loading' ? 'Checking...' : 'Check Originality'}
                    </Button>
                  </div>

                  {similarity !== null && (
                    <Card className={`mt-4 ${similarity > 0.8 ? 'border-red-200 bg-red-50 dark:bg-red-950' : similarity > 0.5 ? 'border-yellow-200 bg-yellow-50 dark:bg-yellow-950' : 'border-green-200 bg-green-50 dark:bg-green-950'}`}>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          {similarity > 0.8 ? (
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                          ) : similarity > 0.5 ? (
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                          ) : (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          )}
                          <span className="font-medium text-sm">
                            Similarity: {(similarity * 100).toFixed(1)}%
                          </span>
                        </div>
                        <Progress 
                          value={similarity * 100} 
                          className="h-2"
                        />
                        <p className="text-xs mt-2 text-muted-foreground">
                          {similarity > 0.8 ? 'High similarity detected. Please review your code.' :
                           similarity > 0.5 ? 'Moderate similarity detected. Consider adding more originality.' :
                           'Low similarity detected. Good originality!'}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="mr-2 h-5 w-5" />
                    Pricing & Visibility
                  </CardTitle>
                  <CardDescription>
                    Set your pricing and visibility preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="price">
                      Price (USD)
                    </label>
                    <Input 
                      id="price" 
                      type="number" 
                      min="0" 
                      step="0.50" 
                      value={price} 
                      onChange={e => setPrice(e.target.value)}
                      placeholder="0.00"
                    />
                    <p className="text-xs text-muted-foreground">
                      Set to 0 for free snippets
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="public" 
                        checked={isPublic} 
                        onCheckedChange={(checked) => setIsPublic(checked === true)}
                      />
                      <label htmlFor="public" className="text-sm font-medium">
                        Make this snippet public
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="comments" 
                        checked={allowComments} 
                        onCheckedChange={(checked) => setAllowComments(checked === true)}
                      />
                      <label htmlFor="comments" className="text-sm font-medium">
                        Allow comments
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Upload Button */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div>
                  <h3 className="font-medium">Ready to upload?</h3>
                  <p className="text-sm text-muted-foreground">
                    Your snippet will be reviewed and published
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    onClick={() => router.push('/explore')}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleUpload} 
                    disabled={uploading || !title.trim() || !code.trim() || !description.trim()}
                    className="inline-flex items-center gap-2"
                  >
                    {uploading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <UploadCloud className="h-4 w-4" />
                    )}
                    {uploading ? 'Uploading...' : 'Upload Snippet'}
                  </Button>
                </div>
              </div>
              {uploadMessage && (
                <div className="mt-4 p-3 rounded-md bg-muted/50">
                  <span className="text-sm">{uploadMessage}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upload Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Use descriptive titles and detailed descriptions</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Add relevant tags for better discoverability</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Include comments in your code</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Test your code before uploading</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Set appropriate pricing</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Community Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>• Ensure code originality</p>
              <p>• Use appropriate language</p>
              <p>• Provide working examples</p>
              <p>• Respect licensing terms</p>
              <p>• Be helpful and constructive</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}