import { Separator } from "@/components/ui/separator"

export function RetailReceipt() {
  return (
    <div className="max-w-sm mx-auto bg-background border border-border rounded-lg p-6 font-mono text-sm">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-3">
          <span className="text-accent-foreground font-bold text-lg">S</span>
        </div>
        <h1 className="text-lg font-bold text-primary">SuperMart</h1>
        <p className="text-muted-foreground text-xs leading-relaxed">
          123 Main Street
          <br />
          New York, NY 10001
          <br />
          (555) 123-4567
        </p>
      </div>

      <Separator className="mb-4" />

      {/* Transaction Info */}
      <div className="flex justify-between mb-4 text-xs">
        <div>
          <p className="text-muted-foreground">Receipt #</p>
          <p className="font-semibold">R-2024-001234</p>
        </div>
        <div className="text-right">
          <p className="text-muted-foreground">Date</p>
          <p className="font-semibold">Jan 15, 2024</p>
        </div>
      </div>

      <Separator className="mb-4" />

      {/* Items */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <div className="flex-1">
            <p className="font-medium">Organic Bananas</p>
            <p className="text-muted-foreground text-xs">2 lbs × $2.99/lb</p>
          </div>
          <p className="font-semibold">$5.98</p>
        </div>

        <div className="flex justify-between">
          <div className="flex-1">
            <p className="font-medium">Whole Milk</p>
            <p className="text-muted-foreground text-xs">1 gal × $3.49</p>
          </div>
          <p className="font-semibold">$3.49</p>
        </div>

        <div className="flex justify-between">
          <div className="flex-1">
            <p className="font-medium">Bread Loaf</p>
            <p className="text-muted-foreground text-xs">1 × $2.99</p>
          </div>
          <p className="font-semibold">$2.99</p>
        </div>
      </div>

      <Separator className="mb-4" />

      {/* Totals */}
      <div className="space-y-1 mb-4">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>$12.46</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Tax (8.25%)</span>
          <span>$1.03</span>
        </div>
        <Separator className="my-2" />
        <div className="flex justify-between text-lg font-bold text-primary">
          <span>Total</span>
          <span>$13.49</span>
        </div>
      </div>

      <Separator className="mb-4" />

      {/* Payment Method */}
      <div className="mb-4">
        <p className="text-muted-foreground text-xs mb-1">Payment Method</p>
        <p className="font-semibold">Visa •••• 4242</p>
        <p className="text-muted-foreground text-xs">Approved: AUTH123456</p>
      </div>

      <Separator className="mb-4" />

      {/* Footer */}
      <div className="text-center text-xs text-muted-foreground">
        <p className="mb-2">Thank you for shopping with us!</p>
        <p>Return policy: 30 days with receipt</p>
      </div>
    </div>
  )
}
