import { Separator } from "@/components/ui/separator"

export function ServiceReceipt() {
  return (
    <div className="max-w-sm mx-auto bg-background border border-border rounded-lg p-6 font-sans text-sm">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mx-auto mb-3">
          <span className="text-secondary-foreground font-bold text-lg">✂</span>
        </div>
        <h1 className="text-lg font-bold text-primary">Elite Hair Studio</h1>
        <p className="text-muted-foreground text-xs leading-relaxed">
          456 Beauty Ave
          <br />
          Los Angeles, CA 90210
          <br />
          (555) 987-6543
        </p>
      </div>

      <Separator className="mb-4" />

      {/* Service Info */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-muted-foreground">Appointment</span>
          <span className="font-semibold">#A-2024-5678</span>
        </div>
        <div className="flex justify-between text-xs mb-2">
          <span className="text-muted-foreground">Date & Time</span>
          <span className="font-semibold">Jan 15, 2024 - 2:30 PM</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Stylist</span>
          <span className="font-semibold">Sarah Johnson</span>
        </div>
      </div>

      <Separator className="mb-4" />

      {/* Services */}
      <div className="space-y-3 mb-4">
        <div className="flex justify-between">
          <div className="flex-1">
            <p className="font-medium">Haircut & Style</p>
            <p className="text-muted-foreground text-xs">Premium cut with styling</p>
          </div>
          <p className="font-semibold">$85.00</p>
        </div>

        <div className="flex justify-between">
          <div className="flex-1">
            <p className="font-medium">Color Treatment</p>
            <p className="text-muted-foreground text-xs">Full highlights</p>
          </div>
          <p className="font-semibold">$120.00</p>
        </div>

        <div className="flex justify-between">
          <div className="flex-1">
            <p className="font-medium">Deep Conditioning</p>
            <p className="text-muted-foreground text-xs">Keratin treatment</p>
          </div>
          <p className="font-semibold">$45.00</p>
        </div>
      </div>

      <Separator className="mb-4" />

      {/* Totals */}
      <div className="space-y-1 mb-4">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>$250.00</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Tip (20%)</span>
          <span>$50.00</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Tax (9.5%)</span>
          <span>$28.50</span>
        </div>
        <Separator className="my-2" />
        <div className="flex justify-between text-lg font-bold text-primary">
          <span>Total</span>
          <span>$328.50</span>
        </div>
      </div>

      <Separator className="mb-4" />

      {/* Payment Method */}
      <div className="mb-4">
        <p className="text-muted-foreground text-xs mb-1">Payment Method</p>
        <p className="font-semibold">Mastercard •••• 8765</p>
        <p className="text-muted-foreground text-xs">Transaction ID: TXN789012</p>
      </div>

      <Separator className="mb-4" />

      {/* Footer */}
      <div className="text-center text-xs text-muted-foreground">
        <p className="mb-2">Thank you for choosing Elite Hair Studio!</p>
        <p>Book your next appointment: (555) 987-6543</p>
      </div>
    </div>
  )
}
