/**
 * Where the site lives on its host.
 *
 * Netlify, Vercel, a custom domain or a <name>.github.io repository serve it
 * at the root: "/". A GitHub Pages project repository serves it in a folder
 * named after the repository, e.g. https://name.github.io/pilgrims-folio/.
 * The GitHub workflow sets BASE_PATH for that case automatically; nothing
 * else needs to change.
 *
 * Any spelling is accepted ("pilgrims-folio", "/pilgrims-folio", "/pilgrims-folio/")
 * and comes back as "/pilgrims-folio/", or "/" when empty.
 */
export function normalizeBase(raw: string | undefined): string {
  const name = (raw ?? "").trim().replace(/^\/+|\/+$/g, "");
  return name ? `/${name}/` : "/";
}
