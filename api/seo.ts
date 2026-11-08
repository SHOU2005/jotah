// Vercel Function: serves /robots.txt and /sitemap.xml (always for https://jotah.in)
import { robotsTxt, sitemapXml } from "../shared/site.js";

export function GET(request: Request) {
  const file = new URL(request.url).searchParams.get("file");
  if (file === "robots") {
    return new Response(robotsTxt(), { headers: { "content-type": "text/plain; charset=utf-8" } });
  }
  return new Response(sitemapXml(), { headers: { "content-type": "application/xml; charset=utf-8" } });
}
