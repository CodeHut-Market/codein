'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from "../components/ui/button";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PricingPage() {
  const [loading, setLoading] = useState(false);

  const handlePayment = async (amount: number) => {
    setLoading(true);

    try {
      const res = await fetch('/api/razorpay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });

      const order = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'CodeHut',
        description: 'Test Transaction',
        order_id: order.id,
        handler: async function (response: any) {
          alert('Payment successful!');
          // You can handle the successful payment here
          // e.g., save the transaction details to your database
        },
        prefill: {
          name: 'Your Name',
          email: 'your.email@example.com',
          contact: '9999999999',
        },
        notes: {
          address: 'Your Address',
        },
        theme: {
          color: '#3399cc',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-6 py-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-6">Pricing Plans</h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-12">
            Choose the perfect plan for your needs.
          </p>
          
          <div className="mt-16">
            <Button size="lg" onClick={() => handlePayment(10)} disabled={loading}>
              {loading ? 'Processing...' : 'Buy for $10'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
