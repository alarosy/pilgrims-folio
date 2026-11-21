import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router";
import type { Route } from "./+types/sonnet";
import { Icon } from "~/components/ornament/Icon";
import { Segmented, StampButton } from "~/components/ui/controls";
import { Gloss, RunningHead } from "~/components/ui/print";
import { LineRing } from "~/components/ui/progress";
import { data } from "~/data";
import type { Poem, Word } from "~/data/types";
import { ROOMS, useRoomT } from "~/i18n/rooms";
import { STRINGS, useT } from "~/i18n/strings";
import { formatDate } from "~/lib/dates";
import { langOf, useHref, useLang } from "~/lib/lang";
import { useReducedMotion } from "~/lib/motion";
import { allWords, todayISO } from "~/lib/srs";
import { updateSaved, useSaved } from "~/lib/storage";

export const meta: Route.MetaFunction = ({ params, location }) => {
  const lang = langOf(location.pathname);
  const p = data.poems.find((x) => x.id === params.id);
  return [{ title: `${p?.title ?? ""} · ${ROOMS[lang].sonnets.title} · ${STRINGS[lang].siteTitle}` }];
};

type Mode = "read" | "recite" | "meter";

export default function SonnetPage() {
  const t = useT();
  const r = useRoomT().sonnets;
  const lang = useLang();
  const href = useHref();
  const { id } = useParams();
  const saved = useSaved();
  const poem = data.poems.find((p) => p.id === id);
  const [mode, setMode] = useState<Mode>("read");

  useEffect(() => {
    const m = new URLSearchParams(window.location.search).get("mode");
    if (m === "recite" || m === "meter") setMode(m);
  }, []);
  const choose = (m: Mode) => {
    setMode(m);
    const u = new URL(window.location.href);
    if (m === "read") u.searchParams.delete("mode");
    else u.searchParams.set("mode", m);
    window.history.replaceState(window.history.state, "", u);
  };

  if (!poem) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1>Exit, pursued by a bear.</h1>
        <Link to={href("/sonnets")} className="ink-link mt-6 inline-block">
          {r.title}
        </Link>
      </div>
    );
  }
  const last = saved.recite[poem.id]?.at(-1);
  const total = poem.lines.length;

  return (
    <div className="mx-auto max-w-5xl px-4 pt-10 sm:px-6 lg:px-8">
      <RunningHead left={r.title} right={<span lang="en">{poem.title}</span>} />

      <header className="mt-10 flex flex-wrap items-center justify-between gap-6">
        <div className="min-w-0">
          <p className="label text-ornament-ink">{poem.source}</p>
          <h1 className="mt-2 text-h2" lang="en" dir="ltr">
            {poem.title}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <LineRing known={poem.memorizedLines} total={total} size={104} caption={r.lines} />
          <div className="text-caption">
            <p className="font-semibold">{r.memorized(poem.memorizedLines, total)}</p>
            <p className="text-ink-muted">{r.official}</p>
            <p className="mt-1 text-ink-muted">
              {last ? r.lastPractice(last.known, last.total, formatDate(last.date, lang)) : r.noPractice}
            </p>
          </div>
        </div>
      </header>

      <div className="mt-10">
        <Segmented
          label={r.modes}
          value={mode}
          onChange={choose}
          options={[
            { value: "read", label: r.read },
            { value: "recite", label: r.recite },
            { value: "meter", label: r.meter },
          ]}
        />
      </div>

      <div className="mt-8">
        {mode === "read" ? <ReadView poem={poem} /> : mode === "recite" ? <ReciteView poem={poem} /> : <MeterView poem={poem} />}
      </div>

      {poem.recordingUrl ? (
        <div className="mt-8">
          <p className="label mb-2 text-ink-muted">{r.recording}</p>
          <audio controls preload="none" src={poem.recordingUrl} className="w-full" />
        </div>
      ) : null}

      <p className="mt-10 text-caption text-ink-muted">{r.textSource}</p>
      <p className="mt-6">
        <Link to={href("/sonnets")} className="ink-link">
          {r.title}
        </Link>
      </p>
      <span className="sr-only">{t.siteTitle}</span>
    </div>
  );
}

/* ------------------------------ Shared layout ------------------------------ */

/** Line label: Folger numbering (4, 8, 12 for sonnets; every fifth line for the speech). */
function lineNumber(poem: Poem, i: number) {
  const n = (poem.firstLine ?? 1) + i;
  if (poem.kind === "sonnet") return [4, 8, 12].includes(n) ? String(n) : "";
  return n % 5 === 0 ? String(n) : "";
}
/** Sonnets: space after each quatrain, couplet indented. */
const quatrainBreak = (poem: Poem, i: number) => poem.kind === "sonnet" && (i === 4 || i === 8 || i === 12);
const isCouplet = (poem: Poem, i: number) => poem.kind === "sonnet" && i >= 12;

