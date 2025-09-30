import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
    ArrowRight,
    Check,
    Crown,
    Sparkles,
    Star,
    Zap
} from "lucide-react";
import { useState } from "react";
import PaymentForm from "./PaymentForm";

interface Feature {
  name: string;
  included: boolean;
  highlight?: boolean;
}

interface PlanDetails {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  interval: 'month' | 'year';
  description: string;
  features: Feature[];
  popular?: boolean;
  current?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  color?: string;
  buttonText?: string;
}

interface SubscriptionPlansProps {
  currentPlan?: string;
  isAnnual?: boolean;
  onPlanSelect?: (planId: string) => void;
  showPaymentDialog?: boolean;
}

const SubscriptionPlans = ({ 
  currentPlan = 'free', 
  isAnnual = false,
  onPlanSelect,
  showPaymentDialog = true
}: SubscriptionPlansProps) => {
  const [selectedPlan, setSelectedPlan] = useState<PlanDetails | null>(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

  const plans: PlanDetails[] = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      interval: isAnnual ? 'year' : 'month',
      description: 'Perfect for getting started with code sharing',
      features: [
        { name: '5 code snippets per month', included: true },
        { name: 'Basic syntax highlighting', included: true },
        { name: 'Public snippets only', included: true },
        { name: 'Community support', included: true },
        { name: 'Private snippets', included: false },
        { name: 'Advanced search', included: false },
        { name: 'Team collaboration', included: false },
        { name: 'Analytics dashboard', included: false }
      ],
      current: currentPlan === 'free',
      icon: Star,
      color: 'text-gray-600',
      buttonText: currentPlan === 'free' ? 'Current Plan' : 'Downgrade to Free'
    },
    {
      id: 'pro',
      name: 'Pro',
      price: isAnnual ? 99 : 9.99,
      originalPrice: isAnnual ? 119 : undefined,
      interval: isAnnual ? 'year' : 'month',
      description: 'Ideal for individual developers and power users',
      features: [
        { name: 'Unlimited code snippets', included: true, highlight: true },
        { name: 'Advanced syntax highlighting', included: true },
        { name: 'Private & public snippets', included: true, highlight: true },
        { name: 'Advanced search & filters', included: true },
        { name: 'Priority support', included: true },
        { name: 'Code analytics', included: true },
        { name: 'Export functionality', included: true },
        { name: 'Team collaboration', included: false },
        { name: 'Custom branding', included: false },
        { name: 'SSO integration', included: false }
      ],
      popular: true,
      current: currentPlan === 'pro',
      icon: Zap,
      color: 'text-blue-600',
      buttonText: currentPlan === 'pro' ? 'Current Plan' : 'Upgrade to Pro'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: isAnnual ? 299 : 29.99,
      originalPrice: isAnnual ? 359 : undefined,
      interval: isAnnual ? 'year' : 'month',
      description: 'Built for teams and organizations',
      features: [
        { name: 'Everything in Pro', included: true },
        { name: 'Team collaboration', included: true, highlight: true },
        { name: 'Custom branding', included: true },
        { name: 'Advanced admin controls', included: true, highlight: true },
        { name: 'SSO integration', included: true },
        { name: '24/7 dedicated support', included: true },
        { name: 'Custom integrations', included: true },
        { name: 'Advanced analytics', included: true },
        { name: 'API access', included: true },
        { name: 'Audit logs', included: true }
      ],
      current: currentPlan === 'enterprise',
      icon: Crown,
      color: 'text-purple-600',
      buttonText: currentPlan === 'enterprise' ? 'Current Plan' : 'Upgrade to Enterprise'
    }
  ];

  const handlePlanUpgrade = (plan: PlanDetails) => {
    if (plan.current || plan.id === 'free') {
      onPlanSelect?.(plan.id);
      return;
    }

    if (showPaymentDialog) {
      setSelectedPlan(plan);
      setPaymentDialogOpen(true);
    } else {
      onPlanSelect?.(plan.id);
    }
  };

  const handlePaymentSuccess = (paymentResult: any) => {
    console.log('Payment successful:', paymentResult);
    setPaymentDialogOpen(false);
    onPlanSelect?.(selectedPlan?.id || '');
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment failed:', error);
  };

  const getDiscountPercentage = (plan: PlanDetails) => {
    if (!plan.originalPrice) return null;
    return Math.round(((plan.originalPrice - plan.price) / plan.originalPrice) * 100);
  };

  return (
    <>
      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => {
          const IconComponent = plan.icon || Star;
          const discount = getDiscountPercentage(plan);
          
          return (
            <Card
              key={plan.id}
              className={cn(
                "relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105",
                plan.popular && "border-primary shadow-lg",
                plan.current && "ring-2 ring-primary bg-primary/5"
              )}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-primary to-primary/80 px-4 py-1">
                  <span className="text-xs font-bold text-primary-foreground flex items-center">
                    <Sparkles className="mr-1 h-3 w-3" />
                    Most Popular
                  </span>
                </div>
              )}

              {/* Discount badge */}
              {discount && (
                <div className="absolute top-0 left-0 bg-green-500 px-3 py-1">
                  <span className="text-xs font-bold text-white">
                    Save {discount}%
                  </span>
                </div>
              )}
              
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <IconComponent className={cn("h-6 w-6", plan.color)} />
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                  </div>
                  {plan.current && (
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      Current
                    </Badge>
                  )}
                </div>
                
                <CardDescription className="text-sm">
                  {plan.description}
                </CardDescription>
                
                <div className="space-y-1">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-bold">
                      ${plan.price}
                    </span>
                    {plan.originalPrice && (
                      <span className="text-lg text-muted-foreground line-through">
                        ${plan.originalPrice}
                      </span>
                    )}
                    <span className="text-muted-foreground">
                      /{plan.interval}
                    </span>
                  </div>
                  {isAnnual && plan.id !== 'free' && (
                    <p className="text-sm text-muted-foreground">
                      Billed annually • ${(plan.price / 12).toFixed(2)}/month
                    </p>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className={cn(
                        "mt-0.5 rounded-full p-0.5",
                        feature.included 
                          ? "bg-green-100 text-green-600" 
                          : "bg-gray-100 text-gray-400"
                      )}>
                        <Check className="h-3 w-3" />
                      </div>
                      <span className={cn(
                        "text-sm",
                        !feature.included && "text-muted-foreground",
                        feature.highlight && "font-medium text-primary"
                      )}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={cn(
                    "w-full group",
                    plan.current ? "bg-muted text-muted-foreground cursor-default" :
                    plan.popular ? "bg-primary hover:bg-primary/90" : "variant-outline"
                  )}
                  variant={plan.current ? "outline" : plan.popular ? "default" : "outline"}
                  onClick={() => handlePlanUpgrade(plan)}
                  disabled={plan.current}
                >
                  {plan.buttonText}
                  {!plan.current && (
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  )}
                </Button>

                {plan.id !== 'free' && !plan.current && (
                  <p className="text-xs text-center text-muted-foreground">
                    Start your {plan.name} plan today
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Payment Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Upgrade to {selectedPlan?.name}
            </DialogTitle>
            <DialogDescription>
              Complete your payment to start using {selectedPlan?.name} features immediately.
            </DialogDescription>
          </DialogHeader>
          
          {selectedPlan && (
            <PaymentForm
              planName={selectedPlan.name}
              planPrice={selectedPlan.price}
              planInterval={selectedPlan.interval}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SubscriptionPlans;