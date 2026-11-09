// Server-only: coupon endpoints, shared by the Vercel Functions in /api and the Express server.
import { checkCouponInput, normalizeCode, type Coupon } from "./coupons.js";
import { createCoupon, getCoupon, hasCouponsDb, listCoupons, setCouponActive } from "./coupons-db.js";
import { isAdmin } from "./orders-db.js";

type Result = { status: number; body: unknown };

/**
 * Looks up the coupon code in an order input. No code → { coupon: null }.
 * Unknown/unavailable code → an error Result to send back as-is.
 */
export async function lookupCoupon(raw: unknown): Promise<{ coupon: Coupon | null } | { error: Result }> {
  const given = (raw as { coupon?: unknown } | null)?.coupon;
  if (given == null || String(given).trim() === "") return { coupon: null };
  const code = normalizeCode(given);
  if (!code || !hasCouponsDb()) return { error: { status: 400, body: { message: "Invalid coupon code" } } };
  try {
    const coupon = await getCoupon(code);
    if (!coupon) return { error: { status: 400, body: { message: "Invalid coupon code" } } };
    return { coupon };
  } catch (err) {
    console.error("COUPON LOOKUP FAILED", err);
    return { error: { status: 500, body: { message: "Could not check the coupon. Please try again." } } };
  }
}

/** POST /api/coupon {coupon} → the coupon's public rules, so checkout can preview the discount. */
export async function checkCoupon(raw: unknown): Promise<Result> {
  const found = await lookupCoupon(raw);
  if ("error" in found) return found.error;
  const c = found.coupon;
  if (!c) return { status: 400, body: { message: "Enter a coupon code" } };
  if (!c.active) return { status: 400, body: { message: "This coupon has expired" } };
  if (c.maxUses !== null && c.uses >= c.maxUses) return { status: 400, body: { message: "This coupon has been fully used" } };
  // Only what checkout needs to show the discount; the server re-checks at payment time.
  return { status: 200, body: { code: c.code, kind: c.kind, value: c.value, minOrder: c.minOrder, maxUses: c.maxUses, uses: c.uses, active: c.active } };
}

/**
 * /api/admin-coupons (header x-admin-key)
 *   GET               → all coupons
 *   POST  {code, kind, value, minOrder?, maxUses?} → create
 *   PATCH {code, active}                          → turn on/off
 */
export async function adminCoupons(method: string, adminKey: string | null | undefined, body: any): Promise<Result> {
  if (!isAdmin(adminKey)) return { status: 401, body: { message: "Wrong admin password" } };
  if (!hasCouponsDb()) return { status: 503, body: { message: "Database not connected yet" } };
  try {
    if (method === "GET") return { status: 200, body: await listCoupons() };
    if (method === "POST") {
      const input = checkCouponInput(body);
      if (!input.ok) return { status: 400, body: { message: input.message } };
      const created = await createCoupon(input.coupon);
      if (!created) return { status: 409, body: { message: `${input.coupon.code} already exists` } };
      return { status: 201, body: created };
    }
    if (method === "PATCH") {
      const code = normalizeCode(body?.code);
      if (!code || typeof body?.active !== "boolean") return { status: 400, body: { message: "Missing code or active" } };
      const updated = await setCouponActive(code, body.active);
      if (!updated) return { status: 404, body: { message: "Coupon not found" } };
      return { status: 200, body: updated };
    }
    return { status: 405, body: { message: "Method not allowed" } };
  } catch (err) {
    console.error("ADMIN COUPONS FAILED", err);
    return { status: 500, body: { message: "Something went wrong" } };
  }
}
