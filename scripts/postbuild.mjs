/**
 * Runs after `react-router build` (part of `npm run build`).
 *
 * 1. Folder layout — when the site lives in a folder (BASE_PATH, used for a
 *    GitHub Pages project site), React Router writes the pages one folder
 *    deeper, in build/client/<folder>/. GitHub serves build/client itself as
 *    that folder, so the pages are moved up to build/client.
 *
 * 2. 404.html — React Router writes the page for unknown addresses as
 *    __spa-fallback.html (or as index.html when the site lives in a folder).
 *    GitHub Pages, Netlify and Vercel all serve a file named 404.html when an
 *    address does not exist, so it is saved under that name. It shows
 *    "Exit, pursued by a bear." in the visitor's language.
 *
 * 3. .nojekyll — tells GitHub Pages not to hide files whose names start with
 *    "_" (only matters if the folder is ever published straight from a branch).
 */
import { existsSync, readdirSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const out = join(process.cwd(), "build", "client");
// Same rule as src/lib/base.ts: "pilgrims-folio" or "/pilgrims-folio/" → "pilgrims-folio".
const folder = (process.env.BASE_PATH ?? "").trim().replace(/^\/+|\/+$/g, "");
const nested = folder ? join(out, folder) : null;

function fail(message) {
  console.error(`postbuild: ${message}`);
  process.exit(1);
}

let notFound;
if (existsSync(join(out, "__spa-fallback.html"))) {
  notFound = readFileSync(join(out, "__spa-fallback.html"), "utf8");
} else if (nested && existsSync(nested) && existsSync(join(out, "index.html"))) {
  notFound = readFileSync(join(out, "index.html"), "utf8");
} else {
  fail("the 404 page is missing from build/client. Did `react-router build` finish?");
}

if (nested && existsSync(nested)) {
  for (const entry of readdirSync(nested)) {
    const to = join(out, entry);
    if (entry !== "assets" && existsSync(to)) rmSync(to, { recursive: true, force: true });
    renameSync(join(nested, entry), to);
  }
  rmSync(nested, { recursive: true, force: true });
  console.log(`postbuild: moved the pages from build/client/${folder}/ up to build/client/`);
}

if (!existsSync(join(out, "index.html"))) fail("build/client/index.html (the Prologue) is missing.");
writeFileSync(join(out, "404.html"), notFound);
writeFileSync(join(out, ".nojekyll"), "");
console.log("postbuild: wrote build/client/404.html and .nojekyll");
