import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import PaymentButton from "../components/PaymentButton";
import {
  ShoppingCart,
  Code,
  User,
  CreditCard,
  CheckCircle,
  Package,
} from "lucide-react";

interface PurchaseItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
}

const CheckoutPage: React.FC = () => {
  const [userDetails, setUserDetails] = useState({
    userId: "user-demo",
    name: "John Doe",
    email: "john@example.com",
    contact: "+919876543210",
  });

  const [selectedItem, setSelectedItem] = useState<PurchaseItem>({
    id: "snippet-demo",
    name: "React Login Form",
    description: "Complete login form with validation and authentication",
    price: 299,
    category: "React Component",
  });

  const [customAmount, setCustomAmount] = useState(selectedItem.price);
  const [purchaseHistory, setPurchaseHistory] = useState<any[]>([]);

  const sampleItems: PurchaseItem[] = [
    {
      id: "snippet-1",
      name: "React Login Form",
      description: "Complete login form with validation and authentication",
      price: 299,
      category: "React Component",
    },
    {
      id: "snippet-2",
      name: "Vue Dashboard",
      description: "Admin dashboard with charts and analytics",
      price: 599,
      category: "Vue Component",
    },
    {
      id: "snippet-3",
      name: "Node.js API Middleware",
      description: "Authentication and rate limiting middleware",
      price: 199,
      category: "Backend Code",
    },
    {
      id: "snippet-4",
      name: "CSS Grid System",
      description: "Responsive grid layout system",
      price: 149,
      category: "CSS Framework",
    },
  ];

  const handlePaymentSuccess = (paymentData: any) => {
    console.log("Payment successful:", paymentData);
    setPurchaseHistory((prev) => [
      ...prev,
      {
        ...selectedItem,
        paymentData,
        purchaseDate: new Date().toISOString(),
      },
    ]);
  };

  const handlePaymentError = (error: string) => {
    console.error("Payment error:", error);
  };

  const handleUserDetailChange = (field: string, value: string) => {
    setUserDetails((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <ShoppingCart className="h-8 w-8" />
          CodeHut Checkout
        </h1>
        <p className="text-muted-foreground">
          Test the Razorpay payment integration with our code snippets
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Product Selection */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Select Code Snippet
              </CardTitle>
              <CardDescription>
                Choose a code snippet to purchase
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {sampleItems.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedItem.id === item.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => {
                    setSelectedItem(item);
                    setCustomAmount(item.price);
                  }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{item.name}</h3>
                    <Badge variant="outline">{item.category}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {item.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">₹{item.price}</span>
                    {selectedItem.id === item.id && (
                      <CheckCircle className="h-5 w-5 text-primary" />
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* User Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                User Details
              </CardTitle>
              <CardDescription>Update your details for testing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="userId">User ID</Label>
                  <Input
                    id="userId"
                    value={userDetails.userId}
                    onChange={(e) =>
                      handleUserDetailChange("userId", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={userDetails.name}
                    onChange={(e) =>
                      handleUserDetailChange("name", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userDetails.email}
                    onChange={(e) =>
                      handleUserDetailChange("email", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact">Contact</Label>
                  <Input
                    id="contact"
                    value={userDetails.contact}
                    onChange={(e) =>
                      handleUserDetailChange("contact", e.target.value)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Item:</span>
                  <span className="font-semibold">{selectedItem.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Category:</span>
                  <Badge variant="outline">{selectedItem.category}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Original Price:</span>
                  <span>₹{selectedItem.price}</span>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="customAmount">
                    Custom Amount (for testing)
                  </Label>
                  <Input
                    id="customAmount"
                    type="number"
                    min="1"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(Number(e.target.value))}
                  />
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>₹{customAmount}</span>
                </div>
              </div>

              <PaymentButton
                amount={customAmount}
                description={selectedItem.description}
                userId={userDetails.userId}
                userName={userDetails.name}
                userEmail={userDetails.email}
                userContact={userDetails.contact}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                className="w-full text-white font-semibold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-md"
                ctaLabel={`Proceed to Pay ₹${customAmount}`}
              />
            </CardContent>
          </Card>

          {/* Purchase History */}
          {purchaseHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Purchase History
                </CardTitle>
                <CardDescription>Recent successful purchases</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {purchaseHistory.map((purchase, index) => (
                    <div
                      key={index}
                      className="p-3 border rounded-lg bg-green-50 border-green-200"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-sm">
                          {purchase.name}
                        </h4>
                        <Badge variant="outline" className="bg-green-100">
                          Paid
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div>Amount: ₹{purchase.price}</div>
                        <div>
                          Payment ID:{" "}
                          {purchase.paymentData?.id?.slice(-10) || "N/A"}
                        </div>
                        <div>
                          Date:{" "}
                          {new Date(purchase.purchaseDate).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Testing Instructions */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Testing Instructions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Test Card Details for Razorpay:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Card Number: 4111 1111 1111 1111</li>
              <li>Expiry: Any future date (e.g., 12/25)</li>
              <li>CVV: Any 3 digits (e.g., 123)</li>
              <li>Cardholder Name: Any name</li>
            </ul>
            <p className="mt-4">
              <strong>UPI Testing:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>UPI ID: success@razorpay (for successful payment)</li>
              <li>UPI ID: failure@razorpay (for failed payment)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckoutPage;
