// Server-only: order storage in Postgres (Neon). Used by the Vercel Functions
// and the local Express server. Never import this from client code.
import { neon } from "@neondatabase/serverless";
import { timingSafeEqual } from "node:crypto";
import type { Order } from "./products.js";

export const ORDER_STATUSES = ["new", "confirmed", "packed", "shipped", "delivered", "cancelled"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];
export const PAYMENT_STATUSES = ["unpaid", "paid"] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export interface StoredOrder extends Order {
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  adminNote: string;
  updatedAt: string;
}

const url = () => process.env.DATABASE_URL || process.env.POSTGRES_URL || "";
export const hasDatabase = () => Boolean(url());

let ready: Promise<void> | null = null;
function db() {
  const sql = neon(url());
  if (!ready) {
    ready = sql(`
      CREATE TABLE IF NOT EXISTS orders (
        id              TEXT PRIMARY KEY,
        created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
        status          TEXT NOT NULL DEFAULT 'new',
        payment         TEXT NOT NULL,
        payment_status  TEXT NOT NULL DEFAULT 'unpaid',
        customer        JSONB NOT NULL,
        lines           JSONB NOT NULL,
        total           INTEGER NOT NULL,
        admin_note      TEXT NOT NULL DEFAULT ''
      )`).then(() => undefined).catch((e) => { ready = null; throw e; });
  }
  return { sql, ready };
}

type Row = Record<string, any>;
const toOrder = (r: Row): StoredOrder => ({
  id: r.id,
  createdAt: new Date(r.created_at).toISOString(),
  updatedAt: new Date(r.updated_at).toISOString(),
  status: r.status,
  payment: r.payment,
  paymentStatus: r.payment_status,
  customer: r.customer,
  lines: r.lines,
  total: Number(r.total),
  adminNote: r.admin_note ?? "",
});

export async function saveOrder(o: Order) {
  const { sql, ready } = db();
  await ready;
  await sql(
    `INSERT INTO orders (id, created_at, payment, customer, lines, total) VALUES ($1, $2, $3, $4::jsonb, $5::jsonb, $6)`,
    [o.id, o.createdAt, o.payment, JSON.stringify(o.customer), JSON.stringify(o.lines), o.total],
  );
}

export async function listOrders(limit = 300): Promise<StoredOrder[]> {
  const { sql, ready } = db();
  await ready;
  const rows = (await sql(`SELECT * FROM orders ORDER BY created_at DESC LIMIT $1`, [limit])) as Row[];
  return rows.map(toOrder);
}

export async function updateOrder(id: string, patch: { status?: string; paymentStatus?: string; adminNote?: string }) {
  if (patch.status !== undefined && !ORDER_STATUSES.includes(patch.status as OrderStatus)) throw new Error("Invalid status");
  if (patch.paymentStatus !== undefined && !PAYMENT_STATUSES.includes(patch.paymentStatus as PaymentStatus)) throw new Error("Invalid payment status");
  const { sql, ready } = db();
  await ready;
  const rows = (await sql(
    `UPDATE orders SET
       status = COALESCE($2, status),
       payment_status = COALESCE($3, payment_status),
       admin_note = COALESCE($4, admin_note),
       updated_at = now()
     WHERE id = $1 RETURNING *`,
    [id, patch.status ?? null, patch.paymentStatus ?? null, patch.adminNote?.slice(0, 500) ?? null],
  )) as Row[];
  return rows[0] ? toOrder(rows[0]) : null;
}

/** Checks the admin password (ADMIN_KEY env var) in constant time. */
export function isAdmin(provided: string | null | undefined) {
  const expected = process.env.ADMIN_KEY || "";
  if (!expected || !provided) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
