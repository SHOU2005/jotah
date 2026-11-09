import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, Copy, IndianRupee, Loader2, LogOut, Package, Phone, Plus, RefreshCw, Search, Tag, Truck } from "lucide-react";
import { JMark, WhatsAppIcon } from "@/components/brand";
import { PAYMENT_LABEL, rupees } from "@shared/products";
import type { Order } from "@shared/products";
import { couponLabel, type Coupon } from "@shared/coupons";

// Mirrors shared/orders-db.ts (kept here so no server code reaches the browser).
const STATUSES = ["new", "confirmed", "packed", "shipped", "delivered", "cancelled"] as const;
type Status = (typeof STATUSES)[number];
interface StoredOrder extends Order {
  status: Status;
  paymentStatus: "unpaid" | "advance" | "paid";
  adminNote: string;
  updatedAt: string;
}

const STATUS_STYLE: Record<Status, string> = {
  new: "bg-flame text-white",
  confirmed: "bg-[#2B4FA3] text-white",
  packed: "bg-kraft text-ink",
  shipped: "bg-ink text-paper",
  delivered: "bg-wa text-[#06260f]",
  cancelled: "bg-ink/10 text-ink-soft line-through",
};
const NEXT: Partial<Record<Status, Status>> = { new: "confirmed", confirmed: "packed", packed: "shipped", shipped: "delivered" };
const KEY_STORE = "jotah-admin-key";

