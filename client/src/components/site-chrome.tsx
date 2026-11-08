import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { Phone, Mail, MapPin } from "lucide-react";
import { JMark, Wordmark, WhatsAppIcon } from "./brand";
import { ADDRESS, CALL_URL, EMAIL, PHONE_DISPLAY, WHATSAPP_URL } from "@/lib/contact";

/** Thin flame-coloured bar at the top showing scroll progress. */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (ref.current) ref.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, []);
  return <div ref={ref} aria-hidden className="fixed left-0 top-0 z-[60] h-[3px] w-full origin-left scale-x-0 bg-flame" />;
}

/** Floating WhatsApp button, pre-filled with "What The Fun". */
export function WhatsAppFloat() {
  const [location] = useLocation();
  if (location === "/checkout" || location.startsWith("/admin")) return null; // keep checkout & admin clear
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Jotah on WhatsApp"
      className="wa-pulse group fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-wa p-4 text-[#06260f] shadow-xl transition-transform hover:scale-105 sm:bottom-6 sm:right-6"
      data-testid="whatsapp-float"
    >
      <WhatsAppIcon className="h-6 w-6" />
      <span className="hidden pr-1 text-sm font-semibold sm:inline">What The Fun?</span>
    </a>
  );
}

const AGE_KEY = "jotah-age-ok";

/** 18+ gate — the pack says “Not for sale to minors”. */
export function AgeGate() {
  const [location] = useLocation();
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(AGE_KEY) !== "1") setShow(true);
    } catch {
      setShow(true);
    }
  }, []);

  useEffect(() => {
    document.body.style.overflow = show ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [show]);

  if (!show || location.startsWith("/admin")) return null;

  const accept = () => {
    try { localStorage.setItem(AGE_KEY, "1"); } catch {}
    setShow(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="age-title">
      <div className="kraft-texture w-full max-w-md overflow-hidden rounded-3xl bg-kraft p-8 text-center text-ink shadow-2xl sm:p-10">
        <JMark className="mx-auto mb-5 h-14 w-14" />
        <p className="eyebrow mb-3 !text-ink">Jotah Pvt. Ltd.</p>
        <h2 id="age-title" className="display mb-4 text-4xl">Are you 18 or older?</h2>
        <p className="mb-8 text-sm text-ink-soft">Our products are not for sale to minors. Please confirm your age to enter.</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button onClick={accept} className="btn btn-ink flex-1" data-testid="age-yes" autoFocus>Yes, I'm 18+</button>
          <a href="https://www.google.com" className="btn btn-ghost flex-1" data-testid="age-no">No</a>
        </div>
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Wordmark className="text-paper" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-paper/70">
              India's own rolling paper. Slow burn, France paper, 13.8 GSM — packed in Gurugram.
            </p>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn btn-wa mt-6">
              <WhatsAppIcon /> What The Fun?
            </a>
          </div>
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-paper/50">Explore</p>
            <ul className="space-y-3 text-sm">
              <li><a className="hover:text-kraft" href="/#pack">The Pack</a></li>
              <li><a className="hover:text-kraft" href="/#shop">Shop</a></li>
              <li><a className="hover:text-kraft" href="/product">Product details</a></li>
              <li><a className="hover:text-kraft" href="/guides">Rolling paper guides</a></li>
              <li><a className="hover:text-kraft" href="/what-the-fun">What The Fun</a></li>
              <li><a className="hover:text-kraft" href="/#buy">Where to buy</a></li>
            </ul>
          </div>
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-paper/50">Contact</p>
            <ul className="space-y-3 text-sm">
              <li><a className="flex items-center gap-2 hover:text-kraft" href={CALL_URL}><Phone className="h-4 w-4" />{PHONE_DISPLAY}</a></li>
              <li><a className="flex items-center gap-2 hover:text-kraft" href={`mailto:${EMAIL}`}><Mail className="h-4 w-4" />{EMAIL}</a></li>
              <li className="flex items-start gap-2 text-paper/70"><MapPin className="mt-0.5 h-4 w-4 shrink-0" />{ADDRESS}</li>
            </ul>
          </div>
        </div>
        <div className="mt-14 flex flex-col gap-3 border-t border-paper/15 pt-6 text-xs text-paper/50 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Jotah Pvt. Ltd. All rights reserved.</p>
          <p className="font-semibold uppercase tracking-widest">18+ only · Not for sale to minors</p>
        </div>
      </div>
    </footer>
  );
}
