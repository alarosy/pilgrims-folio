/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  THE PILGRIM'S FOLIO — program.ts                                ║
 * ║  The only file Ali edits. Everything on the site comes from here. ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * After each session, Claude gives a snippet to paste here (step by step:
 * README.md → "After each session"; Claude's format: docs/CLAUDE-PROJECT.md). The site checks
 * this file when it is built: if something is impossible (for example more
 * hours done than a module has), the build stops with a plain message and the
 * previous version of the site stays online.
 *
 * Anything marked  // EXAMPLE — replace  and  placeholder: true  is not real.
 * The site shows it with a "Specimen" stamp and leaves it out of every count.
 * Delete it (or replace it with real content) when the real thing exists.
 */
import type { Program } from "./types";

export const program: Program = {
  // ─────────────────────────────── SETTINGS ───────────────────────────────
  config: {
    // TODO: replace with the link to Ali's Claude Project.
    claudeProjectUrl: "https://claude.ai/projects",
    startDate: "2026-11-21",
    endDate: "2026-12-31",
    updated: "2026-11-20",
  },

  // ─────────────────────────────── WEEKS ──────────────────────────────────
  // PROVISIONAL: modules spread at an even pace (100 hours ÷ 41 days).
  // Replace moduleIds with the week plan from the Claude Project syllabus.
  weeks: [
    { id: "W1", start: "2026-11-21", end: "2026-11-27", moduleIds: ["m0", "m1"] },
    { id: "W2", start: "2026-11-28", end: "2026-12-04", moduleIds: ["m1", "m2", "m3"] },
    { id: "W3", start: "2026-12-05", end: "2026-12-11", moduleIds: ["m3", "m4"] },
    { id: "W4", start: "2026-12-12", end: "2026-12-18", moduleIds: ["m4"] },
    { id: "W5", start: "2026-12-19", end: "2026-12-25", moduleIds: ["m4", "m5", "m6"] },
    { id: "W6", start: "2026-12-26", end: "2026-12-31", moduleIds: ["m6", "m7", "m8"] },
  ],

  // ─────────────────────────────── MODULES ────────────────────────────────
  // Exactly 100 hours. status: "locked" | "current" | "done"
  // objectives / concepts: copy them from the Claude Project syllabus.
  // Arabic titles are drafts for Ali to check.
  modules: [
    {
      id: "m0",
      title: "Foundations: how to read difficult English",
      titleAr: "الأسس: كيف تقرأ الإنجليزية الصعبة",
      hours: 10,
      hoursDone: 0,
      status: "current",
      objectives: [],
      concepts: [],
      sessions: [
        // ↓ NEW SESSIONS GO HERE
        // EXAMPLE — replace
        {
          placeholder: true,
          id: "example-session-1",
          date: "2026-11-21",
          module: "m0",
          hours: 2,
          title: "Example session: reading one hard sentence slowly",
          summary: "EXAMPLE — replace with the summary Claude writes at the end of a real session.",
          newWords: [
            {
              placeholder: true,
              term: "temperate",
              meaning: "mild; moderate, never going to extremes",
              example: "A temperate climate is neither very hot nor very cold.",
              arabicNote: "معتدل",
              source: "Sonnet 18, line 2",
              line: "Thou art more lovely and more temperate.",
            },
            {
              placeholder: true,
              term: "wherefore",
              meaning: "why (not “where”)",
              example: "Wherefore did you leave so early?",
              arabicNote: "لماذا، وليست «أين»",
              source: "Romeo and Juliet, 2.2",
              line: "O Romeo, Romeo, wherefore art thou Romeo?",
            },
          ],
          reflection: "EXAMPLE — Ali's own reflection goes here.",
        },
      ],
    },
    {
      id: "m1",
      title: "Shakespeare’s world",
      titleAr: "عالم شكسبير",
      hours: 8,
      hoursDone: 0,
      status: "locked",
      objectives: [],
      concepts: [],
      sessions: [
        // ↓ NEW SESSIONS GO HERE
      ],
    },
    {
      id: "m2",
      title: "Shakespeare’s language (linguistics)",
      titleAr: "لغة شكسبير (دراسة لسانية)",
      hours: 14,
      hoursDone: 0,
      status: "locked",
      objectives: [],
      concepts: [],
      sessions: [
        // ↓ NEW SESSIONS GO HERE
      ],
    },
    {
      id: "m3",
      title: "The Sonnets",
      titleAr: "السوناتات",
      hours: 14,
      hoursDone: 0,
      status: "locked",
      objectives: [],
      concepts: [],
      sessions: [
        // ↓ NEW SESSIONS GO HERE
      ],
    },
    {
      id: "m4",
      title: "Macbeth, full study",
      titleAr: "ماكبث: دراسة كاملة",
      hours: 24,
      hoursDone: 0,
      status: "locked",
      objectives: [],
      concepts: [],
      sessions: [
        // ↓ NEW SESSIONS GO HERE
      ],
    },
    {
      id: "m5",
      title: "Key scenes: Romeo and Juliet, Julius Caesar, Hamlet",
      titleAr: "مشاهد مختارة: روميو وجولييت، يوليوس قيصر، هاملت",
      hours: 10,
      hoursDone: 0,
      status: "locked",
      objectives: [],
      concepts: [],
      sessions: [
        // ↓ NEW SESSIONS GO HERE
      ],
    },
    {
      id: "m6",
      title: "Memorization and performance",
      titleAr: "الحفظ والأداء",
      hours: 8,
      hoursDone: 0,
      status: "locked",
      objectives: [],
      concepts: [],
      sessions: [
        // ↓ NEW SESSIONS GO HERE
      ],
    },
    {
      id: "m7",
      title: "Research skills and mini paper",
      titleAr: "مهارات البحث وورقة بحثية قصيرة",
      hours: 7,
      hoursDone: 0,
      status: "locked",
      objectives: [],
      concepts: [],
      sessions: [
        // ↓ NEW SESSIONS GO HERE
      ],
    },
    {
      id: "m8",
      title: "Final assessment",
      titleAr: "التقييم النهائي",
      hours: 5,
      hoursDone: 0,
      status: "locked",
      objectives: [],
      concepts: [],
      sessions: [
        // ↓ NEW SESSIONS GO HERE
      ],
    },
  ],

  // (The texts to memorize, with their memorizedLines, are at the end of this file.)

  // ─────────────────────────────── THE COMMONPLACE BOOK ───────────────────
  journal: [
    // ↓ NEW JOURNAL ENTRIES GO HERE
    // EXAMPLE — replace
    {
      placeholder: true,
      id: "example-entry-1",
      date: "2026-11-21",
      title: "Example page",
      body: "EXAMPLE — replace. This is where Ali writes his own thoughts after a session: a line that stayed with him, a question, a word he wants to keep.",
    },
  ],

  // ─────────────────────────────── TWO TRADITIONS ─────────────────────────
  // Every card needs exactly one label (the build checks):
  // "historical-influence" | "shared-heritage" |
  // "comparative-interpretation" | "similarity-without-proven-connection"
  comparisons: [
    // EXAMPLE — replace (one per label, to show the layout; no claims are made)
    {
      placeholder: true,
      id: "example-historical",
      label: "historical-influence",
      en: { title: "Example card", body: "EXAMPLE — replace with a documented link and its sources." },
      ar: { title: "بطاقة مثال", body: "مثال — استبدل هذا بصلة موثّقة ومصادرها." },
      sources: [],
    },
    {
      placeholder: true,
      id: "example-shared",
      label: "shared-heritage",
      en: { title: "Example card", body: "EXAMPLE — replace with a source both traditions grew from." },
      ar: { title: "بطاقة مثال", body: "مثال — استبدل هذا بمصدر نشأ منه التراثان." },
      sources: [],
    },
    {
      placeholder: true,
      id: "example-comparative",
      label: "comparative-interpretation",
      en: { title: "Example card", body: "EXAMPLE — replace with a reading that sets the two side by side." },
      ar: { title: "بطاقة مثال", body: "مثال — استبدل هذا بقراءة تضع النصّين جنبًا إلى جنب." },
      sources: [],
    },
    {
      placeholder: true,
      id: "example-similarity",
      label: "similarity-without-proven-connection",
      en: { title: "Example card", body: "EXAMPLE — replace with a resemblance, and say plainly that no link is proven." },
      ar: { title: "بطاقة مثال", body: "مثال — استبدل هذا بتشابه، مع التصريح بأنه لا صلة مثبتة." },
      sources: [],
    },
  ],

  // ─────────────────────────────── THE PROGRESS RECORD ────────────────────
  // The parts of the Claude record that the site cannot work out by itself.
  // (Hours, current module, lessons, words and sonnets are counted automatically.)
  record: {
    textsAnalysed: [],
    conceptsMastered: [],
    assessments: [],
    weaknesses: [],
    nextObjective: "",
  },

  // ─────────────────────────────── THE FINAL FOLIO ────────────────────────
  finalWorks: [
    { id: "linguistic-analysis", title: "Linguistic analysis", titleAr: "تحليل لساني", status: "not-started" },
    { id: "sonnet-analysis", title: "Sonnet analysis", titleAr: "تحليل سوناتة", status: "not-started" },
    { id: "oral-presentation", title: "Oral presentation", titleAr: "عرض شفهي", status: "not-started" },
    { id: "memorized-performance", title: "Memorized performance", titleAr: "أداء من الحفظ", status: "not-started" },
    { id: "research-paper", title: "Mini research paper", titleAr: "ورقة بحثية قصيرة", status: "not-started" },
  ],

  // ─────────────────────────────── THE JOURNEY ────────────────────────────
  // Ali's own words. Left empty on purpose: nobody else should write this.
  // Separate paragraphs with a blank line ("\n\n").
  journey: { story: "" },

  // ─────────────────────────────── THE SCOTTISH PLAY ──────────────────────
  // Act and scene structure and the cast follow the Folger edition.
  // scene status: "unread" | "read" | "studied"  (update as you go)
  macbeth: {
    scenes: [
      { act: 1, scene: 1, note: "The three Witches agree to meet Macbeth.", status: "unread" },
      { act: 1, scene: 2, note: "A wounded Captain reports Macbeth’s courage in battle; Duncan makes him Thane of Cawdor.", status: "unread" },
      { act: 1, scene: 3, note: "The Witches greet Macbeth and Banquo with prophecies.", status: "unread" },
      { act: 1, scene: 4, note: "Duncan names Malcolm Prince of Cumberland.", status: "unread" },
      { act: 1, scene: 5, note: "Lady Macbeth reads her husband’s letter.", status: "unread" },
      { act: 1, scene: 6, note: "Duncan arrives at the Macbeths’ castle.", status: "unread" },
      { act: 1, scene: 7, note: "Macbeth hesitates; Lady Macbeth persuades him.", status: "unread" },
      { act: 2, scene: 1, note: "Banquo and Fleance at night; Macbeth sees a dagger.", status: "unread" },
      { act: 2, scene: 2, note: "After Duncan’s murder, Macbeth and Lady Macbeth.", status: "unread" },
      { act: 2, scene: 3, note: "The Porter; Macduff discovers the murder.", status: "unread" },
      { act: 2, scene: 4, note: "Ross and an Old Man speak of strange omens.", status: "unread" },
      { act: 3, scene: 1, note: "Macbeth, now king, plans Banquo’s murder.", status: "unread" },
      { act: 3, scene: 2, note: "Macbeth and Lady Macbeth before the night’s deed.", status: "unread" },
      { act: 3, scene: 3, note: "Banquo is murdered; Fleance escapes.", status: "unread" },
      { act: 3, scene: 4, note: "The banquet; Banquo’s ghost.", status: "unread" },
      { act: 3, scene: 5, note: "Hecate and the Witches.", status: "unread" },
      { act: 3, scene: 6, note: "Lennox and a Lord speak of Macduff’s flight to England.", status: "unread" },
      { act: 4, scene: 1, note: "The Witches show Macbeth the apparitions.", status: "unread" },
      { act: 4, scene: 2, note: "Lady Macduff and her son are murdered.", status: "unread" },
      { act: 4, scene: 3, note: "In England, Malcolm tests Macduff; Macduff learns of his family’s deaths.", status: "unread" },
      { act: 5, scene: 1, note: "Lady Macbeth walks in her sleep.", status: "unread" },
      { act: 5, scene: 2, note: "Scottish lords march to join the English forces.", status: "unread" },
      { act: 5, scene: 3, note: "Macbeth prepares for battle.", status: "unread" },
      { act: 5, scene: 4, note: "Malcolm’s soldiers cut boughs from Birnam Wood.", status: "unread" },
      { act: 5, scene: 5, note: "Lady Macbeth’s death; “Tomorrow and tomorrow and tomorrow.”", status: "unread" },
      { act: 5, scene: 6, note: "Malcolm’s army reaches Dunsinane.", status: "unread" },
      { act: 5, scene: 7, note: "Macbeth kills Young Siward.", status: "unread" },
      { act: 5, scene: 8, note: "Macduff and Macbeth fight; Malcolm is hailed king.", status: "unread" },
    ],
    // From Folger’s “Characters in the Play” (the main speaking parts).
    characters: [
      { id: "macbeth", name: "Macbeth", description: "thane of Glamis", group: "macbeths" },
      { id: "lady-macbeth", name: "Lady Macbeth", group: "macbeths" },
      { id: "witches", name: "Three Witches", description: "the Weïrd Sisters", group: "witches" },
      { id: "hecate", name: "Hecate", group: "witches" },
      { id: "duncan", name: "Duncan", description: "king of Scotland", group: "court" },
      { id: "malcolm", name: "Malcolm", description: "his elder son", group: "court" },
      { id: "donalbain", name: "Donalbain", description: "Duncan’s younger son", group: "court" },
      { id: "banquo", name: "Banquo", description: "commander, with Macbeth, of Duncan’s army", group: "banquo" },
      { id: "fleance", name: "Fleance", description: "his son", group: "banquo" },
      { id: "macduff", name: "Macduff", description: "a Scottish noble", group: "macduffs" },
      { id: "lady-macduff", name: "Lady Macduff", group: "macduffs" },
      { id: "macduff-son", name: "Their son", group: "macduffs" },
      { id: "ross", name: "Ross", description: "a Scottish noble", group: "nobles" },
      { id: "lennox", name: "Lennox", description: "a Scottish noble", group: "nobles" },
      { id: "siward", name: "Siward", description: "commander of the English forces", group: "english" },
      { id: "young-siward", name: "Young Siward", description: "Siward’s son", group: "english" },
    ],
    // Read each relation as "from … kind … to".
    relations: [
      { from: "macbeth", to: "lady-macbeth", kind: "is married to" },
      { from: "duncan", to: "malcolm", kind: "is the father of" },
      { from: "duncan", to: "donalbain", kind: "is the father of" },
      { from: "banquo", to: "fleance", kind: "is the father of" },
      { from: "macduff", to: "lady-macduff", kind: "is married to" },
      { from: "macduff", to: "macduff-son", kind: "is the father of" },
      { from: "siward", to: "young-siward", kind: "is the father of" },
      { from: "witches", to: "macbeth", kind: "prophesy to", act: 1 },
      { from: "witches", to: "banquo", kind: "prophesy to", act: 1 },
      { from: "lady-macbeth", to: "macbeth", kind: "persuades", act: 1 },
      { from: "macbeth", to: "duncan", kind: "murders", act: 2 },
      { from: "macbeth", to: "banquo", kind: "has murdered", act: 3 },
      { from: "macbeth", to: "lady-macduff", kind: "has murdered", act: 4 },
      { from: "macbeth", to: "macduff-son", kind: "has murdered", act: 4 },
      { from: "macduff", to: "malcolm", kind: "joins in England", act: 4 },
      { from: "siward", to: "malcolm", kind: "leads English forces for", act: 5 },
      { from: "macbeth", to: "young-siward", kind: "kills", act: 5 },
      { from: "macduff", to: "macbeth", kind: "kills", act: 5 },
      { from: "hecate", to: "witches", kind: "commands", act: 3 },
    ],
    // Ali adds his own references as he reads. One example each (verified
    // against the Folger text) shows the layout.
    threads: [
      {
        theme: "blood",
        refs: [{ placeholder: true, ref: "2.2", quote: "Will all great Neptune’s ocean wash this blood / Clean from my hand?" }],
      },
      { theme: "sleep", refs: [{ placeholder: true, ref: "2.2", quote: "Macbeth does murder sleep" }] },
      {
        theme: "darkness",
        refs: [{ placeholder: true, ref: "1.4", quote: "Stars, hide your fires; / Let not light see my black and deep desires." }],
      },
      { theme: "fate", refs: [{ placeholder: true, ref: "1.3", quote: "If chance will have me king, why, chance may crown me" }] },
    ],
    // ↓ For the research paper: who says "thou" or "you" to whom, and where.
    // { ref: "1.5", speaker: "lady-macbeth", addressee: "macbeth", form: "thou", quote: "…", note: "…" },
    thouYouLog: [],
  },

  // ─────────────────────────────── TEXTS TO MEMORIZE ──────────────────────
  // The words follow the Folger Shakespeare edition exactly (checked 20 Nov 2026).
  // ✎ memorizedLines mirrors the Claude record: update it after each check.
  // meter: a standard reading for the Meter view (scansion is interpretive).
  poems: [
    {
      id: "s18",
      title: "Sonnet 18",
      kind: "sonnet",
      source: "Folger Shakespeare · Sonnet 18",
      memorizedLines: 0,
      lines: [
        "Shall I compare thee to a summer’s day?",
        "Thou art more lovely and more temperate.",
        "Rough winds do shake the darling buds of May,",
        "And summer’s lease hath all too short a date.",
        "Sometime too hot the eye of heaven shines,",
        "And often is his gold complexion dimmed;",
        "And every fair from fair sometime declines,",
        "By chance or nature’s changing course untrimmed.",
        "But thy eternal summer shall not fade",
        "Nor lose possession of that fair thou ow’st,",
        "Nor shall Death brag thou wand’rest in his shade,",
        "When in eternal lines to time thou grow’st.",
        "So long as men can breathe or eyes can see,",
        "So long lives this, and this gives life to thee.",
      ],
      meter: [
        ["Shall I com|pare thee to a sum|mer’s day?", "x/x/x/x/x/"],
        ["Thou art more love|ly and more tem|per|ate.", "x/x/x/x/x/"],
        ["Rough winds do shake the dar|ling buds of May,", "x/x/x/x/x/"],
        ["And sum|mer’s lease hath all too short a date.", "x/x/x/x/x/"],
        ["Some|time too hot the eye of heav|en shines,", "/xx/x/x/x/"],
        ["And of|ten is his gold com|plex|ion dimmed;", "x/x/x/x/x/"],
        ["And ev|ery fair from fair some|time de|clines,", "x/x/x/x/x/"],
        ["By chance or na|ture’s chang|ing course un|trimmed.", "x/x/x/x/x/"],
        ["But thy e|ter|nal sum|mer shall not fade", "x/x/x/x/x/"],
        ["Nor lose pos|ses|sion of that fair thou ow’st,", "x/x/x/x/x/"],
        ["Nor shall Death brag thou wand’|rest in his shade,", "x/x/x/x/x/"],
        ["When in e|ter|nal lines to time thou grow’st.", "x/x/x/x/x/"],
        ["So long as men can breathe or eyes can see,", "x/x/x/x/x/"],
        ["So long lives this, and this gives life to thee.", "x/x/x/x/x/"],
      ],
    },
    {
      id: "s29",
      title: "Sonnet 29",
      kind: "sonnet",
      source: "Folger Shakespeare · Sonnet 29",
      memorizedLines: 0,
      lines: [
        "When in disgrace with fortune and men’s eyes,",
        "I all alone beweep my outcast state,",
        "And trouble deaf heaven with my bootless cries,",
        "And look upon myself and curse my fate,",
        "Wishing me like to one more rich in hope,",
        "Featured like him, like him with friends possessed,",
        "Desiring this man’s art and that man’s scope,",
        "With what I most enjoy contented least;",
        "Yet in these thoughts myself almost despising,",
        "Haply I think on thee, and then my state,",
        "Like to the lark at break of day arising",
        "From sullen earth, sings hymns at heaven’s gate;",
        "For thy sweet love remembered such wealth brings",
        "That then I scorn to change my state with kings.",
      ],
      meter: [
        ["When in dis|grace with for|tune and men’s eyes,", "x/x/x/x/x/"],
        ["I all a|lone be|weep my out|cast state,", "x/x/x/x/x/"],
        ["And trou|ble deaf heaven with my boot|less cries,", "x/x/x/x/x/"],
        ["And look u|pon my|self and curse my fate,", "x/x/x/x/x/"],
        ["Wish|ing me like to one more rich in hope,", "/xx/x/x/x/"],
        ["Fea|tured like him, like him with friends pos|sessed,", "/xx/x/x/x/"],
        ["De|sir|ing this man’s art and that man’s scope,", "x/x/x/x/x/"],
        ["With what I most en|joy con|tent|ed least;", "x/x/x/x/x/"],
        ["Yet in these thoughts my|self al|most de|spis|ing,", "x/x/x/x/x/x"],
        ["Hap|ly I think on thee, and then my state,", "/xx/x/x/x/"],
        ["Like to the lark at break of day a|ris|ing", "/xx/x/x/x/x"],
        ["From sul|len earth, sings hymns at heav|en’s gate;", "x/x/x/x/x/"],
        ["For thy sweet love re|mem|bered such wealth brings", "x/x/x/x/x/"],
        ["That then I scorn to change my state with kings.", "x/x/x/x/x/"],
      ],
    },
    {
      id: "s73",
      title: "Sonnet 73",
      kind: "sonnet",
      source: "Folger Shakespeare · Sonnet 73",
      memorizedLines: 0,
      lines: [
        "That time of year thou mayst in me behold",
        "When yellow leaves, or none, or few, do hang",
        "Upon those boughs which shake against the cold,",
        "Bare ruined choirs where late the sweet birds sang.",
        "In me thou see’st the twilight of such day",
        "As after sunset fadeth in the west,",
        "Which by and by black night doth take away,",
        "Death’s second self, that seals up all in rest.",
        "In me thou see’st the glowing of such fire",
        "That on the ashes of his youth doth lie,",
        "As the death-bed whereon it must expire,",
        "Consumed with that which it was nourished by.",
        "This thou perceiv’st, which makes thy love more strong,",
        "To love that well which thou must leave ere long.",
      ],
      meter: [
        ["That time of year thou mayst in me be|hold", "x/x/x/x/x/"],
        ["When yel|low leaves, or none, or few, do hang", "x/x/x/x/x/"],
        ["U|pon those boughs which shake a|gainst the cold,", "x/x/x/x/x/"],
        ["Bare ru|ined choirs where late the sweet birds sang.", "x/x/x/x/x/"],
        ["In me thou see’st the twi|light of such day", "x/x/x/x/x/"],
        ["As af|ter sun|set fad|eth in the west,", "x/x/x/x/x/"],
        ["Which by and by black night doth take a|way,", "x/x/x/x/x/"],
        ["Death’s sec|ond self, that seals up all in rest.", "x/x/x/x/x/"],
        ["In me thou see’st the glow|ing of such fire", "x/x/x/x/x/"],
        ["That on the ash|es of his youth doth lie,", "x/x/x/x/x/"],
        ["As the death-|bed where|on it must ex|pire,", "xx//x/x/x/"],
        ["Con|sumed with that which it was nour|ished by.", "x/x/x/x/x/"],
        ["This thou per|ceiv’st, which makes thy love more strong,", "x/x/x/x/x/"],
        ["To love that well which thou must leave ere long.", "x/x/x/x/x/"],
      ],
    },
    {
      id: "s116",
      title: "Sonnet 116",
      kind: "sonnet",
      source: "Folger Shakespeare · Sonnet 116",
      memorizedLines: 0,
      lines: [
        "Let me not to the marriage of true minds",
        "Admit impediments. Love is not love",
        "Which alters when it alteration finds",
        "Or bends with the remover to remove.",
        "O, no, it is an ever-fixèd mark",
        "That looks on tempests and is never shaken;",
        "It is the star to every wand’ring bark,",
        "Whose worth’s unknown, although his height be taken.",
        "Love’s not Time’s fool, though rosy lips and cheeks",
        "Within his bending sickle’s compass come;",
        "Love alters not with his brief hours and weeks,",
        "But bears it out even to the edge of doom.",
        "If this be error, and upon me proved,",
        "I never writ, nor no man ever loved.",
      ],
      meter: [
        ["Let me not to the mar|riage of true minds", "/x/xx/x/x/"],
        ["Ad|mit im|ped|i|ments. Love is not love", "x/x/x/x/x/"],
        ["Which al|ters when it al|ter|a|tion finds", "x/x/x/x/x/"],
        ["Or bends with the re|mov|er to re|move.", "x/x/x/x/x/"],
        ["O, no, it is an ev|er-|fix|èd mark", "x/x/x/x/x/"],
        ["That looks on tem|pests and is nev|er sha|ken;", "x/x/x/x/x/x"],
        ["It is the star to ev|ery wand’|ring bark,", "x/x/x/x/x/"],
        ["Whose worth’s un|known, al|though his height be ta|ken.", "x/x/x/x/x/x"],
        ["Love’s not Time’s fool, though ro|sy lips and cheeks", "/x//x/x/x/"],
        ["With|in his bend|ing sick|le’s com|pass come;", "x/x/x/x/x/"],
        ["Love al|ters not with his brief hours and weeks,", "x/x/x/x/x/"],
        ["But bears it out even to the edge of doom.", "x/x/x/x/x/"],
        ["If this be er|ror, and u|pon me proved,", "x/x/x/x/x/"],
        ["I nev|er writ, nor no man ev|er loved.", "x/x/x/x/x/"],
      ],
    },
    {
      id: "s130",
      title: "Sonnet 130",
      kind: "sonnet",
      source: "Folger Shakespeare · Sonnet 130",
      memorizedLines: 0,
      lines: [
        "My mistress’ eyes are nothing like the sun;",
        "Coral is far more red than her lips’ red;",
        "If snow be white, why then her breasts are dun;",
        "If hairs be wires, black wires grow on her head.",
        "I have seen roses damasked, red and white,",
        "But no such roses see I in her cheeks;",
        "And in some perfumes is there more delight",
        "Than in the breath that from my mistress reeks.",
        "I love to hear her speak, yet well I know",
        "That music hath a far more pleasing sound.",
        "I grant I never saw a goddess go;",
        "My mistress, when she walks, treads on the ground.",
        "And yet, by heaven, I think my love as rare",
        "As any she belied with false compare.",
      ],
      meter: [
        ["My mis|tress’ eyes are noth|ing like the sun;", "x/x/x/x/x/"],
        ["Cor|al is far more red than her lips’ red;", "/xx/x/x/x/"],
        ["If snow be white, why then her breasts are dun;", "x/x/x/x/x/"],
        ["If hairs be wires, black wires grow on her head.", "x/x/x/x/x/"],
        ["I have seen ros|es dam|asked, red and white,", "x/x/x/x/x/"],
        ["But no such ros|es see I in her cheeks;", "x/x/x/x/x/"],
        ["And in some per|fumes is there more de|light", "x/x/x/x/x/"],
        ["Than in the breath that from my mis|tress reeks.", "x/x/x/x/x/"],
        ["I love to hear her speak, yet well I know", "x/x/x/x/x/"],
        ["That mu|sic hath a far more pleas|ing sound.", "x/x/x/x/x/"],
        ["I grant I nev|er saw a god|dess go;", "x/x/x/x/x/"],
        ["My mis|tress, when she walks, treads on the ground.", "x/x/x/x/x/"],
        ["And yet, by heaven, I think my love as rare", "x/x/x/x/x/"],
        ["As an|y she be|lied with false com|pare.", "x/x/x/x/x/"],
      ],
    },
    {
      id: "macbeth-5-5",
      title: "Macbeth 5.5: “Tomorrow and tomorrow and tomorrow”",
      kind: "speech",
      source: "Folger Shakespeare · Macbeth 5.5.20–31",
      firstLine: 20,
      memorizedLines: 0,
      lines: [
        "She should have died hereafter.",
        "There would have been a time for such a word.",
        "Tomorrow and tomorrow and tomorrow",
        "Creeps in this petty pace from day to day",
        "To the last syllable of recorded time,",
        "And all our yesterdays have lighted fools",
        "The way to dusty death. Out, out, brief candle!",
        "Life’s but a walking shadow, a poor player",
        "That struts and frets his hour upon the stage",
        "And then is heard no more. It is a tale",
        "Told by an idiot, full of sound and fury,",
        "Signifying nothing.",
      ],
      meter: [
        ["She should have died here|af|ter.", "x/x/x/x"],
        ["There would have been a time for such a word.", "x/x/x/x/x/"],
        ["To|mor|row and to|mor|row and to|mor|row", "x/x/x/x/x/x"],
        ["Creeps in this pet|ty pace from day to day", "/xx/x/x/x/"],
        ["To the last syl|la|ble of re|cord|ed time,", "xx//xxxx/x/"],
        ["And all our yes|ter|days have light|ed fools", "x/x/x/x/x/"],
        ["The way to dus|ty death. Out, out, brief can|dle!", "x/x/x/x/x/x"],
        ["Life’s but a walk|ing shad|ow, a poor play|er", "/xx/x/xx//x"],
        ["That struts and frets his hour u|pon the stage", "x/x/x/x/x/"],
        ["And then is heard no more. It is a tale", "x/x/x/x/x/"],
        ["Told by an id|iot, full of sound and fu|ry,", "/xx/x/x/x/x"],
        ["Sig|ni|fy|ing noth|ing.", "/x/x/x"],
      ],
    },
  ],
};
