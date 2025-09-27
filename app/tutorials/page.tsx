import { BookOpen, Code, ExternalLink, Video } from 'lucide-react';
import Link from 'next/link';

export default function Tutorials() {
  const tutorialCategories = [
    {
      name: "Getting Started",
      description: "New to CodeHut? Start here",
      tutorials: [
        { title: "Creating Your First Account", duration: "3 min", type: "video" },
        { title: "Uploading Your First Snippet", duration: "5 min", type: "interactive" },
        { title: "Exploring the Community", duration: "4 min", type: "guide" }
      ]
    },
    {
      name: "Advanced Features",
      description: "Master CodeHut's powerful tools",
      tutorials: [
        { title: "Advanced Search & Filtering", duration: "7 min", type: "video" },
        { title: "Setting Up Collections", duration: "6 min", type: "guide" },
        { title: "Monetizing Your Code", duration: "10 min", type: "interactive" }
      ]
    },
    {
      name: "Best Practices",
      description: "Write better code, get more visibility",
      tutorials: [
        { title: "Writing Clean, Reusable Snippets", duration: "12 min", type: "guide" },
        { title: "Documentation Best Practices", duration: "8 min", type: "video" },
        { title: "Building Your Developer Brand", duration: "15 min", type: "guide" }
      ]
    }
  ];

  const popularTutorials = [
    {
      title: "Complete Guide to React Hooks",
      description: "Master useState, useEffect, and custom hooks with practical examples",
      duration: "25 min",
      level: "Intermediate",
      views: "12.5k",
      rating: 4.8
    },
    {
      title: "Python API Development with FastAPI",
      description: "Build production-ready APIs from scratch",
      duration: "45 min",
      level: "Advanced",
      views: "8.2k",
      rating: 4.9
    },
    {
      title: "CSS Grid Layout Masterclass",
      description: "Create responsive layouts with CSS Grid",
      duration: "20 min",
      level: "Beginner",
      views: "15.3k",
      rating: 4.7
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Video className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-6">
            Learn with Tutorials
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Step-by-step guides, video tutorials, and interactive lessons to help you master coding and make the most of CodeHut.
          </p>
        </div>
      </section>

      {/* Search Bar */}
      <section className="px-4 sm:px-6 lg:px-8 mb-12">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search tutorials..."
              className="w-full px-6 py-4 pl-12 bg-background border-2 border-border rounded-lg focus:outline-none focus:border-primary transition-colors"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <BookOpen className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        </div>
      </section>

      {/* Popular Tutorials */}
      <section className="px-4 sm:px-6 lg:px-8 mb-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">Popular Tutorials</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularTutorials.map((tutorial, index) => (
              <div key={index} className="bg-card border rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    tutorial.level === 'Beginner' ? 'bg-green-100 text-green-700' :
                    tutorial.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {tutorial.level}
                  </span>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <span>⭐ {tutorial.rating}</span>
                    <span>•</span>
                    <span>{tutorial.views} views</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">{tutorial.title}</h3>
                <p className="text-muted-foreground mb-4">{tutorial.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{tutorial.duration}</span>
                  <button className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors">
                    <span>Start Learning</span>
                    <ExternalLink className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tutorial Categories */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">Browse by Category</h2>
          <div className="space-y-8">
            {tutorialCategories.map((category, index) => (
              <div key={index} className="bg-card border rounded-lg p-8">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                  <p className="text-muted-foreground">{category.description}</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.tutorials.map((tutorial, tutorialIndex) => (
                    <div key={tutorialIndex} className="flex items-center space-x-4 p-4 bg-background rounded-lg border hover:bg-accent transition-colors cursor-pointer">
                      <div className="flex-shrink-0">
                        {tutorial.type === 'video' && <Video className="h-5 w-5 text-primary" />}
                        {tutorial.type === 'guide' && <BookOpen className="h-5 w-5 text-primary" />}
                        {tutorial.type === 'interactive' && <Code className="h-5 w-5 text-primary" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{tutorial.title}</h4>
                        <p className="text-sm text-muted-foreground">{tutorial.duration}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-muted-foreground mb-8">
            Join thousands of developers who are improving their skills with our tutorials.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                Get Started Free
              </button>
            </Link>
            <Link href="/explore">
              <button className="px-8 py-3 border border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-primary-foreground transition-colors">
                Explore Code Snippets
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}