/**
 * The shape of everything in program.ts.
 * Ali never needs to edit this file; it is what makes a typing mistake in
 * program.ts show up as a clear error instead of a broken page.
 */

export type Status = "locked" | "current" | "done";

/** Mark anything that is only a placeholder with `placeholder: true`.
 *  The site shows it with a "Specimen" stamp and leaves it out of every count.
 *  (Not called "example", because a Word already has an `example` sentence.) */
type Example = { placeholder?: true };

export interface Config {
  /** Where every "Continue this lesson in Claude" button goes, unless a module sets its own. */
  claudeProjectUrl: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  /** The date of the last update, shown in the footer. */
  updated: string; // YYYY-MM-DD
}

export interface Week {
  id: "W1" | "W2" | "W3" | "W4" | "W5" | "W6";
  start: string;
  end: string;
  /** Which modules this week covers (provisional until the syllabus schedule is added). */
  moduleIds: string[];
}

export interface Word extends Example {
  term: string;
  meaning: string;
  example: string;
  arabicNote?: string;
  /** Play or sonnet and line, e.g. "Sonnet 18, line 2". */
  source?: string;
  /** The line from Shakespeare where the word appears (shown on the card's front). */
  line?: string;
  id?: string;
}

export interface Session extends Example {
  id: string;
  date: string;
  module: string;
  hours: number;
  title: string;
  summary: string;
  newWords: Word[];
  reflection?: string;
}

export interface Module {
  id: string; // "m0" … "m8"
  title: string;
  titleAr?: string;
  hours: number;
  hoursDone: number;
  status: Status;
  objectives: string[];
  concepts: string[];
  sessions: Session[];
  /** A Claude chat just for this module (optional). */
  claudeUrl?: string;
}

export interface Poem {
  id: string;
  title: string;
  kind: "sonnet" | "speech";
  /** Reference edition and location, e.g. "Folger Shakespeare · Sonnet 18". */
  source: string;
  /** The line number of the first line in its play or sonnet (for line labels). */
  firstLine?: number;
  lines: string[];
  /**
   * One entry per line: [syllables, stresses]. Syllables are split by spaces
   * (between words) and | (inside words); stresses are x (light) and / (strong),
   * one per syllable. A standard reading — scansion is interpretive.
   */
  meter?: [string, string][];
  memorizedLines: number;
  recordingUrl?: string;
}

export interface JournalEntry extends Example {
  id: string;
  date: string;
  title: string;
  body: string;
  mood?: string;
  lang?: "en" | "ar";
}

export type ComparisonLabel =
  | "historical-influence"
  | "shared-heritage"
  | "comparative-interpretation"
  | "similarity-without-proven-connection";

export interface Comparison extends Example {
  id: string;
  /** Required. The build stops if a card has no label. */
  label: ComparisonLabel;
  en: { title: string; body: string };
  ar: { title: string; body: string };
  sources: string[];
}

export interface Assessment {
  date: string;
  title: string;
  result: string;
  notes?: string;
}

/** The parts of the Claude progress record that cannot be computed from the rest. */
export interface ProgressRecord {
  textsAnalysed: string[];
  conceptsMastered: string[];
  assessments: Assessment[];
  weaknesses: string[];
  nextObjective: string;
}

export interface FinalWork {
  id: string;
  title: string;
  titleAr?: string;
  status: "not-started" | "in-progress" | "done";
  date?: string;
  link?: string;
}

export type Theme = "blood" | "sleep" | "darkness" | "fate";

export interface MacbethData {
  /** status: "unread" | "read" | "studied" */
  scenes: { act: number; scene: number; note: string; status: "unread" | "read" | "studied" }[];
  characters: { id: string; name: string; description?: string; group?: "macbeths" | "court" | "nobles" | "banquo" | "macduffs" | "witches" | "english" }[];
  /** kind: a short phrase read as "from … to", e.g. "is married to", "murders". */
  relations: { from: string; to: string; kind: string; act?: number }[];
  threads: { theme: Theme; refs: ({ ref: string; quote: string; note?: string } & Example)[] }[];
  thouYouLog: ({ ref: string; speaker: string; addressee: string; form: "thou" | "you"; quote?: string; note?: string } & Example)[];
}

export interface Program {
  config: Config;
  weeks: Week[];
  modules: Module[];
  poems: Poem[];
  journal: JournalEntry[];
  comparisons: Comparison[];
  record: ProgressRecord;
  finalWorks: FinalWork[];
  macbeth: MacbethData;
  journey: { story: string; storyAr?: string };
}
