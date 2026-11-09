import { useState } from "react";
import { ArrowRight, ArrowUpRight, Phone, Mail, MapPin, Plus, ShoppingBag } from "lucide-react";
import { FlameIcon, FranceFlag, JMark, ParallaxImg, Reveal, ThinIcon, WhatsAppIcon, WtfWordmark } from "./brand";
import Pack3D from "./pack-3d";
import StackGame from "./stack-game";
import Leaderboard from "./leaderboard";
import { INSTAGRAM_URL, INSTAGRAM_HANDLE } from "@/lib/contact";
import { Instagram } from "lucide-react";
import { useCart } from "@/lib/cart";
import { AddToCart, ShopGrid } from "./cart";
import { DEFAULT_PRODUCT } from "@shared/products";
import { GUIDES } from "@shared/guides";
import { JsonLd } from "./json-ld";
import { Link } from "wouter";
export { WtfWordmark };
import { ADDRESS, CALL_URL, EMAIL, PHONE_DISPLAY, STORES, WHATSAPP_URL, whatsappLink } from "@/lib/contact";

/* ───────────────────────── HERO ───────────────────────── */
export function Hero() {
  const { add, open } = useCart();
  const buyNow = () => { add(DEFAULT_PRODUCT.id, 1); setTimeout(open, 250); };
  return (
    <section className="kraft-texture relative overflow-hidden bg-paper pb-16 pt-28 md:pb-24 md:pt-36">
      <div aria-hidden className="pointer-events-none absolute -right-32 top-10 h-[520px] w-[520px] rounded-full bg-kraft/50 blur-3xl" />
      <p aria-hidden className="pointer-events-none absolute -bottom-[0.18em] left-1/2 -translate-x-1/2 select-none whitespace-nowrap font-display text-[30vw] font-black leading-none text-transparent [-webkit-text-stroke:1.5px_rgba(22,18,14,.09)] lg:text-[22vw]" style={{ fontStretch: "125%" }}>JOTAH</p>
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:px-8">
        <div>
          <p className="hero-in eyebrow mb-6 flex items-center gap-3" style={{ animationDelay: "0ms" }}>
            <span className="inline-block h-px w-10 bg-ink" /> Made in India · MRP ₹15
          </p>
          <h1 className="hero-in display text-[clamp(3rem,7vw,6.25rem)] text-ink" style={{ animationDelay: "120ms" }}>
            India's own<br />
            pre-rolled <span className="relative inline-block">
              cone.
              <svg aria-hidden viewBox="0 0 300 20" className="absolute -bottom-2 left-0 w-full" preserveAspectRatio="none">
                <path className="draw-line" d="M2 14 C 80 4, 200 4, 298 12" stroke="var(--flame)" strokeWidth="6" fill="none" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
          <p className="hero-in mt-8 max-w-xl text-lg leading-relaxed text-ink-soft md:text-xl" style={{ animationDelay: "260ms" }}>
            Ready-made cones of ultra-thin <strong className="text-ink">13.8 GSM</strong> paper from <strong className="text-ink">France</strong>.
            No rolling, no mess — just a slow, even burn. Packed in Gurugram.
          </p>
          <div className="hero-in mt-10 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: "380ms" }}>
            <button onClick={buyNow} className="btn btn-ink group text-base" data-testid="hero-buy">
              <ShoppingBag className="h-5 w-5 transition-transform group-hover:-rotate-12" /> Buy 5-Pack · ₹75
            </button>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn btn-wa text-base" data-testid="hero-whatsapp">
              <WhatsAppIcon /> Say “What The Fun”
            </a>
          </div>
          <dl className="hero-in mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-[color:var(--border)] pt-6">
            {[
              ["13.8", "GSM thin"],
              ["FR", "France paper"],
              ["₹15", "Per cone"],
            ].map(([v, l]) => (
              <div key={l}>
                <dt className="sr-only">{l}</dt>
                <dd className="font-display text-3xl font-black" style={{ fontStretch: "115%" }}>{v}</dd>
                <dd className="mt-1 text-xs uppercase tracking-widest text-ink-soft">{l}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="hero-in relative mx-auto w-full max-w-xl" style={{ animationDelay: "200ms" }}>
          <Pack3D />
          <div className="animate-spin-slow-badge absolute right-0 top-0 flex h-24 w-24 rotate-12 flex-col items-center justify-center rounded-full bg-flame text-white shadow-xl sm:h-28 sm:w-28">
            <span className="text-[10px] font-semibold uppercase tracking-widest">MRP</span>
            <span className="font-display text-3xl font-black leading-none">₹15</span>
            <span className="text-[9px] uppercase tracking-wider opacity-80">all taxes incl.</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── MARQUEE ───────────────────────── */
export function Marquee() {
  const items = ["Slow burn", "France paper", "13.8 GSM", "Made in India", "What The Fun", "No rolling needed", "₹15 a cone"];
  const strip = (cls: string, dir: "" | "marquee-reverse", star: string) => (
    <div className={`marquee-track ${dir} flex w-max gap-10 whitespace-nowrap py-4`}>
      {[...items, ...items, ...items, ...items].map((t, i) => (
        <span key={i} className={`flex items-center gap-10 font-display text-2xl font-black uppercase md:text-4xl ${cls}`} style={{ fontStretch: "120%" }}>
          {t} <span className={star}>✦</span>
        </span>
      ))}
    </div>
  );
  return (
    <div className="relative h-36 overflow-hidden bg-paper md:h-44" aria-hidden>
      <div className="absolute -left-[5%] top-1/2 w-[110%] -translate-y-1/2 rotate-[3deg] bg-flame shadow-xl">{strip("text-white", "marquee-reverse", "text-ink")}</div>
      <div className="absolute -left-[5%] top-1/2 w-[110%] -translate-y-1/2 -rotate-[2deg] bg-ink shadow-2xl">{strip("text-paper", "", "text-kraft")}</div>
    </div>
  );
}

/* ───────────────────────── STORY ───────────────────────── */
export function Story() {
  return (
    <section id="story" className="bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="eyebrow mb-8">Our story</p>
          <p className="max-w-5xl font-display text-[clamp(1.9rem,4.2vw,3.6rem)] font-extrabold leading-[1.08] tracking-tight" style={{ fontStretch: "108%" }}>
            Every great session starts with the paper. For too long, ours came from somewhere else — and rolling it yourself was half the work.{" "}
            <span className="text-ink-soft/60">So we built Jotah — pre-rolled cones made for India, priced for India, and proud of it.</span>
          </p>
        </Reveal>
        <div className="mt-20 grid gap-px overflow-hidden rounded-3xl border border-[color:var(--border)] bg-[color:var(--border)] md:grid-cols-3">
          {[
            ["01", "Paper first", "Fine French paper at 13.8 GSM — thin enough that you taste your blend, not the paper."],
            ["02", "Burns slow", "An even, slow burn so nothing runs, nothing canoes, and the moment lasts."],
            ["03", "Fair price", "A premium cone for ₹15 MRP, inclusive of all taxes. No import mark-up."],
          ].map(([n, t, d], i) => (
            <Reveal key={n} delay={i * 120} className="bg-paper p-8 md:p-10">
              <p className="font-display text-sm font-black text-flame">{n}</p>
              <h3 className="mt-6 text-2xl font-extrabold">{t}</h3>
              <p className="mt-3 leading-relaxed text-ink-soft">{d}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── LOOKBOOK ───────────────────────── */
export function Lookbook() {
  const tile = "group relative overflow-hidden rounded-3xl bg-wood";
  return (
    <section id="lookbook" className="relative overflow-hidden bg-ink py-24 text-paper md:py-32">
      <div aria-hidden className="pointer-events-none absolute -left-40 top-0 h-[480px] w-[480px] rounded-full bg-flame/20 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <h2 className="display text-[clamp(2.8rem,7vw,6rem)]">No rolling.<br /><span className="text-kraft">Just fill, twist, light.</span></h2>
          <p className="max-w-xs text-paper/70">Ready-made cones of ultra-thin France paper. One cone per pack, ₹15.</p>
        </Reveal>
        <div className="grid auto-rows-[180px] gap-4 sm:auto-rows-[220px] md:grid-cols-4">
          <Reveal className={`${tile} md:col-span-2 md:row-span-2`}>
            <ParallaxImg src="/images/cones/box-moody.jpg" alt="Jotah pack on dark stone" />
            <span className="absolute bottom-5 left-5 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold uppercase tracking-widest backdrop-blur">The pack</span>
          </Reveal>
          <Reveal delay={80} className={`${tile} md:col-span-2`}>
            <ParallaxImg src="/images/cones/cone-tips.jpg" alt="Jotah cone tips close-up" strength={30} />
            <span className="absolute bottom-5 left-5 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold uppercase tracking-widest backdrop-blur">The tip</span>
          </Reveal>
          <Reveal delay={160} className={tile}>
            <ParallaxImg src="/images/cones/cone-end.jpg" alt="Open end of a Jotah cone" strength={24} />
          </Reveal>
          <Reveal delay={240} className="relative flex items-center justify-center overflow-hidden rounded-3xl bg-flame p-6 text-center">
            <div>
              <p className="font-display text-6xl font-black leading-none">₹15</p>
              <p className="mt-2 text-sm font-semibold uppercase tracking-widest text-white/80">per cone</p>
              <a href="#shop" className="mt-4 inline-flex items-center gap-1 rounded-full bg-white px-4 py-2 text-sm font-bold text-ink transition hover:scale-105">Shop now <ArrowRight className="h-4 w-4" /></a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── SPECS ───────────────────────── */
export function Specs() {
  const specs = [
    { icon: <FlameIcon className="h-10 w-10" />, title: "Slow Burn", text: "Even and steady from first light to last pull." },
    { icon: <FranceFlag className="h-8 w-12 rounded-sm shadow" />, title: "France Paper", text: "Fine paper sourced from France for a clean taste." },
    { icon: <ThinIcon className="h-10 w-12" />, title: "13.8 GSM", text: "Ultra-thin. Less paper, more of what matters." },
  ];
  return (
    <section id="specs" className="kraft-texture bg-kraft py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-end gap-10 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow mb-5 !text-ink">What's inside</p>
            <h2 className="display text-[clamp(2.6rem,6vw,5rem)]">Three things.<br />Done properly.</h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="max-w-md text-lg leading-relaxed text-ink/80 lg:ml-auto">
              Printed right on the side of every pack — because we're proud of them.
            </p>
          </Reveal>
        </div>
        <div className="mt-10 grid gap-3 md:mt-14 md:grid-cols-3 md:gap-5">
          {specs.map((s, i) => (
            <Reveal key={s.title} delay={i * 120}>
              <article className="flex h-full items-center gap-5 rounded-3xl bg-paper/70 p-5 backdrop-blur transition-transform duration-300 hover:-translate-y-1 md:block md:p-8">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center md:h-16 md:w-auto md:justify-start">{s.icon}</div>
                <div>
                <h3 className="text-xl font-black uppercase md:mt-6 md:text-3xl" style={{ fontStretch: "118%" }}>{s.title}</h3>
                <p className="mt-1 text-sm text-ink-soft md:mt-3 md:text-base">{s.text}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-10">
          <div className="photo-frame">
            <img src="/images/cones/box-specs-new.jpg" alt="Side of the Jotah pack: Slow Burn, France Paper, 13.8 GSM" className="aspect-[754/172] w-full object-cover" loading="lazy" width={754} height={172} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────────────────── PACK GALLERY ───────────────────────── */
export function PackGallery() {
  const shots = [
    { src: "/images/cones/hero-box-cones.jpg", label: "The cone", title: "Ready to fill", text: "No rolling. Just fill, twist, light." },
    { src: "/images/cones/cone-tips.jpg", label: "The tip", title: "Built-in tip", text: "A firm tip for a clean, easy draw." },
    { src: "/images/cones/cones-stone.jpg", label: "The paper", title: "Slow burn", text: "France paper, ultra-thin 13.8 GSM." },
    { src: "/images/cones/box-moody.jpg", label: "The pack", title: "₹15 a cone", text: "One cone per pack. Packed in Gurugram." },
  ];
  return (
    <section id="pack" className="bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow mb-5">The pack</p>
            <h2 className="display text-[clamp(2.6rem,6vw,5rem)]">Every side<br />says something.</h2>
          </div>
          <a href="/product" className="btn btn-ghost self-start md:self-auto">Product details <ArrowUpRight className="h-4 w-4" /></a>
        </Reveal>
        <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-2 md:gap-x-5 md:gap-y-10 md:overflow-visible md:px-0 md:pb-0">
          {shots.map((s, i) => (
            <Reveal key={s.label} delay={i * 90} className="w-[85%] shrink-0 snap-center md:w-auto">
              <figure className="group h-full">
                <div className="photo-frame">
                  <img src={s.src} alt={`Jotah pack ${s.label.toLowerCase()} — ${s.title}`} loading="lazy" className="aspect-[5/2] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                </div>
                <figcaption className="mt-4 flex items-baseline gap-3">
                  <span className="rounded-full border border-ink px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest">{s.label}</span>
                  <span className="font-display text-lg font-extrabold">{s.title}</span>
                  <span className="hidden text-sm text-ink-soft sm:inline">— {s.text}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── WHAT THE FUN ───────────────────────── */
export function WtfBand() {
  return (
    <section id="what-the-fun" className="relative overflow-hidden bg-ink py-24 text-paper md:py-32">
      <div aria-hidden className="pointer-events-none absolute -left-40 bottom-0 h-[420px] w-[420px] rounded-full bg-flame/25 blur-3xl" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.3fr_1fr] lg:px-8">
        <Reveal>
          <p className="mb-6 text-xs font-semibold uppercase tracking-[0.22em] text-paper/50">Scan for surprise →</p>
          <h2 className="text-[clamp(2.8rem,7vw,6rem)] leading-[0.95]"><WtfWordmark /></h2>
          <p className="mt-8 max-w-lg text-lg leading-relaxed text-paper/75">
            Every pack carries a QR code. Scan it — or skip the camera and just send us
            <strong className="text-paper"> “What The Fun” </strong>on WhatsApp. Something good is waiting.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn btn-wa text-base" data-testid="wtf-whatsapp">
              <WhatsAppIcon /> Send “What The Fun”
            </a>
            <a href="#play" className="btn btn-ghost-light text-base" data-testid="wtf-game">🎮 Play the game</a>
          </div>
        </Reveal>
        <Reveal delay={150} className="mx-auto hidden w-full max-w-sm md:block">
          <div className="kraft-texture rotate-3 rounded-[2rem] bg-kraft p-6 shadow-2xl transition-transform duration-500 hover:rotate-0 hover:scale-[1.03]">
            <div className="rounded-2xl bg-white p-4">
              <img src="/images/qr.jpg" alt="Jotah What The Fun QR code" className="aspect-square w-full" loading="lazy" />
            </div>
            <p className="mt-4 text-center text-sm font-bold uppercase tracking-[0.2em] text-ink">Point · Scan · Smile</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────────────────── SHOP ───────────────────────── */
export function Shop() {
  return (
    <section id="shop" className="bg-paper-2 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow mb-5">Shop</p>
            <h2 className="display text-[clamp(2.6rem,6vw,5rem)]">Pick your pack.</h2>
          </div>
          <p className="max-w-sm text-lg text-ink-soft">Same paper, every size. Cash or UPI on delivery.</p>
        </Reveal>
        <Reveal><ShopGrid /></Reveal>
      </div>
    </section>
  );
}

/* ───────────────────────── PLAY (game on the home page) ───────────────────────── */
export function PlaySection() {
  return (
    <section id="play" className="relative overflow-hidden bg-ink pb-24 pt-8 text-paper md:pb-32">
      <div aria-hidden className="pointer-events-none absolute -right-40 top-20 h-[460px] w-[460px] rounded-full bg-kraft/15 blur-3xl" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_auto] lg:px-8">
        <Reveal className="lg:max-w-lg">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-paper/50">Bored? Play.</p>
          <h2 className="display text-[clamp(2.8rem,6vw,5.2rem)]">Stack the<br />Packs.</h2>
          <p className="mt-6 text-lg leading-relaxed text-paper/75">
            Our little game. Drop each Jotah pack on the last one — miss and it gets thinner.
            Hit <strong className="text-paper">3 perfect drops</strong> in a row and it grows back. How high can you go?
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            {["👆 Tap to drop", "🎯 Perfect = combo", "🌙 Climb into the night", "🏆 Beat your best"].map((t) => (
              <span key={t} className="rounded-full border border-paper/15 px-4 py-2 text-paper/80">{t}</span>
            ))}
          </div>
          <Link href="/game" className="mt-8 inline-flex items-center gap-2 font-semibold text-paper/80 hover:text-paper">Open full screen <ArrowUpRight className="h-4 w-4" /></Link>
          <div className="mt-8 max-w-sm"><Leaderboard limit={5} /></div>
        </Reveal>
        <Reveal delay={120}><StackGame compact /></Reveal>
      </div>
    </section>
  );
}

/* ───────────────────────── WHERE TO BUY ───────────────────────── */
export function WhereToBuy() {
  return (
    <section id="buy" className="bg-paper-2 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-14 text-center">
          <p className="eyebrow mb-5">Get Jotah</p>
          <h2 className="display text-[clamp(2.6rem,6vw,5rem)]">At your door<br />in minutes.</h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-ink-soft">Order right here on our website, find Jotah on India's quick-commerce apps, or message us on WhatsApp.</p>
        </Reveal>
        <Reveal className="mb-5">
          <div className="kraft-texture grid items-center gap-8 overflow-hidden rounded-3xl bg-kraft p-8 md:grid-cols-[1fr_auto] md:p-10">
            <div>
              <p className="eyebrow mb-3 !text-ink">Fastest way</p>
              <h3 className="display text-4xl md:text-5xl">Order right here.</h3>
              <p className="mt-3 max-w-md text-ink/75">Add to cart, check out in 30 seconds, pay cash or UPI on delivery.</p>
            </div>
            <div className="flex w-full flex-col gap-3 md:w-[320px]"><AddToCart withQty={false} label="Add 5-Pack · ₹75" /><a href="#shop" className="btn btn-ghost w-full">See all sizes <ArrowRight className="h-4 w-4" /></a></div>
          </div>
        </Reveal>
        <div className="grid gap-5 md:grid-cols-3">
          {STORES.map((s, i) => (
            <Reveal key={s.name} delay={i * 100}>
              <a href={s.href} target="_blank" rel="noopener noreferrer" className="group flex h-full flex-col justify-between rounded-3xl bg-paper p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-24px_rgba(42,29,20,.45)]" data-testid={`store-${s.name.toLowerCase()}`}>
                <div className="flex items-center justify-between">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl font-display text-2xl font-black" style={{ background: s.color, color: s.ink ? "#16120E" : "#fff" }}>
                    {s.name[0]}
                  </span>
                  <ArrowUpRight className="h-6 w-6 text-ink-soft transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-ink" />
                </div>
                <div className="mt-10">
                  <h3 className="text-3xl font-black">{s.name}</h3>
                  <p className="mt-2 text-ink-soft">{s.tagline}</p>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-5">
          <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-ink p-8 text-paper md:flex-row md:items-center md:p-10">
            <div>
              <h3 className="text-2xl font-black md:text-3xl">Shop owner? Want Jotah in bulk?</h3>
              <p className="mt-2 text-paper/70">Retail, wholesale and distributor enquiries — straight to our team.</p>
            </div>
            <a href={whatsappLink("What The Fun — I want to stock Jotah in my shop.")} target="_blank" rel="noopener noreferrer" className="btn btn-wa shrink-0">
              <WhatsAppIcon /> Become a retailer
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────────────────── GUIDES TEASER ───────────────────────── */
export function GuidesTeaser() {
  return (
    <section id="guides" className="bg-paper-2 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow mb-5">Guides</p>
            <h2 className="display text-[clamp(2.6rem,6vw,5rem)]">Roll like a pro.</h2>
          </div>
          <Link href="/guides" className="btn btn-ghost self-start md:self-auto">All guides <ArrowRight className="h-4 w-4" /></Link>
        </Reveal>
        <div className="grid gap-5 md:grid-cols-3">
          {GUIDES.slice(0, 3).map((g, i) => (
            <Reveal key={g.slug} delay={i * 100}>
              <Link href={`/guides/${g.slug}`} className="group flex h-full flex-col justify-between rounded-3xl bg-paper p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-24px_rgba(42,29,20,.45)]">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-ink-soft">{g.readMins} min read</p>
                  <h3 className="mt-4 text-xl font-black leading-tight">{g.title}</h3>
                </div>
                <span className="mt-6 inline-flex items-center gap-2 font-semibold">Read <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── INSTAGRAM ───────────────────────── */
const IG_POSTS = [
  ["01-hero", "India's own pre-rolled cones"],
  ["05-game", "Stack the Packs game"],
  ["04-what-the-fun", "What The Fun QR surprise"],
  ["06-price", "₹15 a cone, made in India"],
  ["02-no-rolling", "No rolling — just fill, twist, light"],
  ["08-how-to-fill", "How to fill a cone"],
];

export function InstagramStrip() {
  return (
    <section id="instagram" className="bg-paper py-24 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow mb-5">Instagram</p>
            <h2 className="display text-[clamp(2.6rem,6vw,5rem)]">Follow the fun.</h2>
          </div>
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer me" className="btn btn-ink self-start md:self-auto" data-testid="ig-follow">
            <Instagram className="h-5 w-5" /> Follow {INSTAGRAM_HANDLE}
          </a>
        </Reveal>
        <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-6 md:overflow-visible md:px-0 md:pb-0">
          {IG_POSTS.map(([file, alt], i) => (
            <Reveal key={file} delay={i * 60} className="w-[46%] shrink-0 snap-start md:w-auto">
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="group relative block overflow-hidden rounded-2xl" aria-label={`${alt} — view on Instagram`}>
                <img src={`/images/ig/${file}.jpg`} alt={alt} loading="lazy" width={600} height={750} className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <span className="absolute inset-0 flex items-center justify-center bg-ink/0 text-paper opacity-0 transition group-hover:bg-ink/40 group-hover:opacity-100"><Instagram className="h-8 w-8" /></span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── FAQ (also feeds Google rich results) ───────────────────────── */
export const FAQS = [
  { q: "What are Jotah cones?", a: "Jotah cones are pre-rolled cones — ready-made, so you only fill and twist, no rolling needed. They are made from fine paper sourced from France at an ultra-thin 13.8 GSM, for a clean taste and a slow, even burn." },
  { q: "How much does Jotah cost?", a: "Each Jotah pack holds one pre-rolled cone and has an MRP of ₹15, inclusive of all taxes. Single packs are sold in shops; online you can order a 5-Pack (₹75), 10-Pack (₹150) or Box of 25 (₹375)." },
  { q: "Where can I buy Jotah?", a: "Search “Jotah” on Zepto, Blinkit or Swiggy Instamart, or order directly by messaging “What The Fun” to +91 92056 17375 on WhatsApp." },
  { q: "Is Jotah an Indian brand?", a: "Yes. Jotah is marketed and packed by Jotah Pvt. Ltd., WeWork Forum, Cybercity, Gurugram." },
  { q: "What is “What The Fun”?", a: "Every pack has a QR code marked “What The Fun — scan for surprise”. Scan it, or message “What The Fun” to us on WhatsApp to unlock it." },
  { q: "Can I sell Jotah in my shop?", a: "Yes — retailers and distributors can reach us on WhatsApp at +91 92056 17375 or email shourya.pandey.ai@gmail.com." },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="bg-paper py-24 md:py-32">
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      }} />
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.4fr] lg:px-8">
        <Reveal>
          <p className="eyebrow mb-5">FAQ</p>
          <h2 className="display text-[clamp(2.6rem,5vw,4.2rem)]">Good questions.</h2>
          <p className="mt-6 max-w-sm text-ink-soft">Anything else? Message us — we actually reply.</p>
        </Reveal>
        <div className="divide-y divide-[color:var(--border)] border-y border-[color:var(--border)]">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q}>
                <button onClick={() => setOpen(isOpen ? null : i)} className="flex w-full items-center justify-between gap-6 py-6 text-left" aria-expanded={isOpen}>
                  <h3 className="text-lg font-bold md:text-xl" style={{ fontStretch: "100%" }}>{f.q}</h3>
                  <Plus className={`h-5 w-5 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`} />
                </button>
                <div className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr] pb-6" : "grid-rows-[0fr]"}`}>
                  <p className="overflow-hidden leading-relaxed text-ink-soft">{f.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── CONTACT ───────────────────────── */
export function Contact() {
  const [form, setForm] = useState({ name: "", city: "", topic: "Buying Jotah", message: "" });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = [
      "What The Fun",
      "",
      form.name && `Name: ${form.name}`,
      form.city && `City: ${form.city}`,
      `Topic: ${form.topic}`,
      form.message && `\n${form.message}`,
    ].filter(Boolean);
    window.open(whatsappLink(lines.join("\n")), "_blank", "noopener,noreferrer");
  };

  const field = "w-full rounded-xl border border-[color:var(--input)] bg-paper px-4 py-3.5 text-ink placeholder:text-ink-soft/60 outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10";

  return (
    <section id="contact" className="kraft-texture bg-kraft py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <Reveal>
          <p className="eyebrow mb-5 !text-ink">Contact</p>
          <h2 className="display text-[clamp(2.6rem,6vw,5rem)]">Talk to us.</h2>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="mt-10 block font-display text-[clamp(2.2rem,5vw,3.8rem)] font-black leading-none hover:underline" style={{ fontStretch: "110%" }} data-testid="contact-phone-big">
            92056 17375
          </a>
          <p className="mt-3 text-ink/70">WhatsApp or call · we reply fast</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn btn-wa" data-testid="contact-whatsapp">
              <WhatsAppIcon /> WhatsApp “What The Fun”
            </a>
            <a href={CALL_URL} className="btn btn-ink" data-testid="contact-call">
              <Phone className="h-4 w-4" /> Call {PHONE_DISPLAY}
            </a>
          </div>
          <ul className="mt-12 space-y-4 text-ink/80">
            <li><a href={`mailto:${EMAIL}`} className="flex items-center gap-3 hover:text-ink"><Mail className="h-5 w-5" />{EMAIL}</a></li>
            <li className="flex items-start gap-3"><MapPin className="mt-0.5 h-5 w-5 shrink-0" />{ADDRESS}</li>
          </ul>
        </Reveal>

        <Reveal delay={120}>
          <form onSubmit={submit} className="rounded-3xl bg-paper p-6 shadow-[0_30px_60px_-30px_rgba(42,29,20,.5)] sm:p-10">
            <div className="mb-8 flex items-center gap-3">
              <JMark className="h-8 w-8" />
              <div>
                <p className="font-display text-xl font-black">Drop us a message</p>
                <p className="text-sm text-ink-soft">It opens WhatsApp with everything filled in.</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium">Your name</span>
                <input required value={form.name} onChange={set("name")} className={field} placeholder="Rahul" data-testid="input-name" />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium">City</span>
                <input value={form.city} onChange={set("city")} className={field} placeholder="Gurugram" data-testid="input-city" />
              </label>
            </div>
            <label className="mt-4 block">
              <span className="mb-1.5 block text-sm font-medium">What's it about?</span>
              <select value={form.topic} onChange={set("topic")} className={field} data-testid="select-topic">
                <option>Buying Jotah</option>
                <option>Retail / Wholesale</option>
                <option>Collab / Partnership</option>
                <option>Something else</option>
              </select>
            </label>
            <label className="mt-4 block">
              <span className="mb-1.5 block text-sm font-medium">Message</span>
              <textarea rows={4} value={form.message} onChange={set("message")} className={field} placeholder="Tell us what's up…" data-testid="input-message" />
            </label>
            <button type="submit" className="btn btn-wa mt-6 w-full text-base" data-testid="button-send">
              <WhatsAppIcon /> Send on WhatsApp
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
