"use client"

import {
    Check,
    Code,
    CreditCard,
    Crown,
    Gift,
    Headphones,
    Rocket,
    Shield,
    Star,
    Users,
    Zap
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Label } from "../components/ui/label"
import { Switch } from "../components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')

  const plans = [
    {
      name: 'Free',
      description: 'Perfect for getting started',
      price: { monthly: 0, yearly: 0 },
      icon: <Code className="h-6 w-6" />,
      features: [
        '5 snippet uploads per month',
        'Basic code highlighting',
        'Public snippets only',
        'Community support',
        'Standard search',
        'Mobile app access'
      ],
      limitations: [
        'No private snippets',
        'No advanced features',
        'Basic analytics'
      ],
      buttonText: 'Get Started',
      buttonVariant: 'outline' as const,
      popular: false
    },
    {
      name: 'Pro',
      description: 'For serious developers',
      price: { monthly: 9.99, yearly: 7.99 },
      icon: <Zap className="h-6 w-6" />,
      features: [
        'Unlimited snippet uploads',
        'Advanced syntax highlighting',
        'Private & public snippets',
        'Priority support',
        'Advanced search & filters',
        'Custom collections',
        'Download in multiple formats',
        'Analytics dashboard',
        'Team collaboration (up to 5)',
        'API access'
      ],
      buttonText: 'Start Pro Trial',
      buttonVariant: 'default' as const,
      popular: true,
      trialDays: 14
    },
    {
      name: 'Team',
      description: 'For growing teams',
      price: { monthly: 24.99, yearly: 19.99 },
      icon: <Users className="h-6 w-6" />,
      features: [
        'Everything in Pro',
        'Unlimited team members',
        'Team management dashboard',
        'Shared snippet libraries',
        'Advanced permissions',
        'SSO integration',
        'Dedicated account manager',
        'Priority email support',
        'Custom branding',
        'Advanced analytics'
      ],
      buttonText: 'Contact Sales',
      buttonVariant: 'outline' as const,
      popular: false
    },
    {
      name: 'Enterprise',
      description: 'Custom solutions for large organizations',
      price: { monthly: 'Custom', yearly: 'Custom' },
      icon: <Crown className="h-6 w-6" />,
      features: [
        'Everything in Team',
        'Custom integrations',
        'On-premise deployment',
        'Advanced security features',
        'Custom SLA',
        '24/7 phone support',
        'Training sessions',
        'Custom development',
        'Compliance support',
        'White-label options'
      ],
      buttonText: 'Contact Sales',
      buttonVariant: 'outline' as const,
      popular: false
    }
  ]

  const features = [
    {
      title: 'Code Management',
      description: 'Organize, search, and share your code snippets efficiently',
      icon: <Code className="h-5 w-5" />,
      plans: ['Free', 'Pro', 'Team', 'Enterprise']
    },
    {
      title: 'Advanced Analytics',
      description: 'Track performance, views, and engagement metrics',
      icon: <Rocket className="h-5 w-5" />,
      plans: ['Pro', 'Team', 'Enterprise']
    },
    {
      title: 'Team Collaboration',
      description: 'Work together with shared libraries and permissions',
      icon: <Users className="h-5 w-5" />,
      plans: ['Team', 'Enterprise']
    },
    {
      title: 'Priority Support',
      description: '24/7 support with guaranteed response times',
      icon: <Headphones className="h-5 w-5" />,
      plans: ['Pro', 'Team', 'Enterprise']
    },
    {
      title: 'Security & Compliance',
      description: 'Enterprise-grade security and compliance features',
      icon: <Shield className="h-5 w-5" />,
      plans: ['Enterprise']
    },
    {
      title: 'Custom Integrations',
      description: 'Connect with your existing tools and workflows',
      icon: <Zap className="h-5 w-5" />,
      plans: ['Enterprise']
    }
  ]

  const faqs = [
    {
      question: 'Can I change my plan at any time?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and billing adjustments are prorated.'
    },
    {
      question: 'Is there a free trial for paid plans?',
      answer: 'Yes, Pro and Team plans come with a 14-day free trial. No credit card required to start your trial.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and ACH transfers for Enterprise customers.'
    },
    {
      question: 'Can I cancel my subscription anytime?',
      answer: 'Yes, you can cancel your subscription at any time. You\'ll continue to have access until the end of your current billing period.'
    },
    {
      question: 'Do you offer discounts for students or non-profits?',
      answer: 'Yes, we offer 50% discounts for students and educational institutions, and 30% discounts for qualified non-profit organizations.'
    },
    {
      question: 'What happens to my data if I cancel?',
      answer: 'Your data remains accessible for 30 days after cancellation. You can export your snippets at any time during this period.'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Senior Developer at TechCorp',
      avatar: 'https://github.com/shadcn.png',
      quote: 'CodeHut has revolutionized how our team shares and manages code snippets. The collaboration features are amazing!'
    },
    {
      name: 'Mike Rodriguez',
      role: 'Freelance Full-Stack Developer',
      avatar: 'https://github.com/shadcn.png',
      quote: 'I\'ve saved hours every week with CodeHut\'s snippet organization. The Pro plan is worth every penny.'
    },
    {
      name: 'Emma Wilson',
      role: 'Engineering Manager at StartupXYZ',
      avatar: 'https://github.com/shadcn.png',
      quote: 'The Team plan has improved our code sharing and onboarding process significantly. Highly recommended!'
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold">
          Choose Your <span className="text-primary">CodeHut</span> Plan
        </h1>
        <p className="text-xl text-muted-foreground">
          From hobby projects to enterprise solutions. Find the perfect plan for your coding needs.
        </p>
      </div>

      {/* Billing Toggle */}
      <div className="flex items-center justify-center">
        <div className="flex items-center space-x-4 p-4 bg-muted/30 rounded-full border border-border/50 hover:border-border transition-colors">
          <Label 
            htmlFor="billing-toggle" 
            className={`cursor-pointer transition-all select-none ${billingPeriod === 'monthly' ? 'font-semibold text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Monthly
          </Label>
          <Switch
            id="billing-toggle"
            checked={billingPeriod === 'yearly'}
            onCheckedChange={(checked) => setBillingPeriod(checked ? 'yearly' : 'monthly')}
            className="data-[state=checked]:bg-green-600 hover:data-[state=checked]:bg-green-700 focus-visible:ring-green-200"
          />
          <div className="flex items-center space-x-2">
            <Label 
              htmlFor="billing-toggle" 
              className={`cursor-pointer transition-all select-none ${billingPeriod === 'yearly' ? 'font-semibold text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Yearly
            </Label>
            {billingPeriod === 'yearly' && (
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 animate-in slide-in-from-right duration-200">
                <Gift className="w-3 h-3 mr-1" />
                Save 20%
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
        {plans.map((plan) => (
          <Card 
            key={plan.name} 
            className={`relative transition-all duration-300 hover:shadow-xl ${
              plan.popular 
                ? 'border-2 border-primary shadow-xl scale-105 bg-gradient-to-b from-primary/5 to-transparent' 
                : 'hover:shadow-lg hover:scale-102'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground px-4 py-1">
                  <Star className="w-3 h-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
            )}
            
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto p-3 bg-primary/10 rounded-full w-fit">
                {plan.icon}
              </div>
              <div>
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <p className="text-muted-foreground">{plan.description}</p>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold transition-all duration-300">
                  {typeof plan.price[billingPeriod] === 'number' ? (
                    plan.price[billingPeriod] === 0 ? (
                      'Free'
                    ) : (
                      <>
                        <span className="tabular-nums">${plan.price[billingPeriod]}</span>
                        <span className="text-lg font-normal text-muted-foreground">
                          /{billingPeriod === 'monthly' ? 'mo' : 'yr'}
                        </span>
                      </>
                    )
                  ) : (
                    plan.price[billingPeriod]
                  )}
                </div>
                {billingPeriod === 'yearly' && typeof plan.price.monthly === 'number' && plan.price.monthly > 0 && (
                  <p className="text-sm text-muted-foreground line-through">
                    ${(plan.price.monthly * 12).toFixed(2)}/yr
                  </p>
                )}
                {plan.trialDays && (
                  <p className="text-sm text-primary font-medium">
                    {plan.trialDays}-day free trial
                  </p>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <Link href={plan.name === 'Free' ? '/signup' : plan.buttonText === 'Start Pro Trial' ? '/signup' : '/contact'}>
                <Button 
                  className="w-full" 
                  variant={plan.buttonVariant}
                  size="lg"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  {plan.buttonText}
                </Button>
              </Link>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-sm uppercase tracking-wider">Features Included:</h4>
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start space-x-2">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {plan.limitations && (
                  <div className="pt-3 border-t">
                    <ul className="space-y-2">
                      {plan.limitations.map((limitation) => (
                        <li key={limitation} className="flex items-start space-x-2">
                          <div className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground">×</div>
                          <span className="text-sm text-muted-foreground">{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Feature Comparison */}
      <Tabs defaultValue="features" className="max-w-6xl mx-auto">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="features">Feature Comparison</TabsTrigger>
          <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="features" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title}>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {feature.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                  </div>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {feature.plans.map((plan) => (
                      <Badge key={plan} variant="secondary">
                        {plan}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="testimonials" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="text-center">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                    <CardDescription>{testimonial.role}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm italic">"{testimonial.quote}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="faqs" className="space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{faq.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* CTA Section */}
      <Card className="bg-gradient-to-r from-primary/10 to-purple-600/10 border-primary/20">
        <CardContent className="text-center py-12">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of developers who trust CodeHut to manage and share their code snippets.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/demo">
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8"
              >
                View Demo
              </Button>
            </Link>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            No credit card required • Cancel anytime • 14-day free trial
          </p>
        </CardContent>
      </Card>

      {/* Money Back Guarantee */}
      <Card className="max-w-2xl mx-auto">
        <CardContent className="text-center py-8">
          <Shield className="mx-auto h-12 w-12 text-green-600 mb-4" />
          <h3 className="text-xl font-bold mb-2">30-Day Money-Back Guarantee</h3>
          <p className="text-muted-foreground">
            Not satisfied? Get a full refund within 30 days, no questions asked.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}