import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Download, ShoppingCart, Check, AlertCircle } from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayBuyNowProps {
  snippet: {
    id: string;
    title: string;
    price: number;
    author: string;
    authorId: string;
  };
  user: {
    id: string;
    username: string;
    email: string;
  } | null;
  onPurchaseSuccess?: () => void;
}

import { markSnippetAsPurchased } from "@/lib/purchaseUtils";
import useRequireAuth from "@/hooks/useRequireAuth";

export default function RazorpayBuyNow({
  snippet,
  user,
  onPurchaseSuccess,
}: RazorpayBuyNowProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const requireAuth = useRequireAuth();

  const handlePurchase = async () => {
  // Ensure authenticated
  if (!requireAuth()) return;

    if (user.id === snippet.authorId) {
      setError("You cannot purchase your own snippet");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Create order with Route transfers
      const response = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          snippetId: snippet.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create order");
      }

      const orderData = await response.json();
      setOrderDetails(orderData);

      // Load Razorpay script if not already loaded
      if (!window.Razorpay) {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => initializeRazorpay(orderData);
        script.onerror = () => {
          setError("Failed to load Razorpay. Please try again.");
          setLoading(false);
        };
        document.body.appendChild(script);
      } else {
        initializeRazorpay(orderData);
      }
    } catch (error) {
      console.error("Purchase error:", error);
      setError(error instanceof Error ? error.message : "Purchase failed");
      setLoading(false);
    }
  };

  const initializeRazorpay = (orderData: any) => {
    const isDemoOrder = orderData.key === "rzp_test_DEMO" || (typeof orderData.orderId === "string" && orderData.orderId.startsWith("order_demo_"));
    if (isDemoOrder) {
      // Immediately mark as purchased for instant unlock UX in demo
      if (user?.id) {
        markSnippetAsPurchased(snippet.id, user.id);
      }
      verifyPayment({
        razorpay_order_id: orderData.orderId,
        razorpay_payment_id: `pay_demo_${Date.now()}`,
        razorpay_signature: "demo_signature",
      });
      return;
    }

    const options = {
      key: orderData.key,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "CodeHut Marketplace",
      description: `Purchase: ${snippet.title}`,
      order_id: orderData.orderId,
      prefill: {
        name: user?.username,
        email: user?.email,
      },
      theme: {
        color: "#3b82f6",
      },
      handler: async (response: any) => {
        await verifyPayment(response);
      },
      modal: {
        ondismiss: () => {
          setLoading(false);
          setError("Payment was cancelled");
        },
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const verifyPayment = async (paymentResponse: any) => {
    try {
      const response = await fetch("/api/payments/verify-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_signature: paymentResponse.razorpay_signature,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Payment verification failed");
      }

      const result = await response.json();
      setSuccess(true);
      setLoading(false);

      // Record local purchase for immediate unlock
      if (user?.id) {
        markSnippetAsPurchased(snippet.id, user.id);
      }

      if (onPurchaseSuccess) {
        onPurchaseSuccess();
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      setError(
        error instanceof Error ? error.message : "Payment verification failed",
      );
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(`/api/payments/download/${snippet.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Download failed");
      }

      const snippetData = await response.json();

      // Create and download file
      const blob = new Blob([snippetData.code], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${snippetData.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.${getFileExtension(snippetData.language)}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download error:", error);
      setError(error instanceof Error ? error.message : "Download failed");
    }
  };

  const getFileExtension = (language: string): string => {
    const extensions: { [key: string]: string } = {
      javascript: "js",
      typescript: "ts",
      python: "py",
      java: "java",
      cpp: "cpp",
      c: "c",
      css: "css",
      html: "html",
      php: "php",
      ruby: "rb",
      go: "go",
      rust: "rs",
      swift: "swift",
      kotlin: "kt",
    };
    return extensions[language?.toLowerCase()] || "txt";
  };

  if (!user) {
    return (
      <Button onClick={() => requireAuth()} className="w-full">
        Log in to Purchase
      </Button>
    );
  }

  if (success) {
    return (
      <div className="space-y-3">
        <Alert className="border-green-200 bg-green-50">
          <Check className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Purchase successful! You can now download the snippet.
          </AlertDescription>
        </Alert>
        <Button
          onClick={handleDownload}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Code
        </Button>
      </div>
    );
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <ShoppingCart className="w-4 h-4 mr-2" />
          Buy Now - ₹{snippet.price}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Purchase Code Snippet</DialogTitle>
          <DialogDescription>
            Complete your purchase to download this code snippet
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold">{snippet.title}</h3>
            <p className="text-sm text-gray-600">by {snippet.author}</p>
            <div className="mt-2 text-lg font-bold text-blue-600">
              ₹{snippet.price}
            </div>
          </div>

          {orderDetails && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">
                Payment Breakdown
              </h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>To Seller ({orderDetails.seller.username}):</span>
                  <span className="font-medium">
                    ₹{orderDetails.seller.earning}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Fee:</span>
                  <span className="font-medium">
                    ₹{orderDetails.platform.commission}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-1 font-semibold">
                  <span>Total:</span>
                  <span>₹{snippet.price}</span>
                </div>
              </div>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePurchase}
              disabled={loading}
              className="flex-1"
            >
              {loading ? "Processing..." : "Proceed to Payment"}
            </Button>
          </div>

          <div className="text-xs text-gray-500 text-center">
            Secure payment powered by Razorpay
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
