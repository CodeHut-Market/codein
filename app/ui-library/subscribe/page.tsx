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

const planDetails = {
  pro: {
    name: "Pro",
    price: 19,
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
    acceptTerms: false,
    acceptMarketing: false
  });

  const plan = planDetails[selectedPlan];
  const totalAmount = plan.price;

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.acceptTerms) {
      alert('Please accept the terms and conditions');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // In a real implementation, you would:
      // 1. Validate payment details
      // 2. Process payment through Stripe/PayPal/Razorpay
      // 3. Create subscription record
      // 4. Send confirmation email
      // 5. Redirect to success page
      
      window.location.href = `/ui-library/success?plan=${selectedPlan}&email=${encodeURIComponent(formData.email)}`;
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

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
                <h4 className="font-semibold">What's included:</h4>
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
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Personal Information */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                </div>

                {/* Payment Details */}
                <div className="space-y-4 pt-4 border-t">
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      value={formData.cardNumber}
                      onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input
                        id="expiry"
                        value={formData.expiry}
                        onChange={(e) => handleInputChange('expiry', formatExpiry(e.target.value))}
                        placeholder="MM/YY"
                        maxLength={5}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvc">CVC</Label>
                      <Input
                        id="cvc"
                        value={formData.cvc}
                        onChange={(e) => handleInputChange('cvc', e.target.value.replace(/\D/g, '').substring(0, 4))}
                        placeholder="123"
                        maxLength={4}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{plan.name} Plan</span>
                    <span>${plan.price}/{plan.period}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>Included</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${totalAmount}</span>
                  </div>
                </div>

                {/* Terms and Marketing */}
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="acceptTerms"
                      checked={formData.acceptTerms}
                      onCheckedChange={(checked) => handleInputChange('acceptTerms', checked as boolean)}
                    />
                    <Label htmlFor="acceptTerms" className="text-sm leading-5">
                      I accept the{' '}
                      <Link href="/terms" className="text-primary hover:underline">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link href="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="acceptMarketing"
                      checked={formData.acceptMarketing}
                      onCheckedChange={(checked) => handleInputChange('acceptMarketing', checked as boolean)}
                    />
                    <Label htmlFor="acceptMarketing" className="text-sm leading-5">
                      Send me updates about new components and features
                    </Label>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isProcessing || !formData.acceptTerms}
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Subscribe for ${totalAmount}/month
                    </>
                  )}
                </Button>

                {/* Security Notice */}
                <div className="text-xs text-muted-foreground text-center space-y-1">
                  <div className="flex items-center justify-center">
                    <Info className="w-3 h-3 mr-1" />
                    Cancel anytime. No commitments.
                  </div>
                  <div>You can cancel your subscription at any time from your account settings.</div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}