import { DigitalReceipt } from "@/components/digital-receipt"
import { Card } from "@/components/ui/card"

export default function ReceiptTemplates() {
  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-primary mb-2">Digital Product Receipt</h1>
          <p className="text-muted-foreground">Professional receipt template for digital subscriptions and services</p>
        </div>

        <div className="flex justify-center">
          <div className="space-y-4">
            <Card className="p-6">
              <DigitalReceipt />
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
