/**
 * Everything the pages read. Numbers that can be worked out are worked out
 * here, so they can never disagree with each other. Placeholder entries are
 * left out of every count.
 */
import { program } from "./program";
import type { Module, Program, Session, Word } from "./types";
import { assertValid } from "./validate";

export const data: Program = assertValid(program);
export type { Module, Session, Word };

export const MODULE_IDS = data.modules.map((m) => m.id);

export const moduleLabel = (id: string) => id.toUpperCase();

/** Hours from the start of the road to the beginning of each module. */
export function moduleSpans() {
  let at = 0;
  return data.modules.map((m) => {
    const span = { module: m, from: at, to: at + m.hours, mid: at + m.hours / 2 };
    at += m.hours;
    return span;
  });
}

export function claudeUrlFor(m?: Module) {
  return m?.claudeUrl || data.config.claudeProjectUrl;
}

const wordKey = (w: Word) => w.id ?? `${w.term.toLowerCase()}|${(w.source ?? "").toLowerCase()}`;

export function realSessions(): Session[] {
  return data.modules.flatMap((m) => m.sessions).filter((s) => !s.placeholder);
}

export function progress() {
  const total = data.modules.reduce((s, m) => s + m.hours, 0);
  const done = data.modules.reduce((s, m) => s + m.hoursDone, 0);
  const sessions = realSessions();
  const words = new Map<string, Word>();
  for (const s of sessions) for (const w of s.newWords) if (!w.placeholder) words.set(wordKey(w), w);
  const sonnets = data.poems.filter((p) => p.kind === "sonnet");
  const memorized = sonnets.filter((p) => p.lines.length > 0 && p.memorizedLines === p.lines.length);
  const current =
    data.modules.find((m) => m.status === "current") ?? data.modules.find((m) => m.status !== "done") ?? null;
  return {
    totalHours: total,
    completedHours: done,
    remainingHours: total - done,
    currentModule: current,
    lessonsCompleted: sessions.length,
    vocabularyAcquired: words.size,
    sonnetsMemorized: memorized.length,
    sonnetsTotal: sonnets.length,
    ...data.record,
  };
}

/** A catchword is the first word of what comes next (punctuation dropped). */
export const catchwordOf = (title: string) => (title.split(/\s+/)[0] ?? title).replace(/[:،,؛;.]+$/u, "");

export const nextModule = (id: string) => {
  const i = data.modules.findIndex((m) => m.id === id);
  return i >= 0 ? data.modules[i + 1] : undefined;
};
