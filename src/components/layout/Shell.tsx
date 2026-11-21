import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router";
import { data, moduleLabel } from "~/data";
import { SECTIONS, sectionByPath, useT, type SectionKey } from "~/i18n/strings";
import { formatDate } from "~/lib/dates";
import { basePath, localize, roman, useHref, useLang, type Lang } from "~/lib/lang";
import {
  checkImport,
  downloadExport,
  replaceSaved,
  updateSettings,
  useSaved,
  type ImportCheck,
  type Saved,
} from "~/lib/storage";
import { Icon } from "../ornament/Icon";
import { TudorRose } from "../ornament/TudorRose";
import { OrnamentRule } from "../ornament/Fleuron";
import { Segmented, StampButton, Switch } from "../ui/controls";
import { StatusMark } from "../ui/progress";
import { Sheet } from "./Sheet";
import { InkTrail, isStage, SceneCurtain } from "./Stage";
import { motionReduced } from "~/lib/motion";

/** Which section a path belongs to (module pages belong to the Map). */
function activeKey(pathname: string): SectionKey | undefined {
  const base = basePath(pathname);
  if (base.startsWith("/modules/")) return "map";
  return sectionByPath(base)?.key;
}

export function Shell({ children }: { children: ReactNode }) {
  const t = useT();
  const lang = useLang();
  const { pathname } = useLocation();
  const saved = useSaved();
  const [sheet, setSheet] = useState<"contents" | "settings" | null>(null);

  // Theme and motion follow the saved settings. The Scottish Play is always by candlelight.
  const forcedMacbeth = basePath(pathname).startsWith("/macbeth");
  useEffect(() => {
    document.documentElement.dataset.theme = forcedMacbeth || saved.settings.candlelight ? "macbeth" : "parchment";
  }, [forcedMacbeth, saved.settings.candlelight]);
  useEffect(() => {
    const d = document.documentElement;
    if (saved.settings.motion === "reduced") d.dataset.motion = "reduced";
    else delete d.dataset.motion;
  }, [saved.settings.motion]);

  // Close any sheet when the page changes.
  useEffect(() => setSheet(null), [pathname]);

  // The curtain between scenes: decided during render, so it is on screen in
  // the very first frame of the new page (nothing flashes before it).
  const [prevPath, setPrevPath] = useState(pathname);
  const [curtain, setCurtain] = useState(0);
  const [navigated, setNavigated] = useState(false);
  if (pathname !== prevPath) {
    setPrevPath(pathname);
    setNavigated(true);
    const a = basePath(prevPath);
    const b = basePath(pathname);
    if (a !== b && (isStage(a) || isStage(b))) setCurtain((c) => c + 1);
  }

  // After moving to another page, keyboard and screen-reader users start at its content,
  // not on the link they left. It waits for an open sheet to close, because a closing
  // dialog hands focus back to the button that opened it.
  const focusMain = useRef(false);
  useEffect(() => {
    if (navigated) focusMain.current = true;
  }, [pathname, navigated]);
  useEffect(() => {
    if (!focusMain.current || sheet) return;
    focusMain.current = false;
    document.getElementById("main")?.focus({ preventScroll: true });
  }, [pathname, sheet]);

  // Smooth wheel scrolling (Lenis), desktop mouse only, never with reduced motion.
  useEffect(() => {
    if (motionReduced() || !window.matchMedia("(pointer: fine)").matches) return;
    let lenis: import("lenis").default | undefined;
    let cancelled = false;
    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      lenis = new Lenis({ autoRaf: true, anchors: true });
      window.__lenis = lenis;
    });
    return () => {
      cancelled = true;
      lenis?.destroy();
      delete window.__lenis;
    };
  }, [saved.settings.motion]);
  useEffect(() => {
    window.__lenis?.resize();
  }, [pathname]);
  useEffect(() => {
    if (sheet) window.__lenis?.stop();
    else window.__lenis?.start();
  }, [sheet]);

  // The optional ink trail: only if chosen, with a mouse, and motion allowed.
  const [trail, setTrail] = useState(false);
  useEffect(() => {
    setTrail(saved.settings.inkTrail && window.matchMedia("(pointer: fine)").matches && !motionReduced());
  }, [saved.settings.inkTrail, saved.settings.motion]);

  return (
    <>
      <a href="#main" className="skip-link">
        {t.skip}
      </a>
      <Header onContents={() => setSheet("contents")} onSettings={() => setSheet("settings")} />
      <main id="main" tabIndex={-1} className="pb-28 outline-none lg:pb-0">
        <div key={pathname} className={navigated ? "page-enter" : undefined}>
          {children}
        </div>
      </main>
      {curtain ? <SceneCurtain key={curtain} onDone={() => setCurtain(0)} /> : null}
      {trail ? <InkTrail /> : null}
      <Colophon />
      <BottomRibbon onContents={() => setSheet("contents")} />

      <Sheet open={sheet === "contents"} onClose={() => setSheet(null)} title={t.catalogue.title} closeLabel={t.close}>
        <Catalogue lang={lang} />
      </Sheet>
      <Sheet open={sheet === "settings"} onClose={() => setSheet(null)} title={t.settings} closeLabel={t.close}>
        <SettingsPanel saved={saved} />
      </Sheet>
    </>
  );
}

