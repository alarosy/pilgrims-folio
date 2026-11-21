import { useEffect, useRef, type ReactNode } from "react";
import { InkWrite } from "~/components/ui/InkWrite";
import { loadGsap, motionReduced } from "~/lib/motion";
import { Link, useNavigate } from "react-router";
import type { Route } from "./+types/prologue";
import { DropCapParagraph } from "~/components/ornament/DropCap";
import { HeadPiece } from "~/components/ornament/HeadPiece";
import { StampLink } from "~/components/ui/controls";
import { Catchword, RunningHead } from "~/components/ui/print";
import { HoursBar, StatusMark } from "~/components/ui/progress";
import { claudeUrlFor, data, moduleLabel, progress } from "~/data";
import { STRINGS, useT } from "~/i18n/strings";
import { dayInfo, formatDate, useToday } from "~/lib/dates";
import { arHours, roman, textAttrs, useHref, useLang, type Lang } from "~/lib/lang";
import { useSaved } from "~/lib/storage";
import { Curtain } from "~/scenes/Curtain";
import { Hourglass } from "~/scenes/Hourglass";
import { Skyline } from "~/scenes/Skyline";

export const meta: Route.MetaFunction = ({ location }) => {
  const ar = location.pathname.startsWith("/ar");
  const t = STRINGS[ar ? "ar" : "en"];
  return [
    { title: ar ? `${t.siteTitle} · ${t.prologue.eyebrow}` : `${t.siteTitle} · A companion to 100 hours of Shakespeare` },
    { name: "description", content: t.prologue.intro },
  ];
};

export default function Prologue() {
  const lang = useLang();
  const saved = useSaved();
  const navigate = useNavigate();

  // Someone who chose Arabic last time arrives at the Arabic Prologue.
  useEffect(() => {
    if (lang === "en" && saved.settings.lang === "ar") navigate("/ar", { replace: true });
  }, [lang, saved.settings.lang, navigate]);

  return (
    <>
      <Curtain />
      <Hero />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Intro />
        <Today />
        <Reckoning />
        <NextToMap />
      </div>
    </>
  );
}

/* ------------------------------ Hero ------------------------------ */

function Hero() {
  const t = useT();
  const ref = useRef<HTMLElement>(null);

  // Parallax: the far city drifts more slowly than the near bank as the page
  // scrolls, giving depth; the words lift away first. GSAP loads only here,
  // only with motion allowed, and after the page is interactive.
  useEffect(() => {
    const hero = ref.current;
    if (!hero || motionReduced()) return;
    let undo: (() => void) | undefined;
    let cancelled = false;
    loadGsap().then(({ gsap }) => {
      if (cancelled) return;
      const ctx = gsap.context(() => {
        const st = { trigger: hero, start: "top top", end: "bottom top", scrub: true };
        const speeds: [string, number][] = [
          [".sky", 140],
          [".far", 95],
          [".river", 55],
          [".bridge", 55],
          [".near", 0],
        ];
        for (const [sel, y] of speeds) if (y) gsap.to(sel, { y, ease: "none", scrollTrigger: st });
        gsap.to(".hero-words", { y: -60, opacity: 0, ease: "none", scrollTrigger: { ...st, end: "60% top" } });
      }, hero);
      undo = () => ctx.revert();
    });
    return () => {
      cancelled = true;
      undo?.();
    };
  }, []);

  return (
    <section ref={ref} aria-labelledby="hero-quote" className="hero relative isolate overflow-hidden">
      <Skyline className="absolute inset-0 -z-10 h-full w-full" />
      <div className="hero-veil absolute inset-0 -z-10" aria-hidden="true" />
      <div className="hero-words mx-auto max-w-4xl px-4 pt-[9vh] text-center sm:px-6">
        <p className="label hero-ink-muted">{t.prologue.eyebrow}</p>
        <div lang="en" dir="ltr">
          <InkWrite
            as="h1"
            id="hero-quote"
            text={t.prologue.quote}
            by="letter"
            step={42}
            afterCurtain
            className="hero-ink mt-4 text-display leading-[1.02]"
          />
        </div>
        {t.prologue.quoteGloss ? <p className="hero-ink hero-after mt-3 text-h4">{t.prologue.quoteGloss}</p> : null}
        <p className="hero-ink-muted hero-after mt-3 text-caption italic">{t.prologue.quoteSource}</p>
      </div>
    </section>
  );
}

