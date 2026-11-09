// Vercel Function: POST /api/verify-payment → checks the Razorpay signature, marks order paid
import { verifyPayment } from "../shared/razorpay.js";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "Invalid request" }, { status: 400 });
  }
  const { status, body: out } = await verifyPayment(body);
  return Response.json(out, { status });
}
