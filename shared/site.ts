// Single source for site URL and per-page SEO meta (used by the app,
// the build-time prerenderer and the sitemap).
import { GUIDES, getGuide } from "./guides.js";

export const SITE_URL = "https://jotah.in";
export const SITE_NAME = "Jotah";

export interface PageMeta { title: string; description: string; path: string }

const STATIC: Record<string, Omit<PageMeta, "path">> = {
  "/": {
    title: "Jotah Rolling Papers — Slow Burn, 13.8 GSM France Paper | Made in India",
    description: "Jotah rolling papers: ultra-thin 13.8 GSM France paper with a slow, even burn. Made in India, MRP ₹15. Order online in Gurgaon & NCR, cash or UPI on delivery.",
  },
  "/product": {
    title: "Buy Jotah Rolling Papers Online — Single, 5-Pack, 10-Pack, Box of 25",
    description: "Buy Jotah rolling papers online: slow burn, France paper, 13.8 GSM. ₹15 per pack — 5-Pack ₹75, 10-Pack ₹150, Box of 25 ₹375. Cash or UPI on delivery.",
  },
  "/what-the-fun": {
    title: "What The Fun — Scan for Surprise | Jotah",
    description: "Found the QR on your Jotah pack? Send “What The Fun” on WhatsApp to +91 92056 17375 and unlock your surprise.",
  },
  "/checkout": {
    title: "Checkout | Jotah",
    description: "Place your Jotah order — cash or UPI on delivery.",
  },
  "/guides": {
    title: "Rolling Paper Guides — How to Roll, GSM, Sizes & More | Jotah",
    description: "Simple, honest guides to rolling papers: how to roll step by step, what GSM means, paper sizes, slow burn, storage in monsoon humidity and where to buy in India.",
  },
};

export function pageMeta(path: string): PageMeta {
  if (STATIC[path]) return { ...STATIC[path], path };
  const m = path.match(/^\/guides\/([^/]+)$/);
  const g = m && getGuide(m[1]);
  if (g) return { title: `${g.title} | Jotah`, description: g.description, path };
  return { title: "Page not found | Jotah", description: "This page doesn't exist. Head back to Jotah, India's own rolling paper.", path };
}

/** Routes rendered to static HTML at build time and listed in the sitemap. */
export const PRERENDER_ROUTES = ["/", "/product", "/what-the-fun", "/guides", ...GUIDES.map((g) => `/guides/${g.slug}`)];

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
