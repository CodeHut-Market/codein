import { RequestHandler } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import { pool } from "../db/database";
import { findSnippetById, findUserById } from "../db/database";
import { ErrorResponse } from "@shared/api";
import { authenticateToken } from "../utils/auth";

// Demo mode only when keys are missing. Database is optional.
const DEMO_MODE =
  !process.env.RAZORPAY_KEY_ID ||
  !process.env.RAZORPAY_KEY_SECRET;
// Allow anonymous checkout when no database is configured
const ALLOW_ANONYMOUS = !pool;

// Initialize Razorpay (only if not in demo mode)
const razorpay = !DEMO_MODE
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    })
  : (null as any);

// Commission percentages
const PLATFORM_COMMISSION = 0.1; // 10%
const SELLER_COMMISSION = 0.9; // 90%

/**
 * POST /api/payments/create-order
 * Create a Razorpay order with Route transfers for commission split
 */
export const createRouteOrder: RequestHandler = async (req, res) => {
  try {
    const { snippetId } = req.body;
    let user = (req as any).user; // from auth middleware

    if (!user) {
      if (DEMO_MODE) {
        user = { id: "demo-user" };
      } else if (ALLOW_ANONYMOUS) {
        user = { id: "guest-user" };
      } else {
        const errorResponse: ErrorResponse = {
          error: "Unauthorized",
          message: "Authentication required",
          statusCode: 401,
        };
        return res.status(401).json(errorResponse);
      }
    }

    if (!snippetId) {
      const errorResponse: ErrorResponse = {
        error: "Bad Request",
        message: "Snippet ID is required",
        statusCode: 400,
      };
      return res.status(400).json(errorResponse);
    }

    // Get snippet details (fallback to in-memory if DB not available)
    let snippet = await findSnippetById(snippetId);
    if (!snippet && !pool) {
      const { codeSnippets } = await import("../database");
      snippet = codeSnippets.find((s: any) => s.id === snippetId) || null;
    }
    if (!snippet && !DEMO_MODE) {
      const errorResponse: ErrorResponse = {
        error: "Not Found",
        message: "Snippet not found",
        statusCode: 404,
      };
      return res.status(404).json(errorResponse);
    }

    // Get seller details (fallback to in-memory if DB not available)
    let seller = snippet ? await findUserById(snippet.authorId) : null;
    if (!seller && !pool) {
      const { users } = await import("../database");
      seller = users.find((u: any) => u.id === snippet!.authorId) || null;
    }
    // Only enforce seller account checks when database is available
    if (pool) {
      if (!seller) {
        const errorResponse: ErrorResponse = {
          error: "Not Found",
          message: "Seller not found",
          statusCode: 404,
        };
        return res.status(404).json(errorResponse);
      }
      if (!(seller as any).razorpay_account_id) {
        const errorResponse: ErrorResponse = {
          error: "Bad Request",
          message: "Seller has not configured payment account",
          statusCode: 400,
        };
        return res.status(400).json(errorResponse);
      }
    }

    // Prevent self-purchase
    if (snippet && user.id === snippet.authorId) {
      const errorResponse: ErrorResponse = {
        error: "Bad Request",
        message: "You cannot purchase your own snippet",
        statusCode: 400,
      };
      return res.status(400).json(errorResponse);
    }

    // Demo mode: return mock order without DB or Razorpay call
    if (DEMO_MODE) {
      const amount = Math.round((snippet?.price ?? 1) * 100);
      const orderId = `order_demo_${Date.now()}`;
      return res.json({
        orderId,
        amount,
        currency: "INR",
        key: process.env.RAZORPAY_KEY_ID || "rzp_test_DEMO",
        snippet: snippet
          ? {
              id: snippet.id,
              title: snippet.title,
              price: snippet.price,
              author: snippet.author,
            }
          : undefined,
        seller: seller
          ? { id: seller.id, username: (seller as any).username }
          : undefined,
        platform: { commission: Math.round(amount * PLATFORM_COMMISSION) / 100 },
        dbOrderId: null,
      });
    }

    // Real mode: create order with transfers
    const amount = Math.round(snippet!.price * 100);
    const commission = Math.round(amount * PLATFORM_COMMISSION);
    const sellerEarning = Math.round(amount * SELLER_COMMISSION);

    const baseOptions: any = {
      amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        buyer_id: user.id,
        seller_id: snippet!.authorId,
        snippet_id: snippetId,
        commission: commission.toString(),
        seller_earning: sellerEarning.toString(),
      },
    };

    const orderOptions = pool && seller && (seller as any).razorpay_account_id
      ? {
          ...baseOptions,
          transfers: [
            {
              account: (seller as any).razorpay_account_id,
              amount: sellerEarning,
              currency: "INR",
              notes: { purpose: "seller_payment", snippet_id: snippetId },
              linked_account_notes: [`Seller payment for snippet: ${snippet!.title}`],
            },
          ],
        }
      : baseOptions;

    const order = await razorpay.orders.create(orderOptions);

    let dbOrderId: number | null = null;
    if (pool) {
      const result = await pool!.query(
        `INSERT INTO orders (
          buyer_id, seller_id, snippet_id, amount, commission, seller_earning,
          razorpay_order_id, status, currency
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id`,
        [
          user.id,
          snippet!.authorId,
          snippetId,
          snippet!.price,
          commission / 100,
          sellerEarning / 100,
          order.id,
          "created",
          "INR",
        ],
      );
      dbOrderId = result.rows[0].id;
    }

    return res.json({
      orderId: order.id,
      amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
      snippet: {
        id: snippet!.id,
        title: snippet!.title,
        price: snippet!.price,
        author: snippet!.author,
      },
      seller: {
        id: (seller as any).id,
        username: (seller as any).username,
        earning: sellerEarning / 100,
      },
      platform: { commission: commission / 100 },
      dbOrderId,
    });
  } catch (error) {
    console.error("Create order error:", error);
    const errorResponse: ErrorResponse = {
      error: "Internal Server Error",
      message: "Failed to create order",
      statusCode: 500,
    };
    res.status(500).json(errorResponse);
  }
};

