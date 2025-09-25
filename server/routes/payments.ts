import express from "express";
import { authenticateToken } from "../utils/auth";
import {
  createRouteOrder,
  verifyPayment,
  handleWebhook,
  secureDownload,
  getUserOrders,
} from "./razorpay-routes";

const router = express.Router();

// Enable demo mode (no auth) when keys or DB are not configured
const DEMO_MODE =
  !process.env.RAZORPAY_KEY_ID ||
  !process.env.RAZORPAY_KEY_SECRET ||
  !process.env.DATABASE_URL;
const noAuth: any = (_req: any, _res: any, next: any) => next();
const requireAuth = DEMO_MODE ? noAuth : authenticateToken;

// Create order with Route transfers (90% seller, 10% platform)
router.post("/create-order", requireAuth as any, createRouteOrder);

// Verify payment after successful payment
router.post("/verify-payment", requireAuth as any, verifyPayment);

// Razorpay webhook handler
router.post("/webhook", handleWebhook);

// Secure download endpoint for purchased snippets
router.get("/download/:snippetId", requireAuth as any, secureDownload);

// Get user's order history
router.get("/orders", requireAuth as any, getUserOrders);

// Legacy endpoints for backward compatibility
router.post("/purchase", requireAuth as any, createRouteOrder);

export default router;
