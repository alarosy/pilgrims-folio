import { useSyncExternalStore } from "react";

/**
 * What the site remembers in this browser: settings, Lexicon review
 * schedule, recite practice, seals already seen. One versioned record under
 * one key. Storage can be blocked (private windows, cleared site data), so
 * every access is guarded and the site falls back to memory.
 */

export const STORAGE_KEY = "pilgrims-folio:v1";

export type Settings = {
  candlelight: boolean;
  motion: "system" | "reduced";
  inkTrail: boolean;
  lang?: "en" | "ar";
};
export type SrsCard = { due: string; interval: number; ease: number; reps: number; lapses: number };
export type ReciteRun = { date: string; known: number; total: number };

export type Saved = {
  version: 1;
  settings: Settings;
  srs: Record<string, SrsCard>;
  recite: Record<string, ReciteRun[]>;
  seenSeals: string[];
};

export const DEFAULT_SAVED: Saved = {
  version: 1,
  settings: { candlelight: false, motion: "system", inkTrail: false },
  srs: {},
  recite: {},
  seenSeals: [],
};

const isObj = (x: unknown): x is Record<string, unknown> => typeof x === "object" && x !== null && !Array.isArray(x);
const isDay = (x: unknown): x is string => typeof x === "string" && /^\d{4}-\d{2}-\d{2}$/.test(x);
const isNum = (x: unknown): x is number => typeof x === "number" && Number.isFinite(x);

const isCard = (c: unknown): c is SrsCard =>
  isObj(c) && isDay(c.due) && isNum(c.interval) && isNum(c.ease) && isNum(c.reps) && isNum(c.lapses);
const isRun = (r: unknown): r is ReciteRun => isObj(r) && isDay(r.date) && isNum(r.known) && isNum(r.total);

/** Keep the entries of a record whose values pass the test (a damaged backup loses only its damaged parts). */
function keep<T>(x: unknown, ok: (v: unknown) => v is T): Record<string, T> {
  if (!isObj(x)) return {};
  return Object.fromEntries(Object.entries(x).filter((e): e is [string, T] => ok(e[1])));
}

/** Accept only what we recognise; fill anything missing with defaults. */
export function normalize(x: unknown): Saved | null {
  if (!isObj(x) || x.version !== 1) return null;
  const s = isObj(x.settings) ? x.settings : {};
  const recite = keep(x.recite, (v): v is ReciteRun[] => Array.isArray(v));
  return {
    version: 1,
    settings: {
      candlelight: s.candlelight === true,
      motion: s.motion === "reduced" ? "reduced" : "system",
      inkTrail: s.inkTrail === true,
      lang: s.lang === "ar" || s.lang === "en" ? s.lang : undefined,
    },
    srs: keep(x.srs, isCard),
    recite: Object.fromEntries(
      Object.entries(recite)
        .map(([id, runs]) => [id, runs.filter(isRun)] as const)
        .filter(([, runs]) => runs.length > 0),
    ),
    seenSeals: Array.isArray(x.seenSeals) ? x.seenSeals.filter((v): v is string => typeof v === "string") : [],
  };
}

let cache: Saved | null = null;
const listeners = new Set<() => void>();

function read(): Saved {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    cache = (raw && normalize(JSON.parse(raw))) || DEFAULT_SAVED;
  } catch {
    cache = DEFAULT_SAVED;
  }
  return cache;
}

function write(next: Saved) {
  cache = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* storage blocked: keep it in memory for this visit */
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      cache = null;
      cb();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

/**
 * The record as it is right now. Use this inside effects: while the page is
 * hydrating, useSaved() still returns the empty default the page was built with.
 */
export const readSaved = (): Saved => read();

export function useSaved(): Saved {
  return useSyncExternalStore(subscribe, read, () => DEFAULT_SAVED);
}

export function updateSaved(fn: (s: Saved) => Saved) {
  write(fn(read()));
}

export function updateSettings(patch: Partial<Settings>) {
  updateSaved((s) => ({ ...s, settings: { ...s.settings, ...patch } }));
}

/* ---------- Export / Import ---------- */

export function exportText(): string {
  return JSON.stringify({ app: "pilgrims-folio", exportedAt: new Date().toISOString(), data: read() }, null, 2);
}

export function downloadExport() {
  const blob = new Blob([exportText()], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `pilgrims-folio-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export type ImportCheck =
  | { ok: true; data: Saved; words: number; runs: number; exportedAt?: string }
  | { ok: false };

export function checkImport(text: string): ImportCheck {
  try {
    const parsed = JSON.parse(text) as unknown;
    if (!isObj(parsed) || parsed.app !== "pilgrims-folio") return { ok: false };
    const d = normalize(parsed.data);
    if (!d) return { ok: false };
    const runs = Object.values(d.recite).reduce((n, list) => n + (Array.isArray(list) ? list.length : 0), 0);
    return {
      ok: true,
      data: d,
      words: Object.keys(d.srs).length,
      runs,
      exportedAt: typeof parsed.exportedAt === "string" && !Number.isNaN(Date.parse(parsed.exportedAt)) ? parsed.exportedAt : undefined,
    };
  } catch {
    return { ok: false };
  }
}

/** Replace everything; returns the previous record so the change can be undone. */
export function replaceSaved(next: Saved): Saved {
  const before = read();
  write(next);
  return before;
}
