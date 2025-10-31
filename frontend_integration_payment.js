// frontend-payment.js - Secure Frontend Integration

const BACKEND_URL = 'https://your-backend-url.com'; // Replace with your backend URL

// ============================================
// INITIALIZE PAYMENT
// ============================================
async function initiatePayment(amount, itemDetails) {
  try {
    // Show loading state
    showLoadingState(true);

    // Step 1: Create order on backend
    const orderResponse = await fetch(`${BACKEND_URL}/api/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount,
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
        notes: {
          item_name: itemDetails.name,
          item_id: itemDetails.id,
          user_id: itemDetails.userId
        }
      })
    });

    const orderData = await orderResponse.json();

    if (!orderData.success) {
      throw new Error(orderData.error || 'Failed to create order');
    }

    // Step 2: Initialize Razorpay checkout
    const options = {
      key: orderData.key_id, // Public key from backend
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'CodeHut',
      description: itemDetails.description || 'Purchase from CodeHut',
      order_id: orderData.order_id,
      
      // Customer details (pre-fill if available)
      prefill: {
        name: itemDetails.customerName || '',
        email: itemDetails.customerEmail || '',
        contact: itemDetails.customerPhone || ''
      },

      // Theme customization
      theme: {
        color: '#3399cc'
      },

      // Success handler
      handler: async function (response) {
        await handlePaymentSuccess(response, itemDetails);
      },

      // Modal options
      modal: {
        ondismiss: function() {
          showLoadingState(false);
          console.log('Payment cancelled by user');
        }
      }
    };

    // Create Razorpay instance and open checkout
    const razorpayInstance = new Razorpay(options);
    razorpayInstance.open();

    // Hide loading after modal opens
    showLoadingState(false);

  } catch (error) {
    console.error('Payment initiation error:', error);
    showLoadingState(false);
    showError('Failed to initiate payment. Please try again.');
  }
}

// ============================================
// HANDLE PAYMENT SUCCESS
// ============================================
async function handlePaymentSuccess(response, itemDetails) {
  try {
    showLoadingState(true, 'Verifying payment...');

    // Send payment details to backend for verification
    const verifyResponse = await fetch(`${BACKEND_URL}/api/verify-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
        item_details: itemDetails // Additional context
      })
    });

    const verifyData = await verifyResponse.json();

    if (verifyData.success) {
      // Payment verified successfully
      showSuccess('Payment successful! Thank you for your purchase.');
      
      // Redirect or unlock content
      onPaymentVerified(verifyData, itemDetails);
    } else {
      throw new Error(verifyData.error || 'Payment verification failed');
    }

  } catch (error) {
    console.error('Payment verification error:', error);
    showError('Payment verification failed. Please contact support with your payment ID: ' + response.razorpay_payment_id);
  } finally {
    showLoadingState(false);
  }
}

// ============================================
// POST-PAYMENT SUCCESS ACTIONS
// ============================================
function onPaymentVerified(verifyData, itemDetails) {
  // Update UI
  console.log('Payment verified:', verifyData);
  
  // Store payment info locally (optional)
  localStorage.setItem('last_payment', JSON.stringify({
    payment_id: verifyData.payment_id,
    order_id: verifyData.order_id,
    timestamp: Date.now()
  }));

  // Redirect to success page or unlock content
  setTimeout(() => {
    // Example: Redirect to download page
    window.location.href = `/success?payment_id=${verifyData.payment_id}`;
    
    // Or unlock content directly
    // unlockContent(itemDetails.id);
  }, 2000);
}

// ============================================
// UI HELPER FUNCTIONS
// ============================================
function showLoadingState(show, message = 'Processing...') {
  const loader = document.getElementById('payment-loader');
  if (loader) {
    loader.style.display = show ? 'block' : 'none';
    loader.textContent = message;
  }
}

function showSuccess(message) {
  // Implement your success notification
  alert(message); // Replace with better UI
}

function showError(message) {
  // Implement your error notification
  alert('Error: ' + message); // Replace with better UI
}

// ============================================
// EXAMPLE USAGE
// ============================================

// Buy Now button click handler
document.getElementById('buy-now-btn')?.addEventListener('click', function() {
  const itemDetails = {
    id: 'snippet_123',
    name: 'Seg7 Display System',
    description: '7 Segment Display Code',
    amount: 1, // Amount in INR
    userId: 'user_123',
    customerName: 'Nikshey Yadav',
    customerEmail: 'user@example.com',
    customerPhone: '+918595428608'
  };

  initiatePayment(itemDetails.amount, itemDetails);
});

// ============================================
// PAYMENT BUTTON INTEGRATION (Alternative)
// ============================================
// If you're using Razorpay Payment Button instead of custom checkout:

async function initializePaymentButton() {
  try {
    // Fetch configuration from backend
    const response = await fetch(`${BACKEND_URL}/api/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 1, currency: 'INR' })
    });

    const data = await response.json();

    // Configure payment button
    const script = document.createElement('form');
    script.innerHTML = `
      <script
        src="https://checkout.razorpay.com/v1/payment-button.js"
        data-payment_button_id="YOUR_BUTTON_ID"
        data-button_theme="brand-color"
        async
      ></script>
    `;
    
    document.getElementById('payment-button-container').appendChild(script);

  } catch (error) {
    console.error('Payment button initialization error:', error);
  }
}

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initiatePayment,
    handlePaymentSuccess
  };
}