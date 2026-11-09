// Server-only: coupon storage in Postgres (Neon), next to the orders table.
// Never import this from client code.
import { neon } from "@neondatabase/serverless";
import type { Coupon } from "./coupons.js";

const url = () => process.env.DATABASE_URL || process.env.POSTGRES_URL || "";
export const hasCouponsDb = () => Boolean(url());

let ready: Promise<void> | null = null;
function db() {
  const sql = neon(url());
  if (!ready) {
    ready = sql(`
      CREATE TABLE IF NOT EXISTS coupons (
        code        TEXT PRIMARY KEY,
        kind        TEXT NOT NULL,
        value       INTEGER NOT NULL,
        min_order   INTEGER NOT NULL DEFAULT 0,
        max_uses    INTEGER,
        uses        INTEGER NOT NULL DEFAULT 0,
        active      BOOLEAN NOT NULL DEFAULT true,
        created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
      )`).then(() => undefined).catch((e) => { ready = null; throw e; });
  }
  return { sql, ready };
}

type Row = Record<string, any>;
const toCoupon = (r: Row): Coupon => ({
  code: r.code,
  kind: r.kind === "flat" ? "flat" : "percent",
  value: Number(r.value),
  minOrder: Number(r.min_order),
  maxUses: r.max_uses === null ? null : Number(r.max_uses),
  uses: Number(r.uses),
  active: Boolean(r.active),
  createdAt: new Date(r.created_at).toISOString(),
});

export async function getCoupon(code: string): Promise<Coupon | null> {
  const { sql, ready } = db();
  await ready;
  const rows = (await sql(`SELECT * FROM coupons WHERE code = $1`, [code])) as Row[];
  return rows[0] ? toCoupon(rows[0]) : null;
}

export async function listCoupons(): Promise<Coupon[]> {
  const { sql, ready } = db();
  await ready;
  return ((await sql(`SELECT * FROM coupons ORDER BY created_at DESC`)) as Row[]).map(toCoupon);
}

/** Returns null if the code already exists. */
export async function createCoupon(c: Pick<Coupon, "code" | "kind" | "value" | "minOrder" | "maxUses">): Promise<Coupon | null> {
  const { sql, ready } = db();
  await ready;
  const rows = (await sql(
    `INSERT INTO coupons (code, kind, value, min_order, max_uses) VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (code) DO NOTHING RETURNING *`,
    [c.code, c.kind, c.value, c.minOrder, c.maxUses],
  )) as Row[];
  return rows[0] ? toCoupon(rows[0]) : null;
}

export async function setCouponActive(code: string, active: boolean): Promise<Coupon | null> {
  const { sql, ready } = db();
  await ready;
  const rows = (await sql(`UPDATE coupons SET active = $2 WHERE code = $1 RETURNING *`, [code, active])) as Row[];
  return rows[0] ? toCoupon(rows[0]) : null;
}

/** Counts one paid use of a coupon. */
export async function recordCouponUse(code: string) {
  const { sql, ready } = db();
  await ready;
  await sql(`UPDATE coupons SET uses = uses + 1 WHERE code = $1`, [code]);
}
