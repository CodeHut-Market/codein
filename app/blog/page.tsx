import { ArrowRight, BookOpen } from 'lucide-react';

export default function Blog() {
  // Mock blog posts for now
  const blogPosts = [
    {
      id: 1,
      title: "10 Essential JavaScript Snippets Every Developer Should Know",
      excerpt: "Boost your productivity with these commonly used JavaScript code snippets that solve everyday programming challenges.",
      date: "March 15, 2024",
      category: "JavaScript",
      readTime: "5 min read",
      featured: true
    },
    {
      id: 2,
      title: "Building Reusable React Components: Best Practices",
      excerpt: "Learn how to create maintainable and reusable React components that scale with your application.",
      date: "March 12, 2024",
      category: "React",
      readTime: "8 min read"
    },
    {
      id: 3,
      title: "Python Data Processing: Performance Tips & Tricks",
      excerpt: "Optimize your Python data processing workflows with these performance-focused code snippets.",
      date: "March 10, 2024",
      category: "Python",
      readTime: "6 min read"
    }
  ];

  const categories = [
    "All",
    "JavaScript",
    "Python",
    "React",
    "Node.js",
    "CSS",
    "TypeScript",
    "DevOps"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <BookOpen className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-6">
            CodeHut Blog
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Insights, tutorials, and best practices from the developer community. 
            Learn, grow, and stay updated with the latest in programming.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="px-4 sm:px-6 lg:px-8 mb-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === "All"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-6xl mx-auto">
          {/* Featured Post */}
          {blogPosts.filter(post => post.featured).map((post) => (
            <div key={post.id} className="bg-gradient-to-r from-primary/10 to-purple-600/10 rounded-lg p-8 mb-12 border">
              <div className="flex items-center space-x-2 mb-4">
                <span className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-xs font-medium">
                  Featured
                </span>
                <span className="text-sm text-muted-foreground">{post.category}</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">{post.readTime}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4 hover:text-primary transition-colors cursor-pointer">
                {post.title}
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{post.date}</span>
                <button className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors">
                  <span>Read More</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Regular Posts */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.filter(post => !post.featured).map((post) => (
              <article key={post.id} className="bg-card border rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-2 mb-4">
                  <span className="px-2 py-1 bg-muted text-muted-foreground rounded text-xs">
                    {post.category}
                  </span>
                  <span className="text-xs text-muted-foreground">{post.readTime}</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 hover:text-primary transition-colors cursor-pointer">
                  {post.title}
                </h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{post.date}</span>
                  <button className="text-primary hover:text-primary/80 transition-colors">
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
              Load More Posts
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
          <p className="text-muted-foreground mb-8">
            Get the latest tutorials, tips, and insights delivered to your inbox weekly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <button className="px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}