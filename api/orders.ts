// Vercel Function: POST /api/orders → UPI-on-delivery orders (COD/online go via /api/create-order)
import { placeDeliveryOrder } from "../shared/razorpay.js";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "Invalid request" }, { status: 400 });
  }
  const { status, body: out } = await placeDeliveryOrder(body);
  return Response.json(out, { status });
}
