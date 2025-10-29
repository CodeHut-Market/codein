# Razorpay Payment Integration Setup Guide

This guide will help you set up the complete Razorpay payment integration for CodeHut with MySQL persistence.

## 📋 Prerequisites

- Node.js (v16 or higher)
- MySQL database server
- Razorpay account ([Create one here](https://razorpay.com/))
- PNPM package manager

## 🔑 Razorpay Account Setup

1. **Create Razorpay Account**
   - Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
   - Sign up or log in to your account

2. **Get API Keys**
   - Navigate to Settings → API Keys
   - Generate or copy your Key ID and Key Secret
   - For testing, use test mode keys

3. **Setup Webhook (Optional)**
   - Go to Settings → Webhooks
   - Add webhook URL: `https://yourdomain.com/api/payments/webhook`
   - Select events: `payment.captured`, `payment.failed`, `order.paid`
   - Generate and copy webhook secret

## 🗄️ Database Setup

### Option 1: Using the provided SQL schema

1. **Create MySQL Database**

   ```sql
   CREATE DATABASE codehut_db;
   ```

2. **Run Schema File**
   ```bash
   mysql -u root -p codehut_db < server/database/schema.sql
   ```

### Option 2: Automatic initialization (Recommended)

The application will automatically create tables when started if they don't exist.

## ⚙️ Environment Configuration

### 1. Backend Environment Variables

Create or update `.env` file in the root directory:

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_your_key_id_here
RAZORPAY_SECRET=your_razorpay_secret_here
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here

# MySQL Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=codehut_db

# Application Configuration
NODE_ENV=development
PORT=8080
JWT_SECRET=your_jwt_secret_here
```

### 2. Frontend Environment Variables

Create `client/.env` file:

```env
# Razorpay Configuration for Frontend
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id_here

# API Base URL (optional)
VITE_API_BASE_URL=http://localhost:8080
```

**⚠️ Important:**

- Use test keys for development (start with `rzp_test_`)
- Use live keys for production (start with `rzp_live_`)
- Never commit actual API keys to version control

## 📦 Installation

1. **Install Dependencies**

   ```bash
   # Install all dependencies
   pnpm install
   ```

2. **Verify Installation**
   ```bash
   # Check if razorpay and mysql2 are installed
   pnpm list razorpay mysql2
   ```

## 🚀 Running the Application

### 1. Start the Development Server

```bash
# Start both frontend and backend
pnpm dev
```

This will:

- Start the backend server on http://localhost:8080
- Start the frontend development server
- Automatically initialize database tables
- Display connection status in console

### 2. Verify Database Connection

Check the console output for:

```
✅ MySQL database connected successfully
✅ Database tables initialized successfully
🚀 Database initialized successfully
```

## 🧪 Testing the Payment Integration

### 1. Access the Test Page

Navigate to: http://localhost:8080/checkout

### 2. Test Payment Flow

1. **Select a Code Snippet**
   - Choose any sample snippet from the list
   - Optionally modify the amount for testing

2. **Fill User Details**
   - Update user ID, name, email, and contact
   - These will be pre-filled in Razorpay checkout

3. **Initiate Payment**
   - Click "Pay ₹{amount}" button
   - Razorpay checkout modal will open

### 3. Test Card Details

Use these test credentials in Razorpay checkout:

**Test Cards:**

- **Card Number:** 4111 1111 1111 1111
- **Expiry:** Any future date (e.g., 12/25)
- **CVV:** Any 3 digits (e.g., 123)
- **Cardholder Name:** Any name

**Test UPI:**

- **Success:** success@razorpay
- **Failure:** failure@razorpay

**Test Wallets:**

- Select any wallet and proceed

### 4. Verify Database Records

After successful payment, check your MySQL database:

```sql
-- Check orders table
SELECT * FROM orders ORDER BY created_at DESC LIMIT 5;

-- Check purchases table
SELECT * FROM purchases ORDER BY created_at DESC LIMIT 5;

-- Check payment details
SELECT o.*, p.*
FROM orders o
JOIN purchases p ON o.id = p.order_id
WHERE o.status = 'paid';
```

## 📊 API Endpoints

### 1. Create Order

```http
POST /api/payments/create-order
Content-Type: application/json

{
  "amount": 299,
  "currency": "INR",
  "userId": "user-123"
}
```

### 2. Verify Payment

```http
POST /api/payments/verify-payment
Content-Type: application/json

{
  "razorpay_order_id": "order_xyz",
  "razorpay_payment_id": "pay_abc",
  "razorpay_signature": "signature_def",
  "userId": "user-123"
}
```

### 3. Webhook Handler

```http
POST /api/payments/webhook
X-Razorpay-Signature: webhook_signature_here
Content-Type: application/json

{
  "event": "payment.captured",
  "payload": { ... }
}
```

## 🔧 Customization

### 1. Modify Payment Button

Edit `client/components/PaymentButton.tsx`:

- Change branding (name, logo, colors)
- Add custom validation
- Modify success/error handling

### 2. Customize Checkout Page

Edit `client/pages/CheckoutPage.tsx`:

- Add more product fields
- Implement discount codes
- Add purchase history features

### 3. Extend Database Schema

Edit `server/config/db.ts` or `server/database/schema.sql`:

- Add more order fields
- Create additional tables
- Add indexes for performance

## 🔒 Security Best Practices

1. **Environment Variables**
   - Never commit `.env` files
   - Use different keys for dev/staging/production
   - Rotate keys periodically

2. **Webhook Security**
   - Always verify webhook signatures
   - Use HTTPS for webhook URLs
   - Implement rate limiting

3. **Database Security**
   - Use connection pooling
   - Implement proper error handling
   - Sanitize user inputs

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check MySQL server is running
   - Verify credentials in `.env`
   - Ensure database exists

2. **Razorpay Script Not Loading**
   - Check internet connection
   - Verify CORS settings
   - Try refreshing the page

3. **Payment Signature Verification Failed**
   - Ensure correct webhook secret
   - Check order ID matches
   - Verify API key consistency

4. **Environment Variables Not Loading**
   - Restart development server
   - Check `.env` file location
   - Verify variable names

### Debug Mode

Enable detailed logging by setting:

```env
NODE_ENV=development
```

This will show:

- Database query logs
- Razorpay API responses
- Payment verification details

## 📚 Additional Resources

- [Razorpay API Documentation](https://razorpay.com/docs/api/)
- [Razorpay Checkout Documentation](https://razorpay.com/docs/checkout/)
- [MySQL2 Documentation](https://github.com/sidorares/node-mysql2)
- [Express.js Documentation](https://expressjs.com/)

## 🆘 Support

If you encounter issues:

1. Check the console logs for errors
2. Verify all environment variables are set
3. Test with Razorpay's test credentials
4. Review the database schema and connections
5. Check network connectivity for Razorpay scripts

For Razorpay-specific issues, contact [Razorpay Support](https://razorpay.com/support/).

---

**Congratulations! 🎉**

You now have a complete Razorpay payment integration with MySQL persistence. After clicking "Pay Now", you can complete a Razorpay checkout and see the order and payment details recorded in your MySQL database.

The integration includes:

- ✅ Order creation and tracking
- ✅ Payment verification and security
- ✅ Database persistence
- ✅ Webhook handling
- ✅ Error handling and validation
- ✅ Test environment setup
