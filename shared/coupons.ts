// Coupon rules shared by checkout (preview) and the server (final price).
// The server always re-checks the coupon from the database before charging.

export type CouponKind = "percent" | "flat";

export interface Coupon {
  code: string;
  kind: CouponKind;
  /** Percent off (1–90) or flat rupees off. */
  value: number;
  /** Minimum items total (₹) for the coupon to apply. */
  minOrder: number;
  /** Max successful (paid) uses; null = unlimited. */
  maxUses: number | null;
  uses: number;
  active: boolean;
  createdAt?: string;
}

export const COUPON_LINE_ID = "coupon";

/** Uppercases and strips spaces; returns "" if the code is not 3–20 letters/numbers. */
export function normalizeCode(raw: unknown) {
  const code = String(raw ?? "").trim().toUpperCase().replace(/\s+/g, "");
  return /^[A-Z0-9]{3,20}$/.test(code) ? code : "";
}

export function couponLabel(c: Pick<Coupon, "kind" | "value" | "minOrder">) {
  const off = c.kind === "percent" ? `${c.value}% off` : `₹${c.value} off`;
  return c.minOrder > 0 ? `${off} on orders above ₹${c.minOrder}` : off;
}

/** Works out the discount (₹) on the items total, or why the coupon can't be used. */
export function couponDiscount(c: Coupon, itemsTotal: number): { ok: true; discount: number } | { ok: false; message: string } {
  if (!c.active) return { ok: false, message: "This coupon has expired" };
  if (c.maxUses !== null && c.uses >= c.maxUses) return { ok: false, message: "This coupon has been fully used" };
  if (itemsTotal < c.minOrder) return { ok: false, message: `Add items worth ₹${c.minOrder - itemsTotal} more to use this coupon` };
  const raw = c.kind === "percent" ? Math.floor((itemsTotal * c.value) / 100) : c.value;
  // Keep at least ₹1 to pay: Razorpay cannot take a ₹0 payment.
  const discount = Math.max(0, Math.min(raw, itemsTotal - 1));
  if (discount <= 0) return { ok: false, message: "This coupon doesn't apply to your cart" };
  return { ok: true, discount };
}

/** Validates a coupon definition from the admin form. */
export function checkCouponInput(raw: any): { ok: true; coupon: Omit<Coupon, "uses" | "active" | "createdAt"> } | { ok: false; message: string } {
  const code = normalizeCode(raw?.code);
  if (!code) return { ok: false, message: "Code must be 3–20 letters or numbers" };
  const kind: CouponKind = raw?.kind === "flat" ? "flat" : "percent";
  const value = Number(raw?.value);
  if (!Number.isInteger(value) || value < 1 || (kind === "percent" && value > 90) || (kind === "flat" && value > 5000)) {
    return { ok: false, message: kind === "percent" ? "Percent must be 1–90" : "Flat discount must be ₹1–5000" };
  }
  const minOrder = raw?.minOrder === "" || raw?.minOrder == null ? 0 : Number(raw.minOrder);
  if (!Number.isInteger(minOrder) || minOrder < 0) return { ok: false, message: "Minimum order must be a whole number" };
  const maxUses = raw?.maxUses === "" || raw?.maxUses == null ? null : Number(raw.maxUses);
  if (maxUses !== null && (!Number.isInteger(maxUses) || maxUses < 1)) return { ok: false, message: "Max uses must be 1 or more (or empty)" };
  return { ok: true, coupon: { code, kind, value, minOrder, maxUses } };
}
