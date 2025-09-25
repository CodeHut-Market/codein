import { Separator } from "@/components/ui/separator"

export function DigitalReceipt() {
  return (
    <div className="max-w-sm mx-auto bg-background border border-border rounded-lg p-6 font-sans text-sm">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center mx-auto mb-3">
          <span className="text-accent-foreground font-bold text-lg">⚡</span>
        </div>
        <h1 className="text-lg font-bold text-primary">CloudFlow Pro</h1>
        <p className="text-muted-foreground text-xs leading-relaxed">
          Digital Solutions Inc.
          <br />
          support@cloudflow.com
          <br />
          www.cloudflow.com
        </p>
      </div>

      <Separator className="mb-4" />

      {/* Order Info */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-muted-foreground">Order ID</span>
          <span className="font-semibold">#CF-2024-9876</span>
        </div>
        <div className="flex justify-between text-xs mb-2">
          <span className="text-muted-foreground">Purchase Date</span>
          <span className="font-semibold">January 15, 2024</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Customer</span>
          <span className="font-semibold">john@example.com</span>
        </div>
      </div>

      <Separator className="mb-4" />

      {/* Digital Products */}
      <div className="space-y-3 mb-4">
        <div className="flex justify-between">
          <div className="flex-1">
            <p className="font-medium">Pro Plan Subscription</p>
            <p className="text-muted-foreground text-xs">Annual billing - 12 months</p>
          </div>
          <p className="font-semibold">$299.00</p>
        </div>

        <div className="flex justify-between">
          <div className="flex-1">
            <p className="font-medium">Premium Support</p>
            <p className="text-muted-foreground text-xs">24/7 priority support</p>
          </div>
          <p className="font-semibold">$99.00</p>
        </div>

        <div className="flex justify-between">
          <div className="flex-1">
            <p className="font-medium">API Credits</p>
            <p className="text-muted-foreground text-xs">100,000 additional credits</p>
          </div>
          <p className="font-semibold">$49.00</p>
        </div>
      </div>

      <Separator className="mb-4" />

      {/* Discount */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-secondary">
          <span>Discount (WELCOME20)</span>
          <span>-$89.40</span>
        </div>
      </div>

      <Separator className="mb-4" />

      {/* Totals */}
      <div className="space-y-1 mb-4">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>$447.00</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Discount</span>
          <span>-$89.40</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Tax</span>
          <span>$0.00</span>
        </div>
        <Separator className="my-2" />
        <div className="flex justify-between text-lg font-bold text-primary">
          <span>Total</span>
          <span>$357.60</span>
        </div>
      </div>

      <Separator className="mb-4" />

      {/* Payment Method */}
      <div className="mb-4">
        <p className="text-muted-foreground text-xs mb-1">Payment Method</p>
        <p className="font-semibold">American Express •••• 1005</p>
        <p className="text-muted-foreground text-xs">Confirmation: CF789ABC123</p>
      </div>

      <Separator className="mb-4" />

      {/* Digital Delivery */}
      <div className="mb-4 p-3 bg-muted rounded-lg">
        <p className="text-xs font-medium text-primary mb-1">✓ Access Activated</p>
        <p className="text-xs text-muted-foreground">
          Your subscription is now active. Login to your dashboard to get started.
        </p>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-muted-foreground">
        <p className="mb-2">Thank you for your purchase!</p>
        <p>Questions? Contact support@cloudflow.com</p>
      </div>
    </div>
  )
}
