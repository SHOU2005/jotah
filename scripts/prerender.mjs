// Writes a static HTML file for every public route so search engines get
// full content, titles and canonical URLs without running JavaScript.
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const dist = path.resolve("dist/public");
const ssr = await import(pathToFileURL(path.resolve("dist/server/entry-server.js")).href);
const template = fs.readFileSync(path.join(dist, "index.html"), "utf8");

// Plain app shell for routes we don't prerender (checkout, admin, 404s).
// Not indexable (checkout, admin, unknown URLs) and no canonical pointing at the home page.
fs.writeFileSync(
  path.join(dist, "_shell.html"),
  template
    .replace(/\s*<link rel="canonical" href="[^"]*" \/>/, "")
    .replace(/\s*<meta property="og:url" content="[^"]*" \/>/, "")
    .replace("<head>", '<head>\n    <meta name="robots" content="noindex" />'),
);

const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const swap = (html, re, value, label) => {
  if (!re.test(html)) throw new Error(`prerender: could not find ${label} in template`);
  return html.replace(re, value);
};

for (const route of ssr.PRERENDER_ROUTES) {
  const meta = ssr.pageMeta(route);
  const url = ssr.SITE_URL + route;
  const app = ssr.render(route);
  let html = template;
  html = swap(html, /<title>[\s\S]*?<\/title>/, `<title>${esc(meta.title)}</title>`, "title");
  html = swap(html, /<meta name="description" content="[^"]*"/, `<meta name="description" content="${esc(meta.description)}"`, "description");
  html = swap(html, /<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${esc(meta.title)}"`, "og:title");
  html = swap(html, /<meta property="og:description" content="[^"]*"/, `<meta property="og:description" content="${esc(meta.description)}"`, "og:description");
  html = swap(html, /<meta property="og:url" content="[^"]*"/, `<meta property="og:url" content="${url}"`, "og:url");
  html = swap(html, /<link rel="canonical" href="[^"]*"/, `<link rel="canonical" href="${url}"`, "canonical");
  html = swap(html, /<div id="root">[\s\S]*?<\/noscript>\s*<\/div>/, `<div id="root" data-ssr="1">${app}</div>`, "root");
  const file = route === "/" ? "index.html" : `${route.slice(1)}.html`;
  fs.mkdirSync(path.dirname(path.join(dist, file)), { recursive: true });
  fs.writeFileSync(path.join(dist, file), html);
  console.log(`prerendered ${route.padEnd(48)} → ${file} (${(html.length / 1024).toFixed(0)} KB)`);
}
