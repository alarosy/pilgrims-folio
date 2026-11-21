/**
 * Interface words in English and Arabic.
 * The Arabic is a careful draft and is marked for Ali's review: he is the
 * native speaker, and his wording wins.
 */
import { arDaysAfter, arHours, arWords, roman, useLang, type Lang } from "~/lib/lang";
import type { IconName } from "~/components/ornament/Icon";

const en = {
  siteTitle: "The Pilgrim’s Folio",
  skip: "Skip to the page",
  contents: "Contents",
  settings: "Settings",
  close: "Close",
  langLink: "العربية",
  langLinkLabel: "Read this page in Arabic",
  primaryNav: "Main sections",
  continueClaude: "Continue this lesson in Claude",
  newTab: "opens in a new tab",
  next: "Next",
  station: "Station",
  ofHours: (d: number, t: number) => `${d} of ${t} hours`,
  hoursN: (n: number) => `${n} ${n === 1 ? "hour" : "hours"}`,
  weekN: (n: number) => `Week ${roman(n)}`,
  none: "None recorded yet",
  phase4: "This room opens in Phase 4 of the build.",
  modulePhase4: "Objectives, concepts and the session log are added to station pages in Phase 4.",
  backToMap: "Back to the map",

  prologue: {
    eyebrow: "The Prologue",
    quote: "All the world’s a stage",
    quoteSource: "As You Like It, 2.7 · Jaques",
    quoteGloss: "",
    intro:
      "This is Ali’s folio: the account of one hundred hours with Shakespeare, from 21 November to the last day of December 2026, English first, with Arabic as a bridge. The lessons happen in the Claude Project; this book keeps the record and shows the road ahead.",
    hoursTitle: "The hours",
    hoursLeft: (n: number) => `${n} ${n === 1 ? "hour" : "hours"} still to go`,
    stationTitle: "The current station",
    todayTitle: "Today’s step",
    before: (n: number) => (n === 1 ? "The curtain rises tomorrow." : `The curtain rises in ${n} days.`),
    firstDay: (date: string) => `Day 1 of 41 is ${date}.`,
    dayOf: (d: number, t: number) => `Day ${d} of ${t}`,
    after: "The hundred hours are complete.",
    begin: (label: string, title: string) => `Begin ${label} · ${title}`,
    evenPace: (h: number) => `An even pace would reach ${h} hours by tonight.`,
    reckoning: "The Reckoning",
    reckoningSub: "An account of the journey so far, kept the way the Claude record keeps it.",
    rows: {
      totalHours: "Total hours",
      completedHours: "Hours completed",
      remainingHours: "Hours remaining",
      currentModule: "Current module",
      lessonsCompleted: "Lessons completed",
      vocabularyAcquired: "Vocabulary acquired",
      sonnetsMemorized: "Sonnets memorized",
      textsAnalysed: "Texts analysed",
      conceptsMastered: "Linguistic concepts mastered",
      assessments: "Assessment results",
      weaknesses: "Identified weaknesses",
      nextObjective: "Next learning objective",
    },
    words: (n: number) => `${n} ${n === 1 ? "word" : "words"}`,
    xOfY: (x: number, y: number) => `${x} of ${y}`,
    toMap: "The Pilgrim’s",
    toMapFull: "The Pilgrim’s Map",
    curtainSub: "being the account of one hundred hours with Shakespeare",
    curtainDates: "21 November – 31 December 2026",
    curtainHint: "Tap anywhere to raise the curtain",
  },

  map: {
    title: "The Pilgrim’s Map",
    intro:
      "Nine stations on a road one hundred hours long. Each station’s stretch of road is as long as its hours, so the road is a true measure of the journey.",
    youAreHere: (h: number) => `You are here: ${h} of 100 hours`,
    paceBefore: "The journey sets out on Saturday 21 November.",
    paceDuring: (h: number) => `An even pace would reach ${h} hours by tonight.`,
    paceAfter: "The road is walked to its end.",
    key: "Key",
    quill: "The quill: where you are",
    sun: "The sun: where an even pace would be today",
    weeks: "The six weeks",
    provisional: "Which stations fall in which week is provisional until the syllabus schedule is added.",
    stations: "Stations on the road",
    start: "Here the road begins",
    banner: "The Road of One Hundred Hours",
  },

  settingsSheet: {
    language: "Language",
    candle: "Read by candlelight",
    candleHint: "A dark theme on every page",
    motion: "Motion",
    motionSystem: "Follow my device",
    motionReduced: "Reduced",
    ink: "Ink trail behind the pointer",
    inkHint: "A faint trail of ink behind the mouse. Desktop only; off by default.",
    data: "Your saved data",
    dataHint:
      "Lexicon reviews, recite practice and these settings are kept in this browser only. Export them to keep a copy or to move them to another device.",
    export: "Export my data",
    import: "Import a backup file",
    importSummary: (w: number, r: number) =>
      `This file holds ${w} reviewed ${w === 1 ? "word" : "words"} and ${r} practice ${r === 1 ? "run" : "runs"}.`,
    replace: "Replace my data with this file",
    undo: "Undo",
    imported: "Imported. Your data now comes from the file.",
    restored: "Restored your data from before the import.",
    importError: "That file is not a Pilgrim’s Folio backup.",
  },

  catalogue: {
    title: "A Catalogue of the Rooms in this Folio",
    stations: "The stations",
  },

  colophon: {
    line: "Ali’s journey · 21 November – 31 December 2026",
    folger: "Shakespeare’s lines follow the Folger Shakespeare edition (CC BY-NC 3.0).",
    updated: (d: string) => `Last updated ${d}`,
  },
};

