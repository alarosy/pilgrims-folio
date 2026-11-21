/**
 * The small script at the top of every page. It runs before first paint so
 * saved preferences never flash the wrong state: the candlelight theme,
 * reduced motion, whether this device has review records, and whether the
 * curtain has already risen in this visit. Storage can be blocked, so every
 * access is guarded.
 *
 * It also sets the language and direction on /ar pages. Prerendered pages
 * already say so; this is for the shared 404 page, one file served for every
 * unknown address, English or Arabic, so an Arabic one is right-to-left from
 * its first frame. (It adds nothing to <head>: React checks <head> when it
 * takes over the page, and an extra element there breaks that.)
 *
 * A fixed string, not user content. Its regular expressions sit inside a
 * template string, so every "\/" is written "\\/"; boot.test.ts checks that
 * the result still parses and behaves.
 */
export function makeBootScript(base = "/") {
  // The page's own path, without the folder a GitHub Pages project site lives in.
  const prefix = base.replace(/\/$/, "");
  return `(() => {
  var d = document.documentElement;
  d.classList.add("js");
  var path = location.pathname;
  var prefix = ${JSON.stringify(prefix)};
  if (prefix && path.indexOf(prefix) === 0) path = path.slice(prefix.length) || "/";
  if (/^\\/ar(\\/|$)/.test(path)) {
    d.lang = "ar";
    d.dir = "rtl";
  }
  try {
    var saved = JSON.parse(localStorage.getItem("pilgrims-folio:v1") || "{}") || {};
    var s = saved.settings || {};
    if (s.candlelight === true) d.dataset.theme = "macbeth";
    if (s.motion === "reduced") d.dataset.motion = "reduced";
    if (saved.srs && Object.keys(saved.srs).length) d.dataset.srs = "1";
  } catch (e) {}
  try { if (sessionStorage.getItem("pf:curtain")) d.dataset.curtain = "seen"; } catch (e) {}
  if (/^(\\/ar)?\\/macbeth(\\/|$)/.test(path)) d.dataset.theme = "macbeth";
})();`;
}
