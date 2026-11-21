/**
 * Serve the built site (build/client) the way the real hosts do, so what you
 * test locally is what goes online:
 *   /map          → map/index.html
 *   unknown path  → 404.html with status 404 (the site's own 404 page)
 *   gzip for text, long-lived caching for the fingerprinted /assets files.
 *
 * Run: npm run build && npm run preview          (http://localhost:4173)
 *
 * To rehearse a GitHub Pages project site, build and serve with the same
 * folder name, and HOST=github to copy its habit of adding a trailing slash:
 *   BASE_PATH=pilgrims-folio npm run build
 *   BASE_PATH=pilgrims-folio HOST=github npm run preview
 *   → http://localhost:4173/pilgrims-folio/
 */
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
import { createGzip } from "node:zlib";

const root = join(process.cwd(), "build", "client");
const port = Number(process.env.PORT ?? 4173);
const github = process.env.HOST === "github";
// Same rule as src/lib/base.ts: "pilgrims-folio" → "/pilgrims-folio/", empty → "/".
const name = (process.env.BASE_PATH ?? "").trim().replace(/^\/+|\/+$/g, "");
const base = name ? `/${name}/` : "/";

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".json": "application/json",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".png": "image/png",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".data": "application/octet-stream",
};
const COMPRESS = new Set([".html", ".js", ".css", ".svg", ".json", ".txt", ".data"]);
const notFoundPage = existsSync(join(root, "404.html")) ? join(root, "404.html") : join(root, "__spa-fallback.html");

/** The file for a path inside the site, "redirect" when GitHub would add a slash, or null. */
function resolve(sitePath) {
  const clean = normalize(decodeURIComponent(sitePath)).replace(/^(\.\.[/\\])+/, "");
  const file = join(root, clean);
  if (!file.startsWith(root)) return null;
  if (existsSync(file) && statSync(file).isFile()) return file;
  const index = join(file, "index.html");
  if (existsSync(index)) return github && !sitePath.endsWith("/") ? "redirect" : index;
  if (existsSync(`${file}.html`)) return `${file}.html`;
  return null;
}

createServer((req, res) => {
  const [path, query = ""] = (req.url ?? "/").split("?");
  const inSite = path === base.slice(0, -1) || path.startsWith(base);
  let file = inSite ? resolve(`/${path.slice(base.length)}`) : null;
  if (file === "redirect" || (inSite && path === base.slice(0, -1) && base !== "/")) {
    res.writeHead(301, { Location: `${path}/${query ? `?${query}` : ""}` });
    return res.end();
  }
  let status = 200;
  if (!file) {
    file = notFoundPage;
    status = 404;
  }
  const ext = extname(file);
  const headers = { "Content-Type": TYPES[ext] ?? "application/octet-stream", Vary: "Accept-Encoding" };
  headers["Cache-Control"] = path.startsWith(`${base}assets/`) ? "public, max-age=31536000, immutable" : "no-cache";
  const gzip = COMPRESS.has(ext) && /\bgzip\b/.test(req.headers["accept-encoding"] ?? "");
  if (gzip) headers["Content-Encoding"] = "gzip";
  res.writeHead(status, headers);
  const stream = createReadStream(file);
  (gzip ? stream.pipe(createGzip({ level: 9 })) : stream).pipe(res);
}).listen(port, () => console.log(`Serving build/client at http://localhost:${port}${base}${github ? "  (GitHub Pages habits)" : ""}`));
