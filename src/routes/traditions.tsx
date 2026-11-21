import { useState } from "react";
import { InkWrite } from "~/components/ui/InkWrite";
import type { Route } from "./+types/traditions";
import { COMPARISON_LABELS, LabelBadge, Shield } from "~/components/ornament/Shield";
import { RunningHead, SpecimenStamp } from "~/components/ui/print";
import { data } from "~/data";
import type { Comparison, ComparisonLabel } from "~/data/types";
import { ROOMS, useRoomT } from "~/i18n/rooms";
import { STRINGS, useT } from "~/i18n/strings";
import { langOf, useLang, type Lang } from "~/lib/lang";

export const meta: Route.MetaFunction = ({ location }) => {
  const lang = langOf(location.pathname);
  return [{ title: `${ROOMS[lang].traditions.title} · ${STRINGS[lang].siteTitle}` }];
};

const LABELS = Object.keys(COMPARISON_LABELS) as ComparisonLabel[];

export default function Traditions() {
  const t = useT();
  const r = useRoomT().traditions;
  const lang = useLang();
  const [filter, setFilter] = useState<ComparisonLabel | "all">("all");
  const shown = data.comparisons.filter((c) => filter === "all" || c.label === filter);

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 lg:px-8">
      <RunningHead left={r.title} right={t.siteTitle} />
      <header className="mt-10 max-w-3xl">
        <InkWrite as="h1" text={r.title} />
        <p className="mt-4 text-lead text-ink-muted">{r.intro}</p>
      </header>

      <section aria-labelledby="legend-h" className="mt-12">
        <h2 id="legend-h" className="text-h4">
          {r.legend}
        </h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {LABELS.map((k) => {
            const l = COMPARISON_LABELS[k];
            return (
              <div key={k} className="card p-4">
                <dt className="flex items-center gap-2">
                  <Shield division={l.division} tincture={l.tincture} size={22} />
                  <span className="label text-ink">{lang === "ar" ? l.ar : l.en}</span>
                </dt>
                <dd className="mt-2 text-caption" lang="en" dir="ltr">
                  {l.meaning}
                </dd>
              </div>
            );
          })}
        </dl>
      </section>

      <div className="mt-10 flex flex-wrap items-center gap-2" role="group" aria-label={r.filter}>
        <span className="label me-2 text-ink-muted">{r.filter}</span>
        {(["all", ...LABELS] as const).map((k) => (
          <button
            key={k}
            type="button"
            className="filter-chip"
            aria-pressed={filter === k}
            onClick={() => setFilter(k)}
          >
            {k === "all" ? (
              r.all
            ) : (
              <>
                <Shield division={COMPARISON_LABELS[k].division} tincture={COMPARISON_LABELS[k].tincture} size={16} />
                {lang === "ar" ? COMPARISON_LABELS[k].ar : COMPARISON_LABELS[k].en}
              </>
            )}
          </button>
        ))}
        <span className="nums ms-auto text-caption text-ink-muted" aria-live="polite">
          {r.count(shown.length)}
        </span>
      </div>

      <ul className="mt-8 space-y-8">
        {shown.map((c) => (
          <li key={c.id}>
            <ComparisonCard c={c} lang={lang} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function Half({ side, title, body }: { side: Lang; title: string; body: string }) {
  return (
    <div lang={side} dir={side === "ar" ? "rtl" : "ltr"} className="min-w-0 p-5 sm:p-6">
      <p className="label text-ink-muted">{side === "ar" ? "العربية" : "English"}</p>
      <h3 className="mt-1 text-h4">{title}</h3>
      <p className="mt-2">{body}</p>
    </div>
  );
}

function ComparisonCard({ c, lang }: { c: Comparison; lang: Lang }) {
  const r = useRoomT().traditions;
  // The reader's language comes first (on the start side).
  const halves = lang === "ar" ? (["ar", "en"] as const) : (["en", "ar"] as const);
  return (
    <article className="card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline px-5 py-3 sm:px-6">
        <LabelBadge label={c.label} lang={lang} />
        {c.placeholder ? <SpecimenStamp lang={lang} /> : null}
      </div>
      <div className="tradition-halves grid md:grid-cols-2">
        {halves.map((h) => (
          <Half key={h} side={h} title={c[h].title} body={c[h].body} />
        ))}
      </div>
      <div className="border-t border-hairline px-5 py-3 text-caption sm:px-6">
        <span className="label me-2 text-ink-muted">{r.sources}</span>
        {c.sources.length ? c.sources.join(" · ") : <span className="italic text-ink-muted">{r.noSources}</span>}
      </div>
    </article>
  );
}
