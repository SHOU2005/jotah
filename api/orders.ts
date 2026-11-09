// Vercel Function: POST /api/orders — retired (UPI on delivery removed); orders go via /api/create-order
import { ORDERS_RETIRED } from "../shared/razorpay.js";

export async function POST() {
  return Response.json(ORDERS_RETIRED.body, { status: ORDERS_RETIRED.status });
}
