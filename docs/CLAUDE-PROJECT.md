# Instructions for your Claude Project

Your Claude Project is where you study. The website only shows your progress.
These instructions teach Claude how to write the update for the website, so
that after each session you get a reply you can paste straight into
`src/data/program.ts`.

## How to add them (once)

1. Open your Shakespeare project on claude.ai.
2. Find the project's **Instructions** box (on the project page, next to the project's files).
3. Copy everything inside the grey box below and paste it at the end of your instructions. Save.

From then on, at the end of a session, write **site update** and Claude replies in the format below.

---

```text
## Updating Ali's website: The Pilgrim's Folio

Ali keeps a website that mirrors this course. All its content lives in one
file, src/data/program.ts. When Ali writes "site update", reply with:
(a) one code block in exactly the format below, holding only the parts that
changed since the last update, and then
(b) a short numbered list of where each part goes.

RULES
- Report only what really happened in our sessions. Never invent Ali's
  thoughts, quotes, reflections, results, journal entries or life story.
  If Ali wrote a reflection, copy his words exactly; otherwise leave
  "reflection" out.
- Dates are written "YYYY-MM-DD". Hours are numbers (2, 1.5).
- Modules and their hours: m0 10 · m1 8 · m2 14 · m3 14 · m4 24 · m5 10 ·
  m6 8 · m7 7 · m8 5. Ids are lower case.
- Status is "locked", "current" or "done". Exactly one module is "current".
  A module is "done" only when its hoursDone equals its hours.
- A session belongs to one module. If a session moved into the next module,
  write two sessions and split the hours between them.
- Session id: module and date, e.g. "m0-2026-11-22". A second session on the
  same day ends in "-2".
- Every quotation from Shakespeare follows the Folger Shakespeare text exactly.
- Word "source": "Sonnet 18, line 2" for a sonnet, "Macbeth 1.5.42"
  (act.scene.line, Folger numbering) for a play. Word "line": the exact line
  the word comes from. Never change the term or source of a word that is
  already on the site: its review history is filed under them.
- Write text in straight double quotes "like this". Inside the text, use
  curly marks for apostrophes and quotations (’ “ ”) so nothing breaks.
- Ali writes the Commonplace Book (journal) and The Journey himself. Do not
  draft them.

FORMAT (one code block; keep the numbered comment lines; leave out any part
that did not change)

// 1 · NEW SESSION: paste under  // ↓ NEW SESSIONS GO HERE  in module m0
{
  id: "m0-2026-11-22",
  date: "2026-11-22",
  module: "m0",
  hours: 2,
  title: "A short title for the session",
  summary: "Two or three sentences on what we studied.",
  newWords: [
    { term: "temperate", meaning: "mild; moderate", example: "A temperate climate is neither very hot nor very cold.", arabicNote: "معتدل", source: "Sonnet 18, line 2", line: "Thou art more lovely and more temperate." },
  ],
  reflection: "Ali’s own words, only if he gave them",
},

// 2 · MODULES: find  id: "m0"  and change these values
// m0 → hoursDone: 4   (status stays "current")
// (When a module is finished: its status "done", hoursDone equal to its
//  hours, and the next module's status "current".)

// 3 · PROGRESS RECORD: replace the whole  record: { … },  block with this
record: {
  textsAnalysed: ["Sonnet 18"],
  conceptsMastered: ["iambic pentameter"],
  assessments: [{ date: "2026-11-22", title: "Sonnet 18 quiz", result: "8/10", notes: "Optional note" }],
  weaknesses: ["Inverted word order"],
  nextObjective: "Read Sonnet 29 aloud with the stresses marked",
},

// 4 · MEMORIZATION: find the poem and change memorizedLines (after a check only)
// s18 → memorizedLines: 6
// (ids: s18, s29, s73, s116, s130, macbeth-5-5)

// 5 · MACBETH: scene status is "unread", "read" or "studied"
// 1.5 → status: "studied"   (find  act: 1, scene: 5)
// New thou/you lines: paste inside  thouYouLog: [ … ]
{ ref: "1.5.42", speaker: "lady-macbeth", addressee: "macbeth", form: "thou", quote: "The exact line", note: "What the choice shows" },
// Cast ids: macbeth, lady-macbeth, witches, hecate, duncan, malcolm,
// donalbain, banquo, fleance, macduff, lady-macduff, macduff-son, ross,
// lennox, siward, young-siward

// 6 · FINAL FOLIO: status is "not-started", "in-progress" or "done"
// sonnet-analysis → status: "in-progress"
// (ids: linguistic-analysis, sonnet-analysis, oral-presentation,
//  memorized-performance, research-paper; add link: "…" when a work is online)

// 7 · TWO TRADITIONS (only if a session compared English and Arabic
// literature): paste inside  comparisons: [ … ]
// label is exactly one of: "historical-influence" (a documented link, with
// sources), "shared-heritage", "comparative-interpretation",
// "similarity-without-proven-connection" (say plainly that no link is proven).
// Never claim an influence without sources.
{ id: "a-short-id", label: "comparative-interpretation", en: { title: "…", body: "…" }, ar: { title: "…", body: "…" }, sources: ["…"] },

// 8 · DATE: in  config  near the top
// updated: "2026-11-22"

If the website's build reports an error and Ali pastes it here, explain in one
sentence what is wrong and give the corrected lines.
```

---

## What Claude's reply looks like

After the code block, Claude adds a list like this one:

1. Paste part 1 in `program.ts` under `// ↓ NEW SESSIONS GO HERE` in module m0.
2. In module m0, change `hoursDone: 2` to `hoursDone: 4`.
3. Replace the whole `record: { … },` block with part 3.
4. Change `updated:` near the top to `"2026-11-22"`.

The [README](../README.md#after-each-session) explains how to paste it on GitHub, from a phone or a laptop.
