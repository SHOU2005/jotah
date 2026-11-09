// Build-time renderer: turns each public route into static HTML (see scripts/prerender.mjs).
import { renderToString } from "react-dom/server";
import { Router } from "wouter";
import App from "./App";

export { PRERENDER_ROUTES, pageMeta, SITE_URL, llmsTxt } from "@shared/site";

export function render(url: string) {
  return renderToString(
    <Router ssrPath={url}>
      <App />
    </Router>,
  );
}