/**
 * POST /api/payments/verify-payment
 * Verify payment and update order status
 */
export const verifyPayment: RequestHandler = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    let user = (req as any).user;

    if (!user) {
      if (DEMO_MODE) {
        user = { id: "demo-user" };
      } else if (ALLOW_ANONYMOUS) {
        user = { id: "guest-user" };
      } else {
        const errorResponse: ErrorResponse = {
          error: "Unauthorized",
          message: "Authentication required",
          statusCode: 401,
        };
        return res.status(401).json(errorResponse);
      }
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      const errorResponse: ErrorResponse = {
        error: "Bad Request",
        message: "Missing payment verification data",
        statusCode: 400,
      };
      return res.status(400).json(errorResponse);
    }

    // Demo mode: accept any signature and skip DB
    if (DEMO_MODE) {
      return res.json({
        success: true,
        status: "success",
        message: "Payment verified (demo mode)",
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        payment: {
          id: razorpay_payment_id,
          order_id: razorpay_order_id,
          status: "captured",
        },
      });
    }

    // Verify signature
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generated_signature = hmac.digest("hex");

    if (generated_signature !== razorpay_signature) {
      const errorResponse: ErrorResponse = {
        error: "Bad Request",
        message: "Invalid payment signature",
        statusCode: 400,
      };
      return res.status(400).json(errorResponse);
    }

    // If database is not configured, skip DB lookup and consider verification successful
    if (!pool) {
      return res.json({
        success: true,
        message: "Payment verified successfully",
        order_id: razorpay_order_id,
        purchase_id: `purchase-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      });
    }

    // Get order from database
    const orderResult = await pool!.query(
      "SELECT * FROM orders WHERE razorpay_order_id = $1 AND buyer_id = $2",
      [razorpay_order_id, user.id],
    );

    if (orderResult.rows.length === 0) {
      const errorResponse: ErrorResponse = {
        error: "Not Found",
        message: "Order not found",
        statusCode: 404,
      };
      return res.status(404).json(errorResponse);
    }

    const order = orderResult.rows[0];

    await pool!.query(
      "UPDATE orders SET status = $1, razorpay_payment_id = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3",
      ["paid", razorpay_payment_id, order.id],
    );

    const purchaseId = `purchase-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    await pool!.query(
      "INSERT INTO purchases (id, user_id, snippet_id, price, order_id) VALUES ($1, $2, $3, $4, $5)",
      [purchaseId, user.id, order.snippet_id, order.amount, order.id],
    );

    // Update snippet download count
    await pool.query(
      "UPDATE snippets SET downloads = downloads + 1 WHERE id = $1",
      [order.snippet_id],
    );

    // Update seller's total downloads
    await pool.query(
      "UPDATE users SET total_downloads = total_downloads + 1 WHERE id = $1",
      [order.seller_id],
    );

    res.json({
      success: true,
      message: "Payment verified successfully",
      purchase_id: purchaseId,
      order_id: order.id,
    });
  } catch (error) {
    console.error("Verify payment error:", error);
    const errorResponse: ErrorResponse = {
      error: "Internal Server Error",
      message: "Failed to verify payment",
      statusCode: 500,
    };
    res.status(500).json(errorResponse);
  }
};

/**
 * POST /api/payments/webhook
 * Razorpay webhook handler for payment events
 */
export const handleWebhook: RequestHandler = async (req, res) => {
  try {
    const webhookSignature = req.headers["x-razorpay-signature"] as string;
    const webhookBody = JSON.stringify(req.body);

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(webhookBody)
      .digest("hex");

    if (webhookSignature !== expectedSignature) {
      console.error("Invalid webhook signature");
      return res.status(400).json({ error: "Invalid signature" });
    }

    const event = req.body;
    console.log("Webhook event:", event.event, event.payload);

    switch (event.event) {
      case "payment.captured":
        await handlePaymentCaptured(event.payload.payment.entity);
        break;
      case "payment.failed":
        await handlePaymentFailed(event.payload.payment.entity);
        break;
      case "transfer.processed":
        await handleTransferProcessed(event.payload.transfer.entity);
        break;
      case "transfer.failed":
        await handleTransferFailed(event.payload.transfer.entity);
        break;
      default:
        console.log("Unhandled webhook event:", event.event);
    }

    res.json({ status: "ok" });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ error: "Webhook processing failed" });
  }
};

