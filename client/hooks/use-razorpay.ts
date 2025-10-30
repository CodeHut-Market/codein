import { useCallback } from "react";

const RAZORPAY_SCRIPT_ID = "razorpay-checkout-js";
const RAZORPAY_SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

async function loadScript(): Promise<boolean> {
  if (typeof window === "undefined") {
    return false;
  }

  if (window.Razorpay) {
    return true;
  }

  const existingScript = document.getElementById(RAZORPAY_SCRIPT_ID) as HTMLScriptElement | null;
  if (existingScript) {
    if ((existingScript as any).__razorpayReady) {
      return !!window.Razorpay;
    }

    return new Promise<boolean>((resolve) => {
      existingScript.addEventListener(
        "load",
        () => {
          (existingScript as any).__razorpayReady = true;
          resolve(!!window.Razorpay);
        },
        { once: true }
      );
      existingScript.addEventListener(
        "error",
        () => resolve(false),
        { once: true }
      );
    });
  }

  return new Promise<boolean>((resolve) => {
    const script = document.createElement("script");
    script.id = RAZORPAY_SCRIPT_ID;
    script.src = RAZORPAY_SCRIPT_SRC;
    script.async = true;
    script.onload = () => {
      (script as any).__razorpayReady = true;
      resolve(!!window.Razorpay);
    };
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function useRazorpay() {
  const ensureRazorpay = useCallback(async () => {
    const loaded = await loadScript();
    return loaded && typeof window !== "undefined" && !!window.Razorpay;
  }, []);

  return { ensureRazorpay };
}
