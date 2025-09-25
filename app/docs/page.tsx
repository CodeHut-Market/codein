"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@//components/ui/button"
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
    </div>
  )
}