/**
 * GET /api/payments/download/:snippetId
 * Secure file download endpoint - only for purchased snippets
 */
export const secureDownload: RequestHandler = async (req, res) => {
  try {
    const { snippetId } = req.params;
    const user = (req as any).user;

    if (!user) {
      const errorResponse: ErrorResponse = {
        error: "Unauthorized",
        message: "Authentication required",
        statusCode: 401,
      };
      return res.status(401).json(errorResponse);
    }

    // Check if user has purchased this snippet
    const purchaseResult = await pool.query(
      `SELECT p.*, o.status as order_status 
       FROM purchases p 
       LEFT JOIN orders o ON p.order_id = o.id
       WHERE p.user_id = $1 AND p.snippet_id = $2`,
      [user.id, snippetId],
    );

    if (purchaseResult.rows.length === 0) {
      const errorResponse: ErrorResponse = {
        error: "Forbidden",
        message: "You must purchase this snippet to download it",
        statusCode: 403,
      };
      return res.status(403).json(errorResponse);
    }

    const purchase = purchaseResult.rows[0];

    // Verify payment status
    if (purchase.order_status && purchase.order_status !== "paid") {
      const errorResponse: ErrorResponse = {
        error: "Forbidden",
        message: "Payment not completed for this snippet",
        statusCode: 403,
      };
      return res.status(403).json(errorResponse);
    }

    // Get snippet
    const snippet = await findSnippetById(snippetId);
    if (!snippet) {
      const errorResponse: ErrorResponse = {
        error: "Not Found",
        message: "Snippet not found",
        statusCode: 404,
      };
      return res.status(404).json(errorResponse);
    }

    // Return snippet content for download
    res.json({
      id: snippet.id,
      title: snippet.title,
      description: snippet.description,
      code: snippet.code,
      language: snippet.language,
      framework: snippet.framework,
      author: snippet.author,
      downloadedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Secure download error:", error);
    const errorResponse: ErrorResponse = {
      error: "Internal Server Error",
      message: "Failed to download snippet",
      statusCode: 500,
    };
    res.status(500).json(errorResponse);
  }
};

/**
 * GET /api/payments/orders
 * Get user's order history
 */
export const getUserOrders: RequestHandler = async (req, res) => {
  try {
    const user = (req as any).user;

    if (!user) {
      const errorResponse: ErrorResponse = {
        error: "Unauthorized",
        message: "Authentication required",
        statusCode: 401,
      };
      return res.status(401).json(errorResponse);
    }

    const result = await pool.query(
      `SELECT o.*, s.title as snippet_title, s.author_username
       FROM orders o
       LEFT JOIN snippets s ON o.snippet_id = s.id
       WHERE o.buyer_id = $1
       ORDER BY o.created_at DESC`,
      [user.id],
    );

    res.json({
      orders: result.rows.map((order) => ({
        id: order.id,
        amount: parseFloat(order.amount),
        commission: parseFloat(order.commission),
        seller_earning: parseFloat(order.seller_earning),
        status: order.status,
        currency: order.currency,
        created_at: order.created_at,
        snippet: {
          id: order.snippet_id,
          title: order.snippet_title,
          author: order.author_username,
        },
        razorpay_order_id: order.razorpay_order_id,
        razorpay_payment_id: order.razorpay_payment_id,
      })),
    });
  } catch (error) {
    console.error("Get user orders error:", error);
    const errorResponse: ErrorResponse = {
      error: "Internal Server Error",
      message: "Failed to get orders",
      statusCode: 500,
    };
    res.status(500).json(errorResponse);
  }
};

// Helper functions for webhook event handling
async function handlePaymentCaptured(payment: any) {
  try {
    await pool.query(
      "UPDATE orders SET status = $1 WHERE razorpay_order_id = $2",
      ["paid", payment.order_id],
    );
    console.log("Payment captured:", payment.id);
  } catch (error) {
    console.error("Error handling payment captured:", error);
  }
}

async function handlePaymentFailed(payment: any) {
  try {
    await pool.query(
      "UPDATE orders SET status = $1 WHERE razorpay_order_id = $2",
      ["failed", payment.order_id],
    );
    console.log("Payment failed:", payment.id);
  } catch (error) {
    console.error("Error handling payment failed:", error);
  }
}

async function handleTransferProcessed(transfer: any) {
  try {
    console.log("Transfer processed:", transfer.id, "Amount:", transfer.amount);
    // Additional transfer processing logic can be added here
  } catch (error) {
    console.error("Error handling transfer processed:", error);
  }
}

async function handleTransferFailed(transfer: any) {
  try {
    console.log("Transfer failed:", transfer.id, "Reason:", transfer.error);
    // Handle transfer failure logic
  } catch (error) {
    console.error("Error handling transfer failed:", error);
  }
}