/* ------------------------------ Header ------------------------------ */

function Header({ onContents, onSettings }: { onContents: () => void; onSettings: () => void }) {
  const t = useT();
  const lang = useLang();
  const href = useHref();
  const { pathname } = useLocation();
  const other: Lang = lang === "ar" ? "en" : "ar";
  const active = activeKey(pathname);
  return (
    <header className="site-header">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link to={href("/")} className="flex min-h-11 items-center gap-2.5 text-ink no-underline">
          <TudorRose size={28} />
          <span className="font-display text-[1.35rem] leading-none">{t.siteTitle}</span>
        </Link>
        <div className="ms-auto flex items-center gap-1">
          <Link
            to={localize(basePath(pathname), other)}
            hrefLang={other}
            className="header-btn"
            onClick={() => updateSettings({ lang: other })}
          >
            {/* The visible word starts the spoken name (WCAG 2.5.3); the rest is for screen readers. */}
            <span lang={other}>{t.langLink}</span>
            <span className="sr-only"> — {t.langLinkLabel}</span>
          </Link>
          <button type="button" className="header-btn hidden lg:inline-flex" onClick={onContents}>
            <Icon name="contents" />
            <span className="label">{t.contents}</span>
          </button>
          <button type="button" className="header-btn" onClick={onSettings} aria-label={t.settings}>
            <Icon name="settings" />
          </button>
        </div>
      </div>
      <nav aria-label={t.primaryNav} className="hidden border-t border-hairline lg:block">
        <ul className="mx-auto flex max-w-6xl flex-wrap justify-center gap-x-7 px-8">
          {SECTIONS.map((s) => (
            <li key={s.key}>
              <Link to={href(s.path)} className="nav-link" aria-current={active === s.key ? "page" : undefined}>
                {s.key === "prologue" ? s[lang].name : s[lang].short}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

/* ------------------------------ Phone ribbon ------------------------------ */

const RIBBON: SectionKey[] = ["prologue", "map", "lexicon", "sonnets"];

function BottomRibbon({ onContents }: { onContents: () => void }) {
  const t = useT();
  const lang = useLang();
  const href = useHref();
  const { pathname } = useLocation();
  const active = activeKey(pathname);
  return (
    <nav aria-label={t.primaryNav} className="ribbon lg:hidden">
      <ul className="grid grid-cols-5">
        {RIBBON.map((key) => {
          const s = SECTIONS.find((x) => x.key === key)!;
          const on = active === key;
          return (
            <li key={key}>
              <Link to={href(s.path)} className="ribbon-item" aria-current={on ? "page" : undefined}>
                <Icon name={s.icon} size={22} />
                <span>{s[lang].short}</span>
              </Link>
            </li>
          );
        })}
        <li>
          <button type="button" className="ribbon-item w-full" onClick={onContents}>
            <Icon name="contents" size={22} />
            <span>{t.contents}</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}

/* ------------------------------ Catalogue (Contents) ------------------------------ */

function Catalogue({ lang }: { lang: Lang }) {
  const t = useT();
  const href = useHref();
  return (
    <div className="space-y-10">
      <ol className="space-y-1">
        {SECTIONS.map((s, i) => (
          <li key={s.key} className="grid grid-cols-[2.5rem_1fr] items-baseline gap-x-2 border-b border-hairline py-2.5">
            <span className="nums font-heading text-ornament-ink">{roman(i + 1)}</span>
            <span>
              <Link to={href(s.path)} className="ink-link text-lead">
                {s[lang].name}
              </Link>
              <span className="mt-0.5 block text-caption text-ink-muted">{s[lang].blurb}</span>
            </span>
          </li>
        ))}
      </ol>
      <div>
        <h3 className="text-h4">{t.catalogue.stations}</h3>
        <ol className="mt-3 space-y-1">
          {data.modules.map((m) => (
            <li key={m.id} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-hairline py-2">
              <Link to={href(`/modules/${m.id}`)} className="no-underline">
                <span className="label me-2 text-ornament-ink">{moduleLabel(m.id)}</span>
                <span className="text-ink">{lang === "ar" ? (m.titleAr ?? m.title) : m.title}</span>
              </Link>
              <StatusMark status={m.status} lang={lang} />
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/* ------------------------------ Settings ------------------------------ */

function SettingsPanel({ saved }: { saved: Saved }) {
  const t = useT();
  const s = t.settingsSheet;
  const lang = useLang();
  const { pathname } = useLocation();
  const fileRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<ImportCheck | null>(null);
  const [undo, setUndo] = useState<Saved | null>(null);
  const [message, setMessage] = useState<string>("");

  return (
    <div className="space-y-9">
      <section aria-labelledby="set-lang">
        <h3 id="set-lang" className="label mb-3 text-ink-muted">
          {s.language}
        </h3>
        <div className="flex gap-3">
          {(["en", "ar"] as const).map((l) => (
            <Link
              key={l}
              to={localize(basePath(pathname), l)}
              lang={l}
              hrefLang={l}
              aria-current={l === lang ? "true" : undefined}
              onClick={() => updateSettings({ lang: l })}
              className={`seg-option inline-flex items-center rounded-sm border border-rule no-underline ${l === lang ? "bg-ink text-surface" : ""}`}
            >
              {l === "en" ? "English" : "العربية"}
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-2">
        <Switch
          checked={saved.settings.candlelight}
          onChange={(v) => updateSettings({ candlelight: v })}
          label={s.candle}
          hint={s.candleHint}
        />
        <Switch
          checked={saved.settings.inkTrail}
          onChange={(v) => updateSettings({ inkTrail: v })}
          label={s.ink}
          hint={s.inkHint}
        />
      </section>

      <section>
        <h3 className="label mb-3 text-ink-muted">{s.motion}</h3>
        <Segmented
          label={s.motion}
          value={saved.settings.motion}
          onChange={(v) => updateSettings({ motion: v })}
          options={[
            { value: "system", label: s.motionSystem },
            { value: "reduced", label: s.motionReduced },
          ]}
        />
      </section>

      <section aria-labelledby="set-data" className="border-t border-hairline pt-7">
        <h3 id="set-data" className="text-h4">
          {s.data}
        </h3>
        <p className="mt-2 text-caption text-ink-muted">{s.dataHint}</p>
        <div className="mt-5 flex flex-wrap gap-4">
          <StampButton variant="secondary" icon="scroll" onClick={downloadExport}>
            {s.export}
          </StampButton>
          <StampButton variant="secondary" icon="book" onClick={() => fileRef.current?.click()}>
            {s.import}
          </StampButton>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="sr-only"
            tabIndex={-1}
            aria-hidden="true"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (!file) return;
              const result = checkImport(await file.text());
              setPending(result);
              setMessage(result.ok ? "" : s.importError);
            }}
          />
        </div>
        {pending?.ok ? (
          <div className="card mt-5 p-4">
            <p>{s.importSummary(pending.words, pending.runs)}</p>
            {pending.exportedAt ? (
              <p className="mt-1 text-caption text-ink-muted">
                {formatDate(new Date(pending.exportedAt), lang, { day: "numeric", month: "long", year: "numeric" })}
              </p>
            ) : null}
            <div className="mt-4">
              <StampButton
                onClick={() => {
                  setUndo(replaceSaved(pending.data));
                  setPending(null);
                  setMessage(s.imported);
                }}
              >
                {s.replace}
              </StampButton>
            </div>
          </div>
        ) : null}
        <p role="status" className="mt-4 min-h-6 text-caption">
          {message}{" "}
          {undo ? (
            <button
              type="button"
              className="btn btn-quiet align-baseline"
              onClick={() => {
                replaceSaved(undo);
                setUndo(null);
                setMessage(s.restored);
              }}
            >
              <span className="btn-face">{s.undo}</span>
            </button>
          ) : null}
        </p>
      </section>
    </div>
  );
}

/* ------------------------------ Colophon ------------------------------ */

function Colophon() {
  const t = useT();
  const lang = useLang();
  return (
    <footer className="mx-auto max-w-6xl px-4 pb-36 pt-16 text-center sm:px-6 lg:px-8 lg:pb-16">
      <OrnamentRule className="mx-auto max-w-md" />
      <p className="label mt-6 text-ink-muted">{t.colophon.line}</p>
      <p className="mt-2 text-caption text-ink-muted">{t.colophon.folger}</p>
      <p className="mt-1 text-caption text-ink-muted">
        {t.colophon.updated(formatDate(data.config.updated, lang, { day: "numeric", month: "long", year: "numeric" }))}
      </p>
    </footer>
  );
}
