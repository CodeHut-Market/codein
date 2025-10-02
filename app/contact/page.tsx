"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Clock, Mail, MapPin, MessageCircle, Phone, Send, Sparkles } from 'lucide-react'
import { useState } from 'react'

export default function Contact() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you within 24 hours.",
      })
      setIsSubmitting(false)
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        subject: '',
        message: ''
      })
    }, 1000)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-6 py-20">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4 mr-2" />
              We're here to help
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Get in
              <span className="block bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
                Touch
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Have questions, feedback, or need support? We'd love to hear from you. 
              Our team is ready to help you succeed.
            </p>
          </div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full backdrop-blur-sm animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-yellow-400/20 rounded-full backdrop-blur-sm animate-pulse"></div>
      </section>

      <div className="container mx-auto px-6 py-16 space-y-16">
        {/* Contact Methods Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Mail,
              title: 'Email Support',
              value: 'hello@codehut.com',
              description: 'We reply within 24 hours',
              color: 'text-blue-500'
            },
            {
              icon: Phone,
              title: 'Phone Support',
              value: '+1 (555) 123-4567',
              description: 'Mon-Fri, 9AM-6PM PST',
              color: 'text-green-500'
            },
            {
              icon: MessageCircle,
              title: 'Live Chat',
              value: 'Available 24/7',
              description: 'Instant responses',
              color: 'text-purple-500'
            },
            {
              icon: Clock,
              title: 'Response Time',
              value: '< 24 Hours',
              description: 'Average response time',
              color: 'text-orange-500'
            }
          ].map((contact, index) => (
            <Card key={index} className="text-center group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-md">
              <CardContent className="py-8">
                <contact.icon className={`h-12 w-12 mx-auto mb-4 ${contact.color} group-hover:scale-110 transition-transform`} />
                <h3 className="font-bold text-lg mb-2">{contact.title}</h3>
                <p className="text-lg font-semibold mb-2">{contact.value}</p>
                <p className="text-muted-foreground text-sm">{contact.description}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Main Contact Section */}
        <section className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl">Contact Information</CardTitle>
                <CardDescription>Multiple ways to reach our support team</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  {
                    icon: Mail,
                    title: 'Email',
                    primary: 'hello@codehut.com',
                    secondary: 'support@codehut.com',
                    badge: 'Primary'
                  },
                  {
                    icon: MapPin,
                    title: 'Headquarters',
                    primary: 'San Francisco, CA',
                    secondary: 'Remote-first company',
                    badge: 'Global'
                  },
                  {
                    icon: MessageCircle,
                    title: 'Community',
                    primary: 'Discord Server',
                    secondary: 'Join 25,000+ developers',
                    badge: 'Active'
                  }
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 rounded-lg bg-gradient-to-r from-gray-50 to-blue-50 hover:from-blue-50 hover:to-purple-50 transition-colors">
                    <div className="p-3 bg-white rounded-xl shadow-md">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{item.title}</h3>
                        <Badge variant="secondary" className="text-xs">{item.badge}</Badge>
                      </div>
                      <p className="font-medium text-primary">{item.primary}</p>
                      <p className="text-sm text-muted-foreground">{item.secondary}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div>
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl">Send us a Message</CardTitle>
                <CardDescription>We'll get back to you as soon as possible</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        placeholder="John"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        placeholder="Doe"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Select value={formData.subject} onValueChange={(value) => handleInputChange('subject', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="support">Technical Support</SelectItem>
                        <SelectItem value="bug">Bug Report</SelectItem>
                        <SelectItem value="feature">Feature Request</SelectItem>
                        <SelectItem value="partnership">Partnership</SelectItem>
                        <SelectItem value="billing">Billing Question</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      rows={6}
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      placeholder="Tell us how we can help you..."
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-lg py-6"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* FAQ Section */}
        <section>
          <Card className="border-0 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">Frequently Asked Questions</CardTitle>
              <CardDescription>Quick answers to common questions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {[
                  {
                    question: "How quickly do you respond to inquiries?",
                    answer: "We typically respond to all inquiries within 24 hours during business days. Premium subscribers receive priority support with even faster response times."
                  },
                  {
                    question: "Do you offer priority support?",
                    answer: "Yes! Premium subscribers receive priority support with dedicated channels and faster response times. We also offer enterprise support packages."
                  },
                  {
                    question: "Can I schedule a demo?",
                    answer: "Absolutely! Contact us to schedule a personalized demo of our platform. We'll show you all the features and help you get started."
                  },
                  {
                    question: "What support channels are available?",
                    answer: "We offer multiple support channels including email, live chat, Discord community, and phone support for premium users."
                  }
                ].map((faq, index) => (
                  <Card key={index} className="group hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <h3 className="font-bold text-lg mb-3 group-hover:text-primary transition-colors">{faq.question}</h3>
                      <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA Section */}
        <section className="relative overflow-hidden">
          <Card className="border-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white shadow-2xl">
            <CardContent className="relative p-12 text-center space-y-8">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative space-y-6">
                <h2 className="text-4xl font-bold">
                  Still have questions?
                </h2>
                <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                  Our support team is here to help you succeed. Don't hesitate to reach out!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-4 h-auto">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Start Live Chat
                  </Button>
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-4 h-auto backdrop-blur-sm">
                    <Phone className="w-5 h-5 mr-2" />
                    Schedule Call
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}