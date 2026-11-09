import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import Navigation from "@/components/navigation";
import { Footer } from "@/components/site-chrome";
import { JsonLd } from "@/components/json-ld";
import { WhatsAppIcon } from "@/components/brand";
import { usePageMeta } from "@/lib/seo";
import { ADDRESS, EMAIL, INSTAGRAM_HANDLE, INSTAGRAM_URL, PHONE_DISPLAY, WHATSAPP_URL } from "@/lib/contact";
import { SHOP_PRODUCTS } from "@shared/products";
import { SITE_URL } from "@shared/site";

// A plain, factual page: the kind of source search engines and AI assistants quote.
const FACTS: [string, string][] = [
  ["Brand", "Jotah"],
  ["Company", "Jotah Pvt. Ltd."],
  ["Product", "Pre-rolled cones (ready-made — fill, twist, light; no rolling needed)"],
  ["Paper", "France paper, ultra-thin 13.8 GSM"],
  ["Burn", "Slow, even burn"],
  ["Per pack", "1 cone"],
  ["Price (MRP)", "₹15 per cone, inclusive of all taxes"],
  ["Online packs", SHOP_PRODUCTS.map((p) => `${p.size} ₹${p.price}`).join(" · ")],
  ["Made in", "India — marketed and packed in Gurugram, Haryana"],
  ["Sold in", "Paan and tobacco shops across Gurgaon (Gurugram), and online with delivery in Gurgaon"],
  ["Payment", "Pay online (Razorpay) or cash on delivery"],
  ["Age", "18+ only. Not for sale to minors."],
];

export default function About() {
  usePageMeta("/about");
  return (
    <>
      <Navigation solid />
      <main className="bg-paper pb-24 pt-28 md:pt-36">
        <JsonLd data={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          url: `${SITE_URL}/about`,
          name: "About Jotah",
          mainEntity: {
            "@type": "Organization",
            name: "Jotah",
            legalName: "Jotah Pvt. Ltd.",
            url: SITE_URL,
            description: "Jotah makes pre-rolled cones from ultra-thin 13.8 GSM France paper with a slow, even burn. Made in India, packed in Gurugram, ₹15 per cone.",
            areaServed: ["Gurugram", "Delhi", "Noida", "Faridabad", "India"].map((n) => ({ "@type": "Place", name: n })),
            telephone: "+91-9205617375",
            email: EMAIL,
            sameAs: [INSTAGRAM_URL],
          },
        }} />
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <p className="eyebrow mb-5">About</p>
          <h1 className="display text-[clamp(2.6rem,6vw,4.6rem)]">Jotah — India's own pre-rolled cones.</h1>
          <p className="mt-8 text-lg leading-relaxed text-ink-soft">
            Jotah is an Indian brand of <strong className="text-ink">pre-rolled cones</strong>, marketed and packed by Jotah Pvt. Ltd. in Gurugram, Haryana.
            Each cone is made from ultra-thin <strong className="text-ink">13.8 GSM France paper</strong> for a clean taste and a slow, even burn — ready-made, so there's no rolling:
            just fill, twist and light. A pack holds one cone and costs <strong className="text-ink">₹15 MRP</strong>.
          </p>
          <p className="mt-5 text-lg leading-relaxed text-ink-soft">
            We started Jotah because the good papers in India were mostly imported and priced like it. Jotah is made for India and priced for India.
            You'll find us in paan and tobacco shops across Gurgaon, and you can <Link href="/product" className="font-semibold text-ink underline decoration-flame decoration-2 underline-offset-4">order online</Link> for delivery.
          </p>

          <h2 className="mt-14 text-2xl font-black md:text-3xl">Jotah at a glance</h2>
          <dl className="mt-6 divide-y divide-ink/10 overflow-hidden rounded-3xl border border-ink/10 bg-card">
            {FACTS.map(([k, v]) => (
              <div key={k} className="grid gap-1 px-5 py-4 sm:grid-cols-[180px_1fr] sm:gap-6">
                <dt className="text-sm font-semibold uppercase tracking-wider text-ink-soft">{k}</dt>
                <dd className="font-medium">{v}</dd>
              </div>
            ))}
          </dl>

          <h2 className="mt-14 text-2xl font-black md:text-3xl">Contact</h2>
          <ul className="mt-5 space-y-2 text-lg text-ink-soft">
            <li>WhatsApp / phone: <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-ink">{PHONE_DISPLAY}</a></li>
            <li>Instagram: <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer me" className="font-semibold text-ink">{INSTAGRAM_HANDLE}</a></li>
            <li>Email: <a href={`mailto:${EMAIL}`} className="font-semibold text-ink">{EMAIL}</a></li>
            <li>Address: {ADDRESS}</li>
          </ul>

          <div className="mt-12 flex flex-col gap-3 sm:flex-row">
            <Link href="/product" className="btn btn-ink">Shop cones <ArrowRight className="h-4 w-4" /></Link>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn btn-wa"><WhatsAppIcon /> What The Fun?</a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