/* ------------------------------ Intro ------------------------------ */

function Intro() {
  const t = useT();
  const lang = useLang();
  return (
    <section className="mx-auto max-w-3xl pt-14 sm:pt-20">
      <HeadPiece />
      {lang === "en" ? (
        <DropCapParagraph className="mt-10 text-lead">{t.prologue.intro}</DropCapParagraph>
      ) : (
        <p className="mt-10 text-lead">{t.prologue.intro}</p>
      )}
    </section>
  );
}

/* ------------------------------ Today ------------------------------ */

function Today() {
  const t = useT();
  const lang = useLang();
  const href = useHref();
  const p = progress();
  const current = p.currentModule;
  return (
    <section aria-labelledby="today-h" className="mt-16 sm:mt-24">
      <RunningHead left={t.prologue.eyebrow} right={t.siteTitle} />
      <h2 id="today-h" className="sr-only">
        {t.prologue.todayTitle}
      </h2>
      <div className="mt-8 grid gap-6 md:grid-cols-[minmax(0,15rem)_1fr] lg:grid-cols-[15rem_1fr_1fr]">
        {/* The hours */}
        <figure className="card flex flex-col items-center p-6 text-center md:row-span-2 lg:row-span-1">
          <figcaption className="label text-ink-muted">{t.prologue.hoursTitle}</figcaption>
          <div className="mt-4">
            <Hourglass done={p.completedHours} total={p.totalHours} size={180} fill />
          </div>
          <p className="nums mt-4 text-h3">
            {lang === "ar" ? `${p.completedHours} من ${p.totalHours}` : `${p.completedHours} of ${p.totalHours}`}
          </p>
          <p className="text-caption text-ink-muted">{t.prologue.hoursLeft(p.remainingHours)}</p>
        </figure>

        {/* The current station */}
        {current ? (
          <article className="card card-lift flex flex-col p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <p className="label text-ink-muted">{t.prologue.stationTitle}</p>
              <StatusMark status={current.status} lang={lang} />
            </div>
            <h3 className="mt-3">
              <span className="label me-2 align-middle text-ornament-ink">{moduleLabel(current.id)}</span>
              <Link to={href(`/modules/${current.id}`)} className="text-ink no-underline hover:underline">
                {lang === "ar" ? (current.titleAr ?? current.title) : current.title}
              </Link>
            </h3>
            <div className="mt-5">
              <HoursBar done={current.hoursDone} total={current.hours} lang={lang} />
            </div>
            <div className="mt-auto pt-7">
              <StampLink href={claudeUrlFor(current)} external iconEnd="arrow">
                {t.continueClaude}
                <span className="sr-only"> ({t.newTab})</span>
              </StampLink>
            </div>
          </article>
        ) : null}

        {/* Today's step */}
        <TodayStep lang={lang} />
      </div>
    </section>
  );
}

function TodayStep({ lang }: { lang: Lang }) {
  const t = useT();
  const today = useToday();
  const href = useHref();
  const p = progress();
  const info = today ? dayInfo(today) : null;
  const current = p.currentModule;
  const objective =
    p.nextObjective ||
    (current
      ? t.prologue.begin(moduleLabel(current.id), lang === "ar" ? (current.titleAr ?? current.title) : current.title)
      : "");
  const pace = info && info.phase === "during" ? Math.round(info.plannedHours) : null;

  return (
    <article className="card flex flex-col p-6" aria-labelledby="step-h">
      <h3 id="step-h" className="label text-ink-muted">
        {t.prologue.todayTitle}
      </h3>
      {/* Date-dependent lines appear once the browser knows today's date. */}
      <p className="mt-3 min-h-[1.65em] font-heading text-h4" aria-live="polite">
        {!info
          ? " "
          : info.phase === "before"
            ? t.prologue.before(info.daysUntil)
            : info.phase === "during"
              ? `${t.prologue.dayOf(info.day, 41)}${info.weekIndex ? ` · ${t.weekN(info.weekIndex)}` : ""}`
              : t.prologue.after}
      </p>
      {info?.phase === "before" ? (
        <p className="mt-1 text-caption text-ink-muted">
          {t.prologue.firstDay(formatDate(data.config.startDate, lang, { weekday: "long", day: "numeric", month: "long" }))}
        </p>
      ) : null}
      <p className="mt-5 text-lead">{objective}</p>
      {pace !== null ? <p className="mt-3 text-caption text-ink-muted">{t.prologue.evenPace(pace)}</p> : null}
      <p className="mt-auto pt-6">
        <Link to={href("/map")} className="ink-link">
          {t.map.title}
        </Link>
      </p>
    </article>
  );
}

