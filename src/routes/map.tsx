import { InkWrite } from "~/components/ui/InkWrite";
import type { Route } from "./+types/map";
import { Icon } from "~/components/ornament/Icon";
import { HoursBar } from "~/components/ui/progress";
import { StatusMark } from "~/components/ui/progress";
import { Catchword, RunningHead } from "~/components/ui/print";
import { catchwordOf, data, moduleLabel, progress } from "~/data";
import { STRINGS, useT } from "~/i18n/strings";
import { dayInfo, formatRange, useToday, weekSpans } from "~/lib/dates";
import { roman, useHref, useLang } from "~/lib/lang";
import { PilgrimMap } from "~/scenes/PilgrimMap";

export const meta: Route.MetaFunction = ({ location }) => {
  const t = STRINGS[location.pathname.startsWith("/ar") ? "ar" : "en"];
  return [{ title: `${t.map.title} · ${t.siteTitle}` }, { name: "description", content: t.map.intro }];
};

export default function MapPage() {
  const t = useT();
  const lang = useLang();
  const href = useHref();
  const today = useToday();
  const p = progress();
  const info = today ? dayInfo(today) : null;
  const first = data.modules[0]!;

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 lg:px-8">
      <RunningHead left={t.map.title} right={t.siteTitle} />
      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_30rem] lg:gap-16">
        {/* The key: sticky beside the map on wide screens, above it on phones */}
        <aside className="lg:sticky lg:top-32 lg:self-start">
          <InkWrite as="h1" text={t.map.title} />
          <p className="measure mt-4 text-lead text-ink-muted">{t.map.intro}</p>

          <div className="card mt-8 p-5">
            <p className="flex items-center gap-3">
              <Icon name="quill" size={26} className="shrink-0 text-ornament-ink" />
              <span className="nums">{t.map.youAreHere(p.completedHours)}</span>
            </p>
            <div className="mt-4">
              <HoursBar done={p.completedHours} total={p.totalHours} lang={lang} />
            </div>
            <p className="mt-4 min-h-[1.5em] text-caption text-ink-muted" aria-live="polite">
              {!info
                ? " "
                : info.phase === "before"
                  ? t.map.paceBefore
                  : info.phase === "during"
                    ? t.map.paceDuring(Math.round(info.plannedHours))
                    : t.map.paceAfter}
            </p>
          </div>

          <h2 className="mt-10 text-h4">{t.map.key}</h2>
          <ul className="mt-3 space-y-2">
            <li>
              <StatusMark status="done" lang={lang} />
            </li>
            <li>
              <StatusMark status="current" lang={lang} />
            </li>
            <li>
              <StatusMark status="locked" lang={lang} />
            </li>
            <li className="flex items-center gap-2 text-caption">
              <Icon name="quill" size={22} className="text-ornament-ink" />
              {t.map.quill}
            </li>
            <li className="flex items-center gap-2 text-caption">
              <svg width="22" height="22" viewBox="-12 -12 24 24" aria-hidden="true">
                {Array.from({ length: 8 }, (_, i) => (
                  <path key={i} d="M0-7.5V-10.5" transform={`rotate(${i * 45})`} stroke="var(--c-candle)" strokeWidth="1.6" />
                ))}
                <circle r="5" fill="var(--c-candle)" stroke="var(--c-gilt-ink)" />
              </svg>
              {t.map.sun}
            </li>
          </ul>

          <h2 className="mt-10 text-h4">{t.map.weeks}</h2>
          <ol className="mt-3">
            {weekSpans().map((w) => {
              const now = info?.phase === "during" && info.week?.id === w.week.id;
              return (
                <li
                  key={w.week.id}
                  className="flex flex-wrap items-baseline justify-between gap-x-4 border-b border-hairline py-2"
                  aria-current={now ? "date" : undefined}
                >
                  <span className={now ? "text-accent" : ""}>
                    {lang === "ar" ? (
                      <span className="me-3 text-ornament-ink">{t.weekN(w.index)}</span>
                    ) : (
                      <span className="me-2 inline-block w-8 font-heading text-ornament-ink">{roman(w.index)}</span>
                    )}
                    {formatRange(w.week.start, w.week.end, lang)}
                  </span>
                  <span className="label text-ink-muted">{w.week.moduleIds.map(moduleLabel).join(" · ")}</span>
                </li>
              );
            })}
          </ol>
          <p className="mt-3 text-caption italic text-ink-muted">{t.map.provisional}</p>
        </aside>

        <div>
          <PilgrimMap />
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-3xl">
        <Catchword
          to={href(`/modules/${first.id}`)}
          word={catchwordOf(lang === "ar" ? (first.titleAr ?? first.title) : first.title)}
          full={`${t.station} ${moduleLabel(first.id)}: ${lang === "ar" ? (first.titleAr ?? first.title) : first.title}`}
          kicker={t.next}
        />
      </div>
    </div>
  );
}
