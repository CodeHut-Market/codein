import BillingHistory from "@/components/BillingHistory";
import SubscriptionPlans from "@/components/SubscriptionPlans";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { cn } from "@/lib/utils";
import {
    CreditCard,
    Crown,
    Plus,
    Settings
} from "lucide-react";
import { useState } from "react";

// Types
interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

const Billing = () => {
  useRequireAuth();
  const { user } = useAuth();
  const [currentPlan, setCurrentPlan] = useState<string>('free');
  const [isAnnual, setIsAnnual] = useState(false);

  // Mock data - replace with actual API calls
  const paymentMethods: PaymentMethod[] = [
    {
      id: '1',
      type: 'card',
      brand: 'visa',
      last4: '4242',
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true
    },
    {
      id: '2',
      type: 'card',
      brand: 'mastercard',
      last4: '8888',
      expiryMonth: 6,
      expiryYear: 2026,
      isDefault: false
    }
  ];

  const handlePlanSelect = (planId: string) => {
    console.log('Plan selected:', planId);
    setCurrentPlan(planId);
  };

  const handleAddPaymentMethod = () => {
    console.log('Adding new payment method');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Billing & Subscription</h1>
          <p className="text-muted-foreground">
            Manage your subscription, payment methods, and billing history.
          </p>
        </div>

        <Tabs defaultValue="subscription" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
            <TabsTrigger value="payment">Payment Methods</TabsTrigger>
            <TabsTrigger value="history">Billing History</TabsTrigger>
          </TabsList>

          {/* Subscription Tab */}
          <TabsContent value="subscription" className="space-y-6">
            {/* Current Plan Alert */}
            <Alert>
              <Crown className="h-4 w-4" />
              <AlertDescription>
                You're currently on the <strong>{currentPlan === 'free' ? 'Free' : currentPlan === 'pro' ? 'Pro' : 'Enterprise'}</strong> plan.
                {currentPlan === 'free' && ' Upgrade to unlock more features!'}
              </AlertDescription>
            </Alert>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4">
              <span className={cn("text-sm", !isAnnual && "text-foreground font-medium")}>
                Monthly
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAnnual(!isAnnual)}
                className={cn(
                  "relative h-6 w-12 rounded-full p-0",
                  isAnnual ? "bg-primary" : "bg-muted"
                )}
              >
                <div
                  className={cn(
                    "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform",
                    isAnnual ? "translate-x-6" : "translate-x-0.5"
                  )}
                />
              </Button>
              <span className={cn("text-sm", isAnnual && "text-foreground font-medium")}>
                Annual
                <Badge variant="secondary" className="ml-2">Save 20%</Badge>
              </span>
            </div>

            {/* Subscription Plans */}
            <SubscriptionPlans 
              currentPlan={currentPlan}
              isAnnual={isAnnual}
              onPlanSelect={handlePlanSelect}
            />
          </TabsContent>

          {/* Payment Methods Tab */}
          <TabsContent value="payment" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Payment Methods</h3>
                <p className="text-sm text-muted-foreground">
                  Manage your payment methods and billing information.
                </p>
              </div>
              <Button onClick={handleAddPaymentMethod}>
                <Plus className="mr-2 h-4 w-4" />
                Add Payment Method
              </Button>
            </div>

            <div className="grid gap-4">
              {paymentMethods.map((method) => (
                <Card key={method.id}>
                  <CardContent className="flex items-center justify-between p-6">
                    <div className="flex items-center space-x-4">
                      <div className="rounded-lg bg-muted p-3">
                        <CreditCard className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">
                            {method.brand?.toUpperCase()} ending in {method.last4}
                          </span>
                          {method.isDefault && (
                            <Badge variant="secondary">Default</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Expires {method.expiryMonth}/{method.expiryYear}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Settings className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      {!method.isDefault && (
                        <Button variant="outline" size="sm">
                          Set as Default
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Billing History Tab */}
          <TabsContent value="history" className="space-y-6">
            <BillingHistory />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Billing;