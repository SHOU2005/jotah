// Vercel Function: POST /api/coupon {coupon} → coupon rules for the checkout preview
import { checkCoupon } from "../shared/coupon-api.js";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "Invalid request" }, { status: 400 });
  }
  const { status, body: out } = await checkCoupon(body);
  return Response.json(out, { status, headers: { "cache-control": "no-store" } });
}
