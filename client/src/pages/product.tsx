import { useState } from "react";
import { Check, Phone } from "lucide-react";
import Navigation from "@/components/navigation";
import { Footer } from "@/components/site-chrome";
import { FlameIcon, FranceFlag, ThinIcon, WhatsAppIcon } from "@/components/brand";
import { Marquee, WhereToBuy } from "@/components/home-sections";
import { AddToCart, SizePicker } from "@/components/cart";
import { PRODUCTS, DEFAULT_PRODUCT } from "@shared/products";
import { CALL_URL, whatsappLink } from "@/lib/contact";
import { usePageMeta } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { SHOP_PRODUCTS } from "@shared/products";
import { SITE_URL } from "@shared/site";

const photos = [
  { src: "/images/cones/hero-box-cones.jpg", alt: "Jotah pre-rolled cones with the kraft pack" },
  { src: "/images/cones/cone-tips.jpg", alt: "Close-up of Jotah cone tips" },
  { src: "/images/cones/box-moody.jpg", alt: "Jotah pack on dark stone" },
  { src: "/images/cones/cone-macro.jpg", alt: "Close-up of a Jotah pre-rolled cone" },
  { src: "/images/cones/box-specs-new.jpg", alt: "Side of the pack: Slow Burn, France Paper, 13.8 GSM" },
  { src: "/images/cones/cones-stone.jpg", alt: "Jotah pre-rolled cones on dark stone" },
];

export default function Product() {
  usePageMeta("/product");
  const [active, setActive] = useState(0);
  const [sizeId, setSizeId] = useState(DEFAULT_PRODUCT.id);
  const size = PRODUCTS[sizeId];

  return (
    <>
      <Navigation />
      <main className="kraft-texture bg-paper pb-24 pt-28 md:pt-36">
        <JsonLd data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: "Jotah Pre-Rolled Cones",
          description: "Pre-rolled cones made from France paper at 13.8 GSM with a slow, even burn. One cone per pack, MRP ₹15. Marketed and packed by Jotah Pvt. Ltd., Gurugram.",
          image: photos.map((p) => `${SITE_URL}${p.src}`),
          brand: { "@type": "Brand", name: "Jotah" },
          countryOfOrigin: "IN",
          url: `${SITE_URL}/product`,
          offers: SHOP_PRODUCTS.map((p) => ({
            "@type": "Offer",
            name: p.name,
            price: String(p.price),
            priceCurrency: "INR",
            availability: "https://schema.org/InStock",
            url: `${SITE_URL}/product`,
          })),
        }} />
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:px-8">
          <div>
            <div className="photo-frame">
              <img src={photos[active].src} alt={photos[active].alt} className="aspect-[16/9] w-full object-cover" />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6">
              {photos.map((p, i) => (
                <button
                  key={p.src}
                  onClick={() => setActive(i)}
                  className={`overflow-hidden rounded-xl ring-2 ring-offset-2 ring-offset-paper transition ${i === active ? "ring-ink" : "ring-transparent opacity-70 hover:opacity-100"}`}
                  aria-label={`Show ${p.alt}`}
                >
                  <img src={p.src} alt="" className="aspect-[16/10] w-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="eyebrow mb-4">Jotah Pvt. Ltd. · Made in India</p>
            <h1 className="display text-[clamp(2.6rem,5vw,4.4rem)]">Jotah Pre-Rolled Cones</h1>
            <div className="mt-6 flex items-baseline gap-3">
              <span key={size.id} className="animate-badge-pop font-display text-5xl font-black tabular-nums">₹{size.price}</span>
              <span className="text-sm text-ink-soft">{size.packs > 1 ? `${size.packs} cones × ₹15 MRP` : "MRP per cone"} · inclusive of all taxes</span>
            </div>
            <p className="mt-6 text-lg leading-relaxed text-ink-soft">
              Ready-made cones of fine French paper, ultra-thin at 13.8 GSM. No rolling needed — just fill, twist and enjoy a slow, even burn. Costs less than your chai.
            </p>

            <ul className="mt-8 grid gap-3 sm:grid-cols-3">
              <li className="rounded-2xl bg-paper-2 p-4"><FlameIcon className="h-7 w-7" /><p className="mt-3 text-sm font-bold uppercase tracking-wide">Slow burn</p></li>
              <li className="rounded-2xl bg-paper-2 p-4"><FranceFlag className="h-6 w-9 rounded-sm" /><p className="mt-3 text-sm font-bold uppercase tracking-wide">France paper</p></li>
              <li className="rounded-2xl bg-paper-2 p-4"><ThinIcon className="h-7 w-9" /><p className="mt-3 text-sm font-bold uppercase tracking-wide">13.8 GSM</p></li>
            </ul>

            <div className="mt-8">
              <p className="mb-3 text-sm font-semibold">Choose your size</p>
              <SizePicker value={sizeId} onChange={setSizeId} />
            </div>

            <div className="mt-6 rounded-3xl bg-ink p-6 text-paper">
              <p className="mb-4 text-sm text-paper/60">{size.name} · Cash or UPI on delivery</p>
              <AddToCart key={size.id} productId={size.id} dark label={`Add ${size.size} · ₹${size.price}`} />
              <a href={whatsappLink(`What The Fun — I want to order the Jotah ${size.size} (₹${size.price}).`)} target="_blank" rel="noopener noreferrer" className="btn btn-ghost-light mt-3 w-full" data-testid="product-order">
                <WhatsAppIcon /> Or order on WhatsApp
              </a>
              <a href={CALL_URL} className="mt-3 flex items-center justify-center gap-2 text-sm text-paper/60 hover:text-paper"><Phone className="h-4 w-4" /> Call to order</a>
            </div>

            <dl className="mt-10 divide-y divide-[color:var(--border)] border-y border-[color:var(--border)] text-sm">
              {[
                ["Product", "Pre-rolled cone"],
                ["In each pack", "1 cone"],
                ["Paper", "Sourced from France"],
                ["Weight", "13.8 GSM (ultra-thin)"],
                ["Burn", "Slow, even"],
                ["MRP", "₹15 per pack (1 cone), inclusive of all taxes"],
                ["Marketed & packed by", "Jotah Pvt. Ltd., WeWork Forum, Cybercity, Gurugram 122002"],
                ["Age", "18+ only. Not for sale to minors."],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-6 py-3.5">
                  <dt className="text-ink-soft">{k}</dt>
                  <dd className="text-right font-medium">{v}</dd>
                </div>
              ))}
            </dl>

            <ul className="mt-8 space-y-2 text-sm text-ink-soft">
              {["Genuine Jotah, straight from the brand", "Bulk & retailer pricing on WhatsApp", "Fast replies, 7 days a week"].map((t) => (
                <li key={t} className="flex items-center gap-2"><Check className="h-4 w-4 text-ink" />{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </main>
      <Marquee />
      <WhereToBuy />
      <Footer />
    </>
  );
}