/* ------------------------------ The Reckoning ------------------------------ */

function Reckoning() {
  const t = useT();
  const lang = useLang();
  const href = useHref();
  const p = progress();
  const r = t.prologue.rows;
  const none = <span className="italic text-ink-muted">{t.none}</span>;
  const list = (items: string[]) =>
    items.length ? (
      <ul className="space-y-0.5">
        {items.map((x) => (
          <li key={x} {...textAttrs(x)}>
            {x}
          </li>
        ))}
      </ul>
    ) : (
      none
    );
  const hours = (n: number) => (lang === "ar" ? arHours(n) : `${n}`);

  const rows: [string, ReactNode][] = [
    [r.totalHours, hours(p.totalHours)],
    [r.completedHours, hours(p.completedHours)],
    [r.remainingHours, hours(p.remainingHours)],
    [
      r.currentModule,
      p.currentModule ? (
        <Link to={href(`/modules/${p.currentModule.id}`)} className="no-underline hover:underline">
          <span className="label me-2 text-ornament-ink">{moduleLabel(p.currentModule.id)}</span>
          {lang === "ar" ? (p.currentModule.titleAr ?? p.currentModule.title) : p.currentModule.title}
        </Link>
      ) : (
        none
      ),
    ],
    [r.lessonsCompleted, p.lessonsCompleted],
    [r.vocabularyAcquired, t.prologue.words(p.vocabularyAcquired)],
    [r.sonnetsMemorized, t.prologue.xOfY(p.sonnetsMemorized, p.sonnetsTotal)],
    [r.textsAnalysed, list(p.textsAnalysed)],
    [r.conceptsMastered, list(p.conceptsMastered)],
    [
      r.assessments,
      p.assessments.length ? (
        <ul className="space-y-1">
          {p.assessments.map((a) => (
            <li key={`${a.date}${a.title}`}>
              <span className="nums text-ink-muted">{formatDate(a.date, lang)}</span> ·{" "}
              <span {...textAttrs(a.title)}>{a.title}</span>:{" "}
              <strong className="font-semibold" {...textAttrs(a.result)}>
                {a.result}
              </strong>
            </li>
          ))}
        </ul>
      ) : (
        none
      ),
    ],
    [r.weaknesses, list(p.weaknesses)],
    [r.nextObjective, p.nextObjective || none],
  ];

  return (
    <section aria-labelledby="reckoning-h" className="mt-20 sm:mt-28">
      <div className="mx-auto max-w-3xl text-center">
        <InkWrite as="h2" id="reckoning-h" text={t.prologue.reckoning} onView />
        <p className="mt-2 text-ink-muted">{t.prologue.reckoningSub}</p>
      </div>
      <div className="ledger card mx-auto mt-10 max-w-3xl">
        <table className="w-full border-collapse">
          <tbody>
            {rows.map(([label, value], i) => (
              <tr key={label} className="ledger-row">
                <th scope="row" className="ledger-item">
                  <span className="nums me-3 text-ornament-ink">{roman(i + 1)}</span>
                  {label}
                </th>
                <td className="ledger-entry nums">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function NextToMap() {
  const t = useT();
  const href = useHref();
  return (
    <div className="mx-auto mt-16 max-w-3xl">
      <Catchword to={href("/map")} word={t.prologue.toMap} full={t.prologue.toMapFull} kicker={t.next} />
    </div>
  );
}
