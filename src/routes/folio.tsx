import type { Route } from "./+types/folio";
import { TudorRose } from "~/components/ornament/TudorRose";
import { StampedSeal } from "~/components/ornament/StampedSeal";
import { InkWrite } from "~/components/ui/InkWrite";
import { Icon } from "~/components/ornament/Icon";
import { RunningHead } from "~/components/ui/print";
import { CandleMark } from "~/components/ui/progress";
import { data } from "~/data";
import { ROOMS, useRoomT } from "~/i18n/rooms";
import { STRINGS, useT } from "~/i18n/strings";
import { formatDate } from "~/lib/dates";
import { langOf, roman, useLang } from "~/lib/lang";

export const meta: Route.MetaFunction = ({ location }) => {
  const lang = langOf(location.pathname);
  return [{ title: `${ROOMS[lang].folio.title} · ${STRINGS[lang].siteTitle}` }];
};

export default function FinalFolio() {
  const t = useT();
  const r = useRoomT().folio;
  const lang = useLang();
  const works = data.finalWorks;
  const bound = works.filter((w) => w.status === "done").length;

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 lg:px-8">
      <RunningHead left={r.title} right={t.siteTitle} />
      <header className="mt-10 max-w-3xl">
        <InkWrite as="h1" text={r.title} />
        <p className="mt-4 text-lead text-ink-muted">{r.intro}</p>
      </header>

      <div className="mt-12 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {/* The book: spine with five gatherings, and its title page */}
        <figure className="folio-book" aria-labelledby="bound-cap">
          <div className="folio-spine" aria-hidden="true">
            {works.map((w) => (
              <span key={w.id} className={`folio-gathering is-${w.status}`} />
            ))}
          </div>
          <div className="folio-title card card-lift">
            <div className="folio-frame">
              {lang === "ar" ? (
                <>
                  <p className="text-h4 font-bold">{r.titleLine1}</p>
                  <p className="mt-2 text-h2 font-bold leading-tight">{r.titleLine2}</p>
                  <p className="mt-1 text-h3">{r.titleLine3}</p>
                </>
              ) : (
                <>
                  <p className="font-display text-h4 tracking-wide">{r.titleLine1.toUpperCase()}</p>
                  <p className="mt-2 font-display text-h2 leading-none">SHAKESPEARE</p>
                  <p className="font-display text-h3 tracking-[0.12em]">STUDIES,</p>
                  <p className="mt-2 font-display text-h4 italic">{r.titleLine3}</p>
                </>
              )}
              <div className="mx-auto my-5 h-[6px] w-2/3 border-y border-ink/60" />
              <p className="text-caption italic">{r.titleLine4}</p>
              <TudorRose size={64} className="mx-auto my-6" />
              <p className="label">{r.imprint}</p>
            </div>
          </div>
          <figcaption id="bound-cap" className="nums mt-4 text-center font-heading text-h4">
            {r.bound(bound)}
          </figcaption>
        </figure>

        {/* The catalogue of works */}
        <section aria-labelledby="works-h">
          <h2 id="works-h" className="text-h3">
            {r.worksTitle}
          </h2>
          <ol className="mt-6 space-y-3">
            {works.map((w, i) => (
              <li key={w.id} className="card flex items-center gap-4 p-4">
                <span className="nums w-8 shrink-0 text-center font-heading text-h4 text-ornament-ink">
                  {lang === "ar" ? i + 1 : roman(i + 1)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-heading text-h4 leading-tight">{lang === "ar" ? (w.titleAr ?? w.title) : w.title}</span>
                  <span className={`label ${w.status === "done" ? "text-success" : w.status === "in-progress" ? "text-accent" : "text-ink-muted"}`}>
                    {r.status[w.status]}
                    {w.date ? ` · ${formatDate(w.date, lang)}` : ""}
                  </span>
                  {w.link ? (
                    <a href={w.link} className="ink-link ms-3 text-caption" target="_blank" rel="noopener noreferrer">
                      {r.open}
                    </a>
                  ) : null}
                </span>
                <span className="shrink-0" aria-hidden="true">
                  {w.status === "done" ? (
                    <StampedSeal sealId={`work-${w.id}`} size={44} />
                  ) : w.status === "in-progress" ? (
                    <CandleMark size={34} />
                  ) : (
                    <Icon name="lock" size={22} className="text-ink-muted" />
                  )}
                </span>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
