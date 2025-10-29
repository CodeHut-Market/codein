"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    ArrowLeft,
    CheckCircle,
    CreditCard,
    Crown,
    Info,
    Lock,
    Shield
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import Script from "next/script";

const planDetails = {
  pro: {
    name: "Pro",
    price: 4.99,
    period: "month",
    description: "Full access to our premium UI component library",
    features: [
      "Unlimited component downloads",
      "Full source code access", 
      "Advanced customization tools",
      "Premium components & templates",
      "Priority support",
      "Regular updates",
      "Commercial usage rights",
      "Figma design files"
    ]
  },
  team: {
    name: "Team", 
    price: 49,
    period: "month",
    description: "Perfect for teams and organizations",
    features: [
      "Everything in Pro",
      "Up to 10 team members",
      "Team collaboration tools",
      "Advanced analytics",
      "Custom component requests",
      "Dedicated support",
      "White-label options",
      "API access"
    ]
  }
};

export default function SubscribePage() {
  const searchParams = useSearchParams();
  const selectedPlan = searchParams.get('plan') as keyof typeof planDetails || 'pro';



  const plan = planDetails[selectedPlan];
  const totalAmount = plan.price;


  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/ui-library" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to UI Library
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Subscribe to CodeHut UI Library
          </h1>
          <p className="text-muted-foreground">
            Get instant access to our premium component library
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Plan Summary */}
          <Card className="h-fit">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Crown className="w-5 h-5 mr-2 text-primary" />
                  {plan.name} Plan
                </CardTitle>
                <Badge className="bg-primary/10 text-primary">
                  Most Popular
                </Badge>
              </div>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Price */}
              <div className="text-center py-4 bg-muted/50 rounded-lg">
                <div className="text-3xl font-bold">${plan.price}</div>
                <div className="text-muted-foreground">per {plan.period}</div>
              </div>

              {/* Features */}
              <div className="space-y-3">
                <h4 className="font-semibold">What&apos;s included:</h4>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Security Info */}
              <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-center text-green-800 dark:text-green-200 text-sm">
                  <Shield className="w-4 h-4 mr-2" />
                  Your payment is secured with 256-bit SSL encryption
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Payment Information
              </CardTitle>
              <CardDescription>
                Complete your subscription to get instant access
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <Script
                  src="https://cdn.razorpay.com/static/widget/subscription-button.js"
                  data-subscription_button_id="pl_RZQogfwCUgG02X"
                  data-button_theme="brand-color"
                  async
                />
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}