type Strings = typeof en;

const ar: Strings = {
  siteTitle: "مجلّد الرحلة",
  skip: "انتقل إلى محتوى الصفحة",
  contents: "المحتويات",
  settings: "الإعدادات",
  close: "إغلاق",
  langLink: "English",
  langLinkLabel: "اقرأ هذه الصفحة بالإنجليزية",
  primaryNav: "الأقسام الرئيسية",
  continueClaude: "أكمل هذا الدرس في Claude",
  newTab: "يُفتح في نافذة جديدة",
  next: "التالي",
  station: "المحطة",
  ofHours: (d, t) => `${d} من ${arHours(t)}`,
  hoursN: (n) => arHours(n),
  weekN: (n) => `الأسبوع ${n}`,
  none: "لم يُسجَّل شيء بعد",
  phase4: "تُفتح هذه الحجرة في المرحلة الرابعة من البناء.",
  modulePhase4: "تُضاف الأهداف والمفاهيم وسجلّ الجلسات إلى صفحات المحطات في المرحلة الرابعة.",
  backToMap: "العودة إلى الخريطة",

  prologue: {
    eyebrow: "الاستهلال",
    quote: "All the world’s a stage",
    quoteSource: "As You Like It · الفصل الثاني، المشهد السابع · على لسان Jaques",
    quoteGloss: "«العالم كلّه مسرح»",
    intro:
      "هذا مجلّد علي: سجلّ مئة ساعة مع شكسبير، من 21 نوفمبر حتى آخر يوم من ديسمبر 2026، الإنجليزية أولًا والعربية جسرٌ للفهم. تجري الدروس في مشروع Claude، وهذا المجلّد يحفظ السجلّ ويُري الطريق القادم.",
    hoursTitle: "الساعات",
    hoursLeft: (n) => `بقي ${arHours(n)}`,
    stationTitle: "المحطة الحالية",
    todayTitle: "خطوة اليوم",
    before: (n) => (n === 1 ? "يُرفع الستار غدًا." : `يُرفع الستار بعد ${arDaysAfter(n)}.`),
    firstDay: (date) => `اليوم الأول من 41 هو ${date}.`,
    dayOf: (d, t) => `اليوم ${d} من ${t}`,
    after: "اكتملت الساعات المئة.",
    begin: (label, title) => `ابدأ ${label} · ${title}`,
    evenPace: (h) => `بالسير المنتظم يبلغ الطريق ${arHours(h)} الليلة.`,
    reckoning: "كشف الحساب",
    reckoningSub: "كشف بالرحلة حتى الآن، كما يحفظه سجلّ Claude.",
    rows: {
      totalHours: "مجموع الساعات",
      completedHours: "الساعات المنجزة",
      remainingHours: "الساعات المتبقية",
      currentModule: "الوحدة الحالية",
      lessonsCompleted: "الدروس المكتملة",
      vocabularyAcquired: "المفردات المكتسبة",
      sonnetsMemorized: "السوناتات المحفوظة",
      textsAnalysed: "النصوص المحلَّلة",
      conceptsMastered: "المفاهيم اللسانية المتقنة",
      assessments: "نتائج التقييم",
      weaknesses: "مواطن الضعف المحدَّدة",
      nextObjective: "هدف التعلّم التالي",
    },
    words: (n) => arWords(n),
    xOfY: (x, y) => `${x} من ${y}`,
    toMap: "خريطة",
    toMapFull: "خريطة الرحلة",
    curtainSub: "سجلّ مئة ساعة مع شكسبير",
    curtainDates: "21 نوفمبر – 31 ديسمبر 2026",
    curtainHint: "المس أي مكان لرفع الستار",
  },

  map: {
    title: "خريطة الرحلة",
    intro:
      "تسع محطات على طريق طوله مئة ساعة. طول كل جزء من الطريق بقدر ساعات محطته، فالطريق مقياس صادق للرحلة.",
    youAreHere: (h) => `أنت هنا: ${h} من 100 ساعة`,
    paceBefore: "تنطلق الرحلة يوم السبت 21 نوفمبر.",
    paceDuring: (h) => `بالسير المنتظم يبلغ الطريق ${arHours(h)} الليلة.`,
    paceAfter: "قُطع الطريق حتى نهايته.",
    key: "مفتاح الخريطة",
    quill: "الريشة: موضعك الآن",
    sun: "الشمس: موضع السير المنتظم اليوم",
    weeks: "الأسابيع الستة",
    provisional: "توزيع المحطات على الأسابيع مؤقت حتى يُضاف جدول المنهج.",
    stations: "محطات الطريق",
    start: "هنا يبدأ الطريق",
    banner: "طريق المئة ساعة",
  },

  settingsSheet: {
    language: "اللغة",
    candle: "القراءة على ضوء الشمعة",
    candleHint: "مظهر داكن في كل الصفحات",
    motion: "الحركة",
    motionSystem: "حسب جهازي",
    motionReduced: "مخفّفة",
    ink: "أثر الحبر خلف المؤشر",
    inkHint: "أثر خفيف من الحبر خلف الفأرة. على الحاسوب فقط، ومطفأ افتراضيًا.",
    data: "بياناتك المحفوظة",
    dataHint:
      "مراجعات المعجم وتمارين التسميع وهذه الإعدادات محفوظة في هذا المتصفح فقط. صدّرها لتحتفظ بنسخة أو لتنقلها إلى جهاز آخر.",
    export: "تصدير بياناتي",
    import: "استيراد ملف نسخة احتياطية",
    importSummary: (w, r) => `يحوي هذا الملف: كلمات مُراجَعة ${w}، وتمارين تسميع ${r}.`,
    replace: "استبدل بياناتي بهذا الملف",
    undo: "تراجع",
    imported: "تمّ الاستيراد. بياناتك الآن من الملف.",
    restored: "أُعيدت بياناتك كما كانت قبل الاستيراد.",
    importError: "هذا الملف ليس نسخة احتياطية من مجلّد الرحلة.",
  },

  catalogue: {
    title: "فهرس حجرات هذا المجلّد",
    stations: "المحطات",
  },

  colophon: {
    line: "رحلة علي · 21 نوفمبر – 31 ديسمبر 2026",
    folger: "نصوص شكسبير وفق طبعة Folger Shakespeare ‏(CC BY-NC 3.0).",
    updated: (d) => `آخر تحديث ${d}`,
  },
};

