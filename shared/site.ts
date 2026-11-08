// Single source for site URL and per-page SEO meta (used by the app,
// the build-time prerenderer and the sitemap).
import { GUIDES, getGuide } from "./guides.js";

export const SITE_URL = "https://jotah.in";
export const SITE_NAME = "Jotah";

export interface PageMeta { title: string; description: string; path: string }

const STATIC: Record<string, Omit<PageMeta, "path">> = {
  "/": {
    title: "Jotah Pre-Rolled Cones — Slow Burn, 13.8 GSM France Paper | Made in India",
    description: "Jotah pre-rolled cones: ultra-thin 13.8 GSM France paper, slow even burn, no rolling needed. Made in India, ₹15 a cone. Order online in Gurgaon & NCR, cash or UPI on delivery.",
  },
  "/product": {
    title: "Buy Jotah Pre-Rolled Cones Online — Single, 5-Pack, 10-Pack, Box of 25",
    description: "Buy Jotah pre-rolled cones online: slow burn, France paper, 13.8 GSM. ₹15 per cone — 5-Pack ₹75, 10-Pack ₹150, Box of 25 ₹375. Cash or UPI on delivery.",
  },
  "/what-the-fun": {
    title: "What The Fun — Scan for Surprise | Jotah",
    description: "Found the QR on your Jotah pack? Send “What The Fun” on WhatsApp to +91 92056 17375 and unlock your surprise.",
  },
  "/checkout": {
    title: "Checkout | Jotah",
    description: "Place your Jotah order — cash or UPI on delivery.",
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
export const PRERENDER_ROUTES = ["/", "/product", "/what-the-fun", "/game", "/guides", ...GUIDES.map((g) => `/guides/${g.slug}`)];

export function sitemapXml() {
  const pri = (p: string) => (p === "/" ? "1.0" : p === "/product" ? "0.9" : p.startsWith("/guides/") ? "0.7" : "0.8");
  const lastmod = (p: string) => {
    const g = p.startsWith("/guides/") && getGuide(p.slice(8));
    return g ? `<lastmod>${g.updated}</lastmod>` : "";
  };
  const urls = PRERENDER_ROUTES.map((p) => `  <url><loc>${SITE_URL}${p === "/" ? "/" : p}</loc>${lastmod(p)}<priority>${pri(p)}</priority></url>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

export function robotsTxt() {
  return `User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /checkout\nDisallow: /admin\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
}
