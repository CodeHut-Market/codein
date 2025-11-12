"use client";
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Code, 
  Users, 
  Zap, 
  Shield, 
  Globe, 
  Star, 
  Sparkles,
  Heart,
  BookOpen,
  Search,
  Rocket,
  CheckCircle2,
  Cloud,
  Terminal,
  Package
} from 'lucide-react';

export default function LandingPage(){
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    import("@/lib/supabaseClient").then(({ supabase }) => {
      supabase.auth.getUser().then(({ data }) => {
        setUser(data?.user);
      });
    });
  }, []);

  if (user) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const LoggedInHome = require("./home-loggedin").default;
    return <LoggedInHome />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        {/* Floating elements for visual appeal */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full backdrop-blur-sm animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-yellow-400/20 rounded-full backdrop-blur-sm animate-pulse"></div>
        <div className="absolute top-1/2 right-20 w-12 h-12 bg-pink-400/20 rounded-full backdrop-blur-sm animate-pulse"></div>
        
        <div className="relative container mx-auto px-6 py-24 md:py-32">
          <div className="text-center space-y-8 max-w-5xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4 mr-2" />
              Join 25,000+ developers worldwide
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight">
              Build. Share.
              <span className="block bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-300 bg-clip-text text-transparent">
                Ship Faster.
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              The ultimate platform for developers to organize, share, and discover code snippets. 
              Build your personal code library and collaborate with a thriving community.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/signup">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-6 h-auto">
                  <Rocket className="w-5 h-5 mr-2" />
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-6 h-auto backdrop-blur-sm">
                  <Code className="w-5 h-5 mr-2" />
                  View Live Demo
                </Button>
              </Link>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 pt-8 text-sm text-blue-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Free forever plan
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                50+ languages supported
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Statistics */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Users, value: '25,000+', label: 'Active Developers', color: 'text-blue-600' },
            { icon: Code, value: '50,000+', label: 'Code Snippets', color: 'text-purple-600' },
            { icon: Globe, value: '150+', label: 'Countries', color: 'text-green-600' },
            { icon: Star, value: '500,000+', label: 'Stars Given', color: 'text-yellow-600' }
          ].map((stat, index) => (
            <Card key={index} className="text-center group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-md">
              <CardContent className="py-8">
                <stat.icon className={`h-12 w-12 mx-auto mb-4 ${stat.color} group-hover:scale-110 transition-transform`} />
                <div className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-br from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Core Features */}
      <section className="container mx-auto px-6 py-16 space-y-12">
        <div className="text-center space-y-4">
          <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0 text-sm px-4 py-1">
            Features
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Everything You Need
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed for modern developers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: Code,
              title: 'Smart Code Organization',
              description: 'Organize snippets with tags, categories, and collections. Advanced search with filters.',
              gradient: 'from-blue-500 to-cyan-500'
            },
            {
              icon: Shield,
              title: 'Secure & Private',
              description: 'Enterprise-grade security with encryption. Control visibility and access permissions.',
              gradient: 'from-purple-500 to-pink-500'
            },
            {
              icon: Users,
              title: 'Team Collaboration',
              description: 'Share with your team, collaborate in real-time, and track snippet usage analytics.',
              gradient: 'from-green-500 to-teal-500'
            },
            {
              icon: Zap,
              title: 'Lightning Fast',
              description: 'Sub-100ms response times with intelligent caching. Optimized for performance.',
              gradient: 'from-yellow-500 to-orange-500'
            },
            {
              icon: Search,
              title: 'Powerful Search',
              description: 'AI-powered semantic search across 50+ languages. Find what you need instantly.',
              gradient: 'from-indigo-500 to-purple-500'
            },
            {
              icon: BookOpen,
              title: 'Syntax Highlighting',
              description: 'Beautiful code display with support for all major programming languages and themes.',
              gradient: 'from-pink-500 to-red-500'
            },
            {
              icon: Globe,
              title: 'Community Driven',
              description: 'Discover and learn from 50,000+ public snippets shared by developers worldwide.',
              gradient: 'from-teal-500 to-green-500'
            },
            {
              icon: Cloud,
              title: 'Cloud Sync',
              description: 'Access your snippets anywhere, anytime. Automatic sync across all your devices.',
              gradient: 'from-blue-500 to-purple-500'
            },
            {
              icon: Terminal,
              title: 'API Access',
              description: 'RESTful API for integration with your tools and workflows. Full documentation included.',
              gradient: 'from-gray-600 to-gray-800'
            }
          ].map((feature, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-md overflow-hidden">
              <CardContent className="p-6 space-y-4">
                <div className={`p-3 bg-gradient-to-br ${feature.gradient} rounded-xl text-white w-fit group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-xl">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center space-y-4 mb-12">
          <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 text-sm px-4 py-1">
            How It Works
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Get Started in Minutes
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            {
              step: '01',
              title: 'Create Your Account',
              description: 'Sign up in seconds with GitHub or Google. No credit card required.',
              icon: Users
            },
            {
              step: '02',
              title: 'Upload & Organize',
              description: 'Add your code snippets, organize with tags, and create collections.',
              icon: Package
            },
            {
              step: '03',
              title: 'Share & Collaborate',
              description: 'Share with your team or community. Discover and learn from others.',
              icon: Heart
            }
          ].map((step, index) => (
            <div key={index} className="relative">
              <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md h-full">
                <CardContent className="p-8 space-y-4 text-center">
                  <div className="relative">
                    <div className="absolute -top-4 -left-4 text-6xl font-bold text-purple-100 dark:text-purple-900">
                      {step.step}
                    </div>
                    <div className="relative p-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl text-white w-fit mx-auto group-hover:scale-110 transition-transform">
                      <step.icon className="w-8 h-8" />
                    </div>
                  </div>
                  <h3 className="font-bold text-xl">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </CardContent>
              </Card>
              {index < 2 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <ArrowRight className="w-8 h-8 text-purple-400" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Technology Stack */}
      <section className="container mx-auto px-6 py-16">
        <Card className="border-0 shadow-xl bg-gradient-to-br from-slate-900 to-purple-900 text-white overflow-hidden">
          <CardContent className="p-12">
            <div className="text-center space-y-8">
              <div className="space-y-4">
                <Badge className="bg-white/20 text-white border-0 text-sm px-4 py-1 backdrop-blur-sm">
                  Technology
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold">
                  Built with Modern Tech
                </h2>
                <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                  Enterprise-grade technology stack for performance, security, and scalability
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
                {[
                  { name: 'Next.js 14', desc: 'React Framework' },
                  { name: 'TypeScript', desc: 'Type Safety' },
                  { name: 'PostgreSQL', desc: 'Database' },
                  { name: 'Tailwind CSS', desc: 'Styling' }
                ].map((tech, index) => (
                  <div key={index} className="p-6 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all group">
                    <div className="text-2xl font-bold mb-2 group-hover:scale-110 transition-transform">{tech.name}</div>
                    <div className="text-sm text-blue-200">{tech.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Social Proof / Testimonials */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center space-y-4 mb-12">
          <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 text-sm px-4 py-1">
            Testimonials
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Loved by Developers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              quote: "CodeIn has transformed how I manage my code snippets. It's fast, intuitive, and the community is amazing!",
              author: "Sarah Chen",
              role: "Full Stack Developer",
              rating: 5
            },
            {
              quote: "The best snippet manager I've used. The search functionality is incredibly powerful and saves me hours every week.",
              author: "Michael Rodriguez",
              role: "Senior Engineer",
              rating: 5
            },
            {
              quote: "Love the team collaboration features. Sharing snippets with my team has never been easier. Highly recommended!",
              author: "Emma Wilson",
              role: "Tech Lead",
              rating: 5
            }
          ].map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 space-y-4">
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground italic leading-relaxed">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="pt-4 border-t">
                  <div className="font-bold">{testimonial.author}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-6 py-16">
        <Card className="border-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white shadow-2xl">
          <CardContent className="relative p-12 md:p-16 text-center space-y-8">
            <div className="absolute inset-0 bg-black/10 rounded-lg"></div>
            <div className="relative space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold">
                Ready to Level Up Your Workflow?
              </h2>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
                Join thousands of developers who are already saving time and shipping faster with CodeIn.
                Start your free account today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link href="/signup">
                  <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-6 h-auto">
                    <Rocket className="w-5 h-5 mr-2" />
                    Start Free Today
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-6 h-auto backdrop-blur-sm">
                    Contact Sales
                  </Button>
                </Link>
              </div>
              <div className="text-sm text-blue-100">
                <Link href="/login" className="hover:text-white transition-colors underline">
                  Already have an account? Sign in
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-12 border-t">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-bold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/demo" className="hover:text-foreground transition-colors">Demo</Link></li>
              <li><Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
              <li><Link href="/ui-library" className="hover:text-foreground transition-colors">UI Library</Link></li>
              <li><Link href="/docs" className="hover:text-foreground transition-colors">Documentation</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Community</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/community" className="hover:text-foreground transition-colors">Community</Link></li>
              <li><Link href="/explore" className="hover:text-foreground transition-colors">Explore</Link></li>
              <li><Link href="/contributors" className="hover:text-foreground transition-colors">Contributors</Link></li>
              <li><Link href="/events" className="hover:text-foreground transition-colors">Events</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-foreground transition-colors">About</Link></li>
              <li><Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
              <li><Link href="/careers" className="hover:text-foreground transition-colors">Careers</Link></li>
              <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link></li>
              <li><Link href="/security" className="hover:text-foreground transition-colors">Security</Link></li>
              <li><Link href="/licenses" className="hover:text-foreground transition-colors">Licenses</Link></li>
            </ul>
          </div>
        </div>
        <div className="text-center text-sm text-muted-foreground pt-8 border-t">
          <p>© {new Date().getFullYear()} CodeIn. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}