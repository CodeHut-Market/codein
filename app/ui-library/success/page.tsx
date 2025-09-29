"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ArrowRight,
    Calendar,
    CheckCircle,
    Crown,
    Download,
    Mail,
    Receipt,
    Star
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SubscriptionSuccessPage() {
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan') || 'pro';
  const email = searchParams.get('email') || '';
  const [receiptGenerated, setReceiptGenerated] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    // Simulate receipt generation
    const timer = setTimeout(() => {
      setReceiptGenerated(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const planDetails = {
    pro: { name: 'Pro', price: 19 },
    team: { name: 'Team', price: 49 }
  };

  const currentPlan = planDetails[plan as keyof typeof planDetails] || planDetails.pro;
  const subscriptionId = `SUB_${Date.now().toString(36).toUpperCase()}`;
  const receiptId = `RCP_${plan.toUpperCase()}_${Date.now().toString(36).toUpperCase()}`;

  const nextBilling = new Date();
  nextBilling.setMonth(nextBilling.getMonth() + 1);

  const handleDownloadReceipt = async () => {
    if (isDownloading) return;
    
    setIsDownloading(true);
    
    try {
      // Call the API to generate and download the PDF receipt
      const response = await fetch(`/api/receipts/${receiptId}`);
      
      if (!response.ok) {
        throw new Error('Failed to generate receipt');
      }
      
      // Create a blob from the PDF response
      const blob = await response.blob();
      
      // Create a download link and trigger the download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `CodeHut-Receipt-${receiptId}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download receipt. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-green-100 dark:bg-green-900/20 rounded-full">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome to CodeHut UI Library!
          </h1>
          <p className="text-lg text-muted-foreground mb-4">
            Your subscription has been activated successfully
          </p>
          <Badge className="bg-primary/10 text-primary border-primary/20">
            <Crown className="w-3 h-3 mr-1" />
            {currentPlan.name} Plan Active
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Subscription Details */}
          <Card>
            <CardHeader>
              <CardTitle>Subscription Details</CardTitle>
              <CardDescription>Your active subscription information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Plan</div>
                  <div className="font-semibold">{currentPlan.name}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Amount</div>
                  <div className="font-semibold">${currentPlan.price}/month</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Subscription ID</div>
                  <div className="font-mono text-xs">{subscriptionId}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Status</div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Active
                  </Badge>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Next billing date:</span>
                  <span className="font-semibold flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {nextBilling.toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start">
                  <Mail className="w-4 h-4 text-blue-600 mr-2 mt-0.5" />
                  <div className="text-sm">
                    <div className="font-medium text-blue-800 dark:text-blue-200">Confirmation email sent</div>
                    <div className="text-blue-600 dark:text-blue-300">
                      Check your email ({email}) for subscription details and receipt
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Receipt */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Receipt className="w-5 h-5 mr-2" />
                Payment Receipt
              </CardTitle>
              <CardDescription>
                {receiptGenerated ? 'Your payment receipt' : 'Generating receipt...'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {receiptGenerated ? (
                <div className="space-y-4">
                  <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Receipt ID:</span>
                      <span className="font-mono text-xs">{receiptId}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Date:</span>
                      <span>{new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Plan:</span>
                      <span>{currentPlan.name} Subscription</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Period:</span>
                      <span>Monthly</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-semibold">
                      <span>Total Paid:</span>
                      <span>${currentPlan.price}.00</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={handleDownloadReceipt}
                      disabled={isDownloading}
                    >
                      {isDownloading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
                          Generating PDF...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 mr-2" />
                          Download PDF Receipt
                        </>
                      )}
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full" 
                      asChild
                    >
                      <Link href={`/ui-library/receipts/${receiptId}`}>
                        <Receipt className="w-3 h-3 mr-2" />
                        View Receipt Details
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Next Steps */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
            <CardDescription>Get the most out of your subscription</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto mb-4">
                  <Download className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Download Components</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Access our full library of 200+ premium components
                </p>
                <Button size="sm" asChild>
                  <Link href="/ui-library/components">
                    Browse Library
                  </Link>
                </Button>
              </div>

              <div className="text-center">
                <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto mb-4">
                  <Star className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Access Documentation</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Detailed guides and examples for every component
                </p>
                <Button size="sm" variant="outline" asChild>
                  <Link href="/ui-library/docs">
                    View Docs
                  </Link>
                </Button>
              </div>

              <div className="text-center">
                <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto mb-4">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Get Support</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Priority support for all subscribers
                </p>
                <Button size="sm" variant="outline" asChild>
                  <Link href="/support">
                    Contact Support
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center mt-8">
          <Button size="lg" asChild>
            <Link href="/ui-library/components">
              <ArrowRight className="w-4 h-4 mr-2" />
              Start Building with Premium Components
            </Link>
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            Your subscription includes unlimited downloads and commercial usage rights
          </p>
        </div>
      </div>
    </div>
  );
}