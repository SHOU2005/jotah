// Server-only: emails the shop owner when an order comes in (Gmail SMTP + App Password).
// Env: GMAIL_USER, GMAIL_APP_PASSWORD, NOTIFY_EMAIL (defaults to GMAIL_USER).
import nodemailer from "nodemailer";
import { orderWhatsAppText, PAYMENT_LABEL, payNow, type Order } from "./products.js";

const user = () => process.env.GMAIL_USER || "";
const pass = () => (process.env.GMAIL_APP_PASSWORD || "").replace(/\s+/g, "");
const to = () => process.env.NOTIFY_EMAIL || user();
export const hasEmail = () => Boolean(user() && pass());

let transport: ReturnType<typeof nodemailer.createTransport> | null = null;
const mailer = () =>
  (transport ??= nodemailer.createTransport({ service: "gmail", auth: { user: user(), pass: pass() } }));

export type PaidState = "paid" | "advance" | "unpaid";

/**
 * Sends the "new order" email. Never throws: a mail failure must not break checkout.
 * Awaited by callers so it finishes before a serverless function freezes.
 */
export async function notifyNewOrder(order: Order, paid: PaidState, paymentId?: string) {
  if (!hasEmail()) {
    console.warn(`EMAIL NOT SENT for ${order.id}: GMAIL_USER / GMAIL_APP_PASSWORD not set`);
    return;
  }
  const now = payNow(order.payment, order.total);
  const status =
    paid === "paid" ? `PAID online ₹${order.total}` :
    paid === "advance" ? `COD — ₹${now} advance paid, collect ₹${order.total - now} cash` :
    `${PAYMENT_LABEL[order.payment]} — collect ₹${order.total}`;
  const subject = `🛒 New order ${order.id} · ₹${order.total} · ${status}`;
  const text = [
    orderWhatsAppText(order),
    "",
    `Payment: ${status}`,
    paymentId ? `Razorpay payment: ${paymentId}` : "",
    "",
    "Manage orders: https://jotah.in/admin",
  ].filter((l, i, a) => !(l === "" && a[i - 1] === "")).join("\n");

  try {
    await Promise.race([
      mailer().sendMail({ from: `Jotah Orders <${user()}>`, to: to(), subject, text }),
      new Promise((_, reject) => setTimeout(() => reject(new Error("email timeout")), 8000)),
    ]);
    console.log(`EMAIL SENT for ${order.id} → ${to()}`);
  } catch (err) {
    console.error(`EMAIL FAILED for ${order.id}`, err);
  }
}
