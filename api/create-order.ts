// Vercel Function: POST /api/create-order → Razorpay order for online payment
import { createPaymentOrder } from "../shared/razorpay.js";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "Invalid request" }, { status: 400 });
  }
  const { status, body: out } = await createPaymentOrder(body);
  return Response.json(out, { status });
}
