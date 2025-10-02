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

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + 1))
    }, 30)
    return () => clearInterval(timer)
  }, [])

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
      ]
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
      ]
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
      ]
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
      ]
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
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
              <Eye className="w-5 h-5 mr-2" />
              Explore Components
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-4 rounded-full border-2 hover:bg-slate-50 dark:hover:bg-slate-800">
              <Github className="w-5 h-5 mr-2" />
              View on GitHub
            </Button>
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
          <TabsContent value="components" className="space-y-8">
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
                        <Button size="sm" className="flex-1 text-xs">
                          <Eye className="w-3 h-3 mr-1" />
                          Preview
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 text-xs">
                          <Copy className="w-3 h-3 mr-1" />
                          Copy
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Other tab contents */}
          <TabsContent value="layouts" className="text-center py-20">
            <div className="max-w-md mx-auto">
              <Layers className="w-16 h-16 mx-auto mb-4 text-slate-400" />
              <h3 className="text-xl font-semibold mb-2">Layout Components</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Responsive layout components coming soon...
              </p>
            </div>
          </TabsContent>

          <TabsContent value="animations" className="text-center py-20">
            <div className="max-w-md mx-auto">
              <Sparkles className="w-16 h-16 mx-auto mb-4 text-slate-400" />
              <h3 className="text-xl font-semibold mb-2">Animation Library</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Stunning animations and micro-interactions coming soon...
              </p>
            </div>
          </TabsContent>

          <TabsContent value="themes" className="text-center py-20">
            <div className="max-w-md mx-auto">
              <Palette className="w-16 h-16 mx-auto mb-4 text-slate-400" />
              <h3 className="text-xl font-semibold mb-2">Theme System</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Customizable themes and design tokens coming soon...
              </p>
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
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4">
              <Rocket className="w-5 h-5 mr-2" />
              Start Building Today
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-4">
              <Package className="w-5 h-5 mr-2" />
              Browse Documentation
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}