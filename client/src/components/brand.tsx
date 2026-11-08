import { useEffect, useRef, type ReactNode } from "react";

/** The "J with leaves" mark from the front of the pack. */
export function JMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 50" className={className} fill="currentColor" aria-hidden="true">
      <path d="M27 2h6v28c0 12-6 18-16 18v-6c6 0 10-4 10-12z" />
      <path d="M17 42c-7 0-12-5-13-12 6 1 11 5 13 12z" />
      <path d="M15 46c-6 3-12 2-15-2 5-3 10-2 15 2z" />
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <JMark className="h-7 w-7" />
      <span className="font-display text-xl font-extrabold tracking-[0.18em]" style={{ fontStretch: "120%" }}>
        JOTAH
      </span>
    </span>
  );
}

export function WhatsAppIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35zM12.04 21.5h-.01a9.45 9.45 0 0 1-4.82-1.32l-.35-.2-3.58.94.96-3.49-.23-.36a9.44 9.44 0 0 1-1.45-5.03c0-5.22 4.25-9.47 9.48-9.47a9.4 9.4 0 0 1 6.7 2.78 9.4 9.4 0 0 1 2.77 6.7c0 5.22-4.25 9.46-9.47 9.46zm8.06-17.53A11.33 11.33 0 0 0 12.04.63C5.76.63.65 5.73.65 12.01c0 2 .52 3.96 1.52 5.69L.55 23.6l6.04-1.58a11.36 11.36 0 0 0 5.44 1.39h.01c6.28 0 11.39-5.11 11.39-11.39 0-3.04-1.19-5.9-3.33-8.05z" />
    </svg>
  );
}

/** The three icons printed on the side of the pack. */
export function FlameIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M12 2c1 3.5 5 5.8 5 11a5 5 0 0 1-10 0c0-2.4 1.2-4 2.4-5.2.2 1.6 1 2.7 2 3.2-.7-3.3 0-6.4.6-9z" fill="var(--flame)" />
      <path d="M12 14c.6 1.4 2 2 2 3.6a2 2 0 0 1-4 0c0-1.2.8-2 2-3.6z" fill="#FFB199" />
    </svg>
  );
}

export function FranceFlag({ className = "h-6 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 30 20" className={className} aria-hidden="true">
      <rect width="10" height="20" fill="var(--fr-blue)" />
      <rect x="10" width="10" height="20" fill="#fff" />
      <rect x="20" width="10" height="20" fill="var(--flame)" />
    </svg>
  );
}

export function ThinIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <path d="M2 12h11M9 8l4 4-4 4M30 12H19M23 8l-4 4 4 4M15 3v18M17 3v18" />
    </svg>
  );
}

/** "What The Fun" set like the pack: big initials, small rest. */
export function WtfWordmark({ className = "" }: { className?: string }) {
  // Mirrors the pack: big initials, small caps for the rest.
  const word = (big: string, rest: string) => (
    <span className="whitespace-nowrap">
      <span className="text-[1em]">{big}</span>
      <span className="text-[0.55em]">{rest}</span>
    </span>
  );
  return (
    <span className={`font-display font-black uppercase leading-none ${className}`} style={{ fontStretch: "100%", letterSpacing: "-0.01em" }}>
      {word("W", "hat")} {word("T", "he")} {word("F", "un")}
    </span>
  );
}

/** Fades children in as they scroll into view. */
export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/** A crisp illustration of stacked Jotah packs with a ×N badge. */
export function PackStack({ count, className = "" }: { count: number; className?: string }) {
  const layers = Math.min(count, 4);
  return (
    <div className={`relative flex aspect-[16/10] items-center justify-center ${className}`} aria-hidden>
      <div className="relative w-[78%]" style={{ height: `${22 + (layers - 1) * 9}%` }}>
        {Array.from({ length: layers }).map((_, i) => {
          const fromTop = layers - 1 - i; // 0 = top pack
          return (
            <div
              key={i}
              className="pack-face kraft-texture absolute inset-x-0 flex items-center rounded-[3px] text-ink transition-transform duration-500 group-hover:-translate-y-1"
              style={{
                height: "clamp(26px, 22%, 44px)",
                top: `${fromTop * 9 * (100 / (22 + (layers - 1) * 9))}%`,
                transform: `rotate(${fromTop % 2 ? 1.2 : -1.6}deg) translateX(${fromTop * 3}px)`,
                zIndex: layers - fromTop,
                boxShadow: "0 6px 14px -8px rgba(42,29,20,.6), inset 0 0 0 1px rgba(80,50,25,.18)",
              }}
            >
              {fromTop === 0 && (
                <>
                  <JMark className="ml-[5%] h-[62%] w-auto" />
                  <span className="absolute left-1/2 -translate-x-1/2 font-display text-[clamp(10px,2.4vw,16px)] font-extrabold tracking-[0.14em]">JOTAH</span>
                </>
              )}
            </div>
          );
        })}
      </div>
      {count > 1 && (
        <span className="absolute right-[5%] top-[7%] z-20 flex h-12 w-12 rotate-12 items-center justify-center rounded-full bg-ink font-display text-lg font-black text-paper shadow-lg">
          ×{count}
        </span>
      )}
    </div>
  );
}

// Fixed jagged outline (deterministic so prerendered HTML matches the browser).
const TORN_PATH = (() => {
  let seed = 7;
  const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
  let d = "M0 24 L0 12";
  for (let x = 0; x <= 1200; x += 18 + Math.round(rnd() * 22)) d += ` L${x} ${(4 + rnd() * 14).toFixed(1)}`;
  return d + " L1200 10 L1200 24 Z";
})();

/** Torn kraft-paper edge between two sections. `bg` = colour behind the tear, `fill` = the torn sheet. */
export function TornEdge({ fill, bg, flip = false }: { fill: string; bg: string; flip?: boolean }) {
  return (
    <div aria-hidden className={`relative z-[1] -my-px ${bg}`}>
      <svg viewBox="0 0 1200 24" preserveAspectRatio="none" className={`block h-3 w-full sm:h-5 ${flip ? "rotate-180" : ""}`}>
        <path d={TORN_PATH} fill={fill} />
      </svg>
    </div>
  );
}

/** Image that drifts slightly as you scroll (respects reduced motion). */
export function ParallaxImg({ src, alt, className = "", strength = 40 }: { src: string; alt: string; className?: string; strength?: number }) {
  const ref = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const img = ref.current;
    if (!img || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = img.parentElement!.getBoundingClientRect();
      const p = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight; // -1..1
      img.style.transform = `translate3d(0, ${(-p * strength).toFixed(1)}px, 0) scale(1.15)`;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(raf); };
  }, [strength]);
  return <img ref={ref} src={src} alt={alt} loading="lazy" className={`h-full w-full scale-[1.15] object-cover will-change-transform ${className}`} />;
}
