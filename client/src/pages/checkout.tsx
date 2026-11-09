import { useRef, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Banknote, CheckCircle2, CreditCard, Loader2, Lock, Tag, Truck, X } from "lucide-react";
import Navigation from "@/components/navigation";
import { Footer } from "@/components/site-chrome";
import { WhatsAppIcon } from "@/components/brand";
import { AddToCart } from "@/components/cart";
import { useCart } from "@/lib/cart";
import { usePageMeta } from "@/lib/seo";
import { whatsappLink, PHONE_DISPLAY } from "@/lib/contact";
import { createPaymentOrder, loadRazorpay, openCheckout, verifyPayment, type PaymentOrder } from "@/lib/razorpay";
import { codFee, COD_ADVANCE, orderSchema, orderWhatsAppText, PAYMENT_LABEL, payNow, rupees, type Order, type OrderInput } from "@shared/products";
import { couponDiscount, couponLabel, type Coupon } from "@shared/coupons";

type Customer = OrderInput["customer"];
type Paid = "paid" | "advance" | null;
const EMPTY: Customer = { name: "", phone: "", address: "", city: "", pincode: "", notes: "" };

export default function Checkout() {
  usePageMeta("/checkout");
  const { lines, subtotal, count, clear } = useCart();
  const [c, setC] = useState<Customer>(EMPTY);
  const [payment, setPayment] = useState<OrderInput["payment"]>("online");
  const [errors, setErrors] = useState<Partial<Record<keyof Customer | "form", string>>>({});
  const [busy, setBusy] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [paid, setPaid] = useState<Paid>(null);
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponMsg, setCouponMsg] = useState("");
  const [checkingCoupon, setCheckingCoupon] = useState(false);
  const couponResult = coupon ? couponDiscount(coupon, subtotal) : null;
  const discount = couponResult?.ok ? couponResult.discount : 0;

  const applyCoupon = async () => {
    const code = couponCode.trim();
    if (!code) return;
    setCheckingCoupon(true);
    setCouponMsg("");
    try {
      const res = await fetch("/api/coupon", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ coupon: code }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Invalid coupon code");
      setCoupon(data);
      setCouponCode("");
    } catch (err) {
      setCoupon(null);
      setCouponMsg(err instanceof Error ? err.message : "Invalid coupon code");
    } finally {
      setCheckingCoupon(false);
    }
  };
  // Razorpay order for the current cart + details, reused if the buyer closes the modal and retries.
  const pending = useRef<{ key: string; po: PaymentOrder } | null>(null);

  const set = (k: keyof Customer) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setC((p) => ({ ...p, [k]: e.target.value }));
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const input = { customer: c, items: lines.map((l) => ({ id: l.id, qty: l.qty })), payment, coupon: discount > 0 ? coupon?.code : undefined };
    const check = orderSchema.safeParse(input);
    if (!check.success) {
      const errs: typeof errors = {};
      for (const issue of check.error.errors) {
        const key = (issue.path[1] ?? "form") as keyof typeof errors;
        if (!errs[key]) errs[key] = issue.message;
      }
      setErrors(errs);
      document.querySelector("[aria-invalid='true']")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    return payOnline(check.data);
  };

  const payOnline = async (input: OrderInput) => {
    setBusy(true);
    setErrors({});
    try {
      await loadRazorpay();
      const key = JSON.stringify(input);
      if (pending.current?.key !== key) pending.current = { key, po: await createPaymentOrder(input) };
      const po = pending.current.po;
      let failed = "";
      let result;
      try {
        result = await openCheckout(po, (msg) => { failed = msg; });
      } catch (err) {
        if ((err as { cancelled?: boolean }).cancelled) {
          setErrors({ form: failed ? `Payment failed: ${failed}` : "Payment cancelled. Your cart is saved — tap Pay to try again." });
          return;
        }
        throw err;
      }
      await verifyPayment(result);
      pending.current = null;
      setOrder(po.order);
      setPaid(po.order.payment === "cod" ? "advance" : "paid");
      clear();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setErrors({ form: err instanceof Error ? err.message : "Payment could not be completed. Please try again." });
    } finally {
      setBusy(false);
    }
  };

  if (order) return <Success order={order} paid={paid} />;

  const fee = payment === "cod" ? codFee(subtotal) : 0;
  const total = subtotal + fee - discount;
  const now = payNow(payment, total);

  const field = (k: keyof Customer) =>
    `w-full rounded-xl border bg-paper px-4 py-3.5 text-ink placeholder:text-ink-soft/50 outline-none transition focus:ring-2 ${
      errors[k] ? "border-flame focus:ring-flame/20" : "border-ink/20 focus:border-ink focus:ring-ink/10"
    }`;
  const Err = ({ k }: { k: keyof Customer }) => (errors[k] ? <p className="mt-1.5 text-sm text-flame">{errors[k]}</p> : null);

  return (
    <>
      <Navigation solid />
      <main className="min-h-screen bg-paper pb-24 pt-24 md:pt-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Link href="/product" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-ink-soft hover:text-ink"><ArrowLeft className="h-4 w-4" /> Keep shopping</Link>
          <h1 className="display mb-10 text-[clamp(2.4rem,5vw,4rem)]">Checkout</h1>

          {lines.length === 0 ? (
            <div className="animate-rise mx-auto max-w-md rounded-3xl bg-paper-2 p-10 text-center">
              <p className="font-display text-2xl font-black">Your cart is empty</p>
              <p className="mt-2 text-ink-soft">Add some Jotah to get started.</p>
              <div className="mt-8"><AddToCart /></div>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="grid items-start gap-10 lg:grid-cols-[1.4fr_1fr]">
              <div className="space-y-8">
                <fieldset className="animate-rise rounded-3xl bg-card p-6 sm:p-8">
                  <legend className="sr-only">Delivery details</legend>
                  <p className="mb-6 flex items-center gap-3 font-display text-xl font-black"><Truck className="h-5 w-5" /> Delivery details</p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-1.5 block text-sm font-medium">Full name</span>
                      <input autoComplete="name" value={c.name} onChange={set("name")} aria-invalid={!!errors.name} className={field("name")} placeholder="Rahul Sharma" data-testid="co-name" />
                      <Err k="name" />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-sm font-medium">Mobile number</span>
                      <input autoComplete="tel" inputMode="tel" value={c.phone} onChange={set("phone")} aria-invalid={!!errors.phone} className={field("phone")} placeholder="98XXXXXXXX" data-testid="co-phone" />
                      <Err k="phone" />
                    </label>
                  </div>
                  <label className="mt-4 block">
                    <span className="mb-1.5 block text-sm font-medium">Full address</span>
                    <textarea autoComplete="street-address" rows={3} value={c.address} onChange={set("address")} aria-invalid={!!errors.address} className={field("address")} placeholder="House / flat no., street, area, landmark" data-testid="co-address" />
                    <Err k="address" />
                  </label>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-1.5 block text-sm font-medium">City</span>
                      <input autoComplete="address-level2" value={c.city} onChange={set("city")} aria-invalid={!!errors.city} className={field("city")} placeholder="Gurugram" data-testid="co-city" />
                      <Err k="city" />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-sm font-medium">Pincode</span>
                      <input autoComplete="postal-code" inputMode="numeric" maxLength={6} value={c.pincode} onChange={set("pincode")} aria-invalid={!!errors.pincode} className={field("pincode")} placeholder="122002" data-testid="co-pincode" />
                      <Err k="pincode" />
                    </label>
                  </div>
                  <label className="mt-4 block">
                    <span className="mb-1.5 block text-sm font-medium">Note <span className="text-ink-soft">(optional)</span></span>
                    <input value={c.notes} onChange={set("notes")} className={field("notes")} placeholder="Delivery time, gate code…" />
                  </label>
                </fieldset>

                <fieldset className="animate-rise rounded-3xl bg-card p-6 sm:p-8 [animation-delay:100ms]">
                  <legend className="sr-only">Payment</legend>
                  <p className="mb-6 flex items-center gap-3 font-display text-xl font-black"><Lock className="h-5 w-5" /> Payment</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {([
                      ["online", CreditCard, "UPI, cards, netbanking or wallets — pay now, secured by Razorpay"],
                      ["cod", Banknote, `Pay ₹${COD_ADVANCE} now to confirm, rest in cash on delivery. COD charge ₹${codFee(subtotal)}.`],
                    ] as const).map(([val, Icon, desc]) => (
                      <label key={val} className={`flex cursor-pointer gap-4 rounded-2xl border-2 p-4 transition ${payment === val ? "border-ink bg-paper" : "border-ink/10 hover:border-ink/30"}`}>
                        <input type="radio" name="payment" value={val} checked={payment === val} onChange={() => setPayment(val)} className="sr-only" />
                        <Icon className="mt-0.5 h-6 w-6 shrink-0" />
                        <span>
                          <span className="block font-bold">{PAYMENT_LABEL[val]}</span>
                          <span className="block text-sm text-ink-soft">{desc}</span>
                        </span>
                        <span className={`ml-auto mt-1 h-5 w-5 shrink-0 rounded-full border-2 transition ${payment === val ? "border-[6px] border-ink" : "border-ink/30"}`} />
                      </label>
                    ))}
                  </div>
                </fieldset>
              </div>

              <aside className="animate-rise rounded-3xl bg-ink p-6 text-paper sm:p-8 lg:sticky lg:top-28 [animation-delay:150ms]">
                <p className="font-display text-xl font-black">Order summary</p>
                <ul className="mt-6 space-y-4">
                  {lines.map((l) => (
                    <li key={l.id} className="flex items-center gap-4">
                      <div className="relative">
                        <img src={l.image} alt="" className="h-14 w-20 rounded-lg object-cover" />
                        <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-flame px-1 text-xs font-bold">{l.qty}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold leading-tight">{l.name}</p>
                        <p className="text-sm text-paper/60">₹{l.price} × {l.qty}</p>
                      </div>
                      <p className="font-bold tabular-nums">₹{l.price * l.qty}</p>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 border-t border-paper/15 pt-6">
                  {coupon ? (
                    <div className="flex items-center gap-3 rounded-xl bg-paper/10 px-4 py-3 text-sm">
                      <Tag className="h-4 w-4 shrink-0" />
                      <div className="flex-1">
                        <p className="font-bold">{coupon.code}</p>
                        <p className={couponResult?.ok ? "text-paper/60" : "text-flame"}>{couponResult?.ok ? couponLabel(coupon) : couponResult?.message}</p>
                      </div>
                      <button type="button" onClick={() => setCoupon(null)} className="rounded-full p-1.5 hover:bg-paper/10" aria-label="Remove coupon"><X className="h-4 w-4" /></button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        value={couponCode}
                        onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponMsg(""); }}
                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); applyCoupon(); } }}
                        placeholder="Coupon code"
                        aria-label="Coupon code"
                        className="min-w-0 flex-1 rounded-xl border border-paper/20 bg-transparent px-4 py-3 text-sm uppercase tracking-wide text-paper placeholder:normal-case placeholder:tracking-normal placeholder:text-paper/40 outline-none focus:border-paper/60"
                        data-testid="coupon-input"
                      />
                      <button type="button" onClick={applyCoupon} disabled={checkingCoupon || !couponCode.trim()} className="rounded-xl bg-paper px-4 text-sm font-bold text-ink disabled:opacity-50" data-testid="coupon-apply">
                        {checkingCoupon ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
                      </button>
                    </div>
                  )}
                  {couponMsg && <p className="mt-2 text-sm text-flame" role="alert">{couponMsg}</p>}
                </div>
                <dl className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between"><dt className="text-paper/60">Items ({count})</dt><dd className="tabular-nums">₹{subtotal}</dd></div>
                  <div className="flex justify-between"><dt className="text-paper/60">Delivery</dt><dd>Confirmed on WhatsApp</dd></div>
                  {fee > 0 && <div className="flex justify-between"><dt className="text-paper/60">COD charge</dt><dd className="tabular-nums">₹{fee}</dd></div>}
                  {discount > 0 && <div className="flex justify-between text-wa"><dt>Coupon {coupon?.code}</dt><dd className="tabular-nums">{rupees(-discount)}</dd></div>}
                  <div className="flex items-baseline justify-between border-t border-paper/15 pt-4"><dt className="font-bold">Total</dt><dd className="font-display text-3xl font-black tabular-nums">₹{total}</dd></div>
                  {payment === "cod" && (
                    <>
                      <div className="flex justify-between pt-2"><dt className="text-paper/60">Pay now (advance)</dt><dd className="font-bold tabular-nums">₹{now}</dd></div>
                      <div className="flex justify-between"><dt className="text-paper/60">Cash on delivery</dt><dd className="tabular-nums">₹{total - now}</dd></div>
                    </>
                  )}
                </dl>
                {errors.form && <p className="mt-4 rounded-xl bg-flame/20 p-3 text-sm" role="alert">{errors.form}</p>}
                <button type="submit" disabled={busy} className="btn btn-wa mt-6 w-full text-base disabled:opacity-70" data-testid="place-order">
                  {busy ? <><Loader2 className="h-5 w-5 animate-spin" /> Processing payment…</> : payment === "cod" ? <>Pay ₹{now} advance</> : <>Pay · ₹{total}</>}
                </button>
                <p className="mt-4 text-center text-xs text-paper/50">18+ only. By ordering you confirm you are of legal age.</p>
              </aside>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

function Success({ order, paid }: { order: Order; paid: Paid }) {
  const now = payNow(order.payment, order.total);
  return (
    <>
      <Navigation solid />
      <main className="kraft-texture min-h-screen bg-paper px-4 pb-24 pt-28 md:pt-36">
        <div className="mx-auto max-w-xl text-center">
          <div className="animate-pop mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-wa text-[#06260f] shadow-xl">
            <CheckCircle2 className="h-12 w-12" />
          </div>
          <p className="eyebrow mt-8 animate-rise">Order {order.id}</p>
          <h1 className="display mt-3 animate-rise text-[clamp(2.4rem,6vw,4.2rem)] [animation-delay:80ms]">What the fun!<br />{paid === "paid" ? "Payment received." : "Order placed."}</h1>
          <p className="mx-auto mt-6 max-w-md animate-rise text-lg text-ink-soft [animation-delay:160ms]">
            One last step — tap below to send your order to us on WhatsApp so we can confirm delivery.
          </p>
          <a
            href={whatsappLink(orderWhatsAppText(order))}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-wa wa-pulse mt-8 animate-rise px-8 py-4 text-lg [animation-delay:240ms]"
            data-testid="confirm-whatsapp"
          >
            <WhatsAppIcon className="h-6 w-6" /> Confirm on WhatsApp
          </a>

          <div className="mt-12 animate-rise rounded-3xl bg-card p-6 text-left [animation-delay:320ms]">
            {order.lines.map((l) => (
              <div key={l.id} className="flex justify-between py-1"><span>{l.name}{l.qty > 1 ? ` × ${l.qty}` : ""}</span><span className="font-semibold tabular-nums">{rupees(l.lineTotal)}</span></div>
            ))}
            <div className="mt-3 flex justify-between border-t border-ink/10 pt-3 font-bold"><span>Total · {paid === "paid" ? "Paid online" : paid === "advance" ? `₹${now} paid · ₹${order.total - now} cash on delivery` : PAYMENT_LABEL[order.payment]}</span><span className="tabular-nums">₹{order.total}</span></div>
            <p className="mt-4 text-sm text-ink-soft">Delivering to {order.customer.name}, {order.customer.address}, {order.customer.city} - {order.customer.pincode}</p>
          </div>
          <p className="mt-6 text-sm text-ink-soft">Questions? Call {PHONE_DISPLAY}</p>
          <Link href="/" className="btn btn-ghost mt-6">Back to home</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
