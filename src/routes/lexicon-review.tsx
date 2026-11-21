import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { InkWrite } from "~/components/ui/InkWrite";
import type { Route } from "./+types/lexicon-review";
import { StampButton, StampLink } from "~/components/ui/controls";
import { FlipCard } from "~/components/ui/FlipCard";
import { RunningHead } from "~/components/ui/print";
import { WordBack, WordFront } from "~/components/ui/WordFaces";
import { ROOMS, useRoomT } from "~/i18n/rooms";
import { STRINGS, useT } from "~/i18n/strings";
import { langOf, useHref } from "~/lib/lang";
import { allWords, daysFor, dueQueue, GRADES, schedule, todayISO, type Grade, type LexEntry } from "~/lib/srs";
import { readSaved, updateSaved, useSaved } from "~/lib/storage";

export const meta: Route.MetaFunction = ({ location }) => {
  const lang = langOf(location.pathname);
  const r = ROOMS[lang].lexicon;
  return [{ title: `${r.reviewTitle} · ${r.title} · ${STRINGS[lang].siteTitle}` }, { name: "robots", content: "noindex" }];
};

const WORDS = allWords();
const REAL = WORDS.filter((e) => !e.placeholder);
/** The queue of a device that has reviewed nothing yet. The page is built with it, so a first visit paints at once. */
const FRESH = dueQueue(REAL, {}, "");

export default function LexiconReview() {
  const t = useT();
  const r = useRoomT().lexicon;
  const href = useHref();
  const saved = useSaved();
  const [today, setToday] = useState<string | null>(null); // null until this device's records are read
  const [queue, setQueue] = useState<LexEntry[]>(FRESH);
  const [practice, setPractice] = useState(false); // specimen words: nothing is saved
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(0);
  const [total, setTotal] = useState(FRESH.length);

  // Build today's queue once, from this device's records, before the browser paints it.
  // (readSaved, not `saved`: during hydration the hook still holds the empty default.)
  useLayoutEffect(() => {
    const d = todayISO();
    const q = dueQueue(REAL, readSaved().srs, d);
    setToday(d);
    setQueue(q);
    setTotal(q.length);
  }, []);

  // The card under the keyboard is replaced after each answer: carry focus on to the next one
  // (or to the way out when the review is done) so nobody loses their place.
  const stage = useRef<HTMLDivElement>(null);
  const carryFocus = useRef(false);
  useEffect(() => {
    if (!carryFocus.current) return;
    carryFocus.current = false;
    const next = stage.current?.querySelector<HTMLElement>(".flip-toggle") ?? stage.current?.querySelector<HTMLElement>("a, button");
    next?.focus();
  }, [queue]);

  const startSpecimens = () => {
    carryFocus.current = true;
    const q = WORDS.filter((e) => e.placeholder);
    setPractice(true);
    setQueue(q);
    setTotal(q.length);
    setDone(0);
    setFlipped(false);
  };

  const grade = (g: Grade) => {
    if (!today) return;
    const [card, ...rest] = queue;
    if (!card) return;
    if (!practice) {
      updateSaved((s) => ({ ...s, srs: { ...s.srs, [card.key]: schedule(s.srs[card.key], g, today) } }));
    }
    carryFocus.current = true;
    setQueue(g === "again" ? [...rest, card] : rest);
    if (g !== "again") setDone((n) => n + 1);
    setFlipped(false);
  };

  const current = queue[0];

  return (
    <div className="mx-auto max-w-2xl px-4 pt-10 sm:px-6">
      <RunningHead left={r.title} right={r.reviewTitle} />
      <header className="mt-10 text-center">
        <InkWrite as="h1" text={r.reviewTitle} className="text-h2" />
        <p className="mt-3 text-ink-muted">{r.reviewIntro}</p>
      </header>

      {/* A stage of fixed height: the queue is only known in the browser, so nothing below jumps when it appears. */}
      {/* data-default: still the built-in queue; a device with its own records hides it until its real queue is in. */}
      <div ref={stage} className="review-stage mt-10" aria-live="polite" data-default={today ? undefined : ""}>
        {current ? (
          <>
            <p className="nums mb-3 text-center text-caption text-ink-muted">{r.cardOf(Math.min(done + 1, total), total)}</p>
            <FlipCard
              key={`${current.key}-${done}-${queue.length}`}
              className="review-card"
              flipped={flipped}
              onFlip={() => setFlipped((f) => !f)}
              front={<WordFront word={current.word} placeholder={current.placeholder} big />}
              back={<WordBack word={current.word} module={current.module} />}
              frontLabel={r.front}
              backLabel={r.back}
            />
            <div className={`mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 ${flipped ? "" : "invisible"}`} role="group" aria-label={r.reviewTitle}>
              {GRADES.map((g) => (
                <div key={g} className="flex flex-col items-stretch text-center">
                  <StampButton variant={g === "good" ? "primary" : "secondary"} onClick={() => grade(g)} tabIndex={flipped ? 0 : -1}>
                    {r[g]}
                  </StampButton>
                  <span className="mt-1 text-caption text-ink-muted">
                    {g === "again" ? r.againHint : r.nextIn(daysFor(saved.srs[current.key], g, today ?? ""))}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-8 text-center">
              <StampLink to={href("/lexicon")} variant="quiet">
                {r.backToLexicon}
              </StampLink>
            </p>
          </>
        ) : (
          <div className="card p-8 text-center">
            {total > 0 ? (
              <>
                <h2 className="text-h3">{r.doneTitle}</h2>
                <p className="mt-3">{r.doneBody(done)}</p>
              </>
            ) : (
              <>
                <p className="font-heading text-h4">{r.noneDue}</p>
                {!practice && WORDS.some((e) => e.placeholder) ? (
                  <div className="mt-6">
                    <StampButton variant="secondary" onClick={startSpecimens}>
                      {r.trySpecimens}
                    </StampButton>
                  </div>
                ) : null}
              </>
            )}
            <p className="mt-6">
              <Link to={href("/lexicon")} className="ink-link">
                {r.backToLexicon}
              </Link>
            </p>
          </div>
        )}
      </div>

      <p className="mt-6 text-center text-caption text-ink-muted">{practice ? r.specimenNote : r.deviceNote}</p>
      <span className="sr-only">{t.siteTitle}</span>
    </div>
  );
}
