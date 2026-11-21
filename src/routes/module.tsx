import { Link, useParams } from "react-router";
import type { Route } from "./+types/module";
import { Hedera } from "~/components/ornament/Fleuron";
import { StampedSeal } from "~/components/ornament/StampedSeal";
import { InkWrite } from "~/components/ui/InkWrite";
import { StampLink } from "~/components/ui/controls";
import { Catchword, Finis, RunningHead, SpecimenStamp } from "~/components/ui/print";
import { HoursBar, StatusMark } from "~/components/ui/progress";
import { catchwordOf, claudeUrlFor, data, moduleLabel, nextModule } from "~/data";
import type { Session } from "~/data/types";
import { useRoomT } from "~/i18n/rooms";
import { STRINGS, useT } from "~/i18n/strings";
import { formatDate, formatRange } from "~/lib/dates";
import { roman, textAttrs, useHref, useLang, type Lang } from "~/lib/lang";

export const meta: Route.MetaFunction = ({ params, location }) => {
  const ar = location.pathname.startsWith("/ar");
  const t = STRINGS[ar ? "ar" : "en"];
  const m = data.modules.find((x) => x.id === params.id);
  const title = m ? `${moduleLabel(m.id)} · ${ar ? (m.titleAr ?? m.title) : m.title}` : "—";
  return [{ title: `${title} · ${t.siteTitle}` }];
};

