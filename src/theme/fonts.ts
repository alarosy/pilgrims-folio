/**
 * Self-hosted fonts (no Google Fonts request at runtime).
 * Each @fontsource stylesheet declares every subset with a unicode-range,
 * so the browser only downloads the subsets a page actually uses.
 * All of them use font-display: swap.
 */
import "@fontsource/im-fell-english/latin-400.css";
import "@fontsource/im-fell-english/latin-400-italic.css";
import "@fontsource/im-fell-dw-pica/latin-400.css";
import "@fontsource/im-fell-dw-pica/latin-400-italic.css";
import "@fontsource-variable/eb-garamond/wght.css";
import "@fontsource-variable/eb-garamond/wght-italic.css";
import "@fontsource/unifrakturmaguntia/latin-400.css";
import "@fontsource/amiri/arabic-400.css";
import "@fontsource/amiri/arabic-700.css";

import garamondLatin from "@fontsource-variable/eb-garamond/files/eb-garamond-latin-wght-normal.woff2?url";
import fellLatin from "@fontsource/im-fell-english/files/im-fell-english-latin-400-normal.woff2?url";
import amiriArabic from "@fontsource/amiri/files/amiri-arabic-400-normal.woff2?url";

const preload = (href: string) =>
  ({ rel: "preload", href, as: "font", type: "font/woff2", crossOrigin: "anonymous" }) as const;

/** Fonts every English page needs for its first paint. */
export const latinPreloads = [preload(garamondLatin), preload(fellLatin)];
/** Added on Arabic pages (Phase 3 wires this to the /ar routes). */
export const arabicPreloads = [preload(amiriArabic)];
