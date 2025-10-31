# Razorpay Live Payment Integration - Complete Setup Guide

## 📋 Prerequisites

- [x] Razorpay account activated
- [ ] Node.js installed (v14 or higher)
- [ ] Domain with HTTPS/SSL certificate
- [ ] Basic knowledge of Node.js and Express

---

## 🚀 Step 1: Backend Setup

### 1.1 Create Backend Project

```bash
# Create a new directory
mkdir codehut-payment-backend
cd codehut-payment-backend

# Initialize npm
npm init -y

# Install dependencies
npm install express razorpay cors dotenv
npm install --save-dev nodemon
```

### 1.2 Create Project Structure

```
codehut-payment-backend/
├── server.js          # Main server file
├── .env              # Environment variables (DON'T commit to Git!)
├── .env.example      # Example env file (safe to commit)
├── .gitignore        # Git ignore file
├── package.json      # Dependencies
└── README.md         # Documentation
```

### 1.3 Create .gitignore File

```
node_modules/
.env
*.log
.DS_Store
```

### 1.4 Setup Environment Variables

1. Copy the `.env.example` file I provided
2. Rename it to `.env`
3. Fill in your actual credentials:

```bash
# Get these from Razorpay Dashboard
RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXX
RAZORPAY_KEY_SECRET=YOUR_LIVE_SECRET_KEY
RAZORPAY_WEBHOOK_SECRET=YOUR_WEBHOOK_SECRET
PORT=3000
NODE_ENV=production
```

---

## 🔑 Step 2: Get Razorpay Credentials

### 2.1 Get Live API Keys

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Switch to **Live Mode** (toggle at top right)
3. Navigate to **Settings** → **API Keys**
4. Click **Generate Live Keys**
5. Copy:
   - **Key ID** (starts with `rzp_live_`)
   - **Key Secret** (keep this SECRET!)

### 2.2 Setup Webhook

1. In Razorpay Dashboard, go to **Settings** → **Webhooks**
2. Click **Add New Webhook**
3. Enter your webhook URL: `https://your-backend-domain.com/api/webhook`
4. Select events to subscribe to:
   - ✅ payment.captured
   - ✅ payment.failed
   - ✅ order.paid
   - ✅ refund.created
5. Click **Create Webhook**
6. Copy the **Webhook Secret** generated
7. Add it to your `.env` file

---

## 🌐 Step 3: Deploy Backend

### Option A: Deploy to Render (Free)

1. Create account on [Render.com](https://render.com)
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Name**: codehut-payment-backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add Environment Variables in Render dashboard:
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
   - `RAZORPAY_WEBHOOK_SECRET`
6. Click **Create Web Service**
7. Copy your deployment URL (e.g., `https://your-app.onrender.com`)

### Option B: Deploy to Railway

1. Create account on [Railway.app](https://railway.app)
2. Click **New Project** → **Deploy from GitHub**
3. Select your repository
4. Add environment variables
5. Deploy and get your URL

### Option C: Deploy to Vercel (Serverless)

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow prompts
4. Add environment variables in Vercel dashboard

---

## 🎨 Step 4: Update Frontend

### 4.1 Add Razorpay Script to HTML

```html
<!-- Add before closing </body> tag -->
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

### 4.2 Update Backend URL

In your frontend code, update the `BACKEND_URL`:

```javascript
const BACKEND_URL = 'https://your-backend-domain.com'; // Your actual backend URL
```

### 4.3 Update Buy Button

```html
<button id="buy-now-btn" class="buy-button">
  Buy Now - ₹1
</button>
```

```javascript
// Add event listener
document.getElementById('buy-now-btn').addEventListener('click', function() {
  const itemDetails = {
    id: 'snippet_123',
    name: 'Code Snippet',
    amount: 1, // Amount in INR
    customerEmail: 'user@example.com'
  };
  
  initiatePayment(itemDetails.amount, itemDetails);
});
```

---

## 🔒 Step 5: Security Best Practices

### ✅ DO's

- ✅ Always verify payments on the backend
- ✅ Use environment variables for sensitive data
- ✅ Implement webhook signature verification
- ✅ Use HTTPS for all communications
- ✅ Log all payment transactions
- ✅ Validate all input data
- ✅ Keep API secrets on backend only

### ❌ DON'Ts

- ❌ Never expose Key Secret in frontend code
- ❌ Never commit .env file to Git
- ❌ Never trust frontend payment verification alone
- ❌ Never skip webhook signature verification
- ❌ Never log sensitive payment details

---

## 🧪 Step 6: Testing

### 6.1 Test in Live Mode

1. Start with small amount (₹1 or ₹10)
2. Use your actual card/UPI
3. Verify payment appears in Razorpay Dashboard
4. Check webhook logs in your backend

### 6.2 Test Webhooks

1. In Razorpay Dashboard → Webhooks → Click your webhook
2. Go to **Logs** tab
3. Check if events are being received
4. Click **Resend** to retry failed webhooks

### 6.3 Monitor Transactions

- Check **Transactions** page in Razorpay Dashboard
- Verify payment status
- Check settlement schedule

---

## 📊 Step 7: Update Razorpay Webhook URL

After deploying your backend, update the webhook URL:

1. Go to Razorpay Dashboard → Settings → Webhooks
2. Edit your webhook
3. Update URL to: `https://your-actual-backend-url.com/api/webhook`
4. Save changes

---

## 🐛 Troubleshooting

### Issue: Payments not working

**Check:**
- [ ] Using Live API keys (not test keys)
- [ ] Backend is deployed and running
- [ ] CORS is configured correctly
- [ ] HTTPS is enabled on your domain
- [ ] Webhook URL is accessible

### Issue: Webhook not receiving events

**Check:**
- [ ] Webhook URL is correct and publicly accessible
- [ ] Webhook secret is correct in .env
- [ ] Signature verification is implemented
- [ ] Check webhook logs in Razorpay Dashboard

### Issue: Payment verification failing

**Check:**
- [ ] Signature verification logic is correct
- [ ] Using correct Key Secret
- [ ] Request body is not modified before verification

---

## 📝 Important Notes

1. **Test thoroughly** before going live with real customers
2. **Monitor your dashboard** regularly for failed payments
3. **Set up notifications** for payment events
4. **Implement proper error handling** in production
5. **Keep logs** for audit and debugging
6. **Review settlement** schedule and bank account details

---

## 🎉 You're All Set!

Your payment integration is now secure and ready for production!

### Next Steps:

1. Test with a real transaction
2. Monitor webhook events
3. Implement order management
4. Add email notifications
5. Generate invoices for customers

### Support:

- **Razorpay Docs**: https://razorpay.com/docs/
- **Support**: https://razorpay.com/support/

---

## 🔗 Quick Links

- Backend Code: `server.js`
- Frontend Code: `frontend-payment.js`
- Environment Setup: `.env.example`
- Dependencies: `package.json`

Happy Coding! 🚀