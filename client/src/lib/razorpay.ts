// Client-side Razorpay Standard Checkout. Only the public key id ever reaches the
// browser (returned by /api/create-order); the secret stays on the server.
import type { Order, OrderInput } from "@shared/products";

const SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

export interface PaymentOrder {
  order_id: string;
  amount: number;
  currency: string;
  key_id: string;
  order: Order;
}

export interface PaymentSuccess {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open(): void;
      on(event: "payment.failed", cb: (res: { error: { description?: string; reason?: string } }) => void): void;
    };
  }
}

let loading: Promise<void> | null = null;
/** Loads checkout.js once, on demand (only when someone actually pays online). */
export function loadRazorpay(): Promise<void> {
  if (window.Razorpay) return Promise.resolve();
  loading ??= new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = SCRIPT_SRC;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => {
      loading = null;
      s.remove();
      reject(new Error("Could not load the payment window. Check your connection and try again."));
    };
    document.body.appendChild(s);
  });
  return loading;
}

async function post<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Something went wrong. Please try again.");
  return data as T;
}

export const createPaymentOrder = (input: OrderInput) => post<PaymentOrder>("/api/create-order", input);
export const verifyPayment = (p: PaymentSuccess) => post<{ verified: boolean; orderId: string }>("/api/verify-payment", p);

/**
 * Opens the Razorpay modal. Resolves with the signed payment details on success;
 * rejects with `cancelled: true` if the buyer closes it. Failed attempts are
 * reported through onFailed while the modal stays open for a retry.
 */
export function openCheckout(po: PaymentOrder, onFailed: (message: string) => void): Promise<PaymentSuccess> {
  return new Promise((resolve, reject) => {
    if (!window.Razorpay) return reject(new Error("Payment window not loaded"));
    const { customer } = po.order;
    const rzp = new window.Razorpay({
      key: po.key_id,
      amount: po.amount,
      currency: po.currency,
      order_id: po.order_id,
      name: "Jotah",
      description: `Order ${po.order.id}`,
      prefill: { name: customer.name, contact: customer.phone.replace(/\D/g, "").slice(-10) },
      notes: { jotah_order_id: po.order.id },
      theme: { color: "#16120E" },
      handler: (res: PaymentSuccess) => resolve(res),
      modal: { ondismiss: () => reject(Object.assign(new Error("Payment cancelled"), { cancelled: true })) },
    });
    rzp.on("payment.failed", (res) => onFailed(res.error.description || "Payment failed. Please try another method."));
    rzp.open();
  });
}