const isToday = (iso: string) => new Date(iso).toDateString() === new Date().toDateString();
const ago = (iso: string) => {
  const m = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} hr ago`;
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
};
const waNumber = (phone: string) => {
  const d = phone.replace(/\D/g, "");
  return d.length === 10 ? `91${d}` : d;
};

export default function Admin() {
  const [key, setKey] = useState<string>(() => { try { return sessionStorage.getItem(KEY_STORE) || ""; } catch { return ""; } });
  const [orders, setOrders] = useState<StoredOrder[] | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<Status | "all" | "todo">("todo");
  const [q, setQ] = useState("");
  const [view, setView] = useState<"orders" | "coupons">("orders");

  useEffect(() => {
    document.title = "Orders · Jotah Admin";
    let m = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (!m) { m = document.createElement("meta"); m.name = "robots"; document.head.appendChild(m); }
    m.content = "noindex, nofollow";
    return () => { m?.remove(); };
  }, []);

  const load = useCallback(async (k = key) => {
    if (!k) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin", { headers: { "x-admin-key": k } });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        setError("Wrong password");
        setKey("");
        try { sessionStorage.removeItem(KEY_STORE); } catch {}
        setOrders(null);
        return;
      }
      if (!res.ok) throw new Error(data.message || "Could not load orders");
      setOrders(data);
      setError("");
      try { sessionStorage.setItem(KEY_STORE, k); } catch {}
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load orders");
    } finally {
      setLoading(false);
    }
  }, [key]);

  useEffect(() => { if (key) load(key); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!orders) return;
    const t = setInterval(() => load(), 30000);
    return () => clearInterval(t);
  }, [orders, load]);

  const patch = async (id: string, change: Partial<Pick<StoredOrder, "status" | "paymentStatus" | "adminNote">>) => {
    setOrders((os) => os?.map((o) => (o.id === id ? { ...o, ...change } : o)) ?? os); // optimistic
    const res = await fetch("/api/admin", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-key": key },
      body: JSON.stringify({ id, ...change }),
    });
    if (!res.ok) { setError("Update failed — refreshing"); load(); }
  };

  const logout = () => {
    try { sessionStorage.removeItem(KEY_STORE); } catch {}
    setKey(""); setOrders(null);
  };

  if (!orders) return <Login loading={loading} error={error} onSubmit={(k) => { setKey(k); load(k); }} />;

  const live = orders.filter((o) => o.status !== "cancelled");
  const today = live.filter((o) => isToday(o.createdAt));
  const stats = [
    { label: "Today's orders", value: today.length, icon: Package },
    { label: "Today's sales", value: `₹${today.reduce((s, o) => s + o.total, 0)}`, icon: IndianRupee },
    { label: "To process", value: live.filter((o) => ["new", "confirmed", "packed"].includes(o.status)).length, icon: Truck },
    { label: "All-time sales", value: `₹${live.reduce((s, o) => s + o.total, 0)}`, icon: IndianRupee },
  ];

  const needle = q.trim().toLowerCase();
  const shown = orders.filter((o) => {
    if (filter === "todo" && !["new", "confirmed", "packed", "shipped"].includes(o.status)) return false;
    if (filter !== "all" && filter !== "todo" && o.status !== filter) return false;
    if (!needle) return true;
    const c = o.customer;
    return [o.id, c.name, c.phone, c.city, c.pincode, c.address].join(" ").toLowerCase().includes(needle);
  });
  const count = (s: Status) => orders.filter((o) => o.status === s).length;

  return (
    <div className="min-h-screen bg-paper-2">
      <header className="sticky top-0 z-30 border-b border-ink/10 bg-paper/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2"><JMark className="h-7 w-7" /><span className="font-display text-lg font-black">Jotah Admin</span></div>
          <nav className="flex rounded-full bg-ink/5 p-1 text-sm font-semibold">
            {(["orders", "coupons"] as const).map((v) => (
              <button key={v} onClick={() => setView(v)} className={`rounded-full px-4 py-1.5 capitalize transition ${view === v ? "bg-ink text-paper" : "hover:bg-ink/5"}`}>{v}</button>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={() => load()} className="rounded-full p-2.5 hover:bg-ink/5" aria-label="Refresh orders"><RefreshCw className={`h-5 w-5 ${loading ? "animate-spin" : ""}`} /></button>
            <button onClick={logout} className="rounded-full p-2.5 hover:bg-ink/5" aria-label="Log out"><LogOut className="h-5 w-5" /></button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-24 pt-6">
        {error && <p className="mb-4 rounded-xl bg-flame/15 p-3 text-sm" role="alert">{error}</p>}
        {view === "coupons" ? <Coupons adminKey={key} /> : <>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl bg-paper p-4">
              <s.icon className="h-5 w-5 text-ink-soft" />
              <p className="mt-3 font-display text-3xl font-black tabular-nums">{s.value}</p>
              <p className="text-sm text-ink-soft">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:px-0">
            {([["todo", "To do"], ["all", "All"], ...STATUSES.map((s) => [s, s[0].toUpperCase() + s.slice(1)])] as [typeof filter, string][]).map(([v, label]) => (
              <button key={v} onClick={() => setFilter(v)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${filter === v ? "bg-ink text-paper" : "bg-paper hover:bg-ink/5"}`}>
                {label}{STATUSES.includes(v as Status) ? ` (${count(v as Status)})` : ""}
              </button>
            ))}
          </div>
          <label className="relative block md:w-72">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, phone, order…" className="w-full rounded-full border border-ink/15 bg-paper py-2.5 pl-10 pr-4 text-sm outline-none focus:border-ink" />
          </label>
        </div>

        {shown.length === 0 ? (
          <div className="mt-16 text-center text-ink-soft">
            <Package className="mx-auto mb-3 h-10 w-10" />
            {orders.length === 0 ? "No orders yet. They'll show up here the moment someone checks out." : "No orders match this filter."}
          </div>
        ) : (
          <ul className="mt-6 space-y-4">
            {shown.map((o) => <OrderCard key={o.id} o={o} onPatch={patch} />)}
          </ul>
        )}
        </>}
      </main>
    </div>
  );
}

