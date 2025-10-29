"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    ArrowLeft,
    Check,
    Crown,
    Sparkles,
    User
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan') || 'free';
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    acceptMarketing: false
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.acceptTerms) {
      alert('Please accept the terms and conditions');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate account creation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, you would:
      // 1. Create user account
      // 2. Set up free plan access
      // 3. Send verification email
      // 4. Log user in
      // 5. Redirect to library
      
      window.location.href = `/ui-library/components?plan=${plan}`;
    } catch (error) {
      console.error('Signup error:', error);
      alert('Account creation failed. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/ui-library" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to UI Library
          </Link>
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Crown className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Create Your Account
          </h1>
          <p className="text-muted-foreground">
            {plan === 'free' ? 'Get started with free access' : `Join our ${plan} plan`}
          </p>
        </div>

        <Card>
          <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center">
              {plan === 'free' ? (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Free Plan
                </>
              ) : (
                <>
                  <Crown className="w-5 h-5 mr-2 text-primary" />
                  {plan.charAt(0).toUpperCase() + plan.slice(1)} Plan
                </>
              )}
            </CardTitle>
            <CardDescription>
              {plan === 'free' ? (
                "5 component previews per month • Basic documentation • Community support"
              ) : (
                "Full access after account verification"
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Create a password"
                  minLength={8}
                  required
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="Confirm your password"
                  minLength={8}
                  required
                />
              </div>

              {plan === 'free' && (
                <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">What&apos;s included with Free:</h4>
                  <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                    <li className="flex items-center"><Check className="w-3 h-3 mr-2" />5 component previews per month</li>
                    <li className="flex items-center"><Check className="w-3 h-3 mr-2" />Basic documentation access</li>
                    <li className="flex items-center"><Check className="w-3 h-3 mr-2" />Community support</li>
                  </ul>
                </div>
              )}

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

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isProcessing || !formData.acceptTerms}
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <User className="w-4 h-4 mr-2" />
                    Create Account
                  </>
                )}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link href="/login" className="text-primary hover:underline">
                  Sign in here
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {plan === 'free' && (
          <Card className="mt-6 border-primary/20 bg-primary/5">
            <CardContent className="p-4 text-center">
              <h3 className="font-semibold mb-2">Ready for more?</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Upgrade to Pro anytime for unlimited access to all components
              </p>
              <Button size="sm" asChild>
                <Link href="/ui-library/subscribe?plan=pro">
                  <Crown className="w-3 h-3 mr-1" />
                  View Pro Plans
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}