import { Link } from "wouter";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import Navigation from "@/components/navigation";
import { Footer } from "@/components/site-chrome";
import { Markdown } from "@/components/markdown";
import { JsonLd } from "@/components/json-ld";
import { AddToCart } from "@/components/cart";
import { WhatsAppIcon } from "@/components/brand";
import { WHATSAPP_URL } from "@/lib/contact";
import { usePageMeta } from "@/lib/seo";
import { GUIDES, getGuide, type Guide } from "@shared/guides";
import { SITE_URL } from "@shared/site";
import { DEFAULT_PRODUCT } from "@shared/products";
import NotFound from "./not-found";

const fmt = (d: string) => new Date(d + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

function GuideCard({ g, big = false }: { g: Guide; big?: boolean }) {
  return (
    <Link href={`/guides/${g.slug}`} className={`group flex h-full flex-col justify-between rounded-3xl bg-paper p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-24px_rgba(42,29,20,.45)] ${big ? "md:p-10" : ""}`}>
      <div>
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-ink-soft"><Clock className="h-3.5 w-3.5" /> {g.readMins} min read</p>
        <h2 className={`mt-4 font-black leading-tight ${big ? "text-3xl md:text-4xl" : "text-xl md:text-2xl"}`}>{g.title}</h2>
        <p className="mt-3 text-ink-soft">{g.description}</p>
      </div>
      <span className="mt-6 inline-flex items-center gap-2 font-semibold">Read guide <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
    </Link>
  );
}

export function GuidesIndex() {
  usePageMeta("/guides");
  const [first, ...rest] = GUIDES;
  return (
    <>
      <Navigation />
      <main className="bg-paper-2 pb-24 pt-28 md:pt-36">
        <JsonLd data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Pre-Rolled Cone Guides",
          url: `${SITE_URL}/guides`,
          hasPart: GUIDES.map((g) => ({ "@type": "Article", headline: g.title, url: `${SITE_URL}/guides/${g.slug}` })),
        }} />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="eyebrow mb-5">Guides</p>
          <h1 className="display max-w-4xl text-[clamp(2.6rem,6vw,5rem)]">Everything about pre-rolled cones.</h1>
          <p className="mt-6 max-w-2xl text-lg text-ink-soft">Simple, honest guides — how to fill a cone, cones vs papers, sizes, what GSM means, slow burn, monsoon storage and where to buy in India.</p>
          <div className="mt-14 grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2"><GuideCard g={first} big /></div>
            {rest.map((g) => <GuideCard key={g.slug} g={g} />)}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export function GuideArticle({ params }: { params: { slug: string } }) {
  const g = getGuide(params.slug);
  usePageMeta(`/guides/${params.slug}`);
  if (!g) return <NotFound />;
  const url = `${SITE_URL}/guides/${g.slug}`;
  const related = GUIDES.filter((x) => x.slug !== g.slug).slice(0, 3);
  const toc = g.body.split("\n").filter((l) => l.startsWith("## ")).map((l) => l.slice(3));

  return (
    <>
      <Navigation />
      <main className="bg-paper pb-24 pt-28 md:pt-36">
        <JsonLd data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Article",
              headline: g.title,
              description: g.description,
              datePublished: g.updated,
              dateModified: g.updated,
              mainEntityOfPage: url,
              image: `${SITE_URL}/images/cones/hero-box-cones.jpg`,
              author: { "@type": "Organization", name: "Jotah", url: SITE_URL },
              publisher: { "@type": "Organization", name: "Jotah", logo: { "@type": "ImageObject", url: `${SITE_URL}/favicon.svg` } },
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
                { "@type": "ListItem", position: 2, name: "Guides", item: `${SITE_URL}/guides` },
                { "@type": "ListItem", position: 3, name: g.title, item: url },
              ],
            },
          ],
        }} />
        <article className="mx-auto max-w-3xl px-4 sm:px-6">
          <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-sm text-ink-soft">
            <Link href="/" className="hover:text-ink">Home</Link><span>/</span>
            <Link href="/guides" className="hover:text-ink">Guides</Link>
          </nav>
          <h1 className="display text-[clamp(2.2rem,5vw,3.8rem)] !leading-[1.02]">{g.title}</h1>
          <p className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-soft">
            <span>By Jotah</span><span>Updated {fmt(g.updated)}</span><span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {g.readMins} min read</span>
          </p>

          {toc.length > 3 && (
            <nav aria-label="On this page" className="mt-10 rounded-2xl bg-paper-2 p-6">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink-soft">On this page</p>
              <ol className="grid gap-1.5 text-sm sm:grid-cols-2">
                {toc.map((t) => (
                  <li key={t}><a href={`#${t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`} className="hover:underline">{t}</a></li>
                ))}
              </ol>
            </nav>
          )}

          <div className="mt-6"><Markdown source={g.body} /></div>

          <aside className="mt-16 overflow-hidden rounded-3xl bg-ink p-8 text-paper">
            <p className="text-xs font-semibold uppercase tracking-widest text-paper/50">Jotah pre-rolled cones</p>
            <p className="mt-3 font-display text-3xl font-black">Slow burn. France paper. 13.8 GSM.</p>
            <p className="mt-2 text-paper/70">₹15 a cone · 5-Packs from ₹{DEFAULT_PRODUCT.price}, delivered in Gurgaon — pay online or cash on delivery.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <AddToCart dark withQty={false} label={`Add 5-Pack · ₹${DEFAULT_PRODUCT.price}`} />
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn btn-wa"><WhatsAppIcon /> What The Fun?</a>
            </div>
          </aside>

          <p className="mt-8 text-xs text-ink-soft">For adults 18+ only. Smoking is injurious to health.</p>

          <Link href="/guides" className="mt-10 inline-flex items-center gap-2 font-semibold"><ArrowLeft className="h-4 w-4" /> All guides</Link>
        </article>

        <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-2xl font-black">Keep reading</h2>
          <div className="grid gap-5 md:grid-cols-3">{related.map((r) => <GuideCard key={r.slug} g={r} />)}</div>
        </section>
      </main>
      <Footer />
    </>
  );
}
