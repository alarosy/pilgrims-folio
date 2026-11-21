import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { InkWrite } from "~/components/ui/InkWrite";
import { motionReduced } from "~/lib/motion";
import type { Route } from "./+types/commonplace";
import { DropCapParagraph } from "~/components/ornament/DropCap";
import { Icon } from "~/components/ornament/Icon";
import { StampButton } from "~/components/ui/controls";
import { RunningHead, SpecimenStamp } from "~/components/ui/print";
import { catchwordOf, data } from "~/data";
import type { JournalEntry } from "~/data/types";
import { ROOMS, useRoomT } from "~/i18n/rooms";
import { STRINGS, useT } from "~/i18n/strings";
import { formatDate } from "~/lib/dates";
import { langOf, roman, useLang, type Lang } from "~/lib/lang";

export const meta: Route.MetaFunction = ({ location }) => {
  const lang = langOf(location.pathname);
  return [{ title: `${ROOMS[lang].commonplace.title} · ${STRINGS[lang].siteTitle}` }];
};

const ENTRIES = [...data.journal].sort((a, b) => a.date.localeCompare(b.date));

/* The page-turn leaf uses Motion; it is fetched in idle time, before the first turn. */
const loadLeaf = () => import("~/components/ui/PageLeaf");
const PageLeaf = lazy(loadLeaf);

/** Is the screen wide enough for a two-page spread? */
function useWide() {
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 64rem)");
    const on = () => setWide(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return wide;
}

export default function Commonplace() {
  const t = useT();
  const r = useRoomT().commonplace;
  const lang = useLang();
  const wide = useWide();
  const n = ENTRIES.length;
  const [page, setPage] = useState(Math.max(0, n - 1)); // open at the latest entry
  const step = wide ? 2 : 1;
  const first = wide ? page - (page % 2) : page; // left page of the spread
  const touch = useRef<number | null>(null);
  const rtl = lang === "ar";

  // ?entry=<id> opens that page.
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("entry");
    const i = ENTRIES.findIndex((e) => e.id === id);
    if (i >= 0) setPage(i);
  }, []);

  // Fetch the page-turn code while the browser is idle, if there is anything to turn.
  useEffect(() => {
    if (n < 2 || motionReduced()) return;
    const w = window as Window & { requestIdleCallback?: (cb: () => void) => number };
    if (w.requestIdleCallback) w.requestIdleCallback(() => void loadLeaf());
    else window.setTimeout(() => void loadLeaf(), 1500);
  }, [n]);

  const [turn, setTurn] = useState<{ key: number; dir: 1 | -1 } | null>(null);
  // The new spread fades in under the turning leaf; on arrival the page is simply there.
  const [turned, setTurned] = useState(false);
  const go = (dir: 1 | -1) => {
    setPage((p) => Math.max(0, Math.min(n - 1, (wide ? p - (p % 2) : p) + dir * step)));
    setTurned(true);
    if (!motionReduced()) setTurn({ key: Date.now(), dir });
  };
  const canPrev = first > 0;
  const canNext = first + step < n;

  const onKey = (e: React.KeyboardEvent) => {
    const fwd = rtl ? "ArrowLeft" : "ArrowRight";
    const back = rtl ? "ArrowRight" : "ArrowLeft";
    if (e.key === fwd && canNext) (e.preventDefault(), go(1));
    if (e.key === back && canPrev) (e.preventDefault(), go(-1));
  };

  const shown = ENTRIES.slice(first, first + step);
  const label = n ? r.pageOf(first + 1, n) : "";

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 lg:px-8">
      <RunningHead left={r.title} right={t.siteTitle} />
      <header className="mt-10 max-w-3xl">
        <InkWrite as="h1" text={r.title} />
        {lang === "en" ? (
          <DropCapParagraph className="mt-6 text-lead text-ink-muted">{r.intro}</DropCapParagraph>
        ) : (
          <p className="mt-6 text-lead text-ink-muted">{r.intro}</p>
        )}
      </header>

      {n === 0 ? (
        <p className="mt-12 italic text-ink-muted">{r.empty}</p>
      ) : (
        <section
          aria-roledescription="book"
          aria-label={r.title}
          className="mt-12"
          tabIndex={0}
          onKeyDown={onKey}
          onTouchStart={(e) => (touch.current = e.touches[0]?.clientX ?? null)}
          onTouchEnd={(e) => {
            if (touch.current == null) return;
            const dx = (e.changedTouches[0]?.clientX ?? touch.current) - touch.current;
            touch.current = null;
            if (Math.abs(dx) < 50) return;
            const forward = rtl ? dx > 0 : dx < 0;
            if (forward && canNext) go(1);
            if (!forward && canPrev) go(-1);
          }}
        >
          <div className="relative" style={{ perspective: "1800px" }}>
          <Suspense fallback={null}>
            <PageLeaf turn={turn} wide={wide} rtl={rtl} onDone={() => setTurn(null)} />
          </Suspense>
          <div key={first} className="book-spread grid gap-0 lg:grid-cols-2" data-turned={turned || undefined}>
            {shown.map((e, k) => (
              <JournalPage
                key={e.id}
                entry={e}
                number={first + k + 1}
                next={ENTRIES[first + k + 1]}
                side={k === 0 ? "verso" : "recto"}
                lang={lang}
              />
            ))}
            {wide && shown.length === 1 ? <div className="journal-page journal-blank hidden lg:block" aria-hidden="true" /> : null}
          </div>
          </div>

          <div className="mt-6 flex items-center justify-between gap-4">
            <StampButton variant="secondary" onClick={() => go(-1)} disabled={!canPrev} aria-label={r.prev}>
              <Icon name="arrow" size={18} className="icon-directional -scale-x-100" />
            </StampButton>
            <p className="nums text-caption text-ink-muted" aria-live="polite">
              {label}
            </p>
            <StampButton variant="secondary" onClick={() => go(1)} disabled={!canNext} aria-label={r.next}>
              <Icon name="arrow" size={18} className="icon-directional" />
            </StampButton>
          </div>
          <p className="mt-3 text-center text-caption text-ink-muted">{r.swipe}</p>
        </section>
      )}
    </div>
  );
}

function JournalPage({
  entry,
  number,
  next,
  side,
  lang,
}: {
  entry: JournalEntry;
  number: number;
  next?: JournalEntry;
  side: "verso" | "recto";
  lang: Lang;
}) {
  const r = useRoomT().commonplace;
  const elang = entry.lang ?? "en";
  const paras = entry.body.split(/\n\s*\n/);
  return (
    <article className={`journal-page journal-${side}`} lang={elang} dir={elang === "ar" ? "rtl" : "ltr"}>
      <header className="flex items-start justify-between gap-3">
        <p className="label text-ink-muted">{formatDate(entry.date, lang, { weekday: "long", day: "numeric", month: "long" })}</p>
        {entry.placeholder ? <SpecimenStamp lang={lang} /> : null}
      </header>
      <h2 className="journal-title mt-2">{entry.title}</h2>
      <div className="journal-body mt-3 space-y-[1.75rem]">
        {paras.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      {entry.mood ? (
        <p className="mt-4 text-caption text-ink-muted">
          {r.mood}: {entry.mood}
        </p>
      ) : null}
      <footer className="journal-foot">
        <span className="signature-mark nums">{lang === "ar" ? number : roman(number)}</span>
        {next ? <span className="journal-catchword">{catchwordOf(next.title)}</span> : <span />}
      </footer>
    </article>
  );
}
