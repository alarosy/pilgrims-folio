import { useEffect, useId, useMemo, useState } from "react";
import { InkWrite } from "~/components/ui/InkWrite";
import type { Route } from "./+types/lexicon";
import { StampLink } from "~/components/ui/controls";
import { FlipCard } from "~/components/ui/FlipCard";
import { RunningHead } from "~/components/ui/print";
import { WordBack, WordFront } from "~/components/ui/WordFaces";
import { data, moduleLabel } from "~/data";
import { ROOMS, useRoomT } from "~/i18n/rooms";
import { STRINGS, useT } from "~/i18n/strings";
import { langOf, useHref, useLang } from "~/lib/lang";
import { allWords, dueQueue, todayISO } from "~/lib/srs";
import { useSaved } from "~/lib/storage";

export const meta: Route.MetaFunction = ({ location }) => {
  const lang = langOf(location.pathname);
  return [{ title: `${ROOMS[lang].lexicon.title} · ${STRINGS[lang].siteTitle}` }];
};

const WORDS = allWords();

export default function Lexicon() {
  const t = useT();
  const r = useRoomT().lexicon;
  const lang = useLang();
  const href = useHref();
  const saved = useSaved();
  const searchId = useId();
  const stationId = useId();
  const [q, setQ] = useState("");
  const [station, setStation] = useState("all");
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});
  const [today, setToday] = useState<string | null>(null);

  useEffect(() => {
    setToday(todayISO());
    const p = new URLSearchParams(window.location.search).get("q");
    if (p) setQ(p);
  }, []);

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return WORDS.filter((e) => station === "all" || e.module === station).filter((e) => {
      if (!needle) return true;
      const w = e.word;
      return [w.term, w.meaning, w.example, w.source, w.arabicNote, w.line].some((s) => s?.toLowerCase().includes(needle));
    });
  }, [q, station]);

  const real = WORDS.filter((e) => !e.placeholder);
  const due = today ? dueQueue(real, saved.srs, today).length : null;
  const onlySpecimens = WORDS.length > 0 && real.length === 0;

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 lg:px-8">
      <RunningHead left={r.title} right={t.siteTitle} />
      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_20rem] lg:items-end">
        <header>
          <InkWrite as="h1" text={r.title} />
          <p className="measure mt-4 text-lead text-ink-muted">{r.intro}</p>
        </header>
        <div className="card p-5">
          <p className="nums font-heading text-h4" aria-live="polite">
            {due === null ? " " : r.due(due)}
          </p>
          <div className="mt-4">
            <StampLink to={href("/lexicon/review")} icon="book">
              {r.review}
            </StampLink>
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-[1fr_14rem_auto] sm:items-end">
        <div>
          <label htmlFor={searchId} className="label block text-ink-muted">
            {r.search}
          </label>
          <input
            id={searchId}
            type="search"
            className="field"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="temperate…"
            aria-describedby={`${searchId}-h`}
          />
          <p id={`${searchId}-h`} className="mt-1 text-caption text-ink-muted">
            {r.searchHint}
          </p>
        </div>
        <div>
          <label htmlFor={stationId} className="label block text-ink-muted">
            {r.station}
          </label>
          <select id={stationId} className="field" value={station} onChange={(e) => setStation(e.target.value)}>
            <option value="all">{r.allStations}</option>
            {data.modules.map((m) => (
              <option key={m.id} value={m.id}>
                {moduleLabel(m.id)} · {lang === "ar" ? (m.titleAr ?? m.title) : m.title}
              </option>
            ))}
          </select>
        </div>
        <p className="nums pb-3 text-caption text-ink-muted" aria-live="polite">
          {r.count(shown.length)}
        </p>
      </div>

      {onlySpecimens ? <p className="mt-6 italic text-ink-muted">{r.specimenNote}</p> : null}

      {WORDS.length === 0 ? (
        <p className="mt-10 italic text-ink-muted">{r.empty}</p>
      ) : shown.length === 0 ? (
        <p className="mt-10 italic text-ink-muted">{r.noMatch}</p>
      ) : (
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((e) => (
            <li key={e.key}>
              <FlipCard
                flipped={Boolean(flipped[e.key])}
                onFlip={() => setFlipped((f) => ({ ...f, [e.key]: !f[e.key] }))}
                front={<WordFront word={e.word} placeholder={e.placeholder} />}
                back={<WordBack word={e.word} module={e.module} />}
                frontLabel={`${r.front}: ${e.word.term}`}
                backLabel={`${r.back}: ${e.word.term}`}
              />
            </li>
          ))}
        </ul>
      )}
      <p className="mt-10 text-caption text-ink-muted">{r.deviceNote}</p>
    </div>
  );
}
