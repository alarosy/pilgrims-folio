# The Pilgrim's Folio — Phase 1: Plan

*Status: awaiting approval. No code has been written.*

---

## 0. The idea in one paragraph

The site is set out like a printed book from 1606 that you can walk around in. The Prologue is the title page and the curtain. The Map is the road through 100 hours. Every other section is a "room" in the scholar's study. Print conventions from the period are used as working navigation, not just decoration: **catchwords** (the first word of the next page, printed at the foot) become the "what's next" link, **running heads** show where you are, **marginal glosses** hold vocabulary, and **"Finis"** marks the end of a finished module. Every ornament has a job. If one doesn't, it goes.

---

## 1. Sitemap

| Route | Section | What it holds |
|---|---|---|
| `/` | **Prologue** | Curtain (first visit per session) · Globe at dusk · *"All the world's a stage"* written in ink · hourglass (hours / 100) · current module · **Today's step** · **The Reckoning**: the full progress record (all 12 fields) set out like an account-book page |
| `/map` | **The Pilgrim's Map** | Scroll map · 9 stations on the road · 6 week regions · travelling quill · "where the plan expects you today" marker |
| `/modules/:id` (`m0`…`m8`) | **Module pages** | Objectives · concepts · sessions done · hours bar · **Continue this lesson in Claude →** · catchword to the next module |
| `/commonplace` | **The Commonplace Book** | Journal entries as handwritten pages with page turns (`?entry=` deep-links one page) |
| `/lexicon` · `/lexicon/review` | **The Lexicon** | Browse all words (flip cards, filter by module/source) · spaced-repetition review |
| `/sonnets` · `/sonnets/:id` | **The Sonnet Chamber** | `s18 s29 s73 s116 s130 macbeth-5-5` · Read / Recite / Meter views · line ring |
| `/macbeth` (+ `/scenes`, `/characters`, `/threads`, `/thou-you`) | **The Scottish Play** | Macbeth mode · act & scene tracker · character web · theme threads · *thou/you* log |
| `/traditions` | **Two Traditions** | Paired EN/AR comparison cards, each with one of the four required labels |
| `/folio` | **The Final Folio** | Title page of the five final works; the book "binds" as each is finished |
| `/journey` | **The Journey** | Ali's own story (placeholder only) |
| `/style-guide` | Design system | Phase 2 deliverable. Unlisted, `noindex` |
| `*` | 404 | *"Exit, pursued by a bear."* (The Winter's Tale 3.3) with a way home |

**Arabic** lives at the same paths under `/ar/…` (e.g. `/ar/lexicon`). Each language gets its own prerendered HTML, so Arabic pages arrive already in RTL with no flash of English. The language toggle swaps between the two paths and remembers the choice.

**Navigation**
- *Mobile (primary):* a bottom ribbon of 5 items — **Today** (Prologue) · **Map** · **Lexicon** · **Sonnets** · **Contents**. These are the screens Ali will open most between sessions (review and recite are the only in-site practice). **Contents** opens a full-screen "Table of the Contents" in the style of the 1623 Folio's catalogue page.
- *Desktop:* the same Contents as a running head bar, with the current section in small caps.
- *Settings sheet* (gear in the header): language · candlelight (dark) reading · motion (follow system / reduced) · ink trail (off by default) · **Export / Import my data**.

---

## 2. Architecture

| Concern | Choice | Why |
|---|---|---|
| Build | **Vite + React 19 + TypeScript (strict)** | As specified |
| Routing | **React Router 7, framework mode, `ssr: false` + `prerender` every route (EN + AR)** | Every page becomes a static HTML file. First paint doesn't wait for JavaScript (big Lighthouse win on a mid-range phone), and deep links work on GitHub Pages, Netlify and Vercel with no rewrite tricks |
| Styling | **Tailwind CSS v4**, tokens in `@theme`, themes swapped by `[data-theme]` | Tokens become CSS variables, so Macbeth mode is one attribute change, not a re-render. Logical utilities (`ms-`, `pe-`, `start-`) for RTL |
| UI motion | **Motion** (`motion/react`) with `LazyMotion` + `m` | Mount/unmount, page transitions, card flips, seals. Lazy features keep it small |
| Scroll storytelling | **GSAP + ScrollTrigger** via `@gsap/react` `useGSAP` | Map road, parallax, scroll-timed ink. **Loaded only on the routes that use it** (Prologue, Map, Macbeth) |
| Smooth scroll | **Lenis**, desktop only, synced to ScrollTrigger | Touch keeps native scroll (faster, and what phones expect). Off entirely under reduced motion |
| Fonts | **Self-hosted** via `@fontsource/*`, subset (Latin / Arabic), `font-display: swap`, 2 files preloaded, fallback metric overrides | No layout jump when fonts arrive |
| Data | `src/data/program.ts` (all content) + `types.ts`, `derive.ts`, `validate.ts` beside it | Ali edits **one** file. Types, derived numbers and checks live next door |
| Local state | One versioned `localStorage` record, in-memory fallback, Export/Import JSON | No backend |
| Tests | **Vitest** (data rules, SRS scheduler, scansion parser) · **Playwright + axe** (every route × both themes × both directions) · **Lighthouse CI** script | Phase 6 runs these in a loop |

Versions: current stable releases, pinned exactly at install in Phase 2 (Node 24 is already on this machine).

### Folder outline
```
src/
  data/        program.ts ← the only file Ali edits · types.ts · derive.ts · validate.ts
  i18n/        en.ts · ar.ts (UI strings only)
  theme/       tokens.css · fonts.css · print-furniture.css
  components/
    ornament/  DropCap · Fleuron · HeadPiece · Rule · WaxSeal · TudorRose · Shield · Icon
    ui/        StampButton · InkLink · Card · HoursBar · LineRing · Tabs · Toggle · Sheet · Dialog · Badge · Catchword · RunningHead · MarginGloss · SpecimenStamp
    layout/    AppShell · Header · BottomRibbon · ContentsSheet · SettingsSheet · PaperGround · Colophon · SkipLink
  scenes/      Curtain · Skyline · Hourglass · InkWrite · PilgrimMap · Quill · Fog · CandleGlow · PageTurn · FlipCard · FolioBinding · CharacterWeb · ThemeThreads
  routes/      one folder per section (lazy-loaded)
  lib/         storage · srs · scansion · dates · motion (reduced-motion hook) · direction
```

---

## 3. Data model (`program.ts`)

The brief's minimum model, plus the fields the ten sections need. Anything that can be **computed is computed**, so the numbers can never disagree with each other.

```ts
type Status = "locked" | "current" | "done";

interface Config  { claudeProjectUrl: string; startDate: "2026-11-21"; endDate: "2026-12-31" }
interface Week    { id: "W1"…"W6"; start: string; end: string; moduleIds: string[] }   // provisional, see §11
interface Module  { id; title; titleAr?; hours; hoursDone; status: Status; objectives: string[];
                    concepts: string[]; sessions: Session[]; claudeUrl?: string }        // claudeUrl overrides config link
interface Session { id; date; module; hours; title; summary; newWords: Word[]; reflection?; example?: true }
interface Word    { term; meaning; example; arabicNote?; source?; id? }                   // id derived from term+source if absent
interface Poem    { id; title; kind: "sonnet" | "speech"; source: string; lines: string[];
                    scansion?: string[]; memorizedLines: number; recordingUrl?: string }
interface JournalEntry { id; date; title; body; mood?; lang?: "en" | "ar"; example?: true }
interface Comparison { id; label: "historical-influence" | "shared-heritage"
                         | "comparative-interpretation" | "similarity-without-proven-connection";  // REQUIRED
                       en: { title; body }; ar: { title; body }; sources: string[]; example?: true }
interface Record  { textsAnalysed: string[]; conceptsMastered: string[];
                    assessments: { date; title; result; notes? }[];
                    weaknesses: string[]; nextObjective: string }
// + macbeth: { scenes, characters, relations, threads, thouYouLog }
// + finalWorks: 5 × { id; title; status: "not-started" | "in-progress" | "done"; date?; link? }
// + journey: { story: string }   // placeholder for Ali
```

### The 12 progress-record fields

| Field | Source |
|---|---|
| Total hours | **Computed**: sum of module hours (must be exactly 100) |
| Completed hours | **Computed**: sum of `hoursDone` |
| Remaining hours | **Computed** |
| Current module | **Computed**: the module with `status: "current"` |
| Lessons completed | **Computed**: number of sessions |
| Vocabulary acquired | **Computed**: unique words across sessions |
| Sonnets memorized | **Computed**: sonnets where `memorizedLines === lines.length` |
| Texts analysed | `record.textsAnalysed` |
| Linguistic concepts mastered | `record.conceptsMastered` |
| Assessment results | `record.assessments` |
| Identified weaknesses | `record.weaknesses` |
| Next learning objective | `record.nextObjective` (also feeds **Today's step**) |

### Build-time checks (the build **fails**, so the live site is never wrong)
- Exactly 9 modules, M0–M8, with hours 10 / 8 / 14 / 14 / 24 / 10 / 8 / 7 / 5 = **100**
- `0 ≤ hoursDone ≤ hours` · `done` ⇒ `hoursDone === hours` · `locked` ⇒ `hoursDone === 0` · at most one `current`
- Every comparison has one of the four labels
- `memorizedLines ≤ lines.length` · scansion syllable count matches its stress pattern

**Warnings** (build passes): a module's session hours don't add up to its `hoursDone`; placeholder (`example: true`) content still present.

### Placeholders are visible, not just commented
Every seeded session, journal entry and comparison carries `// EXAMPLE — replace` **and** `example: true`. The site prints a small **"Specimen"** stamp on those items, so nobody (including Ali) mistakes a placeholder for his real work.

### What gets seeded
- **Real:** the 9 modules and hours, the 6 week dates, the 5 sonnets and *Macbeth* 5.5 (text checked against the Folger edition), the *Macbeth* act/scene list and character list (from Folger), and plain family/marriage relations for the character web.
- **Placeholder only:** sessions, words, journal entries, comparisons, assessments, weaknesses, the Journey story, final-work dates. No invented facts about Shakespeare, history, Arabic literature or Ali.

**Licence note:** Shakespeare's words are public domain, but the Folger edition's editorial text is licensed CC BY-NC 3.0. That fits a personal, non-commercial study site. The Colophon (footer) will credit the Folger.

---

## 4. Component list

**Layout:** AppShell · Header (title, language, settings) · BottomRibbon (mobile) · ContentsSheet · SettingsSheet · RunningHead · PaperGround (texture + vignette) · Colophon · SkipLink

**Ornament (all original SVG):** DropCap · Fleuron (❦ ❧ drawn, not font glyphs) · HeadPiece (printer's ornament band) · Rule (thick–thin) · WaxSeal · TudorRose · Shield · Icon set (~12: rose, quill, book, scroll, map, hourglass, candle, mask, seal, crown, dagger, compass)

**UI primitives:** StampButton (primary / secondary / quiet) · InkLink · Card (parchment / aged / soot) · HoursBar · LineRing (14 segments) · Tabs · Toggle · Sheet (bottom sheet on mobile) · Dialog · Badge (comparison labels, statuses) · Catchword · MarginGloss · SpecimenStamp · Toast

**Scenes:** Curtain · Skyline (3–4 layers + Globe) · Hourglass · InkWrite · PilgrimMap + Quill · Fog + CandleGlow · PageTurn · FlipCard · FolioBinding · CharacterWeb (+ list view) · ThemeThreads · ActSceneGrid · ThouYouTable

**Section-level:**
- *Prologue:* Hero (skyline + ink line) · HourglassPanel · TodayStep · TheReckoning
- *Module:* ObjectivesList · ConceptsList · SessionLog · ContinueInClaude
- *Lexicon:* WordGrid · Filters · ReviewSession (flip + again/hard/good/easy) · DueCounter
- *Sonnet Chamber:* ManuscriptPage · ReciteMode (hint level: none / first letters / first word) · MeterView (play/pause, tempo, step) · LineRing · PracticeHistory
- *Two Traditions:* LabelLegend · ComparisonCard · LabelFilter
- *Final Folio:* TitlePage · WorkEntry × 5 · Binding

---

## 5. Design tokens

### Colour — contrast checked against WCAG (ratios computed, not guessed)

**Parchment theme**

| Token | Hex | Role | On parchment `#F2E8D5` | On aged paper `#E6D6B8` |
|---|---|---|---|---|
| `paper` | `#F2E8D5` | page ground | — | — |
| `paper-aged` | `#E6D6B8` | cards, raised surfaces | — | — |
| `ink` | `#2A1F17` | body text | **13.2 : 1** | **11.2 : 1** |
| `ink-faded` *(new)* | `#5F554C` | secondary text, locked states | **6.0 : 1** | **5.1 : 1** |
| `oxblood` | `#7A1E1E` | links, primary buttons, focus ring, seals | **8.5 : 1** | **7.2 : 1** |
| `tudor` | `#2F4A3A` | "done" text, secondary accents | **8.0 : 1** | **6.8 : 1** |
| `gilt` | `#B8913A` | **ornament only** | 2.4 : 1 ✗ | 2.1 : 1 ✗ |
| `gilt-ink` *(new)* | `#725419` | gold-toned text (labels, numerals) | **5.8 : 1** | **4.9 : 1** |

**Macbeth / Candlelight theme**

| Token | Hex | Role | On soot `#141012` | On raised soot `#1E1719` |
|---|---|---|---|---|
| `paper` → soot | `#141012` | page ground | — | — |
| `paper-aged` → soot-raised *(new)* | `#1E1719` | cards | — | — |
| `ink` → tallow *(new)* | `#DCCFB8` | body text | **12.3 : 1** | **11.5 : 1** |
| `ink-faded` → fog | `#9A9AA0` | secondary text | **6.7 : 1** | **6.3 : 1** |
| `accent` → candle | `#E9B45A` | links, focus ring, highlights | **10.0 : 1** | **9.4 : 1** |
| `blood` | `#8E1B1B` | **ornament / fills only** | 2.1 : 1 ✗ | 2.0 : 1 ✗ |
| `ember` *(new)* | `#D66A5C` | red text in the dark | **5.5 : 1** | **5.1 : 1** |
| `sage` *(new, Phase 2)* | `#8DB596` | "done" text in the dark (Tudor green fails on soot) | **8.3 : 1** | **7.7 : 1** |

Two brand colours (gilt, blood) fail as text, so each gets a readable partner (`gilt-ink`, `ember`), and the originals are kept for ornaments, seals and fills. Components use **semantic roles** (`surface`, `surface-raised`, `text`, `text-muted`, `accent`, `ornament`, `success`, `danger`), so each theme only remaps roles. Status is never colour alone: done / current / locked always also carry an icon and a word.

**Texture rule:** the paper grain sits at ≤ 6 % opacity and never darkens the ground below `paper-aged`, so the ratios above hold on the textured page.

### Typography

| Role | Face | Size (mobile → desktop) | Notes |
|---|---|---|---|
| Display H1–H2 | IM Fell English (+ italic) | 34 → 62 px | Never below 22 px: the rough Fell edges blur when small |
| H3–H4, running heads | IM Fell DW Pica | 22 → 28 px | |
| Body | EB Garamond | **18 → 20 px**, line-height 1.65, measure ≤ 68 ch | Old-style figures in prose |
| Labels, buttons, nav | EB Garamond, real small caps (`all-small-caps`), +4 % tracking | 15 → 16 px | More legible than Fell at UI sizes |
| Numbers in stats | EB Garamond, `lining-nums tabular-nums` | | Hours line up in columns |
| Blackletter accent | UnifrakturMaguntia | display only | One word per screen at most: *Finis*, the Folio title word, a drop-cap word |
| Arabic | Amiri | **20 → 22 px**, line-height 1.8 | Western digits (`ar-LY-u-nu-latn`), as used in Libya |

Fluid scale with `clamp()`: ratio ≈ 1.25 on phones, ≈ 1.333 on desktop. Steps: −1, 0, 1, 2, 3, 4, display.

### Space, shape, depth, layers
- **Space:** 4 px base — 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96. Side gutter 16 px (phone) / 24 (tablet) / 32+ (desktop).
- **Shape:** print has square corners. Radius 0–2 px everywhere except seals and the ring.
- **Depth:** no modern blurry shadows. Two shadows only: `ink-offset` (hard 1 px, for stamps and buttons) and `page-lift` (soft, for turning pages, flipped cards and seals). In the dark theme, `page-lift` becomes a faint candle glow.
- **Layers:** base · sticky head/ribbon · sheet · curtain · toast.

### Motion tokens

| Token | Value | Use |
|---|---|---|
| `dur-instant` | 100 ms | press feedback |
| `dur-ui` | 200 ms | hovers, toggles, fades |
| `dur-ui-slow` | 320 ms | sheets, tabs, small reveals |
| `dur-reveal` | 600 ms | headings writing, page turns |
| `dur-cinematic` | 1100–1800 ms | curtain, hero line, hourglass fill |
| `ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | all entrances |
| `ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | curtain, page turn |
| `ease-ink` | `cubic-bezier(0.45, 0.05, 0.55, 0.95)` | writing: a pen moves at a near-even speed |
| `spring-stamp` | stiffness 600, damping 22 | seals, button release |

---

## 6. Ornament system and print furniture

- **Drop caps:** a framed square, gilt border with ink strapwork, the letter in Fell English. The frame is decorative (`aria-hidden`); screen readers read the full word.
- **Head-pieces:** printer's ornament bands built from one repeating SVG unit (interlace and acorn) that tiles to any width. On narrow phones they shrink to a single fleuron, so ornament never crowds the text.
- **Fleurons ❦ ❧ and thick–thin rules:** drawn as SVG, so they look the same on every device.
- **Wax seal:** an oxblood disc with an uneven edge, an embossed Tudor rose and the module number. Used only for **done**.
- **Tudor rose and simple shields:** the icon family, in a woodcut line style.
- **Paper ground:** grain (a ~400-byte SVG noise tile), faint laid and chain lines like 17th-century paper, and a soft vignette, all on one fixed layer behind the page. The layer is drawn once and never repainted while scrolling. *(Phase 2 change: this replaces the planned WebP tile: same effect, no image request.)* The dark theme has a soot variant.
- **The London skyline (original SVG):** 3–4 depth layers in the manner of 17th-century panoramas. Far: church towers and Old St Paul's *without* its spire (it was lost to lightning in 1561, so in 1606 it stood spireless). Middle: rooftops and London Bridge with its houses. Near: the Thames, boats, and the first Globe on Bankside (built 1599), polygonal and thatched, with its flag.
- **Print furniture used as navigation:** **running head** (where you are) · **catchword** at the page foot (next module or next journal page) · **signature marks** (A2, B1…) as tiny page labels · **marginal glosses** for words on sonnet pages (in the margin on desktop, a bottom sheet on phones) · **Finis** under a completed module.

---

## 7. Signature animations

Each one: **what it tells Ali** · how it's built · reduced-motion version.

1. **Curtain rise + curtain transitions**
   *Tells:* "you've entered the theatre", and it hides a change of world.
   *Built:* the curtain and a playbill title are plain HTML/CSS in the page shell, so they paint before any JavaScript. The curtain is the loading screen and hides nothing that's ready. When the app is ready, the two velvet panels slide apart (`translateX`, with a slight gather in `scaleX`) over ~1.1 s. A tap or any key opens it at once. It plays **once per session**. Full curtain transitions are used **only** when entering or leaving the Scottish Play (the theme swap happens behind it) and when opening the Final Folio, ~700 ms in total. Every other page change is a 200 ms ink fade (opacity + 8 px rise).
   *Reduced:* the playbill fades out in 200 ms; theme changes cross-fade.

2. **Ink writing**
   *Tells:* "this is the line that matters on this page."
   *Built:* the text stays real text (selectable, translatable, read aloud). A thick stroke that follows the writing direction masks it, and that stroke's `stroke-dashoffset` animates, with a small nib glint riding the path. The hero line gets a hand-drawn mask path (~2 s). Other headings and quotes get a simpler sweep with a ragged ink edge (~600 ms), right-to-left in Arabic. Each plays once, when it scrolls into view.
   *Reduced:* 200 ms fade.

3. **Self-drawing road + travelling quill**
   *Tells:* how far Ali has come, where he is now, and how far is left.
   *Built:* the road is **measured in hours**. Each module owns a stretch of road in proportion to its hours, and its station sits on that stretch. A faint dotted road shows the whole plan. The solid ink road draws itself on scroll (ScrollTrigger scrub) up to the hours completed. The quill follows pre-computed points along the path (`translate` + `rotate`) and comes to rest at the exact hours done. A small marker shows where the even-pace plan expects him today, so ahead or behind is visible at a glance. The map scrolls vertically on every screen (natural with a thumb). The art is not mirrored in Arabic; labels swap sides.
   *Reduced:* road already drawn to today, quill already in place.

4. **Wax-seal stamp**
   *Tells:* "this module is complete."
   *Built:* the seal drops from scale 1.6 to a 0.94 impact, then springs to 1.0 with a small rotation wobble. A separate shadow element scales and fades in underneath (box-shadow itself is never animated), and a faint wax ring spreads once. ~450 ms. It plays **only the first time** Ali sees a newly finished module (remembered locally), so the stamp is news, not a loop.
   *Reduced:* static seal, 150 ms fade.

5. **Hourglass sand**
   *Tells:* hours completed out of 100.
   *Built:* the upper sand shrinks toward the neck and the lower sand grows from the base (`scaleY`, inside the glass shape). A thin falling stream shows **only while it fills** (~1.2 s, the first view each session), then stops, because a stream that never stops would mean nothing. The exact number ("23 of 100 hours") always sits beside it.
   *Reduced:* final level, no stream.

6. **Page turns (Commonplace Book)**
   *Tells:* moving through the book, and which way (older or newer).
   *Built:* the page rotates 180° around the spine (`rotateY`, perspective, hidden back face). A shading layer's opacity peaks mid-turn. ~550 ms. Swipe on touch, arrow buttons, ←/→ keys. In Arabic, the page turns the other way, as in an Arabic book. One page on phones, a two-page spread on desktop. A live region announces "Page 3 of 12".
   *Reduced:* 200 ms cross-fade.

7. **Candle flicker + fog (Macbeth mode)**
   *Tells:* "you've entered the play's world."
   *Built:* fog is 3 large **pre-blurred** WebP layers (blur baked in, ~30 KB in total) drifting with `translateX` at different speeds. It is not canvas particles, which cost far more on a mid-range Android. The candle is a glow layer whose opacity and scale follow an irregular CSS keyframe loop, handled entirely by the compositor. Everything pauses when the tab is hidden, and fog is skipped when the phone asks to save data.
   *Reduced:* still fog, steady glow.

8. **Skyline parallax**
   *Tells:* place and depth (London, 1606). As Ali scrolls the Prologue, the Globe recedes and his progress comes forward.
   *Built:* 3–4 layers at 0.1 / 0.2 / 0.35 scroll rates (`translateY`, ScrollTrigger), active only while the hero is on screen.
   *Reduced:* static.

9. **Card flips (Lexicon)**
   *Tells:* "now check your answer."
   *Built:* `rotateY(180°)`, ~400 ms, ease-out. Tap, Space or Enter flips it. In review mode the again / hard / good / easy buttons appear only after the flip.
   *Reduced:* instant swap with a 150 ms fade.

10. **Micro-interactions**
    - **Stamp buttons:** press = scale 0.96 + 1 px down + shadow fades (100 ms); release springs back.
    - **Ink links:** a hand-drawn underline grows from the start edge (from the right in Arabic) on hover and focus. A thin underline is always shown, so links are recognisable without hovering.
    - **Ink trail cursor:** desktop with a mouse only. ⚠ By the brief's own rule ("remove any animation that is only decoration"), this one tells Ali nothing, so **I propose it ships off by default**, as a toggle in Settings.

**Also in section designs:** the Final Folio's binding (a stitched gathering is added to the spine as each work is finished; the cover closes when all five are done) and the Meter view's pulse (below).

### Motion rules applied
- Transform and opacity only, **with one exception for approval:** `stroke-dashoffset` for the ink writing and the road, which the brief itself asks for. It repaints but does not re-lay out the page, and is used only on those two small SVGs.
- Every animation above names what it tells the user. Looping motion exists only in Macbeth mode, where the atmosphere *is* the information.
- `prefers-reduced-motion` and the Settings switch both lead to the "Reduced" versions above. Lenis is off.

---

## 8. Section mechanics worth deciding now

- **Sonnet Chamber, Recite mode:** lines hidden; "Reveal next line"; Ali marks each line *knew it / missed it*. Hint levels: none · first letter of each word · first word. Practice results stay on the device.
- **LineRing:** 14 separate segments, one per line (couplet segments gilded), so it shows *which* lines he knows, not just how many. **The ring shows the official `memorizedLines` from `program.ts`** (the Claude record). "Last practice: 11 / 14" from the device sits beside it, so the two sources never get confused. For *Macbeth* 5.5 the ring has as many segments as the speech has lines.
- **Meter view:** syllables are authored, not guessed by software (automatic scansion gets Shakespeare wrong often). Format per line: `"Shall I com|pare thee to a sum|mer's day?"` + pattern `"x/x/x/x/x/"`. The build checks that the counts match. Stressed syllables carry the accent colour and a ´ mark, unstressed ones a ˘. The pulse walks da-DUM through the line with play/pause, a tempo control and tap-to-step. I'll author a standard reading for all six texts in Phase 4, marked "a standard reading; scansion is interpretive, so review it with Claude", and note variations (feminine endings, trochaic inversions, *Macbeth*'s short lines).
- **Lexicon review:** an Anki-style SM-2 scheduler. *Again* = see it again this session; *hard* / *good* / *easy* lengthen the gap. Due dates use Ali's local day. State is keyed by word id on the device.
- **Character web:** a hand-placed static layout (no physics library). Tap a character to highlight their relations. A plain **list view** gives the same information for screen readers and small screens.
- **Theme threads:** blood · sleep · darkness · fate run as coloured threads across the five acts, with a knot at each scene where the motif appears (from data). Tap a knot for the quote, the reference and Ali's note.
- **Thou/you log:** a table (reference · speaker → addressee · form · note) with filters by pair and a count per pair. The data lives in `program.ts`, because it is research content.
- **Two Traditions:** each card shows its label as a heraldic badge, with a legend at the top that explains what each label means. There is a label filter. Columns follow the UI language (the UI language's column comes first); each half carries its own `lang` and `dir`. On phones each card stacks EN over AR.
- **Continue in Claude:** uses `config.claudeProjectUrl`, or the module's `claudeUrl` if set. It opens in a new tab (on a phone, the Claude app if installed) and the button says so.
- **Today's step:** "Day N of 41 · Week N" + current module + `record.nextObjective` + Continue in Claude. Date-dependent text is computed on the device after load, so prerendered pages never show a stale date.

---

## 9. Bilingual and RTL

- `/ar/…` routes prerendered with `<html lang="ar" dir="rtl">`. Every mixed-language fragment carries its own `lang` (and `dir` where needed), so screen readers pronounce each language correctly.
- Layout uses logical properties only (no `left`/`right` in the code). Directional motion (ink sweep, link underline, page turn, catchword arrow) flips in RTL. Pictures (map, skyline) do not flip.
- **UI strings** are translated in `ar.ts` and **marked for Ali's review**. He is the native speaker; I am not the final word on Arabic. **Content** stays in English, with optional `titleAr` and similar fields.
- Proposed Arabic section names (Ali to approve or change):

| English | Proposed Arabic | Note |
|---|---|---|
| Prologue | الاستهلال | |
| The Pilgrim's Map | خريطة الرحلة | I avoided حاجّ: in Arabic "pilgrim" points straight to the Hajj. Ali may prefer something else, e.g. خريطة السالك |
| Module / Station | المحطة | |
| The Commonplace Book | دفتر المختارات | Ali may know a better traditional term |
| The Lexicon | المعجم | |
| The Sonnet Chamber | حجرة السوناتات | |
| The Scottish Play | المسرحية الاسكتلندية | |
| Two Traditions | بين تراثين | |
| The Final Folio | المجلّد الأخير | |
| The Journey | حكاية الرحلة | |
| Continue this lesson in Claude → | أكمل هذا الدرس في Claude ← | The arrow flips in RTL |

---

## 10. Accessibility, performance, saved data

**Accessibility (WCAG AA):** landmarks and a skip link · one H1 per page, ordered headings · focus ring 2 px `oxblood` (dark: `candle`) with a 2 px paper offset · touch targets ≥ 44 px · every custom widget is built from real buttons, tabs and lists with ARIA states (flip card, recite, page turn, tabs with roving focus, map stations as an ordered list of links behind the decorative SVG) · ornaments `aria-hidden` · status shown by icon + word, never colour alone. axe runs on every route × both themes × both directions.

**Performance budget (Lighthouse mobile ≥ 90):**
- Prerendered HTML: the curtain, playbill and hero text paint from HTML alone.
- JS on first load ≲ 110 KB gzipped. GSAP, ScrollTrigger and fog load only on the routes that use them. Every section is a lazy chunk.
- Fonts: Latin and Arabic subsets, 2 preloads, `swap`, metric-matched fallbacks (target CLS < 0.05). Fell files are large (scanned outlines), so they are measured in Phase 2 and only the regular weights load up front.
- Raster images: only the noise tile and fog layers (WebP).
- Targets: LCP ≤ 2.0 s, TBT < 150 ms, CLS < 0.05.

**Saved data (`localStorage`, key `pilgrims-folio:v1`):** settings · review schedule per word · recite history · seals already seen. Reads and writes are wrapped so the site still works when storage is blocked. **Export** downloads `pilgrims-folio-backup-YYYY-MM-DD.json`. **Import** checks the file, shows what it contains (e.g. "212 words, 9 practice runs") and asks before replacing, with one-step undo. Phone and laptop keep separate histories; Export/Import is how to move one to the other.

**Update workflow (written up in full in Phase 7):**
1. At the end of a session, Ali asks Claude for "the site update".
2. Claude replies with a snippet in a fixed format: the new `Session` (with words), any module `hoursDone`/`status` change, and the updated `record`.
3. Ali pastes it at the marked slots in `program.ts` (`// ↓ NEW SESSIONS GO HERE`). GitHub's web editor works on a phone. He commits.
4. The host rebuilds. If the snippet breaks a rule, the build stops with a plain-English message naming the line, and the previous site stays live.

I'll also write a short **instruction block for his Claude Project**, so Claude always produces snippets in exactly this format. **Hosting:** GitHub Pages via Actions is the default (Ali needs GitHub for commits anyway, so it's one account fewer), with Vercel and Netlify configs included too.

---

## 11. Open questions

1. **Week plan.** The brief doesn't say which modules fall in which week. Until I have the Claude Project's schedule, I'll use this **provisional** even-pace split (100 h ÷ 41 days ≈ 2.4 h/day, modules in order):

   | Week | Dates | Planned hours | Modules |
   |---|---|---|---|
   | W1 | 21–27 Nov | 0 → 17 | M0 · M1 begins |
   | W2 | 28 Nov–4 Dec | 17 → 34 | M1 ends · M2 · M3 begins |
   | W3 | 5–11 Dec | 34 → 51 | M3 ends · M4 begins |
   | W4 | 12–18 Dec | 51 → 68 | M4 |
   | W5 | 19–25 Dec | 68 → 85 | M4 ends · M5 · M6 begins |
   | W6 | 26–31 Dec | 85 → 100 | M6 ends · M7 · M8 |

2. **Claude link.** One Claude Project URL for every "Continue" button, or a separate chat per module? (Placeholder until given.)
3. ***Macbeth* 5.5 extent.** The full speech from "She should have died hereafter" (12 lines, my default), or "Tomorrow, and tomorrow…" to "Signifying nothing" (10 lines)?
4. **Two motion calls.** Allow `stroke-dashoffset` for the ink writing and the road, and ship the ink trail **off** by default?
5. **Arabic names** in §9, especially the Map.

---

## 12. Self-check: "a 1600s folio brought to life, and still effortless?"

| Risk | Mitigation in this plan |
|---|---|
| Curtain fatigue | Once per session; full transitions only for Macbeth and the Folio; always skippable |
| Fell type is rough and hard to read small | Fell ≥ 22 px only; EB Garamond carries all reading and UI |
| "Old style" turning into a sepia filter | Real print conventions (catchwords, running heads, glosses, signatures) that also do navigation work |
| Ornament crowding a phone screen | Head-pieces collapse to a fleuron; drop caps shrink; bottom ribbon keeps the five key screens one tap away |
| Texture eating contrast | Texture capped; every ratio checked against the darkest ground |
| Animation without meaning | Every animation names what it tells Ali; the ink trail is off by default |
| Two sources of truth drifting | Numbers are computed; the build refuses impossible data; device practice is labelled separately from the Claude record |

---

## 13. Next: Phase 2 deliverable

The real project scaffold (so nothing is thrown away), with one **`/style-guide`** page showing: colour tokens with live contrast ratios · the type scale in English and Arabic · the full ornament set · stamp buttons and ink links in every state · parchment, aged and soot cards · the hourglass, ring and hours bar at rest · the three station states (seal / candle / faded) · focus states · both themes side by side · an RTL sample · a reduced-motion switch to preview the fallbacks.
