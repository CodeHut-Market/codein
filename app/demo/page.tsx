"use client";

import {
  ArrowRight,
  Calendar,
  Download,
  Eye,
  Filter,
  Heart,
  Search,
  Sparkles,
  Star,
  TrendingUp,
  User,
  Users
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { CodeHighlighter } from "../components/ui/syntax-highlighter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

// Sample demo data
const sampleSnippets = [
  {
    id: 1,
    title: "React Custom Hook - useLocalStorage",
    description: "A custom React hook for managing localStorage with TypeScript support",
    language: "TypeScript",
    author: "SarahK",
    views: 2847,
    likes: 156,
    downloads: 89,
    tags: ["react", "hooks", "typescript", "localstorage"],
    code: `import { useState, useEffect } from 'react';

function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue] as const;
}

export default useLocalStorage;`,
    category: "React"
  },
  {
    id: 2,
    title: "CSS Gradient Button Collection",
    description: "Beautiful animated gradient buttons with hover effects",
    language: "CSS",
    author: "CSSGuru",
    views: 1923,
    likes: 234,
    downloads: 167,
    tags: ["css", "buttons", "gradients", "animation"],
    code: `.gradient-btn {
  background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  font-weight: 600;
  padding: 12px 24px;
  position: relative;
  transition: all 0.3s ease;
  overflow: hidden;
}

.gradient-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s;
}

.gradient-btn:hover::before {
  left: 100%;
}

.gradient-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}`,
    category: "CSS"
  },
  {
    id: 3,
    title: "Python Data Validator",
    description: "Flexible data validation utility with custom rules support",
    language: "Python",
    author: "DevMaster",
    views: 1456,
    likes: 98,
    downloads: 78,
    tags: ["python", "validation", "data", "utility"],
    code: `class DataValidator:
    def __init__(self):
        self.rules = {}
    
    def add_rule(self, field, rule_func, message="Invalid value"):
        if field not in self.rules:
            self.rules[field] = []
        self.rules[field].append((rule_func, message))
    
    def validate(self, data):
        errors = {}
        
        for field, rules in self.rules.items():
            if field in data:
                for rule_func, message in rules:
                    if not rule_func(data[field]):
                        if field not in errors:
                            errors[field] = []
                        errors[field].append(message)
        
        return len(errors) == 0, errors

# Usage example
validator = DataValidator()
validator.add_rule('email', lambda x: '@' in x, "Email must contain @")
validator.add_rule('age', lambda x: isinstance(x, int) and x > 0, "Age must be positive integer")

is_valid, errors = validator.validate({'email': 'user@example.com', 'age': 25})`,
    category: "Python"
  },
  {
    id: 4,
    title: "JavaScript Debounce Function",
    description: "Performance optimization utility for limiting function calls",
    language: "JavaScript",
    author: "ReactPro",
    views: 3241,
    likes: 289,
    downloads: 198,
    tags: ["javascript", "performance", "debounce", "optimization"],
    code: `function debounce(func, wait, immediate = false) {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(this, args);
    };
    
    const callNow = immediate && !timeout;
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func.apply(this, args);
  };
}

// Usage examples
const debouncedSearch = debounce((query) => {
  console.log('Searching for:', query);
  // API call here
}, 300);

const debouncedResize = debounce(() => {
  console.log('Window resized');
  // Handle resize logic
}, 150);

// Event listeners
searchInput.addEventListener('input', (e) => debouncedSearch(e.target.value));
window.addEventListener('resize', debouncedResize);`,
    category: "JavaScript"
  }
];

export default function DemoPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selectedSnippet, setSelectedSnippet] = useState(sampleSnippets[0]);

  const categories = ["All", "React", "CSS", "Python", "JavaScript"];

  const filteredSnippets = sampleSnippets.filter(snippet => {
    const matchesSearch = snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         snippet.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         snippet.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || snippet.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Demo Banner */}
      <div className="bg-gradient-to-r from-primary/10 to-purple-600/10 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">
                🎉 You're viewing the <strong>CodeHut Demo</strong> - Experience all features with sample data
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Link href="/signup">
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Sign Up Free
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="sm">
                  Start Free Trial
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            Experience <span className="text-primary">CodeHut</span> in Action
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore our platform with sample code snippets and see how CodeHut can transform 
            your development workflow. All features are fully functional in this demo.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar - Search & Filters */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Search className="h-5 w-5 mr-2" />
                  Search & Filter
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search snippets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Categories</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(category => (
                      <Badge
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        className="cursor-pointer hover:bg-primary/10"
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Demo Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Snippets</span>
                  <span className="font-semibold">1,247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Your Favorites</span>
                  <span className="font-semibold">{favorites.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Languages</span>
                  <span className="font-semibold">15+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Team Members</span>
                  <span className="font-semibold">5</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="browse" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="browse">Browse Snippets</TabsTrigger>
                <TabsTrigger value="preview">Code Preview</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>
              
              <TabsContent value="browse" className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Showing {filteredSnippets.length} of {sampleSnippets.length} snippets
                  </p>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    More Filters
                  </Button>
                </div>

                <div className="space-y-4">
                  {filteredSnippets.map((snippet) => (
                    <Card 
                      key={snippet.id} 
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedSnippet.id === snippet.id ? 'border-primary bg-primary/5' : ''
                      }`}
                      onClick={() => setSelectedSnippet(snippet)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-2">{snippet.title}</h3>
                            <p className="text-muted-foreground text-sm mb-3">{snippet.description}</p>
                            
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                              <div className="flex items-center">
                                <User className="h-4 w-4 mr-1" />
                                {snippet.author}
                              </div>
                              <div className="flex items-center">
                                <Eye className="h-4 w-4 mr-1" />
                                {snippet.views.toLocaleString()}
                              </div>
                              <div className="flex items-center">
                                <Download className="h-4 w-4 mr-1" />
                                {snippet.downloads}
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              {snippet.tags.map(tag => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(snippet.id);
                              }}
                            >
                              <Heart 
                                className={`h-4 w-4 ${
                                  favorites.includes(snippet.id) 
                                    ? 'fill-red-500 text-red-500' 
                                    : 'text-muted-foreground'
                                }`} 
                              />
                              {snippet.likes}
                            </Button>
                            <Badge variant="outline">{snippet.language}</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="preview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{selectedSnippet.title}</CardTitle>
                        <CardDescription>by {selectedSnippet.author}</CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{selectedSnippet.language}</Badge>
                        <Badge variant="secondary">{selectedSnippet.category}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CodeHighlighter
                      code={selectedSnippet.code}
                      language={selectedSnippet.language}
                      title={selectedSnippet.title}
                      filename={`${selectedSnippet.title.toLowerCase().replace(/\s+/g, '-')}.${selectedSnippet.language.toLowerCase() === 'javascript' ? 'js' : selectedSnippet.language.toLowerCase() === 'typescript' ? 'ts' : selectedSnippet.language.toLowerCase() === 'python' ? 'py' : 'txt'}`}
                      showLineNumbers={true}
                      allowCopy={true}
                      allowDownload={true}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Popular Snippets</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {sampleSnippets.slice(0, 3).map((snippet, index) => (
                          <div key={snippet.id} className="flex items-center space-x-3">
                            <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-sm font-bold">
                              {index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{snippet.title}</p>
                              <p className="text-xs text-muted-foreground">{snippet.views.toLocaleString()} views</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>3 snippets uploaded this week</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>2 new team collaborators</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Star className="h-4 w-4 text-muted-foreground" />
                          <span>15 snippets favorited</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Download className="h-4 w-4 text-muted-foreground" />
                          <span>89 downloads generated</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* CTA Section */}
        <Card className="mt-12 bg-gradient-to-r from-primary/10 to-purple-600/10 border-primary/20">
          <CardContent className="text-center py-12">
            <h2 className="text-3xl font-bold mb-4">Ready to organize your code snippets?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              You've seen how powerful CodeHut can be. Start your free trial today and experience 
              the full platform with your own code snippets.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="text-lg px-8">
                  <Users className="h-5 w-5 mr-2" />
                  Start Free Trial - 14 Days
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  <ArrowRight className="h-5 w-5 mr-2" />
                  View Pricing Plans
                </Button>
              </Link>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              No credit card required • Full access to Pro features • Cancel anytime
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}