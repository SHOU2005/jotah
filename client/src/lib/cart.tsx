import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { MAX_QTY, PRODUCTS, type Product } from "@shared/products";

export interface CartLine extends Product { qty: number }

interface CartCtx {
  lines: CartLine[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  bump: number; // increments on every add — drives the badge animation
  open: () => void;
  close: () => void;
  add: (id: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
}

const Ctx = createContext<CartCtx | null>(null);
const KEY = "jotah-cart-v1";

function load(): Record<string, number> {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "{}");
    const out: Record<string, number> = {};
    for (const [id, q] of Object.entries(raw)) {
      if (PRODUCTS[id] && !PRODUCTS[id].hidden && typeof q === "number" && q > 0) out[id] = Math.min(MAX_QTY, Math.floor(q));
    }
    return out;
  } catch {
    return {};
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  // Start empty so server-rendered HTML and the first client render match,
  // then restore the saved cart right after mount.
  const [qtys, setQtys] = useState<Record<string, number>>({});
  const [isOpen, setOpen] = useState(false);
  const [bump, setBump] = useState(0);
  const loaded = useRef(false);

  useEffect(() => {
    setQtys(load());
    loaded.current = true;
  }, []);
  useEffect(() => {
    if (!loaded.current) return;
    try { localStorage.setItem(KEY, JSON.stringify(qtys)); } catch {}
  }, [qtys]);

  const add = useCallback((id: string, qty = 1) => {
    if (!PRODUCTS[id] || PRODUCTS[id].hidden) return;
    setQtys((q) => ({ ...q, [id]: Math.min(MAX_QTY, (q[id] || 0) + qty) }));
    setBump((b) => b + 1);
  }, []);
  const setQty = useCallback((id: string, qty: number) => {
    setQtys((q) => {
      const next = { ...q };
      if (qty <= 0) delete next[id];
      else next[id] = Math.min(MAX_QTY, Math.floor(qty));
      return next;
    });
  }, []);
  const remove = useCallback((id: string) => setQty(id, 0), [setQty]);
  const clear = useCallback(() => setQtys({}), []);

  const value = useMemo<CartCtx>(() => {
    const lines = Object.entries(qtys).map(([id, qty]) => ({ ...PRODUCTS[id], qty }));
    return {
      lines,
      count: lines.reduce((s, l) => s + l.qty, 0),
      subtotal: lines.reduce((s, l) => s + l.qty * l.price, 0),
      isOpen,
      bump,
      open: () => setOpen(true),
      close: () => setOpen(false),
      add, setQty, remove, clear,
    };
  }, [qtys, isOpen, bump, add, setQty, remove, clear]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
}
