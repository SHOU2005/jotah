// Server-only: Razorpay Standard Checkout. Used by the Vercel Functions in /api
// and the local Express server. Never import this from client code — it reads
// RAZORPAY_KEY_SECRET.
import Razorpay from "razorpay";
import { createHmac, timingSafeEqual } from "node:crypto";
import { buildOrder, orderWhatsAppText } from "./products.js";
import { hasDatabase, saveOrder, updateOrder } from "./orders-db.js";

const MIN_AMOUNT_PAISE = 100; // Razorpay minimum: ₹1
const CURRENCY = "INR";

type Result = { status: number; body: Record<string, unknown> };

const keyId = () => process.env.RAZORPAY_KEY_ID || "";
const keySecret = () => process.env.RAZORPAY_KEY_SECRET || "";
export const hasRazorpay = () => Boolean(keyId() && keySecret());

let client: Razorpay | null = null;
const rzp = () => (client ??= new Razorpay({ key_id: keyId(), key_secret: keySecret() }));

/** Maps a Razorpay SDK error to an HTTP result (401 for bad keys, 500 otherwise). */
function rzpError(err: any, what: string): Result {
  const status = err?.statusCode === 401 ? 401 : 500;
  console.error(`RAZORPAY ${what} FAILED`, err?.statusCode, err?.error ?? err);
  return {
    status,
    body: { message: status === 401 ? "Payment gateway authentication failed" : "Payment gateway error. Please try again." },
  };
}

/**
 * POST /api/create-order — body is the same order input as /api/orders.
 * Prices the order on the server, creates the Razorpay order (receipt = our
 * order id), saves our order as unpaid, and returns what the checkout modal needs.
 */
export async function createPaymentOrder(raw: unknown): Promise<Result> {
  if (!hasRazorpay()) return { status: 503, body: { message: "Online payment is not set up yet" } };

  const result = buildOrder({ ...(raw as object), payment: "online" });
  if (!result.ok) return { status: 400, body: { message: result.message } };
  const order = result.order;

  const amount = order.total * 100; // rupees → paise
  if (!Number.isInteger(amount) || amount < MIN_AMOUNT_PAISE) {
    return { status: 400, body: { message: "Order amount must be at least ₹1" } };
  }

  let rzpOrder;
  try {
    rzpOrder = await rzp().orders.create({ amount, currency: CURRENCY, receipt: order.id, notes: { jotah_order_id: order.id } });
  } catch (err) {
    return rzpError(err, "CREATE ORDER");
  }

  console.log(`NEW ORDER ${order.id} (awaiting online payment, ${rzpOrder.id})\n${orderWhatsAppText(order)}`);
  if (hasDatabase()) {
    try {
      await saveOrder(order);
    } catch (err) {
      console.error(`DB SAVE FAILED for ${order.id}`, err);
    }
  }

  return {
    status: 201,
    body: { order_id: rzpOrder.id, amount: rzpOrder.amount, currency: rzpOrder.currency, key_id: keyId(), order },
  };
}

/**
 * POST /api/verify-payment {razorpay_order_id, razorpay_payment_id, razorpay_signature}
 * Checks HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET) and only then marks
 * our order (looked up from the Razorpay order's receipt) as paid.
 */
export async function verifyPayment(raw: unknown): Promise<Result> {
  if (!hasRazorpay()) return { status: 503, body: { message: "Online payment is not set up yet" } };

  const b = (raw ?? {}) as Record<string, unknown>;
  const orderId = typeof b.razorpay_order_id === "string" ? b.razorpay_order_id : "";
  const paymentId = typeof b.razorpay_payment_id === "string" ? b.razorpay_payment_id : "";
  const signature = typeof b.razorpay_signature === "string" ? b.razorpay_signature : "";
  if (!orderId || !paymentId || !signature) return { status: 400, body: { message: "Missing payment details" } };

  const expected = createHmac("sha256", keySecret()).update(`${orderId}|${paymentId}`).digest("hex");
  const a = Buffer.from(expected);
  const s = Buffer.from(signature);
  if (a.length !== s.length || !timingSafeEqual(a, s)) {
    console.warn(`RAZORPAY SIGNATURE MISMATCH order=${orderId} payment=${paymentId}`);
    return { status: 400, body: { verified: false, message: "Payment could not be verified" } };
  }

  // Signature is genuine. Find which Jotah order this payment belongs to via the
  // receipt we set server-side (never trust an order id sent by the browser).
  let receipt = "";
  try {
    receipt = String((await rzp().orders.fetch(orderId)).receipt ?? "");
  } catch (err) {
    console.error(`RAZORPAY FETCH ORDER FAILED ${orderId} (payment ${paymentId} is verified)`, err);
  }

  console.log(`PAYMENT VERIFIED ${receipt || "?"} · ${orderId} · ${paymentId}`);
  if (receipt && hasDatabase()) {
    try {
      await updateOrder(receipt, { paymentStatus: "paid" });
    } catch (err) {
      console.error(`DB PAID UPDATE FAILED for ${receipt}`, err);
    }
  }
  return { status: 200, body: { verified: true, orderId: receipt, paymentId } };
}
