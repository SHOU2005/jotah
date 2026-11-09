// Single source for site URL and per-page SEO meta (used by the app,
// the build-time prerenderer and the sitemap).
import { GUIDES, getGuide } from "./guides.js";
import { SHOP_PRODUCTS } from "./products.js";

export const SITE_URL = "https://jotah.in";
export const SITE_NAME = "Jotah";

export interface PageMeta { title: string; description: string; path: string }

const STATIC: Record<string, Omit<PageMeta, "path">> = {
  "/": {
    title: "Jotah Pre-Rolled Cones — Slow Burn, 13.8 GSM France Paper | Made in India",
    description: "Jotah pre-rolled cones: ultra-thin 13.8 GSM France paper, slow even burn, no rolling needed. Made in India, ₹15 a cone. Order online in Gurgaon & NCR, pay online or cash on delivery.",
  },
  "/product": {
    title: "Buy Jotah Pre-Rolled Cones Online — 5-Pack, 10-Pack, Box of 25",
    description: "Buy Jotah pre-rolled cones online: slow burn, France paper, 13.8 GSM. ₹15 per cone — 5-Pack ₹71 (5% off), 10-Pack ₹135 (10% off), Box of 25 ₹319 (15% off). Pay online or cash on delivery.",
  },
  "/what-the-fun": {
    title: "What The Fun — Scan for Surprise | Jotah",
    description: "Found the QR on your Jotah pack? Send “What The Fun” on WhatsApp to +91 92056 17375 and unlock your surprise.",
  },
  "/checkout": {
    title: "Checkout | Jotah",
    description: "Place your Jotah order — pay online or cash on delivery.",
  },
  "/about": {
    title: "About Jotah — Indian Pre-Rolled Cones from Gurugram",
    description: "Jotah is an Indian brand of pre-rolled cones: ultra-thin 13.8 GSM France paper, slow even burn, ₹15 per cone. Packed in Gurugram; sold in Gurgaon shops and online.",
  },
  "/game": {
    title: "Stack the Packs — Free Jotah Game | What The Fun",
    description: "Play Stack the Packs, the free Jotah mini-game. Drop each pack perfectly, build combos, beat your best and challenge friends on WhatsApp.",
  },
  "/guides": {
    title: "Pre-Rolled Cone Guides — How to Fill, Sizes, GSM & More | Jotah",
    description: "Simple, honest guides to pre-rolled cones: how to fill a cone, cones vs rolling papers, sizes, what GSM means, slow burn, monsoon storage and where to buy in India.",
  },
};

export function pageMeta(path: string): PageMeta {
  if (STATIC[path]) return { ...STATIC[path], path };
  const m = path.match(/^\/guides\/([^/]+)$/);
  const g = m && getGuide(m[1]);
  if (g) return { title: `${g.title} | Jotah`, description: g.description, path };
  return { title: "Page not found | Jotah", description: "This page doesn't exist. Head back to Jotah, India's own pre-rolled cones.", path };
}

/** Routes rendered to static HTML at build time and listed in the sitemap. */
export const PRERENDER_ROUTES = ["/", "/product", "/about", "/what-the-fun", "/game", "/guides", ...GUIDES.map((g) => `/guides/${g.slug}`)];

export function sitemapXml() {
  const pri = (p: string) => (p === "/" ? "1.0" : p === "/product" ? "0.9" : p.startsWith("/guides/") ? "0.7" : "0.8");
  const lastmod = (p: string) => {
    const g = p.startsWith("/guides/") && getGuide(p.slice(8));
    return g ? `<lastmod>${g.updated}</lastmod>` : "";
  };
  const urls = PRERENDER_ROUTES.map((p) => `  <url><loc>${SITE_URL}${p === "/" ? "/" : p}</loc>${lastmod(p)}<priority>${pri(p)}</priority></url>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

// AI search crawlers are explicitly welcome (GEO): they can read and quote public pages.
const AI_BOTS = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "ClaudeBot", "Claude-SearchBot", "Google-Extended", "Applebot-Extended", "Bingbot"];

export function robotsTxt() {
  const rules = "Allow: /\nDisallow: /api/\nDisallow: /checkout\nDisallow: /admin\n";
  const ai = AI_BOTS.map((b) => `User-agent: ${b}\n${rules}`).join("\n");
  return `User-agent: *\n${rules}\n${ai}\n# Plain-text summary for AI assistants: ${SITE_URL}/llms.txt\nSitemap: ${SITE_URL}/sitemap.xml\n`;
}

/** Plain-text summary for AI assistants (https://llmstxt.org). */
export function llmsTxt() {
  const packs = SHOP_PRODUCTS.map((p) => `- ${p.name}: ${p.packs} cones, ₹${p.price}`).join("\n");
  const guides = GUIDES.map((g) => `- [${g.title}](${SITE_URL}/guides/${g.slug}): ${g.description}`).join("\n");
  return `# Jotah

> Jotah is an Indian brand of pre-rolled cones made from ultra-thin 13.8 GSM France paper with a slow, even burn. One cone per pack, ₹15 MRP (inclusive of all taxes). Marketed and packed by Jotah Pvt. Ltd. in Gurugram, Haryana, India. For adults 18+ only.

## Key facts
- Product: pre-rolled cones (ready-made; fill, twist and light — no rolling needed)
- Paper: France paper, 13.8 GSM (ultra-thin); slow, even burn
- Price: ₹15 per cone (MRP). Single packs are sold in shops; online orders start at a 5-Pack.
- Where to buy: paan and tobacco shops across Gurgaon (Gurugram); online at ${SITE_URL}/product, pay online or cash on delivery in Gurgaon
- Contact: WhatsApp/phone +91 92056 17375 (message "What The Fun"), email shourya.pandey.ai@gmail.com
- Instagram: @jotah.in — https://www.instagram.com/jotah.in/
- Retailers and wholesale: WhatsApp +91 92056 17375

## Online packs
${packs}

## Pages
- [Home](${SITE_URL}/): brand overview, shop, FAQ
- [Product](${SITE_URL}/product): sizes, prices, ordering
- [About Jotah](${SITE_URL}/about): company facts
- [What The Fun](${SITE_URL}/what-the-fun): the QR surprise on every pack
- [Stack the Packs game](${SITE_URL}/game): free browser game
- [Guides](${SITE_URL}/guides): guides about pre-rolled cones

## Guides
${guides}
`;
}