export const STRINGS: Record<Lang, Strings> = { en, ar };

export function useT(): Strings {
  return STRINGS[useLang()];
}

/* ---------- The rooms of the Folio ---------- */

export type SectionKey =
  | "prologue"
  | "map"
  | "commonplace"
  | "lexicon"
  | "sonnets"
  | "macbeth"
  | "traditions"
  | "folio"
  | "journey";

export const SECTIONS: {
  key: SectionKey;
  path: string;
  icon: IconName;
  en: { name: string; short: string; blurb: string };
  ar: { name: string; short: string; blurb: string };
}[] = [
  {
    key: "prologue",
    path: "/",
    icon: "rose",
    en: { name: "The Prologue", short: "Today", blurb: "Where Ali is today, and the account of the journey so far." },
    ar: { name: "الاستهلال", short: "اليوم", blurb: "أين يقف علي اليوم، وكشف الرحلة حتى الآن." },
  },
  {
    key: "map",
    path: "/map",
    icon: "map",
    en: { name: "The Pilgrim’s Map", short: "Map", blurb: "Nine stations on a road one hundred hours long." },
    ar: { name: "خريطة الرحلة", short: "الخريطة", blurb: "تسع محطات على طريق طوله مئة ساعة." },
  },
  {
    key: "commonplace",
    path: "/commonplace",
    icon: "quill",
    en: { name: "The Commonplace Book", short: "Journal", blurb: "Ali’s own pages: reflections, lines that stayed, questions." },
    ar: { name: "دفتر المختارات", short: "الدفتر", blurb: "صفحات علي: تأملات، وأبيات علقت بالذهن، وأسئلة." },
  },
  {
    key: "lexicon",
    path: "/lexicon",
    icon: "book",
    en: { name: "The Lexicon", short: "Lexicon", blurb: "Every new word, with its line from Shakespeare, and a daily review." },
    ar: { name: "المعجم", short: "المعجم", blurb: "كل كلمة جديدة مع سطرها من شكسبير، ومراجعة يومية." },
  },
  {
    key: "sonnets",
    path: "/sonnets",
    icon: "scroll",
    en: { name: "The Sonnet Chamber", short: "Sonnets", blurb: "Five sonnets and one speech to learn by heart, line by line." },
    ar: { name: "حجرة السوناتات", short: "السوناتات", blurb: "خمس سوناتات وخطبة واحدة للحفظ، سطرًا سطرًا." },
  },
  {
    key: "macbeth",
    path: "/macbeth",
    icon: "dagger",
    en: { name: "The Scottish Play", short: "Macbeth", blurb: "Macbeth by candlelight: scenes, characters, themes, and thou and you." },
    ar: { name: "المسرحية الاسكتلندية", short: "ماكبث", blurb: "ماكبث على ضوء الشمعة: المشاهد والشخصيات والموضوعات." },
  },
  {
    key: "traditions",
    path: "/traditions",
    icon: "mask",
    en: { name: "Two Traditions", short: "Traditions", blurb: "English and Arabic side by side, every link honestly labelled." },
    ar: { name: "بين تراثين", short: "تراثان", blurb: "الإنجليزية والعربية جنبًا إلى جنب، وكل صلة موسومة بصدق." },
  },
  {
    key: "folio",
    path: "/folio",
    icon: "seal",
    en: { name: "The Final Folio", short: "Folio", blurb: "The five final works, bound as each one is finished." },
    ar: { name: "المجلّد الأخير", short: "المجلّد", blurb: "الأعمال الخمسة الأخيرة، تُجلَّد كلما اكتمل واحد منها." },
  },
  {
    key: "journey",
    path: "/journey",
    icon: "candle",
    en: { name: "The Journey", short: "Journey", blurb: "Why Ali is walking this road, in his own words." },
    ar: { name: "حكاية الرحلة", short: "الحكاية", blurb: "لماذا يسلك علي هذا الطريق، بكلماته هو." },
  },
];

export const sectionByPath = (base: string) =>
  SECTIONS.find((s) => (s.path === "/" ? base === "/" : base === s.path || base.startsWith(`${s.path}/`)));