function Manuscript({
  poem,
  children,
  className = "",
}: {
  poem: Poem;
  children: (i: number) => React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`manuscript card card-lift ${className}`} lang="en" dir="ltr">
      <ol className="manuscript-lines">
        {poem.lines.map((_, i) => (
          <li
            key={i}
            className={`manuscript-line ${quatrainBreak(poem, i) ? "mt-5" : ""} ${isCouplet(poem, i) ? "ps-8" : ""}`}
            value={(poem.firstLine ?? 1) + i}
          >
            <span className="manuscript-num nums" aria-hidden="true">
              {lineNumber(poem, i)}
            </span>
            <span className="min-w-0">{children(i)}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ------------------------------ Read ------------------------------ */

function ReadView({ poem }: { poem: Poem }) {
  // Words from the Lexicon whose source is this text become marginal glosses.
  const glosses = useMemo(() => {
    const out: Word[] = [];
    for (const e of allWords()) if (e.word.source?.startsWith(poem.title)) out.push(e.word);
    return out;
  }, [poem.title]);

  const render = (line: string) => {
    for (const w of glosses) {
      const i = line.toLowerCase().indexOf(w.term.toLowerCase());
      if (i >= 0) {
        return (
          <>
            {line.slice(0, i)}
            <Gloss word={line.slice(i, i + w.term.length)} note={w.meaning} />
            {line.slice(i + w.term.length)}
          </>
        );
      }
    }
    return line;
  };
  return <Manuscript poem={poem}>{(i) => render(poem.lines[i]!)}</Manuscript>;
}

/* ------------------------------ Recite ------------------------------ */

type Hint = "none" | "letters" | "word";

function hintFor(line: string, hint: Hint) {
  if (hint === "word") return `${line.split(" ")[0]} …`;
  if (hint === "letters")
    return line
      .split(" ")
      .map((w) => {
        const m = w.match(/[A-Za-zÀ-ÿ’']/);
        return m ? m[0] + "·".repeat(Math.max(0, Math.min(3, w.length - 2))) : w;
      })
      .join("  ");
  return "";
}

function ReciteView({ poem }: { poem: Poem }) {
  const r = useRoomT().sonnets;
  const lang = useLang();
  const [hint, setHint] = useState<Hint>("none");
  const [marks, setMarks] = useState<boolean[]>([]); // one per finished line
  const [shown, setShown] = useState(false); // current line revealed?
  const [savedRun, setSavedRun] = useState(false);
  const total = poem.lines.length;
  const at = marks.length;
  const finished = at >= total;
  const known = marks.filter(Boolean).length;

  useEffect(() => {
    if (!finished || savedRun) return;
    updateSaved((s) => ({
      ...s,
      recite: { ...s.recite, [poem.id]: [...(s.recite[poem.id] ?? []), { date: todayISO(), known, total }].slice(-30) },
    }));
    setSavedRun(true);
  }, [finished, savedRun, known, total, poem.id]);

  const mark = (ok: boolean) => {
    setMarks((m) => [...m, ok]);
    setShown(false);
  };
  const restart = () => {
    setMarks([]);
    setShown(false);
    setSavedRun(false);
  };

  return (
    <div>
      <p className="mb-5 text-ink-muted">{r.reciteIntro}</p>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <span className="label text-ink-muted">{r.hint}</span>
        <Segmented
          label={r.hint}
          value={hint}
          onChange={setHint}
          options={[
            { value: "none", label: r.hintNone },
            { value: "letters", label: r.hintLetters },
            { value: "word", label: r.hintWord },
          ]}
        />
      </div>
      <Manuscript poem={poem}>
        {(i) => {
          const line = poem.lines[i]!;
          if (i < at)
            return (
              <span className="flex items-baseline gap-2">
                <span>{line}</span>
                <Icon
                  name={marks[i] ? "check" : "close"}
                  size={16}
                  className={`shrink-0 ${marks[i] ? "text-success" : "text-danger"}`}
                  title={marks[i] ? r.knew : r.missed}
                />
              </span>
            );
          if (i === at && shown) return <span className="recite-current">{line}</span>;
          if (i === at)
            return (
              <span className="recite-hidden recite-current">
                {hintFor(line, hint) || " "}
              </span>
            );
          return <span className="recite-hidden" aria-hidden="true" />;
        }}
      </Manuscript>

      <div className="mt-6 flex min-h-12 flex-wrap items-center gap-4" aria-live="polite">
        {finished ? (
          <>
            <p className="font-heading text-h4">{r.result(known, total)}</p>
            <span className="text-caption text-ink-muted">{r.saved}</span>
            <StampButton variant="secondary" onClick={restart}>
              {r.restart}
            </StampButton>
          </>
        ) : !shown ? (
          <StampButton onClick={() => setShown(true)}>{r.revealNext}</StampButton>
        ) : (
          <>
            <StampButton onClick={() => mark(true)} icon="check">
              {r.knew}
            </StampButton>
            <StampButton variant="secondary" onClick={() => mark(false)} icon="close">
              {r.missed}
            </StampButton>
          </>
        )}
        <span className="nums ms-auto text-caption text-ink-muted" lang={lang}>
          {Math.min(at + (shown ? 1 : 0), total)} / {total}
        </span>
      </div>
    </div>
  );
}

/* ------------------------------ Meter ------------------------------ */

const TEMPO = { slow: 560, medium: 400, fast: 280 } as const;

function MeterView({ poem }: { poem: Poem }) {
  const r = useRoomT().sonnets;
  const reduced = useReducedMotion();
  const [tempo, setTempo] = useState<keyof typeof TEMPO>("medium");
  const [playing, setPlaying] = useState(false);
  const [beat, setBeat] = useState(-1);
  const timer = useRef<number | null>(null);

  // Flatten every syllable so the beat can walk through the whole poem.
  const lines = useMemo(
    () =>
      (poem.meter ?? []).map(([split, stress]) => {
        const words = split.split(" ");
        let k = 0;
        return words.map((w) => w.split("|").map((syl) => ({ syl, strong: stress[k++] === "/" })));
      }),
    [poem.meter],
  );
  const offsets = useMemo(() => {
    let n = 0;
    return lines.map((words) => {
      const start = n;
      n += words.flat().length;
      return start;
    });
  }, [lines]);
  const count = lines.reduce((s, w) => s + w.flat().length, 0);

  useEffect(() => {
    if (!playing || reduced) return;
    timer.current = window.setInterval(() => {
      setBeat((b) => {
        if (b + 1 >= count) {
          setPlaying(false);
          return -1;
        }
        return b + 1;
      });
    }, TEMPO[tempo]);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [playing, tempo, count, reduced]);

  useEffect(() => {
    if (reduced) setPlaying(false);
  }, [reduced]);

  if (!poem.meter) return null;

  return (
    <div>
      <p className="mb-5 text-caption text-ink-muted">{r.meterNote}</p>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        {!reduced ? (
          <StampButton icon={playing ? "pause" : "play"} onClick={() => setPlaying((p) => !p)} aria-pressed={playing}>
            {playing ? r.pause : r.play}
          </StampButton>
        ) : null}
        <StampButton variant="secondary" onClick={() => setBeat((b) => Math.max(0, b - 1))} aria-label={r.stepBack}>
          <Icon name="arrow" size={18} className="-scale-x-100" />
        </StampButton>
        <StampButton variant="secondary" onClick={() => setBeat((b) => Math.min(count - 1, b + 1))} aria-label={r.stepNext}>
          <Icon name="arrow" size={18} />
        </StampButton>
        {!reduced ? (
          <div className="flex items-center gap-2">
            <span className="label text-ink-muted">{r.tempo}</span>
            <Segmented
              label={r.tempo}
              value={tempo}
              onChange={setTempo}
              options={[
                { value: "slow", label: r.slow },
                { value: "medium", label: r.medium },
                { value: "fast", label: r.fast },
              ]}
            />
          </div>
        ) : (
          <p className="text-caption italic text-ink-muted">{r.reducedNote}</p>
        )}
      </div>
      <Manuscript poem={poem} className="is-meter">
        {(i) => {
          let k = offsets[i] ?? 0;
          return (
            <span className="meter-line">
              {/* Screen readers get the plain line; the syllables are visual. */}
              <span className="sr-only">{poem.lines[i]}</span>
              {lines[i]!.map((word, wi) => (
                <span key={wi} className="meter-word" aria-hidden="true">
                  {word.map((s, si) => {
                    const idx = k++;
                    return (
                      <span
                        key={si}
                        className={`meter-syl ${s.strong ? "is-strong" : "is-light"} ${idx === beat ? "is-beat" : ""}`}
                      >
                        {s.syl}
                      </span>
                    );
                  })}
                </span>
              ))}
            </span>
          );
        }}
      </Manuscript>
    </div>
  );
}
