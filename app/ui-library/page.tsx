"use client"

import {
    Palette,
    Code,
    Component,
    Layers,
    Sparkles,
    Star,
    Download,
    Github,
    Eye,
    Heart,
    Copy,
    CheckCircle,
    ArrowRight,
    Zap,
    Shield,
    Users,
    Crown,
    Gift,
    Rocket,
    Package
} from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Progress } from "../components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"


export default function UILibraryShowcase() {
  const [activeTab, setActiveTab] = useState('components')
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [progress, setProgress] = useState(0)
  const [previewComponent, setPreviewComponent] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedComponent, setSelectedComponent] = useState<any>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 0 // Reset to 0 when reaching 100%
        }
        return prev + 2 // Slightly faster increment
      })
    }, 60)
    return () => clearInterval(timer)
  }, [])

  // Copy to clipboard function
  const copyToClipboard = async (text: string, componentName: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(componentName)
      setTimeout(() => setCopied(null), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  // Smooth scroll to components section
  const scrollToComponents = () => {
    const componentsSection = document.getElementById('components-section')
    if (componentsSection) {
      componentsSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const componentCategories = [
    {
      id: 'components',
      name: 'Components',
      icon: Component,
      count: 45
    },
    {
      id: 'layouts',
      name: 'Layouts',
      icon: Layers,
      count: 12
    },
    {
      id: 'animations',
      name: 'Animations',
      icon: Sparkles,
      count: 28
    },
    {
      id: 'themes',
      name: 'Themes',
      icon: Palette,
      count: 8
    }
  ]

  const featuredComponents = [
    {
      name: 'Interactive Dashboard Cards',
      category: 'Layout',
      description: 'Beautiful, responsive cards with hover effects and micro-animations',
      icon: Component,
      preview: true,
      downloads: 2340,
      likes: 189,
      price: 'Free',
      gradient: 'from-blue-500 to-purple-600',
      features: [
        'Hover animations',
        'Dark mode support',
        'Responsive design',
        'Customizable themes',
        'TypeScript ready'
      ],
      code: `import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function DashboardCard() {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      <CardHeader>
        <CardTitle>Analytics Overview</CardTitle>
        <CardDescription>Your performance this month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">+12,234</div>
        <p className="text-xs text-muted-foreground">+19% from last month</p>
      </CardContent>
    </Card>
  )
}`
    },
    {
      name: 'Animated Buttons Suite',
      category: 'Interactive',
      description: 'Modern button components with ripple effects and loading states',
      icon: Zap,
      preview: true,
      downloads: 3156,
      likes: 256,
      price: '$12',
      gradient: 'from-green-500 to-teal-600',
      features: [
        'Ripple effects',
        'Loading states',
        'Icon integration',
        'Multiple variants',
        'Accessibility focused'
      ],
      code: `import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export function AnimatedButton() {
  const [loading, setLoading] = useState(false)
  
  return (
    <Button 
      onClick={() => setLoading(!loading)}
      disabled={loading}
      className="relative overflow-hidden group"
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {loading ? "Loading..." : "Click me"}
      <span className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
    </Button>
  )
}`
    },
    {
      name: 'Progress Indicators',
      category: 'Feedback',
      description: 'Elegant progress bars and loading animations for better UX',
      icon: Sparkles,
      preview: true,
      downloads: 1987,
      likes: 167,
      price: '$8',
      gradient: 'from-orange-500 to-red-600',
      features: [
        'Smooth animations',
        'Custom colors',
        'Multiple styles',
        'Real-time updates',
        'Lightweight code'
      ],
      code: `import { Progress } from "@/components/ui/progress"
import { useState, useEffect } from "react"

export function ProgressIndicator() {
  const [progress, setProgress] = useState(13)
  
  useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500)
    return () => clearTimeout(timer)
  }, [])
  
  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-sm">
        <span>Loading...</span>
        <span>{progress}%</span>
      </div>
      <Progress value={progress} className="w-full" />
    </div>
  )
}`
    },
    {
      name: 'Navigation Components',
      category: 'Navigation',
      description: 'Complete navigation suite with breadcrumbs, tabs, and sidebars',
      icon: Layers,
      preview: true,
      downloads: 2789,
      likes: 234,
      price: '$15',
      gradient: 'from-purple-500 to-pink-600',
      features: [
        'Mobile responsive',
        'Breadcrumb system',
        'Tab navigation',
        'Sidebar layouts',
        'Search integration'
      ],
      code: `import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

export function NavigationBreadcrumb() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/components">Components</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <span>Navigation</span>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}`
    }
  ]

  const pricingTiers = [
    {
      name: 'Free Components',
      price: '$0',
      description: 'Perfect for getting started',
      icon: Gift,
      popular: false,
      features: [
        '15 free components',
        'Basic documentation',
        'Community support',
        'MIT license',
        'Regular updates'
      ],
      buttonText: 'Get Started',
      buttonVariant: 'outline' as const
    },
    {
      name: 'Pro Library',
      price: '$29',
      description: 'For serious developers',
      icon: Crown,
      popular: true,
      features: [
        'All 90+ components',
        'Advanced documentation',
        'Priority support',
        'Source code access',
        'Custom themes',
        'Figma design files',
        'Video tutorials'
      ],
      buttonText: 'Start Free Trial',
      buttonVariant: 'default' as const
    },
    {
      name: 'Team License',
      price: '$99',
      description: 'For development teams',
      icon: Users,
      popular: false,
      features: [
        'Everything in Pro',
        'Team collaboration',
        'Unlimited projects',
        'White-label rights',
        'Custom components',
        'Dedicated support',
        'Training sessions'
      ],
      buttonText: 'Contact Sales',
      buttonVariant: 'outline' as const
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-900/20 dark:to-indigo-900/20">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
            <Sparkles className="w-4 h-4 mr-2" />
            UI Library Showcase
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-slate-900 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 leading-tight">
            Beautiful Components
            <br />
            <span className="text-4xl md:text-6xl">Built for Developers</span>
          </h1>
          
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
            Discover our collection of premium React components with stunning animations,
            <br />
            perfect accessibility, and production-ready code.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="lg" 
              onClick={scrollToComponents}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Eye className="w-5 h-5 mr-2" />
              Explore Components
            </Button>
            <Link href="https://github.com/CodeHut-Market/codein" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg" className="px-8 py-4 rounded-full border-2 hover:bg-slate-50 dark:hover:bg-slate-800">
                <Github className="w-5 h-5 mr-2" />
                View on GitHub
              </Button>
            </Link>
          </div>

          {/* Live Demo Progress Bar */}
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400 mb-2">
              <span>Component Library Loading</span>
              <span className="font-semibold">{progress}%</span>
            </div>
            <div className="relative h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700 shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-2 text-xs text-center text-slate-500 dark:text-slate-400">
              {progress < 100 ? 'Loading components...' : '✨ Ready to explore!'}
            </div>
          </div>
        </div>
      </div>

      {/* Component Categories */}
      <div className="container mx-auto px-4 py-16">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-12 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl p-2">
            {componentCategories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="flex flex-col items-center gap-2 py-4 px-6 rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-lg transition-all duration-200"
              >
                <category.icon className="w-6 h-6" />
                <span className="font-medium">{category.name}</span>
                <Badge variant="secondary" className="text-xs">
                  {category.count}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Featured Components Grid */}
          <TabsContent value="components" className="space-y-8" id="components-section">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                Featured Components
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                Hand-picked components that showcase the best of our library
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredComponents.map((component, index) => (
                <Card
                  key={component.name}
                  className={`group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-gradient-to-br ${component.gradient} p-1 rounded-2xl`}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="bg-white dark:bg-slate-900 rounded-xl p-6 h-full">
                    <CardHeader className="p-0 mb-4">
                      <div className="flex items-center justify-between mb-3">
                        <component.icon className="w-8 h-8 text-slate-700 dark:text-slate-300" />
                        <Badge variant="secondary" className="text-xs font-medium">
                          {component.price}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                        {component.name}
                      </CardTitle>
                      <Badge variant="outline" className="w-fit text-xs">
                        {component.category}
                      </Badge>
                    </CardHeader>
                    
                    <CardContent className="p-0 space-y-4">
                      <CardDescription className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                        {component.description}
                      </CardDescription>

                      <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1">
                          <Download className="w-3 h-3" />
                          {component.downloads.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {component.likes}
                        </div>
                      </div>

                      <div className="space-y-2">
                        {component.features.slice(0, 3).map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                            <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                            {feature}
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button 
                          size="sm" 
                          className="flex-1 text-xs"
                          onClick={() => {
                            setSelectedComponent(component)
                            setIsModalOpen(true)
                          }}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Preview
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1 text-xs"
                          onClick={() => copyToClipboard(component.code, component.name)}
                        >
                          {copied === component.name ? (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          ) : (
                            <Copy className="w-3 h-3 mr-1" />
                          )}
                          {copied === component.name ? 'Copied!' : 'Copy'}
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Other tab contents */}
          <TabsContent value="layouts" className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                Layout Components
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                Flexible layout components for modern web applications
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'Grid System', desc: 'Responsive grid layouts', icon: '⚡' },
                { name: 'Flex Containers', desc: 'Flexible box layouts', icon: '📱' },
                { name: 'Card Layouts', desc: 'Modern card designs', icon: '🎨' },
                { name: 'Dashboard Layouts', desc: 'Admin dashboard templates', icon: '📊' },
                { name: 'Landing Pages', desc: 'Marketing page layouts', icon: '🚀' },
                { name: 'Form Layouts', desc: 'Structured form designs', icon: '📝' }
              ].map((layout, idx) => (
                <Card key={idx} className="p-6 hover:shadow-lg transition-all duration-300">
                  <div className="text-3xl mb-3">{layout.icon}</div>
                  <h3 className="font-semibold mb-2">{layout.name}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{layout.desc}</p>
                  <Button size="sm" className="mt-4 w-full" variant="outline">
                    <Eye className="w-3 h-3 mr-1" />
                    Preview
                  </Button>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="animations" className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                Animation Library
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                Smooth animations and micro-interactions to enhance user experience
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: 'Fade In', type: 'Entrance', demo: 'opacity-0 animate-pulse' },
                { name: 'Slide Up', type: 'Entrance', demo: 'transform translate-y-2' },
                { name: 'Bounce', type: 'Attention', demo: 'animate-bounce' },
                { name: 'Spin', type: 'Loading', demo: 'animate-spin' },
                { name: 'Scale', type: 'Hover', demo: 'hover:scale-110' },
                { name: 'Wiggle', type: 'Interactive', demo: 'hover:animate-wiggle' },
                { name: 'Gradient', type: 'Background', demo: 'bg-gradient-to-r from-pink-500 to-violet-500' },
                { name: 'Typewriter', type: 'Text', demo: 'animate-pulse' }
              ].map((anim, idx) => (
                <Card key={idx} className="p-6 hover:shadow-lg transition-all duration-300">
                  <div className={`w-12 h-12 bg-blue-500 rounded-lg mb-4 ${anim.demo}`}></div>
                  <h3 className="font-semibold mb-1">{anim.name}</h3>
                  <Badge variant="outline" className="text-xs mb-3">{anim.type}</Badge>
                  <Button size="sm" className="w-full" variant="outline">
                    <Copy className="w-3 h-3 mr-1" />
                    Copy Code
                  </Button>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="themes" className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                Theme System
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                Customizable themes and design tokens for consistent branding
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: 'Default', colors: ['bg-blue-500', 'bg-slate-200'], desc: 'Clean and modern' },
                { name: 'Dark Mode', colors: ['bg-slate-900', 'bg-slate-700'], desc: 'Easy on the eyes' },
                { name: 'Ocean', colors: ['bg-cyan-500', 'bg-teal-400'], desc: 'Fresh and calming' },
                { name: 'Sunset', colors: ['bg-orange-500', 'bg-pink-500'], desc: 'Warm and vibrant' },
                { name: 'Forest', colors: ['bg-green-600', 'bg-emerald-400'], desc: 'Natural and organic' },
                { name: 'Purple', colors: ['bg-purple-600', 'bg-violet-400'], desc: 'Creative and bold' },
                { name: 'Monochrome', colors: ['bg-gray-900', 'bg-gray-400'], desc: 'Minimal and elegant' },
                { name: 'Neon', colors: ['bg-pink-500', 'bg-cyan-400'], desc: 'Bright and energetic' }
              ].map((theme, idx) => (
                <Card key={idx} className="p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex gap-2 mb-4">
                    {theme.colors.map((color, colorIdx) => (
                      <div key={colorIdx} className={`w-8 h-8 rounded-full ${color}`}></div>
                    ))}
                  </div>
                  <h3 className="font-semibold mb-2">{theme.name}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{theme.desc}</p>
                  <Button size="sm" className="w-full" variant="outline">
                    <Palette className="w-3 h-3 mr-1" />
                    Apply Theme
                  </Button>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Pricing Section */}
      <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Choose the plan that fits your needs. All plans include our core components.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingTiers.map((plan, index) => (
              <Card
                key={plan.name}
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl ${
                  plan.popular
                    ? 'border-2 border-blue-500 transform scale-105 shadow-2xl'
                    : 'border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center py-2 text-sm font-medium">
                    Most Popular
                  </div>
                )}
                
                <CardHeader className={`text-center ${plan.popular ? 'pt-12' : 'pt-8'}`}>
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800">
                      <plan.icon className="w-6 h-6 text-slate-700 dark:text-slate-300" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <div className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                    {plan.price}
                    <span className="text-lg font-normal text-slate-500">/month</span>
                  </div>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-slate-700 dark:text-slate-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    variant={plan.buttonVariant}
                    className={`w-full py-3 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                        : ''
                    }`}
                    onClick={() => {
                      if (plan.buttonText === 'Get Started') {
                        scrollToComponents()
                      } else if (plan.buttonText === 'Start Free Trial') {
                        window.open('/signup', '_blank')
                      } else if (plan.buttonText === 'Contact Sales') {
                        window.open('/contact', '_blank')
                      }
                    }}
                  >
                    {plan.buttonText}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">
            Ready to Build Amazing UIs?
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
            Join thousands of developers who are already using our components to build
            beautiful, accessible, and performant applications.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4"
              onClick={() => window.open('/signup', '_blank')}
            >
              <Rocket className="w-5 h-5 mr-2" />
              Start Building Today
            </Button>
            <Link href="/docs">
              <Button variant="outline" size="lg" className="px-8 py-4">
                <Package className="w-5 h-5 mr-2" />
                Browse Documentation
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Simple Modal Implementation */}
      {isModalOpen && selectedComponent && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto w-full relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 z-10 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              ✕
            </button>
            
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">{selectedComponent.name}</h2>
                <p className="text-slate-600 dark:text-slate-400">{selectedComponent.description}</p>
              </div>

              <div className="space-y-6">
                <div className="p-6 border rounded-lg bg-slate-50 dark:bg-slate-800">
                  <h4 className="text-sm font-medium mb-3">Live Preview:</h4>
                  <div className="flex justify-center">
                    {selectedComponent.name === 'Interactive Dashboard Cards' && (
                      <Card className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 w-64">
                        <CardHeader>
                          <CardTitle>Analytics Overview</CardTitle>
                          <CardDescription>Your performance this month</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">+12,234</div>
                          <p className="text-xs text-muted-foreground">+19% from last month</p>
                        </CardContent>
                      </Card>
                    )}
                    {selectedComponent.name === 'Animated Buttons Suite' && (
                      <Button className="relative overflow-hidden group">
                        Click me
                        <span className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                      </Button>
                    )}
                    {selectedComponent.name === 'Progress Indicators' && (
                      <div className="w-64 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Loading...</span>
                          <span>66%</span>
                        </div>
                        <Progress value={66} className="w-full" />
                      </div>
                    )}
                    {selectedComponent.name === 'Navigation Components' && (
                      <nav className="text-sm">
                        <span>Home</span> / <span>Components</span> / <span className="text-slate-500">Navigation</span>
                      </nav>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-3">Code:</h4>
                  <div className="relative">
                    <pre className="bg-slate-900 text-slate-50 p-4 rounded-lg text-xs overflow-x-auto">
                      <code>{selectedComponent.code}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(selectedComponent.code, selectedComponent.name)}
                    >
                      {copied === selectedComponent.name ? (
                        <CheckCircle className="w-3 h-3 mr-1" />
                      ) : (
                        <Copy className="w-3 h-3 mr-1" />
                      )}
                      {copied === selectedComponent.name ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}