// Tells Bing (and other IndexNow engines) about every page in the live sitemap.
// Usage: node scripts/indexnow.mjs   (run after a production deploy)
import fs from "node:fs";

const HOST = "jotah.in";
const keyFile = fs.readdirSync("client/public").find((f) => /^[0-9a-f]{32}\.txt$/.test(f));
if (!keyFile) throw new Error("IndexNow key file missing in client/public");
const key = keyFile.replace(".txt", "");

const xml = await (await fetch(`https://${HOST}/sitemap.xml`)).text();
const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key, keyLocation: `https://${HOST}/${keyFile}`, urlList }),
});
console.log(`IndexNow: submitted ${urlList.length} URLs → HTTP ${res.status} ${res.statusText}`);
