export interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpayPrefill {
  name?: string;
  email?: string;
  contact?: string;
}

export interface RazorpayNotes {
  [key: string]: string | number | boolean | undefined;
}

export interface RazorpayThemeOptions {
  color?: string;
}

export interface RazorpayModalOptions {
  ondismiss?: () => void;
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency?: string;
  name?: string;
  description?: string;
  image?: string;
  order_id?: string;
  handler: (response: RazorpayPaymentResponse) => void;
  prefill?: RazorpayPrefill;
  notes?: RazorpayNotes;
  theme?: RazorpayThemeOptions;
  modal?: RazorpayModalOptions;
}

export interface RazorpayFailureResponse {
  error?: {
    code?: string;
    description?: string;
    source?: string;
    step?: string;
    reason?: string;
    metadata?: Record<string, unknown>;
  };
}

export interface RazorpayInstance {
  open: () => void;
  close: () => void;
  on?: (event: string, callback: (response: RazorpayFailureResponse) => void) => void;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}
