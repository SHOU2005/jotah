import { useEffect } from "react";
import { pageMeta, SITE_URL } from "@shared/site";

/** Keeps <title>, description, canonical and OG tags in sync on client-side navigation.
 *  (The same values are baked into the static HTML at build time.) */
export function usePageMeta(path: string) {
  useEffect(() => {
    const m = pageMeta(path);
    document.title = m.title;
    setMeta("name", "description", m.description);
    setMeta("property", "og:title", m.title);
    setMeta("property", "og:description", m.description);
    setMeta("property", "og:url", SITE_URL + path);
    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = SITE_URL + path;
  }, [path]);
}

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}
