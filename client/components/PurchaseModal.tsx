import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Star,
  Download,
  DollarSign,
  Code,
  User,
  Calendar,
  CreditCard,
  Landmark,
  Wallet2,
  IndianRupee,
  ShieldCheck,
} from "lucide-react";
import { CodeSnippet, PurchaseSnippetResponse } from "@shared/api";
import PaymentButton from "./PaymentButton";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import useRequireAuth from "@/hooks/useRequireAuth";

interface PurchaseModalProps {
  snippet: CodeSnippet | null;
  isOpen: boolean;
  onClose: () => void;
  onPurchaseComplete: () => void;
}

export default function PurchaseModal({
  snippet,
  isOpen,
  onClose,
  onPurchaseComplete,
}: PurchaseModalProps) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [hasToken, setHasToken] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "netbanking" | "wallet">("upi");
  const navigate = useNavigate();
  const requireAuth = useRequireAuth();

  if (!snippet) return null;

  // Get current user data for Razorpay
  const getUserData = () => {
    const userData = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    setHasToken(Boolean(token));
    if (userData) {
      const user = JSON.parse(userData);
      setCurrentUser(user);
      return user;
    }
    setCurrentUser(null);
    return null;
  };

  // Initialize user data when modal opens
  React.useEffect(() => {
    if (isOpen) {
      const user = getUserData();
      // If there's no user/token, redirect to login automatically
      if (!user) {
        requireAuth();
      }
    }
  }, [isOpen]);

  const handlePaymentSuccess = (data: any) => {
    console.log("Payment successful:", data);
    setPaymentData(data);
    setSuccess(true);
    setError("");

    toast({ title: "Payment Successful!", description: "Download available in your library." });

    // Call the completion callback and redirect to dashboard purchases
    setTimeout(() => {
      onPurchaseComplete();
      onClose();
      navigate("/dashboard");
      setSuccess(false);
      setPaymentData(null);
    }, 1500);
  };

  const handlePaymentError = (error: string) => {
    console.error("Payment error:", error);
    setError(error);
    setSuccess(false);
    toast({ title: "Payment Failed", description: error || "Please try again.", variant: "destructive" as any });
  };

  const handleClose = () => {
    onClose();
    setError("");
    setSuccess(false);
    setPaymentData(null);
  };

  if (success) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-green-600">
              Payment Successful! 🎉
            </DialogTitle>
            <DialogDescription>
              Your payment has been processed successfully. You now have access
              to "{snippet.title}".
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center justify-center py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Code className="w-8 h-8 text-green-600" />
              </div>
            </div>

            {paymentData && (
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-semibold text-sm mb-2">
                    Payment Details
                  </h4>
                  <div className="space-y-1 text-xs text-gray-600">
                    {paymentData.id && <div>Payment ID: {paymentData.id}</div>}
                    {paymentData.order_id && (
                      <div>Order ID: {paymentData.order_id}</div>
                    )}
                    <div>Amount: ₹{snippet.price}</div>
                    <div>Status: {paymentData.status || "Completed"}</div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <DialogFooter>
            <Button onClick={handleClose} className="w-full">
              Continue Browsing
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Purchase Code Snippet</DialogTitle>
          <DialogDescription>
            Review the details before purchasing this code snippet.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          {/* Snippet Details */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {snippet.title}
                  </h3>
                  <p className="text-gray-600 mt-2">{snippet.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">
                    ₹{snippet.price}
                  </div>
                  <div className="text-sm text-gray-500">One-time purchase</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {snippet.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Code className="w-4 h-4" />
                  <span>{snippet.language}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <User className="w-4 h-4" />
                  <span>{snippet.author}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{snippet.rating} rating</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Download className="w-4 h-4" />
                  <span>{snippet.downloads} downloads</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Code Preview */}
          <Card>
            <CardContent className="p-6">
              <h4 className="font-semibold text-gray-900 mb-3">Code Preview</h4>
              <div className="bg-gray-900 rounded-lg p-4 max-h-64 overflow-auto shadow">
                <pre className="text-green-400 text-sm font-mono min-w-full">
                  <code>
                    {snippet.code.length > 200
                      ? `${snippet.code.substring(0, 200)}...\n\n// Preview - Full code available after purchase`
                      : snippet.code}
                  </code>
                </pre>
              </div>
              {snippet.code.length > 200 && (
                <p className="text-xs text-gray-500 mt-2">
                  This is a preview. Full code will be available after purchase.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Purchase Summary */}
          <Card>
            <CardContent className="p-6">
              <h4 className="font-semibold text-gray-900 mb-3">
                Purchase Summary
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Snippet Price</span>
                  <span className="font-medium">₹{snippet.price}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Platform Fee</span>
                  <span className="font-medium">₹0.00</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-green-600">₹{snippet.price}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Section */}
          <Card>
            <CardContent className="p-6">
              <h4 className="font-semibold text-gray-900 mb-3">Payment</h4>
              {!currentUser ? (
                <div className="text-center space-y-3">
                  <p className="text-sm text-gray-600">
                    Please log in to proceed with payment.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <Button asChild variant="outline">
                      <Link to="/login">Log in</Link>
                    </Button>
                    <Button asChild>
                      <Link to="/signup">Sign up</Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <PaymentButton
                    amount={snippet.price}
                    description={snippet.description}
                    userId={currentUser.id}
                    snippetId={snippet.id}
                    userName={currentUser.username}
                    userEmail={currentUser.email}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                    className="w-full text-white font-semibold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-md"
                    ctaLabel={`Proceed to Pay ₹${snippet.price}`}
                  />
                  <div className="text-xs text-gray-500 text-center">Secure checkout powered by Razorpay</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* What You Get */}
          <Card>
            <CardContent className="p-6">
              <h4 className="font-semibold text-gray-900 mb-3">
                What You'll Get
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Complete source code with comments
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Lifetime access to the code
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Copy and modify for your projects
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Support from the author
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
