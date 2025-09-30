import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
    AlertCircle,
    CheckCircle,
    CreditCard,
    Loader2,
    Lock
} from "lucide-react";
import { useState } from "react";

interface PaymentFormProps {
  planName?: string;
  planPrice?: number;
  planInterval?: 'month' | 'year';
  onPaymentSuccess?: (paymentResult: any) => void;
  onPaymentError?: (error: string) => void;
}

interface CardDetails {
  number: string;
  expiryMonth: string;
  expiryYear: string;
  cvc: string;
  name: string;
}

interface BillingAddress {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

const PaymentForm = ({ 
  planName = "Pro Plan", 
  planPrice = 9.99, 
  planInterval = "month",
  onPaymentSuccess,
  onPaymentError 
}: PaymentFormProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [error, setError] = useState<string>("");
  const [saveCard, setSaveCard] = useState(true);

  const [cardDetails, setCardDetails] = useState<CardDetails>({
    number: "",
    expiryMonth: "",
    expiryYear: "",
    cvc: "",
    name: ""
  });

  const [billingAddress, setBillingAddress] = useState<BillingAddress>({
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: ""
  });

  // Generate year options for the next 20 years
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 20 }, (_, i) => currentYear + i);

  // Generate month options
  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    return {
      value: month.toString().padStart(2, '0'),
      label: month.toString().padStart(2, '0')
    };
  });

  const handleCardNumberChange = (value: string) => {
    // Remove all non-digits and limit to 16 characters
    const cleaned = value.replace(/\D/g, '').slice(0, 16);
    // Add spaces every 4 digits for display
    const formatted = cleaned.replace(/(.{4})/g, '$1 ').trim();
    setCardDetails(prev => ({ ...prev, number: formatted }));
  };

  const handleCvcChange = (value: string) => {
    // Remove all non-digits and limit to 4 characters
    const cleaned = value.replace(/\D/g, '').slice(0, 4);
    setCardDetails(prev => ({ ...prev, cvc: cleaned }));
  };

  const validateCard = (): boolean => {
    const errors: string[] = [];

    if (!cardDetails.number || cardDetails.number.replace(/\s/g, '').length < 16) {
      errors.push("Valid card number is required");
    }

    if (!cardDetails.expiryMonth || !cardDetails.expiryYear) {
      errors.push("Expiry date is required");
    }

    if (!cardDetails.cvc || cardDetails.cvc.length < 3) {
      errors.push("Valid CVC is required");
    }

    if (!cardDetails.name.trim()) {
      errors.push("Cardholder name is required");
    }

    if (!billingAddress.address.trim() || !billingAddress.city.trim() || 
        !billingAddress.zipCode.trim() || !billingAddress.country) {
      errors.push("Complete billing address is required");
    }

    if (errors.length > 0) {
      setError(errors.join(", "));
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateCard()) return;

    setIsProcessing(true);
    setError("");

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate payment success/failure
      const success = Math.random() > 0.1; // 90% success rate for demo

      if (success) {
        setPaymentComplete(true);
        onPaymentSuccess?.({
          paymentId: `payment_${Date.now()}`,
          amount: planPrice,
          plan: planName,
          cardLast4: cardDetails.number.slice(-4)
        });
      } else {
        throw new Error("Payment failed. Please try again.");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Payment failed";
      setError(errorMessage);
      onPaymentError?.(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  if (paymentComplete) {
    return (
      <Card className="mx-auto max-w-md">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Payment Successful!</h3>
              <p className="text-sm text-muted-foreground">
                Welcome to {planName}! Your subscription is now active.
              </p>
            </div>
            <Button onClick={() => window.location.href = '/dashboard'} className="w-full">
              Go to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Lock className="h-5 w-5" />
          <span>Secure Payment</span>
        </CardTitle>
        <CardDescription>
          Complete your subscription to {planName} - ${planPrice}/{planInterval}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Card Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Payment Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <div className="relative">
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardDetails.number}
                  onChange={(e) => handleCardNumberChange(e.target.value)}
                  className="pl-10"
                  maxLength={19}
                />
                <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryMonth">Month</Label>
                <Select
                  value={cardDetails.expiryMonth}
                  onValueChange={(value) => setCardDetails(prev => ({ ...prev, expiryMonth: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="MM" />
                  </SelectTrigger>
                  <SelectContent>
                    {monthOptions.map(month => (
                      <SelectItem key={month.value} value={month.value}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiryYear">Year</Label>
                <Select
                  value={cardDetails.expiryYear}
                  onValueChange={(value) => setCardDetails(prev => ({ ...prev, expiryYear: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="YYYY" />
                  </SelectTrigger>
                  <SelectContent>
                    {yearOptions.map(year => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input
                  id="cvc"
                  placeholder="123"
                  value={cardDetails.cvc}
                  onChange={(e) => handleCvcChange(e.target.value)}
                  maxLength={4}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardName">Cardholder Name</Label>
              <Input
                id="cardName"
                placeholder="John Doe"
                value={cardDetails.name}
                onChange={(e) => setCardDetails(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
          </div>

          <Separator />

          {/* Billing Address */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Billing Address</h3>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                placeholder="123 Main Street"
                value={billingAddress.address}
                onChange={(e) => setBillingAddress(prev => ({ ...prev, address: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="New York"
                  value={billingAddress.city}
                  onChange={(e) => setBillingAddress(prev => ({ ...prev, city: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  placeholder="NY"
                  value={billingAddress.state}
                  onChange={(e) => setBillingAddress(prev => ({ ...prev, state: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  placeholder="10001"
                  value={billingAddress.zipCode}
                  onChange={(e) => setBillingAddress(prev => ({ ...prev, zipCode: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select
                  value={billingAddress.country}
                  onValueChange={(value) => setBillingAddress(prev => ({ ...prev, country: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="US">United States</SelectItem>
                    <SelectItem value="CA">Canada</SelectItem>
                    <SelectItem value="GB">United Kingdom</SelectItem>
                    <SelectItem value="AU">Australia</SelectItem>
                    <SelectItem value="DE">Germany</SelectItem>
                    <SelectItem value="FR">France</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Save Card Option */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="saveCard"
              checked={saveCard}
              onCheckedChange={(checked) => setSaveCard(checked as boolean)}
            />
            <Label htmlFor="saveCard" className="text-sm">
              Save this card for future payments
            </Label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing Payment...
              </>
            ) : (
              <>
                <Lock className="mr-2 h-4 w-4" />
                Pay ${planPrice} {planInterval === 'year' ? 'annually' : 'monthly'}
              </>
            )}
          </Button>

          {/* Security Notice */}
          <div className="text-center text-xs text-muted-foreground">
            <Lock className="inline mr-1 h-3 w-3" />
            Your payment information is encrypted and secure
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PaymentForm;