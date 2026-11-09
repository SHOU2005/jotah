import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { Minus, Plus, ShoppingBag, Trash2, X, Check } from "lucide-react";
import { useCart } from "@/lib/cart";
import { DEFAULT_PRODUCT, PRODUCTS, SHOP_PRODUCTS } from "@shared/products";
import { PackStack } from "./brand";

/** Bag icon with a count badge that pops whenever something is added. */
export function CartButton({ className = "" }: { className?: string }) {
  const { count, open, bump } = useCart();
  const [pop, setPop] = useState(false);
  useEffect(() => {
    if (!bump) return;
    setPop(true);
    const t = setTimeout(() => setPop(false), 600);
    return () => clearTimeout(t);
  }, [bump]);

  return (
    <button
      onClick={open}
      className={`relative rounded-full p-2.5 text-ink transition hover:bg-ink/5 ${pop ? "animate-cart-shake" : ""} ${className}`}
      aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
      data-testid="cart-button"
    >
      <ShoppingBag className="h-6 w-6" />
      {count > 0 && (
        <span
          key={bump}
          className="animate-badge-pop absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-flame px-1 text-[11px] font-bold text-white"
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
}

/** Quantity stepper + Add to cart. Shows a tick for a moment after adding. */
export function AddToCart({ productId = DEFAULT_PRODUCT.id, dark = false, withQty = true, label = "Add to cart" }: {
  productId?: string; dark?: boolean; withQty?: boolean; label?: string;
}) {
  const { add, open } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const timer = useRef<number>();

  const onAdd = () => {
    add(productId, qty);
    setAdded(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setAdded(false), 1600);
    window.setTimeout(open, 350);
  };

  const stepper = dark ? "border-paper/25 text-paper" : "border-ink/25 text-ink";
  return (
    <div className="flex w-full flex-col gap-3 sm:flex-row">
      {withQty && (
        <div className={`flex h-[52px] shrink-0 items-center justify-between rounded-full border ${stepper}`}>
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="h-full w-12 rounded-l-full" aria-label="Decrease quantity"><Minus className="mx-auto h-4 w-4" /></button>
          <span className="w-10 text-center font-display text-lg font-black tabular-nums" aria-live="polite">{qty}</span>
          <button onClick={() => setQty((q) => Math.min(500, q + 1))} className="h-full w-12 rounded-r-full" aria-label="Increase quantity"><Plus className="mx-auto h-4 w-4" /></button>
        </div>
      )}
      <button
        onClick={onAdd}
        className={`btn relative flex-1 overflow-hidden text-base ${dark ? "bg-paper text-ink hover:bg-white" : "btn-ink"}`}
        data-testid="add-to-cart"
      >
        <span className={`flex items-center gap-2 transition-all duration-300 ${added ? "-translate-y-8 opacity-0" : ""}`}>
          <ShoppingBag className="h-5 w-5" /> {label}
        </span>
        <span className={`absolute inset-0 flex items-center justify-center gap-2 transition-all duration-300 ${added ? "" : "translate-y-8 opacity-0"}`}>
          <Check className="h-5 w-5" /> Added!
        </span>
      </button>
    </div>
  );
}

/** Slide-in cart panel. */
export function CartDrawer() {
  const { lines, subtotal, count, isOpen, close, setQty, remove, add } = useCart();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  return (
    <div className={`fixed inset-0 z-[90] ${isOpen ? "" : "pointer-events-none"}`} aria-hidden={!isOpen}>
      <div onClick={close} className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`} />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Your cart"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-paper shadow-2xl transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <header className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
          <h2 className="font-display text-2xl font-black">Your cart {count > 0 && <span className="text-ink-soft">({count})</span>}</h2>
          <button onClick={close} className="rounded-full p-2 hover:bg-ink/5" aria-label="Close cart"><X className="h-6 w-6" /></button>
        </header>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <div className="animate-float-soft mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-kraft">
              <ShoppingBag className="h-10 w-10" />
            </div>
            <p className="font-display text-2xl font-black">Your cart is empty</p>
            <p className="mt-2 text-ink-soft">Start with a {DEFAULT_PRODUCT.size} — {DEFAULT_PRODUCT.packs} cones for ₹{DEFAULT_PRODUCT.price}.</p>
            <div className="mt-8 w-full"><AddToCart withQty={false} label={`Add ${DEFAULT_PRODUCT.size} · ₹${DEFAULT_PRODUCT.price}`} /></div>
          </div>
        ) : (
          <>
            <ul className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
              {lines.map((l) => (
                <li key={l.id} className="animate-slide-in flex gap-4 rounded-2xl bg-paper-2 p-3">
                  <div className="relative h-20 w-28 shrink-0">
                    <img src={l.image} alt="" className="h-full w-full rounded-xl object-cover" />
                    {l.packs > 1 && <span className="absolute -right-1.5 -top-1.5 rounded-full bg-ink px-2 py-0.5 text-[11px] font-bold text-paper">×{l.packs}</span>}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-bold leading-tight">{l.name}</p>
                        <p className="mt-0.5 text-xs text-ink-soft">{l.short}</p>
                      </div>
                      <button onClick={() => remove(l.id)} className="rounded-full p-1.5 text-ink-soft hover:bg-ink/5 hover:text-flame" aria-label={`Remove ${l.name}`}><Trash2 className="h-4 w-4" /></button>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center rounded-full border border-ink/20">
                        <button onClick={() => setQty(l.id, l.qty - 1)} className="h-8 w-8" aria-label="Decrease"><Minus className="mx-auto h-3.5 w-3.5" /></button>
                        <input
                          value={l.qty}
                          onChange={(e) => { const n = parseInt(e.target.value.replace(/\D/g, "")) || 0; if (n > 0) setQty(l.id, n); }}
                          className="w-10 bg-transparent text-center text-sm font-bold tabular-nums outline-none"
                          inputMode="numeric"
                          aria-label="Quantity"
                        />
                        <button onClick={() => setQty(l.id, l.qty + 1)} className="h-8 w-8" aria-label="Increase"><Plus className="mx-auto h-3.5 w-3.5" /></button>
                      </div>
                      <p className="font-display text-lg font-black tabular-nums">₹{l.qty * l.price}</p>
                    </div>
                  </div>
                </li>
              ))}
              {SHOP_PRODUCTS.some((p) => p.packs > 1 && !lines.find((l) => l.id === p.id)) && (
                <li className="pt-2">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-ink-soft">Bigger packs</p>
                  <div className="flex flex-wrap gap-2">
                    {SHOP_PRODUCTS.filter((p) => p.packs > 1 && !lines.find((l) => l.id === p.id)).map((p) => (
                      <button key={p.id} onClick={() => add(p.id)} className="rounded-full border border-ink/20 px-4 py-1.5 text-sm font-semibold transition hover:border-ink hover:bg-ink hover:text-paper">
                        + {p.size} · ₹{p.price}
                      </button>
                    ))}
                  </div>
                </li>
              )}
            </ul>
            <footer className="border-t border-ink/10 px-6 py-5">
              <div className="flex items-baseline justify-between">
                <span className="text-ink-soft">Subtotal</span>
                <span className="font-display text-3xl font-black tabular-nums">₹{subtotal}</span>
              </div>
              <p className="mt-1 text-xs text-ink-soft">MRP inclusive of all taxes. Delivery charges, if any, confirmed on WhatsApp.</p>
              <Link href="/checkout" onClick={close} className="btn btn-ink mt-5 w-full text-base" data-testid="go-checkout">
                Checkout · ₹{subtotal}
              </Link>
              <button onClick={close} className="mt-3 w-full text-center text-sm font-medium text-ink-soft hover:text-ink">Continue shopping</button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}

/** Grid of every size with a quick Add button. */
export function ShopGrid() {
  const { add, open } = useCart();
  const [justAdded, setJustAdded] = useState<string | null>(null);
  const onAdd = (id: string) => {
    add(id);
    setJustAdded(id);
    window.setTimeout(() => setJustAdded((x) => (x === id ? null : x)), 1400);
    window.setTimeout(open, 350);
  };
  return (
    <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0">
      {SHOP_PRODUCTS.map((p) => (
        <article
          key={p.id}
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - 0.5;
            const y = (e.clientY - r.top) / r.height - 0.5;
            e.currentTarget.style.transform = `perspective(900px) rotateX(${(-y * 8).toFixed(2)}deg) rotateY(${(x * 10).toFixed(2)}deg) translateY(-4px)`;
          }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = ""; }}
          className="group relative flex w-[78%] shrink-0 snap-center flex-col rounded-3xl bg-paper p-5 sm:w-auto shadow-[0_1px_0_rgba(22,18,14,.06)] transition-[transform,box-shadow] duration-300 ease-out will-change-transform hover:shadow-[0_30px_60px_-28px_rgba(42,29,20,.55)]"
          data-testid={`shop-${p.id}`}
        >
          {p.badge && <span className="absolute left-5 top-5 z-10 rounded-full bg-flame px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">{p.badge}</span>}
          <PackStack count={p.packs} className="rounded-2xl bg-paper-2" />
          <div className="mt-5 flex items-baseline justify-between gap-2">
            <h3 className="font-display text-2xl font-black">{p.size}</h3>
            <p className="font-display text-2xl font-black tabular-nums">
              {p.mrp && <span className="mr-2 text-base font-normal text-ink-soft line-through">₹{p.mrp}</span>}₹{p.price}
            </p>
          </div>
          <p className="mt-1 text-sm text-ink-soft">{p.packs > 1 ? `${p.packs} cones · ₹${Math.round(p.price / p.packs)} each` : "1 cone · MRP ₹15"}{p.off ? ` · ${p.off}% off` : ""}</p>
          <button onClick={() => onAdd(p.id)} className="btn btn-ink relative mt-5 w-full overflow-hidden" data-testid={`add-${p.id}`}>
            <span className={`flex items-center gap-2 transition-all duration-300 ${justAdded === p.id ? "-translate-y-8 opacity-0" : ""}`}><ShoppingBag className="h-4 w-4" /> Add to cart</span>
            <span className={`absolute inset-0 flex items-center justify-center gap-2 transition-all duration-300 ${justAdded === p.id ? "" : "translate-y-8 opacity-0"}`}><Check className="h-4 w-4" /> Added!</span>
          </button>
        </article>
      ))}
    </div>
  );
}

/** Radio-card size picker (product page). */
export function SizePicker({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  return (
    <div role="radiogroup" aria-label="Choose a size" className="grid grid-cols-2 gap-3">
      {SHOP_PRODUCTS.map((p) => {
        const on = value === p.id;
        return (
          <button
            key={p.id}
            role="radio"
            aria-checked={on}
            onClick={() => onChange(p.id)}
            className={`relative rounded-2xl border-2 p-4 text-left transition ${on ? "border-ink bg-paper" : "border-ink/10 bg-paper-2 hover:border-ink/30"}`}
            data-testid={`size-${p.id}`}
          >
            {p.badge && <span className="absolute -top-2.5 right-3 rounded-full bg-flame px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">{p.badge}</span>}
            <span className="block font-display text-lg font-black">{p.size}</span>
            <span className="mt-0.5 block text-sm text-ink-soft">₹{p.price}{p.packs > 1 ? ` · ${p.packs} packs` : ""}{p.off ? ` · ${p.off}% off` : ""}</span>
          </button>
        );
      })}
    </div>
  );
}

