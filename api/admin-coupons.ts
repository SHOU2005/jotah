// Vercel Function: coupon management for /admin (see shared/coupon-api.ts). Header x-admin-key required.
import { adminCoupons } from "../shared/coupon-api.js";

const handle = async (request: Request) => {
  let body: unknown = null;
  if (request.method !== "GET") {
    try { body = await request.json(); } catch { return Response.json({ message: "Invalid request" }, { status: 400 }); }
  }
  const { status, body: out } = await adminCoupons(request.method, request.headers.get("x-admin-key"), body);
  return Response.json(out, { status, headers: { "cache-control": "no-store" } });
};

export const GET = handle;
export const POST = handle;
export const PATCH = handle;
