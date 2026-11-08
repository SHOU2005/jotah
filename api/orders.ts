// Vercel Function: POST /api/orders
import { buildOrder, orderWhatsAppText } from "../shared/products.js";
import { hasDatabase, saveOrder } from "../shared/orders-db.js";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "Invalid request" }, { status: 400 });
  }
  const result = buildOrder(body);
  if (!result.ok) return Response.json({ message: result.message }, { status: 400 });
  const order = result.order;

  // Always log (backup), then save to the database.
  console.log(`NEW ORDER ${order.id}\n${orderWhatsAppText(order)}`);
  if (hasDatabase()) {
    try {
      await saveOrder(order);
    } catch (err) {
      console.error(`DB SAVE FAILED for ${order.id}`, err);
      // Don't lose the sale: the buyer still confirms on WhatsApp and the log above has the details.
    }
  } else {
    console.warn("DATABASE_URL not set — order only logged");
  }
  return Response.json(order, { status: 201 });
}
