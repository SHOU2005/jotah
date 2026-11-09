import { z } from "zod";

// Product catalogue shared by the shop UI and the order API.
// Prices are in rupees and always re-checked on the server.
export interface Product {
  id: string;
  name: string;
  /** Short size label for pickers, e.g. "5-Pack". */
  size: string;
  short: string;
  price: number;
  /** How many packs are inside — each pack holds 1 cone. */
  packs: number;
  image: string;
  badge?: string;
  /** Hidden products are not shown and cannot be ordered. */
  hidden?: boolean;
}

const SPECS = "Slow burn · France paper · 13.8 GSM";

export const PRODUCTS: Record<string, Product> = {
  // Single cone (₹15 MRP): sold in shops only, not online — hidden from the website shop.
  "jotah-rolling-papers": {
    id: "jotah-rolling-papers",
    name: "Jotah Pre-Rolled Cone",
    size: "Single",
    short: `1 cone · ${SPECS}`,
    price: 15,
    packs: 1,
    image: "/images/cones/hero-box-cones.jpg",
    hidden: true,
  },
  "jotah-5-pack": {
    id: "jotah-5-pack",
    name: "Jotah Cones 5-Pack",
    size: "5-Pack",
    short: `5 cones · ${SPECS}`,
    price: 75,
    packs: 5,
    image: "/images/cones/cone-tips.jpg",
    badge: "Most popular",
  },
  "jotah-10-pack": {
    id: "jotah-10-pack",
    name: "Jotah Cones 10-Pack",
    size: "10-Pack",
    short: `10 cones · ${SPECS}`,
    price: 150,
    packs: 10,
    image: "/images/cones/box-moody.jpg",
  },
  "jotah-box-25": {
    id: "jotah-box-25",
    name: "Jotah Cones Box of 25",
    size: "Box of 25",
    short: `25 cones · ${SPECS}`,
    price: 375,
    packs: 25,
    image: "/images/cones/box-beige.jpg",
    badge: "Stock up",
  },
  // TODO(owner): confirm what's in the combo and its price, then remove `hidden`.
  "jotah-combo": {
    id: "jotah-combo",
    name: "Jotah Combo",
    size: "Combo",
    short: "Cones + extras",
    price: 99,
    packs: 1,
    image: "/images/cones/hero-box-cones.jpg",
    badge: "Combo",
    hidden: true,
  },
};

/** Products shown in the shop, in display order. */
export const SHOP_PRODUCTS = Object.values(PRODUCTS).filter((p) => !p.hidden);

/** Smallest online size; used by "Buy now" and quick-add buttons. */
export const DEFAULT_PRODUCT = PRODUCTS["jotah-5-pack"];
export const MAX_QTY = 500;

export const orderSchema = z.object({
  customer: z.object({
    name: z.string().trim().min(2, "Enter your name").max(80),
    phone: z.string().trim().regex(/^(\+?91[\s-]?)?[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
    address: z.string().trim().min(8, "Enter your full address").max(300),
    city: z.string().trim().min(2, "Enter your city").max(60),
    pincode: z.string().trim().regex(/^\d{6}$/, "Enter a 6-digit pincode"),
    notes: z.string().trim().max(300).optional().default(""),
  }),
  items: z
    .array(z.object({ id: z.string(), qty: z.number().int().min(1).max(MAX_QTY) }))
    .min(1, "Your cart is empty"),
  payment: z.enum(["cod", "upi", "online"]),
});

export type OrderInput = z.infer<typeof orderSchema>;

export interface OrderLine {
  id: string;
  name: string;
  price: number;
  qty: number;
  lineTotal: number;
}

export interface Order {
  id: string;
  createdAt: string;
  customer: OrderInput["customer"];
  payment: OrderInput["payment"];
  lines: OrderLine[];
  total: number;
}

export const PAYMENT_LABEL: Record<OrderInput["payment"], string> = {
  cod: "Cash on delivery",
  upi: "UPI on delivery",
  online: "Online payment",
};

export function orderWhatsAppText(o: Order) {
  return [
    "What The Fun",
    "",
    `New order ${o.id}`,
    ...o.lines.map((l) => `• ${l.name} × ${l.qty} = ₹${l.lineTotal}`),
    `Total: ₹${o.total} (${PAYMENT_LABEL[o.payment]})`,
    "",
    `${o.customer.name} · ${o.customer.phone}`,
    `${o.customer.address}, ${o.customer.city} - ${o.customer.pincode}`,
    o.customer.notes ? `Note: ${o.customer.notes}` : "",
  ]
    .filter((x, i, a) => !(x === "" && i === a.length - 1))
    .join("\n");
}

/** Validates raw input and builds a priced order. Prices always come from PRODUCTS. */
export function buildOrder(raw: unknown): { ok: true; order: Order } | { ok: false; message: string } {
  const parsed = orderSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, message: parsed.error.errors[0]?.message ?? "Invalid order" };
  const { customer, items, payment } = parsed.data;
  const lines: OrderLine[] = [];
  for (const item of items) {
    const product = PRODUCTS[item.id];
    if (!product || product.hidden) return { ok: false, message: "A product in your cart is no longer available" };
    lines.push({ id: product.id, name: product.name, price: product.price, qty: item.qty, lineTotal: product.price * item.qty });
  }
  return {
    ok: true,
    order: {
      id: `JT-${Date.now().toString(36).toUpperCase().slice(-5)}${Math.random().toString(36).slice(2, 4).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      customer,
      payment,
      lines,
      total: lines.reduce((s, l) => s + l.lineTotal, 0),
    },
  };
}
