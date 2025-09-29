"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Code,
    Crown,
    Download,
    Eye,
    Grid,
    List,
    Lock,
    Search,
    Star
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const categories = [
  "All Components",
  "Forms",
  "Navigation", 
  "Data Display",
  "Feedback",
  "Layout",
  "Buttons",
  "Charts",
  "E-commerce",
  "Authentication"
];

const complexityLevels = ["All", "Beginner", "Intermediate", "Advanced", "Expert"];
const technologies = ["All", "React", "Next.js", "TypeScript", "TailwindCSS", "Framer Motion"];

const components = [
  {
    id: 1,
    name: "Advanced Data Table",
    description: "Fully featured data table with sorting, filtering, pagination, and export functionality",
    category: "Data Display",
    complexity: "Advanced",
    technologies: ["React", "TypeScript", "TailwindCSS"],
    preview: "/api/placeholder/400/250",
    downloads: 1250,
    rating: 4.9,
    isPremium: true,
    size: "Large",
    lastUpdated: "2024-01-15"
  },
  {
    id: 2,
    name: "Interactive Dashboard",
    description: "Modern dashboard layout with charts, widgets, and real-time data visualization",
    category: "Layout",
    complexity: "Expert", 
    technologies: ["React", "Chart.js", "TailwindCSS"],
    preview: "/api/placeholder/400/250",
    downloads: 890,
    rating: 5.0,
    isPremium: true,
    size: "Extra Large",
    lastUpdated: "2024-01-12"
  },
  {
    id: 3,
    name: "Authentication Flow",
    description: "Complete authentication system with login, signup, and password reset",
    category: "Authentication",
    complexity: "Intermediate",
    technologies: ["Next.js", "TypeScript", "Supabase"],
    preview: "/api/placeholder/400/250",
    downloads: 2340,
    rating: 4.8,
    isPremium: true,
    size: "Medium",
    lastUpdated: "2024-01-18"
  },
  {
    id: 4,
    name: "E-commerce Product Cards",
    description: "Beautiful product cards with animations, ratings, and shopping cart integration",
    category: "E-commerce",
    complexity: "Intermediate",
    technologies: ["React", "Framer Motion", "TailwindCSS"],
    preview: "/api/placeholder/400/250",
    downloads: 1890,
    rating: 4.7,
    isPremium: true,
    size: "Small",
    lastUpdated: "2024-01-10"
  },
  {
    id: 5,
    name: "Advanced Form Builder",
    description: "Drag-and-drop form builder with validation, conditional logic, and export options",
    category: "Forms",
    complexity: "Expert",
    technologies: ["React", "TypeScript", "React Hook Form"],
    preview: "/api/placeholder/400/250",
    downloads: 670,
    rating: 4.9,
    isPremium: true,
    size: "Extra Large",
    lastUpdated: "2024-01-20"
  },
  {
    id: 6,
    name: "Multi-step Navigation",
    description: "Wizard-style navigation with progress indicators and form validation",
    category: "Navigation",
    complexity: "Advanced",
    technologies: ["React", "TypeScript", "TailwindCSS"],
    preview: "/api/placeholder/400/250",
    downloads: 1120,
    rating: 4.6,
    isPremium: true,
    size: "Medium",
    lastUpdated: "2024-01-14"
  }
];

