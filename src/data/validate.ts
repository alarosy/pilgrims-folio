import type { Program } from "./types";

/**
 * The rules program.ts must keep. They run every time the site is built:
 * an ERROR stops the build (so a wrong number never goes online); a WARNING
 * is printed but the build continues. Messages are written for Ali, in plain
 * English, and say which entry to look at.
 */

const EXPECTED = [
  ["m0", 10],
  ["m1", 8],
  ["m2", 14],
  ["m3", 14],
  ["m4", 24],
  ["m5", 10],
  ["m6", 8],
  ["m7", 7],
  ["m8", 5],
] as const;

const LABELS = new Set([
  "historical-influence",
  "shared-heritage",
  "comparative-interpretation",
  "similarity-without-proven-connection",
]);

const DATE = /^\d{4}-\d{2}-\d{2}$/;

export function check(p: Program): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Modules: exactly M0–M8 with the agreed hours, 100 in total.
  if (p.modules.length !== EXPECTED.length) {
    errors.push(`There should be 9 modules (M0 to M8), but program.ts has ${p.modules.length}.`);
  }
  EXPECTED.forEach(([id, hours], i) => {
    const m = p.modules[i];
    if (!m || m.id !== id) errors.push(`Module ${i + 1} should have id "${id}".`);
    else if (m.hours !== hours) errors.push(`${id.toUpperCase()} should be ${hours} hours, but says ${m.hours}.`);
  });
  const total = p.modules.reduce((s, m) => s + m.hours, 0);
  if (total !== 100) errors.push(`The modules add up to ${total} hours instead of 100.`);

  let current = 0;
  for (const m of p.modules) {
    const name = m.id.toUpperCase();
    if (m.hoursDone < 0 || m.hoursDone > m.hours)
      errors.push(`${name}: hoursDone is ${m.hoursDone}, but it must be between 0 and ${m.hours}.`);
    if (m.status === "done" && m.hoursDone !== m.hours)
      errors.push(`${name} is marked "done" but only ${m.hoursDone} of ${m.hours} hours are done.`);
    if (m.status === "locked" && m.hoursDone !== 0)
      errors.push(`${name} is "locked" but already has ${m.hoursDone} hours done. Mark it "current" or "done".`);
    if (m.status === "current") current++;

    const real = m.sessions.filter((s) => !s.placeholder);
    const sessionHours = real.reduce((s, x) => s + x.hours, 0);
    if (real.length && sessionHours !== m.hoursDone)
      warnings.push(`${name}: its sessions add up to ${sessionHours} hours, but hoursDone says ${m.hoursDone}.`);
    for (const s of m.sessions) {
      if (!DATE.test(s.date)) errors.push(`${name}, session "${s.id}": the date should look like 2026-11-21.`);
      if (s.module !== m.id) warnings.push(`Session "${s.id}" sits in ${name} but says module "${s.module}".`);
    }
  }
  if (current > 1) errors.push(`${current} modules are marked "current". Only one can be.`);

  // Texts to memorize
  for (const poem of p.poems) {
    if (poem.memorizedLines < 0 || poem.memorizedLines > Math.max(poem.lines.length, 0))
      errors.push(`${poem.title}: memorizedLines is ${poem.memorizedLines}, but the text has ${poem.lines.length} lines.`);
    if (poem.meter) {
      if (poem.meter.length !== poem.lines.length)
        errors.push(`${poem.title}: the meter has ${poem.meter.length} lines but the text has ${poem.lines.length}.`);
      poem.meter.forEach(([split, stress], i) => {
        const n = split.split(/[\s|]+/).filter(Boolean).length;
        if (split.replace(/\|/g, "") !== poem.lines[i])
          errors.push(`${poem.title}, line ${i + 1}: the meter's words don't match the text.`);
        if (n !== stress.length || /[^x/]/.test(stress))
          errors.push(`${poem.title}, line ${i + 1}: ${n} syllables but ${stress.length} stress marks.`);
      });
    }
  }

  // Two Traditions: the honesty rule
  for (const c of p.comparisons) {
    if (!LABELS.has(c.label)) errors.push(`Comparison "${c.id}" needs one of the four labels.`);
  }

  // The same id twice usually means a snippet was pasted twice.
  const twice = (what: string, ids: string[]) => {
    const seen = new Set<string>();
    for (const id of ids) {
      if (seen.has(id)) errors.push(`${what} "${id}" appears twice. If a snippet was pasted twice, delete one copy.`);
      seen.add(id);
    }
  };
  twice("Session", p.modules.flatMap((m) => m.sessions.map((s) => s.id)));
  twice("Journal entry", p.journal.map((j) => j.id));
  twice("Comparison", p.comparisons.map((c) => c.id));

  // The Scottish Play: the log names characters by their id in the cast list.
  const cast = new Set(p.macbeth.characters.map((c) => c.id));
  for (const e of p.macbeth.thouYouLog) {
    for (const who of [e.speaker, e.addressee]) {
      if (!cast.has(who)) errors.push(`Thou/you log, ${e.ref}: "${who}" is not in the cast list (use an id such as "lady-macbeth").`);
    }
  }
  const SCENE = new Set(["unread", "read", "studied"]);
  for (const s of p.macbeth.scenes) {
    if (!SCENE.has(s.status)) errors.push(`Macbeth ${s.act}.${s.scene}: status should be "unread", "read" or "studied".`);
  }

  // Dates
  for (const w of p.weeks) {
    if (!DATE.test(w.start) || !DATE.test(w.end)) errors.push(`Week ${w.id}: dates should look like 2026-11-21.`);
  }

  // Placeholders still present
  const placeholders =
    p.modules.flatMap((m) => m.sessions).filter((s) => s.placeholder).length +
    p.journal.filter((j) => j.placeholder).length +
    p.comparisons.filter((c) => c.placeholder).length;
  if (placeholders) warnings.push(`${placeholders} example entries are still in program.ts (shown with a "Specimen" stamp).`);

  return { errors, warnings };
}

/** Throws (stopping the build) if program.ts breaks a rule. */
export function assertValid(p: Program): Program {
  const { errors, warnings } = check(p);
  const onServer = typeof window === "undefined";
  if (onServer && warnings.length) {
    console.warn(`\nprogram.ts — ${warnings.length} note(s):\n  • ${warnings.join("\n  • ")}\n`);
  }
  if (errors.length) {
    throw new Error(`program.ts needs fixing before the site can be built:\n  • ${errors.join("\n  • ")}\n`);
  }
  return p;
}
