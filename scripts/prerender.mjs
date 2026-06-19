// Build-time prerender — SEO finding C3 (keystone).
// Renders each route in headless Chromium against the freshly built dist/ and
// writes a static index.html per route, so crawlers and AI engines receive real
// per-route HTML instead of an empty SPA shell.
//
// The route list is derived from public/sitemap.xml (+ /vendors) so it stays in
// sync with the sitemap you already maintain — no hardcoded slug list, and
// App.jsx is never imported into Node (which would crash on its top-level
// document.* calls).
//
// STEP 1 (minimal): proves Puppeteer runs in the Vercel build container and
// emits all 33 files. Per-route canonical/OG, the hydration guard, id-dedupe,
// the __PRERENDERED__ marker and the 404.html copy come in later steps, once the
// Vercel preview build is confirmed green.

import http from "node:http";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const SITEMAP = path.join(ROOT, "public", "sitemap.xml");

const MIME = {
  ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".ico": "image/x-icon", ".webmanifest": "application/manifest+json",
  ".woff": "font/woff", ".woff2": "font/woff2", ".txt": "text/plain",
  ".xml": "application/xml",
};

// Block analytics during prerender so the build doesn't fire fake GA4 pageviews.
const BLOCK = /google-analytics\.com|googletagmanager\.com|analytics\.google\.com/;

async function getRoutes() {
  const xml = await readFile(SITEMAP, "utf8");
  const routes = new Set();
  for (const m of xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)) {
    routes.add(new URL(m[1]).pathname.replace(/\/+$/, "") || "/");
  }
  routes.add("/vendors"); // prerendered (carries its own noindex) but omitted from sitemap per M2
  return [...routes];
}

function startServer(shell) {
  const server = http.createServer(async (req, res) => {
    const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
    const ext = path.extname(urlPath);
    if (ext) {
      const filePath = path.join(DIST, urlPath);
      if (existsSync(filePath)) {
        res.setHeader("Content-Type", MIME[ext] || "application/octet-stream");
        res.end(await readFile(filePath));
        return;
      }
      res.statusCode = 404;
      res.end("Not found");
      return;
    }
    res.setHeader("Content-Type", "text/html"); // SPA fallback → original shell
    res.end(shell);
  });
  return new Promise((resolve) =>
    server.listen(0, "127.0.0.1", () => resolve(server)),
  );
}

// On Linux (Vercel/CI) launch the Amazon-Linux-compatible Chromium from
// @sparticuz/chromium (a normal Chromium build can't load libnss3.so etc. in
// Vercel's container). Locally (Windows/macOS) launch an installed Chrome.
async function getBrowser() {
  if (process.platform === "linux") {
    const chromium = (await import("@sparticuz/chromium")).default;
    return puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    });
  }
  return puppeteer.launch({
    headless: true,
    channel: "chrome",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
}

async function main() {
  if (!existsSync(path.join(DIST, "index.html"))) {
    console.error("✗ dist/index.html not found — run `vite build` first.");
    process.exit(1);
  }
  const shell = await readFile(path.join(DIST, "index.html"), "utf8");
  const routes = await getRoutes();
  console.log(`Prerendering ${routes.length} routes…`);

  const server = await startServer(shell);
  const port = server.address().port;
  const base = `http://127.0.0.1:${port}`;

  const browser = await getBrowser();

  const failed = [];
  let ok = 0;
  for (const route of routes) {
    const page = await browser.newPage();
    try {
      await page.setRequestInterception(true);
      page.on("request", (r) => (BLOCK.test(r.url()) ? r.abort() : r.continue()));
      await page.goto(base + route, { waitUntil: "domcontentloaded", timeout: 30000 });
      await page.waitForFunction(
        () => document.querySelector("#root")?.children.length > 0,
        { timeout: 30000 },
      );
      await page.waitForSelector("#global-jsonld", { timeout: 10000 }).catch(() => {});
      await new Promise((r) => setTimeout(r, 200)); // let per-route effects flush
      const html =
        "<!doctype html>\n" +
        (await page.evaluate(() => document.documentElement.outerHTML));
      const outDir = route === "/" ? DIST : path.join(DIST, route);
      await mkdir(outDir, { recursive: true });
      await writeFile(path.join(outDir, "index.html"), html);
      ok++;
      console.log(`  ✓ ${route}`);
    } catch (err) {
      failed.push(route);
      console.error(`  ✗ ${route} — ${err.message}`);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  await new Promise((r) => server.close(r));

  console.log(`\nPrerendered ${ok}/${routes.length} routes.`);
  if (failed.length) {
    console.error(`Failed: ${failed.join(", ")}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
