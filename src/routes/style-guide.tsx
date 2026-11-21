import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import type { Route } from "./+types/style-guide";
import { DropCapParagraph } from "~/components/ornament/DropCap";
import { Floret, Hedera, OrnamentRule } from "~/components/ornament/Fleuron";
import { HeadPiece } from "~/components/ornament/HeadPiece";
import { Icon, ICONS, type IconName } from "~/components/ornament/Icon";
import { COMPARISON_LABELS, LabelBadge, Shield, type ComparisonLabel } from "~/components/ornament/Shield";
import { TudorRose } from "~/components/ornament/TudorRose";
import { WaxSeal } from "~/components/ornament/WaxSeal";
import { Segmented, StampButton, StampLink, Switch, TextField } from "~/components/ui/controls";
import { Catchword, Finis, Gloss, RunningHead, SignatureMark, SpecimenStamp } from "~/components/ui/print";
import { HoursBar, LineRing, StatusMark } from "~/components/ui/progress";
import { contrast, grade } from "~/lib/contrast";
import { useReducedMotion } from "~/lib/motion";
import { Hourglass } from "~/scenes/Hourglass";
import { StampedSeal } from "~/components/ornament/StampedSeal";
import { InkWrite } from "~/components/ui/InkWrite";
import { FlipCard } from "~/components/ui/FlipCard";

export const meta: Route.MetaFunction = () => [
  { title: "Specimen of the Design System · The Pilgrim's Folio" },
  { name: "robots", content: "noindex" },
  { name: "description", content: "Tokens, letters, ornaments and components of The Pilgrim's Folio." },
];

const PLATES = [
  ["colour", "Colour"],
  ["letters", "Letters"],
  ["ornaments", "Ornaments"],
  ["icons", "Icons"],
  ["furniture", "Print furniture"],
  ["controls", "Controls"],
  ["surfaces", "Surfaces"],
  ["measures", "Measures of progress"],
  ["labels", "Comparison labels"],
  ["themes", "The two themes"],
  ["arabic", "Arabic & right-to-left"],
  ["motion", "Motion"],
] as const;

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

type Theme = "parchment" | "macbeth";

/* ------------------------------------------------------------------ */

