import { Link } from "react-router";
import { InkWrite } from "~/components/ui/InkWrite";
import type { Route } from "./+types/sonnets";
import { DropCapParagraph } from "~/components/ornament/DropCap";
import { RunningHead } from "~/components/ui/print";
import { LineRing } from "~/components/ui/progress";
import { data } from "~/data";
import { ROOMS, useRoomT } from "~/i18n/rooms";
import { STRINGS, useT } from "~/i18n/strings";
import { formatDate } from "~/lib/dates";
import { langOf, useHref, useLang } from "~/lib/lang";
import { useSaved } from "~/lib/storage";

export const meta: Route.MetaFunction = ({ location }) => {
  const lang = langOf(location.pathname);
  return [{ title: `${ROOMS[lang].sonnets.title} · ${STRINGS[lang].siteTitle}` }];
};

export default function Sonnets() {
  const t = useT();
  const r = useRoomT().sonnets;
  const lang = useLang();
  const href = useHref();
  const saved = useSaved();
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
      <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.poems.map((p) => {
          const last = saved.recite[p.id]?.at(-1);
          return (
            <li key={p.id}>
              <Link to={href(`/sonnets/${p.id}`)} className="manuscript-card card card-lift group block h-full p-6 text-ink no-underline">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="label text-ornament-ink">
                      {p.kind === "sonnet" ? (lang === "ar" ? "سوناتة" : "Sonnet") : lang === "ar" ? "ماكبث" : "Macbeth"}
                    </p>
                    <h2 className="mt-1 font-display text-h3 leading-tight group-hover:underline" lang="en">
                      {p.kind === "sonnet" ? p.title.replace("Sonnet ", "") : "5.5"}
                    </h2>
                  </div>
                  <LineRing known={p.memorizedLines} total={p.lines.length} size={76} caption={r.lines} />
                </div>
                <p className="mt-5 font-heading text-lead italic leading-snug" lang="en" dir="ltr">
                  {p.lines[0]}
                </p>
                <p className="mt-4 text-caption text-ink-muted">{r.memorized(p.memorizedLines, p.lines.length)}</p>
                <p className="text-caption text-ink-muted">
                  {last ? r.lastPractice(last.known, last.total, formatDate(last.date, lang)) : r.noPractice}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
      <p className="mt-10 text-caption text-ink-muted">{r.textSource}</p>
    </div>
  );
}