function OrderCard({ o, onPatch }: { o: StoredOrder; onPatch: (id: string, c: Partial<StoredOrder>) => void }) {
  const [note, setNote] = useState(o.adminNote);
  const [copied, setCopied] = useState(false);
  useEffect(() => setNote(o.adminNote), [o.adminNote]);
  const c = o.customer;
  const next = NEXT[o.status];
  const address = `${c.name}, ${c.address}, ${c.city} - ${c.pincode}. Ph ${c.phone}`;
  const msg = `Hi ${c.name.split(" ")[0]}! What The Fun 🔥 Your Jotah order ${o.id} (₹${o.total}) is ${o.status === "new" ? "received" : o.status}.`;

  return (
    <li className={`rounded-3xl bg-paper p-5 sm:p-6 ${o.status === "cancelled" ? "opacity-60" : ""}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-display text-xl font-black">{o.id}</span>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide ${STATUS_STYLE[o.status]}`}>{o.status}</span>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide ${o.paymentStatus === "paid" ? "bg-wa/20 text-[#0c5a2a]" : o.paymentStatus === "advance" ? "bg-kraft/40 text-ink" : "bg-ink/10 text-ink-soft"}`}>{o.paymentStatus === "advance" ? "₹100 advance paid" : o.paymentStatus}</span>
          </div>
          <p className="mt-1 text-sm text-ink-soft">{ago(o.createdAt)} · {PAYMENT_LABEL[o.payment]}</p>
        </div>
        <p className="font-display text-3xl font-black tabular-nums">₹{o.total}</p>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <div>
          <p className="font-bold">{c.name}</p>
          <p className="text-sm">{c.phone}</p>
          <p className="mt-1 text-sm text-ink-soft">{c.address}, {c.city} - {c.pincode}</p>
          {c.notes && <p className="mt-2 rounded-lg bg-kraft/30 px-3 py-2 text-sm">Note: {c.notes}</p>}
          <div className="mt-4 flex flex-wrap gap-2">
            <a href={`https://wa.me/${waNumber(c.phone)}?text=${encodeURIComponent(msg)}`} target="_blank" rel="noopener noreferrer" className="btn btn-wa !px-4 !py-2 text-sm"><WhatsAppIcon className="h-4 w-4" /> WhatsApp</a>
            <a href={`tel:${c.phone}`} className="btn btn-ghost !px-4 !py-2 text-sm"><Phone className="h-4 w-4" /> Call</a>
            <button
              onClick={() => { navigator.clipboard?.writeText(address); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
              className="btn btn-ghost !px-4 !py-2 text-sm"
            >
              {copied ? <><Check className="h-4 w-4" /> Copied</> : <><Copy className="h-4 w-4" /> Address</>}
            </button>
          </div>
        </div>

        <div>
          <ul className="space-y-1 text-sm">
            {o.lines.map((l) => (
              <li key={l.id} className="flex justify-between"><span>{l.name}{l.qty > 1 ? ` × ${l.qty}` : ""}</span><span className="tabular-nums">{rupees(l.lineTotal)}</span></li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {next && (
              <button onClick={() => onPatch(o.id, { status: next })} className="btn btn-ink !px-4 !py-2 text-sm" data-testid={`next-${o.id}`}>
                Mark {next}
              </button>
            )}
            <button
              onClick={() => onPatch(o.id, { paymentStatus: o.paymentStatus === "paid" ? "unpaid" : "paid" })}
              className={`btn !px-4 !py-2 text-sm ${o.paymentStatus === "paid" ? "btn-ghost" : "bg-wa text-[#06260f]"}`}
            >
              {o.paymentStatus === "paid" ? "Mark unpaid" : "Mark paid"}
            </button>
            <select
              value={o.status}
              onChange={(e) => onPatch(o.id, { status: e.target.value as Status })}
              className="rounded-full border border-ink/20 bg-paper px-3 py-2 text-sm"
              aria-label="Order status"
            >
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onBlur={() => note !== o.adminNote && onPatch(o.id, { adminNote: note })}
            placeholder="Private note (tracking no., delivery boy…)"
            className="mt-3 w-full rounded-xl border border-ink/15 bg-paper-2 px-3 py-2 text-sm outline-none focus:border-ink"
          />
        </div>
      </div>
    </li>
  );
}

const EMPTY_COUPON = { code: "", kind: "percent" as Coupon["kind"], value: "", minOrder: "", maxUses: "" };

function Coupons({ adminKey }: { adminKey: string }) {
  const [list, setList] = useState<Coupon[] | null>(null);
  const [form, setForm] = useState(EMPTY_COUPON);
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);

  const call = useCallback(async (method: string, body?: unknown) => {
    const res = await fetch("/api/admin-coupons", {
      method,
      headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || "Something went wrong");
    return data;
  }, [adminKey]);

  const load = useCallback(async () => {
    try { setList(await call("GET")); } catch (e) { setMsg(e instanceof Error ? e.message : "Could not load coupons"); }
  }, [call]);
  useEffect(() => { load(); }, [load]);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    try {
      await call("POST", form);
      setForm(EMPTY_COUPON);
      await load();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Could not create coupon");
    } finally {
      setSaving(false);
    }
  };

  const toggle = async (c: Coupon) => {
    setList((l) => l?.map((x) => (x.code === c.code ? { ...x, active: !c.active } : x)) ?? l);
    try { await call("PATCH", { code: c.code, active: !c.active }); } catch (e) { setMsg(e instanceof Error ? e.message : "Update failed"); load(); }
  };

  const input = "w-full rounded-xl border border-ink/15 bg-paper px-3 py-2.5 text-sm outline-none focus:border-ink";
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm((f) => ({ ...f, [k]: k === "code" ? e.target.value.toUpperCase() : e.target.value }));

  return (
    <div>
      <form onSubmit={create} className="rounded-3xl bg-paper p-5 sm:p-6">
        <p className="mb-4 flex items-center gap-2 font-display text-xl font-black"><Plus className="h-5 w-5" /> New coupon</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <label className="block text-sm"><span className="mb-1 block font-medium">Code</span><input required value={form.code} onChange={set("code")} placeholder="JOTAH10" className={`${input} uppercase`} /></label>
          <label className="block text-sm"><span className="mb-1 block font-medium">Type</span>
            <select value={form.kind} onChange={set("kind")} className={input}><option value="percent">% off</option><option value="flat">₹ off</option></select>
          </label>
          <label className="block text-sm"><span className="mb-1 block font-medium">{form.kind === "percent" ? "Percent off" : "Rupees off"}</span><input required inputMode="numeric" value={form.value} onChange={set("value")} placeholder={form.kind === "percent" ? "10" : "20"} className={input} /></label>
          <label className="block text-sm"><span className="mb-1 block font-medium">Min order ₹ <span className="text-ink-soft">(optional)</span></span><input inputMode="numeric" value={form.minOrder} onChange={set("minOrder")} placeholder="0" className={input} /></label>
          <label className="block text-sm"><span className="mb-1 block font-medium">Max uses <span className="text-ink-soft">(optional)</span></span><input inputMode="numeric" value={form.maxUses} onChange={set("maxUses")} placeholder="Unlimited" className={input} /></label>
        </div>
        {msg && <p className="mt-3 text-sm text-flame" role="alert">{msg}</p>}
        <button disabled={saving} className="btn btn-ink mt-4 !px-5 !py-2.5 text-sm">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create coupon"}</button>
      </form>

      {!list ? (
        <div className="mt-10 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-ink-soft" /></div>
      ) : list.length === 0 ? (
        <div className="mt-16 text-center text-ink-soft"><Tag className="mx-auto mb-3 h-10 w-10" />No coupons yet. Create one above.</div>
      ) : (
        <ul className="mt-6 grid gap-3 md:grid-cols-2">
          {list.map((c) => (
            <li key={c.code} className={`flex items-center gap-4 rounded-2xl bg-paper p-4 ${c.active ? "" : "opacity-60"}`}>
              <Tag className="h-5 w-5 shrink-0 text-ink-soft" />
              <div className="flex-1">
                <p className="font-display text-lg font-black tracking-wide">{c.code}</p>
                <p className="text-sm text-ink-soft">{couponLabel(c)} · used {c.uses}{c.maxUses !== null ? ` / ${c.maxUses}` : ""}</p>
              </div>
              <button onClick={() => toggle(c)} className={`btn !px-4 !py-2 text-sm ${c.active ? "btn-ghost" : "bg-wa text-[#06260f]"}`}>{c.active ? "Turn off" : "Turn on"}</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Login({ onSubmit, loading, error }: { onSubmit: (k: string) => void; loading: boolean; error: string }) {
  const [k, setK] = useState("");
  return (
    <main className="kraft-texture flex min-h-screen items-center justify-center bg-kraft p-4">
      <form onSubmit={(e) => { e.preventDefault(); if (k.trim()) onSubmit(k.trim()); }} className="w-full max-w-sm rounded-3xl bg-paper p-8 shadow-2xl">
        <JMark className="h-10 w-10" />
        <h1 className="display mt-5 text-4xl">Admin</h1>
        <p className="mt-2 text-sm text-ink-soft">Enter your admin password to see orders.</p>
        <input
          type="password"
          autoComplete="current-password"
          value={k}
          onChange={(e) => setK(e.target.value)}
          className="mt-6 w-full rounded-xl border border-ink/20 bg-paper px-4 py-3.5 outline-none focus:border-ink"
          placeholder="Password"
          autoFocus
          data-testid="admin-key"
        />
        {error && <p className="mt-2 text-sm text-flame" role="alert">{error}</p>}
        <button className="btn btn-ink mt-5 w-full" disabled={loading} data-testid="admin-login">
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Open orders"}
        </button>
      </form>
    </main>
  );
}