export default function ModulePage() {
  const t = useT();
  const r = useRoomT().module;
  const lang = useLang();
  const href = useHref();
  const { id } = useParams();
  const m = data.modules.find((x) => x.id === id);
  if (!m) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1>Exit, pursued by a bear.</h1>
        <p className="mt-6">
          <Link to={href("/map")} className="ink-link">
            {t.backToMap}
          </Link>
        </p>
      </div>
    );
  }
  const title = lang === "ar" ? (m.titleAr ?? m.title) : m.title;
  const next = nextModule(m.id);
  const weeks = data.weeks.map((w, i) => ({ w, i: i + 1 })).filter(({ w }) => w.moduleIds.includes(m.id));
  const sessions = [...m.sessions].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 lg:px-8">
      <RunningHead left={`${t.station} ${moduleLabel(m.id)}`} right={t.siteTitle} />

      <header className="mt-10 max-w-3xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="label text-ornament-ink">
            {moduleLabel(m.id)} · {t.hoursN(m.hours)}
          </p>
          <StatusMark status={m.status} lang={lang} />
        </div>
        <InkWrite as="h1" text={title} className="mt-3" />
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-14">
        <div className="min-w-0 space-y-14">
          {/* Objectives */}
          <section aria-labelledby="obj-h">
            <h2 id="obj-h" className="text-h3">
              {r.objectives}
            </h2>
            {m.objectives.length ? (
              <ol className="mt-4 space-y-2">
                {m.objectives.map((o, i) => (
                  <li key={o} className="grid grid-cols-[2.25rem_1fr] gap-2">
                    <span className="nums font-heading text-ornament-ink">{lang === "ar" ? i + 1 : roman(i + 1)}</span>
                    <span>{o}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-3 italic text-ink-muted">{r.emptyObjectives}</p>
            )}
          </section>

          {/* Concepts */}
          <section aria-labelledby="con-h">
            <h2 id="con-h" className="text-h3">
              {r.concepts}
            </h2>
            {m.concepts.length ? (
              <ul className="mt-4 flex flex-wrap gap-2">
                {m.concepts.map((c) => (
                  <li key={c} className="label rounded-sm border border-hairline bg-surface-raised px-3 py-1.5 text-ink">
                    {c}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 italic text-ink-muted">{r.emptyConcepts}</p>
            )}
          </section>

          {/* Sessions */}
          <section aria-labelledby="ses-h">
            <h2 id="ses-h" className="text-h3">
              {r.sessions}
            </h2>
            {sessions.length ? (
              <ol className="mt-5 space-y-6">
                {sessions.map((s) => (
                  <li key={s.id}>
                    <SessionCard s={s} lang={lang} />
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-3 italic text-ink-muted">{r.emptySessions}</p>
            )}
          </section>
        </div>

        {/* Sidebar: hours, weeks, the way to Claude */}
        <aside className="lg:sticky lg:top-32 lg:self-start">
          <div className="card card-lift p-6">
            <HoursBar done={m.hoursDone} total={m.hours} lang={lang} />
            {weeks.length ? (
              <p className="mt-5 text-caption">
                <span className="label me-2 text-ink-muted">{r.weeks}</span>
                {weeks.map(({ w, i }, k) => (
                  <span key={w.id}>
                    {k ? " · " : ""}
                    {t.weekN(i)} ({formatRange(w.start, w.end, lang)})
                  </span>
                ))}
              </p>
            ) : null}
            <div className="mt-6">
              <StampLink href={claudeUrlFor(m)} external iconEnd="arrow" className="w-full">
                {t.continueClaude}
                <span className="sr-only"> ({t.newTab})</span>
              </StampLink>
            </div>
          </div>
          {m.status === "done" ? (
            <div className="mt-8 flex flex-col items-center text-center">
              <StampedSeal sealId={`module-${m.id}`} size={110} numeral={m.id.slice(1)} label={r.sealed} />
              <p className="mt-2 text-caption text-ink-muted">{r.sealed}</p>
            </div>
          ) : null}
        </aside>
      </div>

      {m.status === "done" ? (
        <div className="mt-14">
          <Finis lang={lang} />
        </div>
      ) : null}

      <div className="mx-auto mt-16 max-w-3xl">
        {next ? (
          <Catchword
            to={href(`/modules/${next.id}`)}
            word={catchwordOf(lang === "ar" ? (next.titleAr ?? next.title) : next.title)}
            full={`${t.station} ${moduleLabel(next.id)}: ${lang === "ar" ? (next.titleAr ?? next.title) : next.title}`}
            kicker={t.next}
          />
        ) : (
          <Catchword
            to={href("/folio")}
            word={lang === "ar" ? "المجلّد" : "The Final"}
            full={lang === "ar" ? "المجلّد الأخير" : "The Final Folio"}
            kicker={t.next}
          />
        )}
      </div>
    </div>
  );
}

function SessionCard({ s, lang }: { s: Session; lang: Lang }) {
  const r = useRoomT().module;
  const t = useT();
  const href = useHref();
  return (
    <article className="card p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="label text-ink-muted">
          {formatDate(s.date, lang, { weekday: "long", day: "numeric", month: "long" })} · {t.hoursN(s.hours)}
        </p>
        {s.placeholder ? <SpecimenStamp lang={lang} /> : null}
      </div>
      <h3 className="mt-2 text-h4" {...textAttrs(s.title)}>
        {s.title}
      </h3>
      <p className="mt-3" {...textAttrs(s.summary)}>
        {s.summary}
      </p>
      {s.newWords.length ? (
        <div className="mt-5">
          <p className="label text-ink-muted">{r.newWords}</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {s.newWords.map((w) => (
              <li key={w.term}>
                <Link
                  to={`${href("/lexicon")}?q=${encodeURIComponent(w.term)}`}
                  className="inline-flex min-h-9 items-center rounded-sm border border-hairline bg-surface px-3 font-heading text-ink no-underline hover:border-accent"
                  lang="en"
                >
                  {w.term}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {s.reflection ? (
        <blockquote className="mt-5 border-s-2 border-ornament ps-4 italic text-ink-muted">
          <span className="label not-italic">{r.reflection}</span>
          <p className="mt-1" {...textAttrs(s.reflection)}>
            {s.reflection}
          </p>
        </blockquote>
      ) : null}
      <Hedera size={18} turned className="icon-directional ms-auto mt-4 block text-ornament-ink" />
    </article>
  );
}
