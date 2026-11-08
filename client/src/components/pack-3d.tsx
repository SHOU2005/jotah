import { useEffect, useRef, useState } from "react";
import { FlameIcon, FranceFlag, JMark, ThinIcon, WtfWordmark } from "./brand";
import { EMAIL } from "@/lib/contact";

/**
 * A 3D Jotah pack rendered in CSS. It spins on its long axis like the real
 * box, auto-rotates, and can be dragged/swiped. All four long faces match the
 * printed pack (front, What The Fun, specs, back) with the current contacts.
 */
export default function Pack3D() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(520);

  // Size the pack to its container
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.min(560, Math.round(e.contentRect.width * 0.9))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Spin loop + drag
  useEffect(() => {
    const wrap = wrapRef.current;
    const box = boxRef.current;
    if (!wrap || !box) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let angle = -8;
    let tiltY = -22;
    let velocity = reduce ? 0 : 0.35;
    let dragging = false;
    let lastX = 0, lastY = 0;
    let idleTimer = 0;
    let tiltTarget = -22;
    const onMouse = (e: MouseEvent) => {
      const r = wrap.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / window.innerWidth;
      tiltTarget = Math.max(-40, Math.min(-4, -22 + dx * 36));
    };
    if (!reduce) window.addEventListener("mousemove", onMouse, { passive: true });
    let raf = 0;

    const render = () => {
      box.style.transform = `rotateZ(-7deg) rotateY(${tiltY}deg) rotateX(${angle}deg)`;
    };
    const tick = () => {
      if (!dragging) {
        angle += velocity;
        // ease velocity back to the gentle auto-spin
        const target = reduce ? 0 : 0.35;
        velocity += (target - velocity) * 0.02;
        tiltY += (tiltTarget - tiltY) * 0.05;
      }
      render();
      raf = requestAnimationFrame(tick);
    };

    const down = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX; lastY = e.clientY;
      wrap.setPointerCapture(e.pointerId);
      window.clearTimeout(idleTimer);
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const dy = e.clientY - lastY;
      const dx = e.clientX - lastX;
      lastX = e.clientX; lastY = e.clientY;
      // vertical drag spins the pack; horizontal drag tilts it
      const d = Math.abs(dy) > Math.abs(dx) * 0.6 ? -dy : dx;
      angle += d * 0.6;
      velocity = d * 0.6;
      tiltY = Math.max(-40, Math.min(0, tiltY + dx * 0.1));
    };
    const up = () => { dragging = false; };

    wrap.addEventListener("pointerdown", down);
    wrap.addEventListener("pointermove", move);
    wrap.addEventListener("pointerup", up);
    wrap.addEventListener("pointercancel", up);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouse);
      wrap.removeEventListener("pointerdown", down);
      wrap.removeEventListener("pointermove", move);
      wrap.removeEventListener("pointerup", up);
      wrap.removeEventListener("pointercancel", up);
    };
  }, []);

  const h = Math.round(w / 6.6); // cross-section of the pack
  const face = (rot: number, children: React.ReactNode, label: string) => (
    <div
      aria-label={label}
      className="pack-face kraft-texture absolute left-0 top-0 flex items-center overflow-hidden text-ink"
      style={{ width: w, height: h, transform: `rotateX(${rot}deg) translateZ(${h / 2}px)` }}
    >
      {children}
    </div>
  );
  const cap = (side: 1 | -1) => (
    <div
      className="pack-face pack-cap kraft-texture absolute top-0"
      style={{ width: h, height: h, left: (w - h) / 2, transform: `rotateY(${side * 90}deg) translateZ(${w / 2}px)` }}
    />
  );
  const fs = (k: number) => `${(w * k).toFixed(1)}px`;

  return (
    <div
      ref={wrapRef}
      className="relative flex h-[300px] w-full cursor-grab touch-pan-y select-none items-center justify-center active:cursor-grabbing sm:h-[380px]"
      style={{ perspective: 1400 }}
      role="img"
      aria-label="3D Jotah pre-rolled cone pack — drag to spin"
    >
      {/* floor shadow */}
      <div aria-hidden className="absolute left-1/2 top-[68%] h-10 -translate-x-1/2 rounded-[50%] bg-wood/35 blur-2xl" style={{ width: w * 0.85 }} />

      <div ref={boxRef} className="relative" style={{ width: w, height: h, transformStyle: "preserve-3d" }}>
        {/* FRONT */}
        {face(0, (
          <div className="relative flex h-full w-full items-center justify-center">
            <span className="absolute" style={{ left: fs(0.035), height: h * 0.62, width: h * 0.5 }}>
              <JMark className="h-full w-full" />
            </span>
            <span className="font-display font-extrabold tracking-[0.12em]" style={{ fontSize: fs(0.065), fontStretch: "112%" }}>JOTAH</span>
          </div>
        ), "Front: Jotah")}

        {/* TOP — What The Fun */}
        {face(-90, (
          <div className="flex h-full w-full items-center justify-between" style={{ paddingInline: fs(0.035) }}>
            <span style={{ fontSize: fs(0.058) }}><WtfWordmark /></span>
            <div className="flex flex-1 items-center" style={{ marginInline: fs(0.02) }}>
              <div className="relative h-px flex-1 bg-ink">
                <span className="absolute -top-[1.4em] left-1/2 -translate-x-1/2 whitespace-nowrap font-semibold" style={{ fontSize: fs(0.017) }}>SCAN FOR SURPRISE</span>
                <span className="absolute -right-0.5 top-1/2 -translate-y-1/2 border-y-[5px] border-l-[9px] border-y-transparent border-l-ink" />
              </div>
            </div>
            <img src="/images/qr.jpg" alt="" draggable={false} className="rounded-[2px] bg-white p-[2px]" style={{ height: h * 0.72, width: h * 0.72 }} />
          </div>
        ), "Top: What The Fun, scan for surprise")}

        {/* BACK */}
        {face(-180, (
          <div className="grid h-full w-full grid-cols-[1.1fr_1fr_1fr] items-center leading-tight" style={{ paddingInline: fs(0.03), fontSize: fs(0.0165) }}>
            <div>
              <p className="font-bold">MARKETED AND PACKED BY</p>
              <p className="mt-[0.4em] font-bold">JOTAH PVT. LTD.</p>
              <p>WEWORK FORUM, CYBERCITY</p>
              <p>GURUGRAM-122002</p>
            </div>
            <div>
              <p className="font-bold">CONTACT:</p>
              <p>+91-92056 17375</p>
              <p className="mt-[0.4em] font-bold">EMAIL:</p>
              <p className="truncate">{EMAIL.toUpperCase()}</p>
            </div>
            <div>
              <p><span className="font-bold">M.R.P.</span> <span className="font-display font-black" style={{ fontSize: "1.6em" }}>₹ 15/-</span></p>
              <p>INCLUSIVE OF ALL TAXES</p>
              <p className="mt-[0.6em]">*NOT FOR SALE TO MINORS</p>
            </div>
          </div>
        ), "Back: MRP ₹15, marketed and packed by Jotah Pvt. Ltd.")}

        {/* BOTTOM — specs */}
        {face(-270, (
          <div className="grid h-full w-full grid-cols-3 items-center text-center font-bold" style={{ fontSize: fs(0.02) }}>
            <div className="flex flex-col items-center gap-[0.3em] border-r border-ink/70 py-[0.2em]">
              <FlameIcon className="h-[2.2em] w-[2.2em]" />SLOW BURN
            </div>
            <div className="flex flex-col items-center gap-[0.3em] border-r border-ink/70 py-[0.2em]">
              <FranceFlag className="h-[1.6em] w-[2.4em]" />FRANCE PAPER
            </div>
            <div className="flex flex-col items-center gap-[0.3em]">
              <ThinIcon className="h-[2em] w-[2.4em]" />13.8 GSM
            </div>
          </div>
        ), "Side: Slow burn, France paper, 13.8 GSM")}

        {cap(1)}
        {cap(-1)}
      </div>

      <p className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.25em] text-ink-soft">
        ↻ Drag to spin
      </p>
    </div>
  );
}
