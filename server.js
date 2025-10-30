// server.js - Node.js + Express Backend for Razorpay
const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// ============================================
// 1. CREATE ORDER ENDPOINT
// ============================================
app.post('/api/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt, notes } = req.body;

    // Validate amount
    if (!amount || amount < 1) {
      return res.status(400).json({ 
        error: 'Invalid amount' 
      });
    }

    // Create order
    const options = {
      amount: amount * 100, // Convert to paise
      currency: currency,
      receipt: receipt || `receipt_${Date.now()}`,
      notes: notes || {}
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.RAZORPAY_KEY_ID // Send only public key
    });

  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ 
      error: 'Failed to create order',
      message: error.message 
    });
  }
});

// ============================================
// 2. VERIFY PAYMENT ENDPOINT
// ============================================
app.post('/api/verify-payment', (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    // Verify all required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        error: 'Missing required payment details'
      });
    }

    // Create signature verification string
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    
    // Generate expected signature
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    // Compare signatures
    if (razorpay_signature === expectedSign) {
      // Payment is verified
      // Here you can:
      // 1. Update database with payment status
      // 2. Send confirmation email
      // 3. Unlock content/features for user
      // 4. Generate invoice

      res.json({
        success: true,
        message: 'Payment verified successfully',
        payment_id: razorpay_payment_id,
        order_id: razorpay_order_id
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Invalid signature - Payment verification failed'
      });
    }

  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Payment verification failed',
      message: error.message
    });
  }
});

// ============================================
// 3. WEBHOOK HANDLER
// ============================================
app.post('/api/webhook', (req, res) => {
  try {
    const webhookSignature = req.headers['x-razorpay-signature'];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSignature) {
      return res.status(400).json({ error: 'Missing webhook signature' });
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (webhookSignature !== expectedSignature) {
      return res.status(400).json({ error: 'Invalid webhook signature' });
    }

    // Process webhook event
    const event = req.body.event;
    const payload = req.body.payload;

    console.log('Webhook Event:', event);

    // Handle different webhook events
    switch (event) {
      case 'payment.captured':
        handlePaymentCaptured(payload.payment.entity);
        break;

      case 'payment.failed':
        handlePaymentFailed(payload.payment.entity);
        break;

      case 'order.paid':
        handleOrderPaid(payload.order.entity);
        break;

      case 'refund.created':
        handleRefundCreated(payload.refund.entity);
        break;

      default:
        console.log('Unhandled webhook event:', event);
    }

    res.json({ success: true });

  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// ============================================
// WEBHOOK EVENT HANDLERS
// ============================================
function handlePaymentCaptured(payment) {
  console.log('Payment Captured:', payment.id);
  // Update database: mark order as paid
  // Send confirmation email to customer
  // Update inventory
  // Grant access to purchased content
}

function handlePaymentFailed(payment) {
  console.log('Payment Failed:', payment.id);
  // Update database: mark payment as failed
  // Send failure notification
  // Log for analysis
}

function handleOrderPaid(order) {
  console.log('Order Paid:', order.id);
  // Complete order processing
  // Generate invoice
  // Update order status
}

function handleRefundCreated(refund) {
  console.log('Refund Created:', refund.id);
  // Update database: mark refund
  // Send refund confirmation email
  // Update inventory if applicable
}

// ============================================
// 4. FETCH PAYMENT DETAILS (Optional)
// ============================================
app.get('/api/payment/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params;
    
    const payment = await razorpay.payments.fetch(paymentId);
    
    res.json({
      success: true,
      payment: {
        id: payment.id,
        amount: payment.amount / 100,
        currency: payment.currency,
        status: payment.status,
        method: payment.method,
        email: payment.email,
        contact: payment.contact,
        created_at: payment.created_at
      }
    });

  } catch (error) {
    console.error('Fetch payment error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch payment details' 
    });
  }
});

// ============================================
// 5. REFUND PAYMENT (Optional)
// ============================================
app.post('/api/refund', async (req, res) => {
  try {
    const { payment_id, amount } = req.body;

    if (!payment_id) {
      return res.status(400).json({ error: 'Payment ID required' });
    }

    const refund = await razorpay.payments.refund(payment_id, {
      amount: amount ? amount * 100 : undefined, // Partial or full refund
      speed: 'normal'
    });

    res.json({
      success: true,
      refund_id: refund.id,
      status: refund.status
    });

  } catch (error) {
    console.error('Refund error:', error);
    res.status(500).json({ 
      error: 'Refund failed',
      message: error.message 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Webhook URL: http://your-domain.com/api/webhook`);
});

module.exports = app;