import { useLocation } from "react-router";

export type Lang = "en" | "ar";

/** Arabic pages live under /ar; everything else is English. */
export const langOf = (pathname: string): Lang =>
  pathname === "/ar" || pathname.startsWith("/ar/") ? "ar" : "en";

export function useLang(): Lang {
  return langOf(useLocation().pathname);
}

/** The language-neutral path, e.g. "/ar/map" → "/map". */
export const basePath = (pathname: string) =>
  langOf(pathname) === "ar" ? pathname.slice(3) || "/" : pathname;

/** "/map" in the given language. */
export const localize = (path: string, lang: Lang) =>
  lang === "ar" ? (path === "/" ? "/ar" : `/ar${path}`) : path;

/** Hook form: localize a path into the current page's language. */
export function useHref() {
  const lang = useLang();
  return (path: string) => localize(path, lang);
}

/**
 * Language and direction for content Ali may write in either language,
 * taken from its first letter (the rule dir="auto" uses). English inside an
 * Arabic page then keeps its punctuation at its own end, and is read aloud
 * in an English voice.
 */
export function textAttrs(s: string | undefined): { lang: Lang; dir: "ltr" | "rtl" } {
  // The first Latin or Arabic letter decides; digits and punctuation are neutral.
  const first = s?.match(/[A-Za-zÀ-ɏؠ-يٱ-ۓݐ-ݿ]/)?.[0];
  return first && /[ؠ-ݿ]/.test(first) ? { lang: "ar", dir: "rtl" } : { lang: "en", dir: "ltr" };
}

/** Western digits, as used in Libya. */
export const locale = (lang: Lang) => (lang === "ar" ? "ar-LY-u-nu-latn" : "en-GB");

export function roman(n: number): string {
  if (!Number.isInteger(n) || n <= 0 || n >= 4000) return String(n);
  const map: [number, string][] = [
    [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"],
    [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
  ];
  let out = "";
  for (const [v, s] of map) while (n >= v) (out += s), (n -= v);
  return out;
}

type ArForms = { one: string; two: string; few: string; many: string; other?: string };

/**
 * An Arabic counted noun. One and two have their own words ("كلمة واحدة",
 * "كلمتان"); 3–10 take the plural ("3 كلمات"); 11–99 the singular
 * ("11 كلمة"); 0, 100 and above the singular too. 103 counts like 3.
 */
export function arCount(n: number, f: ArForms): string {
  const other = f.other ?? f.many;
  if (!Number.isInteger(n)) return `${n} ${other}`;
  if (n === 1) return f.one;
  if (n === 2) return f.two;
  const r = n % 100;
  if (r >= 3 && r <= 10) return `${n} ${f.few}`;
  if (r >= 11) return `${n} ${f.many}`;
  return `${n} ${other}`;
}

export const arHours = (n: number) => arCount(n, { one: "ساعة واحدة", two: "ساعتان", few: "ساعات", many: "ساعة" });
/** After "بعد" (in…): بعد يومين، بعد 3 أيام، بعد 11 يومًا. */
export const arDaysAfter = (n: number) => arCount(n, { one: "يوم واحد", two: "يومين", few: "أيام", many: "يومًا", other: "يوم" });
export const arWords = (n: number) => arCount(n, { one: "كلمة واحدة", two: "كلمتان", few: "كلمات", many: "كلمة" });
export const arLines = (n: number) => arCount(n, { one: "سطر واحد", two: "سطرين", few: "أسطر", many: "سطرًا", other: "سطر" });
