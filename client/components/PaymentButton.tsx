import React, { useState } from "react";
import { Button } from "./ui/button";
import useRequireAuth from "@/hooks/useRequireAuth";
import { Alert, AlertDescription } from "./ui/alert";
import { Loader2, CreditCard, CheckCircle2, XCircle } from "lucide-react";
import { markSnippetAsPurchased } from "@/lib/purchaseUtils";

interface PaymentButtonProps {
  amount: number;
  currency?: string;
  description: string;
  userId: string;
  snippetId?: string;
  userEmail?: string;
  userName?: string;
  userContact?: string;
  onSuccess?: (paymentData: any) => void;
  onError?: (error: string) => void;
  className?: string;
  ctaLabel?: string;
}

interface CreateOrderResponse {
  success: boolean;
  order: {
    id: string;
    amount: number;
    currency: string;
    receipt: string;
  };
  key_id: string;
  error?: string;
}

interface VerifyPaymentResponse {
  success: boolean;
  message: string;
  payment?: any;
  error?: string;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  amount,
  currency = "INR",
  description,
  userId,
  snippetId,
  userEmail,
  userName,
  userContact,
  onSuccess,
  onError,
  className,
  ctaLabel,
}) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const requireAuth = useRequireAuth();

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const createOrder = async (): Promise<any> => {
    const token = localStorage.getItem("token");
    const response = await fetch("/api/payments/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({
        amount,
        currency,
        userId,
        snippetId,
      }),
    });

    if (!response.ok) {
      try {
        const data = await response.json();
        throw new Error(data?.message || `HTTP error! status: ${response.status}`);
      } catch {
        throw new Error(response.status === 401 ? "Please log in to complete the purchase" : `HTTP error! status: ${response.status}`);
      }
    }

    return response.json();
  };

  const verifyPayment = async (paymentData: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }): Promise<VerifyPaymentResponse> => {
    const token = localStorage.getItem("token");
    const response = await fetch("/api/payments/verify-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({
        ...paymentData,
        userId,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data && data.status === "success" && !data.success) {
      return { success: true, message: data.message, payment: data.payment };
    }
    return data;
  };

  const handlePayment = async () => {
    // Redirect to login if user is not authenticated
    if (!requireAuth()) {
      // Ensure UI isn't stuck in loading state
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setStatus("idle");
      setMessage("");

      // Load Razorpay script
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error("Failed to load Razorpay script");
      }

      // Create order
      const rawResponse = await createOrder();

      // Normalize server responses: supports both { success, order, key_id } and demo { orderId, amount, currency, key }
      const normalized: any = (() => {
        if (rawResponse?.success && rawResponse.order && (rawResponse.key_id || rawResponse.key)) {
          return { success: true, order: rawResponse.order, key_id: rawResponse.key_id || rawResponse.key };
        }
        if (rawResponse?.orderId && rawResponse?.amount && rawResponse?.currency) {
          return {
            success: true,
            order: { id: rawResponse.orderId, amount: rawResponse.amount, currency: rawResponse.currency },
            key_id: rawResponse.key || rawResponse.key_id || "rzp_test_DEMO",
          };
        }
        return { success: false, error: rawResponse?.error };
      })();

      if (!normalized.success) {
        throw new Error(normalized.error || "Failed to create order");
      }

      const { order, key_id } = normalized;

      // Demo mode: if using demo key/order, skip Razorpay UI and verify directly
      const isDemoOrder = key_id === "rzp_test_DEMO" || (typeof order.id === "string" && order.id.startsWith("order_demo_"));
      if (isDemoOrder) {
        const verificationResponse = await verifyPayment({
          razorpay_order_id: typeof order.id === "string" ? order.id : String(order.id),
          razorpay_payment_id: `pay_demo_${Date.now()}`,
          razorpay_signature: "demo_signature",
        });

        if (verificationResponse.success) {
          setStatus("success");
          setMessage(verificationResponse.message);
          if (userId && snippetId) {
            markSnippetAsPurchased(String(snippetId), String(userId));
          }
          onSuccess?.(verificationResponse.payment);
        } else {
          throw new Error(verificationResponse.error || "Payment verification failed");
        }
        return;
      }

      // Configure Razorpay options
      const options = {
        key: key_id,
        amount: order.amount,
        currency: order.currency,
        name: "CodeHut",
        description: description,
        image: "/favicon.ico", // You can replace this with your logo
        order_id: order.id,
        handler: async (response: any) => {
          try {
            // Verify payment on backend
            const verificationResponse = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verificationResponse.success) {
              setStatus("success");
              setMessage(verificationResponse.message);
              // Locally mark as purchased for immediate unlock
              if (userId && snippetId) {
                markSnippetAsPurchased(String(snippetId), String(userId));
              }
              onSuccess?.(verificationResponse.payment);
            } else {
              throw new Error(
                verificationResponse.error || "Payment verification failed",
              );
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            setStatus("error");
            setMessage(
              error instanceof Error
                ? error.message
                : "Payment verification failed",
            );
            onError?.(
              error instanceof Error
                ? error.message
                : "Payment verification failed",
            );
          }
        },
        prefill: {
          name: userName,
          email: userEmail,
          contact: userContact,
        },
        notes: {
          userId: userId,
          description: description,
        },
        theme: {
          color: "#3b82f6", // Blue color matching your theme
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setMessage("Payment cancelled by user");
          },
        },
      };

      // Open Razorpay checkout
      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", (response: any) => {
        console.error("Payment failed:", response.error);
        setStatus("error");
        const errorMsg =
          response.error?.description ||
          response.error?.reason ||
          "Payment failed";
        setMessage(`Payment failed: ${errorMsg}`);
        onError?.(errorMsg);
      });

      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Payment failed");
      onError?.(error instanceof Error ? error.message : "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  const getButtonContent = () => {
    if (loading) {
      return (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      );
    }

    if (status === "success") {
      return (
        <>
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Payment Successful
        </>
      );
    }

    return (
      <>
        <CreditCard className="mr-2 h-4 w-4" />
        {ctaLabel ? ctaLabel : `Pay Securely ₹${amount}`}
      </>
    );
  };

  const getStatusAlert = () => {
    if (status === "success") {
      return (
        <Alert className="mt-4 border-green-200 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            {message}
          </AlertDescription>
        </Alert>
      );
    }

    if (status === "error") {
      return (
        <Alert className="mt-4 border-red-200 bg-red-50">
          <XCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {message}
          </AlertDescription>
        </Alert>
      );
    }

    return null;
  };

  return (
    <div className="w-full">
      <Button
        onClick={handlePayment}
        disabled={loading || status === "success"}
        className={className}
        size="lg"
        aria-label={loading ? "Processing payment" : `Pay securely ₹${amount}`}
      >
        {getButtonContent()}
      </Button>
      {getStatusAlert()}
    </div>
  );
};

export default PaymentButton;
