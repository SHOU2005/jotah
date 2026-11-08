// Vercel Function: admin order management.
// GET  /api/admin            → list orders
// PATCH /api/admin {id, status?, paymentStatus?, adminNote?} → update one order
// Requires header  x-admin-key: <ADMIN_KEY>
import { hasDatabase, isAdmin, listOrders, updateOrder } from "../shared/orders-db.js";

const deny = () => Response.json({ message: "Wrong admin password" }, { status: 401 });
const noDb = () => Response.json({ message: "Database not connected yet" }, { status: 503 });
const headers = { "cache-control": "no-store" };

export async function GET(request: Request) {
  if (!isAdmin(request.headers.get("x-admin-key"))) return deny();
  if (!hasDatabase()) return noDb();
  return Response.json(await listOrders(), { headers });
}

export async function PATCH(request: Request) {
  if (!isAdmin(request.headers.get("x-admin-key"))) return deny();
  if (!hasDatabase()) return noDb();
  let body: any;
  try { body = await request.json(); } catch { return Response.json({ message: "Invalid request" }, { status: 400 }); }
  if (typeof body?.id !== "string") return Response.json({ message: "Missing order id" }, { status: 400 });
  try {
    const updated = await updateOrder(body.id, { status: body.status, paymentStatus: body.paymentStatus, adminNote: body.adminNote });
    if (!updated) return Response.json({ message: "Order not found" }, { status: 404 });
    return Response.json(updated, { headers });
  } catch (err) {
    return Response.json({ message: err instanceof Error ? err.message : "Update failed" }, { status: 400 });
  }
}
