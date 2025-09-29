"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Code, 
  Lightbulb, 
  Rocket, 
  Settings, 
  Users, 
  Zap,
  Github,
  Mail,
  Bell
} from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function ComingSoonPage() {
  const searchParams = useSearchParams()
  const feature = searchParams.get('feature') || 'this feature'
  
  const upcomingFeatures = [
    {
      title: 'VS Code Extension',
      description: 'Seamlessly save and manage code snippets directly from your editor',
      icon: <Code className="h-5 w-5" />,
      status: 'In Development',
      eta: 'Q1 2026'
    },
    {
      title: 'CLI Tools',
      description: 'Command-line interface for power users and automation',
      icon: <Settings className="h-5 w-5" />,
      status: 'Planning',
      eta: 'Q2 2026'
    },
    {
      title: 'Team Collaboration',
      description: 'Advanced team features, sharing, and collaborative editing',
      icon: <Users className="h-5 w-5" />,
      status: 'In Development',
      eta: 'Q1 2026'
    },
    {
      title: 'Webhooks & API',
      description: 'Real-time notifications and advanced API integrations',
      icon: <Zap className="h-5 w-5" />,
      status: 'Planning',
      eta: 'Q2 2026'
    },
    {
      title: 'Third Party Integrations',
      description: 'Connect with GitHub, Slack, Discord, and more',
      icon: <Github className="h-5 w-5" />,
      status: 'Research',
      eta: 'Q3 2026'
    },
    {
      title: 'Advanced Search',
      description: 'AI-powered semantic search and code similarity matching',
      icon: <Lightbulb className="h-5 w-5" />,
      status: 'Research',
      eta: 'Q3 2026'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Development':
        return 'bg-blue-500/10 text-blue-700 border-blue-200'
      case 'Planning':
        return 'bg-yellow-500/10 text-yellow-700 border-yellow-200'
      case 'Research':
        return 'bg-purple-500/10 text-purple-700 border-purple-200'
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <Button variant="outline" size="sm" asChild>
          <Link href="/docs">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Docs
          </Link>
        </Button>
        <div className="h-6 border-l border-border" />
        <Badge variant="secondary" className="bg-orange-500/10 text-orange-700">
          <Clock className="h-3 w-3 mr-1" />
          Coming Soon
        </Badge>
      </div>

      {/* Main Content */}
      <div className="text-center mb-12">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <Rocket className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4">
          We're Working on {feature.charAt(0).toUpperCase() + feature.slice(1)}
        </h1>
        <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
          This feature is currently in development as part of our roadmap to make CodeHut 
          the most powerful code snippet management platform.
        </p>
        <div className="flex items-center justify-center space-x-4">
          <Button asChild>
            <Link href="/docs">
              Explore Available Features
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="#updates">
              <Bell className="h-4 w-4 mr-2" />
              Get Notified
            </Link>
          </Button>
        </div>
      </div>

      {/* Roadmap */}
      <Card className="mb-12">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center">
            <Calendar className="h-5 w-5 mr-2" />
            Development Roadmap
          </CardTitle>
          <CardDescription>
            Here's what we're working on to make CodeHut even better
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcomingFeatures.map((feature, index) => (
              <Card key={index} className="relative overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {feature.icon}
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getStatusColor(feature.status)}`}
                    >
                      {feature.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-3">
                    {feature.description}
                  </p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    Expected: {feature.eta}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Newsletter Signup */}
      <Card id="updates">
        <CardHeader className="text-center">
          <CardTitle>Stay Updated</CardTitle>
          <CardDescription>
            Be the first to know when new features are released
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="max-w-md mx-auto">
            <p className="text-muted-foreground mb-6">
              Join our development updates to get notified when features you're interested in become available.
            </p>
            <div className="space-y-4">
              <Button className="w-full" asChild>
                <Link href="/signup">
                  <Mail className="h-4 w-4 mr-2" />
                  Sign Up for Updates
                </Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="https://github.com/Piyushkumar-20/codein" target="_blank">
                  <Github className="h-4 w-4 mr-2" />
                  Follow on GitHub
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Features */}
      <div className="text-center mt-12 p-6 bg-muted/50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Available Now</h3>
        <p className="text-muted-foreground mb-4">
          While we work on these exciting features, explore what's already available:
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/upload">Upload Snippets</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/explore">Browse Library</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/docs">Documentation</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}