export default function StyleGuide() {
  const [theme, setTheme] = useState<Theme>("parchment");
  const [dir, setDir] = useState<"ltr" | "rtl">("ltr");
  const [motion, setMotion] = useState<"system" | "reduced">("system");

  // ?plate=<id> shows one plate on its own; ?theme=macbeth and ?dir=rtl preset the switches.
  // Read after mount so the prerendered HTML and the first client render match.
  const [only, setOnly] = useState<string | null>(null);
  useEffect(() => {
    const d = document.documentElement;
    const q = new URLSearchParams(window.location.search);
    if (d.dataset.theme === "macbeth" || q.get("theme") === "macbeth") setTheme("macbeth");
    if (d.dataset.motion === "reduced") setMotion("reduced");
    if (q.get("dir") === "rtl") setDir("rtl");
    setOnly(q.get("plate"));
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);
  useEffect(() => {
    document.documentElement.dir = dir;
  }, [dir]);
  useEffect(() => {
    const d = document.documentElement;
    if (motion === "reduced") d.dataset.motion = "reduced";
    else delete d.dataset.motion;
  }, [motion]);

  return (
    <>
      <a href="#plates" className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-50 focus:bg-surface focus:p-3">
        Skip to the plates
      </a>

      <header className="border-b border-rule bg-surface md:sticky md:top-0 md:z-40">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 sm:px-6 lg:px-8">
          <p className="label me-auto flex items-center gap-2 text-ink">
            <TudorRose size={22} />
            The Pilgrim’s Folio · Specimen
          </p>
          <Segmented
            label="Theme"
            value={theme}
            onChange={setTheme}
            options={[
              { value: "parchment", label: "Parchment" },
              { value: "macbeth", label: "Candlelight" },
            ]}
          />
          <Segmented
            label="Page direction"
            value={dir}
            onChange={setDir}
            options={[
              { value: "ltr", label: "LTR" },
              { value: "rtl", label: "RTL test" },
            ]}
          />
          <Segmented
            label="Motion"
            value={motion}
            onChange={setMotion}
            options={[
              { value: "system", label: "Motion: system" },
              { value: "reduced", label: "Reduced" },
            ]}
          />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-24 sm:px-6 lg:px-8">
        {only ? <div className="h-10" /> : <TitlePage />}

        <OnlyPlate.Provider value={only}>
        <div id="plates" className="space-y-24">
          <Plate n={0} id="colour" intro="Raw colours feed semantic roles; components only ever use roles. Ratios below are computed live from the stylesheet, against both grounds of each theme.">
            <ColourPlate />
          </Plate>
          <Plate n={1} id="letters" intro="Fell types for display, Garamond for everything that must be read, blackletter for one word at most, Amiri for Arabic.">
            <LettersPlate />
          </Plate>
          <Plate n={2} id="ornaments" intro="All drawn for this site as SVG. Every ornament marks a beginning, an end, or a state.">
            <OrnamentsPlate />
          </Plate>
          <Plate n={3} id="icons" intro="One family, 24px grid, 1.5 stroke. Arrows and the pointing hand turn round in Arabic.">
            <IconsPlate />
          </Plate>
          <Plate n={4} id="furniture" intro="Old book conventions that do real work: where you are, what comes next, what a word means, what is finished, and what is only a placeholder.">
            <FurniturePlate />
          </Plate>
          <Plate n={5} id="controls" intro="Hover, press and Tab through these. Every target is at least 44px tall.">
            <ControlsPlate />
          </Plate>
          <Plate n={6} id="surfaces" intro="Square corners, inner rules, and one soft lift for things that sit above the page.">
            <SurfacesPlate />
          </Plate>
          <Plate n={7} id="measures" intro="Shown at rest. Sand, ring and road animate in Phase 5; the numbers always sit beside the picture.">
            <MeasuresPlate />
          </Plate>
          <Plate n={8} id="labels" intro="Every card in Two Traditions must carry exactly one of these. Shape encodes the strength of the claim, so colour is never the only signal.">
            <LabelsPlate />
          </Plate>
          <Plate n={9} id="themes" intro="The same module card in both themes. Macbeth mode uses the candlelight palette; the fog and flicker are added on that section only.">
            <ThemesPlate />
          </Plate>
          <Plate n={10} id="arabic" intro="The same card in Arabic, right to left. The Arabic strings are drafts for Ali to review.">
            <ArabicPlate />
          </Plate>
          <Plate n={11} id="motion" intro="Durations and curves. Use the Motion switch above to see the reduced versions.">
            <MotionPlate />
          </Plate>
        </div>
        </OnlyPlate.Provider>

        <div className="mt-24">
          <OrnamentRule />
          <Finis />
          <p className="mt-6 text-center text-caption text-ink-muted">
            Shakespeare’s lines quoted here follow the Folger Shakespeare edition (CC BY-NC 3.0).
          </p>
        </div>
      </main>
    </>
  );
}

/* ------------------------------------------------------------------ */

function TitlePage() {
  return (
    <section className="py-16 text-center sm:py-24" aria-labelledby="title">
      <HeadPiece className="mx-auto max-w-2xl" />
      <p className="label mt-10 text-ink-muted">A Specimen of the</p>
      <h1 id="title" className="mx-auto mt-3 max-w-3xl text-display leading-none">
        Letters, Ornaments <span className="italic">&amp;</span> Furniture
      </h1>
      <p className="label mt-5 text-ink-muted">from which every page of</p>
      <p className="mt-2 font-display text-h2 italic text-accent">The Pilgrim’s Folio</p>
      <p className="label mt-2 text-ink-muted">is composed</p>
      <div className="mx-auto mt-10 flex max-w-md items-center gap-4 text-ornament-ink">
        <div className="rule-double flex-1" />
        <TudorRose size={40} />
        <div className="rule-double flex-1" />
      </div>
      <nav aria-label="Plates" className="mx-auto mt-12 max-w-3xl">
        <ol className="grid grid-cols-1 gap-x-10 gap-y-1 text-start sm:grid-cols-2">
          {PLATES.map(([id, name], i) => (
            <li key={id} className="flex items-baseline gap-3 border-b border-hairline py-1.5">
              <span className="nums w-10 shrink-0 font-heading text-ornament-ink">{ROMAN[i]}</span>
              <a href={`#${id}`} className="ink-link">
                {name}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </section>
  );
}

const OnlyPlate = createContext<string | null>(null);

function Plate({ n, id, intro, children }: { n: number; id: string; intro: string; children: ReactNode }) {
  const only = useContext(OnlyPlate);
  const name = PLATES[n]![1];
  if (only && only !== id) return null;
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-24">
      <RunningHead left={`Plate ${ROMAN[n]}`} right="The Pilgrim’s Folio" />
      <h2 id={`${id}-h`} className="mt-6">
        {name}
      </h2>
      <p className="measure mt-3 text-ink-muted">{intro}</p>
      <div className="mt-10">{children}</div>
    </section>
  );
}

function Sub({ title, children, note }: { title: string; children: ReactNode; note?: string }) {
  const id = title.toLowerCase().replace(/[^a-z]+/g, "-").replace(/(^-|-$)/g, "");
  return (
    <div id={id} className="mt-12 scroll-mt-28 first:mt-0">
      <h3 className="flex items-center gap-3">
        <Hedera size={22} turned className="icon-directional shrink-0 text-ornament-ink" />
        {title}
      </h3>
      {note ? <p className="measure mt-2 text-caption text-ink-muted">{note}</p> : null}
      <div className="mt-6">{children}</div>
    </div>
  );
}

/* ------------------------------ I. Colour ------------------------------ */

const SWATCHES: Record<Theme, { name: string; v: string; role: string; ground?: boolean }[]> = {
  parchment: [
    { name: "Parchment", v: "--c-parchment", role: "Page ground", ground: true },
    { name: "Aged paper", v: "--c-aged", role: "Cards, raised surfaces", ground: true },
    { name: "Iron-gall ink", v: "--c-ink", role: "Body text" },
    { name: "Faded ink", v: "--c-ink-faded", role: "Secondary text, locked" },
    { name: "Oxblood", v: "--c-oxblood", role: "Links, primary, focus" },
    { name: "Tudor green", v: "--c-tudor", role: "Done" },
    { name: "Gilt ink", v: "--c-gilt-ink", role: "Gold-toned text" },
    { name: "Gilt gold", v: "--c-gilt", role: "Ornament only" },
  ],
  macbeth: [
    { name: "Soot", v: "--c-soot", role: "Page ground", ground: true },
    { name: "Raised soot", v: "--c-soot-raised", role: "Cards", ground: true },
    { name: "Tallow", v: "--c-tallow", role: "Body text" },
    { name: "Fog", v: "--c-fog", role: "Secondary text" },
    { name: "Candle", v: "--c-candle", role: "Links, primary, focus" },
    { name: "Sage", v: "--c-sage", role: "Done" },
    { name: "Ember", v: "--c-ember", role: "Red text in the dark" },
    { name: "Blood", v: "--c-blood", role: "Ornament, fills only" },
  ],
};

function ColourPlate() {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {(["parchment", "macbeth"] as const).map((t) => (
        <div key={t} data-theme={t} className="card p-5 sm:p-6">
          <h3 className="text-h4">{t === "parchment" ? "Parchment" : "Macbeth · Candlelight"}</h3>
          <SwatchTable theme={t} />
        </div>
      ))}
    </div>
  );
}

function SwatchTable({ theme }: { theme: Theme }) {
  const ref = useRef<HTMLTableElement>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  useEffect(() => {
    if (!ref.current) return;
    const cs = getComputedStyle(ref.current);
    const next: Record<string, string> = {};
    for (const s of SWATCHES[theme]) next[s.v] = cs.getPropertyValue(s.v).trim();
    setValues(next);
  }, [theme]);
  const grounds = SWATCHES[theme].filter((s) => s.ground);
  return (
    <table ref={ref} className="mt-4 w-full border-collapse text-start text-caption">
      <thead>
        <tr className="border-b border-rule text-ink-muted">
          <th scope="col" className="label py-2 text-start font-medium">
            Colour
          </th>
          {grounds.map((g) => (
            <th key={g.v} scope="col" className="label py-2 text-end font-medium">
              on {g.name.toLowerCase()}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {SWATCHES[theme].map((s) => (
          <tr key={s.v} className="border-b border-hairline">
            <th scope="row" className="py-2.5 pe-2 text-start font-normal">
              <span className="flex items-center gap-3">
                <span
                  className="size-9 shrink-0 rounded-xs border border-hairline"
                  style={{ background: `var(${s.v})` }}
                  aria-hidden="true"
                />
                <span className="leading-tight">
                  <span className="block text-ink">{s.name}</span>
                  <span className="nums block text-ink-muted">
                    {values[s.v]?.toUpperCase() ?? "…"} · {s.role}
                  </span>
                </span>
              </span>
            </th>
            {grounds.map((g) => {
              if (s.ground) return <td key={g.v} className="py-2.5 text-end text-ink-muted">—</td>;
              const r = contrast(values[s.v] ?? "", values[g.v] ?? "");
              const gr = grade(r);
              return (
                <td key={g.v} className="nums py-2.5 text-end">
                  <span className="block text-ink">{r ? `${r.toFixed(2)} : 1` : "…"}</span>
                  <span className={`label block ${gr === "AA" ? "text-success" : "text-ink-muted"}`}>{gr}</span>
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* ------------------------------ II. Letters ------------------------------ */

// Class names written out in full so Tailwind can find them.
const SCALE = [
  ["display", "52 → 84", "Display", "text-display font-display"],
  ["h1", "42 → 62", "Heading one", "text-h1 font-display"],
  ["h2", "34 → 46", "Heading two", "text-h2 font-display"],
  ["h3", "24 → 28", "Heading three", "text-h3 font-heading"],
  ["h4", "22 → 24", "Heading four", "text-h4 font-heading"],
  ["lead", "21 → 24", "Lead paragraph", "text-lead"],
  ["body", "18 → 20", "Body text", "text-body"],
  ["caption", "15 → 16", "Caption and labels", "text-caption"],
] as const;

function LettersPlate() {
  return (
    <>
      <div className="grid gap-6 md:grid-cols-2">
        <FontCard name="IM Fell English" role="Display · H1–H2 · never below 22px" family="font-display">
          <p className="font-display text-h1 leading-tight">All the world’s a stage</p>
          <p className="mt-2 font-display text-h3 italic">and all the men and women merely players</p>
        </FontCard>
        <FontCard name="IM Fell DW Pica" role="H3–H4 · running heads" family="font-heading">
          <p className="font-heading text-h2 leading-tight">The Pilgrim’s Map</p>
          <p className="mt-2 font-heading text-h4 italic">Shall I compare thee to a summer’s day?</p>
        </FontCard>
        <FontCard name="EB Garamond" role="Body · labels · buttons" family="font-body">
          <p className="text-body">
            Body text is set at 18px on phones and 20px on desktop, with a line height of 1.65 and a measure of at
            most 68 characters.
          </p>
          <p className="label mt-3">Small capitals for labels · Lexicon · Station IV</p>
          <p className="mt-3 text-caption">
            <span className="text-ink-muted">Old-style figures in prose:</span> 21 November to 31 December 2026
            <br />
            <span className="text-ink-muted">Lining, tabular figures in stats:</span>{" "}
            <span className="nums">100 · 24 · 14 · 08</span>
          </p>
        </FontCard>
        <FontCard name="UnifrakturMaguntia" role="One word per screen at most" family="font-black">
          <p className="font-black text-display leading-none">Finis</p>
        </FontCard>
        <FontCard name="Amiri" role="Arabic · 20 → 22px · line height 1.85" family="font-arabic" wide>
          <p lang="ar" dir="rtl" className="text-h3 font-bold">
            رحلة علي مع شكسبير
          </p>
          <p lang="ar" dir="rtl" className="mt-2">
            مئة ساعة من الدراسة، من 21 نوفمبر إلى 31 ديسمبر 2026. الإنجليزية أولًا، والعربية جسرٌ للفهم.
          </p>
        </FontCard>
      </div>

      <Sub title="The scale" note="Fluid between a 360px phone and a 1280px desktop (sizes in px).">
        <div className="divide-y divide-hairline border-y border-hairline">
          {SCALE.map(([k, px, name, cls]) => (
            <div key={k} className="grid grid-cols-[6.5rem_1fr] items-baseline gap-4 py-3 sm:grid-cols-[9rem_1fr]">
              <span className="nums text-caption text-ink-muted">
                <span className="block text-ink">text-{k}</span>
                {px}
              </span>
              <span className={`truncate ${cls}`}>{name}</span>
            </div>
          ))}
        </div>
      </Sub>
    </>
  );
}

function FontCard({
  name,
  role,
  family,
  wide,
  children,
}: {
  name: string;
  role: string;
  family: string;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <figure className={`card p-5 sm:p-6 ${wide ? "md:col-span-2" : ""}`}>
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-4 border-b border-hairline pb-2">
        {/* The blackletter card names itself in Pica: one blackletter word per screen. */}
        <span className={`${family === "font-black" ? "font-heading" : family} text-h4`}>{name}</span>
        <span className="label text-ink-muted">{role}</span>
      </figcaption>
      <div className="mt-4">{children}</div>
    </figure>
  );
}

/* ------------------------------ III. Ornaments ------------------------------ */

function OrnamentsPlate() {
  return (
    <>
      <Sub title="Drop cap" note="Opens the first paragraph of a section. The letter stays in the text, so it is read as part of the word.">
        <div className="card measure p-5 sm:p-7">
          <DropCapParagraph>
            When the curtain rises on the twenty-first of November, the road runs one hundred hours to the last
            day of December. Each station on it is a module; each module, once finished, is sealed in wax. This
            paragraph shows how an illuminated initial sits against three lines of body text, and how the text
            wraps around it and continues beneath.
          </DropCapParagraph>
        </div>
      </Sub>

      <Sub title="Head-piece and rules" note="The head-piece opens a major section. On phones it becomes a single fleuron.">
        <HeadPiece />
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          <div>
            <p className="label mb-3 text-ink-muted">Thick–thin</p>
            <OrnamentRule ornament="none" />
          </div>
          <div>
            <p className="label mb-3 text-ink-muted">With fleuron</p>
            <OrnamentRule />
          </div>
          <div>
            <p className="label mb-3 text-ink-muted">Hairline</p>
            <div className="rule-hair mt-3" />
          </div>
        </div>
      </Sub>

      <Sub title="Fleurons">
        <div className="flex flex-wrap items-end gap-10 text-ornament-ink">
          <figure className="text-center">
            <Hedera size={56} />
            <figcaption className="label mt-2 text-ink-muted">Hedera</figcaption>
          </figure>
          <figure className="text-center">
            <Hedera size={56} turned />
            <figcaption className="label mt-2 text-ink-muted">Turned</figcaption>
          </figure>
          <figure className="text-center">
            <Floret size={32} />
            <figcaption className="label mt-2 text-ink-muted">Floret</figcaption>
          </figure>
          <figure className="text-center text-ink">
            <Hedera size={28} />
            <figcaption className="label mt-2 text-ink-muted">In ink</figcaption>
          </figure>
        </div>
      </Sub>

      <Sub title="Rose, seal and shields">
        <div className="flex flex-wrap items-center gap-10">
          <figure className="text-center">
            <TudorRose size={96} />
            <figcaption className="label mt-2 text-ink-muted">Tudor rose</figcaption>
          </figure>
          <figure className="text-center text-ink">
            <TudorRose size={64} variant="mono" />
            <figcaption className="label mt-2 text-ink-muted">Mono</figcaption>
          </figure>
          <figure className="text-center">
            <WaxSeal size={112} numeral="IV" />
            <figcaption className="label mt-1 text-ink-muted">Wax seal · done only</figcaption>
          </figure>
          <div className="flex gap-4 text-ink">
            {(["plain", "bend", "per-pale", "chevron", "empty"] as const).map((d) => (
              <figure key={d} className="text-center">
                <Shield division={d} size={40} />
                <figcaption className="label mt-1 text-ink-muted">{d.replace("-", " ")}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </Sub>
    </>
  );
}

/* ------------------------------ IV. Icons ------------------------------ */

function IconsPlate() {
  return (
    <ul className="grid grid-cols-3 border-s border-t border-hairline sm:grid-cols-5 lg:grid-cols-10">
      {(Object.keys(ICONS) as IconName[]).map((n) => (
        <li key={n} className="flex flex-col items-center gap-2 border-e border-b border-hairline px-2 py-5">
          <Icon name={n} size={28} />
          <span className="label text-ink-muted">{n}</span>
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------ V. Print furniture ------------------------------ */

function FurniturePlate() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
      <article className="card card-lift p-5 sm:p-8">
        <RunningHead left="The Sonnet Chamber" right="Sonnet 18" />
        <p className="label mt-8 text-ornament-ink">Running head ↑ · gloss ↓</p>
        <p className="mt-2 font-display text-h3">
          Shall I compare thee to a summer’s day?
        </p>
        <p className="mt-2 text-lead">
          Thou art more lovely and more <Gloss word="temperate" note="mild, even, not given to extremes (tap the word)." />
        </p>
        <p className="mt-6 text-caption text-ink-muted">
          A glossed word carries a dotted gilt underline. Tap it to open the note; on wide pages the note will sit
          in the margin.
        </p>
        <div className="mt-10">
          <Catchword to="/style-guide#furniture" word="Sonnet" full="Sonnet 29" />
        </div>
        <div className="mt-6">
          <SignatureMark>B2</SignatureMark>
        </div>
      </article>
      <div className="space-y-8">
        <div className="card p-5">
          <p className="label text-ink-muted">Catchword</p>
          <p className="mt-2 text-caption">
            The first word of the next page, set at the foot. Here it is the “next” link, with a pointing hand.
          </p>
        </div>
        <div className="card p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="label text-ink-muted">Session · 22 Nov</p>
              <p className="mt-1 font-heading text-h4">Reading difficult English</p>
            </div>
            <SpecimenStamp />
          </div>
          <p className="mt-3 text-caption text-ink-muted">
            Placeholder content always wears this stamp, so nobody mistakes it for Ali’s own work.
          </p>
        </div>
        <div className="card p-5 text-center">
          <p className="label text-ink-muted">Under a finished module</p>
          <Finis />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ VI. Controls ------------------------------ */

function ControlsPlate() {
  const [sw, setSw] = useState(true);
  const [sw2, setSw2] = useState(false);
  const [seg, setSeg] = useState<"en" | "ar">("en");
  return (
    <>
      <Sub title="Stamp buttons" note="The face presses into its ink shadow. Primary for the one main action on a screen.">
        <div className="flex flex-wrap items-center gap-5">
          <StampButton>Reveal next line</StampButton>
          <StampButton variant="secondary">Show meaning</StampButton>
          <StampButton variant="quiet">Skip</StampButton>
          <StampButton icon="book">With an icon</StampButton>
          <StampButton aria-disabled="true">Disabled</StampButton>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-5">
          <StampLink href="https://claude.ai" external iconEnd="arrow">
            Continue this lesson in Claude
          </StampLink>
          <span className="text-caption text-ink-muted">Opens in a new tab (the Claude app on a phone).</span>
        </div>
        <div className="mt-6 flex flex-wrap gap-3" role="group" aria-label="Review grades">
          {["Again", "Hard", "Good", "Easy"].map((g, i) => (
            <StampButton key={g} variant={i === 2 ? "primary" : "secondary"}>
              {g}
            </StampButton>
          ))}
        </div>
      </Sub>

      <Sub title="Links" note="Prose links keep a plain underline that wraps across lines. Standalone links draw an ink stroke on hover and focus.">
        <p className="measure">
          Inside a sentence, a link looks like <a href="#controls">this ordinary underlined phrase</a>, and it still
          wraps cleanly when it falls at the end of a line.
        </p>
        <p className="mt-4 flex flex-wrap gap-8">
          <a href="#controls" className="ink-link text-lead">
            The Lexicon
          </a>
          <a href="#controls" className="ink-link text-lead">
            The Commonplace Book
          </a>
        </p>
      </Sub>

      <Sub title="Switches, choices, fields">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-2">
            <Switch checked={sw} onChange={setSw} label="Read by candlelight" hint="Dark theme everywhere" />
            <Switch checked={sw2} onChange={setSw2} label="Ink trail" hint="Off by default; desktop only" />
          </div>
          <div>
            <p className="label mb-2 text-ink-muted">Language</p>
            <Segmented
              label="Language"
              value={seg}
              onChange={setSeg}
              options={[
                { value: "en", label: "English" },
                { value: "ar", label: "العربية", lang: "ar" },
              ]}
            />
          </div>
          <TextField label="Find a word" placeholder="e.g. temperate" hint="Searches the Lexicon." />
        </div>
      </Sub>
    </>
  );
}

/* ------------------------------ VII. Surfaces ------------------------------ */

function SurfacesPlate() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div className="card p-5">
        <p className="label text-ink-muted">Card</p>
        <p className="mt-2 text-caption">Aged paper, hairline edge, inner rule.</p>
      </div>
      <div className="card card-lift p-5">
        <p className="label text-ink-muted">Lifted</p>
        <p className="mt-2 text-caption">For pages that turn, cards that flip, seals.</p>
      </div>
      <div className="card card-plain p-5">
        <p className="label text-ink-muted">On the page</p>
        <p className="mt-2 text-caption">Same ground as the page, ruled edge only.</p>
      </div>
      <div data-theme="macbeth" className="card p-5">
        <p className="label text-ink-muted">Soot</p>
        <p className="mt-2 text-caption">A Macbeth surface placed inside a parchment page.</p>
      </div>
    </div>
  );
}

/* ------------------------------ VIII. Measures ------------------------------ */

function MeasuresPlate() {
  return (
    <div className="grid gap-8 md:grid-cols-3">
      <figure className="card flex flex-col items-center p-6">
        <Hourglass done={23} total={100} size={190} />
        <figcaption className="mt-4 text-center">
          <span className="nums block text-h3">23 of 100</span>
          <span className="label text-ink-muted">hours · the Prologue</span>
        </figcaption>
      </figure>
      <figure className="card flex flex-col items-center p-6">
        <LineRing known={9} />
        <figcaption className="mt-4 text-center">
          <span className="label text-ink-muted">Sonnet 18 · one segment per line</span>
          <span className="mt-1 block text-caption text-ink-muted">The couplet is gilded.</span>
        </figcaption>
      </figure>
      <div className="card space-y-8 p-6">
        <HoursBar done={6} total={10} />
        <HoursBar done={0} total={8} />
        <div className="space-y-3 border-t border-hairline pt-6">
          <p className="label text-ink-muted">Station states</p>
          <div className="flex flex-col gap-3">
            <StatusMark status="done" />
            <StatusMark status="current" />
            <StatusMark status="locked" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ IX. Labels ------------------------------ */

function LabelsPlate() {
  return (
    <dl className="grid gap-6 md:grid-cols-2">
      {(Object.keys(COMPARISON_LABELS) as ComparisonLabel[]).map((k) => (
        <div key={k} className="card p-5">
          <dt>
            <LabelBadge label={k} />
          </dt>
          <dd className="mt-3">{COMPARISON_LABELS[k].meaning}</dd>
          <dd className="mt-2 text-caption text-ink-muted" lang="ar" dir="rtl">
            {COMPARISON_LABELS[k].ar}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/* ------------------------------ X–XI. Themes & Arabic ------------------------------ */

function ModuleSpecimen({ lang = "en" }: { lang?: "en" | "ar" }) {
  const ar = lang === "ar";
  return (
    <article className="card card-lift p-5 sm:p-6" lang={lang} dir={ar ? "rtl" : "ltr"}>
      <RunningHead left={ar ? "المحطة M4" : "Station M4"} right={ar ? "رحلة شكسبير" : "The Pilgrim’s Folio"} />
      <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="label text-ornament-ink">{ar ? "من الأسبوع الثالث إلى الخامس" : "Weeks 3 to 5 · provisional"}</p>
          <h3 className="mt-1">{ar ? "ماكبث: دراسة كاملة" : "Macbeth, full study"}</h3>
        </div>
        <StatusMark status="current" lang={lang} />
      </div>
      <div className="mt-5">
        <HoursBar done={6} total={24} lang={lang} />
      </div>
      <p className="mt-5 text-ink-muted">
        {ar
          ? "هنا تظهر الأهداف والمفاهيم والجلسات المكتملة لهذه المحطة."
          : "Objectives, concepts and finished sessions for this station appear here."}{" "}
        <SpecimenStamp lang={lang} />
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-4">
        <StampLink href="https://claude.ai" external iconEnd="arrow">
          {ar ? "أكمل هذا الدرس في Claude" : "Continue this lesson in Claude"}
        </StampLink>
        <a href="#themes" className="ink-link">
          {ar ? "الجلسات" : "Sessions"}
        </a>
      </div>
      <div className="mt-6">
        <LabelBadge label="comparative-interpretation" lang={lang} />
      </div>
    </article>
  );
}

function ThemesPlate() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div data-theme="parchment" className="p-4 sm:p-6">
        <p className="label mb-4 text-ink-muted">Parchment</p>
        <ModuleSpecimen />
      </div>
      <div data-theme="macbeth" className="p-4 sm:p-6">
        <p className="label mb-4 text-ink-muted">Macbeth · Candlelight</p>
        <ModuleSpecimen />
      </div>
    </div>
  );
}

function ArabicPlate() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ModuleSpecimen lang="ar" />
      <div className="card p-5 sm:p-6">
        <h3 className="text-h4">Rules for Arabic</h3>
        <ul className="mt-4 space-y-3">
          {[
            "Layout uses logical sides (start/end), so the whole card mirrors with one dir attribute.",
            "Arrows and the pointing hand turn round; pictures such as the map and skyline do not.",
            "Arabic is never letter-spaced (it breaks the joins) and never takes a drop cap.",
            "Digits stay Western (0–9), as used in Libya.",
            "Each language fragment carries its own lang attribute, so screen readers switch voice.",
          ].map((t) => (
            <li key={t} className="flex gap-3">
              <Hedera size={18} turned className="mt-1.5 shrink-0 text-ornament-ink" />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ------------------------------ XII. Motion ------------------------------ */

const MOTION = [
  ["dur-instant", "100ms", "--ease-out", "Press feedback"],
  ["dur-ui", "200ms", "--ease-out", "Hovers, toggles, fades"],
  ["dur-ui-slow", "320ms", "--ease-out", "Sheets, tabs, ink underline"],
  ["dur-reveal", "600ms", "--ease-ink", "Headings writing, page turns"],
  ["dur-cinematic", "1400ms", "--ease-in-out", "Curtain, hero line, hourglass"],
] as const;

function SignatureDemos() {
  const [ink, setInk] = useState(0);
  const [seal, setSeal] = useState(0);
  const [glass, setGlass] = useState(0);
  const [flip, setFlip] = useState(false);
  return (
    <div className="mt-10 grid gap-6 md:grid-cols-2">
      <div className="card p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="label text-ink-muted">Ink writing</p>
          <StampButton variant="quiet" onClick={() => setInk((n) => n + 1)}>
            Replay
          </StampButton>
        </div>
        <InkWrite key={ink} as="p" text="All the world’s a stage" by="letter" step={42} className="mt-3 font-display text-h2" />
        <InkWrite key={`w${ink}`} as="p" text="رحلة علي مع شكسبير" className="mt-2 text-h3 font-bold" />
        <p className="mt-2 text-caption text-ink-muted">Letters for the hero line; words for headings and always for Arabic (letters must stay joined).</p>
      </div>
      <div className="card flex flex-col p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="label text-ink-muted">Wax-seal stamp</p>
          <StampButton variant="quiet" onClick={() => setSeal((n) => n + 1)}>
            Stamp
          </StampButton>
        </div>
        <div className="flex flex-1 items-center justify-center py-4">
          <StampedSeal sealId="style-guide-demo" size={110} numeral="IV" replay={seal} />
        </div>
        <p className="text-caption text-ink-muted">Plays once, the first time a finished module or work is seen.</p>
      </div>
      <div className="card flex flex-col p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="label text-ink-muted">Hourglass</p>
          <StampButton variant="quiet" onClick={() => setGlass((n) => n + 1)}>
            Pour
          </StampButton>
        </div>
        <div className="flex flex-1 items-center justify-center py-4">
          <Hourglass key={glass} done={37} total={100} size={170} replay={glass || undefined} />
        </div>
        <p className="text-caption text-ink-muted">Fills to the real hours once per visit, when it comes into view.</p>
      </div>
      <div className="flex flex-col">
        <p className="label mb-3 text-ink-muted">Card flip</p>
        <FlipCard
          flipped={flip}
          onFlip={() => setFlip((f) => !f)}
          front={
            <div className="p-5">
              <p className="font-display text-h2">temperate</p>
              <p className="mt-3 font-heading italic">“Thou art more lovely and more temperate.”</p>
            </div>
          }
          back={
            <div className="p-5">
              <p className="label text-ink-muted">Meaning</p>
              <p className="mt-1">mild; moderate, never going to extremes</p>
            </div>
          }
          frontLabel="Show meaning"
          backLabel="Show the word"
        />
      </div>
    </div>
  );
}

function MotionPlate() {
  const reduced = useReducedMotion();
  const [on, setOn] = useState(false);
  return (
    <>
    <div className="card p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="label text-ink-muted">
          {reduced ? "Reduced: movement is replaced by a short fade" : "Full motion"}
        </p>
        <StampButton variant="secondary" onClick={() => setOn((v) => !v)}>
          Play all
        </StampButton>
      </div>
      <div className="mt-6 divide-y divide-hairline">
        {MOTION.map(([token, ms, ease, use]) => (
          <div key={token} className="grid gap-3 py-4 sm:grid-cols-[14rem_1fr] sm:items-center">
            <div className="text-caption">
              <span className="nums block text-ink">
                {token} · {ms}
              </span>
              <span className="text-ink-muted">
                {ease.replace("--", "")} · {use}
              </span>
            </div>
            <div className="relative h-8 border-b border-hairline">
              <span
                className="absolute top-1 start-0 size-6 rounded-full bg-accent"
                style={
                  reduced
                    ? { opacity: on ? 1 : 0.35, transition: "opacity 200ms linear" }
                    : {
                        insetInlineStart: 0,
                        transform: on ? "translateX(calc(var(--track, 0px)))" : "none",
                        transition: `transform ${ms} var(${ease})`,
                      }
                }
                ref={(el) => {
                  if (el?.parentElement) {
                    const w = el.parentElement.clientWidth - el.clientWidth;
                    const rtl = getComputedStyle(el).direction === "rtl";
                    el.style.setProperty("--track", `${rtl ? -w : w}px`);
                  }
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
    <SignatureDemos />
    </>
  );
}
