import { ArrowRight } from "lucide-react";
import Navigation from "@/components/navigation";
import { Footer } from "@/components/site-chrome";
import { WhatsAppIcon, WtfWordmark } from "@/components/brand";
import { WHATSAPP_URL } from "@/lib/contact";
import { usePageMeta } from "@/lib/seo";

const steps = [
  ["01", "Find the code", "Look on the side of your Jotah pack — “What The Fun → Scan for surprise”."],
  ["02", "Scan or tap", "Scan the QR, or just tap the button below. It opens WhatsApp with “What The Fun” already typed."],
  ["03", "Hit send", "Send it to +91 92056 17375 and we'll send your surprise right back."],
];

export default function WhatTheFun() {
  usePageMeta("/what-the-fun");
  return (
    <>
      <Navigation solid />
      <main>
        <section className="relative overflow-hidden bg-ink pb-24 pt-32 text-paper md:pb-32 md:pt-44">
          <div aria-hidden className="pointer-events-none absolute -right-40 top-0 h-[520px] w-[520px] rounded-full bg-flame/25 blur-3xl" />
          <div aria-hidden className="pointer-events-none absolute -left-40 bottom-0 h-[420px] w-[420px] rounded-full bg-kraft/20 blur-3xl" />
          <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6">
            <p className="mb-8 text-xs font-semibold uppercase tracking-[0.3em] text-paper/50">You found it</p>
            <h1 className="text-[clamp(3rem,10vw,8.5rem)] leading-[0.95]"><WtfWordmark /></h1>
            <p className="mx-auto mt-10 max-w-xl text-lg leading-relaxed text-paper/75 md:text-xl">
              One tap. One message. One surprise. Send us <strong className="text-paper">“What The Fun”</strong> on WhatsApp and see what happens.
            </p>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn btn-wa wa-pulse mt-12 px-10 py-5 text-lg" data-testid="wtf-main-cta">
              <WhatsAppIcon className="h-6 w-6" /> Send “What The Fun”
            </a>
            <p className="mt-5 text-sm text-paper/50">Opens WhatsApp · +91 92056 17375</p>
          </div>
        </section>

        <section className="kraft-texture bg-kraft py-24 md:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="display mb-14 text-[clamp(2.4rem,5vw,4rem)]">How it works</h2>
            <ol className="grid gap-5 md:grid-cols-3">
              {steps.map(([n, t, d]) => (
                <li key={n} className="rounded-3xl bg-paper/75 p-8">
                  <span className="font-display text-5xl font-black text-flame">{n}</span>
                  <h3 className="mt-6 text-2xl font-black">{t}</h3>
                  <p className="mt-3 leading-relaxed text-ink-soft">{d}</p>
                </li>
              ))}
            </ol>
            <div className="mt-14 grid items-center gap-10 md:grid-cols-[1.4fr_1fr]">
              <div className="photo-frame">
                <img src="/images/box-wtf.jpg" alt="Top of the Jotah pack with the What The Fun QR code" className="aspect-[8/3] w-full object-cover" loading="lazy" />
              </div>
              <div className="mx-auto w-full max-w-[260px] rounded-3xl bg-white p-4 shadow-xl">
                <img src="/images/qr.jpg" alt="What The Fun QR code" className="aspect-square w-full" loading="lazy" />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-paper py-20 text-center">
          <div className="mx-auto max-w-3xl px-4">
            <h2 className="display text-[clamp(2.2rem,5vw,3.6rem)]">Don't have a pack yet?</h2>
            <p className="mt-5 text-lg text-ink-soft">Get Jotah on Zepto, Blinkit, Instamart — or straight from us.</p>
            <a href="/#buy" className="btn btn-ink mt-8">Where to buy <ArrowRight className="h-4 w-4" /></a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
