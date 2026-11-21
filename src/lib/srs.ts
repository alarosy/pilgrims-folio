/**
 * Spaced repetition for the Lexicon: a small SM-2 variant with the four
 * familiar grades. "Again" brings the card back in the same session; the
 * others push it further away, and "easy" furthest. Dates are local days.
 */
import { data } from "~/data";
import type { Word } from "~/data/types";
import type { SrsCard } from "./storage";

export type Grade = "again" | "hard" | "good" | "easy";
export const GRADES: Grade[] = ["again", "hard", "good", "easy"];
export const NEW_PER_DAY = 12;

const pad = (n: number) => String(n).padStart(2, "0");
export const isoDay = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const todayISO = () => isoDay(new Date());
export function addDays(iso: string, n: number) {
  const [y, m, d] = iso.split("-").map(Number) as [number, number, number];
  return isoDay(new Date(y, m - 1, d + n));
}

export function schedule(card: SrsCard | undefined, grade: Grade, today: string): SrsCard {
  const c = card ?? { due: today, interval: 0, ease: 2.5, reps: 0, lapses: 0 };
  if (grade === "again") {
    return { due: today, interval: 0, ease: Math.max(1.3, c.ease - 0.2), reps: 0, lapses: c.lapses + 1 };
  }
  let interval: number;
  if (c.reps === 0) interval = grade === "easy" ? 4 : 1;
  else if (c.reps === 1) interval = grade === "hard" ? 2 : grade === "good" ? 3 : 6;
  else interval = Math.max(c.interval + 1, Math.round(c.interval * (grade === "hard" ? 1.2 : grade === "good" ? c.ease : c.ease * 1.3)));
  const ease = grade === "hard" ? Math.max(1.3, c.ease - 0.15) : grade === "easy" ? c.ease + 0.15 : c.ease;
  return { due: addDays(today, interval), interval, ease, reps: c.reps + 1, lapses: c.lapses };
}

/** How many days until the card comes back, for the label under each grade. */
export const daysFor = (card: SrsCard | undefined, grade: Grade, today: string) =>
  grade === "again" ? 0 : schedule(card, grade, today).interval;

/* ---------- The words ---------- */

export type LexEntry = { key: string; word: Word; module: string; date: string; placeholder: boolean };

export const wordKey = (w: Word) => w.id ?? `${w.term.toLowerCase()}|${(w.source ?? "").toLowerCase()}`;

/** Every word from every session, newest session last; real words win over duplicates. */
export function allWords(): LexEntry[] {
  const map = new Map<string, LexEntry>();
  for (const m of data.modules) {
    for (const s of m.sessions) {
      for (const w of s.newWords) {
        const key = wordKey(w);
        const placeholder = Boolean(s.placeholder || w.placeholder);
        const prev = map.get(key);
        if (!prev || (prev.placeholder && !placeholder)) map.set(key, { key, word: w, module: m.id, date: s.date, placeholder });
      }
    }
  }
  return [...map.values()].sort((a, b) => a.word.term.localeCompare(b.word.term));
}

/** Today's queue: everything due, then up to NEW_PER_DAY words never reviewed. */
export function dueQueue(entries: LexEntry[], srs: Record<string, SrsCard>, today: string) {
  const due = entries.filter((e) => srs[e.key] && srs[e.key]!.due <= today);
  const fresh = entries.filter((e) => !srs[e.key]).slice(0, NEW_PER_DAY);
  return [...due, ...fresh];
}
