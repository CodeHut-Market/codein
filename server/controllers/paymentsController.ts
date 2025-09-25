import { Request, Response } from "express";
import {
  razorpay,
  verifyPaymentSignature,
  verifyWebhookSignature,
} from "../config/razorpay";
import {
  createOrder,
  createPaymentTransaction,
  updateOrderStatus,
  updatePaymentTransactionStatus,
  getOrderByRazorpayId,
  getPaymentTransactionByOrderId,
} from "../config/db";

export interface CreateOrderRequest {
  amount: number;
  currency?: string;
  userId: string;
  snippetId?: number;
  receipt?: string;
}

export interface VerifyPaymentRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  userId: string;
}

export interface WebhookPayload {
  entity: string;
  account_id: string;
  event: string;
  contains: string[];
  payload: {
    payment: {
      entity: any;
      id: string;
      status: string;
      order_id: string;
    };
    order: {
      entity: any;
      id: string;
      status: string;
    };
  };
  created_at: number;
}

export const createOrderController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const {
      amount,
      currency = "INR",
      userId,
      snippetId,
      receipt,
    }: CreateOrderRequest = req.body;

    // Validate request data
    if (!amount || !userId) {
      res.status(400).json({
        success: false,
        error: "Amount and userId are required",
      });
      return;
    }

    if (typeof amount !== "number" || amount <= 0) {
      res.status(400).json({
        success: false,
        error: "Amount must be a positive number",
      });
      return;
    }

    if (amount < 1) {
      res.status(400).json({
        success: false,
        error: "Amount should be at least ₹1",
      });
      return;
    }

    // Create Razorpay order
    const orderOptions = {
      amount: Math.round(amount * 100), // Convert to paise
      currency: currency,
      receipt: receipt || `receipt_${Date.now()}`,
      payment_capture: 1, // Auto capture payment
    };

    const razorpayOrder = await razorpay.orders.create(orderOptions);

    // Save order to database
    const orderId = await createOrder({
      amount: amount,
      currency: currency,
      status: "created",
      razorpay_order_id: razorpayOrder.id,
      snippet_id: snippetId,
    });

    // Create corresponding payment transaction record
    await createPaymentTransaction({
      order_id: orderId,
      user_id: userId,
      status: "pending",
    });

    res.status(201).json({
      success: true,
      order: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        receipt: razorpayOrder.receipt,
      },
      key_id: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create order",
    });
  }
};

export const verifyPaymentController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
    }: VerifyPaymentRequest = req.body;

    // Validate request data
    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !userId
    ) {
      res.status(400).json({
        success: false,
        error: "Missing required payment verification data",
      });
      return;
    }

    // Verify payment signature
    const isSignatureValid = verifyPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    );

    if (!isSignatureValid) {
      res.status(400).json({
        success: false,
        error: "Invalid payment signature",
      });
      return;
    }

    // Get order from database
    const order = await getOrderByRazorpayId(razorpay_order_id);
    if (!order) {
      res.status(404).json({
        success: false,
        error: "Order not found",
      });
      return;
    }

    // Update order status
    await updateOrderStatus(razorpay_order_id, "paid");

    // Update payment transaction with payment details
    await updatePaymentTransactionStatus(
      order.id!,
      "success",
      razorpay_payment_id,
      razorpay_signature,
    );

    // Fetch payment details from Razorpay for additional verification
    try {
      const paymentDetails = await razorpay.payments.fetch(razorpay_payment_id);

      res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        payment: {
          id: paymentDetails.id,
          order_id: paymentDetails.order_id,
          status: paymentDetails.status,
          amount: paymentDetails.amount,
          currency: paymentDetails.currency,
          method: paymentDetails.method,
          created_at: paymentDetails.created_at,
        },
      });
    } catch (paymentFetchError) {
      // Even if fetching payment details fails, the verification was successful
      res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        payment: {
          id: razorpay_payment_id,
          order_id: razorpay_order_id,
          status: "captured",
        },
      });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({
      success: false,
      error: "Failed to verify payment",
    });
  }
};

export const webhookController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const webhookSignature = req.headers["x-razorpay-signature"] as string;
    const webhookBody = JSON.stringify(req.body);

    if (!webhookSignature) {
      res.status(400).json({
        success: false,
        error: "Missing webhook signature",
      });
      return;
    }

    // Verify webhook signature
    const isSignatureValid = verifyWebhookSignature(
      webhookBody,
      webhookSignature,
    );
    if (!isSignatureValid) {
      res.status(400).json({
        success: false,
        error: "Invalid webhook signature",
      });
      return;
    }

    const webhookData: WebhookPayload = req.body;
    console.log("Webhook received:", webhookData.event);

    switch (webhookData.event) {
      case "payment.captured":
        await handlePaymentCaptured(webhookData);
        break;

      case "payment.failed":
        await handlePaymentFailed(webhookData);
        break;

      case "order.paid":
        await handleOrderPaid(webhookData);
        break;

      default:
        console.log(`Unhandled webhook event: ${webhookData.event}`);
    }

    res.status(200).json({
      success: true,
      message: "Webhook processed successfully",
    });
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).json({
      success: false,
      error: "Failed to process webhook",
    });
  }
};

const handlePaymentCaptured = async (
  webhookData: WebhookPayload,
): Promise<void> => {
  try {
    const payment = webhookData.payload.payment.entity;
    const orderId = payment.order_id;

    // Update order status
    await updateOrderStatus(orderId, "paid");

    // Get order from database to update payment transaction
    const order = await getOrderByRazorpayId(orderId);
    if (order) {
      await updatePaymentTransactionStatus(order.id!, "success", payment.id);
    }

    console.log(`Payment captured: ${payment.id} for order: ${orderId}`);
  } catch (error) {
    console.error("Error handling payment.captured webhook:", error);
  }
};

const handlePaymentFailed = async (
  webhookData: WebhookPayload,
): Promise<void> => {
  try {
    const payment = webhookData.payload.payment.entity;
    const orderId = payment.order_id;

    // Update order status
    await updateOrderStatus(orderId, "failed");

    // Get order from database to update payment transaction
    const order = await getOrderByRazorpayId(orderId);
    if (order) {
      await updatePaymentTransactionStatus(order.id!, "failed");
    }

    console.log(`Payment failed: ${payment.id} for order: ${orderId}`);
  } catch (error) {
    console.error("Error handling payment.failed webhook:", error);
  }
};

const handleOrderPaid = async (webhookData: WebhookPayload): Promise<void> => {
  try {
    const order = webhookData.payload.order.entity;

    // Update order status
    await updateOrderStatus(order.id, "paid");

    console.log(`Order paid: ${order.id}`);
  } catch (error) {
    console.error("Error handling order.paid webhook:", error);
  }
};

// Get user's purchase history
export const getUserPurchasesController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { userId } = req.params;

    if (!userId) {
      res.status(400).json({
        success: false,
        error: "User ID is required",
      });
      return;
    }

    // This would typically fetch from database
    // For now, returning a simple response
    res.status(200).json({
      success: true,
      purchases: [],
      message: "User purchases retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching user purchases:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch user purchases",
    });
  }
};