export default function ComponentsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Components');
  const [selectedComplexity, setSelectedComplexity] = useState('All');
  const [selectedTechnology, setSelectedTechnology] = useState('All');
  const [isSubscribed, setIsSubscribed] = useState(false); // In real app, get from auth context

  const filteredComponents = components.filter(component => {
    const matchesSearch = component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         component.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All Components' || component.category === selectedCategory;
    const matchesComplexity = selectedComplexity === 'All' || component.complexity === selectedComplexity;
    const matchesTechnology = selectedTechnology === 'All' || component.technologies.includes(selectedTechnology);

    return matchesSearch && matchesCategory && matchesComplexity && matchesTechnology;
  });

  const handleDownload = (componentId: number) => {
    if (!isSubscribed) {
      window.location.href = '/ui-library/subscribe?plan=pro';
      return;
    }
    // Handle component download
    console.log(`Downloading component ${componentId}`);
  };

  const handlePreview = (componentId: number) => {
    // Handle component preview
    console.log(`Previewing component ${componentId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Premium Components Library
            </h1>
            <p className="text-muted-foreground">
              {filteredComponents.length} professional components ready for your projects
            </p>
          </div>
          
          {!isSubscribed && (
            <div className="mt-4 lg:mt-0">
              <Button asChild>
                <Link href="/ui-library/subscribe?plan=pro">
                  <Crown className="w-4 h-4 mr-2" />
                  Subscribe for Access
                </Link>
              </Button>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-64 space-y-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search components..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Complexity */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Complexity</label>
                  <Select value={selectedComplexity} onValueChange={setSelectedComplexity}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {complexityLevels.map(level => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Technology */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Technology</label>
                  <Select value={selectedTechnology} onValueChange={setSelectedTechnology}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {technologies.map(tech => (
                        <SelectItem key={tech} value={tech}>
                          {tech}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Subscription CTA */}
            {!isSubscribed && (
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-4 text-center">
                  <Crown className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Go Premium</h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    Unlock all components with unlimited downloads
                  </p>
                  <Button size="sm" asChild>
                    <Link href="/ui-library/subscribe?plan=pro">
                      Subscribe Now
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* View Controls */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>

              <div className="text-sm text-muted-foreground">
                {filteredComponents.length} components found
              </div>
            </div>

            {/* Components Grid/List */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredComponents.map(component => (
                  <Card key={component.id} className="group hover:shadow-lg transition-all duration-300">
                    <div className="relative overflow-hidden">
                      <div className="aspect-video bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-t-lg flex items-center justify-center">
                        <div className="text-4xl opacity-20">
                          <Code />
                        </div>
                        {!isSubscribed && (
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Lock className="w-8 h-8 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="absolute top-2 left-2">
                        <Badge className="text-xs bg-primary/90">
                          {component.complexity}
                        </Badge>
                      </div>
                      <div className="absolute top-2 right-2 flex gap-1">
                        {component.isPremium && (
                          <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                            <Crown className="w-2 h-2 mr-1" />
                            Pro
                          </Badge>
                        )}
                      </div>
                    </div>

                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg line-clamp-1">{component.name}</CardTitle>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Star className="w-3 h-3 text-yellow-500 mr-1" />
                          {component.rating}
                        </div>
                      </div>
                      <CardDescription className="text-sm line-clamp-2">
                        {component.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="flex flex-wrap gap-1 mb-4">
                        {component.technologies.slice(0, 3).map((tech, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                        {component.technologies.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{component.technologies.length - 3}
                          </Badge>
                        )}
                      </div>

                      <div className="flex justify-between items-center text-xs text-muted-foreground mb-4">
                        <span>{component.downloads.toLocaleString()} downloads</span>
                        <span>{component.size}</span>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1" onClick={() => handlePreview(component.id)}>
                          <Eye className="w-3 h-3 mr-1" />
                          Preview
                        </Button>
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleDownload(component.id)}
                          disabled={!isSubscribed}
                        >
                          {isSubscribed ? (
                            <>
                              <Download className="w-3 h-3 mr-1" />
                              Download
                            </>
                          ) : (
                            <>
                              <Lock className="w-3 h-3 mr-1" />
                              Subscribe
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredComponents.map(component => (
                  <Card key={component.id} className="group hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex gap-6">
                        <div className="w-32 h-20 bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Code className="w-6 h-6 opacity-40" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-lg font-semibold truncate mr-4">{component.name}</h3>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Star className="w-3 h-3 text-yellow-500 mr-1" />
                                {component.rating}
                              </div>
                              {component.isPremium && (
                                <Badge variant="outline" className="text-xs">
                                  <Crown className="w-2 h-2 mr-1" />
                                  Pro
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                            {component.description}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex gap-2">
                              {component.technologies.slice(0, 4).map((tech, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">
                                {component.downloads.toLocaleString()} downloads
                              </span>
                              <Button size="sm" variant="outline" onClick={() => handlePreview(component.id)}>
                                <Eye className="w-3 h-3 mr-1" />
                                Preview
                              </Button>
                              <Button 
                                size="sm" 
                                onClick={() => handleDownload(component.id)}
                                disabled={!isSubscribed}
                              >
                                {isSubscribed ? (
                                  <>
                                    <Download className="w-3 h-3 mr-1" />
                                    Download
                                  </>
                                ) : (
                                  <>
                                    <Lock className="w-3 h-3 mr-1" />
                                    Subscribe
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {filteredComponents.length === 0 && (
              <div className="text-center py-12">
                <div className="text-muted-foreground mb-4">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No components found</h3>
                  <p>Try adjusting your filters or search terms</p>
                </div>
                <Button variant="outline" onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All Components');
                  setSelectedComplexity('All');
                  setSelectedTechnology('All');
                }}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}