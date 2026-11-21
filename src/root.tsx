import { useSyncExternalStore } from "react";
import { isRouteErrorResponse, Link, Links, Meta, Outlet, Scripts, ScrollRestoration, useLocation } from "react-router";
import type { Route } from "./+types/root";
import "./theme/fonts";
import "./theme/app.css";
import { arabicPreloads, latinPreloads } from "./theme/fonts";
import { makeBootScript } from "./lib/boot";
import { langOf, localize } from "./lib/lang";
import { SECTIONS, STRINGS } from "./i18n/strings";

export const links: Route.LinksFunction = () => [
  ...latinPreloads,
  { rel: "icon", href: `${import.meta.env.BASE_URL}favicon.svg`, type: "image/svg+xml" },
];

/** Runs before first paint: theme, motion, language and direction (see lib/boot.ts). */
const bootScript = makeBootScript(import.meta.env.BASE_URL);

const amiri = arabicPreloads[0]!;
const noSubscribe = () => () => {};

/**
 * Whether <head> asks for the Arabic font early. Arabic pages are built with
 * it; the shared 404 page is built without it. While React takes over the
 * page it must match what was served, so it reads that from the page itself,
 * then adds the request afterwards if an Arabic 404 needs it.
 */
function useArabicFont(lang: "en" | "ar") {
  return useSyncExternalStore(
    noSubscribe,
    () => lang === "ar",
    () => (typeof document === "undefined" ? lang === "ar" : !!document.head.querySelector(`link[href="${amiri.href}"]`)),
  );
}

/** False while React is taking over the served page, true after (and on every later render). */
const useHydrated = () => useSyncExternalStore(noSubscribe, () => true, () => false);

export function Layout({ children }: { children: React.ReactNode }) {
  const lang = langOf(useLocation().pathname);
  const arabicFont = useArabicFont(lang);
  return (
    <html lang={lang} dir={lang === "ar" ? "rtl" : "ltr"} data-theme="parchment" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#f2e8d5" />
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        {arabicFont ? <link rel="preload" href={amiri.href} as="font" type="font/woff2" crossOrigin="anonymous" /> : null}
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

const ERRORS = {
  en: {
    error: "An error",
    amiss: "Something went amiss.",
    source: "The Winter’s Tale, 3.3",
    missing: "This page is not in the Folio.",
    reload: "Please reload the page.",
    back: "Return to",
  },
  ar: {
    error: "خطأ",
    amiss: "حدث خطأ ما.",
    source: "حكاية الشتاء، 3.3",
    missing: "هذه الصفحة ليست في المجلّد.",
    reload: "أعد تحميل الصفحة من فضلك.",
    back: "العودة إلى",
  },
};

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const lang = langOf(useLocation().pathname);
  const e = ERRORS[lang];
  const prologue = SECTIONS.find((s) => s.key === "prologue")![lang].name;
  const notFound = isRouteErrorResponse(error) && error.status === 404;
  // The 404 page is one shared file with an empty body; match it while React takes over, then fill it in.
  if (!useHydrated()) return null;
  const heading = (notFound ? e.missing : e.amiss).replace(/\.$/, "");
  return (
    <main className="mx-auto max-w-prose px-4 py-24 text-center">
      {/* React places this in <head>. */}
      <title>{`${heading} · ${STRINGS[lang].siteTitle}`}</title>
      <p className="label text-ink-muted">{notFound ? "404" : e.error}</p>
      {/* The stage direction stays in Shakespeare's English. */}
      <h1 className="mt-4" lang={notFound ? "en" : undefined}>
        {notFound ? "Exit, pursued by a bear." : e.amiss}
      </h1>
      <p className="mt-2 text-caption text-ink-muted">{notFound ? e.source : ""}</p>
      <p className="mt-6 text-ink-muted">{notFound ? e.missing : e.reload}</p>
      <p className="mt-10">
        <Link className="ink-link" to={localize("/", lang)}>
          {e.back} {prologue}
        </Link>
      </p>
    </main>
  );
}
