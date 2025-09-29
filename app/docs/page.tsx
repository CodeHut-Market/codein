"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Book,
  Check,
  ChevronRight,
  Code,
  Copy,
  Database,
  ExternalLink,
  FileText,
  Github,
  Lightbulb,
  Search,
  Shield,
  Terminal,
  Users,
  Zap
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function DocsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const sections = [
    {
      title: 'Getting Started',
      description: 'Quick start guide and setup instructions',
      icon: <Book className="h-5 w-5" />,
      items: [
        { title: 'Introduction', href: '#introduction' },
        { title: 'Quick Start', href: '#quick-start' },
        { title: 'Installation', href: '#installation' },
        { title: 'First Steps', href: '#first-steps' }
      ]
    },
    {
      title: 'API Reference',
      description: 'Complete API documentation and endpoints',
      icon: <Code className="h-5 w-5" />,
      items: [
        { title: 'Authentication', href: '#authentication' },
        { title: 'Snippets API', href: '#snippets-api' },
        { title: 'Users API', href: '#users-api' },
        { title: 'Search API', href: '#search-api' }
      ]
    },
    {
      title: 'Integrations',
      description: 'Connect CodeHut with your favorite tools',
      icon: <Zap className="h-5 w-5" />,
      items: [
        { title: 'VS Code Extension', href: '#vscode' },
        { title: 'CLI Tools', href: '#cli' },
        { title: 'Webhooks', href: '#webhooks' },
        { title: 'Third Party', href: '#third-party' }
      ]
    },
    {
      title: 'Guides',
      description: 'Tutorials and best practices',
      icon: <Lightbulb className="h-5 w-5" />,
      items: [
        { title: 'Best Practices', href: '#best-practices' },
        { title: 'Code Organization', href: '#organization' },
        { title: 'Team Collaboration', href: '#collaboration' },
        { title: 'Security Guide', href: '#security' }
      ]
    }
  ]

  const apiEndpoints = [
    {
      method: 'GET',
      endpoint: '/api/snippets',
      description: 'Retrieve all snippets with optional filtering',
      params: [
        { name: 'page', type: 'number', description: 'Page number for pagination' },
        { name: 'limit', type: 'number', description: 'Number of results per page' },
        { name: 'language', type: 'string', description: 'Filter by programming language' },
        { name: 'search', type: 'string', description: 'Search in title and description' }
      ]
    },
    {
      method: 'POST',
      endpoint: '/api/snippets',
      description: 'Create a new code snippet',
      params: [
        { name: 'title', type: 'string', description: 'Snippet title (required)' },
        { name: 'description', type: 'string', description: 'Snippet description' },
        { name: 'code', type: 'string', description: 'The code content (required)' },
        { name: 'language', type: 'string', description: 'Programming language' },
        { name: 'tags', type: 'array', description: 'Array of tag strings' },
        { name: 'isPrivate', type: 'boolean', description: 'Whether snippet is private' }
      ]
    },
    {
      method: 'GET',
      endpoint: '/api/snippets/{id}',
      description: 'Retrieve a specific snippet by ID',
      params: [
        { name: 'id', type: 'string', description: 'Unique snippet identifier' }
      ]
    },
    {
      method: 'PUT',
      endpoint: '/api/snippets/{id}',
      description: 'Update an existing snippet',
      params: [
        { name: 'id', type: 'string', description: 'Unique snippet identifier' },
        { name: 'title', type: 'string', description: 'Updated snippet title' },
        { name: 'description', type: 'string', description: 'Updated description' },
        { name: 'code', type: 'string', description: 'Updated code content' }
      ]
    }
  ]

  const codeExamples = [
    {
      title: 'Create a Snippet',
      language: 'javascript',
      code: `// Create a new snippet
const response = await fetch('/api/snippets', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    title: 'My React Component',
    description: 'A reusable button component',
    code: 'export const Button = ({ children, onClick }) => { ... }',
    language: 'javascript',
    tags: ['react', 'component', 'ui'],
    isPrivate: false
  })
})

const snippet = await response.json()
console.log('Snippet created:', snippet.id)`
    },
    {
      title: 'Search Snippets',
      language: 'javascript',
      code: `// Search for snippets
const searchSnippets = async (query) => {
  const params = new URLSearchParams({
    search: query,
    language: 'javascript',
    page: '1',
    limit: '10'
  })
  
  const response = await fetch(\`/api/snippets?\${params}\`)
  const data = await response.json()
  
  return data.snippets
}

const results = await searchSnippets('react hooks')`
    },
    {
      title: 'CLI Usage',
      language: 'bash',
      code: `# Install CodeHut CLI
npm install -g codehut-cli

# Login to your account
codehut login

# Upload a snippet
codehut upload ./my-component.js --title "React Component" --tags react,component

# Search snippets
codehut search "react hooks" --language javascript

# Download a snippet
codehut download snippet-id-123 --output ./downloaded-snippet.js`
    }
  ]

  const quickStartSteps = [
    {
      step: 1,
      title: 'Create Your Account',
      description: 'Sign up for a free CodeHut account to get started',
      code: null
    },
    {
      step: 2,
      title: 'Get Your API Key',
      description: 'Generate an API key from your dashboard settings',
      code: `// Set your API key as an environment variable
export CODEHUT_API_KEY="your_api_key_here"`
    },
    {
      step: 3,
      title: 'Make Your First Request',
      description: 'Test the API with a simple snippet retrieval',
      code: `curl -H "Authorization: Bearer YOUR_API_KEY" \\
  https://api.codehut.com/snippets`
    },
    {
      step: 4,
      title: 'Upload Your First Snippet',
      description: 'Create and share your first code snippet',
      code: `const snippet = await createSnippet({
  title: "Hello World",
  code: "console.log('Hello, CodeHut!')",
  language: "javascript"
})`
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl md:text-5xl font-bold">
          Developer <span className="text-primary">Documentation</span>
        </h1>
        <p className="text-xl text-muted-foreground">
          Everything you need to integrate and build with CodeHut
        </p>
        
        {/* Search */}
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search documentation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
        {sections.map((section) => (
          <Card key={section.title} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  {section.icon}
                </div>
                <div>
                  <CardTitle className="text-lg">{section.title}</CardTitle>
                </div>
              </div>
              <CardDescription>{section.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {section.items.map((item) => (
                  <li key={item.title}>
                    <Link 
                      href={item.href} 
                      className="text-sm text-muted-foreground hover:text-primary flex items-center group"
                    >
                      <ChevronRight className="h-3 w-3 mr-1 group-hover:translate-x-1 transition-transform" />
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="quickstart" className="space-y-8">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="quickstart">Quick Start</TabsTrigger>
          <TabsTrigger value="api">API Reference</TabsTrigger>
          <TabsTrigger value="examples">Code Examples</TabsTrigger>
          <TabsTrigger value="guides">Guides</TabsTrigger>
        </TabsList>

        {/* Quick Start */}
        <TabsContent value="quickstart" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                Quick Start Guide
              </CardTitle>
              <CardDescription>
                Get up and running with CodeHut in minutes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {quickStartSteps.map((step) => (
                <div key={step.step} className="flex space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      {step.step}
                    </div>
                  </div>
                  <div className="space-y-2 flex-1">
                    <h3 className="font-semibold">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                    {step.code && (
                      <div className="relative">
                        <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                          <code>{step.code}</code>
                        </pre>
                        <Button
                          size="sm"
                          variant="outline"
                          className="absolute top-2 right-2"
                          onClick={() => copyToClipboard(step.code!, `step-${step.step}`)}
                        >
                          {copiedCode === `step-${step.step}` ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Reference */}
        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Code className="h-5 w-5 mr-2" />
                API Endpoints
              </CardTitle>
              <CardDescription>
                RESTful API endpoints for managing snippets and user data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {apiEndpoints.map((endpoint, index) => (
                <div key={index} className="border rounded-lg p-6 space-y-4">
                  <div className="flex items-center space-x-3">
                    <Badge 
                      variant={endpoint.method === 'GET' ? 'default' : 
                              endpoint.method === 'POST' ? 'destructive' : 
                              'secondary'}
                    >
                      {endpoint.method}
                    </Badge>
                    <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                      {endpoint.endpoint}
                    </code>
                  </div>
                  <p className="text-muted-foreground">{endpoint.description}</p>
                  
                  {endpoint.params.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Parameters:</h4>
                      <div className="space-y-2">
                        {endpoint.params.map((param) => (
                          <div key={param.name} className="flex space-x-4 text-sm">
                            <code className="bg-muted px-2 py-1 rounded font-mono">
                              {param.name}
                            </code>
                            <Badge variant="outline" className="text-xs">
                              {param.type}
                            </Badge>
                            <span className="text-muted-foreground">{param.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Code Examples */}
        <TabsContent value="examples" className="space-y-6">
          {codeExamples.map((example, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{example.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                    <code>{example.code}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(example.code, `example-${index}`)}
                  >
                    {copiedCode === `example-${index}` ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Guides */}
        <TabsContent value="guides" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Security Best Practices
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm">
                  <li>• Never commit API keys to version control</li>
                  <li>• Use environment variables for sensitive data</li>
                  <li>• Implement rate limiting in your applications</li>
                  <li>• Validate all input data before processing</li>
                  <li>• Use HTTPS for all API communications</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Team Collaboration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm">
                  <li>• Set up shared snippet libraries</li>
                  <li>• Use consistent naming conventions</li>
                  <li>• Document your code snippets thoroughly</li>
                  <li>• Implement approval workflows for public snippets</li>
                  <li>• Regular code reviews and updates</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="h-5 w-5 mr-2" />
                  Data Organization
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm">
                  <li>• Use descriptive titles and tags</li>
                  <li>• Organize snippets into collections</li>
                  <li>• Keep related snippets together</li>
                  <li>• Archive outdated code snippets</li>
                  <li>• Maintain consistent formatting</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Terminal className="h-5 w-5 mr-2" />
                  CLI Integration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm">
                  <li>• Automate snippet uploads with scripts</li>
                  <li>• Integrate with your build process</li>
                  <li>• Use aliases for common commands</li>
                  <li>• Set up configuration files</li>
                  <li>• Enable shell completion</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Resources */}
      <Card className="mt-12">
        <CardHeader>
          <CardTitle>Additional Resources</CardTitle>
          <CardDescription>
            More tools and resources to help you succeed with CodeHut
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button variant="outline" className="justify-start" asChild>
              <Link href="https://github.com/codehut/examples">
                <Github className="h-4 w-4 mr-2" />
                Example Projects
                <ExternalLink className="h-3 w-3 ml-auto" />
              </Link>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <Link href="/community">
                <Users className="h-4 w-4 mr-2" />
                Community Forum
                <ExternalLink className="h-3 w-3 ml-auto" />
              </Link>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <Link href="/changelog">
                <FileText className="h-4 w-4 mr-2" />
                Changelog
                <ExternalLink className="h-3 w-3 ml-auto" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Anchor Sections for Navigation Links */}
      <div className="space-y-12 mt-16">
        {/* Getting Started Sections */}
        <section id="introduction" className="scroll-mt-24">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Introduction</CardTitle>
              <CardDescription>Welcome to CodeHut - your code snippet management platform</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                CodeHut is a powerful platform for managing, sharing, and organizing your code snippets. 
                Whether you're a solo developer or part of a team, CodeHut helps you save time by making 
                your most useful code easily accessible and searchable.
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Store and organize code snippets in multiple programming languages</li>
                <li>Advanced search and filtering capabilities</li>
                <li>Team collaboration and sharing features</li>
                <li>API access for integration with your development workflow</li>
                <li>VS Code extension for seamless integration</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <section id="quick-start" className="scroll-mt-24">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Quick Start</CardTitle>
              <CardDescription>Get started with CodeHut in just a few steps</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Badge>1</Badge>
                  <span>Sign up for a free account</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge>2</Badge>
                  <span>Create your first snippet</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge>3</Badge>
                  <span>Organize with tags and collections</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge>4</Badge>
                  <span>Start sharing and collaborating</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section id="installation" className="scroll-mt-24">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Installation</CardTitle>
              <CardDescription>Install CodeHut tools and extensions</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="vscode" className="w-full">
                <TabsList>
                  <TabsTrigger value="vscode">VS Code Extension</TabsTrigger>
                  <TabsTrigger value="cli">CLI Tool</TabsTrigger>
                </TabsList>
                <TabsContent value="vscode">
                  <div className="space-y-4">
                    <p>Install the CodeHut VS Code extension from the marketplace:</p>
                    <div className="bg-muted p-4 rounded-lg">
                      <code>ext install codehut.codehut-vscode</code>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="cli">
                  <div className="space-y-4">
                    <p>Install the CLI tool globally using npm:</p>
                    <div className="bg-muted p-4 rounded-lg">
                      <code>npm install -g codehut-cli</code>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </section>

        <section id="first-steps" className="scroll-mt-24">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">First Steps</CardTitle>
              <CardDescription>Learn the basics of using CodeHut</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h4 className="font-semibold">Creating Your First Snippet</h4>
                <p className="text-muted-foreground">
                  Click the "Upload" button in the navigation or press Ctrl+U to create your first code snippet. 
                  Add a descriptive title, select the programming language, and paste your code.
                </p>
                <h4 className="font-semibold">Organizing with Tags</h4>
                <p className="text-muted-foreground">
                  Use tags to categorize your snippets. Tags like "react", "utility", "api" help you find 
                  your code quickly later.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* API Reference Sections */}
        <section id="authentication" className="scroll-mt-24">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Authentication</CardTitle>
              <CardDescription>API authentication and security</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>CodeHut uses API keys for authentication. Include your API key in the Authorization header:</p>
                <div className="bg-muted p-4 rounded-lg">
                  <code>Authorization: Bearer YOUR_API_KEY</code>
                </div>
                <p className="text-muted-foreground">
                  Get your API key from your account settings page.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section id="snippets-api" className="scroll-mt-24">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Snippets API</CardTitle>
              <CardDescription>Manage your code snippets programmatically</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h4 className="font-semibold">GET /api/snippets</h4>
                <p className="text-muted-foreground">Retrieve all your snippets with optional filtering</p>
                
                <h4 className="font-semibold">POST /api/snippets</h4>
                <p className="text-muted-foreground">Create a new code snippet</p>
                
                <h4 className="font-semibold">GET /api/snippets/&#123;id&#125;</h4>
                <p className="text-muted-foreground">Get a specific snippet by ID</p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section id="users-api" className="scroll-mt-24">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Users API</CardTitle>
              <CardDescription>User management and profile operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h4 className="font-semibold">GET /api/user/profile</h4>
                <p className="text-muted-foreground">Get current user profile information</p>
                
                <h4 className="font-semibold">PUT /api/user/profile</h4>
                <p className="text-muted-foreground">Update user profile settings</p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section id="search-api" className="scroll-mt-24">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Search API</CardTitle>
              <CardDescription>Advanced search and filtering capabilities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h4 className="font-semibold">GET /api/search</h4>
                <p className="text-muted-foreground">Search across all your snippets with advanced filters</p>
                
                <div className="bg-muted p-4 rounded-lg">
                  <code>GET /api/search?q=react&language=javascript&tags=component</code>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Integrations Sections */}
        <section id="vscode" className="scroll-mt-24">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">VS Code Extension</CardTitle>
              <CardDescription>Seamless integration with Visual Studio Code</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>The CodeHut VS Code extension allows you to:</p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Save code snippets directly from your editor</li>
                  <li>Search and insert snippets while coding</li>
                  <li>Browse your snippet library in the sidebar</li>
                  <li>Sync snippets across devices</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </section>

        <section id="cli" className="scroll-mt-24">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">CLI Tools</CardTitle>
              <CardDescription>Command-line interface for power users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>Use the CodeHut CLI for automation and scripting:</p>
                <div className="space-y-2">
                  <div className="bg-muted p-2 rounded">
                    <code>codehut search "react hooks"</code>
                  </div>
                  <div className="bg-muted p-2 rounded">
                    <code>codehut upload ./component.js --title "My Component"</code>
                  </div>
                  <div className="bg-muted p-2 rounded">
                    <code>codehut sync</code>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section id="webhooks" className="scroll-mt-24">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Webhooks</CardTitle>
              <CardDescription>Real-time notifications for snippet changes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>Set up webhooks to receive notifications when snippets are created, updated, or deleted:</p>
                <div className="bg-muted p-4 rounded-lg">
                  <code>{`{
  "event": "snippet.created",
  "data": {
    "id": "snippet-123",
    "title": "New React Hook",
    "language": "javascript"
  }
}`}</code>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section id="third-party" className="scroll-mt-24">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Third Party Integrations</CardTitle>
              <CardDescription>Connect with other development tools</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>CodeHut integrates with popular development tools:</p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>GitHub - Sync snippets with gists</li>
                  <li>Slack - Share snippets in team channels</li>
                  <li>Discord - Bot for snippet sharing</li>
                  <li>Notion - Import snippets into documentation</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Guides Sections */}
        <section id="best-practices" className="scroll-mt-24">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Best Practices</CardTitle>
              <CardDescription>Tips for effective snippet management</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h4 className="font-semibold">Writing Good Snippet Titles</h4>
                <p className="text-muted-foreground">
                  Use descriptive titles that clearly indicate what the code does. 
                  "React Custom Hook for API Calls" is better than "Hook".
                </p>
                
                <h4 className="font-semibold">Effective Tagging</h4>
                <p className="text-muted-foreground">
                  Use consistent, lowercase tags. Include the language, framework, and purpose.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section id="organization" className="scroll-mt-24">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Code Organization</CardTitle>
              <CardDescription>Structure your snippets for maximum efficiency</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>Organize your snippets using:</p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Collections for related snippets</li>
                  <li>Consistent tagging conventions</li>
                  <li>Clear descriptions and comments</li>
                  <li>Regular cleanup of outdated code</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </section>

        <section id="collaboration" className="scroll-mt-24">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Team Collaboration</CardTitle>
              <CardDescription>Working with teams and sharing knowledge</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>CodeHut supports team collaboration through:</p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Team workspaces with shared access</li>
                  <li>Permission controls for snippet visibility</li>
                  <li>Comment and review system</li>
                  <li>Activity feeds for team updates</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </section>

        <section id="security" className="scroll-mt-24">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Security Guide</CardTitle>
              <CardDescription>Keeping your code snippets secure</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>Security best practices:</p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Never store API keys or passwords in snippets</li>
                  <li>Use private snippets for sensitive code</li>
                  <li>Regularly review public snippet permissions</li>
                  <li>Enable two-factor authentication</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}