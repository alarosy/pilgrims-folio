import { describe, expect, it } from "vitest";
import { makeBootScript } from "./boot";

/** Run the boot script against a stand-in page and report what it set. */
function boot(pathname: string, stored: { local?: object; curtain?: boolean } = {}, base = "/") {
  const html = { lang: "en", dir: "ltr", dataset: {} as Record<string, string>, classList: new Set<string>() };
  const document = { documentElement: { ...html, classList: { add: (c: string) => html.classList.add(c) } } };
  const localStorage = { getItem: () => (stored.local ? JSON.stringify(stored.local) : null) };
  const sessionStorage = { getItem: () => (stored.curtain ? "1" : null) };
  // The script is the site's own fixed text (no outside input): run it as the browser would.
  new Function("document", "location", "localStorage", "sessionStorage", makeBootScript(base))(
    document,
    { pathname },
    localStorage,
    sessionStorage,
  );
  const d = document.documentElement;
  return { lang: d.lang, dir: d.dir, data: d.dataset, js: html.classList.has("js") };
}

describe("the boot script", () => {
  it("leaves English pages left to right", () => {
    expect(boot("/map")).toMatchObject({ lang: "en", dir: "ltr", js: true });
    expect(boot("/archive")).toMatchObject({ lang: "en", dir: "ltr" });
  });

  it("turns /ar pages (and unknown /ar addresses) right to left", () => {
    for (const p of ["/ar", "/ar/", "/ar/map", "/ar/no-such-page"]) {
      expect(boot(p)).toMatchObject({ lang: "ar", dir: "rtl" });
    }
  });

  it("works the same inside a GitHub Pages project folder", () => {
    const base = "/pilgrims-folio/";
    expect(boot("/pilgrims-folio/ar/map", {}, base)).toMatchObject({ lang: "ar", dir: "rtl" });
    expect(boot("/pilgrims-folio/ar", {}, base)).toMatchObject({ lang: "ar", dir: "rtl" });
    expect(boot("/pilgrims-folio/map", {}, base)).toMatchObject({ lang: "en", dir: "ltr" });
    expect(boot("/pilgrims-folio/macbeth/", {}, base).data.theme).toBe("macbeth");
    expect(boot("/pilgrims-folio/", {}, base)).toMatchObject({ lang: "en" });
  });

  it("lights the candle for the Scottish Play in both languages", () => {
    expect(boot("/macbeth").data.theme).toBe("macbeth");
    expect(boot("/ar/macbeth").data.theme).toBe("macbeth");
    expect(boot("/macbethian").data.theme).toBeUndefined();
  });

  it("applies saved settings, review records and the curtain", () => {
    const local = { settings: { candlelight: true, motion: "reduced" }, srs: { a: {} } };
    expect(boot("/", { local, curtain: true }).data).toEqual({ theme: "macbeth", motion: "reduced", srs: "1", curtain: "seen" });
    expect(boot("/", { local: { srs: {} } }).data).toEqual({});
  });
});
