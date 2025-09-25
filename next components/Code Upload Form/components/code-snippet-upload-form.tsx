"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, DollarSign, Tag, Code, Layers, X, File } from "lucide-react"

interface FormData {
  title: string
  description: string
  language: string
  framework: string
  price: string
  tags: string[]
  file: File | null
}

export function CodeSnippetUploadForm() {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    language: "",
    framework: "",
    price: "",
    tags: [],
    file: null,
  })

  const [tagInput, setTagInput] = useState("")
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleTagAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault()
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()],
        }))
      }
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      setFormData((prev) => ({ ...prev, file: files[0] }))
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, file }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Handle form submission here
  }

  return (
    <Card className="w-full shadow-lg border-0 bg-[rgba(239,232,232,1)]">
      <CardHeader className="text-center pb-8 shadow-xl">
        <h1 className="text-3xl font-bold text-card-foreground mb-2">Share Professional Code Assets</h1>
        <p className="text-muted-foreground text-lg">Share your code snippets with the community and earn money</p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title and Description - Full width */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="React Login Form"
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 shadow-md bg-background"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Simple and responsive login component using React and Tailwind."
                rows={4}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 resize-none"
                required
              />
            </div>
          </div>

          {/* Language and Framework - Grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="language" className="text-sm font-medium flex items-center gap-2">
                <Code className="w-4 h-4" />
                Language <span className="text-destructive">*</span>
              </Label>
              <Input
                id="language"
                value={formData.language}
                onChange={(e) => handleInputChange("language", e.target.value)}
                placeholder="JavaScript"
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 bg-background text-card shadow-md"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="framework" className="text-sm font-medium flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Framework (Optional)
              </Label>
              <Input
                id="framework"
                value={formData.framework}
                onChange={(e) => handleInputChange("framework", e.target.value)}
                placeholder="React"
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 bg-background shadow-md"
              />
            </div>
          </div>

          {/* Price - Full width */}
          <div className="space-y-2">
            <Label htmlFor="price" className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Price ($) <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                placeholder="5"
                className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20 text-background bg-background shadow-md"
                required
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags" className="text-sm font-medium flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Tags
            </Label>
            <Input
              id="tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagAdd}
              placeholder="Add tags (press Enter to add)"
              className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 bg-background shadow-md"
            />
            <p className="text-xs text-muted-foreground">Press Enter to add each tag</p>

            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1 px-3 py-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-destructive transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload File
            </Label>

            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 bg-background ${
                isDragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/50"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {formData.file ? (
                <div className="space-y-2">
                  <File className="w-8 h-8 mx-auto text-primary" />
                  <p className="text-sm font-medium">{formData.file.name}</p>
                  <p className="text-xs text-muted-foreground">{(formData.file.size / 1024).toFixed(1)} KB</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setFormData((prev) => ({ ...prev, file: null }))}
                  >
                    Remove File
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium mb-1">Drag & drop your file here, or</p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="transition-all duration-200 hover:bg-primary hover:text-primary-foreground bg-primary text-background"
                    >
                      Browse Files
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Supports: .js, .jsx, .ts, .tsx, .py, .java, .cpp, .html, .css
                  </p>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              className="hidden"
              accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.html,.css,.json,.md"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full py-3 text-base font-medium transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
            size="lg"
          >
            <Upload className="w-5 h-5 mr-2" />
            Upload Code Snippet
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
