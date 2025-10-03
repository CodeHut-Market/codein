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
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-600 to-purple-600 dark:from-slate-100 dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-4">
            Explore Our Library
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Discover powerful components, layouts, animations, and themes crafted for modern web development
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="relative mb-16">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 p-2 bg-gradient-to-r from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-900/90 dark:via-blue-900/30 dark:to-purple-900/30 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-3xl shadow-2xl">
              {componentCategories.map((category, index) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="group relative flex flex-col items-center gap-3 py-6 px-4 md:px-8 rounded-2xl transition-all duration-500 hover:scale-105 data-[state=active]:bg-gradient-to-br data-[state=active]:from-white data-[state=active]:to-blue-50/50 dark:data-[state=active]:from-slate-800 dark:data-[state=active]:to-blue-900/30 data-[state=active]:shadow-2xl data-[state=active]:border data-[state=active]:border-blue-200/50 dark:data-[state=active]:border-blue-700/30"
                >
                  {/* Background Glow Effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 transition-all duration-500" />
                  
                  {/* Icon with Enhanced Styling */}
                  <div className="relative z-10 p-3 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 group-hover:from-blue-100 group-hover:to-purple-100 dark:group-hover:from-blue-900/50 dark:group-hover:to-purple-900/50 transition-all duration-300 shadow-lg group-hover:shadow-xl group-hover:scale-110">
                    <category.icon className="w-6 h-6 md:w-7 md:h-7 text-slate-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300" />
                  </div>
                  
                  {/* Category Name */}
                  <span className="relative z-10 font-semibold text-sm md:text-base text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors duration-300">
                    {category.name}
                  </span>
                  
                  {/* Enhanced Count Badge */}
                  <div className="relative z-10 flex items-center justify-center">
                    <Badge 
                      variant="secondary" 
                      className="text-xs font-bold px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 text-blue-700 dark:text-blue-300 border-0 group-hover:from-blue-200 group-hover:to-purple-200 dark:group-hover:from-blue-800/50 dark:group-hover:to-purple-800/50 transition-all duration-300 shadow-md group-hover:shadow-lg"
                    >
                      {category.count}
                    </Badge>
                  </div>

                  {/* Active State Indicator */}
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300 data-[state=active]:w-12" />
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Decorative Elements */}
            <div className="absolute -top-2 -left-2 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse" />
            <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-lg animate-pulse" style={{ animationDelay: '1s' }} />
          </div>

          {/* Featured Components Grid */}
          <TabsContent value="components" className="space-y-12" id="components-section">
            <div className="text-center mb-16 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50 dark:via-blue-900/20 to-transparent h-px top-1/2 transform -translate-y-1/2" />
              
              <div className="relative bg-gradient-to-br from-slate-50 via-blue-50/50 to-purple-50/30 dark:from-slate-900 dark:via-blue-900/30 dark:to-purple-900/20 rounded-3xl p-8 mx-auto max-w-3xl border border-white/50 dark:border-slate-700/30 shadow-2xl backdrop-blur-sm">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-2" />
                  <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 text-sm font-medium px-4 py-1">
                    ✨ Handpicked Selection
                  </Badge>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse ml-2" />
                </div>
                
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-600 to-purple-600 dark:from-slate-100 dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-6">
                  Featured Components
                </h2>
                
                <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
                  Hand-picked components that showcase the best of our library, each crafted with attention to detail and modern design principles
                </p>

                {/* Stats Row */}
                <div className="flex justify-center items-center gap-8 mt-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">45+</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Components</div>
                  </div>
                  <div className="w-px h-8 bg-slate-300 dark:bg-slate-600" />
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">12+</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Layouts</div>
                  </div>
                  <div className="w-px h-8 bg-slate-300 dark:bg-slate-600" />
                  <div className="text-center">
                    <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">100%</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">TypeScript</div>
                  </div>
                </div>
              </div>
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
          <TabsContent value="layouts" className="space-y-12">
            <div className="text-center mb-16 relative">
              <div className="relative bg-gradient-to-br from-slate-50 via-green-50/50 to-teal-50/30 dark:from-slate-900 dark:via-green-900/30 dark:to-teal-900/20 rounded-3xl p-8 mx-auto max-w-3xl border border-white/50 dark:border-slate-700/30 shadow-2xl backdrop-blur-sm">
                <div className="flex items-center justify-center mb-4">
                  <Badge className="bg-gradient-to-r from-green-600 to-teal-600 text-white border-0 text-sm font-medium px-4 py-1">
                    📱 Responsive Design
                  </Badge>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-green-600 to-teal-600 dark:from-slate-100 dark:via-green-400 dark:to-teal-400 bg-clip-text text-transparent mb-6">
                  Layout Components
                </h2>
                
                <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
                  Flexible and responsive layout components designed for modern web applications and perfect user experiences
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { name: 'Grid System', desc: 'Responsive grid layouts with auto-fit and flexible columns', icon: '⚡', gradient: 'from-green-500 to-teal-500', stats: '12 variants' },
                { name: 'Flex Containers', desc: 'Flexible box layouts for perfect alignment', icon: '📱', gradient: 'from-blue-500 to-cyan-500', stats: '8 patterns' },
                { name: 'Card Layouts', desc: 'Modern card designs with hover effects', icon: '🎨', gradient: 'from-purple-500 to-pink-500', stats: '15 styles' },
                { name: 'Dashboard Layouts', desc: 'Admin dashboard templates and sidebars', icon: '📊', gradient: 'from-orange-500 to-red-500', stats: '6 templates' },
                { name: 'Landing Pages', desc: 'Marketing page layouts and sections', icon: '🚀', gradient: 'from-indigo-500 to-blue-500', stats: '10 sections' },
                { name: 'Form Layouts', desc: 'Structured form designs and validation', icon: '📝', gradient: 'from-emerald-500 to-green-500', stats: '7 forms' }
              ].map((layout, idx) => (
                <Card key={idx} className={`group relative overflow-hidden p-1 bg-gradient-to-br ${layout.gradient} rounded-2xl hover:shadow-2xl transition-all duration-500 hover:scale-105`}>
                  <div className="bg-white dark:bg-slate-900 rounded-xl p-6 h-full relative">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-5 dark:opacity-10">
                      <div className="absolute inset-0 bg-gradient-to-br from-current to-transparent" />
                    </div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-4xl">{layout.icon}</div>
                        <Badge variant="outline" className="text-xs bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
                          {layout.stats}
                        </Badge>
                      </div>
                      
                      <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">{layout.name}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">{layout.desc}</p>
                      
                      <Button size="sm" className="w-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white transition-all duration-300 group-hover:scale-105">
                        <Eye className="w-3 h-3 mr-2" />
                        Preview Layout
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="animations" className="space-y-12">
            <div className="text-center mb-16 relative">
              <div className="relative bg-gradient-to-br from-slate-50 via-orange-50/50 to-red-50/30 dark:from-slate-900 dark:via-orange-900/30 dark:to-red-900/20 rounded-3xl p-8 mx-auto max-w-3xl border border-white/50 dark:border-slate-700/30 shadow-2xl backdrop-blur-sm">
                <div className="flex items-center justify-center mb-4">
                  <Badge className="bg-gradient-to-r from-orange-600 to-red-600 text-white border-0 text-sm font-medium px-4 py-1">
                    ⚡ Micro-interactions
                  </Badge>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-orange-600 to-red-600 dark:from-slate-100 dark:via-orange-400 dark:to-red-400 bg-clip-text text-transparent mb-6">
                  Animation Library
                </h2>
                
                <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
                  Smooth animations and delightful micro-interactions to enhance user experience and bring your interfaces to life
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: 'Fade In', type: 'Entrance', demo: 'opacity-50 animate-pulse', gradient: 'from-blue-400 to-blue-600', duration: '300ms' },
                { name: 'Slide Up', type: 'Entrance', demo: 'transform translate-y-1 hover:-translate-y-1', gradient: 'from-green-400 to-green-600', duration: '400ms' },
                { name: 'Bounce', type: 'Attention', demo: 'animate-bounce', gradient: 'from-orange-400 to-orange-600', duration: '600ms' },
                { name: 'Spin', type: 'Loading', demo: 'animate-spin', gradient: 'from-purple-400 to-purple-600', duration: '1000ms' },
                { name: 'Scale', type: 'Hover', demo: 'hover:scale-110 transition-transform', gradient: 'from-pink-400 to-pink-600', duration: '200ms' },
                { name: 'Wiggle', type: 'Interactive', demo: 'hover:animate-pulse', gradient: 'from-indigo-400 to-indigo-600', duration: '250ms' },
                { name: 'Gradient', type: 'Background', demo: 'bg-gradient-to-r from-pink-500 via-purple-500 to-violet-500', gradient: 'from-gradient-start to-gradient-end', duration: '500ms' },
                { name: 'Typewriter', type: 'Text', demo: 'animate-pulse', gradient: 'from-teal-400 to-teal-600', duration: '800ms' }
              ].map((anim, idx) => (
                <Card key={idx} className="group p-6 hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 border-0 shadow-lg">
                  {/* Demo Animation Area */}
                  <div className="relative h-20 mb-4 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-xl overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${anim.gradient} shadow-lg ${anim.demo}`} />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">{anim.name}</h3>
                      <Badge variant="outline" className="text-xs bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 border-0">
                        {anim.duration}
                      </Badge>
                    </div>
                    
                    <Badge className={`text-xs w-fit bg-gradient-to-r ${anim.gradient} text-white border-0`}>
                      {anim.type}
                    </Badge>
                    
                    <Button size="sm" className="w-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white text-xs transition-all duration-300 group-hover:scale-105">
                      <Copy className="w-3 h-3 mr-1" />
                      Copy Animation
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="themes" className="space-y-12">
            <div className="text-center mb-16 relative">
              <div className="relative bg-gradient-to-br from-slate-50 via-purple-50/50 to-pink-50/30 dark:from-slate-900 dark:via-purple-900/30 dark:to-pink-900/20 rounded-3xl p-8 mx-auto max-w-3xl border border-white/50 dark:border-slate-700/30 shadow-2xl backdrop-blur-sm">
                <div className="flex items-center justify-center mb-4">
                  <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 text-sm font-medium px-4 py-1">
                    🎨 Design Tokens
                  </Badge>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-purple-600 to-pink-600 dark:from-slate-100 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-6">
                  Theme System
                </h2>
                
                <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
                  Customizable themes and design tokens for consistent branding across your entire application ecosystem
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: 'Default', colors: ['#3b82f6', '#e2e8f0', '#64748b'], desc: 'Clean and modern design', popularity: '89%', gradient: 'from-blue-500 to-slate-300' },
                { name: 'Dark Mode', colors: ['#0f172a', '#475569', '#94a3b8'], desc: 'Easy on the eyes', popularity: '95%', gradient: 'from-slate-900 to-slate-600' },
                { name: 'Ocean', colors: ['#06b6d4', '#14b8a6', '#22d3ee'], desc: 'Fresh and calming vibes', popularity: '78%', gradient: 'from-cyan-500 to-teal-400' },
                { name: 'Sunset', colors: ['#f97316', '#ec4899', '#f59e0b'], desc: 'Warm and vibrant energy', popularity: '72%', gradient: 'from-orange-500 to-pink-500' },
                { name: 'Forest', colors: ['#059669', '#10b981', '#34d399'], desc: 'Natural and organic feel', popularity: '65%', gradient: 'from-green-600 to-emerald-400' },
                { name: 'Purple', colors: ['#7c3aed', '#a855f7', '#c084fc'], desc: 'Creative and bold aesthetic', popularity: '81%', gradient: 'from-purple-600 to-violet-400' },
                { name: 'Monochrome', colors: ['#111827', '#6b7280', '#d1d5db'], desc: 'Minimal and elegant', popularity: '58%', gradient: 'from-gray-900 to-gray-400' },
                { name: 'Neon', colors: ['#ec4899', '#06b6d4', '#8b5cf6'], desc: 'Bright and energetic', popularity: '43%', gradient: 'from-pink-500 via-cyan-400 to-purple-500' }
              ].map((theme, idx) => (
                <Card key={idx} className="group relative overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  {/* Background Gradient Preview */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
                  
                  <div className="relative p-6">
                    {/* Color Palette */}
                    <div className="flex justify-center mb-4">
                      <div className="flex -space-x-2">
                        {theme.colors.map((color, colorIdx) => (
                          <div 
                            key={colorIdx} 
                            className="w-10 h-10 rounded-full ring-2 ring-white dark:ring-slate-800 shadow-lg transition-transform group-hover:scale-110" 
                            style={{ backgroundColor: color, animationDelay: `${colorIdx * 100}ms` }}
                          />
                        ))}
                      </div>
                    </div>
                    
                    {/* Theme Info */}
                    <div className="text-center mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white">{theme.name}</h3>
                        <Badge variant="outline" className="text-xs bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/30 dark:to-blue-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-700">
                          {theme.popularity} popular
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{theme.desc}</p>
                    </div>

                    {/* Preview Components */}
                    <div className={`mb-4 p-3 rounded-lg bg-gradient-to-r ${theme.gradient} opacity-20`}>
                      <div className="flex justify-between items-center">
                        <div className="w-12 h-2 bg-white/60 rounded" />
                        <div className="w-6 h-6 bg-white/40 rounded-full" />
                      </div>
                    </div>
                    
                    <Button size="sm" className={`w-full bg-gradient-to-r ${theme.gradient} hover:opacity-90 text-white border-0 transition-all duration-300 group-hover:scale-105 shadow-md group-hover:shadow-lg`}>
                      <Palette className="w-3 h-3 mr-2" />
                      Apply Theme
                    </Button>
                  </div>
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